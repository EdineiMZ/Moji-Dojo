import { dueCards as dueConj } from '@/features/conjugation/cards';
import { findItem } from '@/features/catalog';
import { dueChars, type SrsState } from '@/features/review/srs';
import { formatDay, streakDays } from '@/features/streak/days';
import { dueCards as dueVocab } from '@/features/vocab/cards';
import { lastStudyDayBefore } from '@/features/journey/rescue';
import type { PlanInput, ReminderSettings } from './plan';

/** A parte do progresso de que o plano precisa. */
export interface PlanSource {
  days: readonly string[];
  srs: SrsState;
  vocab: SrsState;
  conj: SrsState;
  restWeekdays: readonly number[];
}

const DAY_MS = 86_400_000;

/** Dias desde o último estudo (0 se estudou hoje). Quem nunca estudou conta como 1: ainda não "sumiu". */
export function daysSinceLastStudy(days: readonly string[], now: Date): number {
  if (days.includes(formatDay(now))) return 0;
  const last = lastStudyDayBefore(days, now);
  if (!last) return 1;
  const [y = 1970, m = 1, d = 1] = last.split('-').map(Number);
  const from = new Date(y, m - 1, d).getTime();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return Math.max(1, Math.round((today - from) / DAY_MS));
}

/** Itens esperando revisão agora, somando kana, vocabulário e conjugação. */
export function totalDue(source: Pick<PlanSource, 'srs' | 'vocab' | 'conj'>, now: number): number {
  return dueChars(source.srs, now, (c) => findItem(c) !== undefined).length + dueVocab(source.vocab, now).length + dueConj(source.conj, now).length;
}

/** Monta a entrada do planejador a partir do progresso e das preferências. */
export function planInputFrom(source: PlanSource, settings: ReminderSettings, now: Date): PlanInput {
  return {
    now,
    settings,
    studiedToday: source.days.includes(formatDay(now)),
    streak: streakDays(source.days, now, source.restWeekdays),
    dueCount: totalDue(source, now.getTime()),
    daysAway: daysSinceLastStudy(source.days, now),
  };
}
