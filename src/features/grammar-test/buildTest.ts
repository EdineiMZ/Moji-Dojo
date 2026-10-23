import { ALL_EXERCISES, ALL_GRAMMAR } from '@/content/grammar';
import { allBlanks, buildClozeQuestion } from '@/features/cloze/cloze';
import { shuffle, type PairItem, type Question, type Rng } from '@/features/quiz/quiz';
import { REVIEW_GOOD_PCT } from '@/features/review/session';
import type { GrammarTopic, PhraseExample } from '@/data/types';

export const TEST_QUESTIONS = 5;

const toItem = (char: string, label: string, extra: Partial<PairItem> = {}): PairItem => ({ char, label, script: 'pair', ...extra });

/** Outras traduções para usar como alternativas: primeiro as do mesmo tópico, depois as dos outros. */
function otherTranslations(topic: GrammarTopic, example: PhraseExample, rng: Rng): string[] {
  const same = topic.examples.filter((e) => e !== example).map((e) => e.pt);
  const others = ALL_GRAMMAR.filter((t) => t !== topic).flatMap((t) => t.examples.map((e) => e.pt));
  const picked: string[] = [];
  for (const pt of [...shuffle(same, rng), ...shuffle(others, rng)]) {
    if (picked.length === 3) break;
    if (pt !== example.pt && !picked.includes(pt)) picked.push(pt);
  }
  return picked;
}

/** "O que quer dizer?": a frase em japonês e quatro traduções. A certa leva a frase como `char`, as erradas o próprio texto. */
export function buildMeaningQuestion(topic: GrammarTopic, example: PhraseExample, rng: Rng = Math.random): Question {
  const explain = `${example.jp} (${example.romaji}) = ${example.pt}`;
  const options = shuffle(
    [toItem(example.jp, example.pt, { explain }), ...otherTranslations(topic, example, rng).map((pt) => toItem(pt, pt))],
    rng,
  );
  return { item: toItem(example.jp, example.jp, { reading: example.jp.replace(/ /g, ''), explain }), direction: 'k2r', options, retry: false };
}

/**
 * Mini-teste de um tópico: até 5 perguntas, sem a explicação à vista. Mistura "o que quer dizer?" (os exemplos do
 * tópico) com lacunas (as frases do Montar do tópico), se houver. Sai com menos de 5 quando o tópico tem pouco material.
 */
export function buildTopicTest(topicId: string, rng: Rng = Math.random, count: number = TEST_QUESTIONS): Question[] {
  const topic = ALL_GRAMMAR.find((t) => t.id === topicId);
  if (!topic) return [];
  const meaning = shuffle(topic.examples, rng).map((e) => buildMeaningQuestion(topic, e, rng));
  const exercises = ALL_EXERCISES.filter((e) => e.topic === topicId);
  // Uma lacuna por frase, para as perguntas não se parecerem.
  const seen = new Set<unknown>();
  const cloze = shuffle(allBlanks(exercises), rng)
    .filter((b) => !seen.has(b.exercise) && seen.add(b.exercise))
    .map((b) => buildClozeQuestion(b, rng));

  const takeCloze = Math.min(cloze.length, Math.floor(count / 2));
  const takeMeaning = Math.min(meaning.length, count - takeCloze);
  const filler = Math.min(cloze.length - takeCloze, count - takeCloze - takeMeaning);
  return shuffle([...cloze.slice(0, takeCloze + filler), ...meaning.slice(0, takeMeaning)], rng);
}

/** Passou: acertou de primeira pelo menos 80% (as respostas repetidas depois de um erro não contam). */
export const passedTest = (firstTry: number, total: number): boolean => total > 0 && (firstTry / total) * 100 >= REVIEW_GOOD_PCT;
