import { VOCAB } from '@/content';
import { KANJI_MORE_WORDS } from '@/content/kanjiMoreWords';
import { KANA_EXAMPLES, KANJI_EXAMPLES } from '@/data/examples';
import type { KanaExample, KanjiExample } from '@/data/types';
import { kanaToRomaji } from '@/lib/romaji';

/**
 * Palavra de exemplo para um kana. Usa a escolhida à mão e, para os que não têm (が, ぎ, きゃ...), a palavra do vocabulário
 * escrita só com a mesma escrita (hiragana ou katakana) que começa com ele, ou que o contém; a mais curta primeiro.
 */
export function kanaExampleFor(char: string): KanaExample | undefined {
  const given = KANA_EXAMPLES[char];
  if (given) return given;
  const katakana = /[ァ-ヶ]/.test(char);
  const sameScript = (text: string) => (katakana ? /^[ァ-ヶー]+$/.test(text) : /^[ぁ-ゖー]+$/.test(text));
  const candidates = VOCAB.filter((w) => w.group !== 'Teclado' && sameScript(w.jp) && w.jp.includes(char));
  const pick = [...candidates].sort((a, b) => Number(!a.jp.startsWith(char)) - Number(!b.jp.startsWith(char)) || [...a.jp].length - [...b.jp].length)[0];
  return pick ? { word: pick.jp, romaji: kanaToRomaji(pick.reading), meaning: pick.meaning } : undefined;
}

/** Palavra de exemplo para um kanji: a escolhida à mão ou, nos kanji sem palavra no vocabulário, uma do JMdict. */
export const kanjiExampleFor = (char: string): KanjiExample | undefined => KANJI_EXAMPLES[char] ?? KANJI_MORE_WORDS[char];
