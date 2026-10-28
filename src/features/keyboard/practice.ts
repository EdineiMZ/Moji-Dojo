import { VOCAB } from '@/content';
import { translationPool } from '@/features/translate/items';
import { shuffle, type Rng } from '@/features/quiz/quiz';
import { baseOf, howTo } from './flick';
import type { TypingProgress } from './typingStats';

/** De onde veio o item de treino. */
export type PracticeSource = 'word' | 'phrase' | 'mine' | 'ai';

/** Um texto para digitar com o teclado de flick, com o sentido em português. */
export interface PracticeItem {
  /** O que digitar (sem espaços). */
  text: string;
  meaning: string;
  level: number;
  source: PracticeSource;
}

export interface PracticeLevel {
  id: number;
  title: string;
  description: string;
}

export const LEVELS: readonly PracticeLevel[] = [
  { id: 1, title: 'Primeiras fileiras', description: 'あ か さ た な: só toques e deslizes simples.' },
  { id: 2, title: 'Todas as fileiras', description: 'は ま や ら わ, ん, ー e a pontuação.' },
  { id: 3, title: 'Sons com ゛ ゜', description: 'が ざ だ ば ぱ: use a tecla 小゛゜.' },
  { id: 4, title: 'Letras pequenas', description: 'っ ゃ ゅ ょ: pausas e sons combinados.' },
  { id: 5, title: 'Palavras longas e frases curtas', description: 'De 6 a 10 letras.' },
  { id: 6, title: 'Frases', description: 'Frases inteiras, de 11 letras em diante.' },
];

/** Itens concluídos num nível para liberar o seguinte. */
export const UNLOCK_AFTER = 8;

const EARLY = new Set([...'あいうえおかきくけこさしすせそたちつてとなにぬねの']);
const SMALL = new Set([...'っゃゅょぁぃぅぇぉゎ']);
export const SPACES = /[\s　]/g;

/** Tira os espaços: o teclado de flick do app não os tem e o japonês não os usa. */
export const compact = (text: string): string => text.replace(SPACES, '');

/** O texto só tem letras que o teclado de flick consegue digitar? */
export function typeable(text: string): boolean {
  const chars = [...text];
  return chars.length > 0 && chars.every((c) => howTo(c) !== null);
}

/** Nível de dificuldade de um texto: o mais difícil entre a letra mais difícil e o tamanho. */
export function levelOf(text: string): number {
  const chars = [...text];
  let level = 1;
  for (const c of chars) {
    if (SMALL.has(c)) level = Math.max(level, 4);
    else if (baseOf(c)[1] > 0) level = Math.max(level, 3);
    else if (!EARLY.has(c)) level = Math.max(level, 2);
  }
  if (chars.length >= 11) level = 6;
  else if (chars.length >= 6) level = Math.max(level, 5);
  return level;
}

/** O nível está liberado? O primeiro sempre; os outros depois de `UNLOCK_AFTER` itens no anterior. */
export function isUnlocked(level: number, typing: TypingProgress): boolean {
  return level <= 1 || (typing.levelDone[String(level - 1)] ?? 0) >= UNLOCK_AFTER;
}

/** O maior nível liberado. */
export function highestUnlocked(typing: TypingProgress): number {
  let top = 1;
  for (const l of LEVELS) if (isUnlocked(l.id, typing)) top = l.id;
  return top;
}

const MAX_LENGTH = 32;

export interface ExtraPhrase {
  jp: string;
  pt: string;
  source: Exclude<PracticeSource, 'word' | 'phrase'>;
}

/**
 * Todos os textos que dá para digitar: leituras do vocabulário, frases do app (gramática, Montar, viagem) e as
 * frases extras (do próprio aluno, da IA). Sem repetir.
 */
