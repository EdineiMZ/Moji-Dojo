import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { feedbackTap } from '@/lib/feedback';
import { fonts, fontSizes, radii, spacing, useTheme } from '@/theme';
import { SPRING, useMotionEnabled } from './motion';
import { AppText } from './AppText';

export type ButtonVariant = 'primary' | 'soft' | 'ghost';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  /** Sem som nem vibração de toque: para botões cujo resultado já tem o próprio feedback (acerto/erro). */
  silent?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Botão que "afunda" de leve ao tocar (mola) e faz um toquinho de som e vibração. Com "reduzir movimento", só escurece levemente. */
export function Button({ label, onPress, variant = 'primary', disabled = false, silent = false, style }: ButtonProps) {
  const { colors } = useTheme();
  const motion = useMotionEnabled();
  const pressed = useSharedValue(0);

  const animated = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - 0.03 * pressed.value }, { translateY: 1.5 * pressed.value }],
    opacity: motion ? 1 : 1 - 0.15 * pressed.value,
  }));

  // O Pressable é quem entra na fileira ou na coluna: flex, largura e alinhamento têm de ir nele, senão botões lado a lado
  // não dividem a largura e estouram a tela.
  const { flex, flexGrow, flexShrink, flexBasis, alignSelf, width, minWidth, maxWidth, ...visual } = StyleSheet.flatten(style) ?? {};
  const layout: ViewStyle = { flex, flexGrow, flexShrink, flexBasis, alignSelf, width, minWidth, maxWidth };

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
      onPress={() => {
        if (!silent) feedbackTap();
        onPress?.();
      }}
      onPressIn={() => setPressed(1)}
      onPressOut={() => setPressed(0)}
      style={layout}
    >
      <Animated.View
        style={[
          styles.button,
          { backgroundColor: palette.bg, borderColor: palette.border, opacity: disabled ? 0.45 : 1 },
          animated,
          visual,
        ]}
      >
        <AppText center style={{ fontFamily: fonts.bold, fontSize: fontSizes.body, color: palette.fg }}>
          {label}
        </AppText>
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
