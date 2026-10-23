import { dueChars, type SrsState } from '@/features/review/srs';
import { VERB_FORMS, type VerbForm } from './conjugate';
import { findVerb, VERBS, type Verb } from './verbs';

/** Cada verbo vira um cartão por forma (ます, ない, て, た): "verbo|forma". */
const SEPARATOR = '|';

export const FORM_LABELS: Readonly<Record<VerbForm, string>> = {
  masu: 'ます (educada)',
  nai: 'ない (negativa)',
  te: 'て',
  ta: 'た (passado)',
};

export const cardKey = (verbId: string, form: VerbForm): string => `${verbId}${SEPARATOR}${form}`;

export const cardKeysFor = (verb: Verb): string[] => VERB_FORMS.map((form) => cardKey(verb.word.id, form));

export interface ParsedCard {
  verb: Verb;
  form: VerbForm;
}

/** Lê a chave de um cartão; `null` se o verbo ou a forma não existem mais. */
export function parseCardKey(key: string): ParsedCard | null {
  const at = key.lastIndexOf(SEPARATOR);
  if (at <= 0) return null;
  const verb = findVerb(key.slice(0, at));
  const form = key.slice(at + 1);
  if (!verb || !(VERB_FORMS as readonly string[]).includes(form)) return null;
  return { verb, form: form as VerbForm };
}

export const isKnownCard = (key: string): boolean => parseCardKey(key) !== null;

/** Quantos verbos entram por vez ao aprender, e quantas perguntas tem uma revisão. */
export const NEW_VERBS_BATCH = 3;
export const CONJ_REVIEW_BATCH = 20;

/** Verbos que já têm cartões na revisão. */
export function learnedVerbIds(conj: SrsState): Set<string> {
  const ids = new Set<string>();
  for (const key of Object.keys(conj)) {
    const parsed = parseCardKey(key);
    if (parsed) ids.add(parsed.verb.word.id);
  }
  return ids;
}

/** Verbos ainda não aprendidos, na ordem do vocabulário. */
export function newVerbs(conj: SrsState): Verb[] {
  const learned = learnedVerbIds(conj);
  return VERBS.filter((v) => !learned.has(v.word.id));
}

/** Cartões vencidos, do mais atrasado ao menos. */
export const dueCards = (conj: SrsState, now: number): string[] => dueChars(conj, now, isKnownCard);

export interface ConjCounts {
  learned: number;
  total: number;
  due: number;
}

export function conjCounts(conj: SrsState, now: number): ConjCounts {
  return { learned: learnedVerbIds(conj).size, total: VERBS.length, due: dueCards(conj, now).length };
}
