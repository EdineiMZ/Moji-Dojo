import { KANJI } from '@/data/kanji';
import { findWord, VOCAB, VOCAB_GROUPS, wordsWithKanji } from './index';

const KANA_ONLY = /^[ぁ-ゖァ-ヺー]+$/u;
const KANJI_CHAR = /[一-鿿]/u;
const knownKanji = new Set(KANJI.map((k) => k.char));

describe('vocabulário da especificação', () => {
  it('tem um bom número de palavras, todas distintas', () => {
    expect(VOCAB.length).toBeGreaterThan(150);
    expect(new Set(VOCAB.map((w) => w.id)).size).toBe(VOCAB.length);
  });

  it('toda palavra tem leitura em kana, significado e grupo', () => {
    for (const w of VOCAB) {
      expect(w.jp.length).toBeGreaterThan(0);
      expect(w.reading).toMatch(KANA_ONLY);
      expect(w.meaning.trim()).not.toBe('');
      expect(w.group).not.toBe('');
    }
  });

  it('palavra só de kana lê igual a como se escreve; com kanji lê diferente', () => {
    for (const w of VOCAB) {
      if (KANJI_CHAR.test(w.jp)) expect(w.reading).not.toBe(w.jp);
      else expect(w.reading).toBe(w.jp);
    }
  });

  it('a lista de kanji da palavra bate com os kanji do texto', () => {
    for (const w of VOCAB) expect(w.kanji).toEqual([...w.jp].filter((c) => KANJI_CHAR.test(c)));
  });

  it('toda palavra com kanji tem ao menos um que o app ensina (a interface mostra o significado desses)', () => {
    // Palavras como 月曜日 usam kanji que ainda não estão na trilha (曜): isso é esperado.
    for (const w of VOCAB) if (w.kanji.length > 0) expect(w.kanji.some((c) => knownKanji.has(c))).toBe(true);
  });

  it('o significado não traz marcas de HTML nem comentário solto entre parênteses', () => {
    for (const w of VOCAB) {
      expect(w.meaning).not.toMatch(/[<>]/);
      expect(w.meaning).not.toMatch(/\([^)]*\)\s*$/);
    }
  });

  it('os grupos são os das palavras, sem repetir', () => {
    expect(new Set(VOCAB_GROUPS.map((g) => g.id))).toEqual(new Set(VOCAB.map((w) => w.group)));
    expect(VOCAB_GROUPS.length).toBe(new Set(VOCAB_GROUPS.map((g) => g.id)).size);
  });

  it('findWord acha pelo id e wordsWithKanji liga o kanji às palavras', () => {
    const first = VOCAB[0];
    expect(first && findWord(first.id)).toBe(first);
    expect(findWord('palavra que não existe')).toBeUndefined();
    const withKanji = VOCAB.find((w) => w.kanji.length > 0);
    expect(withKanji).toBeDefined();
    const char = withKanji?.kanji[0] as string;
    expect(wordsWithKanji(char)).toContain(withKanji);
    expect(wordsWithKanji('Z')).toEqual([]);
  });
});
