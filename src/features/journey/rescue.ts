import { formatDay, streakDays } from '@/features/streak/days';
import { bump, pushToast, type JourneyState, type RescueOffer } from './journey';

/**
 * Salvar a sequência: quem perde 1 a 3 dias de uma sequência de pelo menos 3 pode refazer uma revisão grande com o que
 * errou há pouco. Com 70% ou mais de acertos, os dias perdidos contam como estudados e a sequência continua. Um resgate
 * por semana.
 */
export const MAX_MISSED_DAYS = 3;
export const MIN_BROKEN_STREAK = 3;
export const RESCUE_COOLDOWN_DAYS = 7;
export const RESCUE_QUESTIONS = 25;
export const RESCUE_PASS_PCT = 70;

const DAY_MS = 86_400_000;

const startOfDay = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate());

/** O último dia estudado antes de hoje, ou null. */
export function lastStudyDayBefore(days: readonly string[], now: Date): string | null {
  const today = formatDay(now);
  let last: string | null = null;
  for (const day of days) if (day < today && (last === null || day > last)) last = day;
  return last;
}

const parseDay = (day: string): Date => {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
};

/** Dias sem estudo entre o último estudo e hoje (sem contar hoje), tirando os dias de descanso. */
export function missedDays(days: readonly string[], now: Date, rest: readonly number[] = []): string[] {
  const last = lastStudyDayBefore(days, now);
  if (!last) return [];
  const set = new Set(days);
  const skips = rest.length < 7 ? new Set(rest) : new Set<number>();
  const missed: string[] = [];
  const cursor = parseDay(last);
  cursor.setDate(cursor.getDate() + 1);
  const today = startOfDay(now);
  while (cursor < today && missed.length <= MAX_MISSED_DAYS + 1) {
    const key = formatDay(cursor);
    if (!set.has(key) && !skips.has(cursor.getDay())) missed.push(key);
    cursor.setDate(cursor.getDate() + 1);
  }
  return missed;
}

/** Dias entre o último estudo e hoje, sem descontar nada (para saber se foi uma pausa longa). */
export function daysAway(days: readonly string[], now: Date): number {
  const last = lastStudyDayBefore(days, now);
  if (!last) return 0;
  return Math.max(0, Math.round((startOfDay(now).getTime() - parseDay(last).getTime()) / DAY_MS) - 1);
}

/**
 * A oferta de resgate para este dia, ou null. Chame ANTES de marcar hoje como estudado. Se já existe uma oferta para
 * hoje, devolve a mesma.
 */
export function rescueOffer(days: readonly string[], now: Date, journey: JourneyState): RescueOffer | null {
  const today = formatDay(now);
  if (journey.rescue && journey.rescue.day === today) return journey.rescue;
  if (days.includes(today)) return null;
  const last = lastStudyDayBefore(days, now);
  if (!last) return null;
  const missed = missedDays(days, now, journey.restWeekdays);
  if (missed.length === 0 || missed.length > MAX_MISSED_DAYS) return null;
  const broken = streakDays(days, parseDay(last), journey.restWeekdays);
  if (broken < MIN_BROKEN_STREAK) return null;
  if (journey.lastRescueAt !== null && now.getTime() - journey.lastRescueAt < RESCUE_COOLDOWN_DAYS * DAY_MS) return null;
  return { day: today, missed, broken };
}

/** Marca os dias perdidos como estudados (a lista continua em ordem e no limite). */
export function applyRescue(days: readonly string[], offer: RescueOffer, limit = 400): string[] {
  return [...new Set([...days, ...offer.missed])].sort().slice(-limit);
}

/** A nota da revisão de resgate é suficiente? */
export const rescuePassed = (first: number, total: number): boolean => total > 0 && Math.round((first / total) * 100) >= RESCUE_PASS_PCT;

/**
 * Fecha a oferta. Aprovado: guarda o resgate (conta, avisa e libera a espera de uma semana). Reprovado: a oferta some e a
 * sequência recomeça sem cobrança.
 */
export function resolveRescue(journey: JourneyState, passed: boolean, now: Date): JourneyState {
  const offer = journey.rescue;
  if (!offer) return journey;
  const closed: JourneyState = { ...journey, rescue: null };
  if (!passed) return pushToast(closed, 'streak', 'Tudo bem recomeçar', 'Não deu para salvar a sequência desta vez. O Mochi está aqui para começar outra.');
  const saved = { ...closed, lastRescueAt: now.getTime(), counters: bump(closed.counters, 'rescues') };
  return pushToast(saved, 'streak', 'Sequência salva!', `Você manteve ${offer.broken} dias seguidos. O Mochi está orgulhoso.`);
}

/** Recusar a oferta: a sequência zera e não há cobrança. */
export const declineRescue = (journey: JourneyState): JourneyState => (journey.rescue ? { ...journey, rescue: null } : journey);
