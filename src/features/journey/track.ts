import { LESSONS } from '@/content/lessons';
import { bestStreak } from '@/features/stats/metrics';
import { formatDay, streakDays } from '@/features/streak/days';
import { learnedWordIds } from '@/features/vocab/cards';
import type { SrsState } from '@/features/review/srs';
import { daysStudiedInWeek } from './week';
import {
  onAnswer,
  onDialogDone,
  onLesson,
  onNewWords,
  onOpen,
  onPhrase,
  onRecording,
  onSession,
  recordMiss,
  settle,
  type Area,
  type EventContext,
} from './events';
import { daysAway as daysAwayOf, rescueOffer } from './rescue';
import type { JourneyState } from './journey';

/** A parte do progresso que as regras da jornada leem. */
export interface TrackSlice {
  journey: JourneyState;
  days: readonly string[];
  vocab: SrsState;
  mastered: Readonly<Record<string, number>>;
  lessons: Readonly<Record<string, true>>;
  myPhrases: Readonly<Record<string, unknown>>;
}

const scriptDone = (lessons: Readonly<Record<string, true>>, script: 'hira' | 'kata'): boolean =>
  LESSONS[script].length > 0 && LESSONS[script].every((lesson) => lessons[lesson.id]);

/** O contexto de um evento, calculado com os dias já atualizados (`days`). */
export function buildContext(slice: TrackSlice, days: readonly string[], now: number, away?: number): EventContext {
  const date = new Date(now);
  return {
    now: date,
    streak: streakDays(days, date, slice.journey.restWeekdays),
    bestStreak: bestStreak(days),
    weekDays: daysStudiedInWeek(days, date),
    wordsLearned: learnedWordIds(slice.vocab).size,
    topicsMastered: Object.keys(slice.mastered).length,
    hiraDone: scriptDone(slice.lessons, 'hira'),
    kataDone: scriptDone(slice.lessons, 'kata'),
    phrasesCount: Object.keys(slice.myPhrases).length,
    ...(away !== undefined ? { daysAway: away } : {}),
  };
}

type Apply = (journey: JourneyState, ctx: EventContext) => JourneyState;

/** Aplica um evento à jornada com o contexto certo. */
export function applyEvent(slice: TrackSlice, days: readonly string[], now: number, apply: Apply): JourneyState {
  return apply(slice.journey, buildContext(slice, days, now));
}

export interface AnswerTrack {
  ok: boolean;
  area: Area;
  /** Grupo do vocabulário (desafio da semana). */
  group?: string;
  /** Referência para a lista de erros recentes, p.ex. "vocab:学校|jm". */
  ref?: string;
  review?: boolean;
  mature?: boolean;
}

export function trackAnswer(slice: TrackSlice, days: readonly string[], now: number, event: AnswerTrack): JourneyState {
  const { ref, ...answer } = event;
  let journey = onAnswer(slice.journey, buildContext(slice, days, now), answer);
  if (ref && !event.ok) journey = recordMiss(journey, ref);
  return journey;
}

export const trackLesson = (slice: TrackSlice, days: readonly string[], now: number, event: Parameters<typeof onLesson>[2]): JourneyState =>
  applyEvent(slice, days, now, (j, c) => onLesson(j, c, event));

export const trackSession = (slice: TrackSlice, days: readonly string[], now: number, first: number, total: number): JourneyState =>
  applyEvent(slice, days, now, (j, c) => onSession(j, c, { first, total }));

export const trackNewWords = (slice: TrackSlice, days: readonly string[], now: number, count: number): JourneyState =>
  applyEvent(slice, days, now, (j, c) => onNewWords(j, c, count));

export const trackPhrase = (slice: TrackSlice, days: readonly string[], now: number): JourneyState => applyEvent(slice, days, now, onPhrase);

export const trackRecording = (slice: TrackSlice, days: readonly string[], now: number): JourneyState =>
  applyEvent(slice, days, now, onRecording);

export const trackDialog = (slice: TrackSlice, days: readonly string[], now: number, perfect: boolean): JourneyState =>
  applyEvent(slice, days, now, (j, c) => onDialogDone(j, c, perfect));

/** Mudou algo que conta para conquistas (tópico dominado, por exemplo), sem ser uma resposta. */
export const trackTouch = (slice: TrackSlice, days: readonly string[], now: number): JourneyState =>
  applyEvent(slice, days, now, (j, c) => settle(j, c, false));

/**
 * Abrir o app: oferece o resgate da sequência (se for o caso), dá o bônus do dia e registra a volta depois de uma pausa.
 * `daysBefore` são os dias de estudo ANTES de marcar hoje; `daysAfter`, já com hoje marcado.
 */
export function trackOpen(slice: TrackSlice, daysBefore: readonly string[], daysAfter: readonly string[], now: number): JourneyState {
  const date = new Date(now);
  const offer = rescueOffer(daysBefore, date, slice.journey);
  const away = daysAwayOf(daysBefore, date);
  const withOffer: JourneyState = offer ? { ...slice.journey, rescue: offer } : slice.journey.rescue && slice.journey.rescue.day !== formatDay(date) ? { ...slice.journey, rescue: null } : slice.journey;
  return onOpen(withOffer, buildContext({ ...slice, journey: withOffer }, daysAfter, now, away));
}

