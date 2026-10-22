import {
  accuracy,
  activityStrip,
  addActivity,
  bestStreak,
  dailyAnswers,
  evolution,
  lastDays,
  MAX_HISTORY_DAYS,
  type ActivityHistory,
} from './metrics';

// Data fixa: quinta, 22/10/2026 às 10:00.
const NOW = new Date(2026, 9, 22, 10, 0, 0);

describe('addActivity', () => {
  it('soma ao dia de hoje sem tocar nos outros', () => {
    const base: ActivityHistory = { '2026-10-21': { answers: 5, correct: 4, learned: 2 } };
    const a = addActivity(base, NOW, { answers: 1, correct: 1 });
    const b = addActivity(a, NOW, { answers: 1, correct: 0, learned: 3 });
    expect(b['2026-10-22']).toEqual({ answers: 2, correct: 1, learned: 3 });
    expect(b['2026-10-21']).toEqual({ answers: 5, correct: 4, learned: 2 });
    expect(base['2026-10-22']).toBeUndefined(); // não altera o original
  });

  it('guarda só os últimos 400 dias', () => {
    let history: ActivityHistory = {};
    const start = new Date(2025, 0, 1);
    for (let i = 0; i < MAX_HISTORY_DAYS + 10; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      history = addActivity(history, d, { answers: 1 });
    }
    const keys = Object.keys(history).sort();
    expect(keys).toHaveLength(MAX_HISTORY_DAYS);
    expect(keys[0]).toBe('2025-01-11'); // os 10 primeiros foram descartados
  });
});

describe('bestStreak', () => {
  it('a maior sequência de dias seguidos', () => {
    expect(bestStreak([])).toBe(0);
    expect(bestStreak(['2026-10-01'])).toBe(1);
    expect(bestStreak(['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-10', '2026-10-11'])).toBe(3);
  });

  it('não depende da ordem nem de repetições', () => {
    expect(bestStreak(['2026-10-03', '2026-10-01', '2026-10-02', '2026-10-02'])).toBe(3);
  });

  it('atravessa virada de mês, de ano e o dia 29 de fevereiro', () => {
    expect(bestStreak(['2026-02-27', '2026-02-28', '2026-03-01'])).toBe(3);
    expect(bestStreak(['2025-12-31', '2026-01-01'])).toBe(2);
    expect(bestStreak(['2028-02-28', '2028-02-29', '2028-03-01'])).toBe(3);
  });

  it('e atravessa a mudança de horário de verão (os dias seguem 1 a 1)', () => {
    expect(bestStreak(['2026-03-07', '2026-03-08', '2026-03-09', '2026-11-01', '2026-11-02'])).toBe(3);
  });
});

describe('lastDays / activityStrip', () => {
  it('termina hoje e tem o tamanho pedido', () => {
    const days = lastDays(NOW, 5);
    expect(days).toEqual(['2026-10-18', '2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22']);
  });

  it('atravessa a virada do mês', () => {
    expect(lastDays(new Date(2026, 2, 2), 4)).toEqual(['2026-02-27', '2026-02-28', '2026-03-01', '2026-03-02']);
  });

  it('marca os dias estudados, o de hoje e o dia da semana', () => {
    const strip = activityStrip(['2026-10-20', '2026-10-22'], NOW, 4);
    expect(strip.map((d) => d.active)).toEqual([false, true, false, true]); // dias 19, 20, 21 e 22
    expect(strip.at(-1)).toMatchObject({ day: '2026-10-22', active: true, isToday: true, weekday: 4 }); // quinta
    expect(strip[0]).toMatchObject({ day: '2026-10-19', isToday: false, weekday: 1 }); // segunda
  });
});

describe('accuracy', () => {
  it('porcentagem de acertos do histórico todo; null sem respostas', () => {
    expect(accuracy({})).toBeNull();
    expect(accuracy({ あ: { c: 0, w: 0 } })).toBeNull();
    expect(accuracy({ あ: { c: 3, w: 1 }, い: { c: 5, w: 1 } })).toBe(80);
    expect(accuracy({ あ: { c: 1, w: 2 } })).toBe(33);
  });
});

describe('dailyAnswers', () => {
  it('zero nos dias sem registro', () => {
    const history: ActivityHistory = { '2026-10-21': { answers: 8, correct: 6, learned: 0 } };
    expect(dailyAnswers(history, NOW, 3)).toEqual([
      { day: '2026-10-20', weekday: 2, answers: 0, correct: 0 },
      { day: '2026-10-21', weekday: 3, answers: 8, correct: 6 },
      { day: '2026-10-22', weekday: 4, answers: 0, correct: 0 },
    ]);
  });
});

describe('evolution', () => {
  const history: ActivityHistory = {
    '2026-10-20': { answers: 10, correct: 9, learned: 5 },
    '2026-10-21': { answers: 12, correct: 10, learned: 0 },
    '2026-10-22': { answers: 6, correct: 6, learned: 5 },
  };

  it('termina no total de hoje e "desfaz" o que foi aprendido depois de cada dia', () => {
    const e = evolution(history, 20, NOW, 5);
    expect(e.points.map((p) => p.learned)).toEqual([10, 10, 15, 15, 20]);
    expect(e.points.at(-1)).toEqual({ day: '2026-10-22', learned: 20 });
  });

  it('antes do primeiro dia registrado a linha fica no valor que já existia', () => {
    const e = evolution(history, 20, NOW, 5);
    expect(e.startedOn).toBe('2026-10-20');
    expect(e.points[0]?.learned).toBe(e.points[1]?.learned); // 10 e 10
  });

  it('sem histórico: não há dados e a linha é reta no total atual', () => {
    const e = evolution({}, 12, NOW, 4);
    expect(e.hasData).toBe(false);
    expect(e.startedOn).toBeNull();
    expect(e.points.every((p) => p.learned === 12)).toBe(true);
  });

  it('nunca fica negativa, mesmo com histórico maior que o total (dados inconsistentes)', () => {
    const e = evolution(history, 3, NOW, 5);
    expect(Math.min(...e.points.map((p) => p.learned))).toBe(0);
  });

  it('a curva nunca diminui ao longo do tempo', () => {
    const values = evolution(history, 20, NOW, 30).points.map((p) => p.learned);
    expect(values).toEqual([...values].sort((a, b) => a - b));
  });
});
