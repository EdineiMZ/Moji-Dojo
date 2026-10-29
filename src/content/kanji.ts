import { KANJI, KANJI_CATEGORIES } from '@/data/kanji';
import type { Kanji, KanjiCategory } from '@/data/types';
import { KANJI_EXTRA, KANJI_EXTRA_CATEGORIES } from './kanjiExtra';

/** Todos os kanji do app: os 102 iniciais mais o último do N5 e os do N4 (ver scripts/kanji). */
export const ALL_KANJI: readonly Kanji[] = [...KANJI, ...KANJI_EXTRA];

export const ALL_KANJI_CATEGORIES: readonly KanjiCategory[] = [...KANJI_CATEGORIES, ...KANJI_EXTRA_CATEGORIES];

/** O nível de um kanji: o dos grupos "N4: ..." e "N3: ..." vem do rótulo da categoria; os demais são do N5. */
export type KanjiLevel = 'N5' | 'N4' | 'N3';

const CATEGORY_LEVEL = new Map<string, KanjiLevel>(
  ALL_KANJI_CATEGORIES.map((c) => [c.id, c.label.startsWith('N4:') ? 'N4' : c.label.startsWith('N3:') ? 'N3' : 'N5']),
);

export const kanjiLevelOf = (k: Kanji): KanjiLevel => CATEGORY_LEVEL.get(k.category) ?? 'N5';
