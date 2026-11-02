import { COMEBACK_MESSAGES, DAILY_MESSAGES, DUE_MESSAGES, RISK_MESSAGES, STREAK_MESSAGES } from './messages';
import { dayAllowed, DEFAULT_REMINDERS, HORIZON_DAYS, inQuiet, planReminders, type PlanInput } from './plan';

// Quarta-feira, 21/10/2026, 10h.
const NOW = new Date(2026, 9, 21, 10, 0);

const input = (extra: Partial<PlanInput> = {}, settings: Partial<typeof DEFAULT_REMINDERS> = {}): PlanInput => ({
  now: NOW,
  settings: { ...DEFAULT_REMINDERS, enabled: true, ...settings },
  studiedToday: false,
  streak: 0,
  dueCount: 0,
  daysAway: 1,
  ...extra,
});


describe('silêncio', () => {
  it('janela comum e janela que atravessa a meia-noite', () => {
    expect(inQuiet(13, 0, 12, 14)).toBe(true);
    expect(inQuiet(14, 0, 12, 14)).toBe(false);
    expect(inQuiet(23, 30, 22, 8)).toBe(true);
    expect(inQuiet(3, 0, 22, 8)).toBe(true);
    expect(inQuiet(8, 0, 22, 8)).toBe(false);
    expect(inQuiet(19, 0, 22, 8)).toBe(false);
    expect(inQuiet(5, 0, 8, 8)).toBe(false);
  });
});

describe('quem está ausente recebe menos lembretes, não mais', () => {
  it.each([
    [0, true],
    [2, true],
    [3, true],
    [4, false],
    [5, true],
    [6, false],
    [7, true],
    [8, false],
    [14, true],
    [15, false],
  ])('%i dias sem estudar → %s', (gap, allowed) => {
    expect(dayAllowed(gap)).toBe(allowed);
  });
});

describe('plano de lembretes', () => {
  it('desligado não agenda nada', () => {
    expect(planReminders(input({}, { enabled: false }))).toEqual([]);
  });

  it('agenda o horário escolhido nos próximos dias, começando por hoje se a hora ainda não passou', () => {
    const plan = planReminders(input({ daysAway: 0, streak: 0 }));
    expect(plan[0]?.at.getDate()).toBe(21);
    expect(plan[0]?.at.getHours()).toBe(19);
    expect(plan.filter((p) => p.kind === 'daily').length).toBeGreaterThanOrEqual(3);
    expect(plan.every((p, i) => i === 0 || p.at >= (plan[i - 1] as { at: Date }).at)).toBe(true);
  });

  it('se a hora de hoje já passou, começa amanhã', () => {
    const late = new Date(2026, 9, 21, 20, 0);
    const plan = planReminders({ ...input({ daysAway: 0 }), now: late });
    expect(plan[0]?.at.getDate()).toBe(22);
  });

  it('quem já estudou hoje não recebe o lembrete de hoje (nem o da noite)', () => {
    const plan = planReminders(input({ studiedToday: true, daysAway: 0, streak: 5 }));
    expect(plan.some((p) => p.at.getDate() === 21)).toBe(false);
    expect(plan.some((p) => p.at.getDate() === 22 && p.kind === 'daily')).toBe(true);
  });

  it('só nos dias da semana escolhidos', () => {
    // Só segunda (1) e sexta (5): de quarta 21 a 3/11 há sexta 23, segunda 26, sexta 30 e segunda 2.
    const plan = planReminders(input({ daysAway: 0 }, { weekdays: [1, 5] }));
    expect(new Set(plan.map((p) => p.at.getDay()))).toEqual(new Set([1, 5]));
  });

  it('um horário dentro do silêncio vai para o fim dele, e nunca cai dentro', () => {
    const plan = planReminders(input({ daysAway: 0 }, { hour: 23, minute: 0 }));
    expect(plan.filter((p) => p.kind === 'daily').every((p) => p.at.getHours() === 8 && p.at.getMinutes() === 0)).toBe(true);
    for (const p of plan) expect(inQuiet(p.at.getHours(), p.at.getMinutes(), 22, 8)).toBe(false);
  });

  it('no máximo 2 por dia', () => {
    const plan = planReminders(input({ streak: 10, daysAway: 1 }));
    const perDay = new Map<string, number>();
    for (const p of plan) perDay.set(p.at.toDateString(), (perDay.get(p.at.toDateString()) ?? 0) + 1);
    expect(Math.max(...perDay.values())).toBeLessThanOrEqual(2);
  });

  it('o horizonte tem limite', () => {
    const plan = planReminders(input({ daysAway: 0 }));
    const last = plan.at(-1);
    expect(last).toBeDefined();
    expect((last as { at: Date }).at.getTime() - NOW.getTime()).toBeLessThan((HORIZON_DAYS + 1) * 86_400_000);
  });
});

