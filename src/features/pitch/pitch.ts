import { VOCAB, type VocabWord } from '@/content';
import { PITCH } from '@/content/pitch';
import { shuffle, type PairItem, type Question, type Rng } from '@/features/quiz/quiz';

const SMALL = new Set(['ゃ', 'ゅ', 'ょ', 'ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ', 'ャ', 'ュ', 'ョ', 'ァ', 'ィ', 'ゥ', 'ェ', 'ォ']);

/**
 * Divide a leitura em moras, que é como o tom conta: cada kana é uma mora, mas o kana pequeno (ゃ ゅ ょ) gruda no
 * anterior, e っ, ん e ー contam como uma mora cada (きょう = きょ + う, 3 moras em がっこう = が・っ・こ・う).
 */
export function moras(reading: string): string[] {
  const out: string[] = [];
  for (const ch of reading) {
    if (SMALL.has(ch) && out.length > 0) out[out.length - 1] += ch;
    else out.push(ch);
  }
  return out;
}

/** Para cada mora, se ela é alta (true) ou baixa (false). `accent` 0 = sem queda; n = última mora alta é a n-ésima. */
export function pitchPattern(count: number, accent: number): boolean[] {
  return Array.from({ length: count }, (_, i) => {
    if (accent === 0) return i > 0;
    if (accent === 1) return i === 0;
    return i > 0 && i < accent;
  });
}

export type PitchKind = 'heiban' | 'atamadaka' | 'nakadaka' | 'odaka';

/** O tipo do acento: sem queda, queda logo na primeira mora, no meio, ou só depois da última mora (cai na partícula). */
export function pitchKind(count: number, accent: number): PitchKind {
  if (accent === 0) return 'heiban';
  if (accent === 1) return 'atamadaka';
  return accent >= count ? 'odaka' : 'nakadaka';
}

export const PITCH_KIND_LABELS: Readonly<Record<PitchKind, string>> = {
  heiban: 'plano (heiban): sobe e não cai',
  atamadaka: 'cabeça (atamadaka): alto no começo e cai',
  nakadaka: 'meio (nakadaka): sobe, e cai no meio da palavra',
  odaka: 'cauda (odaka): sobe e só cai na partícula que vem depois',
};

/** O acento principal da palavra, ou undefined se a fonte não tem. */
export function accentOf(word: Pick<VocabWord, 'jp' | 'reading'>): number | undefined {
  return PITCH[`${word.jp}|${word.reading}`]?.[0];
}

/** A leitura com a marca de queda (＼) depois da última mora alta; sem queda, termina em → ("segue alto"). */
export function marked(reading: string, accent: number): string {
  const list = moras(reading);
  if (accent === 0) return `${reading}→`;
  return `${list.slice(0, accent).join('')}＼${list.slice(accent).join('')}`;
}

export interface PitchWord {
  word: VocabWord;
  accent: number;
  count: number;
}

/** Palavras do vocabulário com acento conhecido e leitura de pelo menos duas moras. */
export const PITCH_WORDS: readonly PitchWord[] = VOCAB.flatMap((word): PitchWord[] => {
  const accent = accentOf(word);
  const count = moras(word.reading).length;
  return accent === undefined || count < 2 ? [] : [{ word, accent, count }];
});

/** Pares de palavras com a mesma leitura e acentos diferentes (はし de comer, はし ponte). */
export function pitchPairs(words: readonly PitchWord[] = PITCH_WORDS): [PitchWord, PitchWord][] {
  const byReading = new Map<string, PitchWord[]>();
  for (const w of words) byReading.set(w.word.reading, [...(byReading.get(w.word.reading) ?? []), w]);
  const pairs: [PitchWord, PitchWord][] = [];
  for (const group of byReading.values()) {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const a = group[i] as PitchWord;
        const b = group[j] as PitchWord;
        if (a.accent !== b.accent && a.word.jp !== b.word.jp) pairs.push([a, b]);
      }
    }
  }
  return pairs;
}

const firstMeaning = (meaning: string): string => meaning.split(/[,;]/u)[0]?.trim() ?? meaning;

const toItem = (char: string, label: string, extra: Partial<PairItem> = {}): PairItem => ({ char, label, script: 'pair', ...extra });

export const PITCH_ROUND = 8;

/** "Onde cai o tom de ...?": as alternativas são a mesma leitura com a queda em lugares diferentes. */
export function buildPitchQuestion(entry: PitchWord, rng: Rng = Math.random): Question {
  const { word, accent, count } = entry;
  const possible = Array.from({ length: count + 1 }, (_, n) => n).filter((n) => n !== accent);
  const wrong = shuffle(possible, rng).slice(0, 3);
  const label = `${word.jp}${word.reading !== word.jp ? ` (${word.reading})` : ''}\n${firstMeaning(word.meaning)}`;
  const answer = marked(word.reading, accent);
  const kind = PITCH_KIND_LABELS[pitchKind(count, accent)];
  return {
    item: toItem(answer, label, {
      reading: word.reading,
      explain: `${word.jp} (${word.reading}) = ${firstMeaning(word.meaning)} · ${answer} [${accent}] · ${kind}`,
      hint: '＼ marca onde o tom cai; → quer dizer que não cai. O tom é a música da palavra, não a força.',
    }),
    direction: 'r2k',
    options: shuffle([answer, ...wrong.map((n) => marked(word.reading, n))], rng).map((text) => toItem(text, label)),
    retry: false,
  };
}

export function buildPitchRound(count: number = PITCH_ROUND, rng: Rng = Math.random, words: readonly PitchWord[] = PITCH_WORDS): Question[] {
  return shuffle(words, rng)
    .slice(0, count)
    .map((entry) => buildPitchQuestion(entry, rng));
}
