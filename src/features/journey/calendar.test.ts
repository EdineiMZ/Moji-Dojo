import { monthGrid } from './calendar';

describe('grade do calendário', () => {
  it('outubro de 2026 começa numa quinta e tem 31 dias em semanas de domingo a sábado', () => {
    const weeks = monthGrid(2026, 9);
    expect(weeks.every((w) => w.length === 7)).toBe(true);
    expect(weeks[0]).toEqual([null, null, null, null, 1, 2, 3]);
    expect(weeks.flat().filter((d) => d !== null)).toHaveLength(31);
    // 31/10/2026 é sábado: a última semana termina no dia 31.
    expect(weeks.at(-1)?.at(-1)).toBe(31);
  });

  it('fevereiro de 2026 (28 dias, começa num domingo) cabe em 4 semanas certinhas', () => {
    const weeks = monthGrid(2026, 1);
    expect(weeks).toHaveLength(4);
    expect(weeks[0]?.[0]).toBe(1);
    expect(weeks[3]?.[6]).toBe(28);
  });

  it('ano bissexto tem o dia 29', () => {
    expect(monthGrid(2028, 1).flat()).toContain(29);
  });
});
