import type { Script } from '@/data/types';
import { ALL_ITEMS, findItem } from '@/features/catalog';
import { nextLessonOverall, type NextLesson } from '@/features/lessons/trail';
import type { ProgressSnapshot } from '@/features/progress/types';
import { dueChars, FIRM_BOX, upcomingReviews, type SrsState, type UpcomingReviews } from '@/features/review/srs';
import { streakDays } from '@/features/streak/days';

/** Quantos caracteres entram numa sessão de revisão. */
export const REVIEW_BATCH = 30;

/** A revisão leve de quem volta de uma pausa: só uma parte da pilha. */
export const REVIEW_LIGHT_BATCH = 10;

export interface TodaySummary {
  /** Revisões vencidas agora. */
  dueCount: number;
  /** Os (até 30) caracteres da revisão do dia, do mais atrasado ao menos. */
  reviewChars: string[];
  /** Caracteres já aprendidos (na revisão espaçada). */
  learnedCount: number;
  /** Dias seguidos de estudo. */
  streak: number;
  /** Próxima lição da trilha; null se todas foram concluídas. */
  nextLesson: NextLesson | null;
  /** Próxima revisão que vai vencer (ainda no futuro); null se não há nenhuma. */
  upcoming: UpcomingReviews | null;
}

const isKnown = (char: string): boolean => findItem(char) !== undefined;

export function buildTodaySummary(
  progress: Pick<ProgressSnapshot, 'srs' | 'lessons' | 'days'>,
  now: number,
): TodaySummary {
  const due = dueChars(progress.srs, now, isKnown);
  return {
    dueCount: due.length,
    reviewChars: due.slice(0, REVIEW_BATCH),
    learnedCount: Object.keys(progress.srs).filter(isKnown).length,
    streak: streakDays(progress.days, new Date(now)),
    nextLesson: nextLessonOverall(progress.lessons),
    upcoming: upcomingReviews(progress.srs, now, isKnown),
  };
}

export interface ScriptProgress {
  total: number;
  /** Já entraram na revisão. */
  learned: number;
  /** Acertaram em revisões seguidas (caixa 3 ou mais). */
  firm: number;
}

export function scriptProgress(srs: SrsState): Record<Script, ScriptProgress> {
  const result: Record<Script, ScriptProgress> = {
    hira: { total: 0, learned: 0, firm: 0 },
    kata: { total: 0, learned: 0, firm: 0 },
    kanji: { total: 0, learned: 0, firm: 0 },
  };
  for (const item of ALL_ITEMS) {
    const entry = srs[item.char];
    const p = result[item.script];
    p.total++;
    if (entry) {
      p.learned++;
      if (entry.b >= FIRM_BOX) p.firm++;
    }
  }
  return result;
}
