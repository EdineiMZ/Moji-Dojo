import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import { emptyProgress, type ProgressSnapshot } from '@/features/progress/types';
import { answerReview, boostSkippedItems, learnItems, shouldApplyReviewAnswer } from '@/features/review/srs';
import { markDay } from '@/features/streak/days';

/** Como a pessoa avalia a própria fala no "Repetir" (shadowing). */
export type ShadowRating = 'ok' | 'mid' | 'bad';

export interface ProgressActions {
  /** Conclui a lição: entra na trilha, e os caracteres entram na revisão. */
  completeLesson: (lessonId: string, chars: readonly string[], skipped?: boolean, now?: number) => void;
  /** Conta um acerto/erro de qualquer quiz e marca o dia como estudado. */
  recordAnswer: (char: string, ok: boolean, now?: number) => void;
  /** Resposta numa revisão: além das estatísticas, reagenda o caractere. */
  recordReviewAnswer: (char: string, ok: boolean, firstTry: boolean, extra: boolean, now?: number) => void;
  /** Marca um desafio de digitação (chave = a palavra-alvo) como feito e marca o dia. */
  completeChallenge: (word: string, now?: number) => void;
  /** Guarda a autoavaliação de uma frase do Repetir (chave = a frase em japonês) e marca o dia. */
  rateShadow: (phrase: string, rating: ShadowRating, now?: number) => void;
  /** Marca o dia como estudado (ex.: ao conferir uma escrita). */
  markStudied: (now?: number) => void;
  /** Substitui todo o progresso (importação de backup). */
  replaceProgress: (snapshot: ProgressSnapshot) => void;
  resetProgress: () => void;
}

/**
 * Além do progresso do backup, guarda a autoavaliação do Repetir. Ela não faz parte do
 * snapshot (o backup do protótipo é só srs, lessons, stats e days), mas é zerada junto.
 */
export interface ProgressExtras {
  shadow: Readonly<Record<string, ShadowRating>>;
  /** Desafios de digitação feitos, pela palavra-alvo. */
  challenges: Readonly<Record<string, true>>;
}

export type ProgressState = ProgressSnapshot & ProgressExtras & ProgressActions;

export const PROGRESS_STORAGE_KEY = 'nihongo-dojo-progress';

/**
 * Cria o store de progresso. O armazenamento é injetado: o app usa o SQLite
 * (src/store/index.ts) e os testes usam um objeto em memória.
 */
export function createProgressStore(storage: StateStorage) {
  return create<ProgressState>()(
    persist(
      (set) => ({
        ...emptyProgress(),
        shadow: {},
        challenges: {},

        completeLesson: (lessonId, chars, skipped = false, now = Date.now()) =>
          set((s) => {
            let srs = learnItems(s.srs, chars, now);
            if (skipped) srs = boostSkippedItems(srs, chars, now);
            return {
              srs,
              lessons: { ...s.lessons, [lessonId]: true },
              days: markDay(s.days, new Date(now)),
            };
          }),

        recordAnswer: (char, ok, now = Date.now()) =>
          set((s) => {
            const prev = s.stats[char] ?? { c: 0, w: 0 };
            return {
              stats: { ...s.stats, [char]: ok ? { ...prev, c: prev.c + 1 } : { ...prev, w: prev.w + 1 } },
              days: markDay(s.days, new Date(now)),
            };
          }),

        recordReviewAnswer: (char, ok, firstTry, extra, now = Date.now()) =>
          set((s) => {
            const prev = s.stats[char] ?? { c: 0, w: 0 };
            const entry = s.srs[char];
            const reschedule = entry !== undefined && shouldApplyReviewAnswer(extra, ok, firstTry);
            return {
              stats: { ...s.stats, [char]: ok ? { ...prev, c: prev.c + 1 } : { ...prev, w: prev.w + 1 } },
              days: markDay(s.days, new Date(now)),
              ...(reschedule ? { srs: { ...s.srs, [char]: answerReview(entry, ok, !firstTry, now) } } : {}),
            };
          }),

        completeChallenge: (word, now = Date.now()) =>
          set((s) => ({ challenges: { ...s.challenges, [word]: true }, days: markDay(s.days, new Date(now)) })),

        rateShadow: (phrase, rating, now = Date.now()) =>
          set((s) => ({ shadow: { ...s.shadow, [phrase]: rating }, days: markDay(s.days, new Date(now)) })),

        markStudied: (now = Date.now()) => set((s) => ({ days: markDay(s.days, new Date(now)) })),

        replaceProgress: (snapshot) =>
          set({ srs: snapshot.srs, lessons: snapshot.lessons, stats: snapshot.stats, days: snapshot.days }),

        resetProgress: () => set({ ...emptyProgress(), shadow: {}, challenges: {} }),
      }),
      {
        name: PROGRESS_STORAGE_KEY,
        version: 1,
        storage: createJSONStorage(() => storage),
        // Só os dados são salvos, nunca as funções.
        partialize: ({ srs, lessons, stats, days, shadow, challenges }) => ({ srs, lessons, stats, days, shadow, challenges }),
      },
    ),
  );
}

export type ProgressStore = ReturnType<typeof createProgressStore>;
