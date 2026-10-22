import { KANA } from './kana';
import { KANJI, KANJI_CATEGORIES } from './kanji';
import { KANA_EXAMPLES, KANJI_EXAMPLES } from './examples';
import { KANA_MNEMONICS, KANJI_HINTS } from './hints';
import { LESSONS } from './lessons';
import { STROKES } from './strokes';
import type { Script } from './types';

const kanaChars = new Set(KANA.map((k) => k.char));
const kanjiChars = new Set(KANJI.map((k) => k.char));

describe('dados extraídos do HTML', () => {
  it('tem as quantidades esperadas', () => {
    // hiragana: 46 básicos + 25 dakuten + 33 combinações; katakana: o mesmo + 19 sons estrangeiros
    expect(KANA.filter((k) => k.script === 'hira')).toHaveLength(104);
    expect(KANA.filter((k) => k.script === 'kata')).toHaveLength(123);
    expect(KANJI).toHaveLength(102);
    expect(KANJI_CATEGORIES).toHaveLength(8);
  });

  it('não repete caracteres', () => {
    expect(kanaChars.size).toBe(KANA.length);
    expect(kanjiChars.size).toBe(KANJI.length);
  });

  it('cada categoria lista só kanji existentes e cada kanji tem categoria', () => {
    const ids = new Set(KANJI_CATEGORIES.map((c) => c.id));
    KANJI.forEach((k) => expect(ids.has(k.category)).toBe(true));
    KANJI_CATEGORIES.forEach((c) => [...c.chars].forEach((ch) => expect(kanjiChars.has(ch)).toBe(true)));
  });

  it('as lições mantêm os ids do HTML e só citam caracteres existentes', () => {
    (Object.keys(LESSONS) as Script[]).forEach((script) => {
      const known = script === 'kanji' ? kanjiChars : kanaChars;
      LESSONS[script].forEach((lesson, i) => {
        expect(lesson.id).toBe(`${script}:L${i}`);
        expect(lesson.items.length).toBeGreaterThan(0);
        lesson.items.forEach((item) => expect(known.has(item)).toBe(true));
      });
    });
    expect([LESSONS.hira.length, LESSONS.kata.length, LESSONS.kanji.length]).toEqual([17, 19, 19]);
  });

  it('os kanji de uma lição cobrem todos os 102 kanji, sem repetir', () => {
    const all = LESSONS.kanji.flatMap((l) => l.items);
    expect(all).toHaveLength(102);
    expect(new Set(all).size).toBe(102);
  });

  it('exemplos e dicas só apontam para caracteres existentes', () => {
    Object.keys(KANA_EXAMPLES).forEach((k) => expect(kanaChars.has(k)).toBe(true));
    Object.keys(KANJI_EXAMPLES).forEach((k) => expect(kanjiChars.has(k)).toBe(true));
    Object.keys(KANA_MNEMONICS).forEach((k) => expect(kanaChars.has(k)).toBe(true));
    Object.keys(KANJI_HINTS).forEach((k) => expect(kanjiChars.has(k)).toBe(true));
  });

  it('todo kanji tem traços, com um número por traço', () => {
    KANJI.forEach((k) => {
      const s = STROKES[k.char];
      expect(s).toBeDefined();
      expect(s?.p.length).toBe(s?.n.length);
    });
  });
});
