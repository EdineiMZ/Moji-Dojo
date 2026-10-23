import { buildConjugationQuestions } from '@/features/conjugation/questions';
import { dueCards as conjDue, parseCardKey as parseVerbKey } from '@/features/conjugation/cards';
import { parseCardKey as parseWordKey, dueCards as vocabDue } from '@/features/vocab/cards';
import { buildVocabQuestions, questionCardKey } from '@/features/vocab/questions';
import { buildReviewQuestions, shuffle, type Question, type Rng } from '@/features/quiz/quiz';
import { findItem } from '@/features/catalog';
import { dueChars, type SrsState } from './srs';

export const MIXED_ROUND = 20;

interface Pile {
  srs: SrsState;
  vocab: SrsState;
  conj: SrsState;
}

/**
 * Revisão mista: kana, palavras e verbos que venceram, intercalados (um de cada, em rodízio) em vez de blocos longos do mesmo
 * tipo. Alternar o tipo de exercício cansa mais agora, mas fixa mais. Sobra de um tipo é completada pelos outros.
 */
export function buildMixedRound(pile: Pile, now: number, rng: Rng = Math.random, count: number = MIXED_ROUND): Question[] {
  const kana = buildReviewQuestions(dueChars(pile.srs, now, (c) => findItem(c) !== undefined).slice(0, count), rng);
  const words = buildVocabQuestions(vocabDue(pile.vocab, now).slice(0, count), rng);
  const verbs = buildConjugationQuestions(conjDue(pile.conj, now).slice(0, count), rng);
  const piles = shuffle([kana, words, verbs], rng).map((p) => [...p]);

  const out: Question[] = [];
  while (out.length < count && piles.some((p) => p.length > 0)) {
    for (const p of piles) {
      const next = p.shift();
      if (next) out.push(next);
      if (out.length >= count) break;
    }
  }
  return out;
}

export type MixedKind = 'kana' | 'vocab' | 'conj';

/** De qual lista de revisão a pergunta é, e a chave do cartão (o caractere, no kana). */
export function mixedKind(question: Question): { kind: MixedKind; key: string } {
  if (question.item.script !== 'pair') return { kind: 'kana', key: question.item.char };
  const key = questionCardKey(question);
  return { kind: parseWordKey(key) ? 'vocab' : parseVerbKey(key) ? 'conj' : 'vocab', key };
}
