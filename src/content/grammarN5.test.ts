import { BUILD_EXERCISES } from '@/data/exercises';
import { ALL_GRAMMAR } from './grammar';
import { GRAMMAR_N5, GRAMMAR_N5_SENTENCE_IDS } from './grammarN5';

describe('gramática N5 (Tatoeba)', () => {
  it('os ids seguem os 10 tópicos do protótipo, sem repetir', () => {
    const ids = ALL_GRAMMAR.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.slice(0, 10)).toEqual(Array.from({ length: 10 }, (_, i) => `g${i + 1}`));
    expect(GRAMMAR_N5.map((t) => t.id)).toEqual(Array.from({ length: GRAMMAR_N5.length }, (_, i) => `g${i + 11}`));
    expect(ALL_GRAMMAR.length).toBeGreaterThanOrEqual(30);
  });

  it('todo tópico tem texto, esquema e exemplos completos', () => {
    for (const t of GRAMMAR_N5) {
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
    const text = JSON.stringify(GRAMMAR_N5);
    expect(text).not.toMatch(/\*\*|__|~|\|/);
  });

  it('os exemplos são escritos em kana (sem kanji), como no resto do app', () => {
    for (const e of GRAMMAR_N5.flatMap((t) => t.examples)) expect(e.jp).not.toMatch(/[一-鿿]/);
  });

  it('as frases usadas não se repetem e estão listadas para o crédito', () => {
    expect(new Set(GRAMMAR_N5_SENTENCE_IDS).size).toBe(GRAMMAR_N5_SENTENCE_IDS.length);
    expect(GRAMMAR_N5_SENTENCE_IDS).toHaveLength(GRAMMAR_N5.flatMap((t) => t.examples).length);
  });

  it('os tópicos novos ainda não têm exercício no Montar (só os dez do protótipo)', () => {
    const withExercises = new Set(BUILD_EXERCISES.map((e) => e.topic));
    for (const t of GRAMMAR_N5) expect(withExercises.has(t.id)).toBe(false);
  });
});
