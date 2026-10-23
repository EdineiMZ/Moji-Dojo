import { ALL_ITEMS, type StudyItem } from '@/features/catalog';
import { buildOptions, shuffle, type Rng } from '@/features/quiz/quiz';

export const SPEED_ROUND = 20;
/** Chave do recorde (média em ms de uma rodada com mais de 80% de acertos) em `journey.counters`. */
export const SPEED_BEST_KEY = 'speedBest';

export interface SpeedQuestion {
  item: StudyItem;
  options: readonly StudyItem[];
}

/** Kana de um traço só (sem combinados), dos conhecidos; se forem poucos, completa com os básicos. */
export function speedPool(known: readonly string[]): StudyItem[] {
  const kana = ALL_ITEMS.filter((i) => (i.script === 'hira' || i.script === 'kata') && [...i.char].length === 1);
  const learned = kana.filter((i) => known.includes(i.char));
  return learned.length >= 8 ? learned : kana;
}

export function buildSpeedRound(pool: readonly StudyItem[], rng: Rng = Math.random, count = SPEED_ROUND): SpeedQuestion[] {
  const picked: StudyItem[] = [];
  while (picked.length < count) picked.push(...shuffle(pool, rng));
  return picked.slice(0, count).map((item) => ({ item, options: buildOptions(item, pool, rng) }));
}

export interface SpeedResult {
  correct: number;
  total: number;
  /** Média de tempo (ms) das respostas certas. */
  averageMs: number;
  /** Rodada boa (mais de 80% de acertos) e mais rápida que o recorde. */
  record: boolean;
}

export function summarize(times: readonly { ms: number; ok: boolean }[], best: number | undefined): SpeedResult {
  const right = times.filter((t) => t.ok);
  const averageMs = right.length ? Math.round(right.reduce((a, t) => a + t.ms, 0) / right.length) : 0;
  const solid = times.length > 0 && right.length / times.length > 0.8;
  return { correct: right.length, total: times.length, averageMs, record: solid && (best === undefined || best === 0 || averageMs < best) };
}
