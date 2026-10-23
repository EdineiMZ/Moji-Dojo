import type { BuildExercise } from '@/data/types';
import { CONFUSABLE, formDistractors, PARTICLES } from '@/features/cloze/cloze';
import { shuffle, type PairItem, type Question, type Rng } from '@/features/quiz/quiz';
import { diagnose } from './diagnose';
import { exercisesForTopic } from './build';

/**
 * Partículas que não viram erro claro quando trocadas: は/が/も trocam entre si em muitas frases e o resultado
 * ainda é japonês correto. Só se trocam, ou se usam como troca, as que dão frase errada de verdade.
 */
const SOFT = new Set(['は', 'が', 'も']);

/** "Qual está certa?": uma alternativa certa e até três erradas, cada uma com um tipo de erro diferente. */
export const JUDGE_ROUND = 8;

type Variant = readonly string[];

const swapAt = (tokens: Variant, a: number, b: number): string[] => {
  const copy = [...tokens];
  [copy[a], copy[b]] = [copy[b] as string, copy[a] as string];
  return copy;
};

/** Frases erradas que vêm de um erro só, agrupadas por tipo de erro. */
function wrongVariants(exercise: BuildExercise): Variant[][] {
  const { answer } = exercise;
  const accepted = new Set([answer, ...(exercise.alternatives ?? [])].map((a) => a.join('|')));
  const fresh = (v: Variant) => !accepted.has(v.join('|'));

  const particles: Variant[] = [];
  answer.forEach((token, i) => {
    if (!PARTICLES.has(token) || SOFT.has(token)) return;
    for (const other of CONFUSABLE[token] ?? []) {
      if (SOFT.has(other)) continue;
      const v = answer.map((t, j) => (j === i ? other : t));
      if (fresh(v)) particles.push(v);
    }
  });

  const order: Variant[] = [];
  const last = answer.at(-1);
  if (last && answer.length > 2 && !PARTICLES.has(last)) order.push([last, ...answer.slice(0, -1)]);
  answer.forEach((token, i) => {
    const before = answer[i - 1];
    if (i > 0 && PARTICLES.has(token) && before !== undefined && !PARTICLES.has(before)) order.push(swapAt(answer, i - 1, i));
  });

  const forms: Variant[] = formDistractors(exercise).map((t) => [...answer.slice(0, -1), t]);

  return [particles, order.filter(fresh), forms.filter(fresh)].filter((group) => group.length > 0);
}

const toItem = (char: string, label: string, extra: Partial<PairItem> = {}): PairItem => ({
  char,
  label,
  script: 'pair',
  ...extra,
});

/** Uma pergunta "qual frase está certa?" para o exercício, ou null se não há erro claro para oferecer. */
export function buildJudgeQuestion(exercise: BuildExercise, rng: Rng = Math.random): Question | null {
  const groups = wrongVariants(exercise);
  if (groups.length === 0) return null;
  // Um erro de cada tipo, no máximo três, em ordem sorteada.
  const wrongs = shuffle(groups, rng)
    .slice(0, 3)
    .map((group) => shuffle(group, rng)[0] as Variant);

  const answerText = exercise.answer.join(' ');
  const label = `Qual frase está certa?\n(${exercise.pt})`;
  const whyWrong: Record<string, string> = {};
  for (const wrong of wrongs) {
    whyWrong[wrong.join(' ')] = diagnose(exercise, wrong).join(' ');
  }
  const options = shuffle([answerText, ...wrongs.map((w) => w.join(' '))], rng).map((text) => toItem(text, label));
  return {
    item: toItem(answerText, label, {
      explain: `${answerText} (${exercise.romaji}) = ${exercise.pt}`,
      hint: exercise.hint,
      whyWrong,
    }),
    direction: 'r2k',
    options,
    retry: false,
  };
}

/** Uma rodada de perguntas, de frases sorteadas do tópico (ou de todos). */
export function buildJudgeRound(
  topic: string,
  rng: Rng = Math.random,
  count: number = JUDGE_ROUND,
  exercises: readonly BuildExercise[] = exercisesForTopic(topic),
): Question[] {
  const questions: Question[] = [];
  for (const exercise of shuffle(exercises, rng)) {
    if (questions.length === count) break;
    const question = buildJudgeQuestion(exercise, rng);
    if (question) questions.push(question);
  }
  return questions;
}
