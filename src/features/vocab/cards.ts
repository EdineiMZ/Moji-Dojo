import { findWord, VOCAB, type VocabWord } from '@/content';
import { dueChars, type SrsState } from '@/features/review/srs';

/**
 * Cada palavra vira até 3 cartões de revisão espaçada, um por direção:
 * jm = vê o japonês, escolhe o significado; mj = vê o significado, escolhe o japonês;
 * au = ouve, escolhe a palavra escrita (só nas palavras só de kana: com kanji seria adivinhar).
 */
export type CardDir = 'jm' | 'mj' | 'au';

const SEPARATOR = '|';

/** Palavra escrita só com kana: lê-se igual a como se escreve. */
export const isKanaOnly = (word: VocabWord): boolean => word.reading === word.jp;

export const cardDirs = (word: VocabWord): readonly CardDir[] => (isKanaOnly(word) ? ['jm', 'mj', 'au'] : ['jm', 'mj']);

/** Chave do cartão no progresso e no backup: "palavra|direção". */
export const cardKey = (wordId: string, dir: CardDir): string => `${wordId}${SEPARATOR}${dir}`;

export const cardKeysFor = (word: VocabWord): string[] => cardDirs(word).map((dir) => cardKey(word.id, dir));

export interface ParsedCard {
  word: VocabWord;
  dir: CardDir;
}

/** Lê a chave de um cartão; `null` se a palavra não existe mais ou a direção não vale para ela. */
export function parseCardKey(key: string): ParsedCard | null {
  const at = key.lastIndexOf(SEPARATOR);
  if (at <= 0) return null;
  const word = findWord(key.slice(0, at));
  const dir = key.slice(at + 1);
  if (!word || !(cardDirs(word) as readonly string[]).includes(dir)) return null;
  return { word, dir: dir as CardDir };
}

export const isKnownCard = (key: string): boolean => parseCardKey(key) !== null;

/** Quantas palavras entram por vez ao aprender, e quantas perguntas tem uma revisão. */
export const NEW_WORDS_BATCH = 5;
export const VOCAB_REVIEW_BATCH = 20;

/** Palavras que já têm cartões na revisão. */
export function learnedWordIds(vocab: SrsState): Set<string> {
  const ids = new Set<string>();
  for (const key of Object.keys(vocab)) {
    const parsed = parseCardKey(key);
    if (parsed) ids.add(parsed.word.id);
  }
  return ids;
}

/** Palavras ainda não aprendidas, na ordem de estudo (opcionalmente só de um grupo). */
export function newWords(vocab: SrsState, group?: string): VocabWord[] {
  const learned = learnedWordIds(vocab);
  return VOCAB.filter((w) => !learned.has(w.id) && (group === undefined || w.group === group));
}

/** Cartões vencidos, do mais atrasado ao menos. */
export const dueCards = (vocab: SrsState, now: number): string[] => dueChars(vocab, now, isKnownCard);

export interface VocabCounts {
  learned: number;
  total: number;
  due: number;
}

export function vocabCounts(vocab: SrsState, now: number): VocabCounts {
  return { learned: learnedWordIds(vocab).size, total: VOCAB.length, due: dueCards(vocab, now).length };
}
