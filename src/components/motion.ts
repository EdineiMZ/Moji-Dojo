import { Easing, ReduceMotion, useReducedMotion } from 'react-native-reanimated';

/**
 * Animações do app respeitam "reduzir movimento" do sistema.
 * `useMotionEnabled` serve para animações feitas à mão; as de layout
 * (FadeIn, ZoomIn...) usam `.reduceMotion(ReduceMotion.System)`.
 */
export const useMotionEnabled = (): boolean => !useReducedMotion();

export { ReduceMotion };

/** Mola bem amortecida: chega ao destino com suavidade, sem quicar. Padrão dos botões e do seletor. */
export const SPRING = { damping: 24, stiffness: 200, mass: 1 } as const;

export const EASE_OUT = Easing.out(Easing.cubic);

/** Atraso entre cartões que entram em sequência. */
export const STAGGER_MS = 60;
