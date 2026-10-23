import { VOCAB, type VocabWord } from '@/content';
import { shuffle, type Direction, type PairItem, type Question, type Rng } from '@/features/quiz/quiz';
import { cardKey, parseCardKey, type CardDir } from './cards';

/** A palavra no formato que o quiz entende: o japonês, o significado e a leitura (para a voz). */
export const toQuizItem = (word: VocabWord): PairItem => ({
  char: word.jp,
  label: word.meaning,
  script: 'pair',
  ...(word.reading !== word.jp ? { reading: word.reading } : {}),
});

const DIRECTION: Readonly<Record<CardDir, Direction>> = { jm: 'k2r', mj: 'r2k', au: 'audio', rd: 'k2r' };

/** Quantas moras tem a leitura, grosso modo (para escolher alternativas do mesmo tamanho). */
const size = (word: VocabWord): number => [...word.reading].length;

/**
 * A palavra certa + 3 distratores. Prefere palavras do mesmo grupo e depois da mesma escrita. Nunca repete
 * o significado nem a palavra na tela (senão haveria duas respostas certas).
 */
export function buildVocabOptions(word: VocabWord, rng: Rng = Math.random): PairItem[] {
  const others = VOCAB.filter((w) => w.id !== word.id);
  const ordered = [
    ...shuffle(others.filter((w) => w.group === word.group), rng),
    ...shuffle(others.filter((w) => w.group !== word.group && w.kind === word.kind), rng),
    ...shuffle(others.filter((w) => w.group !== word.group && w.kind !== word.kind), rng),
  ];
  const meanings = new Set([word.meaning]);
  const picked: VocabWord[] = [];
  for (const candidate of ordered) {
    if (picked.length === 3) break;
    if (meanings.has(candidate.meaning)) continue;
    meanings.add(candidate.meaning);
    picked.push(candidate);
  }
  return shuffle([word, ...picked], rng).map(toQuizItem);
}

/**
 * Pergunta de leitura: a palavra com kanji e quatro leituras. As erradas são leituras de outras palavras com kanji,
 * primeiro as que dividem um kanji com a palavra e as do mesmo tamanho. Nunca repete a leitura na tela.
 */
export function buildReadingOptions(word: VocabWord, rng: Rng = Math.random): PairItem[] {
  const others = VOCAB.filter((w) => w.id !== word.id && w.kanji.length > 0 && w.reading !== word.reading);
  const ordered = [
    ...shuffle(others.filter((w) => w.kanji.some((k) => word.kanji.includes(k))), rng),
    ...shuffle(others.filter((w) => Math.abs(size(w) - size(word)) <= 1), rng),
    ...shuffle(others, rng),
  ];
  const readings = new Set([word.reading]);
  const picked: VocabWord[] = [];
  for (const candidate of ordered) {
    if (picked.length === 3) break;
    if (readings.has(candidate.reading)) continue;
    readings.add(candidate.reading);
    picked.push(candidate);
  }
  return shuffle([word, ...picked], rng).map((w) => ({ char: w.jp, label: w.reading, script: 'pair' as const, reading: w.reading }));
}

/**
 * Separa cartões da mesma palavra (a pergunta de um entregaria a resposta do outro). Mantém a ordem sorteada,
 * mas a cada passo prefere a palavra com mais cartões ainda por vir, o que evita sobrar dois iguais no fim.
 */
function spreadSameWord(questions: Question[]): Question[] {
  const rest = [...questions];
  const remaining = new Map<string, number>();
  for (const q of rest) remaining.set(q.item.char, (remaining.get(q.item.char) ?? 0) + 1);

  const out: Question[] = [];
  while (rest.length > 0) {
    const previous = out.at(-1)?.item.char;
    let best = -1;
    rest.forEach((q, i) => {
      if (q.item.char === previous) return;
      if (best < 0 || (remaining.get(q.item.char) ?? 0) > (remaining.get(rest[best]?.item.char ?? '') ?? 0)) best = i;
    });
    const [picked] = rest.splice(best < 0 ? 0 : best, 1) as [Question];
    remaining.set(picked.item.char, (remaining.get(picked.item.char) ?? 1) - 1);
    out.push(picked);
  }
  return out;
}

/** Perguntas de revisão a partir das chaves dos cartões; chaves que não valem mais são ignoradas. */
export function buildVocabQuestions(keys: readonly string[], rng: Rng = Math.random): Question[] {
  const questions: Question[] = [];
  for (const key of keys) {
    const card = parseCardKey(key);
    if (!card) continue;
    if (card.dir === 'rd') {
      questions.push({
        item: { ...toQuizItem(card.word), label: card.word.reading, key },
        direction: 'k2r',
        options: buildReadingOptions(card.word, rng),
        retry: false,
      });
      continue;
    }
    questions.push({
      item: toQuizItem(card.word),
      direction: DIRECTION[card.dir],
      options: buildVocabOptions(card.word, rng),
      retry: false,
    });
  }
  return spreadSameWord(shuffle(questions, rng));
}

/** O cartão que uma pergunta representa (a direção vem da pergunta, a palavra do item). */
export const questionCardKey = (question: Question): string => {
  if (question.item.script === 'pair' && question.item.key) return question.item.key;
  const dir = (Object.keys(DIRECTION) as CardDir[]).find((d) => DIRECTION[d] === question.direction) ?? 'jm';
  return cardKey(question.item.char, dir);
};
