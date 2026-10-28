/**
 * FSRS (Free Spaced Repetition Scheduler), versão 5, com os pesos padrão. Cada cartão tem estabilidade (S: dias até a chance de
 * lembrar cair a 90%) e dificuldade (D, de 1 a 10). Tudo aqui é puro: o relógio sempre vem de fora.
 *
 * Os pesos são os padrão do algoritmo, ainda sem ajuste aos dados de quem usa o app. O ajuste exige um registro de cada revisão
 * (data, resposta e tempo desde a anterior), que o app ainda não guarda.
 */
export const DAY_MS = 86_400_000;

/** Nota de uma resposta: 1 errou, 2 acertou com dificuldade (depois de errar na mesma sessão), 3 acertou, 4 muito fácil. */
export type Grade = 1 | 2 | 3 | 4;

export const W = [0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046, 1.54575, 0.1192, 1.01925, 1.9395, 0.11, 0.29605, 2.2698, 0.2315, 2.9898, 0.51655, 0.6621] as const;

const DECAY = -0.5;
const FACTOR = 19 / 81;

/** Chance de lembrar depois de `days` dias, para uma estabilidade `s`. */
export const retrievability = (days: number, s: number): number => (1 + (FACTOR * Math.max(0, days)) / Math.max(s, 0.01)) ** DECAY;

/** Dias até a chance de lembrar cair a `retention` (padrão 90%): o intervalo ideal. */
export const intervalFor = (s: number, retention = 0.9): number => (s / FACTOR) * (retention ** (1 / DECAY) - 1);

const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));

/** Dificuldade de um cartão novo, pela primeira nota. */
export const initialDifficulty = (g: Grade): number => clamp(W[4]! - Math.exp(W[5]! * (g - 1)) + 1, 1, 10);

/** Estabilidade de um cartão novo, pela primeira nota. */
export const initialStability = (g: Grade): number => Math.max(0.1, W[g - 1]!);

/** Nova dificuldade: sobe quando erra, desce quando acerta fácil, e volta devagar para o meio. */
export function nextDifficulty(d: number, g: Grade): number {
  const moved = d + (-W[6]! * (g - 3) * (10 - d)) / 9;
  return clamp(W[7]! * initialDifficulty(4) + (1 - W[7]!) * moved, 1, 10);
}

/** Nova estabilidade depois de uma resposta, dada a chance de lembrar `r` no momento (e se a revisão foi no mesmo dia). */
export function nextStability(s: number, d: number, r: number, g: Grade, sameDay = false): number {
  if (sameDay) return Math.max(0.1, s * Math.exp(W[17]! * (g - 3 + W[18]!)));
  if (g === 1) {
    const forgot = W[11]! * d ** -W[12]! * ((s + 1) ** W[13]! - 1) * Math.exp((1 - r) * W[14]!);
    return Math.max(0.1, Math.min(forgot, s));
  }
  const hard = g === 2 ? W[15]! : 1;
  const easy = g === 4 ? W[16]! : 1;
  return Math.max(0.1, s * (1 + Math.exp(W[8]!) * (11 - d) * s ** -W[9]! * (Math.exp((1 - r) * W[10]!) - 1) * hard * easy));
}
