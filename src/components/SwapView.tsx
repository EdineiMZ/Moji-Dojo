import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeInRight } from 'react-native-reanimated';
import { EASE_OUT, ReduceMotion } from './motion';

interface SwapViewProps {
  /** Quando a chave muda, o conteúdo antigo sai e o novo entra com animação. */
  viewKey: string | number;
  children: ReactNode;
  /** "fade": aparece suavemente (sub-abas). "slide": entra pela direita (perguntas, passos). */
  kind?: 'fade' | 'slide';
  style?: StyleProp<ViewStyle>;
}

/**
 * Troca de conteúdo suave: dê uma `viewKey` diferente a cada tela/pergunta/passo e o conteúdo novo
 * entra animado em vez de aparecer de repente. Respeita "reduzir movimento".
 */
export function SwapView({ viewKey, children, kind = 'fade', style }: SwapViewProps) {
  const entering =
    kind === 'slide'
      ? FadeInRight.duration(340).easing(EASE_OUT).reduceMotion(ReduceMotion.System)
      : FadeIn.duration(280).easing(EASE_OUT).reduceMotion(ReduceMotion.System);
  return (
    <Animated.View key={viewKey} entering={entering} style={style}>
      {children}
    </Animated.View>
  );
}
