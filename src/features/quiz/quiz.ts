import { ALL_ITEMS, getItem, type StudyItem } from '@/features/catalog';

/** Gerador de números em [0, 1). Injetável para os testes serem determinísticos. */
export type Rng = () => number;

/** k2r: mostra o caractere, responde o som/significado. r2k: o contrário. */
export type Direction = 'k2r' | 'r2k';

export interface Question {
  item: StudyItem;
  direction: Direction;
  /** Alternativas já embaralhadas (a certa está entre elas). */
  options: readonly StudyItem[];
  /** Pergunta repetida por ter sido errada antes. */
  retry: boolean;
}

export function shuffle<T>(list: readonly T[], rng: Rng = Math.random): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j] as T, a[i] as T];
  }
  return a;
}

/**
 * Item certo + 3 distratores. Prefere o `pool`; se faltar, completa com itens do
 * mesmo grupo e depois da mesma escrita. Nunca repete a mesma resposta na tela.
 */
export function buildOptions(item: StudyItem, pool: readonly StudyItem[], rng: Rng = Math.random): StudyItem[] {
  const usable = (x: StudyItem) => x.char !== item.char && x.label !== item.label;
  let candidates = shuffle(pool.filter(usable), rng);
  if (candidates.length < 3) {
    const sameGroup = ALL_ITEMS.filter(
      (x) => x.script === item.script && x.group === item.group && usable(x) && !candidates.includes(x),
    );
    candidates = candidates.concat(shuffle(sameGroup, rng));
  }
  if (candidates.length < 3) {
    const sameScript = ALL_ITEMS.filter((x) => x.script === item.script && usable(x) && !candidates.includes(x));
    candidates = candidates.concat(shuffle(sameScript, rng));
  }
  const seen = new Set([item.label]);
  const picked: StudyItem[] = [];
  for (const c of candidates) {
    if (picked.length === 3) break;
    if (seen.has(c.label)) continue;
    seen.add(c.label);
    picked.push(c);
  }
  return shuffle([item, ...picked], rng);
}

const REVIEW_LESSON_MAX = 20;

/**
 * Teste de uma lição. Lição normal: cada caractere nos dois sentidos.
 * Lição de revisão: até 20 caracteres, só no sentido caractere → som.
 */
export function buildLessonQuestions(chars: readonly string[], isReview: boolean, rng: Rng = Math.random): Question[] {
  const items = chars.map(getItem);
  const make = (item: StudyItem, direction: Direction): Question => ({
    item,
    direction,
    options: buildOptions(item, items, rng),
    retry: false,
  });
  if (isReview) {
    return shuffle(items, rng)
      .slice(0, REVIEW_LESSON_MAX)
      .map((it) => make(it, 'k2r'));
  }
  return shuffle(
    items.flatMap((it) => [make(it, 'k2r'), make(it, 'r2k')]),
    rng,
  );
}

/** Revisão espaçada: sentido sorteado (kanji prefere ver o caractere) e distratores do mesmo grupo. */
export function buildReviewQuestions(chars: readonly string[], rng: Rng = Math.random): Question[] {
  const questions = chars.map((c): Question => {
    const item = getItem(c);
    const direction: Direction = rng() < (item.script === 'kanji' ? 0.7 : 0.6) ? 'k2r' : 'r2k';
    const pool = ALL_ITEMS.filter((x) => x.script === item.script && x.group === item.group);
    return { item, direction, options: buildOptions(item, pool, rng), retry: false };
  });
  return shuffle(questions, rng);
}

// ---------- Sessão de quiz (estado imutável) ----------

export interface QuizState {
  /** Pergunta na tela; null quando acabou. */
  current: Question | null;
  /** Próximas perguntas. */
  queue: readonly Question[];
  total: number;
  /** Perguntas distintas já acertadas. */
  done: number;
  /** Acertos na primeira tentativa. */
  first: number;
  /** Caracteres que foram errados (sem repetição). */
  wrong: readonly string[];
}

export interface QuizResult {
  total: number;
  first: number;
  wrong: readonly string[];
}

export function startQuiz(questions: readonly Question[]): QuizState {
  const [current = null, ...queue] = questions;
  return { current, queue, total: questions.length, done: 0, first: 0, wrong: [] };
}

export interface AnswerOutcome {
  state: QuizState;
  correct: boolean;
  /** Falso quando a pergunta já era uma repetição de uma errada. */
  firstTry: boolean;
}

/**
 * Registra a resposta da pergunta atual. Errar recoloca a pergunta 2 ou 3 posições
 * adiante, com as alternativas embaralhadas. Chame `advance` para ir à seguinte.
 */
export function answerQuestion(state: QuizState, chosenChar: string, rng: Rng = Math.random): AnswerOutcome {
  const q = state.current;
  if (!q) throw new Error('Quiz já terminou');
  const correct = chosenChar === q.item.char;
  const firstTry = !q.retry;
  if (correct) {
    return {
      state: { ...state, done: state.done + 1, first: state.first + (firstTry ? 1 : 0) },
      correct,
      firstTry,
    };
  }
  const retry: Question = { ...q, retry: true, options: shuffle(q.options, rng) };
  const at = Math.min(state.queue.length, 2 + Math.floor(rng() * 2));
  const queue = [...state.queue.slice(0, at), retry, ...state.queue.slice(at)];
  const wrong = state.wrong.includes(q.item.char) ? state.wrong : [...state.wrong, q.item.char];
  return { state: { ...state, queue, wrong }, correct, firstTry };
}

/** Passa para a próxima pergunta (`current` fica null ao acabar). */
export function advance(state: QuizState): QuizState {
  const [current = null, ...queue] = state.queue;
  return { ...state, current, queue };
}

export const isFinished = (state: QuizState): boolean => state.current === null;

export const quizResult = (state: QuizState): QuizResult => ({
  total: state.total,
  first: state.first,
  wrong: state.wrong,
});
