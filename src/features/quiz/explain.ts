import { KANA_EXAMPLES } from '@/data/examples';
import { KANA_MNEMONICS, KANJI_HINTS } from '@/data/hints';
import { formatReadings } from '@/features/lessons/knowText';
import type { QuizItem } from './quiz';

/** Resposta certa em uma linha: "か = ka · かさ guarda-chuva" ou "水 = água · on スイ · kun みず". */
export function explainItem(item: QuizItem): string {
  if (item.script === 'pair') return `${item.char} = ${item.label}`;
  if (item.script === 'kanji') {
    return `${item.char} = ${item.label} · on ${formatReadings(item.on)} · kun ${formatReadings(item.kun)}`;
  }
  const example = KANA_EXAMPLES[item.char];
  return `${item.char} = ${item.label}${example ? ` · ${example.word} ${example.meaning}` : ''}`;
}

/** Dica de memorização do caractere, se existir. */
export const mnemonicFor = (item: QuizItem): string | undefined =>
  item.script === 'pair' ? undefined : (KANA_MNEMONICS[item.char] ?? KANJI_HINTS[item.char]);

export interface Feedback {
  correct: boolean;
  text: string;
  /** Só quando errou: ajuda a fixar. */
  hint?: string;
}

export function buildFeedback(item: QuizItem, correct: boolean): Feedback {
  const text = `${correct ? 'Certo! ' : 'Era '}${explainItem(item)}`;
  const hint = correct ? undefined : mnemonicFor(item);
  return hint ? { correct, text, hint } : { correct, text };
}

/** Tempo até avançar sozinho depois de um acerto (kanji tem mais texto para ler). */
export const autoAdvanceMs = (item: QuizItem): number => (item.script === 'kanji' ? 1200 : 800);
