import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import { emptyProgress, type ProgressSnapshot } from '@/features/progress/types';
import { placeKnown } from '@/features/placement/placement';
import { MATURE_BOX } from '@/features/journey/skills';
import { answerReview, boostSkippedItems, learnItems, shouldApplyReviewAnswer, type SrsEntry, type SrsState } from '@/features/review/srs';
import { addActivity, type ActivityHistory } from '@/features/stats/metrics';
import { markDay } from '@/features/streak/days';
import { checkPhrase, newPhraseId, type MyPhrase, type MyPhrases, type PhraseProblem } from '@/features/myphrases/phrases';
import { cardKeysFor as verbCardKeys, extraKeysFor as verbExtraKeys, EXTRA_PER_DAY, learnedVerbIds } from '@/features/conjugation/cards';
import { findVerb } from '@/features/conjugation/verbs';
import { isParticleCard } from '@/features/cloze/particles';
import { cardKeysFor, learnedWordIds as learnedVocabIds, parseCardKey as parseVocabKey, READINGS_PER_DAY, readingKeysFor } from '@/features/vocab/cards';
import { findWord } from '@/content';
import { askedWeekToday, claimWeekChestWithLoot, openDailyChest as openChest } from '@/features/journey/events';
import type { Loot, Rng } from '@/features/journey/loot';
import { applyRescue, declineRescue as declineOffer, rescuePassed, resolveRescue } from '@/features/journey/rescue';
import { trackAnswer, trackDialog, trackExplored, trackLesson, trackNewWords, trackOpen, trackPhrase, trackRecording, trackSession, trackStudyTime, trackTouch, buildContext } from '@/features/journey/track';
import type { Area } from '@/features/journey/events';
import { buyItem, dismissToast, emptyJourney, equipItem, sanitizeJourney, unequipSlot, type BuyError, type JourneyState } from '@/features/journey/journey';
import type { Slot } from '@/features/journey/items';
import { EMPTY_TYPING, recordItem, recordKey, sanitizeTyping, type TypingKeyEvent, type TypingProgress } from '@/features/keyboard/typingStats';

const DAY_MS = 86_400_000;

/** O grupo do vocabulário de um cartão ("palavra|direção"), para o desafio da semana. */
const groupOf = (cardKey: string): { group?: string } => {
  const group = parseVocabKey(cardKey)?.word.group;
  return group ? { group } : {};
};

/** Tamanho máximo da dica de memória de uma palavra. */
export const MAX_NOTE_LENGTH = 200;

/** Como a pessoa avalia a própria fala no "Repetir" (shadowing). */
export type ShadowRating = 'ok' | 'mid' | 'bad';

export interface ProgressActions {
  /** Conclui a lição: entra na trilha, e os caracteres entram na revisão. */
  completeLesson: (lessonId: string, chars: readonly string[], skipped?: boolean, now?: number, result?: { first: number; total: number }) => void;
  /** Conta um acerto/erro de qualquer quiz e marca o dia como estudado. */
  recordAnswer: (char: string, ok: boolean, now?: number, drawn?: boolean) => void;
  /** Resposta numa revisão: além das estatísticas, reagenda o caractere. */
  recordReviewAnswer: (char: string, ok: boolean, firstTry: boolean, extra: boolean, now?: number, drawn?: boolean) => void;
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
  recordDrill: (ok: boolean, area?: Area, now?: number) => void;
  /** Mini-teste de um tópico de gramática aprovado: o tópico fica "dominado" e o dia é marcado. */
  masterTopic: (topicId: string, now?: number) => void;
  /** Teste de nivelamento: os kana e as palavras que a pessoa já sabe entram na revisão já firmes (caixa 3). */
  applyPlacement: (chars: readonly string[], wordCards: readonly string[], now?: number) => void;
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
  /** Soma segundos de uso ativo ao dia de hoje (para a meta de minutos). */
  recordStudyTime: (seconds: number, now?: number) => void;
  /** Frases do Explorar folheadas (missão de explorar). */
  recordExplored: (count: number, now?: number) => void;
  /** O app foi aberto: marca o dia, dá o bônus diário e, se for o caso, oferece salvar a sequência. */
  openApp: (now?: number) => void;
  /** Uma sessão longa (revisão do dia) terminou com `first` acertos de primeira em `total`. */
  recordSession: (first: number, total: number, now?: number, seconds?: number) => void;
  /** A pessoa gravou a própria voz. */
  recordRecording: (now?: number) => void;
  /** Uma cena de diálogo terminou (perfeita = sem erro). */
  recordDialogDone: (perfect: boolean, now?: number) => void;
  /** Abre o baú da semana, se a meta foi batida. Devolve o que saiu (null se não havia baú). */
  claimWeekChest: (now?: number, rng?: Rng) => Loot | null;
  /** Abre o baú do dia, se estiver pronto. Devolve o que saiu (null se não havia baú). */
  openDailyChest: (now?: number, rng?: Rng) => Loot | null;
  /** Marca que o aviso do baú da semana já foi mostrado hoje. */
  askWeekChest: () => void;
  /** Termina a revisão de resgate: com nota suficiente os dias perdidos viram estudados. */
  finishRescue: (first: number, total: number, now?: number) => void;
  /** Recusa o resgate: a sequência recomeça. */
  declineRescue: () => void;
  /** Marca o dia como estudado (ex.: ao conferir uma escrita). */
  markStudied: (now?: number) => void;
  /** Guarda o treino de digitação: as letras tentadas e, se o item foi concluído, quanto levou. */
  recordTyping: (keys: readonly TypingKeyEvent[], item?: { level: number; chars: number; ms: number }, now?: number) => void;
  /**
   * Substitui todo o progresso (importação de backup). Com `extras` (backup do próprio app), troca também
   * histórico, autoavaliação e desafios; sem eles (backup do formato antigo), só o histórico é zerado.
   */
  replaceProgress: (snapshot: ProgressSnapshot, extras?: ProgressExtras) => void;
  resetProgress: () => void;
}

