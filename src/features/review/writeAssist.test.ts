import { STROKES } from '@/data/strokes';
import { findItem } from '@/features/catalog';
import {
  advance,
  buildReviewQuestions,
  isFinished,
  quizResult,
  resolveQuestion,
  startQuiz,
  type Rng,
} from '@/features/quiz/quiz';
import { flattenPath, type Point } from '@/features/strokes/svgPath';
import { hintModel, hintStroke, writeVerdict, type WriteAction } from '@/features/writing/assist';
import { scoreWriting, writePassScore } from '@/features/writing/score';
import { createProgressStore } from '@/store/progressStore';
import { DAY_MS, dueChars, shouldApplyReviewAnswer } from './srs';

// Data fixa: 22/10/2026 às 10:00. O relógio é congelado (fake timers), como em writeFlow.test.ts.
const NOW = new Date(2026, 9, 22, 10, 0, 0).getTime();
const alwaysWrite: Rng = () => 0;
const isKnown = (c: string) => findItem(c) !== undefined;

beforeEach(() => jest.useFakeTimers({ now: NOW }));
afterEach(() => jest.useRealTimers());

const memory = () => {
  const data = new Map<string, string>();
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  };
};

const perfect = (char: string): Point[][] => STROKES[char]!.p.map(flattenPath);
const scribble: Point[][] = [[[5, 5], [20, 8], [10, 25], [30, 30]]];

function storeWith(chars: Record<string, number>) {
  const store = createProgressStore(memory());
  const srs = Object.fromEntries(Object.entries(chars).map(([c, b]) => [c, { b, due: NOW - DAY_MS }]));
  store.getState().replaceProgress({ srs, lessons: {}, stats: {}, days: [] });
  return store;
}

/** Aplica uma ação na pergunta atual como o QuizView faz: veredito → quiz + SRS. */
function act(store: ReturnType<typeof storeWith>, state: ReturnType<typeof startQuiz>, action: WriteAction, extra = false) {
  const char = state.current!.item.char;
  const { correct, hinted } = writeVerdict(action, writePassScore(store.getState().srs[char]?.b));
  const outcome = resolveQuestion(state, correct, alwaysWrite);
  store.getState().recordReviewAnswer(char, outcome.correct, outcome.firstTry, extra, undefined, true, hinted);
  return advance(outcome.state);
}

const check = (char: string, drawing: Point[][], hinted = false): WriteAction => ({
  kind: 'check',
  score: scoreWriting(STROKES[char]!, drawing),
  hinted,
});

const newSession = (store: ReturnType<typeof storeWith>) =>
  startQuiz(buildReviewQuestions(dueChars(store.getState().srs, Date.now(), isKnown), alwaysWrite, { write: true }));

describe('"Não lembro" (desistir) no modo write', () => {
  it('é sempre erro, mesmo com a dica usada', () => {
    const score = scoreWriting(STROKES['あ']!, perfect('あ'));
    expect(writeVerdict({ kind: 'giveUp' }, 70)).toEqual({ correct: false, hinted: false });
    // o "hinted" de uma conferência que passou não vaza para a desistência
    expect(writeVerdict({ kind: 'check', score, hinted: true }, 70)).toEqual({ correct: true, hinted: true });
  });

  it('segue a regra do erro normal: volta para a caixa 1, vence agora e conta um esquecimento', () => {
    const store = storeWith({ あ: 4 });
    act(store, newSession(store), { kind: 'giveUp' });
    expect(store.getState().srs['あ']).toMatchObject({ b: 1, due: NOW, l: 1 });
    expect(store.getState().stats['あ']).toEqual({ c: 0, w: 1 });
  });

  it('é idêntico a errar de verdade: mesmo agendamento que um desenho abaixo do corte', () => {
    const gaveUp = storeWith({ あ: 4 });
    const failed = storeWith({ あ: 4 });
    act(gaveUp, newSession(gaveUp), { kind: 'giveUp' });
    act(failed, newSession(failed), check('あ', scribble));
    expect(gaveUp.getState().srs).toEqual(failed.getState().srs);
    expect(gaveUp.getState().stats).toEqual(failed.getState().stats);
  });

  it('a pergunta reaparece 2 ou 3 posições depois; acertar a repetição vence amanhã, na caixa 1', () => {
    const store = storeWith({ あ: 4, い: 2, う: 2, え: 2, お: 2 });
    let state = newSession(store);
    const target = state.current!.item.char; // a ordem é sorteada: desiste de quem vier primeiro
    const boxBefore = store.getState().srs[target]!.b;
    state = act(store, state, { kind: 'giveUp' });

    const order: string[] = [];
    let retryAt = -1;
    while (!isFinished(state)) {
      const q = state.current!;
      order.push(q.item.char + (q.retry ? '*' : ''));
      if (q.retry) retryAt = order.length; // 1 = logo a seguinte
      state = act(store, state, check(q.item.char, perfect(q.item.char)));
    }
    // 2 ou 3 posições depois na fila = a 2ª ou 3ª pergunta mostrada depois da desistência
    expect(retryAt).toBeGreaterThanOrEqual(2);
    expect(retryAt).toBeLessThanOrEqual(3);
    expect(order).toContain(`${target}*`);
    expect(quizResult(state).wrong).toEqual([target]);
    expect(boxBefore).toBeGreaterThan(0);
    // igual ao erro normal (ver writeFlow.test.ts): o erro e a repetição acertada contam esquecimentos
    expect(store.getState().srs[target]).toMatchObject({ b: 1, l: 2 });
    expect(store.getState().srs[target]!.due).toBeGreaterThanOrEqual(NOW + DAY_MS);
  });

  it('na revisão extra, desistir também mexe no agendamento (erro sempre conta)', () => {
    const store = storeWith({ あ: 4 });
    act(store, newSession(store), { kind: 'giveUp' }, true);
    expect(store.getState().srs['あ']).toMatchObject({ b: 1, due: NOW });
  });

  it('desistir de novo na repetição conta outro esquecimento', () => {
    const store = storeWith({ あ: 4 });
    let state = newSession(store);
    state = act(store, state, { kind: 'giveUp' });
    expect(state.current!.retry).toBe(true);
    act(store, state, { kind: 'giveUp' });
    expect(store.getState().srs['あ']).toMatchObject({ b: 1, l: 2 });
    expect(store.getState().stats['あ']).toEqual({ c: 0, w: 2 });
  });
});

