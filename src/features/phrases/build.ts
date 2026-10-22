import { BUILD_EXERCISES } from '@/data/exercises';
import type { BuildExercise } from '@/data/types';
import { shuffle, type Rng } from '@/features/quiz/quiz';

/** Todos os tópicos de gramática que têm exercício. */
export const ALL_TOPICS = 'all';

/** Um bloco de frase. O id distingue blocos com o mesmo texto (ex.: dois "に"). */
export interface Token {
  id: number;
  text: string;
}

export type CheckResult = 'ok' | 'bad';

export interface BuildRound {
  /** Exercícios da rodada, já embaralhados. */
  list: readonly BuildExercise[];
  index: number;
  /** Blocos escolhidos, na ordem em que foram tocados. */
  chosen: readonly Token[];
  /** Blocos disponíveis (a resposta mais os que sobram de propósito), embaralhados. */
  pool: readonly Token[];
  /** Resultado da conferência da frase atual; null enquanto monta. */
  checked: CheckResult | null;
  /** Frases certas e frases conferidas até agora. */
  correct: number;
  attempted: number;
  /** Acabou a rodada. */
  finished: boolean;
}

export const exercisesForTopic = (topic: string): readonly BuildExercise[] =>
  topic === ALL_TOPICS ? BUILD_EXERCISES : BUILD_EXERCISES.filter((e) => e.topic === topic);

function poolFor(exercise: BuildExercise, rng: Rng): Token[] {
  return shuffle([...exercise.answer, ...exercise.extra].map((text, id) => ({ id, text })), rng);
}

/** Começa uma rodada com os exercícios embaralhados. */
export function createRound(exercises: readonly BuildExercise[], rng: Rng = Math.random): BuildRound {
  const list = shuffle(exercises, rng);
  const first = list[0];
  return {
    list,
    index: 0,
    chosen: [],
    pool: first ? poolFor(first, rng) : [],
    checked: null,
    correct: 0,
    attempted: 0,
    finished: list.length === 0,
  };
}

export const currentExercise = (round: BuildRound): BuildExercise | undefined => round.list[round.index];

/** Toca num bloco do pool: ele entra na frase (um bloco só pode ser usado uma vez). */
export function addToken(round: BuildRound, id: number): BuildRound {
  if (round.checked || round.chosen.some((t) => t.id === id)) return round;
  const token = round.pool.find((t) => t.id === id);
  return token ? { ...round, chosen: [...round.chosen, token] } : round;
}

/** Toca num bloco da frase: ele volta para o pool. */
export function removeToken(round: BuildRound, position: number): BuildRound {
  if (round.checked || position < 0 || position >= round.chosen.length) return round;
  return { ...round, chosen: round.chosen.filter((_, i) => i !== position) };
}

export function clearTokens(round: BuildRound): BuildRound {
  return round.checked ? round : { ...round, chosen: [] };
}

/** A frase montada é a resposta ou uma das ordens alternativas aceitas? */
export function isCorrect(exercise: BuildExercise, chosen: readonly Token[]): boolean {
  const built = chosen.map((t) => t.text).join('|');
  return [exercise.answer, ...(exercise.alternatives ?? [])].some((accepted) => accepted.join('|') === built);
}

/** Confere a frase. Sem nenhum bloco escolhido não confere (devolve a mesma rodada). */
export function checkRound(round: BuildRound): BuildRound {
  const exercise = currentExercise(round);
  if (!exercise || round.checked || round.chosen.length === 0) return round;
  const ok = isCorrect(exercise, round.chosen);
  return { ...round, checked: ok ? 'ok' : 'bad', attempted: round.attempted + 1, correct: round.correct + (ok ? 1 : 0) };
}

/** Passa para a próxima frase, ou termina a rodada na última. */
export function nextExercise(round: BuildRound, rng: Rng = Math.random): BuildRound {
  if (!round.checked) return round;
  const next = round.list[round.index + 1];
  if (!next) return { ...round, finished: true };
  return { ...round, index: round.index + 1, chosen: [], pool: poolFor(next, rng), checked: null };
}
