/** Dias de estudo ("AAAA-MM-DD", fuso local) e a sequência de dias seguidos. */
const MAX_DAYS = 400;

export function formatDay(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${mm}-${dd}`;
}

/** Marca o dia de `now` como estudado. Devolve a mesma lista se ele já estava marcado. */
export function markDay(days: readonly string[], now: Date): readonly string[] {
  const today = formatDay(now);
  if (days.includes(today)) return days;
  return [...days, today].slice(-MAX_DAYS);
}

/**
 * Dias seguidos até hoje. Se hoje ainda não foi marcado, a contagem parte de
 * ontem: a sequência só quebra quando passa um dia inteiro sem estudar.
 */
export function streakDays(days: readonly string[], now: Date): number {
  const set = new Set(days);
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (!set.has(formatDay(cursor))) cursor.setDate(cursor.getDate() - 1);
  let count = 0;
  while (set.has(formatDay(cursor))) {
    count++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}
