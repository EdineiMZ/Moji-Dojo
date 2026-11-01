import type { MinimalPair, PhraseExample } from '@/data/types';
import { ALL_ITEMS, findItem, getItem, type StudyItem } from '@/features/catalog';
import { lookalikesOf } from '@/features/chart/lookalikes';
import { isWritable } from '@/features/writing/model';

/** Gerador de números em [0, 1). Injetável para os testes serem determinísticos. */
export type Rng = () => number;

/**
 * k2r: mostra o caractere, responde o som/significado. r2k: o contrário.
 * audio: toca o som e o usuário escolhe o caractere (ou a palavra, nos pares difíceis).
 * write: mostra o significado e o som, e o usuário desenha o caractere (sem alternativas).
 */
export type Direction = 'k2r' | 'r2k' | 'audio' | 'write';

/** Palavra solta: de um par difícil (treino de ouvido) ou do vocabulário. */
export interface PairItem {
  /** A palavra em japonês. */
  char: string;
  /** Romaji e tradução, para a explicação depois da resposta. */
  label: string;
  script: 'pair';
  /** Leitura em kana, quando a palavra tem kanji: é o que a voz fala e o que a explicação mostra. */
  reading?: string;
  /** Romaji da palavra, para a ajuda "Ver romaji" antes de responder. */
  romaji?: string;
  /** Cartão de revisão a que a pergunta pertence, quando o item não basta para saber (ex.: verbo + forma). */
  key?: string;
  /** Frase mostrada como explicação depois da resposta, no lugar de "palavra = rótulo". */
  explain?: string;
  /** Dica mostrada só quando a pessoa erra. */
  hint?: string;
  /** Por que cada alternativa errada está errada, pelo texto dela (`char`). Mostrado quando ela é escolhida. */
  whyWrong?: Readonly<Record<string, string>>;
}

/** O que uma pergunta pode ter como resposta: um caractere estudado ou uma palavra de par difícil. */
export type QuizItem = StudyItem | PairItem;

export const isStudyItem = (item: QuizItem): item is StudyItem => item.script !== 'pair';

export interface Question {
  item: QuizItem;
  direction: Direction;
  /** Alternativas já embaralhadas (a certa está entre elas). Vazio na direção write. */
  options: readonly QuizItem[];
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
 * Item certo + 3 distratores. Os sósias visuais do item (さ com ち e き) entram primeiro, até 2, porque é essa
 * diferença que precisa ser treinada; o resto vem do `pool` e, se faltar, de itens do mesmo grupo e depois da
 * mesma escrita. Nunca repete a mesma resposta na tela.
 */
/** Quantos sósias visuais entram, no máximo, nas alternativas. */
const MAX_LOOKALIKES = 2;

export function buildOptions(
  item: StudyItem,
  pool: readonly StudyItem[],
  rng: Rng = Math.random,
  known?: ReadonlySet<string>,
): StudyItem[] {
  const usable = (x: StudyItem) => x.char !== item.char && x.label !== item.label;
  const twins = shuffle(
    lookalikesOf(item.char)
      .map((c) => findItem(c))
      .filter(
        (x): x is StudyItem =>
          x !== undefined && x.script === item.script && usable(x) && (known?.has(x.char) || pool.includes(x)),
      ),
    rng,
  ).slice(0, MAX_LOOKALIKES);
  let candidates = [...twins, ...shuffle(pool.filter((x) => usable(x) && !twins.includes(x)), rng)];
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
export function buildLessonQuestions(
  chars: readonly string[],
  isReview: boolean,
  rng: Rng = Math.random,
  known?: ReadonlySet<string>,
): Question[] {
  const items = chars.map(getItem);
  const make = (item: StudyItem, direction: Direction): Question => ({
    item,
    direction,
    options: buildOptions(item, items, rng, known),
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

/** Fatia das perguntas de revisão que viram "write" (nos itens que têm traços). */
export const WRITE_SHARE = 0.2;

export interface ReviewOptions {
  /** Inclui a direção write (desenhar o símbolo). Itens sem traços, como きゃ, nunca a recebem. */
  write?: boolean;
  /** Caracteres que a pessoa já conhece: os sósias deles podem aparecer como alternativa mesmo fora do grupo. */
  known?: ReadonlySet<string>;
}

/**
 * Revisão espaçada: cerca de 20% das perguntas dos itens com traços viram write (se ligado);
 * o resto sorteia o sentido como antes (kanji prefere ver o caractere) com distratores do mesmo grupo.
 */
export function buildReviewQuestions(
  chars: readonly string[],
  rng: Rng = Math.random,
  options: ReviewOptions = {},
): Question[] {
  const questions = chars.map((c): Question => {
    const item = getItem(c);
    const writeRoll = options.write && isWritable(c) ? rng() : 1;
    if (writeRoll < WRITE_SHARE) return { item, direction: 'write', options: [], retry: false };

    const direction: Direction = rng() < (item.script === 'kanji' ? 0.7 : 0.6) ? 'k2r' : 'r2k';
    const pool = ALL_ITEMS.filter((x) => x.script === item.script && x.group === item.group);
    return { item, direction, options: buildOptions(item, pool, rng, options.known), retry: false };
  });
  return shuffle(questions, rng);
}

// ---------- Treino de ouvido ----------

export const EAR_QUESTIONS = 10;

/** `count` itens do pool, sem repetir enquanto der (embaralha o pool de novo se faltar). */
function sampleCycle<T>(pool: readonly T[], count: number, rng: Rng): T[] {
  const picks: T[] = [];
  while (picks.length < count && pool.length > 0) picks.push(...shuffle(pool, rng));
  return picks.slice(0, count);
}

/** Ouvido, kana: toca o som e as alternativas são os caracteres. */
export function buildEarQuestions(
  pool: readonly StudyItem[],
  rng: Rng = Math.random,
  count: number = EAR_QUESTIONS,
  known?: ReadonlySet<string>,
): Question[] {
  return sampleCycle(pool, count, rng).map((item) => ({
    item,
    direction: 'audio',
    options: buildOptions(item, pool, rng, known),
    retry: false,
  }));
}

const pairItem = (ex: PhraseExample): PairItem => ({ char: ex.jp, label: `${ex.romaji}, ${ex.pt}`, script: 'pair' });

/** Ouvido, pares difíceis: toca uma das duas palavras e a pessoa escolhe qual foi. */
export function buildPairQuestions(
  pairs: readonly MinimalPair[],
  rng: Rng = Math.random,
  count: number = EAR_QUESTIONS,
): Question[] {
  return sampleCycle(pairs, count, rng).map((pair) => {
    const a = pairItem(pair.first);
    const b = pairItem(pair.second);
    const item = rng() < 0.5 ? a : b;
    return { item, direction: 'audio', options: shuffle([a, b], rng), retry: false };
  });
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
  return resolveQuestion(state, chosenChar === q.item.char, rng);
}

/**
 * Registra o resultado da pergunta atual quando o acerto vem de fora (ex.: a nota do desenho,
 * que não tem alternativa escolhida). Errar recoloca a pergunta 2 ou 3 posições adiante.
 */
export function resolveQuestion(state: QuizState, correct: boolean, rng: Rng = Math.random): AnswerOutcome {
  const q = state.current;
  if (!q) throw new Error('Quiz já terminou');
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
