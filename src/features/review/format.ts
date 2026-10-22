const WEEKDAYS = ['dom.', 'seg.', 'ter.', 'qua.', 'qui.', 'sex.', 'sáb.'] as const;
const DAY_MS = 86_400_000;

const startOfDay = (ms: number): number => {
  const d = new Date(ms);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
};

const pad = (n: number): string => String(n).padStart(2, '0');

/**
 * Quando vence uma revisão, em linguagem natural:
 * "hoje às 18:30", "amanhã às 09:00" ou "em 3 dias (sex. 25/10)".
 */
export function formatReviewTime(at: number, now: number): string {
  const date = new Date(at);
  // Math.round absorve a hora a mais/a menos do horário de verão.
  const days = Math.round((startOfDay(at) - startOfDay(now)) / DAY_MS);
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  if (days <= 0) return `hoje às ${time}`;
  if (days === 1) return `amanhã às ${time}`;
  const weekday = WEEKDAYS[date.getDay()] ?? '';
  return `em ${days} dias (${weekday} ${pad(date.getDate())}/${pad(date.getMonth() + 1)})`;
}
