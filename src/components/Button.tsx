import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { fonts, fontSizes, radii, spacing, useTheme } from '@/theme';
import { SPRING, useMotionEnabled } from './motion';
import { AppText } from './AppText';

export type ButtonVariant = 'primary' | 'soft' | 'ghost';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Botão que "afunda" ao tocar (mola). Com "reduzir movimento", só escurece levemente. */
export function Button({ label, onPress, variant = 'primary', disabled = false, style }: ButtonProps) {
  const { colors } = useTheme();
  const motion = useMotionEnabled();
  const pressed = useSharedValue(0);

  const animated = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - 0.06 * pressed.value }, { translateY: 2 * pressed.value }],
    opacity: motion ? 1 : 1 - 0.15 * pressed.value,
  }));

  const palette = {
    primary: { bg: colors.primary, fg: colors.onPrimary, border: 'transparent' },
    soft: { bg: colors.lilacSoft, fg: colors.ink, border: 'transparent' },
    ghost: { bg: 'transparent', fg: colors.muted, border: colors.line },
  }[variant];

  const setPressed = (to: 0 | 1) => {
    pressed.value = motion ? withSpring(to, SPRING) : to;
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => setPressed(1)}
      onPressOut={() => setPressed(0)}
    >
      <Animated.View
        style={[
          styles.button,
          { backgroundColor: palette.bg, borderColor: palette.border, opacity: disabled ? 0.45 : 1 },
          animated,
          style,
        ]}
      >
        <AppText style={{ fontFamily: fonts.bold, fontSize: fontSizes.body, color: palette.fg }}>{label}</AppText>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
