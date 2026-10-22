import { MINIMAL_PAIRS } from '@/data/sounds';
import { ALL_ITEMS, getItem } from '@/features/catalog';
import { buildFeedback, mnemonicFor } from './explain';
import { buildEarQuestions, buildPairQuestions, EAR_QUESTIONS, isStudyItem, type Rng } from './quiz';

/** Gerador pseudoaleatório com semente (mulberry32). */
function seeded(seed: number): Rng {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const hira = ALL_ITEMS.filter((it) => it.script === 'hira' && it.group === 'base');

describe('buildEarQuestions (kana)', () => {
  it('10 perguntas de áudio, cada uma com 4 caracteres diferentes e a resposta entre eles', () => {
    const qs = buildEarQuestions(hira, seeded(1));
    expect(qs).toHaveLength(EAR_QUESTIONS);
    for (const q of qs) {
      expect(q.direction).toBe('audio');
      expect(q.options).toHaveLength(4);
      expect(q.options.map((o) => o.char)).toContain(q.item.char);
      expect(new Set(q.options.map((o) => o.label)).size).toBe(4);
    }
  });

  it('com pool grande não repete o mesmo caractere na rodada', () => {
    const chars = buildEarQuestions(hira, seeded(2)).map((q) => q.item.char);
    expect(new Set(chars).size).toBe(EAR_QUESTIONS);
  });

  it('com pool pequeno repete o ciclo, mas completa as 10 perguntas', () => {
    const small = ['あ', 'い', 'う', 'え', 'お'].map(getItem);
    const qs = buildEarQuestions(small, seeded(3));
    expect(qs).toHaveLength(EAR_QUESTIONS);
    for (const c of ['あ', 'い', 'う', 'え', 'お']) expect(qs.filter((q) => q.item.char === c)).toHaveLength(2);
    expect(qs.every((q) => q.options.length === 4)).toBe(true); // completa com outros kana
  });

  it('pool vazio não gera perguntas', () => {
    expect(buildEarQuestions([], seeded(1))).toEqual([]);
  });
});

describe('buildPairQuestions (pares difíceis)', () => {
  it('10 perguntas com as duas palavras do par como alternativas', () => {
    const qs = buildPairQuestions(MINIMAL_PAIRS, seeded(4));
    expect(qs).toHaveLength(EAR_QUESTIONS);
    for (const q of qs) {
      expect(q.direction).toBe('audio');
      expect(q.options).toHaveLength(2);
      expect(q.options.map((o) => o.char)).toContain(q.item.char);
      expect(q.options[0]?.char).not.toBe(q.options[1]?.char);
      expect(q.options.every((o) => !isStudyItem(o))).toBe(true);
    }
  });

  it('as 12 palavras de cada par aparecem quando pedimos 12 perguntas', () => {
    const qs = buildPairQuestions(MINIMAL_PAIRS, seeded(5), 12);
    const pairs = qs.map((q) => q.options.map((o) => o.char).sort().join('|'));
    expect(new Set(pairs).size).toBe(12);
  });

  it('o alvo sorteado varia entre a primeira e a segunda palavra', () => {
    const firsts = new Set(MINIMAL_PAIRS.map((p) => p.first.jp));
    const targets = buildPairQuestions(MINIMAL_PAIRS, seeded(6), 12).map((q) => firsts.has(q.item.char));
    expect(targets).toContain(true);
    expect(targets).toContain(false);
  });

  it('o texto de feedback explica o par sem inventar dica de memorização', () => {
    const [q] = buildPairQuestions(MINIMAL_PAIRS.slice(0, 1), seeded(7), 1);
    const fb = buildFeedback(q!.item, false);
    expect(fb.text).toBe(`Era ${q!.item.char} = ${q!.item.label}`);
    expect(fb).not.toHaveProperty('hint');
    expect(mnemonicFor(q!.item)).toBeUndefined();
  });
});
