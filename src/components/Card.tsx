import type { ComponentProps, ReactNode } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { radii, spacing, useTheme } from '@/theme';
import { ReduceMotion, STAGGER_MS } from './motion';

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

/** Cartão arredondado com sombra suave; entra com mola quando recebe `enterIndex`. */
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
          .springify()
          .damping(14)
          .reduceMotion(ReduceMotion.System);

  return (
    <Animated.View
      entering={entering}
      layout={layout}
      style={[styles.card, { backgroundColor: background, shadowColor: colors.shadow }, style]}
    >
      {children}
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
