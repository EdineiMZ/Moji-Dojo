import { activeSeconds, IDLE_LIMIT_MS, minutesLeft, minutesOf } from './studyTimer';

describe('tempo de uso ativo', () => {
  it('conta o tick só se houve toque dentro da janela', () => {
    expect(activeSeconds(100_000, 0)).toBe(0);
    expect(activeSeconds(100_000, 100_000 - 10_000)).toBe(5);
    expect(activeSeconds(100_000, 100_000 - IDLE_LIMIT_MS)).toBe(5);
    expect(activeSeconds(100_000, 100_000 - IDLE_LIMIT_MS - 1)).toBe(0);
  });

  it('minutos e o que falta para a meta', () => {
    expect(minutesOf(59)).toBe(0);
    expect(minutesOf(125)).toBe(2);
    expect(minutesLeft(20, 0)).toBe(20);
    expect(minutesLeft(20, 61)).toBe(19);
    expect(minutesLeft(20, 20 * 60)).toBe(0);
    expect(minutesLeft(20, 99999)).toBe(0);
    expect(minutesLeft(0, 0)).toBe(0);
  });
});
