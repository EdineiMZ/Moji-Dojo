import { findItem } from '@/features/catalog';
import {
  advance,
  answerQuestion,
  buildReviewQuestions,
  isFinished,
  quizResult,
  startQuiz,
  type Rng,
} from '@/features/quiz/quiz';
import { createProgressStore } from '@/store/progressStore';
import { dueChars, DAY_MS } from './srs';

// Data fixa: 22/10/2026 às 10:00.
const NOW = new Date(2026, 9, 22, 10, 0, 0).getTime();
const rng: Rng = () => 0.42;
const isKnown = (c: string) => findItem(c) !== undefined;

const memory = () => {
  const data = new Map<string, string>();
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  };
};

/** Store com あ, い, う na caixa 2, vencidos há um dia. */
function storeWithDueItems() {
  const store = createProgressStore(memory());
  store.getState().replaceProgress({
    srs: Object.fromEntries(['あ', 'い', 'う'].map((c) => [c, { b: 2, due: NOW - DAY_MS }])),
    lessons: {},
    stats: {},
    days: [],
  });
  return store;
}

/**
 * Roda uma sessão. `wrongTimes[c]` = quantas vezes errar o caractere c antes de acertar.
 */
function runSession(
  store: ReturnType<typeof storeWithDueItems>,
  wrongTimes: Record<string, number>,
  extra: boolean,
) {
  const due = dueChars(store.getState().srs, NOW, isKnown);
  let state = startQuiz(buildReviewQuestions(due, rng));
  const errors: Record<string, number> = {};
  while (!isFinished(state)) {
    const q = state.current!;
    const c = q.item.char;
    const mustErr = (errors[c] ?? 0) < (wrongTimes[c] ?? 0);
    const wrongOption = q.options.find((o) => o.char !== c)!;
    const out = answerQuestion(state, mustErr ? wrongOption.char : c, rng);
    if (mustErr) errors[c] = (errors[c] ?? 0) + 1;
    store.getState().recordReviewAnswer(c, out.correct, out.firstTry, extra, NOW);
    state = advance(out.state);
  }
  return quizResult(state);
}

describe('fluxo: revisão espaçada', () => {
  it('acerto de primeira sobe a caixa; erro e depois acerto vence amanhã na caixa 1', () => {
    const store = storeWithDueItems();
    const result = runSession(store, { い: 1, う: 2 }, false);

    expect(result.total).toBe(3);
    expect(result.first).toBe(1); // só あ de primeira
    expect([...result.wrong].sort()).toEqual(['い', 'う']);

    const { srs } = store.getState();
    expect(srs['あ']).toEqual({ b: 3, due: NOW + 7 * DAY_MS });
    expect(srs['い']).toEqual({ b: 1, due: NOW + DAY_MS, l: 2 });
    expect(srs['う']).toEqual({ b: 1, due: NOW + DAY_MS, l: 3 });
  });

  it('depois da sessão não sobra nada vencido e as estatísticas contam cada resposta', () => {
    const store = storeWithDueItems();
    runSession(store, { い: 1 }, false);
    expect(dueChars(store.getState().srs, NOW, isKnown)).toEqual([]);
    expect(store.getState().stats['い']).toEqual({ c: 1, w: 1 });
    expect(store.getState().stats['あ']).toEqual({ c: 1, w: 0 });
    expect(store.getState().days).toEqual(['2026-10-22']);
  });

  it('revisão extra: acertar de primeira não adianta o agendamento', () => {
    const store = storeWithDueItems();
    const before = store.getState().srs['あ'];
    runSession(store, {}, true);
    expect(store.getState().srs['あ']).toEqual(before);
    expect(store.getState().stats['あ']).toEqual({ c: 1, w: 0 });
  });

  it('revisão extra: errar ainda reagenda para a caixa 1', () => {
    const store = storeWithDueItems();
    runSession(store, { い: 1 }, true);
    expect(store.getState().srs['い']).toEqual({ b: 1, due: NOW + DAY_MS, l: 2 });
    expect(store.getState().srs['あ']).toEqual({ b: 2, due: NOW - DAY_MS });
  });
});
