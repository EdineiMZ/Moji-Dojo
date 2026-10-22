import { shuffle, type Rng } from '@/features/quiz/quiz';
import type { SrsState } from './srs';

/** Quantos caracteres tem uma "Revisão extra". */
export const EXTRA_REVIEW_SIZE = 15;

/**
 * Revisão extra: treina os caracteres mais fracos (caixas mais baixas) mesmo sem estarem vencidos.
 * Sorteia primeiro, para que o desempate entre caixas iguais varie a cada vez.
 */
export function pickExtraReviewChars(
  srs: SrsState,
  isKnown: (char: string) => boolean = () => true,
  rng: Rng = Math.random,
  count: number = EXTRA_REVIEW_SIZE,
): string[] {
  const learned = Object.keys(srs).filter(isKnown);
  return shuffle(learned, rng)
    .sort((a, b) => (srs[a]?.b ?? 0) - (srs[b]?.b ?? 0))
    .slice(0, count);
}

export const reviewTitle = (extra: boolean): string => (extra ? 'Revisão extra' : 'Revisão do dia');

export const reviewIntro = (extra: boolean): string =>
  extra
    ? 'Treino extra com os caracteres mais fracos. Não adianta as revisões, só reforça.'
    : 'Caracteres de várias lições, misturados. Acertou de primeira: ele só volta daqui a alguns dias. Errou: volta amanhã.';

/** A revisão "passa" (cor verde e comemoração) com 80% ou mais de acerto na primeira tentativa. */
export const REVIEW_GOOD_PCT = 80;
