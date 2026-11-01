/**
 * Kana que se parecem e como diferenciá-los. Texto próprio, em português, sobre o traçado de cada letra (o que o aluno vê no
 * papel). `script` diz se são hiragana ou katakana.
 */
export interface Lookalike {
  id: string;
  script: 'hira' | 'kata';
  chars: readonly string[];
  tip: string;
}

export const LOOKALIKES: readonly Lookalike[] = [
  { id: 'nu-me', script: 'hira', chars: ['ぬ', 'め'], tip: 'O ぬ termina com um laço na ponta da cauda; o め não tem laço, a ponta só cruza o traço.' },
  { id: 'ne-re-wa', script: 'hira', chars: ['ね', 'れ', 'わ'], tip: 'O ね termina com um laço (a cauda do gato, neko). O れ termina com uma ponta solta para fora, sem laço. O わ termina curvando para dentro, redondo.' },
  { id: 'ha-ho', script: 'hira', chars: ['は', 'ほ'], tip: 'O ほ é um は com um traço horizontal a mais no alto.' },
  { id: 'ru-ro', script: 'hira', chars: ['る', 'ろ'], tip: 'O る termina com um laço; o ろ termina aberto, sem laço.' },
  { id: 'sa-chi', script: 'hira', chars: ['さ', 'ち'], tip: 'O ち tem o traço de cima ligado a uma curva que abre para a direita (barriga de lado); o さ tem o traço cruzado e uma curva solta para baixo, sem fechar a barriga.' },
  { id: 'sa-ki', script: 'hira', chars: ['さ', 'き'], tip: 'O き tem dois traços horizontais; o さ tem só um.' },
  { id: 'i-ri', script: 'hira', chars: ['い', 'り'], tip: 'No い, o traço da esquerda é o mais longo; no り, o da direita é o mais longo.' },
  { id: 'a-o', script: 'hira', chars: ['あ', 'お'], tip: 'O お tem um pingo no alto, à direita; o あ não tem.' },
  { id: 'ko-ni', script: 'hira', chars: ['こ', 'に'], tip: 'O に tem um traço vertical à esquerda e dois horizontais à direita; o こ tem só dois horizontais.' },
  { id: 'su-mu', script: 'hira', chars: ['す', 'む'], tip: 'O む tem um pingo a mais, no fim, do lado direito; o す não tem.' },
  { id: 'shi-tsu', script: 'kata', chars: ['シ', 'ツ'], tip: 'No シ, os pingos ficam deitados e o traço longo sobe. No ツ, os pingos ficam em pé e o traço longo desce.' },
  { id: 'so-n', script: 'kata', chars: ['ソ', 'ン'], tip: 'No ソ, o traço longo desce (como um acento de cima para baixo). No ン, o traço longo sobe, da esquerda para a direita.' },
  { id: 'u-wa', script: 'kata', chars: ['ウ', 'ワ'], tip: 'O ウ tem um pingo no alto; o ワ não tem.' },
  { id: 'nu-su', script: 'kata', chars: ['ヌ', 'ス'], tip: 'O ヌ tem um traço a mais, curto, cruzando no meio; o ス não.' },
];

/** Os sósias de um caractere (os outros das listas em que ele aparece), sem repetir. */
export function lookalikesOf(char: string): string[] {
  const out: string[] = [];
  for (const group of LOOKALIKES) {
    if (!group.chars.includes(char)) continue;
    for (const c of group.chars) if (c !== char && !out.includes(c)) out.push(c);
  }
  return out;
}
