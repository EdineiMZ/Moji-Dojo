import { buildCoachStats, hasCoachData, parseCoach, statsText, type CoachInput } from './coach';

// Quarta-feira, 21/10/2026. A semana (segunda a domingo) começa em 19/10.
const NOW = new Date(2026, 9, 21, 12, 0, 0);

const input = (over: Partial<CoachInput> = {}): CoachInput => ({
  history: {
    '2026-10-19': { answers: 20, correct: 15, learned: 2 },
    '2026-10-20': { answers: 10, correct: 9, learned: 0 },
    '2026-10-13': { answers: 8, correct: 4, learned: 1 },
  },
  days: ['2026-10-13', '2026-10-19', '2026-10-20', '2026-10-21'],
  counters: { 'sk.vocab.n': 30, 'sk.vocab.ok': 24, matureAnswers: 20, matureCorrect: 15 },
  restWeekdays: [],
  srs: {},
  vocab: {},
  conj: {},
  particles: {},
  ...over,
});

describe('buildCoachStats', () => {
  it('resume a semana, a anterior, a sequência e a retenção', () => {
    const stats = buildCoachStats(input(), NOW);
    expect(stats.weekKey).toBe('2026-10-19');
    expect(stats.thisWeek).toMatchObject({ studiedDays: 3, answers: 30, accuracy: 80, learned: 2 });
    expect(stats.lastWeek).toMatchObject({ studiedDays: 1, answers: 8, accuracy: 50 });
    expect(stats.streak).toBe(3);
    expect(stats.retention).toBe(75);
    expect(stats.skills.find((s) => s.label === 'Vocabulário')).toEqual({ label: 'Vocabulário', pct: 80, total: 30 });
  });

  it('conta os itens teimosos por área, sem guardar quais são', () => {
    const stats = buildCoachStats(input({ particles: { は: { b: 1, due: 0, l: 5 }, が: { b: 1, due: 0, l: 6 } } }), NOW);
    expect(stats.leeches).toEqual({ kana: 0, kanji: 0, vocab: 0, conj: 0, particle: 2 });
  });
});

describe('statsText', () => {
  it('leva só números e rótulos de habilidade: nada de palavras, frases ou nomes do aluno', () => {
    const stats = buildCoachStats(input({ particles: { は: { b: 1, due: 0, l: 5 } } }), NOW);
    const text = statsText(stats);
    expect(text).toContain('Esta semana: 3 de 3 dias estudados, 30 respostas, 80% de acertos');
    expect(text).toContain('partículas 1');
    expect(text).not.toContain('は');
  });

  it('diz quando faltam dados em vez de inventar números', () => {
    const text = statsText(buildCoachStats(input({ history: {}, days: [], counters: {} }), NOW));
    expect(text).toContain('ainda sem dados suficientes');
    expect(text).toContain('Vocabulário: sem respostas');
  });
});

describe('hasCoachData', () => {
  it('só chama a IA quando há o que analisar', () => {
    expect(hasCoachData(buildCoachStats(input(), NOW))).toBe(true);
    expect(hasCoachData(buildCoachStats(input({ history: {}, days: [], counters: {} }), NOW))).toBe(false);
  });
});

describe('parseCoach', () => {
  const ok = { summary: 'Boa semana.', focus: 'Partículas.', steps: ['a', 'b', 'c'], praise: 'Parabéns!' };

  it('aceita um plano completo e limita a 4 passos', () => {
    expect(parseCoach(ok)).toEqual(ok);
    expect(parseCoach({ ...ok, steps: ['1', '2', '3', '4', '5'] })?.steps).toHaveLength(4);
    expect(parseCoach({ ...ok, praise: undefined })?.praise).toBe('');
  });

  it('recusa plano sem resumo, foco ou passos', () => {
    expect(parseCoach({ ...ok, summary: '' })).toBeNull();
    expect(parseCoach({ ...ok, focus: ' ' })).toBeNull();
    expect(parseCoach({ ...ok, steps: [] })).toBeNull();
    expect(parseCoach(null)).toBeNull();
  });
});
