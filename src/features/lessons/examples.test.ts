import { ALL_ITEMS } from '@/features/catalog';
import { KANJI_MORE_WORDS } from '@/content/kanjiMoreWords';
import { wordsWithKanji } from '@/content';
import { KANJI_EXAMPLES } from '@/data/examples';
import { kanaExampleFor, kanjiExampleFor } from './examples';

describe('exemplos das lições', () => {
  it('kana sem exemplo escolhido ganha uma palavra do vocabulário que o contém', () => {
    const ga = kanaExampleFor('が');
    expect(ga?.word).toContain('が');
    expect(ga?.romaji).toBeTruthy();
    expect(kanaExampleFor('あ')?.word).toBeTruthy();
  });

  it('todo kanji tem pelo menos uma palavra para mostrar (exemplo, vocabulário ou JMdict)', () => {
    const missing = ALL_ITEMS.filter((i) => i.script === 'kanji' && !kanjiExampleFor(i.char) && wordsWithKanji(i.char).length === 0);
    expect(missing.map((i) => i.char)).toEqual([]);
  });

  it('as palavras extras contêm o kanji e não repetem as do protótipo', () => {
    for (const [char, ex] of Object.entries(KANJI_MORE_WORDS)) {
      expect(ex.word).toContain(char);
      expect(KANJI_EXAMPLES[char]).toBeUndefined();
    }
  });
});
