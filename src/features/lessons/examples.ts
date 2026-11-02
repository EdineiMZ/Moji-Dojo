import { VOCAB } from '@/content';
import { KANJI_MORE_WORDS } from '@/content/kanjiMoreWords';
import { LESSONS } from '@/content/lessons';
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

const KANJI_RE = /[一-鿿]/u;

/** Em que lição (começando em 1) da trilha de kanji cada kanji é ensinado. */
const KANJI_LESSON: ReadonlyMap<string, number> = new Map(LESSONS.kanji.flatMap((l, i) => l.items.map((c) => [c, i + 1] as const)));

export interface LaterKanji {
  char: string;
  /** Lição da trilha em que ele aparece; ausente se o app não ensina esse kanji. */
  lesson?: number;
}

/**
 * Os outros kanji da palavra de exemplo que a pessoa ainda não viu quando chega em `char`: os ensinados numa lição mais adiante
 * (ou na mesma, mais adiante na ordem) e os que o app não ensina. A lição só mostra a palavra; isto diz o que nela ainda é novo.
 */
export function laterKanjiIn(word: string, char: string): LaterKanji[] {
  const here = KANJI_LESSON.get(char);
  const out: LaterKanji[] = [];
  for (const c of new Set([...word].filter((x) => KANJI_RE.test(x) && x !== char))) {
    const lesson = KANJI_LESSON.get(c);
    if (lesson === undefined) out.push({ char: c });
    else if (here === undefined || lesson > here) out.push({ char: c, lesson });
  }
  return out;
}

/** O aviso sob o exemplo ("本: lição 18"), ou undefined quando a palavra só usa kanji já vistos. */
export function laterKanjiNote(later: readonly LaterKanji[]): string | undefined {
  if (later.length === 0) return undefined;
  const parts = later.map((k) => (k.lesson === undefined ? `${k.char} (o app não ensina)` : `${k.char} (lição ${k.lesson})`));
  return `Ainda não vistos nesta palavra: ${parts.join(', ')}.`;
}
