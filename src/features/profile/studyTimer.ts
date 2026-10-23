/**
 * Contador de tempo de uso ativo, puro: dado quando foi o último toque e quanto tempo passou, diz quantos segundos contam.
 * O app só conta o tempo em que a pessoa está mexendo nele (um toque nos últimos 60 s), para a meta de minutos por dia
 * não encher com o celular parado na mesa.
 */
export const IDLE_LIMIT_MS = 60_000;
export const TICK_MS = 5_000;

/** Segundos a somar neste tick: o tick inteiro se houve toque dentro da janela de ociosidade, senão zero. */
export function activeSeconds(now: number, lastTouchAt: number, tickMs: number = TICK_MS): number {
  if (lastTouchAt <= 0) return 0;
  return now - lastTouchAt <= IDLE_LIMIT_MS ? Math.round(tickMs / 1000) : 0;
}

/** Minutos inteiros (arredondados para baixo) de uma contagem de segundos. */
export const minutesOf = (seconds: number): number => Math.floor(Math.max(0, seconds) / 60);

/** Quanto falta para a meta, em minutos (arredondado para cima, no mínimo 1 enquanto não bateu). */
export function minutesLeft(goalMinutes: number, seconds: number): number {
  if (goalMinutes <= 0) return 0;
  return Math.max(0, Math.ceil((goalMinutes * 60 - seconds) / 60));
}
