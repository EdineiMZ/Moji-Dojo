import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { AppText, SPRING, useMotionEnabled } from '@/components';
import { fonts, radii, spacing, useTheme } from '@/theme';

export type OptionState = 'idle' | 'right' | 'wrong' | 'dim';

interface OptionButtonProps {
  /** Posição, para o número 1 a 4 ao lado. */
  index: number;
  label: string;
  /** A alternativa é um caractere japonês (fonte maior). */
  glyph: boolean;
  state: OptionState;
  onPress: () => void;
}

/** Alternativa do quiz: afunda ao tocar e fica verde/vermelha depois da resposta. */
export function OptionButton({ index, label, glyph, state, onPress }: OptionButtonProps) {
  const { colors } = useTheme();
  const motion = useMotionEnabled();
  const pressed = useSharedValue(0);

  const animated = useAnimatedStyle(() => ({ transform: [{ scale: 1 - 0.05 * pressed.value }] }));
  const setPressed = (to: 0 | 1) => {
    pressed.value = motion ? withSpring(to, SPRING) : to;
  };

  // 0 = neutra (também a esmaecida), 1 = certa, 2 = errada: as cores deslizam entre elas.
  const colorStep = { idle: 0, right: 1, wrong: 2, dim: 0 }[state];
  const color = useSharedValue(colorStep);
  useEffect(() => {
    color.value = motion ? withTiming(colorStep, { duration: 220 }) : colorStep;
  }, [colorStep, motion, color]);

  const tint = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(color.value, [0, 1, 2], [colors.surface, colors.okSoft, colors.badSoft]),
    borderColor: interpolateColor(color.value, [0, 1, 2], [colors.line, colors.ok, colors.bad]),
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: state !== 'idle' }}
      disabled={state !== 'idle'}
      onPress={onPress}
      onPressIn={() => setPressed(1)}
      onPressOut={() => setPressed(0)}
    >
      <Animated.View
        style={[
          styles.option,
          { opacity: state === 'dim' ? 0.5 : 1 },
          tint,
          animated,
        ]}
      >
        <View style={[styles.number, { backgroundColor: colors.background }]}>
          <AppText variant="caption" color="muted">
            {index + 1}
          </AppText>
        </View>
        <AppText
          style={{ fontFamily: fonts.bold, fontSize: glyph ? 30 : 18, lineHeight: glyph ? 38 : 24 }}
          color={state === 'right' ? 'ok' : state === 'wrong' ? 'bad' : 'ink'}
        >
          {label}
        </AppText>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    minHeight: 60,
    borderRadius: radii.lg,
    borderWidth: 2,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  number: { width: 26, height: 26, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center' },
});
