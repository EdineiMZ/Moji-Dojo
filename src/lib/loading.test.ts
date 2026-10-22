import { MIN_LOADING_MS, MIN_LOADING_REDUCED_MS, remainingLoadingMs } from './loading';

describe('remainingLoadingMs', () => {
  it('app que abriu rápido ainda espera até o mínimo', () => {
    expect(remainingLoadingMs(0, false)).toBe(MIN_LOADING_MS);
    expect(remainingLoadingMs(500, false)).toBe(MIN_LOADING_MS - 500);
  });

  it('app que já demorou mais que o mínimo não espera nada', () => {
    expect(remainingLoadingMs(MIN_LOADING_MS, false)).toBe(0);
    expect(remainingLoadingMs(5000, false)).toBe(0);
  });

  it('com reduzir movimento o mínimo é bem menor', () => {
    expect(MIN_LOADING_REDUCED_MS).toBeLessThan(MIN_LOADING_MS);
    expect(remainingLoadingMs(0, true)).toBe(MIN_LOADING_REDUCED_MS);
    expect(remainingLoadingMs(450, true)).toBe(0);
  });

  it('tempo decorrido negativo (relógio ajustado) não estende a espera', () => {
    expect(remainingLoadingMs(-3000, false)).toBe(MIN_LOADING_MS);
  });
});
