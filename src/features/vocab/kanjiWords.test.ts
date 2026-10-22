import { VOCAB, wordsWithKanji } from '@/content';
import { KANJI_EXAMPLES } from '@/data/examples';
import { kanjiBreakdown, KANJI_WORDS_LIMIT, otherWordsWithKanji } from './kanjiWords';

describe('palavras de um kanji', () => {
  it('o kanji 日 aparece em várias palavras e a de exemplo da lição pode ser excluída', () => {
    const all = wordsWithKanji('日');
    expect(all.length).toBeGreaterThan(1);
    const example = KANJI_EXAMPLES['日']?.word;
    const others = otherWordsWithKanji('日', example);
    expect(others.map((w) => w.id)).not.toContain(example);
    expect(others.length).toBeLessThanOrEqual(KANJI_WORDS_LIMIT);
    expect(others.every((w) => w.kanji.includes('日'))).toBe(true);
  });

  it('as palavras mais curtas vêm primeiro', () => {
    const lengths = otherWordsWithKanji('日', undefined, 10).map((w) => [...w.jp].length);
    expect(lengths).toEqual([...lengths].sort((a, b) => a - b));
  });

  it('kanji sem palavra e limite zero dão lista vazia', () => {
    expect(otherWordsWithKanji('Z')).toEqual([]);
    expect(otherWordsWithKanji('日', undefined, 0)).toEqual([]);
  });
});

describe('quebra de kanji no cartão da palavra', () => {
  it('mostra só os kanji que o app ensina, sem repetir', () => {
    const word = VOCAB.find((w) => w.jp === '日本人');
    expect(word && kanjiBreakdown(word)).toEqual(['日 = dia, sol', '本 = livro, origem', '人 = pessoa']);
  });

  it('palavra sem kanji (ou só com kanji desconhecidos) não tem quebra', () => {
    const kana = VOCAB.find((w) => w.kanji.length === 0);
    expect(kana && kanjiBreakdown(kana)).toEqual([]);
  });
});
