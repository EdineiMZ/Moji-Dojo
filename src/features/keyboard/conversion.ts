import { VOCAB } from '@/content';
import { shuffle, type Rng } from '@/features/quiz/quiz';
import { typeable } from './practice';

/** Uma palavra que se digita em kana e se converte nas sugestões do teclado (kanji ou katakana). */
export interface ConversionItem {
  /** O que se digita (a leitura em hiragana). */
  reading: string;
  /** A escrita certa, que aparece nas sugestões. */
  target: string;
  meaning: string;
}

const KANJI = /[一-鿿]/u;
const KATAKANA = /[ァ-ヺ]/u;

let cache: ConversionItem[] | null = null;

/** Palavras do vocabulário cuja escrita difere da leitura em kana (têm kanji ou são katakana). */
export function conversionPool(): readonly ConversionItem[] {
  cache ??= VOCAB.filter((w) => w.jp !== w.reading && typeable(w.reading) && (KANJI.test(w.jp) || KATAKANA.test(w.jp))).map((w) => ({
    reading: w.reading,
    target: w.jp,
    meaning: w.meaning,
  }));
  return cache;
}

/**
 * A barra de sugestões do teclado para a leitura digitada: a escrita certa, as palavras que têm a mesma leitura (o que
 * confunde de verdade), a própria leitura em kana (todo teclado a oferece) e, para completar, outras palavras parecidas.
 */
export function suggestionBar(item: ConversionItem, rng: Rng = Math.random, pool: readonly ConversionItem[] = conversionPool(), size = 4): string[] {
  const list: string[] = [item.target];
  const add = (text: string): void => {
    if (list.length < size && !list.includes(text)) list.push(text);
  };
  for (const other of pool) if (other.reading === item.reading) add(other.target);
  add(item.reading);
  const near = shuffle(
    pool.filter((o) => o.target !== item.target && Math.abs([...o.reading].length - [...item.reading].length) <= 1),
    rng,
  );
  for (const other of near) add(other.target);
  return shuffle(list, rng);
}

/** Uma palavra ao acaso, diferente da anterior. */
export function pickConversion(rng: Rng = Math.random, avoid?: string, pool: readonly ConversionItem[] = conversionPool()): ConversionItem | null {
  const options = pool.filter((i) => i.target !== avoid);
  const list = options.length > 0 ? options : pool;
  return list[Math.floor(rng() * list.length)] ?? null;
}

/** O que o vocabulário sabe sobre uma leitura digitada: as palavras com essa leitura. */
export function lookupReading(typed: string, pool: readonly { reading: string; jp: string; meaning: string }[] = VOCAB): { jp: string; meaning: string }[] {
  if (!typed) return [];
  return pool.filter((w) => w.reading === typed).map((w) => ({ jp: w.jp, meaning: w.meaning }));
}
