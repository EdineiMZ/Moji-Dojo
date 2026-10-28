import { KANJI, KANJI_CATEGORIES } from '@/data/kanji';
import type { Kanji, KanjiCategory } from '@/data/types';
import { KANJI_EXTRA, KANJI_EXTRA_CATEGORIES } from './kanjiExtra';

/** Todos os kanji do app: os 102 iniciais mais o último do N5 e os do N4 (ver scripts/kanji). */
export const ALL_KANJI: readonly Kanji[] = [...KANJI, ...KANJI_EXTRA];

export const ALL_KANJI_CATEGORIES: readonly KanjiCategory[] = [...KANJI_CATEGORIES, ...KANJI_EXTRA_CATEGORIES];
