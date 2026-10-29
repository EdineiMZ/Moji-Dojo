import { examTimeMs, formatClock, SECONDS_PER_QUESTION } from './clock';

describe('relógio da prova', () => {
  it('o tempo total é o tempo de cada pergunta vezes a quantidade', () => {
    expect(examTimeMs(20)).toBe(20 * SECONDS_PER_QUESTION * 1000);
    expect(examTimeMs(0)).toBe(0);
  });

  it('mostra minutos e segundos, arredondando para cima e nunca negativo', () => {
    expect(formatClock(15 * 60_000)).toBe('15:00');
    expect(formatClock(61_000)).toBe('1:01');
    expect(formatClock(9_400)).toBe('0:10');
    expect(formatClock(400)).toBe('0:01');
    expect(formatClock(0)).toBe('0:00');
    expect(formatClock(-5000)).toBe('0:00');
  });
});
