import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import { emptyProgress, type ProgressSnapshot } from '@/features/progress/types';
import { answerReview, boostSkippedItems, learnItems, shouldApplyReviewAnswer, type SrsEntry, type SrsState } from '@/features/review/srs';
import { addActivity, type ActivityHistory } from '@/features/stats/metrics';
import { markDay } from '@/features/streak/days';
import { cardKeysFor as verbCardKeys } from '@/features/conjugation/cards';
import { findVerb } from '@/features/conjugation/verbs';
import { cardKeysFor } from '@/features/vocab/cards';
import { findWord } from '@/content';

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
  /** Palavras aprendidas: entram na revisão (3 cartões, ou 2 se tiver kanji) já vencidas, para praticar na hora. */
  learnWords: (wordIds: readonly string[], now?: number) => void;
  /** Resposta numa revisão de vocabulário (chave = o cartão): reagenda e marca o dia. */
  recordVocabAnswer: (cardKey: string, ok: boolean, firstTry: boolean, now?: number) => void;
  /** Verbos aprendidos: entram na revisão (um cartão por forma) já vencidos, para praticar na hora. */
  learnVerbs: (verbIds: readonly string[], now?: number) => void;
  /** Resposta numa revisão de conjugação (chave = "verbo|forma"): reagenda e marca o dia. */
  recordConjAnswer: (cardKey: string, ok: boolean, firstTry: boolean, now?: number) => void;
  /** Marca o dia como estudado (ex.: ao conferir uma escrita). */
  markStudied: (now?: number) => void;
  /**
   * Substitui todo o progresso (importação de backup). Com `extras` (backup do próprio app), troca também
   * histórico, autoavaliação e desafios; sem eles (backup do protótipo), só o histórico é zerado.
   */
  replaceProgress: (snapshot: ProgressSnapshot, extras?: ProgressExtras) => void;
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
  /** Atividade por dia (respostas, acertos, caracteres aprendidos), para o painel de evolução. */
  history: ActivityHistory;
  /** Revisão espaçada do vocabulário, por cartão ("palavra|direção"). Separada do `srs` dos caracteres. */
  vocab: SrsState;
  /** Revisão espaçada da conjugação, por cartão ("verbo|forma"). */
  conj: SrsState;
}

export type ProgressState = ProgressSnapshot & ProgressExtras & ProgressActions;

export const PROGRESS_STORAGE_KEY = 'moji-dojo-progress';

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
        history: {},
        vocab: {},
        conj: {},

        completeLesson: (lessonId, chars, skipped = false, now = Date.now()) =>
          set((s) => {
            let srs = learnItems(s.srs, chars, now);
            if (skipped) srs = boostSkippedItems(srs, chars, now);
            const newlyLearned = chars.filter((c) => !s.srs[c]).length;
            return {
              srs,
              lessons: { ...s.lessons, [lessonId]: true },
              days: markDay(s.days, new Date(now)),
              history: addActivity(s.history, new Date(now), { learned: newlyLearned }),
            };
          }),

        recordAnswer: (char, ok, now = Date.now()) =>
          set((s) => {
            const prev = s.stats[char] ?? { c: 0, w: 0 };
            return {
              stats: { ...s.stats, [char]: ok ? { ...prev, c: prev.c + 1 } : { ...prev, w: prev.w + 1 } },
              days: markDay(s.days, new Date(now)),
              history: addActivity(s.history, new Date(now), { answers: 1, correct: ok ? 1 : 0 }),
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
              history: addActivity(s.history, new Date(now), { answers: 1, correct: ok ? 1 : 0 }),
              ...(reschedule ? { srs: { ...s.srs, [char]: answerReview(entry, ok, !firstTry, now) } } : {}),
            };
          }),

        completeChallenge: (word, now = Date.now()) =>
          set((s) => ({ challenges: { ...s.challenges, [word]: true }, days: markDay(s.days, new Date(now)) })),

        rateShadow: (phrase, rating, now = Date.now()) =>
          set((s) => ({ shadow: { ...s.shadow, [phrase]: rating }, days: markDay(s.days, new Date(now)) })),

        learnWords: (wordIds, now = Date.now()) =>
          set((s) => {
            const vocab: Record<string, SrsEntry> = { ...s.vocab };
            for (const id of wordIds) {
              const word = findWord(id);
              if (!word) continue;
              for (const key of cardKeysFor(word)) if (!vocab[key]) vocab[key] = { b: 1, due: now };
            }
            return { vocab, days: markDay(s.days, new Date(now)) };
          }),

        recordVocabAnswer: (cardKey, ok, firstTry, now = Date.now()) =>
          set((s) => {
            const entry = s.vocab[cardKey];
            return {
              days: markDay(s.days, new Date(now)),
              history: addActivity(s.history, new Date(now), { answers: 1, correct: ok ? 1 : 0 }),
              ...(entry ? { vocab: { ...s.vocab, [cardKey]: answerReview(entry, ok, !firstTry, now) } } : {}),
            };
          }),

        learnVerbs: (verbIds, now = Date.now()) =>
          set((s) => {
            const conj: Record<string, SrsEntry> = { ...s.conj };
            for (const id of verbIds) {
              const verb = findVerb(id);
              if (!verb) continue;
              for (const key of verbCardKeys(verb)) if (!conj[key]) conj[key] = { b: 1, due: now };
            }
            return { conj, days: markDay(s.days, new Date(now)) };
          }),

        recordConjAnswer: (cardKey, ok, firstTry, now = Date.now()) =>
          set((s) => {
            const entry = s.conj[cardKey];
            return {
              days: markDay(s.days, new Date(now)),
              history: addActivity(s.history, new Date(now), { answers: 1, correct: ok ? 1 : 0 }),
              ...(entry ? { conj: { ...s.conj, [cardKey]: answerReview(entry, ok, !firstTry, now) } } : {}),
            };
          }),

        markStudied: (now = Date.now()) => set((s) => ({ days: markDay(s.days, new Date(now)) })),

        replaceProgress: (snapshot, extras) =>
          // O histórico do progresso antigo não vale para o importado; o backup do protótipo não traz histórico.
          set({
            srs: snapshot.srs,
            lessons: snapshot.lessons,
            stats: snapshot.stats,
            days: snapshot.days,
            history: extras?.history ?? {},
            ...(extras ? { shadow: extras.shadow, challenges: extras.challenges, vocab: extras.vocab, conj: extras.conj } : {}),
          }),

        resetProgress: () => set({ ...emptyProgress(), shadow: {}, challenges: {}, history: {}, vocab: {}, conj: {} }),
      }),
      {
        name: PROGRESS_STORAGE_KEY,
        version: 1,
        storage: createJSONStorage(() => storage),
        // Só os dados são salvos, nunca as funções.
        partialize: ({ srs, lessons, stats, days, shadow, challenges, history, vocab, conj }) => ({
          srs,
          lessons,
          stats,
          days,
          shadow,
          challenges,
          history,
          vocab,
          conj,
        }),
      },
    ),
  );
}

export type ProgressStore = ReturnType<typeof createProgressStore>;
