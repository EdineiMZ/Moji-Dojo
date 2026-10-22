import { Easing, ReduceMotion, useReducedMotion } from 'react-native-reanimated';

/**
 * Animações do app respeitam "reduzir movimento" do sistema.
 * `useMotionEnabled` serve para animações feitas à mão; as de layout
 * (FadeIn, ZoomIn...) usam `.reduceMotion(ReduceMotion.System)`.
 */
export const useMotionEnabled = (): boolean => !useReducedMotion();

export { ReduceMotion };

/** Mola suave e um pouco saltitante, padrão dos botões e cartões. */
export const SPRING = { damping: 14, stiffness: 190, mass: 0.8 } as const;

export const EASE_OUT = Easing.out(Easing.cubic);

/** Atraso entre cartões que entram em sequência. */
export const STAGGER_MS = 70;
