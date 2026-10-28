import { N4_WORDS } from './n4';
import { N5_WORDS } from './n5';

describe('lista N4', () => {
  it('tem mais de 600 palavras, sem repetir entre si nem com o N5', () => {
    expect(N4_WORDS.length).toBeGreaterThan(600);
    expect(new Set(N4_WORDS.map((w) => w.jp)).size).toBe(N4_WORDS.length);
    const n5 = new Set(N5_WORDS.map((w) => w.jp));
    expect(N4_WORDS.filter((w) => n5.has(w.jp)).map((w) => w.jp)).toEqual([]);
  });

  it('toda palavra tem leitura em kana, significado em português e grupo "N4:"', () => {
    for (const w of N4_WORDS) {
      expect({ jp: w.jp, kana: /^[぀-ヿー〜ー・]+$/.test(w.reading) }).toEqual({ jp: w.jp, kana: true });
      expect(w.meaning.trim().length).toBeGreaterThan(0);
      expect(w.group.startsWith('N4: ')).toBe(true);
    }
  });

  it('não deixa o significado em inglês como tradução', () => {
    const copied = N4_WORDS.filter((w) => w.meaning.toLowerCase() === w.en.toLowerCase() && w.meaning.length > 6);
    expect(copied.map((w) => w.jp)).toEqual([]);
  });
});
