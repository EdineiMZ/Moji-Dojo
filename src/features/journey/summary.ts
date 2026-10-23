import { formatDay } from '@/features/streak/days';
import type { ActivityHistory } from '@/features/stats/metrics';
import { mondayOf } from './week';

export interface PeriodSummary {
  /** Primeiro e último dia do período ("AAAA-MM-DD"). */
  from: string;
  to: string;
  /** Dias com estudo marcado no período. */
  studiedDays: number;
  /** Dias do período já vividos (o que passou até hoje, no máximo). */
  elapsedDays: number;
  answers: number;
  correct: number;
  /** Acertos em % (0 se não houve respostas). */
  accuracy: number;
  /** Caracteres novos que entraram na revisão. */
  learned: number;
  /** O dia com mais respostas. */
  bestDay: { day: string; answers: number } | null;
}

const addDays = (date: Date, n: number): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate() + n);

/** Resumo de um período, dia a dia, de `from` até `to` (inclusive). Dias depois de `today` não contam como vividos. */
export function summarize(history: ActivityHistory, days: readonly string[], from: Date, to: Date, today: Date): PeriodSummary {
  const studied = new Set(days);
  const todayKey = formatDay(today);
  let studiedDays = 0;
  let elapsed = 0;
  let answers = 0;
  let correct = 0;
  let learned = 0;
  let best: { day: string; answers: number } | null = null;
  for (let d = new Date(from.getFullYear(), from.getMonth(), from.getDate()); d <= to; d = addDays(d, 1)) {
    const key = formatDay(d);
    if (key <= todayKey) elapsed++;
    if (studied.has(key)) studiedDays++;
    const act = history[key];
    if (!act) continue;
    answers += act.answers;
    correct += act.correct;
    learned += act.learned;
    if (act.answers > 0 && (!best || act.answers > best.answers)) best = { day: key, answers: act.answers };
  }
  return {
    from: formatDay(from),
    to: formatDay(to),
    studiedDays,
    elapsedDays: elapsed,
    answers,
    correct,
    accuracy: answers > 0 ? Math.round((correct / answers) * 100) : 0,
    learned,
    bestDay: best,
  };
}

/** A semana (segunda a domingo) que contém `date`, deslocada `weeksBack` semanas para trás. */
export function weekSummary(history: ActivityHistory, days: readonly string[], date: Date, weeksBack = 0): PeriodSummary {
  const monday = addDays(mondayOf(date), -7 * weeksBack);
  return summarize(history, days, monday, addDays(monday, 6), date);
}

/** O mês de `date` (ou de `monthsBack` meses antes). */
export function monthSummary(history: ActivityHistory, days: readonly string[], date: Date, monthsBack = 0): PeriodSummary {
  const first = new Date(date.getFullYear(), date.getMonth() - monthsBack, 1);
  const last = new Date(first.getFullYear(), first.getMonth() + 1, 0);
  return summarize(history, days, first, last, date);
}

const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

export const monthName = (date: Date, monthsBack = 0): string => MONTHS[new Date(date.getFullYear(), date.getMonth() - monthsBack, 1).getMonth()] ?? '';

/** Frase do Mochi para o resumo, conforme o desempenho: incentiva sem cobrar. */
export function mochiComment(s: PeriodSummary): string {
  if (s.studiedDays === 0) return 'Sem estudo neste período. Tudo bem: o Mochi espera, e começar de novo leva poucos minutos.';
  const ratio = s.elapsedDays > 0 ? s.studiedDays / s.elapsedDays : 0;
  if (ratio >= 0.85) return 'Constância de dojo! Quase todos os dias com estudo.';
  if (ratio >= 0.5) return 'Bom ritmo. Mais um dia ou dois por semana já faz diferença.';
  return 'Cada dia conta. Que tal marcar um horário fixo para estudar um pouquinho?';
}

export interface ShareInput {
  title: string;
  summary: PeriodSummary;
  streak: number;
  level: number;
  levelTitle: string;
  petals: number;
}

/** O texto para compartilhar o progresso (sem dados pessoais, só números). */
export function shareText({ title, summary, streak, level, levelTitle, petals }: ShareInput): string {
  const lines = [
    `🌸 Moji Dojo: ${title}`,
    `${summary.studiedDays} ${summary.studiedDays === 1 ? 'dia' : 'dias'} de estudo · ${summary.answers} respostas (${summary.accuracy}% certas)`,
  ];
  if (summary.learned > 0) lines.push(`${summary.learned} caracteres novos`);
  lines.push(`🔥 Sequência: ${streak} ${streak === 1 ? 'dia' : 'dias'} · Nível ${level} (${levelTitle}) · 🌸 ${petals}`);
  return lines.join('\n');
}
