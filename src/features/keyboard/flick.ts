import { DAKUTEN_CYCLES, DIRECTION_NAMES, FLICK_KEYS } from '@/data/keyboard';
import type { FlickKey } from '@/data/types';

/** Rótulo da tecla de modificação (小゛゜), que troca a última letra pela próxima variação. */
export const MOD_KEY = 'mod';

/** Direções de um deslize, na mesma ordem de FlickKey.chars. */
export type FlickDirection = 0 | 1 | 2 | 3 | 4; // toque, esquerda, cima, direita, baixo

/** Quanto o dedo precisa andar (em px) para contar como deslize em vez de toque. */
export const FLICK_THRESHOLD = 16;

/** Direção do deslize: o eixo com mais movimento vence; abaixo do limite é só um toque. */
export function resolveDirection(dx: number, dy: number): FlickDirection {
  'worklet'; // roda na thread de UI, dentro do gesto da tecla
  if (Math.hypot(dx, dy) <= FLICK_THRESHOLD) return 0;
  if (Math.abs(dx) > Math.abs(dy)) return dx < 0 ? 1 : 3;
  return dy < 0 ? 2 : 4;
}

/** O caractere que a tecla produz numa direção (se a direção não tem letra, vale o toque). */
export function charFor(key: FlickKey, direction: FlickDirection): string {
  const chars = [...key.chars];
  return chars[direction] ?? chars[0] ?? '';
}

/** A letra base de uma variação e quantas vezes tocar em 小゛゜: が → [か, 1], ぱ → [は, 2]. */
export function baseOf(char: string): readonly [string, number] {
  for (const cycle of DAKUTEN_CYCLES) {
    const i = [...cycle].indexOf(char);
    if (i > 0) return [[...cycle][0] as string, i];
  }
  return [char, 0];
}

/** Troca a última letra pela próxima variação do ciclo (は → ば → ぱ → は). */
export function applyMod(buffer: string): string {
  const chars = [...buffer];
  const last = chars[chars.length - 1];
  if (last === undefined) return buffer;
  for (const cycle of DAKUTEN_CYCLES) {
    const variants = [...cycle];
    const i = variants.indexOf(last);
    if (i >= 0) return [...chars.slice(0, -1), variants[(i + 1) % variants.length] as string].join('');
  }
  return buffer;
}

export interface HowTo {
  /** Rótulo da tecla a usar. */
  key: string;
  direction: FlickDirection;
  /** Quantas vezes tocar em 小゛゜ depois. */
  modPresses: number;
  /** Instrução pronta: "が: tecla か, toque e solte, depois toque em 小゛゜". */
  text: string;
}

/** Como digitar um caractere no teclado de flick; null se não dá para digitá-lo. */
export function howTo(char: string): HowTo | null {
  const [base, modPresses] = baseOf(char);
  const key = FLICK_KEYS.find((k) => k.label !== MOD_KEY && [...k.chars].includes(base));
  if (!key) return null;
  const direction = [...key.chars].indexOf(base) as FlickDirection;
  const mod = modPresses ? `, depois toque em 小゛゜${modPresses > 1 ? ` ${modPresses} vezes` : ''}` : '';
  return { key: key.label, direction, modPresses, text: `${char}: tecla ${key.label}, ${DIRECTION_NAMES[direction] ?? ''}${mod}` };
}

export interface SimulatorProgress {
  /** Quantas letras do início estão certas. */
  correct: number;
  done: boolean;
  /** A próxima letra que falta (só se tudo digitado até aqui está certo). */
  next: string | null;
}

/** Compara o que foi digitado com a palavra-alvo. */
export function simulatorProgress(buffer: string, target: string): SimulatorProgress {
  const typed = [...buffer];
  const wanted = [...target];
  let correct = 0;
  while (correct < typed.length && typed[correct] === wanted[correct]) correct++;
  const done = buffer === target;
  return { correct, done, next: !done && correct === typed.length ? (wanted[typed.length] ?? null) : null };
}

export interface TypingCheck {
  ok: boolean;
  message: string;
}

// Só as letras (ァ..ヺ): o traço longo ー também existe em hiragana ("らーめん"), então não conta.
const hasKatakana = (s: string) => /[ァ-ヺ]/.test(s);
const hasKanji = (s: string) => /[一-鿿]/.test(s);
const stripSpaces = (s: string) => s.replace(/[\s　]/g, '');

/**
 * Confere o que a pessoa digitou no teclado de verdade. Espaços são ignorados. Se errou,
 * a mensagem tenta dizer o que provavelmente faltou (trocar o teclado, converter, escolher o kanji).
 */
export function checkTyping(input: string, target: string): TypingCheck {
  const typed = stripSpaces(input);
  const wanted = stripSpaces(target);
  if (!typed) return { ok: false, message: 'Digite algo antes de conferir.' };
  if (typed === wanted) return { ok: true, message: 'Certo!' };

  let tip = 'Compare letra por letra.';
  if (/[a-z]/i.test(typed)) tip = 'Parece que o teclado está em letras: troque para o japonês.';
  else if (hasKatakana(wanted) && !hasKatakana(typed)) tip = 'Faltou converter para katakana nas sugestões.';
  else if (hasKanji(wanted) && !hasKanji(typed)) tip = 'Faltou escolher o kanji nas sugestões.';
  return { ok: false, message: `Saiu ${typed}. O esperado é ${target}. ${tip}` };
}
