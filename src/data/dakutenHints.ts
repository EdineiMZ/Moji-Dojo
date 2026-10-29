import { KANA } from './kana';

/**
 * Dicas de memória dos kana com ten-ten (゛) e maru (゜). Cada um é o kana base com a marca, então a dica diz qual é o base,
 * como o som muda e o que fazer com as exceções. Texto próprio, em português. O katakana usa o mesmo mapa (o ダ é o タ com
 * ten-ten), pois os blocos do Unicode ficam 0x60 de distância um do outro.
 */
const BASE_OF: Readonly<Record<string, string>> = {
  が: 'か', ぎ: 'き', ぐ: 'く', げ: 'け', ご: 'こ',
  ざ: 'さ', じ: 'し', ず: 'す', ぜ: 'せ', ぞ: 'そ',
  だ: 'た', ぢ: 'ち', づ: 'つ', で: 'て', ど: 'と',
  ば: 'は', び: 'ひ', ぶ: 'ふ', べ: 'へ', ぼ: 'ほ',
  ぱ: 'は', ぴ: 'ひ', ぷ: 'ふ', ぺ: 'へ', ぽ: 'ほ',
};

/** A linha do kana base e a troca de consoante que o ten-ten faz nela. */
const SHIFT_BY_ROW: readonly { base: string; shift: string }[] = [
  { base: 'かきくけこ', shift: 'k → g' },
  { base: 'さしすせそ', shift: 's → z' },
  { base: 'たちつてと', shift: 't → d' },
  { base: 'はひふへほ', shift: 'h → b' },
];

/** O que há de especial em alguns kana (leitura repetida, uso raro). */
const NOTES: Readonly<Record<string, string>> = {
  じ: 'Ele soa "ji" (e o し é "shi"). É o que se usa no dia a dia.',
  ず: 'É o "zu" usado no dia a dia.',
  ぢ: 'Soa igual a じ ("ji") e aparece em pouquíssimas palavras, como はなぢ (sangue do nariz). Na hora de digitar, escreva di.',
  づ: 'Soa igual a ず ("zu") e aparece em poucas palavras, como つづく (continuar). Na hora de digitar, escreva du.',
};

const HIRA_TO_KATA = 0x60;
const toKata = (char: string): string => String.fromCodePoint((char.codePointAt(0) ?? 0) + HIRA_TO_KATA);

const ROMAJI = new Map(KANA.map((k) => [k.char, k.romaji]));

function hintFor(char: string, base: string, script: 'hira' | 'kata'): string {
  const baseChar = script === 'kata' ? toKata(base) : base;
  const hiraChar = char; // a chave de BASE_OF
  const handaku = 'ぱぴぷぺぽ'.includes(hiraChar);
  const sound = ROMAJI.get(script === 'kata' ? toKata(hiraChar) : hiraChar) ?? '';
  const baseSound = ROMAJI.get(baseChar) ?? '';
  const mark = handaku ? 'o círculo (゜, "maru")' : 'as duas gotinhas (゛, "ten-ten")';
  const shift = handaku ? 'h → p, o "pop" de uma bolha' : (SHIFT_BY_ROW.find((r) => r.base.includes(base))?.shift ?? '');
  const note = NOTES[hiraChar];
  const change = handaku ? `o som vira "${sound}" (${shift})` : `o som ganha voz e vira "${sound}" (${shift})`;
  return `${baseChar} (${baseSound}) mais ${mark}: ${change}.${note ? ` ${note}` : ''}`;
}

/** Dica de cada kana com ten-ten ou maru, em hiragana e katakana. */
export const DAKUTEN_MNEMONICS: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(BASE_OF).flatMap(([hira, base]) => [
    [hira, hintFor(hira, base, 'hira')],
    [toKata(hira), hintFor(hira, base, 'kata')],
  ]),
);
