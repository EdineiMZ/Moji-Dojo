import { ALL_ITEMS } from '@/features/catalog';
import { KANJI_MORE_WORDS } from '@/content/kanjiMoreWords';
import { wordsWithKanji } from '@/content';
import { KANJI_EXAMPLES } from '@/data/examples';
import { kanaExampleFor, kanjiExampleFor, laterKanjiIn, laterKanjiNote } from './examples';

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

  it('as palavras extras contêm o kanji e não repetem as iniciais', () => {
    for (const [char, ex] of Object.entries(KANJI_MORE_WORDS)) {
      expect(ex.word).toContain(char);
      expect(KANJI_EXAMPLES[char]).toBeUndefined();
    }
  });
});

describe('dicas dos kanji', () => {
  it('todo kanji tem dica (das iniciais ou as extras) e as extras não repetem as iniciais', () => {
    const { ALL_KANJI } = require('@/content/kanji') as typeof import('@/content/kanji');
    const { KANJI_HINTS } = require('@/data/hints') as typeof import('@/data/hints');
    const { KANJI_HINTS_EXTRA } = require('@/content/kanjiHints') as typeof import('@/content/kanjiHints');
    const missing = ALL_KANJI.filter((k) => !KANJI_HINTS[k.char] && !KANJI_HINTS_EXTRA[k.char]).map((k) => k.char);
    expect(missing).toEqual([]);
    expect(Object.keys(KANJI_HINTS_EXTRA).filter((c) => KANJI_HINTS[c])).toEqual([]);
    expect(Object.values(KANJI_HINTS_EXTRA).every((h) => h.length > 12)).toBe(true);
  });
});

describe('kanji da palavra de exemplo que ainda não foram vistos (F2)', () => {
  it('日 → 日本: o 本 só vem numa lição mais adiante', () => {
    expect(laterKanjiIn('日本', '日')).toEqual([{ char: '本', lesson: 18 }]);
    expect(laterKanjiNote(laterKanjiIn('日本', '日'))).toBe('Ainda não vistos nesta palavra: 本 (lição 18).');
  });

  it('kanji que o app não ensina aparecem como tal (山 → 富士山)', () => {
    expect(laterKanjiIn('富士山', '山')).toEqual([{ char: '富' }, { char: '士' }]);
    expect(laterKanjiNote(laterKanjiIn('富士山', '山'))).toContain('富 (o app não ensina)');
  });

  it('kanji de lição anterior não é novidade e a palavra sem outros kanji não tem aviso', () => {
    expect(laterKanjiIn('日本', '本')).toEqual([]); // 日 foi ensinado antes
    expect(laterKanjiNote([])).toBeUndefined();
    expect(laterKanjiIn('水', '水')).toEqual([]);
  });

  it('todo exemplo escolhido à mão avisa exatamente os kanji que ainda não viu, e só os que a trilha ensina depois', () => {
    for (const [char, example] of Object.entries(KANJI_EXAMPLES)) {
      for (const k of laterKanjiIn(example.word, char)) {
        expect(example.word).toContain(k.char);
        expect(k.char).not.toBe(char);
      }
    }
    const withNotes = Object.entries(KANJI_EXAMPLES).filter(([c, e]) => laterKanjiIn(e.word, c).length > 0);
    expect(withNotes.length).toBeGreaterThanOrEqual(15);
  });
});
