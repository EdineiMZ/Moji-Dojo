import { ALL_EXERCISES, ALL_GRAMMAR } from './grammar';
import { BUILD_N5, GRAMMAR_N5, GRAMMAR_N5_SENTENCE_IDS } from './grammarN5';

describe('gramática N5 (Tatoeba)', () => {
  it('os ids seguem os 10 tópicos iniciais, sem repetir', () => {
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
      expect(t.examples.length).toBeGreaterThanOrEqual(2);
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

  it('quase todo tópico novo tem exercícios para o Montar e as Lacunas', () => {
    const withExercises = new Set(BUILD_N5.map((e) => e.topic));
    const missing = GRAMMAR_N5.filter((t) => !withExercises.has(t.id)).map((t) => t.id);
    // Só ficaria de fora um tópico cujas frases fossem curtas demais para montar (menos de 3 blocos).
    expect(missing).toEqual([]);
    expect(ALL_EXERCISES.length).toBe(26 + BUILD_N5.length);
  });

  it('os exercícios fecham a frase: blocos juntos = exemplo, sem blocos a mais repetidos', () => {
    const examples = new Map(GRAMMAR_N5.flatMap((t) => t.examples).map((e) => [e.pt + '|' + e.romaji, e.jp.replace(/ /g, '')]));
    for (const e of BUILD_N5) {
      expect(e.answer.length).toBeGreaterThanOrEqual(2);
      expect(e.answer.length).toBeLessThanOrEqual(8);
      expect(e.extra).toHaveLength(2);
      expect(e.extra.some((x) => e.answer.includes(x))).toBe(false);
      expect(examples.get(e.pt + '|' + e.romaji)).toBe(e.answer.join(''));
      expect(e.hint.length).toBeGreaterThan(5);
    }
  });
});

describe('furigana dos exemplos', () => {
  const withRuby = GRAMMAR_N5.flatMap((t) => t.examples).filter((e) => e.ruby !== undefined);
  const punctuation = /[\s。、！？!?.,]/g;

  it('a maioria dos exemplos tem a escrita com kanji', () => {
    expect(withRuby.length).toBeGreaterThan(60);
  });

  it('a leitura dos trechos fecha com o kana do exemplo', () => {
    for (const e of withRuby) {
      const read = (e.ruby ?? []).map((s) => s.reading ?? s.text).join('').replace(punctuation, '');
      expect(read).toBe(e.jp.replace(punctuation, ''));
    }
  });

  it('todo trecho com kanji tem leitura; só kanji e números (10 → じゅう) levam leitura', () => {
    const kanji = /[一-鿿]/;
    const readable = /[一-鿿0-9０-９]/;
    for (const s of withRuby.flatMap((e) => e.ruby ?? [])) {
      if (kanji.test(s.text)) expect(s.reading).toBeTruthy();
      if (s.reading !== undefined) expect(s.text).toMatch(readable);
    }
  });
});
