import { VOCAB } from '@/content';
import { ALL_ITEMS } from '@/features/catalog';
import { buildOptions, shuffle, type Question, type Rng } from '@/features/quiz/quiz';
import { DAY_MS, type SrsEntry, type SrsState } from '@/features/review/srs';
import { cardKey } from '@/features/vocab/cards';
import { buildVocabQuestions, questionCardKey } from '@/features/vocab/questions';

export const PLACEMENT_KANA = 20;
export const PLACEMENT_WORDS = 15;

/** Caixa em que os itens acertados de primeira entram: já "firmes", com a primeira revisão em uma semana. */
export const PLACED_BOX = 3;

const KANA = ALL_ITEMS.filter((i) => (i.script === 'hira' || i.script === 'kata') && [...i.char].length === 1);

/** Teste de nivelamento: kana (metade hiragana, metade katakana) e palavras sorteadas, na ordem de dificuldade crescente. */
export function buildPlacement(rng: Rng = Math.random): Question[] {
  const hira = shuffle(KANA.filter((i) => i.script === 'hira'), rng).slice(0, PLACEMENT_KANA / 2);
  const kata = shuffle(KANA.filter((i) => i.script === 'kata'), rng).slice(0, PLACEMENT_KANA / 2);
  const kana: Question[] = shuffle([...hira, ...kata], rng).map((item) => ({
    item,
    direction: 'k2r',
    options: buildOptions(item, KANA.filter((k) => k.script === item.script), rng),
    retry: false,
  }));
  const keys = shuffle(VOCAB, rng)
    .slice(0, PLACEMENT_WORDS)
    .map((w) => cardKey(w.id, 'jm'));
  return [...kana, ...buildVocabQuestions(keys, rng)];
}

export interface PlacementResult {
  /** Kana acertados de primeira. */
  kana: string[];
  /** Cartões de palavras (chave "palavra|jm") acertados de primeira. */
  words: string[];
  asked: { kana: number; words: number };
}

/** O que a pessoa já sabe, pelas respostas de primeira (acerto só depois de errar não conta). */
export function placementResult(answers: readonly { question: Question; firstTryRight: boolean }[]): PlacementResult {
  const result: PlacementResult = { kana: [], words: [], asked: { kana: 0, words: 0 } };
  for (const { question, firstTryRight } of answers) {
    if (question.item.script === 'pair') {
      result.asked.words++;
      if (firstTryRight) result.words.push(questionCardKey(question));
    } else {
      result.asked.kana++;
      if (firstTryRight) result.kana.push(question.item.char);
    }
  }
  return result;
}

/** Põe os itens reconhecidos na revisão já firmes (caixa 3), sem rebaixar quem já estava em caixa maior. */
export function placeKnown(state: SrsState, keys: readonly string[], now: number): SrsState {
  const next: Record<string, SrsEntry> = { ...state };
  for (const key of keys) {
    const entry = next[key];
    // A memória do FSRS (s, d, t) fica de fora: o cartão recomeça da caixa nova.
    if (!entry || entry.b < PLACED_BOX) next[key] = { b: PLACED_BOX, due: now + 7 * DAY_MS, ...(entry?.l ? { l: entry.l } : {}) };
  }
  return next;
}
