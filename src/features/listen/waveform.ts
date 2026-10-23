/** Nível mais baixo que ainda aparece na onda (em dB; o silêncio fica rente ao chão). */
export const FLOOR_DB = -60;

/** Quantas leituras do microfone a gravação guarda (a cada 100 ms: 20 segundos). */
export const MAX_LEVELS = 200;

/** De dB (de -160 a 0) para uma altura de 0 a 1: o que está abaixo de FLOOR_DB vale 0. */
export function levelHeight(db: number): number {
  if (!Number.isFinite(db)) return 0;
  const clamped = Math.min(0, Math.max(FLOOR_DB, db));
  return (clamped - FLOOR_DB) / -FLOOR_DB;
}

/**
 * Reduz as leituras a `bars` barras, cada uma com o pico do trecho que representa (assim uma sílaba curta não some).
 * Com menos leituras que barras, devolve só as que há.
 */
export function waveformBars(levels: readonly number[], bars: number): number[] {
  if (levels.length === 0 || bars <= 0) return [];
  const count = Math.min(bars, levels.length);
  const out: number[] = [];
  for (let i = 0; i < count; i++) {
    const from = Math.floor((i * levels.length) / count);
    const to = Math.max(from + 1, Math.floor(((i + 1) * levels.length) / count));
    let peak = 0;
    for (let j = from; j < to; j++) peak = Math.max(peak, levelHeight(levels[j] as number));
    out.push(peak);
  }
  return out;
}
