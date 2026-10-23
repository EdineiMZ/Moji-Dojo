import { TRAVEL_CATEGORIES } from '@/data/travel';
import type { TravelCategory } from '@/data/types';
import { TRAVEL_EXTRA } from './travelExtra';

/**
 * Todas as frases de viagem e de dia a dia: as 37 do HTML original mais as escritas depois (src/content/travelExtra.ts).
 * Categorias com o mesmo nome são somadas (as do original primeiro); as novas vêm no fim.
 */
export const ALL_TRAVEL: readonly TravelCategory[] = (() => {
  const merged = TRAVEL_CATEGORIES.map((c): TravelCategory => ({ category: c.category, phrases: [...c.phrases] }));
  for (const extra of TRAVEL_EXTRA) {
    const same = merged.find((c) => c.category === extra.category);
    if (same) same.phrases = [...same.phrases, ...extra.phrases];
    else merged.push({ category: extra.category, phrases: [...extra.phrases] });
  }
  return merged;
})();

/** Ordem das abas: o que mais se usa primeiro quando se chega ao Japão. */
export const ALL_TRAVEL_PHRASES = ALL_TRAVEL.flatMap((c) => c.phrases.map((p) => ({ ...p, category: c.category })));