/**
 * Além do progresso do backup, guarda a autoavaliação do Repetir. Ela não faz parte do
 * snapshot (o backup do formato antigo é só srs, lessons, stats e days), mas é zerada junto.
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
  /** Treino de digitação no teclado de flick: desempenho por letra, níveis e recorde. */
  typing: TypingProgress;
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
        typing: EMPTY_TYPING,

        completeLesson: (lessonId, chars, skipped = false, now = Date.now(), result) =>
          set((s) => {
            let srs = learnItems(s.srs, chars, now);
            if (skipped) srs = boostSkippedItems(srs, chars, now);
            const newlyLearned = chars.filter((c) => !s.srs[c]).length;
            const days = markDay(s.days, new Date(now));
            const lessons: Readonly<Record<string, true>> = { ...s.lessons, [lessonId]: true };
            // Sem a nota (chamadas antigas), a lição conta como feita sem recompensa de pétalas.
            const journey = result
              ? trackLesson({ ...s, lessons }, days, now, { lessonId, first: result.first, total: result.total, skipped })
              : trackTouch({ ...s, lessons }, days, now);
            return { srs, lessons, days, history: addActivity(s.history, new Date(now), { learned: newlyLearned }), journey };
          }),

        recordAnswer: (char, ok, now = Date.now(), drawn = false) =>
          set((s) => {
            const prev = s.stats[char] ?? { c: 0, w: 0 };
            const days = markDay(s.days, new Date(now));
            return {
              stats: { ...s.stats, [char]: ok ? { ...prev, c: prev.c + 1 } : { ...prev, w: prev.w + 1 } },
              days,
              history: addActivity(s.history, new Date(now), { answers: 1, correct: ok ? 1 : 0 }),
              journey: trackAnswer(s, days, now, { ok, area: 'kana', ref: `srs:${char}`, ...(drawn ? { drawn } : {}) }),
            };
          }),

        recordReviewAnswer: (char, ok, firstTry, extra, now = Date.now(), drawn = false) =>
          set((s) => {
            const prev = s.stats[char] ?? { c: 0, w: 0 };
            const entry = s.srs[char];
            const reschedule = entry !== undefined && shouldApplyReviewAnswer(extra, ok, firstTry);
            const days = markDay(s.days, new Date(now));
            return {
              stats: { ...s.stats, [char]: ok ? { ...prev, c: prev.c + 1 } : { ...prev, w: prev.w + 1 } },
              days,
              journey: trackAnswer(s, days, now, { ok, area: 'kana', ref: `srs:${char}`, review: true, mature: (entry?.b ?? 0) >= MATURE_BOX, ...(drawn ? { drawn } : {}) }),
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
            const before = learnedVocabIds(s.vocab);
            let fresh = 0;
            for (const id of wordIds) {
              const word = findWord(id);
              if (!word) continue;
              if (!before.has(id)) fresh++;
              for (const key of cardKeysFor(word)) if (!vocab[key]) vocab[key] = { b: 1, due: now };
            }
            const days = markDay(s.days, new Date(now));
            return { vocab, days, journey: trackNewWords({ ...s, vocab }, days, now, fresh) };
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
            const days = markDay(s.days, new Date(now));
            return {
              days,
              journey: trackAnswer(s, days, now, { ok, area: 'vocab', ref: `vocab:${cardKey}`, review: true, mature: (entry?.b ?? 0) >= MATURE_BOX, ...groupOf(cardKey) }),
              history: addActivity(s.history, new Date(now), { answers: 1, correct: ok ? 1 : 0 }),
              ...(entry ? { vocab: { ...s.vocab, [cardKey]: answerReview(entry, ok, !firstTry, now) } } : {}),
            };
          }),

        learnVerbs: (verbIds, now = Date.now()) =>
          set((s) => {
            const conj: Record<string, SrsEntry> = { ...s.conj };
            const before = learnedVerbIds(s.conj);
            let fresh = 0;
            for (const id of verbIds) {
              const verb = findVerb(id);
              if (!verb) continue;
              if (!before.has(id)) fresh++;
              for (const key of verbCardKeys(verb)) if (!conj[key]) conj[key] = { b: 1, due: now };
            }
            const days = markDay(s.days, new Date(now));
            return { conj, days, journey: trackNewWords(s, days, now, fresh) };
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
            const days = markDay(s.days, new Date(now));
            return {
              days,
              journey: trackAnswer(s, days, now, { ok, area: 'particle', ref: `particle:${particle}`, review: true, mature: (entry?.b ?? 0) >= MATURE_BOX }),
              history: addActivity(s.history, new Date(now), { answers: 1, correct: ok ? 1 : 0 }),
              particles: { ...s.particles, [particle]: answerReview(entry, ok, !firstTry, now) },
            };
          }),

        recordConjAnswer: (cardKey, ok, firstTry, now = Date.now()) =>
          set((s) => {
            const entry = s.conj[cardKey];
            const days = markDay(s.days, new Date(now));
            return {
              days,
              journey: trackAnswer(s, days, now, { ok, area: 'conj', ref: `conj:${cardKey}`, review: true, mature: (entry?.b ?? 0) >= MATURE_BOX }),
              history: addActivity(s.history, new Date(now), { answers: 1, correct: ok ? 1 : 0 }),
              ...(entry ? { conj: { ...s.conj, [cardKey]: answerReview(entry, ok, !firstTry, now) } } : {}),
            };
          }),

        recordDrill: (ok, area = 'drill', now = Date.now()) =>
          set((s) => {
            const days = markDay(s.days, new Date(now));
            return {
              days,
              history: addActivity(s.history, new Date(now), { answers: 1, correct: ok ? 1 : 0 }),
              journey: trackAnswer(s, days, now, { ok, area }),
            };
          }),

        applyPlacement: (chars, wordCards, now = Date.now()) =>
          set((s) => {
            const days = markDay(s.days, new Date(now));
            return { srs: placeKnown(s.srs, chars, now), vocab: placeKnown(s.vocab, wordCards, now), days };
          }),

        masterTopic: (topicId, now = Date.now()) =>
          set((s) => {
            const mastered = s.mastered[topicId] ? s.mastered : { ...s.mastered, [topicId]: now };
            const days = markDay(s.days, new Date(now));
            return { mastered, days, journey: trackTouch({ ...s, mastered }, days, now) };
          }),

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
            const myPhrases = { ...s.myPhrases, [id]: phrase };
            const days = markDay(s.days, new Date(now));
            return { myPhrases, days, journey: trackPhrase({ ...s, myPhrases }, days, now) };
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
            const days = markDay(s.days, new Date(now));
            return {
              myPhrases: { ...s.myPhrases, [id]: { ...phrase, b: next.b, due: next.due } },
              days,
              journey: trackAnswer(s, days, now, { ok, area: 'phrase', ref: `phrase:${id}`, review: true, mature: phrase.b >= MATURE_BOX }),
              history: addActivity(s.history, new Date(now), { answers: 1, correct: ok ? 1 : 0 }),
            };
          }),

        recordStudyTime: (seconds, now = Date.now()) => set((s) => ({ journey: trackStudyTime(s, s.days, now, seconds) })),

        recordExplored: (count, now = Date.now()) =>
          set((s) => {
            const days = markDay(s.days, new Date(now));
            return { days, journey: trackExplored(s, days, now, count) };
          }),

        openApp: (now = Date.now()) =>
          set((s) => {
            const days = markDay(s.days, new Date(now));
            return { days, journey: trackOpen(s, s.days, days, now) };
          }),

        recordSession: (first, total, now = Date.now(), seconds) =>
          set((s) => {
            const days = markDay(s.days, new Date(now));
            return { days, journey: trackSession(s, days, now, first, total, seconds) };
          }),

        recordRecording: (now = Date.now()) =>
          set((s) => {
            const days = markDay(s.days, new Date(now));
            return { days, journey: trackRecording(s, days, now) };
          }),

        recordDialogDone: (perfect, now = Date.now()) =>
          set((s) => {
            const days = markDay(s.days, new Date(now));
            return { days, journey: trackDialog(s, days, now, perfect) };
          }),

        claimWeekChest: (now = Date.now(), rng) => {
          let loot: Loot | null = null;
          set((s) => {
            const result = claimWeekChestWithLoot(s.journey, buildContext(s, s.days, now), rng);
            loot = result.loot;
            return { journey: result.state };
          });
          return loot;
        },

        openDailyChest: (now = Date.now(), rng) => {
          let loot: Loot | null = null;
          set((s) => {
            const result = openChest(s.journey, buildContext(s, s.days, now), rng);
            loot = result.loot;
            return { journey: result.state };
          });
          return loot;
        },

        askWeekChest: () => set((s) => ({ journey: askedWeekToday(s.journey) })),

        finishRescue: (first, total, now = Date.now()) =>
          set((s) => {
            const offer = s.journey.rescue;
            if (!offer) return s;
            const passed = rescuePassed(first, total);
            const days = passed ? applyRescue(markDay(s.days, new Date(now)), offer) : markDay(s.days, new Date(now));
            const resolved = resolveRescue(s.journey, passed, new Date(now));
            return { days, journey: trackTouch({ ...s, journey: resolved }, days, now) };
          }),

        declineRescue: () => set((s) => ({ journey: declineOffer(s.journey) })),

        markStudied: (now = Date.now()) => set((s) => ({ days: markDay(s.days, new Date(now)) })),

        recordTyping: (keys, item, now = Date.now()) =>
          set((s) => {
            let typing = s.typing;
            for (const k of keys) typing = recordKey(typing, k.char, k.ok, k.ms, now);
            if (item) typing = recordItem(typing, item.level, item.chars, item.ms);
            return { typing, days: markDay(s.days, new Date(now)) };
          }),

        replaceProgress: (snapshot, extras) =>
          // O histórico do progresso antigo não vale para o importado; o backup do formato antigo não traz histórico.
          set({
            srs: snapshot.srs,
            lessons: snapshot.lessons,
            stats: snapshot.stats,
            days: snapshot.days,
            history: extras?.history ?? {},
            ...(extras ? { shadow: extras.shadow, challenges: extras.challenges, vocab: extras.vocab, conj: extras.conj, particles: extras.particles, wordNotes: extras.wordNotes, journey: extras.journey, mastered: extras.mastered, myPhrases: extras.myPhrases, typing: extras.typing } : {}),
          }),

        resetProgress: () => set({ ...emptyProgress(), shadow: {}, challenges: {}, history: {}, vocab: {}, conj: {}, particles: {}, wordNotes: {}, journey: emptyJourney(), mastered: {}, myPhrases: {}, typing: EMPTY_TYPING }),
      }),
      {
        name: PROGRESS_STORAGE_KEY,
        version: 1,
        storage: createJSONStorage(() => storage),
        // O que vem do disco passa pela leitura segura: estado salvo por uma versão antiga ganha os campos novos.
        merge: (persisted, current) => {
          const saved = (persisted ?? {}) as Partial<ProgressState> & { journey?: unknown };
          return { ...current, ...saved, journey: sanitizeJourney(saved.journey), typing: sanitizeTyping((saved as { typing?: unknown }).typing) };
        },
        // Só os dados são salvos, nunca as funções.
        partialize: ({ srs, lessons, stats, days, shadow, challenges, history, vocab, conj, particles, wordNotes, journey, mastered, myPhrases, typing }) => ({
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
          typing,
        }),
      },
    ),
  );
}

export type ProgressStore = ReturnType<typeof createProgressStore>;
