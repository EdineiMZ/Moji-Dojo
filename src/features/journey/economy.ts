/** Regras de ganho de pétalas e de experiência. Tudo em números simples, para ficar fácil de ajustar. */

/** Teto diário de pétalas de lição e revisão (o bônus de abrir o app conta; missões, baús e conquistas não). */
export const DAILY_CAP = 150;

/** Pétalas por abrir o app no dia: 5, mais 1 por dia de sequência, até +10. */
export const openBonus = (streak: number): number => 5 + Math.min(Math.max(streak, 0), 10);

const tier = (pct: number, perfect: number, great: number, good: number): number => (pct >= 100 ? perfect : pct >= 90 ? great : pct >= 70 ? good : 0);

export const percent = (first: number, total: number): number => (total > 0 ? Math.round((first / total) * 100) : 0);

export interface LessonReward {
  petals: number;
  xp: number;
  perfect: boolean;
  /** A fila de lições perfeitas depois desta lição. */
  perfectRun: number;
}

/**
 * Pétalas de uma lição concluída: 10 de base, mais pela nota (100% de primeira: +10; 90% ou mais: +6; 70% ou mais: +3) e
 * mais 2 por cada lição perfeita seguida (até +10). Repetir uma lição no mesmo dia vale metade e não conta na fila.
 */
export function lessonReward(first: number, total: number, perfectRunBefore: number, repeat: boolean): LessonReward {
  const pct = percent(first, total);
  const perfect = total > 0 && first === total;
  const run = perfect ? perfectRunBefore + (repeat ? 0 : 1) : repeat ? perfectRunBefore : 0;
  const runBonus = perfect && !repeat ? Math.min(10, 2 * (run - 1)) : 0;
  const full = 10 + tier(pct, 10, 6, 3) + runBonus;
  return { petals: repeat ? Math.floor(full / 2) : full, xp: 20 + (perfect ? 10 : 0), perfect, perfectRun: run };
}

/** Pétalas de uma revisão do dia concluída: 5 de base, mais 8 / 5 / 2 pela nota. */
export function sessionReward(first: number, total: number): { petals: number; xp: number; perfect: boolean } {
  const pct = percent(first, total);
  return { petals: total > 0 ? 5 + tier(pct, 8, 5, 2) : 0, xp: 10, perfect: total > 0 && first === total };
}

/** Quanto ainda cabe no teto do dia. */
export const roomToday = (earnedToday: number): number => Math.max(0, DAILY_CAP - earnedToday);

/** Experiência por resposta: certa vale 2, errada 1 (errar também é estudar). */
export const answerXp = (ok: boolean): number => (ok ? 2 : 1);
