import { formatDay, markDay, streakDays } from './days';

const at = (y: number, m: number, d: number, h = 12) => new Date(y, m - 1, d, h);

describe('formatDay', () => {
  it('usa AAAA-MM-DD com zeros à esquerda', () => {
    expect(formatDay(at(2026, 3, 5))).toBe('2026-03-05');
  });
});

describe('markDay', () => {
  it('adiciona o dia de hoje uma única vez', () => {
    const once = markDay([], at(2026, 10, 22));
    expect(once).toEqual(['2026-10-22']);
    expect(markDay(once, at(2026, 10, 22, 23))).toBe(once);
  });

  it('guarda no máximo 400 dias, descartando os mais antigos', () => {
    const many = Array.from({ length: 400 }, (_, i) => formatDay(at(2025, 1, 1 + i)));
    const next = markDay(many, at(2026, 10, 22));
    expect(next).toHaveLength(400);
    expect(next[0]).toBe(many[1]);
    expect(next[399]).toBe('2026-10-22');
  });
});

describe('streakDays', () => {
  const now = at(2026, 10, 22);

  it('é 0 sem nenhum dia de estudo', () => {
    expect(streakDays([], now)).toBe(0);
  });

  it('conta hoje e os dias anteriores seguidos', () => {
    expect(streakDays(['2026-10-20', '2026-10-21', '2026-10-22'], now)).toBe(3);
  });

  it('se hoje ainda não foi marcado, parte de ontem (a sequência não quebra)', () => {
    expect(streakDays(['2026-10-20', '2026-10-21'], now)).toBe(2);
  });

  it('quebra depois de um dia inteiro sem estudar', () => {
    expect(streakDays(['2026-10-19', '2026-10-20'], now)).toBe(0);
  });

  it('só conta a sequência mais recente, não dias isolados antigos', () => {
    expect(streakDays(['2026-10-10', '2026-10-11', '2026-10-21', '2026-10-22'], now)).toBe(2);
  });

  it('atravessa a virada do mês e do ano', () => {
    expect(streakDays(['2026-02-27', '2026-02-28', '2026-03-01'], at(2026, 3, 1))).toBe(3);
    expect(streakDays(['2025-12-31', '2026-01-01'], at(2026, 1, 1))).toBe(2);
  });

  it('funciona com o relógio do sistema (fake timers)', () => {
    jest.useFakeTimers({ now: at(2026, 10, 22, 23) });
    try {
      expect(streakDays(['2026-10-21', '2026-10-22'], new Date())).toBe(2);
      jest.setSystemTime(at(2026, 10, 24, 8)); // dois dias depois, sem estudar
      expect(streakDays(['2026-10-21', '2026-10-22'], new Date())).toBe(0);
    } finally {
      jest.useRealTimers();
    }
  });
});
