import { shuffle, type PairItem, type Question, type Rng } from '@/features/quiz/quiz';
import { cardKey, FORM_LABELS, parseCardKey } from './cards';
import { conjugate, VERB_FORMS, type VerbForm, type VerbSpec } from './conjugate';
import type { Verb } from './verbs';

/** Finais possíveis de て/た dos verbos do grupo 1, para montar respostas erradas plausíveis. */
const TE_ENDINGS = [
  ['って', 'った'],
  ['んで', 'んだ'],
  ['いて', 'いた'],
  ['いで', 'いだ'],
  ['して', 'した'],
] as const;

/** Troca o final do verbo (a última letra) por `tail`. */
const swapLast = (text: string, tail: string): string => [...text].slice(0, -1).join('') + tail;

/**
 * Respostas erradas que um aluno de verdade daria: a regra de outro grupo aplicada ao verbo
 * (ex.: tratar 飲む como se fosse do grupo 2) e o final de て/た de outro tipo (飲って).
 */
export function wrongRuleForms(text: string, spec: Pick<VerbSpec, 'group'>, form: VerbForm): string[] {
  const ichidanLike = spec.group === 'ichidan';
  switch (form) {
    case 'masu':
      return ichidanLike ? [swapLast(text, 'ります'), swapLast(text, 'います')] : [swapLast(text, 'ます'), swapLast(text, 'ります')];
    case 'nai':
      return ichidanLike ? [swapLast(text, 'らない'), swapLast(text, 'わない')] : [swapLast(text, 'ない'), swapLast(text, 'りない')];
    case 'te':
      return [...TE_ENDINGS.map(([te]) => swapLast(text, te)), swapLast(text, 'て')];
    case 'ta':
      return [...TE_ENDINGS.map(([, ta]) => swapLast(text, ta)), swapLast(text, 'た')];
  }
}

/** A forma certa + 3 respostas erradas: primeiro as de regra errada, depois as outras formas do mesmo verbo. */
export function buildFormOptions(verb: Verb, form: VerbForm, rng: Rng = Math.random): string[] {
  const { spec, word } = verb;
  const answer = conjugate(word.jp, spec, form);
  const wrongRule = shuffle(wrongRuleForms(word.jp, spec, form), rng);
  const otherForms = shuffle(
    VERB_FORMS.filter((f) => f !== form).map((f) => conjugate(word.jp, spec, f)),
    rng,
  );
  const picked: string[] = [];
  // Duas de regra errada e uma de outra forma (se der), para a pergunta testar a regra e a forma.
  for (const candidate of [...wrongRule.slice(0, 2), ...otherForms, ...wrongRule.slice(2)]) {
    if (picked.length === 3) break;
    if (candidate === answer || picked.includes(candidate)) continue;
    picked.push(candidate);
  }
  return shuffle([answer, ...picked], rng);
}

/** Só o primeiro significado ("acordar, levantar-se; acontecer" → "acordar"). */
const shortMeaning = (meaning: string): string => meaning.split(/[,;]/u)[0]?.trim() ?? meaning;

const toItem = (text: string, label: string, reading?: string, key?: string): PairItem => ({
  char: text,
  label,
  script: 'pair',
  ...(reading ? { reading } : {}),
  ...(key ? { key } : {}),
});

/** Pergunta de um cartão: "食べる (comer) → forma ない"; as alternativas são as formas escritas. */
export function buildConjugationQuestion(verb: Verb, form: VerbForm, rng: Rng = Math.random): Question {
  const { word, spec } = verb;
  const answer = conjugate(word.jp, spec, form);
  const answerReading = conjugate(word.reading, spec, form);
  const label = `${word.jp} (${shortMeaning(word.meaning)}) → ${FORM_LABELS[form]}`;
  return {
    item: toItem(answer, label, answerReading !== answer ? answerReading : undefined, cardKey(word.id, form)),
    direction: 'r2k',
    options: buildFormOptions(verb, form, rng).map((text) => toItem(text, label)),
    retry: false,
  };
}

/** Cartão de revisão ("verbo|forma") que a pergunta representa. */
export const questionCardKey = (question: Question): string | undefined =>
  question.item.script === 'pair' ? question.item.key : undefined;

/** Evita dois cartões do mesmo verbo seguidos (a pergunta de um entrega a resposta do outro). */
function spreadSameVerb(questions: Question[]): Question[] {
  const verbOf = (q: Question): string => {
    const key = questionCardKey(q) ?? '';
    return key.slice(0, key.lastIndexOf('|'));
  };
  const rest = [...questions];
  const out: Question[] = [];
  while (rest.length > 0) {
    const previous = out.at(-1);
    const at = rest.findIndex((q) => !previous || verbOf(q) !== verbOf(previous));
    out.push(...rest.splice(at < 0 ? 0 : at, 1));
  }
  return out;
}

/** Perguntas de revisão a partir das chaves dos cartões; chaves que não valem mais são ignoradas. */
export function buildConjugationQuestions(keys: readonly string[], rng: Rng = Math.random): Question[] {
  const questions: Question[] = [];
  for (const key of keys) {
    const card = parseCardKey(key);
    if (card) questions.push(buildConjugationQuestion(card.verb, card.form, rng));
  }
  return spreadSameVerb(shuffle(questions, rng));
}
