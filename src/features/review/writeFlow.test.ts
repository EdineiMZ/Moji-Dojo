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
import { isPassing, scoreWriting, WRITE_PASS_SCORE } from '@/features/writing/score';
import { createProgressStore } from '@/store/progressStore';
import { DAY_MS, dueChars } from './srs';

// Data fixa: 22/10/2026 às 10:00. O relógio do sistema é congelado nela (fake timers),
// então as ações do store usam Date.now() sem receber a hora de fora.
const NOW = new Date(2026, 9, 22, 10, 0, 0).getTime();
const alwaysWrite: Rng = () => 0; // 0 < 20%: toda pergunta de item com traços vira write
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

/** Store com あ na caixa 2, vencido há um dia. */
function storeWith(char = 'あ', box = 2) {
  const store = createProgressStore(memory());
  store.getState().replaceProgress({ srs: { [char]: { b: box, due: NOW - DAY_MS } }, lessons: {}, stats: {}, days: [] });
  return store;
}

/**
 * Roda uma sessão de revisão só com perguntas write. `drawings` diz como o usuário desenha cada
 * tentativa do caractere (na ordem); a nota decide acerto/erro e alimenta o SRS como o app faz.
 */
function playWriteSession(
  store: ReturnType<typeof storeWith>,
  char: string,
  drawings: readonly (readonly Point[][])[],
  extra = false,
) {
  const due = dueChars(store.getState().srs, Date.now(), isKnown);
  let state = startQuiz(buildReviewQuestions(due, alwaysWrite, { write: true }));
  let attempt = 0;
  while (!isFinished(state)) {
    const q = state.current!;
    expect(q.direction).toBe('write');
    const score = scoreWriting(STROKES[q.item.char]!, drawings[attempt] ?? perfect(char));
    attempt++;
    const outcome = resolveQuestion(state, isPassing(score), alwaysWrite);
    store.getState().recordReviewAnswer(q.item.char, outcome.correct, outcome.firstTry, extra);
    state = advance(outcome.state);
  }
  return quizResult(state);
}

describe('modo write + SRS (relógio congelado)', () => {
  it('desenho correto de primeira: sobe uma caixa e a revisão vence em 7 dias', () => {
    const store = storeWith('あ', 2);
    const result = playWriteSession(store, 'あ', [perfect('あ')]);
    expect(result).toEqual({ total: 1, first: 1, wrong: [] });
    expect(store.getState().srs['あ']).toEqual({ b: 3, due: NOW + 7 * DAY_MS });
    expect(store.getState().stats['あ']).toEqual({ c: 1, w: 0 });
  });

  it('desenho errado: volta para a caixa 1 e fica vencido agora; ao acertar a repetição, vence amanhã', () => {
    const store = storeWith('あ', 4);
    // 1ª tentativa: rabisco (erro, caixa 1 / vence agora); 2ª: perfeito (repetição, caixa 1 / vence amanhã)
    const afterWrong = createProgressStore(memory());
    afterWrong.getState().replaceProgress(store.getState());
    afterWrong.getState().recordReviewAnswer('あ', false, true, false);
    expect(afterWrong.getState().srs['あ']).toEqual({ b: 1, due: NOW });

    const result = playWriteSession(store, 'あ', [scribble, perfect('あ')]);
    expect(result).toEqual({ total: 1, first: 0, wrong: ['あ'] });
    expect(store.getState().srs['あ']).toEqual({ b: 1, due: NOW + DAY_MS });
    expect(store.getState().stats['あ']).toEqual({ c: 1, w: 1 });
  });

  it('o corte é 70%: um desenho logo abaixo reprova e um logo acima passa', () => {
    const model = STROKES['日']!;
    const passing = scoreWriting(model, perfect('日'));
    const failing = scoreWriting(model, perfect('日').slice(0, 2)); // faltam traços
    expect(passing.pct).toBeGreaterThanOrEqual(WRITE_PASS_SCORE);
    expect(failing.pct).toBeLessThan(WRITE_PASS_SCORE);
    expect(isPassing(passing)).toBe(true);
    expect(isPassing(failing)).toBe(false);
  });

  it('ordem e direção errados não mudam o resultado: o desenho com traço invertido ainda acerta', () => {
    const store = storeWith('日', 2);
    const strokes = perfect('日');
    strokes[0] = [...strokes[0]!].reverse();
    expect(scoreWriting(STROKES['日']!, strokes).strokes[0]).toBe('rev');

    const result = playWriteSession(store, '日', [strokes]);
    expect(result.first).toBe(1);
    expect(store.getState().srs['日']?.b).toBe(3);
  });

  it('funciona igual para kanji', () => {
    const store = storeWith('水', 1);
    playWriteSession(store, '水', [perfect('水')]);
    expect(store.getState().srs['水']).toEqual({ b: 2, due: NOW + 3 * DAY_MS });
  });

  it('na revisão extra, acertar o desenho de primeira não mexe no agendamento', () => {
    const store = storeWith('あ', 2);
    const before = store.getState().srs['あ'];
    playWriteSession(store, 'あ', [perfect('あ')], true);
    expect(store.getState().srs['あ']).toEqual(before);
  });

  it('o dia de estudo é marcado pela data congelada', () => {
    const store = storeWith('あ', 2);
    playWriteSession(store, 'あ', [perfect('あ')]);
    expect(store.getState().days).toEqual(['2026-10-22']);
  });
});
