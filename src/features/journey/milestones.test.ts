import { levelPaths } from './milestones';

describe('caminho por nível', () => {
  it('sem progresso tudo está em zero e as metas somam o conteúdo do app', () => {
    const [n5, n4] = levelPaths({}, {});
    expect(n5?.milestones.every((m) => m.have === 0 && m.goal > 0)).toBe(true);
    expect(n4?.milestones.find((m) => m.id === 'kanji4')?.goal).toBeGreaterThan(100);
    expect((n5?.milestones.find((m) => m.id === 'kanji5')?.goal ?? 0) + (n4?.milestones.find((m) => m.id === 'kanji4')?.goal ?? 0)).toBe(284);
  });

  it('inclui verbos e gramática dominada', () => {
    const [n5] = levelPaths({}, {}, {}, { g1: 1 });
    const ids = n5?.milestones.map((m) => m.id);
    expect(ids).toEqual(expect.arrayContaining(['verbs', 'grammar']));
    expect(n5?.milestones.find((m) => m.id === 'grammar')?.have).toBe(1);
  });

  it('só conta como firme a partir da caixa 3', () => {
    const [n5] = levelPaths({ あ: { b: 3, due: 0 }, い: { b: 2, due: 0 } }, {});
    expect(n5?.milestones.find((m) => m.id === 'kana')?.have).toBe(1);
  });
});

describe('palavras por nível', () => {
  it('o N4 tem a própria meta de palavras, separada da do N5', () => {
    const paths = levelPaths({}, {});
    const words4 = paths.find((p) => p.level === 'N4')?.milestones.find((m) => m.id === 'words4');
    const words5 = paths.find((p) => p.level === 'N5')?.milestones.find((m) => m.id === 'words');
    expect(words4?.goal).toBeGreaterThan(500);
    expect(words5?.goal).toBeGreaterThan(600);
    expect(words4?.have).toBe(0);
  });
});

describe('caminho do N3', () => {
  it('conta as palavras e os kanji do N3, e as palavras do N3 não entram no N5 nem no N4', () => {
    const n3 = levelPaths({}, {}).find((p) => p.level === 'N3');
    expect(n3?.milestones.map((m) => m.id)).toEqual(['words3', 'kanji3']);
    expect(n3?.milestones.every((m) => m.goal > 100 && m.have === 0)).toBe(true);
  });
});
