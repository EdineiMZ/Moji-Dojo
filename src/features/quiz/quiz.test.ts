import { LESSONS } from '@/data/lessons';
import { ALL_ITEMS, getItem } from '@/features/catalog';
import {
  advance,
  answerQuestion,
  buildLessonQuestions,
  buildOptions,
  buildReviewQuestions,
  isFinished,
  quizResult,
  startQuiz,
  type Question,
  type QuizState,
  type Rng,
} from './quiz';

/** Gerador pseudoaleatório com semente (mulberry32): mesma semente, mesma sequência. */
function seeded(seed: number): Rng {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const lessonChars = (id: string) => LESSONS.hira.find((l) => l.id === id)!.items;

describe('buildOptions', () => {
  it('devolve 4 alternativas com a certa e sem respostas repetidas', () => {
    for (let seed = 1; seed <= 20; seed++) {
      const item = getItem('か');
      const pool = lessonChars('hira:L1').map(getItem);
      const options = buildOptions(item, pool, seeded(seed));
      expect(options).toHaveLength(4);
      expect(options).toContain(item);
      expect(new Set(options.map((o) => o.label)).size).toBe(4);
    }
  });

  it('completa com itens da mesma escrita quando o pool é pequeno', () => {
    const item = getItem('あ');
    const options = buildOptions(item, [item, getItem('い')], seeded(3));
    expect(options).toHaveLength(4);
    expect(options.every((o) => o.script === 'hira')).toBe(true);
  });

  it('じ e ぢ (ambos "ji") nunca aparecem juntos', () => {
    const pool = ALL_ITEMS.filter((x) => x.script === 'hira');
    for (let seed = 1; seed <= 30; seed++) {
      const labels = buildOptions(getItem('じ'), pool, seeded(seed)).map((o) => o.label);
      expect(new Set(labels).size).toBe(labels.length);
    }
  });
});

describe('buildLessonQuestions', () => {
  it('lição normal: cada caractere nos dois sentidos', () => {
    const chars = lessonChars('hira:L0');
    const qs = buildLessonQuestions(chars, false, seeded(1));
    expect(qs).toHaveLength(chars.length * 2);
    for (const c of chars) {
      expect(qs.filter((q) => q.item.char === c).map((q) => q.direction).sort()).toEqual(['k2r', 'r2k']);
    }
  });

  it('lição de revisão: no máximo 20 perguntas, só caractere → som', () => {
    const review = LESSONS.hira.find((l) => l.review)!;
    const qs = buildLessonQuestions(review.items, true, seeded(1));
    expect(qs).toHaveLength(20);
    expect(qs.every((q) => q.direction === 'k2r')).toBe(true);
    expect(new Set(qs.map((q) => q.item.char)).size).toBe(20);
  });
});

describe('buildReviewQuestions', () => {
  it('uma pergunta por caractere, com alternativas do mesmo grupo', () => {
    const qs = buildReviewQuestions(['か', '水'], seeded(5));
    expect(qs).toHaveLength(2);
    for (const q of qs) {
      expect(q.options).toHaveLength(4);
      expect(q.options.every((o) => o.script === q.item.script)).toBe(true);
    }
  });
});

describe('sessão de quiz', () => {
  const q = (char: string): Question => {
    const item = getItem(char);
    return { item, direction: 'k2r', options: buildOptions(item, [item], seeded(1)), retry: false };
  };
  const five = ['あ', 'い', 'う', 'え', 'お'].map(q);

  it('começa na primeira pergunta', () => {
    const s = startQuiz(five);
    expect(s.current?.item.char).toBe('あ');
    expect(s.queue).toHaveLength(4);
    expect(s.total).toBe(5);
  });

  it('acerto de primeira conta como done e first', () => {
    const { state, correct, firstTry } = answerQuestion(startQuiz(five), 'あ');
    expect(correct).toBe(true);
    expect(firstTry).toBe(true);
    expect(state).toMatchObject({ done: 1, first: 1, wrong: [] });
    expect(state.queue).toHaveLength(4);
  });

  it('erro não conta como done e a pergunta volta 2 ou 3 posições adiante', () => {
    for (let seed = 1; seed <= 20; seed++) {
      const { state, correct } = answerQuestion(startQuiz(five), 'い', seeded(seed));
      expect(correct).toBe(false);
      expect(state).toMatchObject({ done: 0, first: 0, wrong: ['あ'] });
      expect(state.queue).toHaveLength(5);
      const at = state.queue.findIndex((x) => x.retry);
      expect([2, 3]).toContain(at);
      expect(state.queue[at]?.item.char).toBe('あ');
    }
  });

  it('com a fila curta, a repetição vai para o fim', () => {
    const { state } = answerQuestion(startQuiz([q('あ'), q('い')]), 'い', seeded(1));
    expect(state.queue.map((x) => [x.item.char, x.retry])).toEqual([
      ['い', false],
      ['あ', true],
    ]);
  });

  it('acertar a repetição conta como done, mas não como first', () => {
    let s: QuizState = startQuiz([q('あ')]);
    s = answerQuestion(s, 'い', seeded(1)).state;
    s = advance(s);
    expect(s.current?.retry).toBe(true);
    const out = answerQuestion(s, 'あ', seeded(1));
    expect(out.firstTry).toBe(false);
    expect(out.state).toMatchObject({ done: 1, first: 0, wrong: ['あ'] });
  });

  it('o mesmo caractere errado duas vezes aparece uma só vez em wrong', () => {
    let s: QuizState = startQuiz([q('あ')]);
    s = answerQuestion(s, 'い', seeded(1)).state;
    s = advance(s);
    s = answerQuestion(s, 'い', seeded(2)).state;
    expect(s.wrong).toEqual(['あ']);
  });

  it('sessão completa: errar uma e acertar o resto dá 80% (4 de 5) na primeira', () => {
    let s: QuizState = startQuiz(five);
    let mistakes = 0;
    while (!isFinished(s)) {
      const current = s.current!;
      const wrongOnce = current.item.char === 'う' && !current.retry;
      const pick = wrongOnce ? 'あ' : current.item.char;
      s = answerQuestion(s, pick, seeded(7)).state;
      if (wrongOnce) mistakes++;
      s = advance(s);
    }
    expect(mistakes).toBe(1);
    expect(quizResult(s)).toEqual({ total: 5, first: 4, wrong: ['う'] });
  });

  it('responder depois do fim é um erro', () => {
    const done = advance(answerQuestion(startQuiz([q('あ')]), 'あ').state);
    expect(isFinished(done)).toBe(true);
    expect(() => answerQuestion(done, 'あ')).toThrow();
  });
});
