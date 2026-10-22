import { hapticError, hapticLight, hapticSuccess } from './haptics';
import { playSfx } from './sfx';

/**
 * Feedback do app: cada situação combina vibração e som. Os dois respeitam seus interruptores em
 * Ajustes, então quem desliga um continua com o outro.
 */
export const feedbackCorrect = (): void => {
  hapticSuccess();
  playSfx('correct');
};

export const feedbackWrong = (): void => {
  hapticError();
  playSfx('wrong');
};

/** Lição, revisão ou treino concluídos; `perfect` (100%) usa a comemoração maior. */
export const feedbackComplete = (perfect: boolean): void => {
  hapticSuccess();
  playSfx(perfect ? 'perfect' : 'complete');
};

/** Toque de tecla (simulador de teclado). */
export const feedbackTap = (): void => {
  hapticLight();
  playSfx('tap');
};
