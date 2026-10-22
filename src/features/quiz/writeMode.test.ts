import { KANA } from '@/data/kana';
import { ALL_ITEMS, getItem } from '@/features/catalog';
import { isWritable } from '@/features/writing/model';
import {
  advance,
  buildReviewQuestions,
  resolveQuestion,
  startQuiz,
  WRITE_SHARE,
  type Question,
  type Rng,
} from './quiz';

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

const writable = ALL_ITEMS.filter((it) => isWritable(it.char)).map((it) => it.char);
const combos = KANA.filter((k) => [...k.char].length > 1).map((k) => k.char);

/** Roda várias sementes e junta todas as perguntas, para medir proporções com folga estatística. */
const manyRuns = (chars: readonly string[], write: boolean, runs = 30): Question[] =>
  Array.from({ length: runs }, (_, i) => buildReviewQuestions(chars, seeded(i + 1), { write })).flat();

describe('buildReviewQuestions: modo write', () => {
  it('há 245 itens com traços e 84 sem (66 combinações como きゃ + 18 sons estrangeiros como ファ)', () => {
    expect(writable).toHaveLength(245);
    expect(combos).toHaveLength(84);
    expect(writable.length + combos.length).toBe(ALL_ITEMS.length); // 329 itens no total
  });

  it('cerca de 20% das perguntas dos itens com traços viram write', () => {
    const qs = manyRuns(writable, true);
    const share = qs.filter((q) => q.direction === 'write').length / qs.length;
    expect(WRITE_SHARE).toBe(0.2);
    expect(share).toBeGreaterThan(0.17);
    expect(share).toBeLessThan(0.23);
  });

  it('desligado: nenhuma pergunta write', () => {
    expect(manyRuns(writable, false, 5).some((q) => q.direction === 'write')).toBe(false);
  });

  it('as combinações sem traços nunca recebem write, mesmo ligado', () => {
    const qs = manyRuns(combos, true);
    expect(qs.some((q) => q.direction === 'write')).toBe(false);
    expect(qs.every((q) => q.options.length === 4)).toBe(true);
  });

  it('write não tem alternativas e não mostra nada de múltipla escolha', () => {
    const writes = manyRuns(writable, true, 3).filter((q) => q.direction === 'write');
    expect(writes.length).toBeGreaterThan(0);
    for (const q of writes) {
      expect(q.options).toEqual([]);
      expect(q.retry).toBe(false);
      expect(isWritable(q.item.char)).toBe(true);
    }
  });

  it('os outros 80% mantêm o sorteio de antes: kana 60/40 e kanji 70/30 entre k2r e r2k', () => {
    const rest = manyRuns(writable, true).filter((q) => q.direction !== 'write');
    const k2r = (script: string) => {
      const list = rest.filter((q) => q.item.script === script);
      return list.filter((q) => q.direction === 'k2r').length / list.length;
    };
    expect(k2r('hira')).toBeGreaterThan(0.55);
    expect(k2r('hira')).toBeLessThan(0.65);
    expect(k2r('kanji')).toBeGreaterThan(0.65);
    expect(k2r('kanji')).toBeLessThan(0.75);
  });

  it('com o write desligado o resultado é o mesmo de antes (mesma semente, mesmas perguntas)', () => {
    const chars = ['あ', 'か', '水', 'きゃ'];
    const a = buildReviewQuestions(chars, seeded(9)).map((q) => [q.item.char, q.direction]);
    const b = buildReviewQuestions(chars, seeded(9), { write: false }).map((q) => [q.item.char, q.direction]);
    expect(a).toEqual(b);
  });
});

describe('resolveQuestion', () => {
  const writeQuestion = (char: string): Question => ({ item: getItem(char), direction: 'write', options: [], retry: false });

  it('acerto: conta como feito e como primeira tentativa', () => {
    const out = resolveQuestion(startQuiz([writeQuestion('あ')]), true);
    expect(out).toMatchObject({ correct: true, firstTry: true, state: { done: 1, first: 1, wrong: [] } });
  });

  it('erro: a pergunta write volta 2 ou 3 adiante, sem alternativas, marcada como repetição', () => {
    const qs = ['あ', 'い', 'う', 'え', 'お'].map(writeQuestion);
    const out = resolveQuestion(startQuiz(qs), false, seeded(3));
    expect(out).toMatchObject({ correct: false, firstTry: true, state: { done: 0, first: 0, wrong: ['あ'] } });
    const at = out.state.queue.findIndex((q) => q.retry);
    expect([2, 3]).toContain(at);
    expect(out.state.queue[at]).toMatchObject({ direction: 'write', options: [] });
  });

  it('acertar a repetição conta como feito, mas não como primeira tentativa', () => {
    let state = resolveQuestion(startQuiz([writeQuestion('あ')]), false, seeded(1)).state;
    state = advance(state);
    const out = resolveQuestion(state, true);
    expect(out).toMatchObject({ correct: true, firstTry: false, state: { done: 1, first: 0 } });
  });
});