describe('"Dica" no modo write', () => {
  it('mostra só o primeiro traço', () => {
    const model = STROKES['日']!;
    const hint = hintModel(model);
    expect(hint.p).toEqual([model.p[0]]);
    expect(hint.n).toEqual([model.n[0]]);
    expect(hintStroke(model)).toEqual(flattenPath(model.p[0]!));
    expect(hintStroke({ p: [], n: [] })).toBeNull();
  });

  it('o traço da dica mais o resto de memória pontua como o desenho perfeito', () => {
    const model = STROKES['水']!;
    const drawing = [hintStroke(model)!, ...perfect('水').slice(1)];
    expect(scoreWriting(model, drawing).pct).toBe(scoreWriting(model, perfect('水')).pct);
  });

  it('acertar com a dica conta como acerto, mas a caixa não avança nem o agendamento muda', () => {
    const store = storeWith({ あ: 2 });
    const before = store.getState().srs['あ'];
    const state = act(store, newSession(store), check('あ', perfect('あ'), true));
    expect(isFinished(state)).toBe(true);
    expect(quizResult(state)).toEqual({ total: 1, first: 1, wrong: [] });
    expect(store.getState().stats['あ']).toEqual({ c: 1, w: 0 });
    expect(store.getState().srs['あ']).toEqual(before);
    expect(store.getState().days).toEqual(['2026-10-22']);
  });

  it('sem a dica, o mesmo desenho avança a caixa (a diferença é só a dica)', () => {
    const store = storeWith({ あ: 2 });
    act(store, newSession(store), check('あ', perfect('あ'), false));
    expect(store.getState().srs['あ']!.b).toBeGreaterThanOrEqual(3);
  });

  it('usar a dica e errar não é poupado: volta para a caixa 1 como qualquer erro', () => {
    const store = storeWith({ あ: 4 });
    const action = check('あ', scribble, true);
    expect(writeVerdict(action, 70)).toEqual({ correct: false, hinted: false });
    act(store, newSession(store), action);
    expect(store.getState().srs['あ']).toMatchObject({ b: 1, due: NOW, l: 1 });
  });

  it('na revisão extra também não mexe no agendamento', () => {
    const store = storeWith({ あ: 2 });
    const before = store.getState().srs['あ'];
    act(store, newSession(store), check('あ', perfect('あ'), true), true);
    expect(store.getState().srs['あ']).toEqual(before);
  });

  it('acertar a repetição com a dica segue a regra normal (já está na caixa 1, não há o que avançar)', () => {
    const store = storeWith({ あ: 4 });
    let state = newSession(store);
    state = act(store, state, { kind: 'giveUp' });
    act(store, state, check('あ', perfect('あ'), true));
    expect(store.getState().srs['あ']).toMatchObject({ b: 1, l: 2 });
    expect(store.getState().srs['あ']!.due).toBeGreaterThanOrEqual(NOW + DAY_MS);
  });

  it('a regra pura: só "acerto de primeira com dica" deixa de reagendar', () => {
    // [extra, ok, firstTry, hinted] → reagenda?
    const table: [boolean, boolean, boolean, boolean, boolean][] = [
      [false, true, true, false, true],
      [false, true, true, true, false],
      [false, true, false, true, true],
      [false, false, true, true, true],
      [true, true, true, true, false],
      [true, true, true, false, false],
      [true, false, true, true, true],
    ];
    for (const [extra, ok, firstTry, hinted, expected] of table) {
      expect(shouldApplyReviewAnswer(extra, ok, firstTry, hinted)).toBe(expected);
    }
    // sem o 4º argumento, o comportamento antigo é o mesmo
    expect(shouldApplyReviewAnswer(false, true, true)).toBe(true);
  });
});
