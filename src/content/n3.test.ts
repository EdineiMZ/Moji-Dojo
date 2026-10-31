import { N3_WORDS } from './n3';
import { N4_WORDS } from './n4';
import { N5_WORDS } from './n5';

describe('lista N3', () => {
  it('tem mais de 2000 palavras, sem repetir entre si nem com o N5 e o N4', () => {
    expect(N3_WORDS.length).toBeGreaterThan(2000);
    expect(new Set(N3_WORDS.map((w) => w.jp)).size).toBe(N3_WORDS.length);
    const older = new Set([...N5_WORDS, ...N4_WORDS].map((w) => w.jp));
    expect(N3_WORDS.filter((w) => older.has(w.jp)).map((w) => w.jp)).toEqual([]);
  });

  it('toda palavra tem leitura em kana, significado em português e grupo "N3:"', () => {
    for (const w of N3_WORDS) {
      expect({ jp: w.jp, kana: /^[぀-ヿー〜ー・]+$/.test(w.reading) }).toEqual({ jp: w.jp, kana: true });
      expect(w.meaning.trim().length).toBeGreaterThan(0);
      expect(w.group.startsWith('N3: ')).toBe(true);
    }
  });

  it('não deixa o significado em inglês como tradução', () => {
    const copied = N3_WORDS.filter((w) => w.meaning.toLowerCase() === w.en.toLowerCase() && w.meaning.length > 6);
    expect(copied.map((w) => w.jp)).toEqual([]);
  });
});
