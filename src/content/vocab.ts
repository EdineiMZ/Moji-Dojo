import { KANA } from '@/data/kana';
import { KANA_EXAMPLES, KANJI_EXAMPLES } from '@/data/examples';
import { KANJI, KANJI_CATEGORIES } from '@/data/kanji';
import { SIMULATOR_WORDS } from '@/data/keyboard';
import { N4_WORDS } from './n4';
import { N5_WORDS } from './n5';
import type { SourceWord, VocabKind, VocabWord } from './types';

const KANJI_CHAR = /[一-鿿]/u;

/** Tira o comentário entre parênteses no fim ("lámen (no teclado real, ...)" → "lámen"). */
const plainMeaning = (meaning: string): string => meaning.replace(/\s*\([^)]*\)\s*$/u, '').trim();

const GROUP_LABELS = {
  hira: 'Hiragana',
  kata: 'Katakana',
  misc: 'Teclado',
} as const;

const categoryLabel = new Map(KANJI_CATEGORIES.map((c) => [c.id, c.label] as const));

/**
 * Vocabulário inicial do app: a palavra de exemplo de cada kana e de cada kanji e as
 * palavras do simulador de teclado. Nenhuma palavra é inventada. Ordem da trilha: hiragana, katakana, kanji.
 * Palavras repetidas aparecem uma vez só (vale a primeira). O vocabulário que vier de outras fontes entra
 * depois, no mesmo formato.
 */
export function buildHtmlVocabulary(): VocabWord[] {
  const words = new Map<string, VocabWord>();
  const add = (word: VocabWord): void => {
    if (!words.has(word.id)) words.set(word.id, word);
  };
  const kanjiOf = (jp: string): string[] => [...jp].filter((c) => KANJI_CHAR.test(c));

  for (const kana of KANA) {
    const example = KANA_EXAMPLES[kana.char];
    if (!example) continue;
    add({
      id: example.word,
      jp: example.word,
      reading: example.word,
      romaji: example.romaji,
      meaning: plainMeaning(example.meaning),
      kind: kana.script,
      group: GROUP_LABELS[kana.script],
      kanji: [],
    });
  }

  for (const kanji of KANJI) {
    const example = KANJI_EXAMPLES[kanji.char];
    if (!example) continue;
    add({
      id: example.word,
      jp: example.word,
      reading: example.reading,
      meaning: plainMeaning(example.meaning),
      kind: 'kanji',
      group: categoryLabel.get(kanji.category) ?? 'Kanji',
      kanji: kanjiOf(example.word),
    });
  }

  for (const sim of SIMULATOR_WORDS) {
    add({
      id: sim.word,
      jp: sim.word,
      reading: sim.word,
      meaning: plainMeaning(sim.meaning),
      kind: 'misc' satisfies VocabKind,
      group: GROUP_LABELS.misc,
      kanji: [],
    });
  }

  return [...words.values()];
}

const KATAKANA = /[ァ-ヺ]/u;

/**
 * Lista JLPT N5 (scripts/vocab-n5/, gerada em ./n5.ts): leitura e palavra vêm da lista; o significado é a
 * tradução para o português. Fonte e licença em src/content/LICENSE.md.
 */
export const buildN5Vocabulary = (): VocabWord[] => fromSource(N5_WORDS);

/** Lista JLPT N4 (scripts/vocab-n4/, gerada em ./n4.ts): mesmo formato do N5, em grupos com o prefixo "N4:". */
export const buildN4Vocabulary = (): VocabWord[] => fromSource(N4_WORDS);

function fromSource(words: readonly SourceWord[]): VocabWord[] {
  return words.map((w): VocabWord => {
    const kanji = [...w.jp].filter((c) => KANJI_CHAR.test(c));
    const kind: VocabKind = kanji.length > 0 ? 'kanji' : KATAKANA.test(w.jp) ? 'kata' : 'hira';
    return { id: w.jp, jp: w.jp, reading: w.reading, meaning: w.meaning, kind, group: w.group, kanji };
  });
}

/** Junta as listas na ordem dada; palavra repetida aparece uma vez só (vale a primeira lista). */
export function mergeVocabulary(...lists: readonly (readonly VocabWord[])[]): VocabWord[] {
  const words = new Map<string, VocabWord>();
  for (const list of lists) for (const word of list) if (!words.has(word.id)) words.set(word.id, word);
  return [...words.values()];
}
