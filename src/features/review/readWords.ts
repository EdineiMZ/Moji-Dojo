import { VOCAB } from '@/content';
import { findItem } from '@/features/catalog';
import { shuffle, type PairItem, type Question, type Rng } from '@/features/quiz/quiz';

/** Quantos kana a pessoa precisa conhecer para as palavras valerem a pena (cerca de três linhas). */
export const MIN_KNOWN_FOR_WORDS = 15;
/** Palavras por rodada. */
export const READ_WORDS = 10;

const SMALL_Y = new Set(['ゃ', 'ゅ', 'ょ', 'ャ', 'ュ', 'ョ']);
const LONG = 'ー';
const SOKUON = new Set(['っ', 'ッ']);

/** A palavra só usa kana que a pessoa já aprendeu? (ー vale; っ pede o つ; ゃゅょ pedem o par, como きゃ.) */
export function isReadable(text: string, known: ReadonlySet<string>): boolean {
  const chars = [...text];
  if (chars.length === 0) return false;
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i] as string;
    const next = chars[i + 1];
    if (c === LONG) continue;
    if (SOKUON.has(c)) {
      if (!known.has(c === 'っ' ? 'つ' : 'ツ')) return false;
      continue;
    }
    if (next && SMALL_Y.has(next) && known.has(c + next)) {
      i++;
      continue;
    }
    if (!known.has(c)) return false;
  }
  return true;
}

/** Palavras curtas (2 a 5 sinais), só de kana, que dá para ler com o que a pessoa já sabe. */
export function readableWords(known: ReadonlySet<string>) {
  return VOCAB.filter((w) => {
    const n = [...w.jp].length;
    return w.kanji.length === 0 && w.jp === w.reading && n >= 2 && n <= 5 && isReadable(w.jp, known);
  });
}

/** Os kana que a pessoa conhece (chaves do SRS que são caracteres do app). */
export function knownKana(srsKeys: readonly string[]): Set<string> {
  return new Set(srsKeys.filter((c) => findItem(c) !== undefined));
}

/**
 * Leitura de palavras: mostra a palavra em kana e a pessoa escolhe o significado. Alternativas com significados
 * diferentes, de palavras que ela também consegue ler. Devolve [] se há palavras de menos.
 */
export function buildReadQuestions(known: ReadonlySet<string>, rng: Rng = Math.random, count: number = READ_WORDS): Question[] {
  const byMeaning = new Map<string, PairItem>();
  for (const w of readableWords(known)) {
    const meaning = w.meaning.trim();
    if (!byMeaning.has(meaning)) byMeaning.set(meaning, { char: w.jp, label: meaning, script: 'pair', reading: w.reading });
  }
  const items = [...byMeaning.values()];
  if (items.length < 4) return [];
  return shuffle(items, rng)
    .slice(0, count)
    .map((item) => {
      const distractors = shuffle(
        items.filter((x) => x.label !== item.label),
        rng,
      ).slice(0, 3);
      return { item, direction: 'k2r' as const, options: shuffle([item, ...distractors], rng), retry: false };
    });
}

/** Quantas palavras entram, no máximo, numa revisão normal. */
export const WORDS_IN_REVIEW = 3;
/** A revisão precisa ter pelo menos isto de perguntas de kana para ganhar palavras (sem encher sessões curtas). */
const MIN_QUESTIONS_FOR_WORDS = 6;

/**
 * Revisão com contexto: depois de algumas linhas de kana aprendidas, mistura até 3 palavras curtas (feitas só de
 * kana já conhecidos) entre as perguntas de kana. Palavras não têm cartão de kana: quem grava a resposta
 * deve tratá-las à parte (`isStudyItem` falso).
 */
export function withWordQuestions(questions: readonly Question[], known: ReadonlySet<string>, rng: Rng = Math.random): Question[] {
  if (known.size < MIN_KNOWN_FOR_WORDS || questions.length < MIN_QUESTIONS_FOR_WORDS) return [...questions];
  const words = buildReadQuestions(known, rng, WORDS_IN_REVIEW);
  const out = [...questions];
  for (const w of words) out.splice(Math.floor(rng() * (out.length + 1)), 0, w);
  return out;
}
