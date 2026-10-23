import type { MascotMood } from '@/components/mascot/MochiArt';

export interface MoodInput {
  /** Já houve estudo hoje. */
  studiedToday: boolean;
  /** Sequência atual, em dias. */
  streak: number;
  /** Dias desde o último estudo (0 se estudou hoje). */
  daysAway: number;
  /** Hora do dia (0 a 23), se se sabe. */
  hour?: number;
  /** A meta de minutos de hoje já foi batida. */
  goalDone?: boolean;
}

/**
 * O humor do Mochi acompanha a constância, sem culpa: festa em sequência longa, feliz depois de estudar, tranquilo quando o
 * dia ainda vai começar, e só um pouquinho triste (de saudade) depois de uma pausa longa.
 */
export function moodFor({ studiedToday, streak, daysAway, hour, goalDone }: MoodInput): MascotMood {
  if (goalDone) return 'proud';
  if (studiedToday) return streak >= 30 ? 'love' : streak >= 7 ? 'cheer' : 'happy';
  if (daysAway >= 4) return 'sad';
  if (hour !== undefined && (hour >= 23 || hour < 5)) return 'sleepy';
  if (streak >= 3) return 'thinking';
  return 'neutral';
}

/** Uma frase do Mochi para o momento, coerente com o humor. */
export function mochiLine({ studiedToday, streak, daysAway, hour, goalDone }: MoodInput): string {
  if (goalDone) return 'Meta de hoje batida! O Mochi está orgulhoso de você.';
  if (studiedToday) {
    if (streak >= 30) return `${streak} dias seguidos! O Mochi nem acredita no seu foco.`;
    if (streak >= 7) return `${streak} dias seguidos! Que constância linda.`;
    if (streak >= 2) return `Dia ${streak} de estudo. Cada dia conta!`;
    return 'Hoje você já estudou. O Mochi está feliz!';
  }
  if (daysAway >= 4) return 'O Mochi sentiu saudade. Sem pressa: uma revisão leve já é um ótimo recomeço.';
  if (hour !== undefined && (hour >= 23 || hour < 5)) return 'Zzz... já é tarde. Um descanso bom também faz parte do estudo!';
  if (streak >= 3) return `Sua sequência de ${streak} dias está esperando por você.`;
  return 'Vamos estudar um pouquinho hoje?';
}
