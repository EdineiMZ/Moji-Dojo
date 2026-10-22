import { LESSONS } from '@/data/lessons';
import { DAY_MS } from '@/features/review/srs';
import { answerQuestion, advance, buildLessonQuestions, isFinished, quizResult, startQuiz, type Rng } from '@/features/quiz/quiz';
import { createProgressStore } from '@/store/progressStore';
import { lessonPassed, lessonStatus, nextLessonIndex } from './trail';

// Data fixa: 22/10/2026 às 10:00.
const NOW = new Date(2026, 9, 22, 10, 0, 0).getTime();
const rng: Rng = () => 0.37;

const memory = () => {
  const data = new Map<string, string>();
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  };
};

/** Responde o teste da lição inteira; `mistakes` = quantas perguntas distintas errar de propósito. */
function playTest(lessonIndex: number, mistakes: number, store: ReturnType<typeof createProgressStore>) {
  const lesson = LESSONS.hira[lessonIndex]!;
  let state = startQuiz(buildLessonQuestions(lesson.items, false, rng));
  let remaining = mistakes;
  while (!isFinished(state)) {
    const q = state.current!;
    const wrongNow = remaining > 0 && !q.retry;
    const other = q.options.find((o) => o.char !== q.item.char)!;
    const out = answerQuestion(state, wrongNow ? other.char : q.item.char, rng);
    if (wrongNow) remaining--;
    store.getState().recordAnswer(q.item.char, out.correct, NOW);
    state = advance(out.state);
  }
  return { lesson, result: quizResult(state) };
}

describe('fluxo: fazer o teste da lição 1 de hiragana', () => {
  it('tudo certo conclui a lição, agenda as revisões e abre a próxima', () => {
    const store = createProgressStore(memory());
    const { lesson, result } = playTest(0, 0, store);

    expect(result).toEqual({ total: 10, first: 10, wrong: [] }); // 5 vogais × 2 sentidos
    expect(lessonPassed(result.first, result.total, false)).toBe(true);

    store.getState().completeLesson(lesson.id, lesson.items, false, NOW);
    const s = store.getState();
    expect(lessonStatus('hira', 0, s.lessons)).toBe('done');
    expect(lessonStatus('hira', 1, s.lessons)).toBe('open');
    expect(nextLessonIndex('hira', s.lessons)).toBe(1);
    expect(Object.keys(s.srs).sort()).toEqual([...lesson.items].sort());
    expect(s.srs['あ']).toEqual({ b: 1, due: NOW + DAY_MS });
    expect(s.days).toEqual(['2026-10-22']);
    expect(s.stats['あ']).toEqual({ c: 2, w: 0 });
  });

  it('dois erros em dez perguntas ainda passa (80%), mas o erro fica nas estatísticas', () => {
    const store = createProgressStore(memory());
    const { result } = playTest(0, 2, store);
    expect(result.first).toBe(8);
    expect(result.wrong).toHaveLength(2);
    expect(lessonPassed(result.first, result.total, false)).toBe(true);
    const totalWrong = Object.values(store.getState().stats).reduce((sum, st) => sum + st.w, 0);
    expect(totalWrong).toBe(2);
  });

  it('três erros reprovam: a lição não é concluída e nada entra na revisão', () => {
    const store = createProgressStore(memory());
    const { result } = playTest(0, 3, store);
    expect(result.first).toBe(7);
    expect(lessonPassed(result.first, result.total, false)).toBe(false);
    expect(store.getState().lessons).toEqual({});
    expect(store.getState().srs).toEqual({});
    expect(lessonStatus('hira', 1, store.getState().lessons)).toBe('lock');
  });
});
