import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import { emptyProgress, type ProgressSnapshot } from '@/features/progress/types';
import { answerReview, boostSkippedItems, learnItems, shouldApplyReviewAnswer, type SrsEntry, type SrsState } from '@/features/review/srs';
import { addActivity, type ActivityHistory } from '@/features/stats/metrics';
import { markDay } from '@/features/streak/days';
import { checkPhrase, newPhraseId, type MyPhrase, type MyPhrases, type PhraseProblem } from '@/features/myphrases/phrases';
import { cardKeysFor as verbCardKeys, extraKeysFor as verbExtraKeys, EXTRA_PER_DAY, learnedVerbIds } from '@/features/conjugation/cards';
import { findVerb } from '@/features/conjugation/verbs';
import { isParticleCard } from '@/features/cloze/particles';
import { cardKeysFor, learnedWordIds as learnedVocabIds, READINGS_PER_DAY, readingKeysFor } from '@/features/vocab/cards';
import { findWord } from '@/content';
import { buyItem, dismissToast, emptyJourney, equipItem, sanitizeJourney, unequipSlot, type BuyError, type JourneyState } from '@/features/journey/journey';
import type { Slot } from '@/features/journey/items';

const DAY_MS = 86_400_000;

/** Tamanho máximo da dica de memória de uma palavra. */
export const MAX_NOTE_LENGTH = 200;

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
  /**
   * Libera os cartões de leitura (kanji → como se lê) das palavras com kanji já aprendidas, `READINGS_PER_DAY` por dia
   * para a pilha de revisões não crescer de uma vez. Não faz nada se não falta cartão.
   */
  unlockVocabReadings: (now?: number) => void;
  /** Resposta numa revisão de vocabulário (chave = o cartão): reagenda e marca o dia. */
  recordVocabAnswer: (cardKey: string, ok: boolean, firstTry: boolean, now?: number) => void;
  /** Verbos aprendidos: entram na revisão (um cartão por forma) já vencidos, para praticar na hora. */
  learnVerbs: (verbIds: readonly string[], now?: number) => void;
  /**
   * Libera as formas extras (ませんでした, たい, ている, ましょう) dos verbos já aprendidos, `EXTRA_PER_DAY` cartões por dia
   * para a pilha de revisões não crescer de uma vez. Não faz nada se não falta cartão.
   */
  unlockConjForms: (now?: number) => void;
  /** Compra um item do Mochi com pétalas. Devolve o motivo de não ter comprado, ou null. */
  buyJourneyItem: (itemId: string, now?: number) => BuyError | null;
  /** Veste um item que a pessoa tem. */
  equipJourneyItem: (itemId: string) => void;
  /** Tira o item de um espaço do Mochi. */
  unequipJourneySlot: (slot: Slot) => void;
  /** Fecha um aviso (conquista, nível, item...). */
  dismissJourneyToast: (id: string) => void;
  /** Troca uma função da jornada por outra pura: é por aqui que as telas fazem mudanças simples (opções, metas). */
  updateJourney: (change: (journey: JourneyState) => JourneyState) => void;
  /** Guarda a dica de memória de uma palavra (texto vazio apaga). Devolve false se o texto é longo demais. */
  setWordNote: (wordId: string, note: string) => boolean;
  /** Resposta numa revisão de partículas (chave = a partícula): reagenda e marca o dia. */
  recordParticleAnswer: (particle: string, ok: boolean, firstTry: boolean, now?: number) => void;
  /** Resposta numa revisão de conjugação (chave = "verbo|forma"): reagenda e marca o dia. */
  recordConjAnswer: (cardKey: string, ok: boolean, firstTry: boolean, now?: number) => void;
  /** Exercício solto (lacunas): conta no histórico do dia e marca o dia, sem agendar revisão. */
  recordDrill: (ok: boolean, now?: number) => void;
  /** Mini-teste de um tópico de gramática aprovado: o tópico fica "dominado" e o dia é marcado. */
  masterTopic: (topicId: string, now?: number) => void;
  /**
   * Salva uma frase própria (japonês + o que quer dizer). Devolve o id, ou o motivo de não ter salvo.
   * Entra na revisão já vencida.
   */
  addMyPhrase: (jp: string, pt: string, now?: number) => { id: string } | { error: PhraseProblem };
  /** Troca o texto de uma frase própria (a revisão continua como estava). */
  updateMyPhrase: (id: string, jp: string, pt: string) => PhraseProblem | null;
  removeMyPhrase: (id: string) => void;
  /** Resposta numa revisão de frase própria: reagenda e marca o dia. */
  recordMyPhraseAnswer: (id: string, ok: boolean, firstTry: boolean, now?: number) => void;
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
  /** Pétalas, itens do Mochi, conquistas, missões, metas e nível (ver features/journey). */
  journey: JourneyState;
  /** Dica de memória escrita pela pessoa, por palavra (a chave é o id da palavra). */
  wordNotes: Readonly<Record<string, string>>;
  /** Revisão espaçada das partículas, por cartão (a própria partícula). Quem nunca foi revisada está sempre vencida. */
  particles: SrsState;
  /** Tópicos de gramática dominados (mini-teste aprovado), pelo id, com o momento da aprovação. */
  mastered: Readonly<Record<string, number>>;
  /** Frases escritas pelo próprio aluno, pelo id. */
  myPhrases: MyPhrases;
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
        particles: {},
        wordNotes: {},
        journey: emptyJourney(),
        mastered: {},
        myPhrases: {},

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

        unlockVocabReadings: (now = Date.now()) =>
          set((s) => {
            const missing: string[] = [];
            for (const id of learnedVocabIds(s.vocab)) {
              const word = findWord(id);
              if (word) for (const key of readingKeysFor(word)) if (!s.vocab[key]) missing.push(key);
            }
            if (missing.length === 0) return s;
            const vocab: Record<string, SrsEntry> = { ...s.vocab };
            missing.forEach((key, i) => {
              vocab[key] = { b: 1, due: now + Math.floor(i / READINGS_PER_DAY) * DAY_MS };
            });
            return { vocab };
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

        unlockConjForms: (now = Date.now()) =>
          set((s) => {
            const missing: string[] = [];
            for (const id of learnedVerbIds(s.conj)) {
              const verb = findVerb(id);
              if (verb) for (const key of verbExtraKeys(verb)) if (!s.conj[key]) missing.push(key);
            }
            if (missing.length === 0) return s;
            const conj: Record<string, SrsEntry> = { ...s.conj };
            missing.forEach((key, i) => {
              conj[key] = { b: 1, due: now + Math.floor(i / EXTRA_PER_DAY) * DAY_MS };
            });
            return { conj };
          }),

        buyJourneyItem: (itemId, now = Date.now()) => {
          let failure: BuyError | null = null;
          set((s) => {
            const result = buyItem(s.journey, itemId, new Date(now));
            if (!result.ok) {
              failure = result.error;
              return s;
            }
            return { journey: result.state };
          });
          return failure;
        },
        equipJourneyItem: (itemId) => set((s) => ({ journey: equipItem(s.journey, itemId) })),
        unequipJourneySlot: (slot) => set((s) => ({ journey: unequipSlot(s.journey, slot) })),
        dismissJourneyToast: (id) => set((s) => ({ journey: dismissToast(s.journey, id) })),
        updateJourney: (change) => set((s) => ({ journey: change(s.journey) })),

        setWordNote: (wordId, note) => {
          const text = note.trim();
          if (text.length > MAX_NOTE_LENGTH || !findWord(wordId)) return false;
          set((s) => {
            const wordNotes = { ...s.wordNotes };
            if (text) wordNotes[wordId] = text;
            else delete wordNotes[wordId];
            return { wordNotes };
          });
          return true;
        },

        recordParticleAnswer: (particle, ok, firstTry, now = Date.now()) =>
          set((s) => {
            if (!isParticleCard(particle)) return s;
            const entry = s.particles[particle] ?? { b: 1, due: now };
            return {
              days: markDay(s.days, new Date(now)),
              history: addActivity(s.history, new Date(now), { answers: 1, correct: ok ? 1 : 0 }),
              particles: { ...s.particles, [particle]: answerReview(entry, ok, !firstTry, now) },
            };
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

        recordDrill: (ok, now = Date.now()) =>
          set((s) => ({
            days: markDay(s.days, new Date(now)),
            history: addActivity(s.history, new Date(now), { answers: 1, correct: ok ? 1 : 0 }),
          })),

        masterTopic: (topicId, now = Date.now()) =>
          set((s) => ({
            mastered: s.mastered[topicId] ? s.mastered : { ...s.mastered, [topicId]: now },
            days: markDay(s.days, new Date(now)),
          })),

        addMyPhrase: (jp, pt, now = Date.now()) => {
          let outcome: { id: string } | { error: PhraseProblem } = { error: 'empty-jp' };
          set((s) => {
            const error = checkPhrase(jp, pt, s.myPhrases);
            if (error) {
              outcome = { error };
              return {};
            }
            const id = newPhraseId(s.myPhrases, now);
            const phrase: MyPhrase = { jp: jp.trim(), pt: pt.trim(), at: now, b: 1, due: now };
            outcome = { id };
            return { myPhrases: { ...s.myPhrases, [id]: phrase }, days: markDay(s.days, new Date(now)) };
          });
          return outcome;
        },

        updateMyPhrase: (id, jp, pt) => {
          let problem: PhraseProblem | null = null;
          set((s) => {
            const current = s.myPhrases[id];
            if (!current) return {};
            problem = checkPhrase(jp, pt, s.myPhrases, id);
            if (problem) return {};
            return { myPhrases: { ...s.myPhrases, [id]: { ...current, jp: jp.trim(), pt: pt.trim() } } };
          });
          return problem;
        },

        removeMyPhrase: (id) =>
          set((s) => {
            const { [id]: _removed, ...rest } = s.myPhrases;
            return { myPhrases: rest };
          }),

        recordMyPhraseAnswer: (id, ok, firstTry, now = Date.now()) =>
          set((s) => {
            const phrase = s.myPhrases[id];
            if (!phrase) return {};
            const next = answerReview({ b: phrase.b, due: phrase.due }, ok, !firstTry, now);
            return {
              myPhrases: { ...s.myPhrases, [id]: { ...phrase, b: next.b, due: next.due } },
              days: markDay(s.days, new Date(now)),
              history: addActivity(s.history, new Date(now), { answers: 1, correct: ok ? 1 : 0 }),
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
            ...(extras ? { shadow: extras.shadow, challenges: extras.challenges, vocab: extras.vocab, conj: extras.conj, particles: extras.particles, wordNotes: extras.wordNotes, journey: extras.journey, mastered: extras.mastered, myPhrases: extras.myPhrases } : {}),
          }),

        resetProgress: () => set({ ...emptyProgress(), shadow: {}, challenges: {}, history: {}, vocab: {}, conj: {}, particles: {}, wordNotes: {}, journey: emptyJourney(), mastered: {}, myPhrases: {} }),
      }),
      {
        name: PROGRESS_STORAGE_KEY,
        version: 1,
        storage: createJSONStorage(() => storage),
        // O que vem do disco passa pela leitura segura: estado salvo por uma versão antiga ganha os campos novos.
        merge: (persisted, current) => {
          const saved = (persisted ?? {}) as Partial<ProgressState> & { journey?: unknown };
          return { ...current, ...saved, journey: sanitizeJourney(saved.journey) };
        },
        // Só os dados são salvos, nunca as funções.
        partialize: ({ srs, lessons, stats, days, shadow, challenges, history, vocab, conj, particles, wordNotes, journey, mastered, myPhrases }) => ({
          srs,
          lessons,
          stats,
          days,
          shadow,
          challenges,
          history,
          vocab,
          conj,
          particles,
          wordNotes,
          journey,
          mastered,
          myPhrases,
        }),
      },
    ),
  );
}

export type ProgressStore = ReturnType<typeof createProgressStore>;
