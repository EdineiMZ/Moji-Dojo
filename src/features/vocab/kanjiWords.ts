import { wordsWithKanji, type VocabWord } from '@/content';
import { ALL_KANJI as KANJI } from '@/content/kanji';

/** Quantas palavras aparecem na lição de um kanji. */
export const KANJI_WORDS_LIMIT = 3;

/**
 * Palavras do vocabulário que usam o kanji, para mostrá-lo em uso na lição. `exclude` tira a palavra de
 * exemplo que a lição já mostra. As mais curtas vêm primeiro: são as mais fáceis de reconhecer.
 */
export function otherWordsWithKanji(char: string, exclude?: string, limit: number = KANJI_WORDS_LIMIT): VocabWord[] {
  return wordsWithKanji(char)
    .filter((w) => w.id !== exclude)
    .sort((a, b) => [...a.jp].length - [...b.jp].length)
    .slice(0, limit);
}

const KANJI_MEANING: ReadonlyMap<string, string> = new Map(KANJI.map((k) => [k.char, k.meaning] as const));

/** Os kanji da palavra que o app ensina, com o significado de cada um ("日 = dia, sol"), sem repetir. */
export function kanjiBreakdown(word: VocabWord): string[] {
  return [...new Set(word.kanji)].filter((c) => KANJI_MEANING.has(c)).map((c) => `${c} = ${KANJI_MEANING.get(c)}`);
}
