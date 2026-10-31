import { findWord } from '@/content';
import { segmentLoose } from '@/features/bank/lexicon';
import { kanaToRomaji } from '@/lib/romaji';

/** Um pedaço de um texto de explicação: português corrido ou um trecho em japonês, com a leitura e, se for uma palavra do vocabulário, o significado. */
export type Piece = { kind: 'text'; text: string } | { kind: 'jp'; text: string; romaji?: string; meaning?: string };

// Kana, kanji, o traço ー, o repetidor 々 e o til 〜 (que nos padrões gramaticais faz parte do trecho). Trechos separados por um espaço contam como um só.
const JP = '\\u3041-\\u309f\\u30a0-\\u30ff\\u4e00-\\u9fff\\u3005\\u301c\\uff5e';
const SPAN = new RegExp(`[${JP}]+(?: [${JP}]+)*`, 'gu');
const ONLY_KANA = /^[ぁ-ゟ゠-ヿー]+$/u;
const TILDE = /[〜～]/gu;

/** Romaji de uma palavra em kana. は, を e へ no fim da palavra são partículas: "かれは" → "kare wa". */
function kanaWord(word: string): string {
  if (word.length === 1) return kanaToRomaji(word, { particle: true });
  const split = /^(.+)([はをへ])$/u.exec(word);
  return split ? `${kanaToRomaji(split[1] as string)} ${kanaToRomaji(split[2] as string, { particle: true })}` : kanaToRomaji(word);
}

/**
 * O romaji de um trecho em japonês, ou undefined se ele tem kanji que o app não conhece (aí é melhor não mostrar nada que mostrar errado).
 * Palavras do vocabulário vêm com a leitura certa; o resto em kana é lido letra por letra.
 */
export function romajiOf(span: string): string | undefined {
  const compact = span.replace(/ /g, '').replace(TILDE, '');
  if (compact === '') return undefined;
  if (ONLY_KANA.test(compact)) {
    // Em kana não precisa do léxico: respeita os espaços que o texto já tem entre as palavras.
    return span
      .replace(TILDE, '')
      .split(' ')
      .filter(Boolean)
      .map(kanaWord)
      .join(' ');
  }
  const tokens = segmentLoose(compact);
  const out: string[] = [];
  let at = 0;
  for (const token of tokens) {
    const start = compact.indexOf(token.surface, at);
    if (start < 0) return undefined;
    const gap = compact.slice(at, start);
    if (gap) {
      if (!ONLY_KANA.test(gap)) return undefined;
      out.push(kanaWord(gap));
    }
    if (token.entry.role !== 'punct') out.push(kanaToRomaji(token.entry.reading, { particle: token.entry.role === 'particle' }));
    at = start + token.surface.length;
  }
  const rest = compact.slice(at);
  if (rest) {
    if (!ONLY_KANA.test(rest)) return undefined;
    out.push(kanaWord(rest));
  }
  return out.join(' ');
}

/** O significado em português, se o trecho é exatamente uma palavra do vocabulário. */
export function meaningOf(span: string): string | undefined {
  return findWord(span.replace(/ /g, '').replace(TILDE, ''))?.meaning;
}

/** Corta um texto em português e japonês: cada trecho em japonês vem com o romaji e, se for uma palavra do vocabulário, o significado. */
export function annotate(text: string): Piece[] {
  const pieces: Piece[] = [];
  let at = 0;
  for (const match of text.matchAll(SPAN)) {
    const start = match.index ?? 0;
    if (start > at) pieces.push({ kind: 'text', text: text.slice(at, start) });
    const span = match[0];
    pieces.push({ kind: 'jp', text: span, romaji: romajiOf(span), meaning: meaningOf(span) });
    at = start + span.length;
  }
  if (at < text.length) pieces.push({ kind: 'text', text: text.slice(at) });
  return pieces;
}
