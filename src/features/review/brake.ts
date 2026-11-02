import { formatDay } from '@/features/streak/days';
import type { ActivityHistory } from '@/features/stats/metrics';

/** Quantos dias (contando hoje) entram no cálculo do acerto recente. */
export const BRAKE_DAYS = 3;
/** Respostas mínimas nesses dias para o acerto dizer alguma coisa (poucas respostas oscilam demais). */
export const BRAKE_MIN_ANSWERS = 20;
/** Abaixo disso (em %), o app sugere revisar antes de uma lição nova. */
export const BRAKE_ACCURACY_PCT = 60;
/** Itens teimosos a partir dos quais o app sugere revisar antes de uma lição nova. */
export const BRAKE_LEECHES = 6;

/** Quantos itens teimosos novos, em 7 dias, já pedem para revisar antes de uma lição nova. */
export const BRAKE_GROWTH = 3;
/** A janela (em dias, sem contar hoje) em que o crescimento dos teimosos é medido. */
export const BRAKE_GROWTH_DAYS = 7;
/** Quantos dias de contagem de teimosos o app guarda. */
const TREND_DAYS = 14;

/** Quantos itens teimosos havia no fim de cada dia ("AAAA-MM-DD"): é daí que sai o crescimento. */
export type LeechTrend = Readonly<Record<string, number>>;

/** Guarda a contagem de teimosos de um dia (a última do dia vale) e esquece os dias antigos. */
export function recordLeechCount(trend: LeechTrend, day: string, count: number): LeechTrend {
  if (trend[day] === count) return trend;
  const next = { ...trend, [day]: count };
  const days = Object.keys(next).sort();
  for (const old of days.slice(0, Math.max(0, days.length - TREND_DAYS))) delete next[old];
  return next;
}

/** Lê o que veio do disco: só dias válidos com contagens inteiras e não negativas. */
export function sanitizeLeechTrend(raw: unknown): LeechTrend {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return {};
  const out: Record<string, number> = {};
  for (const [day, n] of Object.entries(raw as Record<string, unknown>)) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(day) && typeof n === 'number' && Number.isInteger(n) && n >= 0 && n < 100_000) out[day] = n;
  }
  const newest = Object.keys(out).sort().slice(-TREND_DAYS);
  return Object.fromEntries(newest.map((day) => [day, out[day] as number]));
}

/**
 * Quanto os teimosos cresceram desde o primeiro dia contado dentro dos últimos 7 (sem contar hoje). Null se não há contagem
 * nessa janela (app novo, ou a pessoa ficou dias sem abrir): sem ponto de comparação, o crescimento não se mede.
 */
export function leechGrowth(trend: LeechTrend, current: number, now: Date = new Date()): { from: number; growth: number } | null {
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let from: number | null = null;
  for (let i = 1; i <= BRAKE_GROWTH_DAYS; i++) {
    cursor.setDate(cursor.getDate() - 1);
    const count = trend[formatDay(cursor)];
    if (count !== undefined) from = count; // continua recuando: vale o dia mais antigo da janela
  }
  return from === null ? null : { from, growth: current - from };
}

export interface Brake {
  /** Por que o app sugere frear. */
  reason: 'accuracy' | 'growth' | 'leeches';
  /** Texto curto para a pessoa. */
  message: string;
}

/** Acerto (%) e respostas dos últimos `days` dias, contando hoje; null se não há respostas. */
export function recentAccuracy(history: ActivityHistory, now: Date, days: number = BRAKE_DAYS): { pct: number; answers: number } | null {
  let answers = 0;
  let correct = 0;
  // Recua dia a dia no calendário local: subtrair 24 h pularia ou repetiria um dia na troca do horário de verão.
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  for (let i = 0; i < days; i++, cursor.setDate(cursor.getDate() - 1)) {
    const day = history[formatDay(cursor)];
    if (!day) continue;
    answers += day.answers;
    correct += day.correct;
  }
  return answers > 0 ? { pct: Math.round((correct / answers) * 100), answers } : null;
}

/**
 * O freio é só uma sugestão (nunca bloqueia): o acerto dos últimos dias caiu abaixo de 60% ou a lista de
 * teimosos já está grande. Devolve null quando está tudo bem.
 */
export function brakeFor(history: ActivityHistory, leeches: number, now: Date = new Date(), trend: LeechTrend = {}): Brake | null {
  const recent = recentAccuracy(history, now);
  if (recent && recent.answers >= BRAKE_MIN_ANSWERS && recent.pct < BRAKE_ACCURACY_PCT) {
    return {
      reason: 'accuracy',
      message: `Seu acerto dos últimos dias está em ${recent.pct}%. Que tal revisar antes de começar uma lição nova? Fica mais firme.`,
    };
  }
  const growth = leechGrowth(trend, leeches, now);
  if (growth && growth.growth >= BRAKE_GROWTH) {
    return {
      reason: 'growth',
      message: `Seus itens teimosos subiram de ${growth.from} para ${leeches} na última semana. Que tal revisar antes de começar uma lição nova? Fica mais firme.`,
    };
  }
  if (leeches >= BRAKE_LEECHES) {
    return {
      reason: 'leeches',
      message: `Você tem ${leeches} itens teimosos. Que tal revisar antes de começar uma lição nova? Fica mais firme.`,
    };
  }
  return null;
}
