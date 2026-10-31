/**
 * Metas de estudo que liberam cômodos da Casa do Mochi. Comprar um cômodo pede pétalas e também a meta: a casa cresce junto com
 * o estudo. Quarto e Jardim não têm meta (são o começo); os outros têm uma meta que pede só o que o app já mede.
 */

import { streakDays } from '@/features/streak/days';
import { learnedWordIds } from '@/features/vocab/cards';
import type { SrsState } from '@/features/review/srs';

export type GoalKind = 'words' | 'topics' | 'streak' | 'days';

export interface RoomGoal {
  kind: GoalKind;
  /** Quanto precisa ter. */
  goal: number;
}

/** O que a pessoa já fez, medido a partir do progresso (ver `homeProgressOf`). */
export interface HomeProgress {
  /** Palavras do vocabulário aprendidas (cada uma com cartões na revisão). */
  words: number;
  /** Tópicos de gramática dominados no mini-teste. */
  topics: number;
  /** Dias seguidos de estudo (conta até hoje ou até ontem). */
  streak: number;
  /** Dias de estudo no total. */
  days: number;
}

export const ROOM_GOALS: Readonly<Record<string, RoomGoal>> = {
  escritorio: { kind: 'words', goal: 20 },
  varanda: { kind: 'topics', goal: 3 },
  sala: { kind: 'words', goal: 100 },
  cozinha: { kind: 'streak', goal: 7 },
  ofuro: { kind: 'days', goal: 30 },
};

const PLURAL: Readonly<Record<GoalKind, readonly [string, string]>> = {
  words: ['palavra aprendida', 'palavras aprendidas'],
  topics: ['tópico de gramática dominado', 'tópicos de gramática dominados'],
  streak: ['dia seguido de estudo', 'dias seguidos de estudo'],
  days: ['dia de estudo', 'dias de estudo'],
};

/** O texto da meta: "Ter 20 palavras aprendidas". */
export const goalLabel = (goal: RoomGoal): string => `Ter ${goal.goal} ${PLURAL[goal.kind][goal.goal === 1 ? 0 : 1]}`;

export interface GoalStatus {
  goal: RoomGoal;
  have: number;
  met: boolean;
}

/** Como está a meta de um cômodo; null se ele não tem meta. */
export function goalStatus(roomId: string, progress: HomeProgress): GoalStatus | null {
  const goal = ROOM_GOALS[roomId];
  if (!goal) return null;
  const have = progress[goal.kind];
  return { goal, have, met: have >= goal.goal };
}

/** Mede o que as metas pedem a partir do progresso guardado. */
export function homeProgressOf(progress: { vocab: SrsState; mastered: Readonly<Record<string, number>>; days: readonly string[] }, now: Date = new Date()): HomeProgress {
  return {
    words: learnedWordIds(progress.vocab).size,
    topics: Object.keys(progress.mastered).length,
    streak: streakDays(progress.days, now),
    days: progress.days.length,
  };
}
