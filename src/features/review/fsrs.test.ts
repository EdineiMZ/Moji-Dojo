import { initialDifficulty, initialStability, intervalFor, nextDifficulty, nextStability, retrievability } from './fsrs';

describe('FSRS', () => {
  it('a chance de lembrar é 100% no começo, 90% na estabilidade e cai com o tempo', () => {
    expect(retrievability(0, 10)).toBe(1);
    expect(retrievability(10, 10)).toBeCloseTo(0.9, 5);
    expect(retrievability(30, 10)).toBeLessThan(retrievability(10, 10));
  });

  it('o intervalo para 90% é a própria estabilidade, e maior retenção pede intervalo menor', () => {
    expect(intervalFor(10)).toBeCloseTo(10, 5);
    expect(intervalFor(10, 0.95)).toBeLessThan(10);
    expect(intervalFor(10, 0.8)).toBeGreaterThan(10);
  });

  it('a primeira nota decide a partida: errar é mais difícil e menos estável que acertar', () => {
    expect(initialStability(1)).toBeLessThan(initialStability(3));
    expect(initialStability(3)).toBeLessThan(initialStability(4));
    expect(initialDifficulty(1)).toBeGreaterThan(initialDifficulty(3));
    expect(initialDifficulty(3)).toBeGreaterThan(initialDifficulty(4));
    for (const g of [1, 2, 3, 4] as const) {
      expect(initialDifficulty(g)).toBeGreaterThanOrEqual(1);
      expect(initialDifficulty(g)).toBeLessThanOrEqual(10);
    }
  });

  it('a dificuldade fica entre 1 e 10 por mais que se erre ou acerte', () => {
    let d = 5;
    for (let i = 0; i < 50; i++) d = nextDifficulty(d, 1);
    expect(d).toBeLessThanOrEqual(10);
    expect(d).toBeGreaterThan(8);
    for (let i = 0; i < 50; i++) d = nextDifficulty(d, 4);
    expect(d).toBeGreaterThanOrEqual(1);
    expect(d).toBeLessThan(4);
  });

  it('acertar aumenta a estabilidade, mais quando o esquecimento estava perto; errar nunca a aumenta', () => {
    const s = 10;
    expect(nextStability(s, 5, 0.9, 3)).toBeGreaterThan(s);
    expect(nextStability(s, 5, 0.7, 3)).toBeGreaterThan(nextStability(s, 5, 0.95, 3));
    expect(nextStability(s, 5, 0.9, 4)).toBeGreaterThan(nextStability(s, 5, 0.9, 3));
    expect(nextStability(s, 5, 0.9, 2)).toBeLessThan(nextStability(s, 5, 0.9, 3));
    expect(nextStability(s, 5, 0.9, 1)).toBeLessThanOrEqual(s);
  });

  it('um cartão mais difícil ganha menos estabilidade ao acertar', () => {
    expect(nextStability(10, 2, 0.9, 3)).toBeGreaterThan(nextStability(10, 9, 0.9, 3));
  });
});
