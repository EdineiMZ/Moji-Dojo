import type { StrokeData } from '@/data/types';
import { flattenPath, type Point } from '@/features/strokes/svgPath';
import { ALL_ITEMS, findItem } from '@/features/catalog';
import { strokeModel } from './model';
import { isPassing, scoreWriting, type WritingScore } from './score';

/**
 * Ajudas do modo "Desenhe o símbolo" para quem não lembra o caractere.
 * - "Não lembro": conta como erro (o mesmo do erro normal no SRS) e ensina com a animação + um traçado guiado.
 * - "Dica": revela só o primeiro traço; acertar assim conta como acerto, mas não avança a caixa.
 */

/** Tempo da animação do traço da dica antes de ele virar parte do desenho (ms). */
export const HINT_REVEAL_MS = 700;

/** Só o primeiro traço do modelo (caminho e número), para a animação da dica. */
export function hintModel(model: StrokeData): StrokeData {
  return { p: model.p.slice(0, 1), n: model.n.slice(0, 1) };
}

/** O primeiro traço do modelo como se o usuário o tivesse desenhado (entra no desenho depois da dica). */
export function hintStroke(model: StrokeData): Point[] | null {
  const first = model.p[0];
  return first ? flattenPath(first) : null;
}

/** O que o usuário fez na pergunta: conferiu o desenho (com ou sem dica) ou desistiu. */
export type WriteAction =
  | { kind: 'check'; score: WritingScore; hinted: boolean; /** O desenho, para descobrir o que foi confundido. */ drawing?: readonly (readonly Point[])[] }
  | { kind: 'giveUp' };

export interface WriteVerdict {
  /** Conta como acerto no quiz e nas estatísticas. */
  correct: boolean;
  /** Acertou com ajuda da dica: o SRS não avança a caixa. */
  hinted: boolean;
}

/** Transforma a ação em acerto/erro. Desistir é sempre erro; a dica só importa quando se acerta. */
export function writeVerdict(action: WriteAction, need: number): WriteVerdict {
  if (action.kind === 'giveUp') return { correct: false, hinted: false };
  const correct = isPassing(action.score, need);
  return { correct, hinted: correct && action.hinted };
}

/**
 * "Rodinhas" do desenho, que saem conforme a caixa do SRS:
 * - trace (caixa 1, caractere novo): o modelo aparece em transparência para traçar por cima;
 * - first (caixa 2): o primeiro traço já vem desenhado e o resto é de memória;
 * - memory (caixa 3 em diante): de memória, como sempre (aqui o botão "Dica" fica disponível).
 * São apoio automático, não o botão "Dica": acertar assim ainda avança a caixa, que é como a pessoa sai da rodinha.
 */
export type WriteAssist = 'trace' | 'first' | 'memory';

export function assistFor(box: number | undefined): WriteAssist {
  if (box === undefined || box <= 1) return 'trace';
  return box === 2 ? 'first' : 'memory';
}

/** O desenho tem de lembrar mais o outro caractere do que o pedido, com folga, para valer como confusão. */
const GUESS_MARGIN = 10;

/**
 * Qual kana a pessoa provavelmente desenhou, quando errou o pedido? Compara o desenho com os outros kana da mesma
 * escrita e devolve o que mais combina, se ele passaria na nota (`need`) e superar o pedido por uma margem.
 * É o que alimenta a lista de pares confusos também nos erros de desenho. Null se nenhum combina.
 */
export function guessDrawn(char: string, drawing: readonly (readonly Point[])[], ownPct: number, need: number): string | null {
  const asked = findItem(char);
  if (!asked || (asked.script !== 'hira' && asked.script !== 'kata') || drawing.length === 0) return null;
  let best: { char: string; pct: number } | null = null;
  for (const other of ALL_ITEMS) {
    if (other.script !== asked.script || other.char === char) continue;
    const model = strokeModel(other.char);
    if (!model) continue;
    const pct = scoreWriting(model, drawing as Point[][]).pct;
    if (pct >= need && pct >= ownPct + GUESS_MARGIN && (!best || pct > best.pct)) best = { char: other.char, pct };
  }
  return best?.char ?? null;
}