describe('aviso da noite (sequência em risco)', () => {
  it('com qualquer sequência (1 dia ou mais) e sem estudo hoje', () => {
    const risky = planReminders(input({ streak: 5, daysAway: 1 }));
    const risk = risky.filter((p) => p.kind === 'risk');
    expect(risk.length).toBeGreaterThan(0);
    // Com o lembrete diário às 19h, o aviso da noite vem 2 horas depois (21h), antes do silêncio das 22h.
    expect(risk.every((p) => p.at.getHours() === 21 && p.at.getMinutes() === 0)).toBe(true);
    expect(risk[0]?.at.getDate()).toBe(21);

    // 1 dia de sequência já merece o aviso; sem sequência (0), não há o que proteger.
    expect(planReminders(input({ streak: 1, daysAway: 1 })).some((p) => p.kind === 'risk')).toBe(true);
    expect(planReminders(input({ streak: 2, daysAway: 1 })).some((p) => p.kind === 'risk')).toBe(true);
    expect(planReminders(input({ streak: 0, daysAway: 1 })).some((p) => p.kind === 'risk')).toBe(false);
    expect(planReminders(input({ streak: 5, daysAway: 1 }, { risk: false })).some((p) => p.kind === 'risk')).toBe(false);
    expect(planReminders(input({ streak: 5, studiedToday: true, daysAway: 0 })).filter((p) => p.kind === 'risk').every((p) => p.at.getDate() !== 21)).toBe(true);
  });

  it('só hoje e amanhã (mais longe seria ruído)', () => {
    const risk = planReminders(input({ streak: 8, daysAway: 1 })).filter((p) => p.kind === 'risk');
    expect(risk.every((p) => p.at.getDate() <= 22)).toBe(true);
  });

  it('não repete quando já passou da hora, nem quando a sequência já se perdeu', () => {
    const late = planReminders({ ...input({ streak: 5, daysAway: 1 }), now: new Date(2026, 9, 21, 21, 30) });
    expect(late.some((p) => p.kind === 'risk' && p.at.getDate() === 21)).toBe(false);
    expect(planReminders(input({ streak: 5, daysAway: 4 })).some((p) => p.kind === 'risk')).toBe(false);
  });

  it('vem pelo menos 2 horas depois do lembrete diário e, sem ele, às 20h30', () => {
    const early = planReminders(input({ streak: 5, daysAway: 1 }, { hour: 9, minute: 0 }));
    expect(early.find((p) => p.kind === 'risk')?.at.getHours()).toBe(20);
    expect(early.find((p) => p.kind === 'risk')?.at.getMinutes()).toBe(30);
    const close = planReminders(input({ streak: 5, daysAway: 1 }, { hour: 20, minute: 0 }));
    expect(close.find((p) => p.kind === 'risk')).toBeUndefined();
  });
});

