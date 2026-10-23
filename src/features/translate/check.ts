/**
 * Conferência tolerante de uma frase digitada em japonês: ignora espaços, pontuação, largura (inteira/meia) e a
 * diferença entre hiragana e katakana; aceita a escrita em kana e a com kanji; e, quando erra, mostra o que
 * sobrou e o que faltou, letra por letra.
 */

/** Pontuação e símbolos que não contam (japoneses, comuns e de largura inteira). */
const IGNORED = /[\s　。、，．,.!?！？「」『』（）()[\]［］…・･〜~～\-–—:：;；"'“”‘’]/g;

/** Forma comparável: largura normalizada, sem espaços nem pontuação, tudo em hiragana e em minúsculas. */
export function normalizeJapanese(text: string): string {
  return text
    .normalize('NFKC')
    .replace(IGNORED, '')
    .toLowerCase()
    .replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
}

/** Distância de edição (inserir, apagar, trocar uma letra) entre dois textos. */
export function editDistance(a: string, b: string): number {
  const x = [...a];
  const y = [...b];
  let previous = Array.from({ length: y.length + 1 }, (_, j) => j);
  for (let i = 1; i <= x.length; i++) {
    const row = [i];
    for (let j = 1; j <= y.length; j++) {
      row[j] = Math.min(
        (previous[j] as number) + 1,
        (row[j - 1] as number) + 1,
        (previous[j - 1] as number) + (x[i - 1] === y[j - 1] ? 0 : 1),
      );
    }
    previous = row;
  }
  return previous[y.length] as number;
}

export interface DiffPiece {
  text: string;
  /** ok = está na resposta certa; extra = sobrou (não deveria estar). */
  kind: 'ok' | 'extra';
}

/** O que a pessoa digitou, com as letras que sobraram marcadas (maior subsequência em comum com a resposta). */
export function diffTyped(typed: string, target: string): DiffPiece[] {
  const a = [...typed];
  const b = [...target];
  const table: number[][] = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      (table[i] as number[])[j] =
        a[i] === b[j] ? ((table[i + 1] as number[])[j + 1] as number) + 1 : Math.max((table[i + 1] as number[])[j] as number, (table[i] as number[])[j + 1] as number);
    }
  }
  const pieces: DiffPiece[] = [];
  const push = (char: string, kind: DiffPiece['kind']) => {
    const last = pieces.at(-1);
    if (last && last.kind === kind) last.text += char;
    else pieces.push({ text: char, kind });
  };
  let i = 0;
  let j = 0;
  while (i < a.length) {
    if (j < b.length && a[i] === b[j]) {
      push(a[i] as string, 'ok');
      i++;
      j++;
    } else if (j < b.length && (table[i] as number[])[j + 1]! >= (table[i + 1] as number[])[j]!) {
      j++; // letra que faltava na digitação: não aparece no que foi digitado
    } else {
      push(a[i] as string, 'extra');
      i++;
    }
  }
  return pieces;
}

export type AnswerVerdict = 'empty' | 'ok' | 'close' | 'wrong';

export interface AnswerCheck {
  verdict: AnswerVerdict;
  /** A resposta aceita mais parecida com o que foi digitado (como foi escrita, com espaços). */
  closest: string;
  /** Letras a mais e certas do que foi digitado, em relação a `closest`. */
  pieces: DiffPiece[];
  /** Quantas letras faltaram ou sobraram. */
  distance: number;
  /** Dica sobre o jeito de digitar (teclado em letras latinas, kana que faltou...). */
  tip: string | null;
}

/** Quase: um erro pequeno numa resposta que não é minúscula (até 1 letra, ou 2 se tiver 8 letras ou mais). */
const isClose = (distance: number, length: number): boolean => distance <= 1 || (distance <= 2 && length >= 8);

/** Confere `input` contra as respostas aceitas (qualquer uma serve). */
export function checkAnswer(input: string, accepted: readonly string[]): AnswerCheck {
  const typed = normalizeJapanese(input);
  const first = accepted[0] ?? '';
  if (!typed) return { verdict: 'empty', closest: first, pieces: [], distance: 0, tip: null };

  let closest = first;
  let best = Number.POSITIVE_INFINITY;
  for (const candidate of accepted) {
    const distance = editDistance(typed, normalizeJapanese(candidate));
    if (distance < best) {
      best = distance;
      closest = candidate;
    }
  }
  const target = normalizeJapanese(closest);
  const pieces = diffTyped(typed, target);
  if (best === 0) return { verdict: 'ok', closest, pieces, distance: 0, tip: null };

  let tip: string | null = null;
  if (/^[a-z0-9 ]+$/i.test(input.trim())) tip = 'Parece que o teclado está em letras latinas: troque para o japonês.';
  return { verdict: isClose(best, [...target].length) ? 'close' : 'wrong', closest, pieces, distance: best, tip };
}
