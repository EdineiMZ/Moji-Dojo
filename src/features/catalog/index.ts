import { KANA } from '@/data/kana';
import { KANJI } from '@/data/kanji';
import type { Script } from '@/data/types';

/** Um caractere estudável (kana ou kanji), no formato que o quiz e as lições usam. */
export interface StudyItem {
  char: string;
  /** Resposta do quiz: romaji (kana) ou significado (kanji). */
  label: string;
  script: Script;
  /** Subgrupo: "base"/"daku"/"yoon"/"ext" nos kana, id da categoria nos kanji. */
  group: string;
  on?: readonly string[];
  kun?: readonly string[];
}

export const SCRIPT_NAMES: Readonly<Record<Script, string>> = {
  hira: 'Hiragana',
  kata: 'Katakana',
  kanji: 'Kanji',
};

/** Ordem recomendada de estudo. */
export const SCRIPT_ORDER: readonly Script[] = ['hira', 'kata', 'kanji'];

/** Mesma ordem do protótipo: hiragana, katakana, kanji. */
export const ALL_ITEMS: readonly StudyItem[] = [
  ...KANA.map((k): StudyItem => ({ char: k.char, label: k.romaji, script: k.script, group: k.group })),
  ...KANJI.map(
    (k): StudyItem => ({
      char: k.char,
      label: k.meaning,
      script: 'kanji',
      group: k.category,
      on: k.on,
      kun: k.kun,
    }),
  ),
];

const ITEM_BY_CHAR: ReadonlyMap<string, StudyItem> = new Map(ALL_ITEMS.map((it) => [it.char, it]));

export const findItem = (char: string): StudyItem | undefined => ITEM_BY_CHAR.get(char);

export function getItem(char: string): StudyItem {
  const item = ITEM_BY_CHAR.get(char);
  if (!item) throw new Error(`Caractere desconhecido: ${char}`);
  return item;
}

/** Texto enviado à voz. Kanji: primeira leitura kun (ou on, se não houver), sem os parênteses de okurigana. */
export function pronunciationText(item: StudyItem): string {
  if (item.script !== 'kanji') return item.char;
  const reading = item.kun?.[0] ?? item.on?.[0] ?? item.char;
  return reading.replace(/[()]/g, '');
}

export const isSingleChar = (char: string): boolean => [...char].length === 1;
