import { countSkill, retention, skillStats, writingStat } from './skills';

describe('habilidades e retenção', () => {
  it('cada resposta soma na habilidade da área, e só os acertos entram no ok', () => {
    let c: Record<string, number> = {};
    c = countSkill(c, { area: 'dictation', ok: true });
    c = countSkill(c, { area: 'understand', ok: false });
    c = countSkill(c, { area: 'conj', ok: true });
    const stats = skillStats(c);
    expect(stats.find((s) => s.skill === 'listening')).toMatchObject({ total: 2, pct: 50 });
    expect(stats.find((s) => s.skill === 'grammar')).toMatchObject({ total: 1, pct: 100 });
    expect(stats.find((s) => s.skill === 'speaking')?.pct).toBeNull();
  });

  it('retenção só olha cartões maduros e só aparece com 10 respostas ou mais', () => {
    let c: Record<string, number> = {};
    for (let i = 0; i < 9; i++) c = countSkill(c, { area: 'vocab', ok: true, mature: true });
    c = countSkill(c, { area: 'vocab', ok: false });
    expect(retention(c)).toEqual({ answers: 9, pct: null });
    c = countSkill(c, { area: 'vocab', ok: false, mature: true });
    expect(retention(c)).toEqual({ answers: 10, pct: 90 });
  });

  it('a escrita desenhada tem contagem própria e também entra em kana e kanji', () => {
    let c: Record<string, number> = {};
    c = countSkill(c, { area: 'kana', ok: true, drawn: true });
    c = countSkill(c, { area: 'kana', ok: false, drawn: true });
    c = countSkill(c, { area: 'kana', ok: true });
    expect(writingStat(c)).toEqual({ total: 2, pct: 50 });
    expect(skillStats(c).find((s) => s.skill === 'kana')).toMatchObject({ total: 3 });
    expect(writingStat({})).toEqual({ total: 0, pct: null });
  });
});
