/**
 * Limites por dia, para a pilha de revisões e de palavras novas não virar um peso. 0 = sem limite. São "limites macios": ao
 * chegar neles o app avisa e deixa continuar, se a pessoa quiser.
 */
export interface Limits {
  /** Palavras e verbos novos por dia. */
  newPerDay: number;
  /** Respostas de revisão (cartões) por dia. */
  reviewsPerDay: number;
}

export const DEFAULT_LIMITS: Limits = { newPerDay: 0, reviewsPerDay: 0 };

export const NEW_OPTIONS: readonly number[] = [0, 5, 10, 20];
export const REVIEW_OPTIONS: readonly number[] = [0, 30, 60, 100];

export const limitLabel = (n: number, unit: string): string => (n === 0 ? 'Sem limite' : `${n} ${unit}`);

/** O que ainda cabe hoje (Infinity se não há limite). `done` é o que já foi feito no dia. */
export function room(limit: number, done: number): number {
  return limit <= 0 ? Infinity : Math.max(0, limit - done);
}

/** Quantos itens novos ainda cabem hoje. */
export const newRoom = (limits: Limits, counts: Readonly<Record<string, number>>): number => room(limits.newPerDay, counts.newWords ?? 0);

/** Quantas respostas de revisão ainda cabem hoje. */
export const reviewRoom = (limits: Limits, counts: Readonly<Record<string, number>>): number => room(limits.reviewsPerDay, counts.reviews ?? 0);

/** O tamanho de uma sessão: o lote normal, ou menos se o limite do dia está perto. */
export const batchWithin = (batch: number, remaining: number): number => (Number.isFinite(remaining) ? Math.min(batch, remaining) : batch);

/** Sanitiza o que veio do armazenamento. */
export function sanitizeLimits(raw: unknown): Limits {
  const r = typeof raw === 'object' && raw !== null ? (raw as Record<string, unknown>) : {};
  const pick = (value: unknown, options: readonly number[]): number => (typeof value === 'number' && options.includes(value) ? value : 0);
  return { newPerDay: pick(r.newPerDay, NEW_OPTIONS), reviewsPerDay: pick(r.reviewsPerDay, REVIEW_OPTIONS) };
}
