import { formatDay } from '@/features/streak/days';

/** A segunda-feira da semana de `date` (a semana vai de segunda a domingo), à meia-noite local. */
export function mondayOf(date: Date): Date {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const sinceMonday = (monday.getDay() + 6) % 7;
  monday.setDate(monday.getDate() - sinceMonday);
  return monday;
}

/** Identifica a semana pelo dia da segunda-feira ("AAAA-MM-DD"). */
export const weekKey = (date: Date): string => formatDay(mondayOf(date));

/** Número da semana desde 1970 (para revezar o desafio da semana). */
export function weekIndex(date: Date): number {
  const monday = mondayOf(date);
  // Meio-dia evita erro de horário de verão ao dividir por 7 dias.
  const noon = Date.UTC(monday.getFullYear(), monday.getMonth(), monday.getDate(), 12);
  return Math.floor(noon / (7 * 86_400_000));
}

/** Quantos dias da semana de `date` (segunda a domingo) têm estudo marcado. */
export function daysStudiedInWeek(days: readonly string[], date: Date): number {
  const monday = mondayOf(date);
  const set = new Set(days);
  let count = 0;
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
    if (set.has(formatDay(day))) count++;
  }
  return count;
}

/** Os 7 dias da semana de `date`, com a marca de estudado (para o calendário e o resumo). */
export function weekDays(days: readonly string[], date: Date): { day: string; label: string; studied: boolean; future: boolean }[] {
  const monday = mondayOf(date);
  const set = new Set(days);
  const today = formatDay(date);
  const labels = ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom'];
  return labels.map((label, i) => {
    const d = formatDay(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i));
    return { day: d, label, studied: set.has(d), future: d > today };
  });
}
