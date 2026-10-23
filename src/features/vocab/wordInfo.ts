import type { VocabWord } from '@/content';
import { SENTENCE_BANK, type BankSentence } from '@/content/sentenceBank';
import { WORD_CLASS } from '@/content/wordClass';
import { findVerb, GROUP_LABELS } from '@/features/conjugation/verbs';

/** Adjetivos que terminam em い mas são do tipo な (きれい, きらい). */
const NA_ENDING_IN_I: ReadonlySet<string> = new Set(['きれい', 'きらい', 'だいきらい', 'ゆうめい']);

/**
 * A classe da palavra (substantivo, verbo, adjetivo い ou な, advérbio, pronome...), vinda do JMdict. Verbos mostram também o
 * grupo de conjugação. Sem a classe na fonte, usa o que a lista dá para saber com segurança (verbo e adjetivo) e, no
 * resto, devolve null em vez de chutar.
 */
export function wordClass(word: VocabWord): string | null {
  const labels = WORD_CLASS[`${word.jp}|${word.reading}`];
  const verb = findVerb(word.id);
  if (verb) return `verbo · ${GROUP_LABELS[verb.spec.group]}`;
  if (labels && labels.length > 0) return labels.join(' · ');
  if (word.group === 'Verbos') return 'verbo';
  if (word.group === 'Adjetivos') {
    const isI = word.reading.endsWith('い') && !NA_ENDING_IN_I.has(word.reading);
    return isI ? 'adjetivo い' : 'adjetivo な';
  }
  return null;
}

let index: Map<string, BankSentence[]> | null = null;

/** Frases do banco por palavra, as mais curtas primeiro. */
function sentenceIndex(): Map<string, BankSentence[]> {
  if (index) return index;
  const map = new Map<string, BankSentence[]>();
  for (const sentence of SENTENCE_BANK) {
    for (const id of sentence.uses) map.set(id, [...(map.get(id) ?? []), sentence]);
  }
  for (const list of map.values()) list.sort((a, b) => a.kana.length - b.kana.length || a.id - b.id);
  index = map;
  return map;
}

/** Até `count` frases reais (Tatoeba) que usam a palavra. */
export const examplesFor = (wordId: string, count = 2): BankSentence[] => (sentenceIndex().get(wordId) ?? []).slice(0, count);

/** Quantas palavras do vocabulário têm pelo menos uma frase de exemplo. */
export const wordsWithExamples = (): number => sentenceIndex().size;
