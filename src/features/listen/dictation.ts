import { VOCAB, type VocabWord } from '@/content';
import { buildUnderstandQuestion, pickItems, translationPool, type TranslationItem } from '@/features/translate/items';
import type { TypingTarget } from '@/features/translate/TypingSession';
import { shuffle, type PairItem, type Question, type Rng } from '@/features/quiz/quiz';
import { learnedWordIds } from '@/features/vocab/cards';
import type { SrsState } from '@/features/review/srs';

/** O que se ouve no ditado: palavras soltas ou frases inteiras. */
export type DictationKind = 'words' | 'phrases';

export const DICTATION_ROUND = 8;

/** Com menos palavras aprendidas que isto, o ditado de palavras usa todo o vocabulário. */
const MIN_LEARNED_WORDS = 8;

/** Palavras do ditado: as já aprendidas (ou todas, no começo), sem as de uma letra só (confundem no ouvido). */
export function dictationWords(vocab: SrsState): VocabWord[] {
  const learned = learnedWordIds(vocab);
  const usable = VOCAB.filter((w) => [...w.reading].length >= 2 && !/[ー・]/u.test(w.reading));
  const mine = usable.filter((w) => learned.has(w.id));
  return mine.length >= MIN_LEARNED_WORDS ? mine : usable;
}

const firstMeaning = (meaning: string): string => meaning.split(/[,;]/u)[0]?.trim() ?? meaning;

export const wordTarget = (word: VocabWord): TypingTarget => ({
  id: word.id,
  prompt: firstMeaning(word.meaning),
  accepted: [word.reading, word.jp],
  answer: word.reading,
  speak: word.reading,
});

export const phraseTarget = (item: TranslationItem): TypingTarget => ({
  id: item.id,
  prompt: item.pt,
  accepted: item.accepted,
  answer: item.jp,
  romaji: item.romaji,
  speak: item.jp.replace(/ /g, ''),
  ...(item.hint ? { hint: item.hint } : {}),
});

/** Uma rodada de ditado. */
export function buildDictation(kind: DictationKind, vocab: SrsState, rng: Rng = Math.random, count: number = DICTATION_ROUND): TypingTarget[] {
  if (kind === 'words') return shuffle(dictationWords(vocab), rng).slice(0, count).map(wordTarget);
  return pickItems(count, rng).map(phraseTarget);
}

const toItem = (char: string, label: string, extra: Partial<PairItem> = {}): PairItem => ({ char, label, script: 'pair', ...extra });

/**
 * Compreensão: a frase toca sem texto e a pessoa escolhe o que ela quer dizer entre quatro traduções. A certa leva o
 * sentido como `char` e a fala em `reading` (é o que a voz lê no modo de áudio do quiz).
 */
export function buildListenQuestion(item: TranslationItem, rng: Rng = Math.random, pool: readonly TranslationItem[] = translationPool()): Question {
  const base = buildUnderstandQuestion(item, rng, pool);
  const explain = `${item.jp} (${item.romaji}) = ${item.pt}`;
  const options = base.options.map((o) => toItem(o.char === item.jp ? item.pt : o.char, o.char === item.jp ? item.pt : o.label));
  return {
    item: toItem(item.pt, item.pt, { reading: item.jp.replace(/ /g, ''), explain, ...(item.hint ? { hint: item.hint } : {}) }),
    direction: 'audio',
    options: shuffle(options, rng),
    retry: false,
  };
}

export function buildListenRound(count: number = DICTATION_ROUND, rng: Rng = Math.random): Question[] {
  return pickItems(count, rng).map((item) => buildListenQuestion(item, rng));
}
