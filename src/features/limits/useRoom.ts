import { roll } from '@/features/journey/events';
import { useNow } from '@/hooks/useNow';
import { useProgressStore, useSettingsStore } from '@/store';
import { newRoom, reviewRoom } from './limits';

export interface Room {
  /** Quantos itens novos ainda cabem hoje (Infinity = sem limite). */
  newLeft: number;
  /** Quantas respostas de revisão ainda cabem hoje (Infinity = sem limite). */
  reviewsLeft: number;
}

/** O que ainda cabe hoje dentro dos limites do aluno (muda quando vira o dia, porque os contadores zeram). */
export function useRoom(): Room {
  const now = useNow();
  const journey = useProgressStore((s) => s.journey);
  const limits = useSettingsStore((s) => s.limits);
  const counts = roll(journey, new Date(now)).today.counts;
  return { newLeft: newRoom(limits, counts), reviewsLeft: reviewRoom(limits, counts) };
}

/** O mesmo, fora de componentes (na hora de montar uma sessão). */
export function currentRoom(now: Date = new Date()): Room {
  const counts = roll(useProgressStore.getState().journey, now).today.counts;
  const limits = useSettingsStore.getState().limits;
  return { newLeft: newRoom(limits, counts), reviewsLeft: reviewRoom(limits, counts) };
}
