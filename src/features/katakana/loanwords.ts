import { VOCAB, type VocabWord } from '@/content';
import { kanaToRomaji } from '@/lib/romaji';
import { shuffle, type PairItem, type Question, type Rng } from '@/features/quiz/quiz';

export type LoanMode = 'romaji' | 'meaning';

export const LOAN_ROUND = 10;

const ONLY_KATAKANA = /^[ァ-ヶー]+$/;

/** Palavras do vocabulário escritas só em katakana (empréstimos de outras línguas e nomes). */
export const LOAN_WORDS: readonly VocabWord[] = VOCAB.filter((w) => ONLY_KATAKANA.test(w.jp));

/** Pares de katakana que se confundem à primeira vista: trocar um pelo outro é o erro típico de quem lê. */
const LOOKALIKES: readonly (readonly [string, string])[] = [
  ['シ', 'ツ'],
  ['ソ', 'ン'],
  ['ク', 'ケ'],
  ['ノ', 'ソ'],
  ['ウ', 'ワ'],
  ['コ', 'ユ'],
  ['ヌ', 'ス'],
  ['マ', 'ム'],
  ['チ', 'テ'],
  ['フ', 'ワ'],
];

const toItem = (char: string, label: string, extra: Partial<PairItem> = {}): PairItem => ({ char, label, script: 'pair', ...extra });

/**
 * Leituras erradas plausíveis para a palavra, em romaji: a troca de um katakana parecido (シ/ツ, ソ/ン...), a vogal longa
 * esquecida ou inventada (ー) e o ッ esquecido ou inventado. São os tropeços que o aluno realmente tem ao ler.
 */
export function plausibleMistakes(word: VocabWord): string[] {
  const right = kanaToRomaji(word.reading);
  const out = new Set<string>();
  const add = (kana: string) => {
    const romaji = kanaToRomaji(kana);
    if (romaji && romaji !== right) out.add(romaji);
  };
  const chars = [...word.reading];

  chars.forEach((c, i) => {
    for (const [a, b] of LOOKALIKES) {
      const swap = c === a ? b : c === b ? a : null;
      if (swap) add([...chars.slice(0, i), swap, ...chars.slice(i + 1)].join(''));
    }
    if (c === 'ー') add([...chars.slice(0, i), ...chars.slice(i + 1)].join(''));
    if (c === 'ッ') add([...chars.slice(0, i), ...chars.slice(i + 1)].join(''));
  });
  // Vogal longa ou ッ inventados: depois de uma sílaba que não termina em ッ nem ー, se a palavra tem mais de uma letra.
  if (chars.length > 2 && !chars.includes('ー')) add([...chars.slice(0, -1), 'ー', chars[chars.length - 1]!].join(''));
  if (chars.length > 2 && !chars.includes('ッ') && !/[ャュョ]/.test(chars[1] ?? '')) add([chars[0]!, 'ッ', ...chars.slice(1)].join(''));
  return [...out];
}

/** Pergunta de uma palavra: ler (escolher o romaji) ou entender (escolher o significado). */
export function buildLoanQuestion(word: VocabWord, mode: LoanMode, pool: readonly VocabWord[] = LOAN_WORDS, rng: Rng = Math.random): Question {
  const romaji = kanaToRomaji(word.reading);
  const explain = `${word.jp} = ${romaji} (${word.meaning})`;
  const others = shuffle(pool.filter((w) => w.id !== word.id), rng);

  let wrong: string[];
  if (mode === 'meaning') {
    const right = word.meaning;
    wrong = [...new Set(others.map((w) => w.meaning))].filter((m) => m !== right).slice(0, 3);
  } else {
    const typical = shuffle(plausibleMistakes(word), rng);
    // O que faltar vem de outras palavras com tamanho parecido, para as alternativas não se denunciarem pelo comprimento.
    const near = others
      .map((w) => kanaToRomaji(w.reading))
      .filter((r) => r !== romaji)
      .sort((a, b) => Math.abs(a.length - romaji.length) - Math.abs(b.length - romaji.length));
    wrong = [...new Set([...typical.slice(0, 2), ...typical.slice(2), ...near])].slice(0, 3);
  }

  const correct = toItem(word.jp, mode === 'meaning' ? word.meaning : romaji, { reading: word.reading, explain });
  const options = shuffle([correct, ...wrong.map((w) => toItem(w, w))], rng);
  return { item: toItem(word.jp, word.jp, { reading: word.reading, explain }), direction: 'k2r', options, retry: false };
}

/** Uma rodada de palavras diferentes, sem repetir. */
export function buildLoanRound(mode: LoanMode, rng: Rng = Math.random, count: number = LOAN_ROUND): Question[] {
  return shuffle(LOAN_WORDS, rng)
    .slice(0, count)
    .map((word) => buildLoanQuestion(word, mode, LOAN_WORDS, rng));
}
