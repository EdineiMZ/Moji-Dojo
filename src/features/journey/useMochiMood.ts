import type { MascotMood } from '@/components/mascot/MochiArt';
import { daysSinceLastStudy } from '@/features/reminders/context';
import { formatDay, streakDays } from '@/features/streak/days';
import { useNow } from '@/hooks/useNow';
import { useProgressStore } from '@/store';
import { mochiLine, moodFor } from './mood';

/** O humor e a frase do Mochi agora, pela constância do aluno (estudou hoje, sequência, tempo de pausa). */
export function useMochiMood(): { mood: MascotMood; line: string } {
  const now = useNow();
  const days = useProgressStore((s) => s.days);
  const rest = useProgressStore((s) => s.journey.restWeekdays);
  const date = new Date(now);
  const input = {
    studiedToday: days.includes(formatDay(date)),
    streak: streakDays(days, date, rest),
    daysAway: daysSinceLastStudy(days, date),
  };
  return { mood: moodFor(input), line: mochiLine(input) };
}
