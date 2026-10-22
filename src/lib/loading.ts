/** Tempo mínimo (ms, desde a abertura do app) em que a tela de carregamento fica visível. */
export const MIN_LOADING_MS = 1400;
/** Com "reduzir movimento" não há animação para apreciar, então a tela some quase de imediato. */
export const MIN_LOADING_REDUCED_MS = 400;

/**
 * Quanto ainda falta esperar, em ms, para a tela de carregamento ter ficado o tempo mínimo.
 * O carregamento das fontes já conta: se o app demorou para abrir, não esperamos mais nada.
 */
export function remainingLoadingMs(elapsedMs: number, reduceMotion: boolean): number {
  const minimum = reduceMotion ? MIN_LOADING_REDUCED_MS : MIN_LOADING_MS;
  return Math.max(0, minimum - Math.max(0, elapsedMs));
}
