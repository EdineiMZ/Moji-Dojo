import type { PhraseExample, RubySegment } from '@/data/types';
import { SENTENCE_BANK, type BankSentence } from '@/content/sentenceBank';
import { shuffle, type Rng } from '@/features/quiz/quiz';
import type { TranslationItem } from '@/features/translate/items';
import { normalizeJapanese } from '@/features/translate/check';

/** Quais frases mostrar: só as que o aluno já sabe ler, as que têm uma palavra nova, ou todas. */
export type BankMode = 'known' | 'one' | 'any';

export const BANK_MODES: readonly { value: BankMode; label: string }[] = [
  { value: 'known', label: 'Que eu sei ler' },
  { value: 'one', label: 'Uma palavra nova' },
  { value: 'any', label: 'Qualquer uma' },
];

export const BANK_BATCH = 10;

/** As palavras da frase que o aluno ainda não aprendeu (não têm cartão de vocabulário). */
export const unknownWords = (sentence: BankSentence, known: ReadonlySet<string>): string[] =>
  sentence.uses.filter((id) => !known.has(id));

const inMode = (unknown: number, mode: BankMode): boolean =>
  mode === 'any' ? true : mode === 'known' ? unknown === 0 : unknown === 1;

export function sentencesFor(mode: BankMode, known: ReadonlySet<string>, bank: readonly BankSentence[] = SENTENCE_BANK): BankSentence[] {
  return bank.filter((s) => inMode(unknownWords(s, known).length, mode));
}

/** Quantas frases cada modo mostra, para o aluno saber o que há antes de sortear. */
export function bankCounts(known: ReadonlySet<string>, bank: readonly BankSentence[] = SENTENCE_BANK): Record<BankMode, number> {
  const counts: Record<BankMode, number> = { known: 0, one: 0, any: bank.length };
  for (const s of bank) {
    const n = unknownWords(s, known).length;
    if (n === 0) counts.known++;
    else if (n === 1) counts.one++;
  }
  return counts;
}

/** Frases sorteadas do modo, sem as já mostradas enquanto houver outras. */
export function pickSentences(
  mode: BankMode,
  known: ReadonlySet<string>,
  seen: ReadonlySet<number> = new Set(),
  rng: Rng = Math.random,
  count: number = BANK_BATCH,
  bank: readonly BankSentence[] = SENTENCE_BANK,
): BankSentence[] {
  const all = sentencesFor(mode, known, bank);
  const fresh = all.filter((s) => !seen.has(s.id));
  const pool = fresh.length >= count ? fresh : all;
  return shuffle(pool, rng).slice(0, count);
}

/** "[私|わたし]は[猫|ねこ]。" → trechos com texto e leitura (o que vem depois do primeiro "|" é a leitura). */
export function rubyOf(furi: string): RubySegment[] {
  const segments: RubySegment[] = [];
  let last = 0;
  for (const m of furi.matchAll(/\[([^\]]+)\]/g)) {
    if (m.index > last) segments.push({ text: furi.slice(last, m.index) });
    const [text = '', ...readings] = m[1]?.split('|') ?? [];
    segments.push({ text, reading: readings.join('') });
    last = m.index + m[0].length;
  }
  if (last < furi.length) segments.push({ text: furi.slice(last) });
  return segments;
}

const KANJI = /[一-鿿]/u;

/** A frase no formato dos exemplos da gramática (kana com espaços, kanji com furigana se houver, romaji, tradução). */
export function toExample(sentence: BankSentence): PhraseExample {
  return {
    jp: sentence.kana,
    ...(KANJI.test(sentence.jp) ? { ruby: rubyOf(sentence.furi) } : {}),
    romaji: sentence.romaji,
    pt: sentence.pt,
    say: sentence.kana.replace(/ /g, ''),
  };
}

/** A frase como item de tradução (para o Entender e o Escrever do Traduzir). */
export function toTranslationItem(sentence: BankSentence): TranslationItem {
  return {
    id: normalizeJapanese(sentence.kana),
    pt: sentence.pt,
    jp: sentence.kana,
    romaji: sentence.romaji,
    accepted: [sentence.kana, sentence.jp],
    kanji: sentence.jp,
  };
}
