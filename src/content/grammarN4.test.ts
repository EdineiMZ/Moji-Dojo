import { ALL_GRAMMAR } from './grammar';
import { BUILD_N4, GRAMMAR_N4, GRAMMAR_N4_SENTENCE_IDS } from './grammarN4';
import { GRAMMAR_N5_SENTENCE_IDS } from './grammarN5';

describe('gramática N4 (Tatoeba)', () => {
  it('os ids são n4-1, n4-2... e vêm depois dos do N5, sem repetir', () => {
    expect(GRAMMAR_N4.map((t) => t.id)).toEqual(Array.from({ length: GRAMMAR_N4.length }, (_, i) => `n4-${i + 1}`));
    const ids = ALL_GRAMMAR.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    const first = ids.indexOf(GRAMMAR_N4[0]?.id ?? '');
    expect(ids.slice(first, first + GRAMMAR_N4.length)).toEqual(GRAMMAR_N4.map((t) => t.id));
  });

  it('todo tópico tem texto, esquema, dica e exemplos completos', () => {
    expect(GRAMMAR_N4.length).toBeGreaterThanOrEqual(7);
    for (const t of GRAMMAR_N4) {
      expect(t.title.length).toBeGreaterThan(5);
      expect(t.body.length).toBeGreaterThan(0);
      expect(t.pattern).toBeTruthy();
      expect(t.examples.length).toBeGreaterThanOrEqual(3);
      for (const e of t.examples) {
        expect(e.jp).toMatch(/[぀-ヿ]/);
        expect(e.romaji).toMatch(/^[a-zāīūēō' ]+$/);
        expect(e.pt.length).toBeGreaterThan(3);
      }
    }
  });

  it('não sobra marcação do gerador no texto', () => {
    expect(JSON.stringify(GRAMMAR_N4)).not.toMatch(/\*\*|__|~|\|/);
  });

  it('as frases do Tatoeba não se repetem entre os níveis e estão listadas para o crédito', () => {
    expect(new Set(GRAMMAR_N4_SENTENCE_IDS).size).toBe(GRAMMAR_N4_SENTENCE_IDS.length);
    expect(GRAMMAR_N4_SENTENCE_IDS).toHaveLength(GRAMMAR_N4.flatMap((t) => t.examples).length);
    const n5 = new Set(GRAMMAR_N5_SENTENCE_IDS);
    expect(GRAMMAR_N4_SENTENCE_IDS.filter((id) => n5.has(id))).toEqual([]);
  });

  it('todo tópico tem exercícios para o Montar e as Lacunas, e eles fecham a frase', () => {
    expect(new Set(BUILD_N4.map((e) => e.topic))).toEqual(new Set(GRAMMAR_N4.map((t) => t.id)));
    const examples = new Map(GRAMMAR_N4.flatMap((t) => t.examples).map((e) => [e.pt + '|' + e.romaji, e.jp.replace(/ /g, '')]));
    for (const e of BUILD_N4) expect(examples.get(e.pt + '|' + e.romaji)).toBe(e.answer.join(''));
  });
});
