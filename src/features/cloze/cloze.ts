import { ALL_EXERCISES } from '@/content/grammar';
import type { BuildExercise } from '@/data/types';
import { shuffle, type PairItem, type Question, type Rng } from '@/features/quiz/quiz';

/** O que fica em branco: uma partícula, ou o final da frase (a forma do verbo/adjetivo). */
export type ClozeKind = 'particle' | 'form';

export const BLANK = '＿＿';

/** Partículas que aparecem soltas nas frases do "Montar". */
const PARTICLES: ReadonlySet<string> = new Set(['は', 'を', 'に', 'へ', 'で', 'の', 'も', 'と', 'が', 'から', 'まで', 'より']);

/**
 * Partículas que se confundem com cada uma, na ordem de preferência (a confusão mais comum primeiro).
 * Fora daqui só entra o que também é um erro claro naquela frase.
 */
const CONFUSABLE: Readonly<Record<string, readonly string[]>> = {
  は: ['を', 'も', 'の', 'に'],
  を: ['に', 'は', 'で', 'の'],
  に: ['で', 'を', 'は', 'の'],
  へ: ['で', 'を', 'は', 'の'],
  で: ['に', 'を', 'は', 'の'],
  の: ['は', 'を', 'に', 'で'],
  も: ['は', 'を', 'に', 'の'],
  と: ['も', 'に', 'を', 'の'],
  が: ['に', 'で', 'の', 'と'],
  から: ['まで', 'に', 'で', 'の'],
  まで: ['から', 'に', 'で', 'の'],
  より: ['から', 'の', 'に', 'は'],
};

export interface ClozeBlank {
  exercise: BuildExercise;
  /** Posição do bloco em branco na resposta. */
  index: number;
  kind: ClozeKind;
}

const commonAffix = (a: string, b: string): boolean => a[0] === b[0] || a.at(-1) === b.at(-1);

/** Respostas aceitas no lugar do bloco: ele mesmo e o que as outras ordens/escolhas do exercício usam no mesmo ponto. */
export function acceptedAt(exercise: BuildExercise, index: number): Set<string> {
  const accepted = new Set([exercise.answer[index] as string]);
  for (const alt of exercise.alternatives ?? []) {
    const sameShape = alt.length === exercise.answer.length;
    const othersEqual = sameShape && alt.every((t, i) => i === index || t === exercise.answer[i]);
    if (othersEqual) accepted.add(alt[index] as string);
  }
  return accepted;
}

/** Todas as lacunas possíveis: cada partícula de cada frase e, quando há erro plausível, o final da frase. */
export function allBlanks(exercises: readonly BuildExercise[] = ALL_EXERCISES): ClozeBlank[] {
  const blanks: ClozeBlank[] = [];
  for (const exercise of exercises) {
    exercise.answer.forEach((token, index) => {
      if (PARTICLES.has(token)) blanks.push({ exercise, index, kind: 'particle' });
    });
    const lastIndex = exercise.answer.length - 1;
    if (formDistractors(exercise).length > 0 && lastIndex > 0) {
      blanks.push({ exercise, index: lastIndex, kind: 'form' });
    }
  }
  return blanks;
}

/** Blocos a mais que parecem a forma certa do final da frase (começam ou terminam igual), e não partículas. */
function formDistractors(exercise: BuildExercise): string[] {
  const last = exercise.answer.at(-1) ?? '';
  return exercise.extra.filter((t) => !PARTICLES.has(t) && t !== last && commonAffix(t, last));
}

/** As alternativas de uma lacuna: a certa e as erradas (de 1 a 3), sem nenhuma que também esteja certa. */
export function blankOptions(blank: ClozeBlank, rng: Rng = Math.random): string[] {
  const { exercise, index, kind } = blank;
  const answer = exercise.answer[index] as string;
  const accepted = acceptedAt(exercise, index);
  const wrong =
    kind === 'form'
      ? formDistractors(exercise)
      : [
          ...(CONFUSABLE[answer] ?? []),
          ...exercise.extra.filter((t) => PARTICLES.has(t)),
        ];
  const picked: string[] = [];
  for (const candidate of wrong) {
    if (picked.length === 3) break;
    if (accepted.has(candidate) || picked.includes(candidate)) continue;
    picked.push(candidate);
  }
  return shuffle([answer, ...picked], rng);
}

const toItem = (char: string, label: string, extra: Partial<PairItem> = {}): PairItem => ({
  char,
  label,
  script: 'pair',
  ...extra,
});

/** A frase com o espaço e a tradução embaixo. */
export function promptFor({ exercise, index }: ClozeBlank): string {
  const sentence = exercise.answer.map((t, i) => (i === index ? BLANK : t)).join(' ');
  return `${sentence}\n(${exercise.pt})`;
}

export function buildClozeQuestion(blank: ClozeBlank, rng: Rng = Math.random): Question {
  const { exercise, index } = blank;
  const answer = exercise.answer[index] as string;
  const label = promptFor(blank);
  const full = `${exercise.answer.join('')} (${exercise.romaji}) = ${exercise.pt}`;
  return {
    item: toItem(answer, label, { explain: full, hint: exercise.hint }),
    direction: 'r2k',
    options: blankOptions(blank, rng).map((text) => toItem(text, label)),
    retry: false,
  };
}

export const CLOZE_ROUND = 10;

/** Uma rodada: lacunas sorteadas (do tipo pedido), sem repetir a mesma frase enquanto der. */
export function buildClozeRound(
  kind: ClozeKind | 'all',
  rng: Rng = Math.random,
  count: number = CLOZE_ROUND,
  blanks: readonly ClozeBlank[] = allBlanks(),
): Question[] {
  const pool = shuffle(blanks.filter((b) => kind === 'all' || b.kind === kind), rng);
  const seen = new Set<BuildExercise>();
  const first = pool.filter((b) => !seen.has(b.exercise) && seen.add(b.exercise));
  const rest = pool.filter((b) => !first.includes(b));
  return [...first, ...rest].slice(0, count).map((b) => buildClozeQuestion(b, rng));
}