describe('textos', () => {
  it('quem está há 3 dias ou mais sem estudar recebe só textos de boas-vindas, sem cobrança', () => {
    const plan = planReminders(input({ daysAway: 3, streak: 0 }));
    const bodies = new Set(COMEBACK_MESSAGES.map((m) => m.body));
    expect(plan.length).toBeGreaterThan(0);
    for (const p of plan.filter((x) => x.kind === 'daily')) expect(bodies.has(p.body)).toBe(true);
  });

  it('o mesmo dia tem sempre o mesmo texto', () => {
    const a = planReminders(input({ daysAway: 0 }));
    const b = planReminders(input({ daysAway: 0 }));
    expect(a.map((p) => p.body)).toEqual(b.map((p) => p.body));
  });

  it('os textos de contagem trazem o número e nenhum texto fica vazio ou com "undefined"', () => {
    const all = [
      ...DAILY_MESSAGES,
      ...COMEBACK_MESSAGES,
      ...STREAK_MESSAGES.map((f) => f(7)),
      ...DUE_MESSAGES.flatMap((f) => [f(1), f(12)]),
      ...RISK_MESSAGES.map((f) => f(9)),
    ];
    for (const m of all) {
      expect(m.title.length).toBeGreaterThan(3);
      expect(m.body.length).toBeGreaterThan(10);
      expect(`${m.title} ${m.body}`).not.toMatch(/undefined|NaN/);
    }
    expect(STREAK_MESSAGES.some((f) => /7/.test(f(7).title + f(7).body))).toBe(true);
    expect(DUE_MESSAGES.some((f) => /12/.test(f(12).body))).toBe(true);
    expect(DAILY_MESSAGES.length).toBeGreaterThanOrEqual(30);
  });

  it('nenhum texto cobra, culpa ou ameaça', () => {
    const bad = /culpa|falhou|perdeu tudo|desist|preguiç|vergonha|ameaç/i;
    const all = [...DAILY_MESSAGES, ...COMEBACK_MESSAGES, ...STREAK_MESSAGES.map((f) => f(5)), ...RISK_MESSAGES.map((f) => f(5)), ...DUE_MESSAGES.map((f) => f(3))];
    for (const m of all) expect(`${m.title} ${m.body}`).not.toMatch(bad);
  });
});

describe('lembretes com meta de minutos (perfil)', () => {
  const rich = (extra: Partial<PlanInput> = {}, settings: Partial<typeof DEFAULT_REMINDERS> = {}) =>
    planReminders(input({ goalMinutes: 20, username: 'Ana', secondsToday: 0, newToday: 0, restWeekdays: [], ...extra }, { hour: 19, risk: true, ...settings }));

  it('hoje, sem ter usado o app: o lembrete do horário e o aviso da noite com a meta', () => {
    const today = rich({ studiedToday: false, daysAway: 1 }).filter((p) => p.at.getDate() === NOW.getDate());
    expect(today.map((p) => p.kind)).toEqual(['daily', 'goal']);
    expect(`${today[1]?.title} ${today[1]?.body}`).toMatch(/20/);
  });

  it('o aviso da noite diz quanto falta quando já usou parte do tempo', () => {
    const plan = rich({ studiedToday: true, daysAway: 0, secondsToday: 7 * 60 });
    const goal = plan.find((p) => p.kind === 'goal' && p.at.getDate() === NOW.getDate());
    expect(goal?.body).toContain('13');
  });

  it('meta batida: nada mais hoje, e amanhã continua normal', () => {
    const plan = rich({ studiedToday: true, daysAway: 0, secondsToday: 20 * 60 });
    expect(plan.filter((p) => p.at.getDate() === NOW.getDate())).toEqual([]);
    expect(plan.some((p) => p.at.getDate() === NOW.getDate() + 1)).toBe(true);
  });

  it('dia de folga não recebe lembrete', () => {
    // Quinta-feira = 4.
    const plan = rich({ restWeekdays: [4] });
    expect(plan.some((p) => p.at.getDay() === 4)).toBe(false);
    expect(plan.some((p) => p.at.getDay() === 5)).toBe(true);
  });

  it('o nome entra nos textos e sem nome o texto começa com maiúscula', () => {
    expect(rich({}).filter((p) => p.kind === 'goal').some((p) => p.body.startsWith('Ana, '))).toBe(true);
    const anon = rich({ username: '' }).filter((p) => p.kind === 'goal');
    expect(anon.length).toBeGreaterThan(0);
    expect(anon.every((p) => /^[A-ZÁÉÍÓÚÂÊÔÃÕÇ]/.test(p.body))).toBe(true);
  });

  it('sem o perfil o plano é o de antes (nenhum aviso de meta)', () => {
    expect(planReminders(input({ studiedToday: false })).some((p) => p.kind === 'goal')).toBe(false);
  });

  it('há dias com a mensagem de aprender algo novo', () => {
    expect(rich({}).some((p) => /algo novo|palavra nova/i.test(p.title))).toBe(true);
  });
});
