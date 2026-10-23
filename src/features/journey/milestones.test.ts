import { levelPaths } from './milestones';

describe('caminho por nível', () => {
  it('sem progresso tudo está em zero e as metas somam o conteúdo do app', () => {
    const [n5, n4] = levelPaths({}, {});
    expect(n5?.milestones.every((m) => m.have === 0 && m.goal > 0)).toBe(true);
    expect(n4?.milestones[0]?.goal).toBeGreaterThan(100);
    expect((n5?.milestones.find((m) => m.id === 'kanji5')?.goal ?? 0) + (n4?.milestones[0]?.goal ?? 0)).toBe(284);
  });

  it('só conta como firme a partir da caixa 3', () => {
    const [n5] = levelPaths({ あ: { b: 3, due: 0 }, い: { b: 2, due: 0 } }, {});
    expect(n5?.milestones.find((m) => m.id === 'kana')?.have).toBe(1);
  });
});
