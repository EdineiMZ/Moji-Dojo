import { TRAVEL_CATEGORIES } from '@/data/travel';
import type { TravelCategory, TravelPhrase } from '@/data/types';
import { TRAVEL_EXTRA } from './travelExtra';

/**
 * Todas as frases de viagem e de dia a dia: as 37 iniciais mais as escritas depois (src/content/travelExtra.ts).
 * Categorias com o mesmo nome são somadas (as do original primeiro); as novas vêm no fim.
 */
/** Correções do "Palavra por palavra" do original (o arquivo src/data/travel.ts é gerado e não se edita à mão). */
const BREAKDOWN_FIXES: Readonly<Record<string, TravelPhrase['breakdown']>> = {
  'つぎの えきは なんですか': [
    { part: 'つぎ', meaning: 'próximo' },
    { part: 'の', meaning: 'liga as palavras' },
    { part: 'えき', meaning: 'estação' },
    { part: 'は', meaning: 'quanto a' },
    { part: 'なんですか', meaning: 'o que é?' },
  ],
};

export const ALL_TRAVEL: readonly TravelCategory[] = (() => {
  const merged = TRAVEL_CATEGORIES.map(
    (c): TravelCategory => ({ category: c.category, phrases: c.phrases.map((p) => (BREAKDOWN_FIXES[p.jp] ? { ...p, breakdown: BREAKDOWN_FIXES[p.jp]! } : p)) }),
  );
  for (const extra of TRAVEL_EXTRA) {
    const same = merged.find((c) => c.category === extra.category);
    if (same) same.phrases = [...same.phrases, ...extra.phrases];
    else merged.push({ category: extra.category, phrases: [...extra.phrases] });
  }
  return merged;
})();

/** Ordem das abas: o que mais se usa primeiro quando se chega ao Japão. */
export const ALL_TRAVEL_PHRASES = ALL_TRAVEL.flatMap((c) => c.phrases.map((p) => ({ ...p, category: c.category })));
