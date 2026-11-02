import { KANJI_LOOKALIKES } from '@/data/lookalikesKanji';
import { STROKES } from '@/data/strokes';
import { ALL_ITEMS, getItem } from '@/features/catalog';
import { buildOptions, type Rng } from '@/features/quiz/quiz';
import { lookalikesOf } from './lookalikes';

const seeded = (seed: number): Rng => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};
const kanjiPool = ALL_ITEMS.filter((i) => i.script === 'kanji');

describe('sósias de kanji (calculados pelos traços)', () => {
  it('todo kanji da tabela existe no app, tem traços e não aparece como sósia de si mesmo', () => {
    for (const [char, list] of Object.entries(KANJI_LOOKALIKES)) {
      expect(STROKES[char]).toBeDefined();
      expect(list.length).toBeGreaterThan(0);
      expect(list.length).toBeLessThanOrEqual(2);
      expect(list).not.toContain(char);
      for (const other of list) expect(getItem(other).script).toBe('kanji');
    }
  });

  it('lookalikesOf junta os de kana e os de kanji', () => {
    expect(lookalikesOf('大')).toEqual(expect.arrayContaining(['犬', '太']));
    expect(lookalikesOf('さ')).toEqual(expect.arrayContaining(['ち', 'き']));
    expect(lookalikesOf('水')).toContain('木');
    expect(lookalikesOf('犬')).toContain('大');
  });

  it('a pergunta de um kanji traz o sósia entre as alternativas erradas quando a pessoa já o conhece', () => {
    const known = new Set(['大', '犬', '太']);
    let withTwin = 0;
    for (let i = 1; i <= 40; i++) {
      const options = buildOptions(getItem('大'), kanjiPool, seeded(i), known);
      expect(options).toHaveLength(4);
      expect(new Set(options.map((o) => o.label)).size).toBe(4);
      if (options.some((o) => o.char === '犬' || o.char === '太')) withTwin++;
    }
    expect(withTwin).toBe(40);
  });

  it('o sósia nunca vem se o significado for igual ao do certo (senão haveria duas respostas certas)', () => {
    for (const [char, list] of Object.entries(KANJI_LOOKALIKES)) {
      for (const other of list) expect(getItem(other).label).not.toBe(getItem(char).label);
    }
  });
});
