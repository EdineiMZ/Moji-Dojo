import { ALL_EXERCISES, ALL_GRAMMAR } from '@/content/grammar';
import { ALL_TRAVEL as TRAVEL_CATEGORIES } from '@/content/travel';
import { shuffle, type PairItem, type Question, type Rng } from '@/features/quiz/quiz';
import { normalizeJapanese } from './check';

/** Uma frase para traduzir: a tradução em português, a escrita em kana e todas as formas aceitas. */
export interface TranslationItem {
  /** Estável: a frase em japonês normalizada. */
  id: string;
  pt: string;
  /** A escrita em kana, com espaços entre as palavras (a que aparece na tela). */
  jp: string;
  romaji: string;
  /** Tudo que vale como resposta: kana, kanji, outras ordens. Cada uma como foi escrita. */
  accepted: readonly string[];
  /** A escrita com kanji, quando existe. */
  kanji?: string;
  /** A regra do tópico, mostrada ao errar. */
  hint?: string;
}

const idOf = (jp: string): string => normalizeJapanese(jp);

/**
 * Todas as frases com tradução do app: os exemplos da gramática, as frases do Montar e as de Viagem. Frases iguais
 * aparecem uma vez (juntando as formas aceitas e a dica), e frases diferentes com a mesma tradução em português
 * aceitam as respostas umas das outras (senão o aluno acertaria e seria marcado como errado).
 */
export function buildPool(): TranslationItem[] {
  const byJp = new Map<string, TranslationItem & { accepted: string[] }>();
  const add = (item: Omit<TranslationItem, 'id' | 'accepted'> & { accepted?: readonly string[] }): void => {
    const id = idOf(item.jp);
    const existing = byJp.get(id);
    const accepted = [item.jp, ...(item.accepted ?? []), ...(item.kanji ? [item.kanji] : [])];
    if (existing) {
      for (const a of accepted) if (!existing.accepted.includes(a)) existing.accepted.push(a);
      existing.kanji ??= item.kanji;
      existing.hint ??= item.hint;
      return;
    }
    byJp.set(id, { ...item, id, accepted: [...new Set(accepted)] });
  };

  for (const topic of ALL_GRAMMAR) {
    for (const example of topic.examples) {
      const kanji = example.ruby?.map((s) => s.text).join('');
      add({ pt: example.pt, jp: example.jp, romaji: example.romaji, ...(kanji ? { kanji } : {}), ...(topic.pattern ? { hint: topic.pattern } : {}) });
    }
  }
  for (const exercise of ALL_EXERCISES) {
    const alternatives = (exercise.alternatives ?? []).map((tokens) => tokens.join(''));
    add({ pt: exercise.pt, jp: exercise.answer.join(''), romaji: exercise.romaji, accepted: alternatives, hint: exercise.hint });
  }
  for (const category of TRAVEL_CATEGORIES) {
    for (const phrase of category.phrases) add({ pt: phrase.pt, jp: phrase.jp, romaji: phrase.romaji });
  }

  const items = [...byJp.values()];
  // Mesma tradução, frases diferentes: cada uma aceita as formas da outra.
  const byPt = new Map<string, string[]>();
  for (const item of items) {
    const key = item.pt.trim().toLowerCase();
    byPt.set(key, [...(byPt.get(key) ?? []), ...item.accepted]);
  }
  return items.map((item) => ({ ...item, accepted: [...new Set([...item.accepted, ...(byPt.get(item.pt.trim().toLowerCase()) ?? [])])] }));
}

let cache: TranslationItem[] | null = null;
/** O conjunto de frases (montado uma vez). */
export const translationPool = (): readonly TranslationItem[] => (cache ??= buildPool());

export const TRANSLATE_ROUND = 8;

/** Frases sorteadas para uma rodada, sem repetir. */
export function pickItems(count: number = TRANSLATE_ROUND, rng: Rng = Math.random, pool: readonly TranslationItem[] = translationPool()): TranslationItem[] {
  return shuffle(pool, rng).slice(0, count);
}

const toItem = (char: string, label: string, extra: Partial<PairItem> = {}): PairItem => ({ char, label, script: 'pair', ...extra });

/**
 * "O que quer dizer?": mostra a frase em japonês e quatro traduções. A certa leva a frase como `char`; as erradas
 * são traduções de outras frases (nunca iguais à certa).
 */
export function buildUnderstandQuestion(item: TranslationItem, rng: Rng = Math.random, pool: readonly TranslationItem[] = translationPool()): Question {
  const explain = `${item.jp} (${item.romaji}) = ${item.pt}`;
  const seen = new Set([item.pt.trim().toLowerCase()]);
  const wrong: string[] = [];
  for (const other of shuffle(pool, rng)) {
    if (wrong.length === 3) break;
    const key = other.pt.trim().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    wrong.push(other.pt);
  }
  const options = shuffle([toItem(item.jp, item.pt, { explain }), ...wrong.map((pt) => toItem(pt, pt))], rng);
  return { item: toItem(item.jp, item.jp, { reading: item.jp.replace(/ /g, ''), explain, ...(item.hint ? { hint: item.hint } : {}) }), direction: 'k2r', options, retry: false };
}

export function buildUnderstandRound(count: number = TRANSLATE_ROUND, rng: Rng = Math.random): Question[] {
  return pickItems(count, rng).map((item) => buildUnderstandQuestion(item, rng));
}