export function buildPracticePool(extras: readonly ExtraPhrase[] = []): PracticeItem[] {
  const seen = new Set<string>();
  const items: PracticeItem[] = [];
  const add = (jp: string, meaning: string, source: PracticeSource): void => {
    const text = compact(jp);
    if (text.length > MAX_LENGTH || seen.has(text) || !typeable(text)) return;
    seen.add(text);
    items.push({ text, meaning, level: levelOf(text), source });
  };
  for (const w of VOCAB) add(w.reading, w.meaning, 'word');
  for (const p of translationPool()) add(p.jp, p.pt, 'phrase');
  for (const e of extras) add(e.jp, e.pt, e.source);
  return items;
}

let cached: PracticeItem[] | null = null;
/** O conjunto base (sem extras), montado uma vez. */
export const basePool = (): readonly PracticeItem[] => (cached ??= buildPracticePool());

export type SeriesKind = 'punct' | 'numbers';

export const SERIES: readonly { id: SeriesKind; title: string; description: string }[] = [
  { id: 'punct', title: 'Pontuação', description: 'Frases inteiras com o sinal do fim: 。 ？ ！ (tecla 、: deslize para a esquerda, para cima ou para a direita). O sinal vem da tradução: pergunta, exclamação ou afirmação.' },
  { id: 'numbers', title: 'Números', description: 'Contar em kana: ひとつ, ふたつ, ひとり, ふたり... O teclado de flick não tem dígitos; no celular, os números saem pelo teclado de números.' },
];

const PUNCTUATION = /[、。？！…「」〜ー]/;

/** O sinal do fim da frase, pelo que a tradução mostra: pergunta (？), exclamação (！) ou afirmação (。). */
export const endMark = (meaning: string): string => {
  const end = meaning.trim().slice(-1);
  return end === '?' ? '？' : end === '!' ? '！' : '。';
};

/**
 * Os itens de uma série dirigida, dos mais curtos aos mais longos. Pontuação: as frases do app (só kana) com o sinal do fim,
 * que a tradução indica. Números: palavras do grupo Números.
 */
export function seriesItems(pool: readonly PracticeItem[], kind: SeriesKind): PracticeItem[] {
  if (kind === 'punct') {
    return pool
      .filter((i) => i.source === 'phrase' && !PUNCTUATION.test(i.text))
      .map((i) => ({ ...i, text: i.text + endMark(i.meaning) }))
      .filter((i) => typeable(i.text))
      .sort((a, b) => a.text.length - b.text.length);
  }
  const readings = new Set(VOCAB.filter((w) => /Números$/.test(w.group)).map((w) => compact(w.reading)));
  return pool.filter((i) => i.source === 'word' && readings.has(i.text)).sort((a, b) => a.level - b.level || a.text.length - b.text.length);
}

/** Itens de um nível. */
export const itemsOfLevel = (pool: readonly PracticeItem[], level: number): PracticeItem[] => pool.filter((i) => i.level === level);

/** Quantas letras fracas o item tem (para treinar o que a pessoa mais erra). */
export const weakCount = (item: PracticeItem, weak: ReadonlySet<string>): number => [...item.text].filter((c) => weak.has(c)).length;

/**
 * Sorteia o próximo item. Com `weak`, prefere quem tem mais letras fracas (e curtos). Evita repetir `avoid`.
 */
export function pickPractice(pool: readonly PracticeItem[], rng: Rng = Math.random, options: { weak?: ReadonlySet<string>; avoid?: string } = {}): PracticeItem | null {
  const candidates = pool.filter((i) => i.text !== options.avoid);
  const list = candidates.length > 0 ? candidates : pool;
  if (list.length === 0) return null;
  if (options.weak && options.weak.size > 0) {
    const scored = list.map((i) => ({ i, n: weakCount(i, options.weak as ReadonlySet<string>) })).filter((s) => s.n > 0);
    if (scored.length > 0) {
      // Dos 12 com mais letras fracas (e, empatando, os mais curtos), um ao acaso.
      scored.sort((a, b) => b.n - a.n || a.i.text.length - b.i.text.length);
      const top = shuffle(scored.slice(0, 12), rng);
      return top[0]?.i ?? null;
    }
  }
  return list[Math.floor(rng() * list.length)] ?? null;
}
