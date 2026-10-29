import { KANJI } from '@/data/kanji';
import { STROKES } from '@/data/strokes';
import { LESSONS } from './lessons';
import { ALL_KANJI, ALL_KANJI_CATEGORIES, kanjiLevelOf } from './kanji';
import { KANJI_EXTRA, KANJI_EXTRA_CATEGORIES, KANJI_EXTRA_LESSONS } from './kanjiExtra';

describe('kanji além dos 102 iniciais', () => {
  it('somam 375 (182 do N5/N4 e 193 do N3) aos 102 iniciais, sem repetir nenhum', () => {
    expect(KANJI).toHaveLength(102);
    expect(KANJI_EXTRA).toHaveLength(375);
    expect(new Set(ALL_KANJI.map((k) => k.char)).size).toBe(477);
  });

  it('todo kanji tem significado, uma leitura pelo menos, categoria que existe e a ordem dos traços', () => {
    const categories = new Set(ALL_KANJI_CATEGORIES.map((c) => c.id));
    for (const k of KANJI_EXTRA) {
      expect(k.meaning.length).toBeGreaterThan(1);
      expect(k.on.length + k.kun.length).toBeGreaterThan(0);
      expect(categories.has(k.category)).toBe(true);
      const strokes = STROKES[k.char];
      expect({ char: k.char, ok: strokes !== undefined && strokes.p.length > 0 && strokes.p.length === strokes.n.length }).toEqual({ char: k.char, ok: true });
    }
  });

  it('as leituras on são em katakana e as kun em hiragana, sem pontos nem traços soltos', () => {
    for (const k of KANJI_EXTRA) {
      for (const on of k.on) expect(on).toMatch(/^[゠-ヿー-]+$/u);
      for (const kun of k.kun) expect(kun).toMatch(/^[ぁ-ゟー()]+$/u);
    }
  });

  it('as categorias novas listam os mesmos kanji que têm essa categoria', () => {
    for (const category of KANJI_EXTRA_CATEGORIES) {
      const chars = [...category.chars].sort().join('');
      const found = KANJI_EXTRA.filter((k) => k.category === category.id).map((k) => k.char).sort().join('');
      expect(found).toBe(chars);
    }
  });

  it('as lições novas continuam a numeração, cobrem todos os kanji novos uma vez só, e as antigas não mudam', () => {
    expect(LESSONS.kanji.slice(0, 19).map((l) => l.id)).toEqual(Array.from({ length: 19 }, (_, i) => `kanji:L${i}`));
    expect(KANJI_EXTRA_LESSONS.map((l) => l.id)).toEqual(Array.from({ length: KANJI_EXTRA_LESSONS.length }, (_, i) => `kanji:L${19 + i}`));
    const items = KANJI_EXTRA_LESSONS.flatMap((l) => l.items);
    expect(items.sort()).toEqual(KANJI_EXTRA.map((k) => k.char).sort());
    for (const lesson of KANJI_EXTRA_LESSONS) {
      expect(lesson.items.length).toBeGreaterThanOrEqual(2);
      expect(lesson.items.length).toBeLessThanOrEqual(6);
    }
  });

  it('o N3 traz 193 kanji de grupos "N3: ...", com nível N3 e fora das metas e provas do N5 e do N4', () => {
    const n3 = ALL_KANJI.filter((k) => kanjiLevelOf(k) === 'N3');
    expect(n3).toHaveLength(193);
    expect(ALL_KANJI.filter((k) => kanjiLevelOf(k) === 'N4')).toHaveLength(182);
    expect(ALL_KANJI.filter((k) => kanjiLevelOf(k) === 'N5')).toHaveLength(102);
    for (const c of '政党議選戦') expect(n3.some((k) => k.char === c)).toBe(true);
  });

  it('o N5 fica completo: 魚 entrou, e os kanji do N4 mais comuns estão lá', () => {
    const chars = new Set(ALL_KANJI.map((k) => k.char));
    for (const c of '魚家私紙旅')  expect(chars.has(c)).toBe(true);
  });
});
