import { mochiComment, monthName, monthSummary, shareText, summarize, weekSummary } from './summary';

// Sexta-feira, 23/10/2026.
const TODAY = new Date(2026, 9, 23, 12);
const history = {
  '2026-10-19': { answers: 20, correct: 15, learned: 5 },
  '2026-10-21': { answers: 40, correct: 36, learned: 0 },
  '2026-10-22': { answers: 10, correct: 5, learned: 2 },
  '2026-10-12': { answers: 30, correct: 30, learned: 10 },
  '2026-09-30': { answers: 8, correct: 4, learned: 0 },
};
const days = ['2026-10-19', '2026-10-21', '2026-10-22', '2026-10-12', '2026-09-30'];

describe('resumo semanal', () => {
  it('soma a semana de segunda a domingo, com acertos, caracteres novos e o melhor dia', () => {
    const s = weekSummary(history, days, TODAY);
    expect(s.from).toBe('2026-10-19');
    expect(s.to).toBe('2026-10-25');
    expect(s.studiedDays).toBe(3);
    expect(s.elapsedDays).toBe(5);
    expect(s.answers).toBe(70);
    expect(s.correct).toBe(56);
    expect(s.accuracy).toBe(80);
    expect(s.learned).toBe(7);
    expect(s.bestDay).toEqual({ day: '2026-10-21', answers: 40 });
  });

  it('a semana passada fica de fora da atual, e dá para olhar para trás', () => {
    const last = weekSummary(history, days, TODAY, 1);
    expect(last.from).toBe('2026-10-12');
    expect(last.answers).toBe(30);
    expect(last.elapsedDays).toBe(7);
  });

  it('sem nenhum registro tudo é zero, sem dividir por zero', () => {
    const s = weekSummary({}, [], TODAY);
    expect(s).toMatchObject({ studiedDays: 0, answers: 0, accuracy: 0, learned: 0, bestDay: null });
  });
});

describe('resumo mensal', () => {
  it('soma o mês inteiro e o mês anterior', () => {
    const october = monthSummary(history, days, TODAY);
    expect(october.from).toBe('2026-10-01');
    expect(october.to).toBe('2026-10-31');
    expect(october.answers).toBe(100);
    expect(october.elapsedDays).toBe(23);
    const september = monthSummary(history, days, TODAY, 1);
    expect(september.answers).toBe(8);
    expect(september.elapsedDays).toBe(30);
  });

  it('o nome do mês acompanha o deslocamento', () => {
    expect(monthName(TODAY)).toBe('outubro');
    expect(monthName(TODAY, 1)).toBe('setembro');
    expect(monthName(new Date(2026, 0, 10), 1)).toBe('dezembro');
  });
});

describe('frase do Mochi e compartilhar', () => {
  it('muda com a constância, sem cobrar', () => {
    const base = summarize({}, [], new Date(2026, 9, 19), new Date(2026, 9, 25), TODAY);
    expect(mochiComment({ ...base, studiedDays: 0 })).toContain('Tudo bem');
    expect(mochiComment({ ...base, studiedDays: 5, elapsedDays: 5 })).toContain('Constância');
    expect(mochiComment({ ...base, studiedDays: 3, elapsedDays: 5 })).toContain('Bom ritmo');
    expect(mochiComment({ ...base, studiedDays: 1, elapsedDays: 7 })).toContain('Cada dia conta');
  });

  it('o texto para compartilhar tem só números e usa singular quando é 1', () => {
    const s = weekSummary(history, days, TODAY);
    const text = shareText({ title: 'minha semana', summary: s, streak: 1, level: 3, levelTitle: 'Aprendiz', petals: 120 });
    expect(text).toContain('3 dias de estudo');
    expect(text).toContain('70 respostas (80% certas)');
    expect(text).toContain('7 caracteres novos');
    expect(text).toContain('Sequência: 1 dia');
    expect(text).toContain('Nível 3 (Aprendiz)');
    expect(text).not.toContain('undefined');
  });
});
