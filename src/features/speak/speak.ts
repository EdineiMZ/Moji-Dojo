import { SENTENCE_BANK } from '@/content/sentenceBank';
import { toTranslationItem } from '@/features/bank/bank';
import { shuffle, type Rng } from '@/features/quiz/quiz';
import { checkAnswer, type AnswerVerdict } from '@/features/translate/check';
import { translationPool, type TranslationItem } from '@/features/translate/items';

export const SPEAK_ROUND = 6;

/** Frases curtas o bastante para dizer de uma vez. */
const MAX_LENGTH = 16;

let cache: TranslationItem[] | null = null;

/**
 * Frases para dizer em voz alta: só as que têm a escrita com kanji, porque o reconhecimento do Android devolve texto
 * com kanji (そして "かんじ" vira 漢字) e uma frase só em kana quase nunca bateria. Vêm da gramática e do banco de frases.
 */
export function speakPool(): readonly TranslationItem[] {
  if (cache) return cache;
  const fromGrammar = translationPool().filter((item) => item.kanji !== undefined);
  const fromBank = SENTENCE_BANK.map(toTranslationItem);
  const seen = new Set<string>();
  cache = [...fromGrammar, ...fromBank].filter((item) => {
    if (seen.has(item.id) || [...item.jp.replace(/ /g, '')].length > MAX_LENGTH) return false;
    seen.add(item.id);
    return true;
  });
  return cache;
}

export const pickSpeakItems = (count: number = SPEAK_ROUND, rng: Rng = Math.random): TranslationItem[] => shuffle(speakPool(), rng).slice(0, count);

const RANK: Readonly<Record<AnswerVerdict, number>> = { ok: 3, close: 2, wrong: 1, empty: 0 };

export interface SpeakResult {
  verdict: AnswerVerdict;
  /** A alternativa do reconhecedor que mais se parece com a frase. */
  heard: string;
}

/**
 * Compara o que o reconhecedor ouviu (ele devolve algumas alternativas) com as formas aceitas da frase e fica com a mais
 * parecida. O reconhecimento é aproximado: "Quase" também conta como bom.
 */
export function judgeSpoken(transcripts: readonly string[], accepted: readonly string[]): SpeakResult {
  let best: SpeakResult = { verdict: 'empty', heard: '' };
  for (const heard of transcripts) {
    const { verdict } = checkAnswer(heard, accepted);
    if (RANK[verdict] > RANK[best.verdict]) best = { verdict, heard };
  }
  return best;
}

export const isGood = (verdict: AnswerVerdict): boolean => verdict === 'ok' || verdict === 'close';
