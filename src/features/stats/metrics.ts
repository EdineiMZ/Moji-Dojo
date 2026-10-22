import { formatDay } from '@/features/streak/days';

/** Atividade de um dia de estudo. */
export interface DayActivity {
  /** Respostas dadas (quiz, revisão, ouvido). */
  answers: number;
  correct: number;
  /** Caracteres que entraram na revisão naquele dia (ao concluir lições). */
  learned: number;
}

/** Histórico por dia ("AAAA-MM-DD"). Só existe a partir de quando o app passou a registrá-lo. */
export type ActivityHistory = Readonly<Record<string, DayActivity>>;

/** Quantos dias de histórico são guardados. */
export const MAX_HISTORY_DAYS = 400;

const DAY_MS = 86_400_000;

/** Número do dia (para diferença exata entre datas, sem erro de horário de verão). */
const dayNumber = (key: string): number => {
  const [y = 0, m = 1, d = 1] = key.split('-').map(Number);
  return Date.UTC(y, m - 1, d) / DAY_MS;
};

/** Dia da semana de uma data "AAAA-MM-DD" (0 = domingo). */
export const weekdayOf = (key: string): number => new Date(dayNumber(key) * DAY_MS).getUTCDay();

/** Soma `delta` à atividade do dia de `now`, guardando só os últimos MAX_HISTORY_DAYS dias. */
export function addActivity(history: ActivityHistory, now: Date, delta: Partial<DayActivity>): ActivityHistory {
  const key = formatDay(now);
  const prev = history[key] ?? { answers: 0, correct: 0, learned: 0 };
  const next: Record<string, DayActivity> = {
    ...history,
    [key]: {
      answers: prev.answers + (delta.answers ?? 0),
      correct: prev.correct + (delta.correct ?? 0),
      learned: prev.learned + (delta.learned ?? 0),
    },
  };
  const keys = Object.keys(next).sort();
  for (const old of keys.slice(0, Math.max(0, keys.length - MAX_HISTORY_DAYS))) delete next[old];
  return next;
}

/** A maior sequência de dias seguidos já feita. */
export function bestStreak(days: readonly string[]): number {
  const sorted = [...new Set(days)].sort();
  let best = 0;
  let run = 0;
  let previous: number | null = null;
  for (const key of sorted) {
    const n = dayNumber(key);
    run = previous !== null && n - previous === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    previous = n;
  }
  return best;
}

/** Os últimos `n` dias terminando hoje, do mais antigo ao mais recente. */
export function lastDays(now: Date, n: number): string[] {
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  cursor.setDate(cursor.getDate() - (n - 1));
  const keys: string[] = [];
  for (let i = 0; i < n; i++) {
    keys.push(formatDay(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return keys;
}

export interface StripDay {
  day: string;
  active: boolean;
  isToday: boolean;
  /** 0 = domingo. */
  weekday: number;
}

/** Quais dos últimos `n` dias tiveram estudo. */
export function activityStrip(days: readonly string[], now: Date, n = 14): StripDay[] {
  const studied = new Set(days);
  const today = formatDay(now);
  return lastDays(now, n).map((day) => ({
    day,
    active: studied.has(day),
    isToday: day === today,
    weekday: weekdayOf(day),
  }));
}

/** Porcentagem de acertos de todo o histórico de respostas; null se nunca respondeu. */
export function accuracy(stats: Readonly<Record<string, { c: number; w: number }>>): number | null {
  let correct = 0;
  let total = 0;
  for (const s of Object.values(stats)) {
    correct += s.c;
    total += s.c + s.w;
  }
  return total === 0 ? null : Math.round((correct / total) * 100);
}

export interface DailyAnswers {
  day: string;
  /** 0 = domingo. */
  weekday: number;
  answers: number;
  correct: number;
}

/** Respostas por dia nos últimos `n` dias (0 nos dias sem registro). */
export function dailyAnswers(history: ActivityHistory, now: Date, n = 14): DailyAnswers[] {
  return lastDays(now, n).map((day) => ({
    day,
    weekday: weekdayOf(day),
    answers: history[day]?.answers ?? 0,
    correct: history[day]?.correct ?? 0,
  }));
}

export interface EvolutionPoint {
  day: string;
  /** Caracteres aprendidos até o fim desse dia. */
  learned: number;
}

export interface Evolution {
  points: EvolutionPoint[];
  /** Há algum registro de histórico? Sem ele a linha seria só uma reta. */
  hasData: boolean;
  /** Primeiro dia registrado, ou null. */
  startedOn: string | null;
}

/**
 * Quantos caracteres estavam aprendidos em cada um dos últimos `n` dias. Parte do total de hoje e
 * "desfaz" o que foi aprendido depois de cada dia, então a curva sempre termina no valor real.
 * Antes do primeiro dia registrado a linha fica no valor que o app já tinha (ex.: um backup importado).
 */
export function evolution(history: ActivityHistory, learnedNow: number, now: Date, n = 30): Evolution {
  const days = lastDays(now, n);
  const entries = Object.entries(history);
  const points = days.map((day) => {
    const after = entries.reduce((sum, [key, activity]) => (key > day ? sum + activity.learned : sum), 0);
    return { day, learned: Math.max(0, learnedNow - after) };
  });
  const started = entries.map(([key]) => key).sort()[0] ?? null;
  return { points, hasData: entries.length > 0, startedOn: started };
}
