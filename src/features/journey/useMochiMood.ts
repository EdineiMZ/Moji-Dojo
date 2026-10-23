import type { MascotMood } from '@/components/mascot/MochiArt';
import { daysSinceLastStudy } from '@/features/reminders/context';
import { formatDay, streakDays } from '@/features/streak/days';
import { useNow } from '@/hooks/useNow';
import { useProgressStore, useSettingsStore } from '@/store';
import { mochiLine, moodFor } from './mood';

/** O humor e a frase do Mochi agora, pela constância do aluno (estudou hoje, sequência, tempo de pausa). */
export function useMochiMood(): { mood: MascotMood; line: string } {
  const now = useNow();
  const days = useProgressStore((s) => s.days);
  const rest = useProgressStore((s) => s.journey.restWeekdays);
  const goalMinutes = useSettingsStore((s) => s.profile.goalMinutes);
  const seconds = useProgressStore((s) => s.journey.today.counts.seconds ?? 0);
  const date = new Date(now);
  const input = {
    studiedToday: days.includes(formatDay(date)),
    streak: streakDays(days, date, rest),
    daysAway: daysSinceLastStudy(days, date),
    hour: date.getHours(),
    goalDone: goalMinutes > 0 && seconds >= goalMinutes * 60,
  };
  return { mood: moodFor(input), line: mochiLine(input) };
}
