import type { MascotMood } from '@/components/mascot/MochiArt';

export interface MoodInput {
  /** Já houve estudo hoje. */
  studiedToday: boolean;
  /** Sequência atual, em dias. */
  streak: number;
  /** Dias desde o último estudo (0 se estudou hoje). */
  daysAway: number;
}

/**
 * O humor do Mochi acompanha a constância, sem culpa: festa em sequência longa, feliz depois de estudar, tranquilo quando o
 * dia ainda vai começar, e só um pouquinho triste (de saudade) depois de uma pausa longa.
 */
export function moodFor({ studiedToday, streak, daysAway }: MoodInput): MascotMood {
  if (studiedToday) return streak >= 7 ? 'cheer' : 'happy';
  if (daysAway >= 4) return 'sad';
  return 'neutral';
}

/** Uma frase do Mochi para o momento, coerente com o humor. */
export function mochiLine({ studiedToday, streak, daysAway }: MoodInput): string {
  if (studiedToday) {
    if (streak >= 30) return `${streak} dias seguidos! O Mochi nem acredita no seu foco.`;
    if (streak >= 7) return `${streak} dias seguidos! Que constância linda.`;
    if (streak >= 2) return `Dia ${streak} de estudo. Cada dia conta!`;
    return 'Hoje você já estudou. O Mochi está feliz!';
  }
  if (daysAway >= 4) return 'O Mochi sentiu saudade. Sem pressa: uma revisão leve já é um ótimo recomeço.';
  if (streak >= 3) return `Sua sequência de ${streak} dias está esperando por você.`;
  return 'Vamos estudar um pouquinho hoje?';
}
