import type { VocabGroup, VocabWord } from './types';
import { buildHouseVocabulary, buildHtmlVocabulary, buildN1Vocabulary, buildN2Vocabulary, buildN3Vocabulary, buildN4Vocabulary, buildN5Vocabulary, mergeVocabulary } from './vocab';

export type { VocabGroup, VocabKind, VocabWord } from './types';

/** Todo o vocabulário do app, na ordem de estudo: o inicial e depois a lista N5, a N4 e a N3. */
export const VOCAB: readonly VocabWord[] = mergeVocabulary(buildHtmlVocabulary(), buildN5Vocabulary(), buildN4Vocabulary(), buildN3Vocabulary(), buildHouseVocabulary(), buildN2Vocabulary(), buildN1Vocabulary());

const WORD_BY_ID: ReadonlyMap<string, VocabWord> = new Map(VOCAB.map((w) => [w.id, w]));

export const findWord = (id: string): VocabWord | undefined => WORD_BY_ID.get(id);

/** Grupos na ordem em que aparecem no vocabulário. */
export const VOCAB_GROUPS: readonly VocabGroup[] = [...new Set(VOCAB.map((w) => w.group))].map((label) => ({
  id: label,
  label,
}));

/** Palavras que usam um kanji (do kanji para as palavras). */
export const wordsWithKanji = (char: string): readonly VocabWord[] => VOCAB.filter((w) => w.kanji.includes(char));
