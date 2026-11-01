import { KANA_EXAMPLES } from '@/data/examples';
import { KANA_MNEMONICS, KANJI_HINTS } from '@/data/hints';
import { formatReadings } from '@/features/lessons/knowText';
import type { QuizItem } from './quiz';

/** Resposta certa em uma linha: "か = ka · かさ guarda-chuva" ou "水 = água · on スイ · kun みず". */
export function explainItem(item: QuizItem): string {
  if (item.script === 'pair') {
    if (item.explain) return item.explain;
    const shown = item.reading && item.reading !== item.char ? `${item.char} (${item.reading})` : item.char;
    return `${shown} = ${item.label}`;
  }
  if (item.script === 'kanji') {
    return `${item.char} = ${item.label} · on ${formatReadings(item.on)} · kun ${formatReadings(item.kun)}`;
  }
  const example = KANA_EXAMPLES[item.char];
  return `${item.char} = ${item.label}${example ? ` · ${example.word} ${example.meaning}` : ''}`;
}

/** Dica de memorização do caractere, se existir. */
export const mnemonicFor = (item: QuizItem): string | undefined =>
  item.script === 'pair' ? item.hint : (KANA_MNEMONICS[item.char] ?? KANJI_HINTS[item.char]);

export interface Feedback {
  correct: boolean;
  text: string;
  /** Só quando errou: ajuda a fixar. */
  hint?: string;
  /** Só quando errou e a alternativa escolhida tem explicação própria: o que ela muda. */
  why?: string;
}

export function buildFeedback(item: QuizItem, correct: boolean, chosen?: string): Feedback {
  const text = `${correct ? 'Certo! ' : 'Era '}${explainItem(item)}`;
  const hint = correct ? undefined : mnemonicFor(item);
  const why = correct || chosen === undefined || item.script !== 'pair' ? undefined : item.whyWrong?.[chosen];
  return { correct, text, ...(hint ? { hint } : {}), ...(why ? { why } : {}) };
}

/**
 * Tempo até avançar sozinho depois de um erro (ou do ouvido): o suficiente para ler a explicação, que varia de tamanho.
 * `extra` soma tempo para olhar algo a mais, como o desenho ao lado do certo.
 */
export function readAdvanceMs(feedback: Feedback, extra = 0): number {
  const chars = feedback.text.length + (feedback.why?.length ?? 0) + (feedback.hint?.length ?? 0);
  return Math.min(9000, 3000 + chars * 45) + extra;
}

/** Tempo até avançar sozinho depois de um acerto (kanji tem mais texto para ler). */
export const autoAdvanceMs = (item: QuizItem): number => (item.script === 'kanji' ? 1200 : 800);
