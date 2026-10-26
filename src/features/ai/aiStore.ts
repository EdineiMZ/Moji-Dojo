import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

/** Uma resposta guardada, para não gastar a IA de novo com o mesmo pedido. */
export interface CacheEntry {
  at: number;
  value: unknown;
}

/** Uma frase gerada pela IA para o treino de digitação (guardada para estudar sem internet). */
export interface AiPhrase {
  id: string;
  /** Em hiragana (o que o teclado de flick digita). */
  jp: string;
  pt: string;
  /** O tema pedido. */
  topic: string;
  at: number;
  /** Palavras que o app não conhece (fora do vocabulário), para avisar. */
  unknown: readonly string[];
}

export const MAX_CACHE = 120;
export const MAX_AI_PHRASES = 200;

export interface AiStoreState {
  cache: Readonly<Record<string, CacheEntry>>;
  phrases: readonly AiPhrase[];
  putCache: (key: string, value: unknown, now?: number) => void;
  addPhrases: (phrases: readonly AiPhrase[]) => void;
  removePhrase: (id: string) => void;
  clearAll: () => void;
}

export const AI_STORAGE_KEY = 'moji-dojo-ai';

/** As mais recentes até o limite. */
export function trimCache(cache: Readonly<Record<string, CacheEntry>>, max: number = MAX_CACHE): Record<string, CacheEntry> {
  const entries = Object.entries(cache);
  if (entries.length <= max) return { ...cache };
  return Object.fromEntries(entries.sort((a, b) => b[1].at - a[1].at).slice(0, max));
}

/** Frases novas primeiro, sem repetir o japonês, até o limite. */
export function mergePhrases(current: readonly AiPhrase[], added: readonly AiPhrase[], max: number = MAX_AI_PHRASES): AiPhrase[] {
  const seen = new Set<string>();
  const out: AiPhrase[] = [];
  for (const p of [...added, ...current]) {
    if (seen.has(p.jp)) continue;
    seen.add(p.jp);
    out.push(p);
  }
  return out.slice(0, max);
}

/**
 * O que a IA gerou e ficou guardado no aparelho: respostas repetidas (cache) e as frases para treinar. Fica fora do
 * progresso e do backup: é conteúdo descartável, que a IA refaz quando precisar.
 */
export function createAiStore(storage: StateStorage) {
  return create<AiStoreState>()(
    persist(
      (set) => ({
        cache: {},
        phrases: [],
        putCache: (key, value, now = Date.now()) => set((s) => ({ cache: trimCache({ ...s.cache, [key]: { at: now, value } }) })),
        addPhrases: (added) => set((s) => ({ phrases: mergePhrases(s.phrases, added) })),
        removePhrase: (id) => set((s) => ({ phrases: s.phrases.filter((p) => p.id !== id) })),
        clearAll: () => set({ cache: {}, phrases: [] }),
      }),
      {
        name: AI_STORAGE_KEY,
        version: 1,
        storage: createJSONStorage(() => storage),
        partialize: ({ cache, phrases }) => ({ cache, phrases }),
      },
    ),
  );
}

export type AiStore = ReturnType<typeof createAiStore>;
