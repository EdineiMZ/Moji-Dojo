import { dueChars, type SrsState } from '@/features/review/srs';
import { findItem } from '@/features/catalog';
import { buildReviewQuestions, shuffle, type Question, type Rng } from '@/features/quiz/quiz';
import { buildConjugationQuestions } from '@/features/conjugation/questions';
import { dueCards as dueConj, isKnownCard as isConjCard } from '@/features/conjugation/cards';
import { buildParticleReview, isParticleCard } from '@/features/cloze/particles';
import { buildVocabQuestions } from '@/features/vocab/questions';
import { dueCards as dueVocab, isKnownCard as isVocabCard } from '@/features/vocab/cards';
import { RESCUE_QUESTIONS } from './rescue';

/** De que área vem cada pergunta da revisão de resgate (para gravar a resposta no lugar certo). */
export type RescueKind = 'kana' | 'vocab' | 'conj' | 'particle';

/** O que a revisão de resgate pode usar: o progresso das áreas que têm revisão espaçada. */
export interface RescueSource {
  misses: readonly string[];
  srs: SrsState;
  vocab: SrsState;
  conj: SrsState;
  now: number;
}

/** Perguntas mínimas para a revisão de resgate fazer sentido. */
export const MIN_RESCUE_QUESTIONS = 5;

const refsOf = (misses: readonly string[], prefix: string): string[] =>
  [...misses].reverse().filter((m) => m.startsWith(`${prefix}:`)).map((m) => m.slice(prefix.length + 1));

const isKana = (char: string): boolean => findItem(char) !== undefined;

/**
 * A revisão de resgate: até 25 perguntas, primeiro com o que a pessoa errou há pouco (do mais recente), e o que faltar
 * vem dos cartões vencidos de cada área. As áreas se misturam; cada pergunta volta com a área de onde veio.
 */
export function buildRescueQuestions(
  source: RescueSource,
  rng: Rng = Math.random,
  total: number = RESCUE_QUESTIONS,
): { questions: Question[]; kind: Map<Question, RescueKind> } {
  const kind = new Map<Question, RescueKind>();
  const taken = new Set<string>();
  const wanted: Record<RescueKind, string[]> = { kana: [], vocab: [], conj: [], particle: [] };

  const add = (area: RescueKind, ref: string): boolean => {
    const id = `${area}:${ref}`;
    if (taken.has(id)) return false;
    taken.add(id);
    wanted[area].push(ref);
    return true;
  };
  const count = (): number => wanted.kana.length + wanted.vocab.length + wanted.conj.length + wanted.particle.length;

  for (const ref of refsOf(source.misses, 'srs')) if (count() < total && isKana(ref)) add('kana', ref);
  for (const ref of refsOf(source.misses, 'vocab')) if (count() < total && isVocabCard(ref)) add('vocab', ref);
  for (const ref of refsOf(source.misses, 'conj')) if (count() < total && isConjCard(ref)) add('conj', ref);
  for (const ref of refsOf(source.misses, 'particle')) if (count() < total && isParticleCard(ref)) add('particle', ref);

  // O que faltar vem dos cartões vencidos, alternando as áreas para misturar.
  const fills: [RescueKind, string[]][] = [
    ['kana', dueChars(source.srs, source.now, isKana)],
    ['vocab', dueVocab(source.vocab, source.now)],
    ['conj', dueConj(source.conj, source.now)],
  ];
  for (let round = 0; count() < total && fills.some(([, list]) => list.length > 0); round++) {
    for (const [area, list] of fills) {
      const next = list.shift();
      if (next !== undefined && count() < total) add(area, next);
    }
    if (round > total * 3) break;
  }

  const questions: Question[] = [];
  const push = (list: Question[], area: RescueKind): void => {
    for (const q of list) {
      kind.set(q, area);
      questions.push(q);
    }
  };
  push(buildReviewQuestions(wanted.kana, rng, { write: false }), 'kana');
  push(buildVocabQuestions(wanted.vocab, rng), 'vocab');
  push(buildConjugationQuestions(wanted.conj, rng), 'conj');
  push(buildParticleReview(wanted.particle, rng), 'particle');
  return { questions: shuffle(questions, rng).slice(0, total), kind };
}
