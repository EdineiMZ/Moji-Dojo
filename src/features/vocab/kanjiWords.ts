import { findWord, wordsWithKanji, type VocabWord } from '@/content';
import { ALL_KANJI as KANJI } from '@/content/kanji';
import { KANJI_HINTS } from '@/data/hints';

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

/**
 * Historinha pronta para uma palavra errada: o que os kanji dela querem dizer, com a dica de memorização de cada
 * kanji quando o app tem uma ("日 = dia, sol (um sol com uma linha no meio)"). Palavra só de kana não tem; aí só
 * vale a historinha que a pessoa escrever.
 */
export function wordMnemonicFallback(word: VocabWord): string | undefined {
  const parts = [...new Set(word.kanji)]
    .filter((c) => KANJI_MEANING.has(c))
    .map((c) => `${c} = ${KANJI_MEANING.get(c)}${KANJI_HINTS[c] ? ` (${KANJI_HINTS[c].replace(/[.。]$/u, '')})` : ''}`);
  return parts.length > 0 ? parts.join(' · ') : undefined;
}

/** A palavra do vocabulário que um item de quiz representa (itens que não são palavras do vocabulário dão undefined). */
export const vocabWordOf = (item: { script: string; char: string }): VocabWord | undefined => (item.script === 'pair' ? findWord(item.char) : undefined);
