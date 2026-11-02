import type { VocabWord } from '@/content';
import { lookalikesOf } from '@/features/chart/lookalikes';
import { compact, typeable } from '@/features/keyboard/practice';
import { shuffle, type Rng } from '@/features/quiz/quiz';
import { isKanaOnly } from './cards';

/**
 * O mesmo cartão (significado → escrita) pede coisas diferentes conforme a caixa do SRS, para a lembrança sair do reconhecer
 * para o produzir: escolher entre alternativas, montar a palavra com peças de kana e, por fim, digitar no teclado de flick.
 * Não há cartão novo: a chave (`palavra|mj`), o agendamento e o backup são os mesmos.
 */
export type CardVariant = 'choice' | 'build' | 'type';

/** A partir de qual caixa a palavra é montada com peças, e a partir de qual é digitada. */
export const BUILD_FROM_BOX = 3;
export const TYPE_FROM_BOX = 5;
/** Palavras maiores que isto (em peças) continuam como escolha: a montagem ficaria longa demais para a tela. */
export const MAX_BUILD_UNITS = 8;

/**
 * Qual variante um cartão recebe. Só vale para significado → escrita (`mj`) de palavra escrita só com kana (nas outras, o que
 * se escreve é kanji, que o teclado de flick só alcança por conversão). Cartão novo (sem caixa) e caixas baixas: escolha.
 */
export function variantFor(word: VocabWord, dir: string, box: number | undefined): CardVariant {
  if (dir !== 'mj' || !isKanaOnly(word) || box === undefined) return 'choice';
  if (box >= TYPE_FROM_BOX && typeable(toHiragana(word.jp))) return 'type';
  if (box >= BUILD_FROM_BOX && buildUnits(word.jp).length <= MAX_BUILD_UNITS) return 'build';
  return 'choice';
}

/** Katakana → hiragana (o teclado de flick só tem hiragana; ー fica). */
export const toHiragana = (text: string): string => text.replace(/[ァ-ヶ]/gu, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));

const SMALL_JOINERS = new Set([...'ゃゅょぁぃぅぇぉゎャュョァィゥェォヮ']);

/** As peças da palavra: um kana por peça; os pequenos que formam sílaba (ゃゅょ, ァィゥェォ) ficam com o kana de antes. */
export function buildUnits(jp: string): string[] {
  const units: string[] = [];
  for (const c of jp) {
    const last = units.length - 1;
    if (SMALL_JOINERS.has(c) && last >= 0) units[last] += c;
    else units.push(c);
  }
  return units;
}

export interface Tile {
  /** Identifica a peça (a mesma letra pode aparecer mais de uma vez). */
  id: number;
  text: string;
}

/** Quantas peças a mais, só para atrapalhar, entram junto das certas. */
export const EXTRA_TILES = 2;

/**
 * As peças da montagem, embaralhadas: as da palavra mais até 2 de enfeite (de preferência kana parecidos com os da palavra, a
 * confusão de quem lê de relance; senão, outro kana da mesma escrita). Nunca uma de enfeite igual a uma peça da palavra.
 */
export function buildTiles(jp: string, rng: Rng = Math.random): Tile[] {
  const units = buildUnits(jp);
  const katakana = /[ァ-ヶ]/u.test(jp);
  const taken = new Set(units);
  const extras: string[] = [];
  const add = (c: string | undefined) => {
    if (c && extras.length < EXTRA_TILES && !taken.has(c)) {
      taken.add(c);
      extras.push(c);
    }
  };
  for (const u of shuffle(units, rng)) for (const c of shuffle(lookalikesOf(u), rng)) add(c);
  const alphabet = [...(katakana ? 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン' : 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわん')];
  for (const c of shuffle(alphabet, rng)) add(c);
  return shuffle([...units, ...extras], rng).map((text, id) => ({ id, text }));
}

/** O que foi montado com as peças, em ordem. */
export const builtText = (tiles: readonly Tile[], placed: readonly number[]): string =>
  placed.map((id) => tiles.find((t) => t.id === id)?.text ?? '').join('');

/**
 * A resposta digitada confere com a palavra? O teclado de flick só escreve hiragana, então a palavra em katakana vale quando
 * digitada em hiragana (e o ー conta). Espaços não contam.
 */
export function typedMatches(word: Pick<VocabWord, 'jp'>, typed: string): boolean {
  return toHiragana(compact(typed)) === toHiragana(word.jp);
}
