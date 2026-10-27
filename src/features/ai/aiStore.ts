import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import type { DialogScene } from '@/content/dialogs';
import type { CoachPlan } from './coach';
import { MAX_QUEUE, sameSpec, type JobSpec, type QueuedJob } from './queue';
import type { ExamLevel, ExamQuestion, ExamSection } from './tasksPractice';

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

/** Um dia do diário: as frases escritas, já corrigidas pela IA. */
export interface DiaryEntry {
  id: string;
  at: number;
  items: readonly { original: string; ok: boolean; corrected: string; pt: string; note: string }[];
  summary: string;
}

/** Um texto de leitura criado pela IA. */
export interface StoredStory {
  id: string;
  at: number;
  topic: string;
  title: string;
  sentences: readonly { jp: string; reading: string; pt: string }[];
}

/** Um simulado criado pela IA, guardado para refazer sem internet. */
export interface StoredExam {
  id: string;
  at: number;
  level: ExamLevel;
  section: ExamSection;
  questions: readonly ExamQuestion[];
  /** Melhor nota (acertos), ou null se ainda não foi feito. */
  best: number | null;
}

/** O último plano do coach (um por vez: o da semana mais recente). */
export interface StoredCoach {
  weekKey: string;
  at: number;
  plan: CoachPlan;
}

export const MAX_SCENES = 12;
export const MAX_EXAMS = 10;
export const MAX_STORIES = 20;
export const MAX_DIARY = 60;
export const MAX_CACHE = 120;
export const MAX_AI_PHRASES = 200;

export interface AiStoreState {
  cache: Readonly<Record<string, CacheEntry>>;
  phrases: readonly AiPhrase[];
  diary: readonly DiaryEntry[];
  stories: readonly StoredStory[];
  scenes: readonly DialogScene[];
  exams: readonly StoredExam[];
  /** Pedidos feitos sem internet, para fazer quando ela voltar. */
  queue: readonly QueuedJob[];
  coach: StoredCoach | null;
  setCoach: (coach: StoredCoach | null) => void;
  putCache: (key: string, value: unknown, now?: number) => void;
  addPhrases: (phrases: readonly AiPhrase[]) => void;
  removePhrase: (id: string) => void;
  addDiary: (entry: DiaryEntry) => void;
  addStory: (story: StoredStory) => void;
  removeStory: (id: string) => void;
  addScene: (scene: DialogScene) => void;
  removeScene: (id: string) => void;
  addExam: (exam: StoredExam) => void;
  removeExam: (id: string) => void;
  /** Guarda a nota se for a melhor até agora. */
  recordExamScore: (id: string, score: number) => void;
  /** Guarda o pedido na fila (sem repetir pedido igual); false se a fila está cheia. */
  enqueue: (spec: JobSpec, now?: number) => boolean;
  dequeue: (id: string) => void;
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
      (set, get) => ({
        cache: {},
        phrases: [],
        diary: [],
        stories: [],
        scenes: [],
        exams: [],
        queue: [],
        coach: null,
        setCoach: (coach) => set({ coach }),
        putCache: (key, value, now = Date.now()) => set((s) => ({ cache: trimCache({ ...s.cache, [key]: { at: now, value } }) })),
        addPhrases: (added) => set((s) => ({ phrases: mergePhrases(s.phrases, added) })),
        removePhrase: (id) => set((s) => ({ phrases: s.phrases.filter((p) => p.id !== id) })),
        addDiary: (entry) => set((s) => ({ diary: [entry, ...s.diary].slice(0, MAX_DIARY) })),
        addStory: (story) => set((s) => ({ stories: [story, ...s.stories].slice(0, MAX_STORIES) })),
        removeStory: (id) => set((s) => ({ stories: s.stories.filter((x) => x.id !== id) })),
        addScene: (scene) => set((s) => ({ scenes: [scene, ...s.scenes].slice(0, MAX_SCENES) })),
        removeScene: (id) => set((s) => ({ scenes: s.scenes.filter((x) => x.id !== id) })),
        addExam: (exam) => set((s) => ({ exams: [exam, ...s.exams].slice(0, MAX_EXAMS) })),
        removeExam: (id) => set((s) => ({ exams: s.exams.filter((x) => x.id !== id) })),
        recordExamScore: (id, score) =>
          set((s) => ({ exams: s.exams.map((x) => (x.id === id ? { ...x, best: Math.max(x.best ?? 0, score) } : x)) })),
        enqueue: (spec, now = Date.now()) => {
          const { queue } = get();
          if (queue.some((j) => sameSpec(j.spec, spec))) return true;
          if (queue.length >= MAX_QUEUE) return false;
          set({ queue: [...queue, { id: `q${now.toString(36)}${queue.length}`, at: now, spec }] });
          return true;
        },
        dequeue: (id) => set((s) => ({ queue: s.queue.filter((j) => j.id !== id) })),
        clearAll: () => set({ cache: {}, phrases: [], diary: [], stories: [], scenes: [], exams: [], queue: [], coach: null }),
      }),
      {
        name: AI_STORAGE_KEY,
        version: 1,
        storage: createJSONStorage(() => storage),
        partialize: ({ cache, phrases, diary, stories, scenes, exams, queue, coach }) => ({ cache, phrases, diary, stories, scenes, exams, queue, coach }),
      },
    ),
  );
}

export type AiStore = ReturnType<typeof createAiStore>;
