import type { ComponentProps, ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { radii, spacing, useTheme } from '@/theme';
import { EASE_OUT, ReduceMotion, STAGGER_MS } from './motion';

export type CardTone = 'plain' | 'pink' | 'lilac' | 'sky';

interface CardProps {
  children: ReactNode;
  tone?: CardTone;
  /** Posição numa lista: cada cartão entra um pouco depois do anterior. Omita para não animar. */
  enterIndex?: number;
  style?: StyleProp<ViewStyle>;
  /** Transição de layout: quando o cartão muda de tamanho ou posição, anima em vez de pular. */
  layout?: ComponentProps<typeof Animated.View>['layout'];
}

/** Cartão arredondado com sombra suave; entra deslizando de leve quando recebe `enterIndex`. */
export function Card({ children, tone = 'plain', enterIndex, layout, style }: CardProps) {
  const { colors } = useTheme();
  const background = {
    plain: colors.surface,
    pink: colors.primarySoft,
    lilac: colors.lilacSoft,
    sky: colors.skySoft,
  }[tone];

  const entering =
    enterIndex === undefined
      ? undefined
      : FadeInDown.delay(enterIndex * STAGGER_MS)
          .duration(420)
          .easing(EASE_OUT)
          .reduceMotion(ReduceMotion.System);

  // Entrada e transição de layout ficam no nó externo; o visual (inclusive `opacity`) no interno.
  // No mesmo nó, o Reanimated avisa que a opacity pode ser sobrescrita pela animação de layout.
  return (
    <Animated.View entering={entering} layout={layout}>
      <View style={[styles.card, { backgroundColor: background, shadowColor: colors.shadow }, style]}>{children}</View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.md,
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
});
