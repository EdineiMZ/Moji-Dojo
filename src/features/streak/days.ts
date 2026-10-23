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
 * Dias seguidos até hoje. `rest` são os dias da semana (0 = domingo) em que não estudar não quebra a sequência.
 * Se hoje ainda não foi marcado, a contagem parte de
 * ontem: a sequência só quebra quando passa um dia inteiro sem estudar.
 */
export function streakDays(days: readonly string[], now: Date, rest: readonly number[] = []): number {
  const set = new Set(days);
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (!set.has(formatDay(cursor))) cursor.setDate(cursor.getDate() - 1);
  // Dia de descanso sem estudo não quebra a sequência (e também não conta). Se todos os dias fossem de descanso, não há como seguir.
  const skips = rest.length < 7 ? new Set(rest) : new Set<number>();
  let count = 0;
  for (let guard = 0; guard < 2000; guard++) {
    if (set.has(formatDay(cursor))) count++;
    else if (!skips.has(cursor.getDay())) break;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}
