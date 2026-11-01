import { N2_WORDS } from './n2';
import { N3_WORDS } from './n3';
import { N4_WORDS } from './n4';
import { N5_WORDS } from './n5';

describe('lista N2', () => {
  it('tem mais de 1500 palavras, sem repetir entre si nem com o N5, o N4 e o N3', () => {
    expect(N2_WORDS.length).toBeGreaterThan(1500);
    expect(new Set(N2_WORDS.map((w) => w.jp)).size).toBe(N2_WORDS.length);
    const older = new Set([...N5_WORDS, ...N4_WORDS, ...N3_WORDS].map((w) => w.jp));
    expect(N2_WORDS.filter((w) => older.has(w.jp)).map((w) => w.jp)).toEqual([]);
  });

  it('toda palavra tem leitura em kana, significado em português e grupo "N2:"', () => {
    for (const w of N2_WORDS) {
      expect({ jp: w.jp, kana: /^[぀-ヿー〜ー・]+$/.test(w.reading) }).toEqual({ jp: w.jp, kana: true });
      expect(w.meaning.trim().length).toBeGreaterThan(0);
      expect(w.group.startsWith('N2: ')).toBe(true);
    }
  });

  it('não deixa o significado em inglês como tradução', () => {
    const copied = N2_WORDS.filter((w) => w.meaning.toLowerCase() === w.en.toLowerCase() && w.meaning.length > 6);
    expect(copied.map((w) => w.jp)).toEqual([]);
  });
});
