import { formatDay } from '@/features/streak/days';
import type { ActivityHistory } from '@/features/stats/metrics';

/** Quantos dias (contando hoje) entram no cálculo do acerto recente. */
export const BRAKE_DAYS = 3;
/** Respostas mínimas nesses dias para o acerto dizer alguma coisa (poucas respostas oscilam demais). */
export const BRAKE_MIN_ANSWERS = 20;
/** Abaixo disso (em %), o app sugere revisar antes de uma lição nova. */
export const BRAKE_ACCURACY_PCT = 60;
/** Itens teimosos a partir dos quais o app sugere revisar antes de uma lição nova. */
export const BRAKE_LEECHES = 6;

export interface Brake {
  /** Por que o app sugere frear. */
  reason: 'accuracy' | 'leeches';
  /** Texto curto para a pessoa. */
  message: string;
}

/** Acerto (%) e respostas dos últimos `days` dias, contando hoje; null se não há respostas. */
export function recentAccuracy(history: ActivityHistory, now: Date, days: number = BRAKE_DAYS): { pct: number; answers: number } | null {
  let answers = 0;
  let correct = 0;
  // Recua dia a dia no calendário local: subtrair 24 h pularia ou repetiria um dia na troca do horário de verão.
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  for (let i = 0; i < days; i++, cursor.setDate(cursor.getDate() - 1)) {
    const day = history[formatDay(cursor)];
    if (!day) continue;
    answers += day.answers;
    correct += day.correct;
  }
  return answers > 0 ? { pct: Math.round((correct / answers) * 100), answers } : null;
}

/**
 * O freio é só uma sugestão (nunca bloqueia): o acerto dos últimos dias caiu abaixo de 60% ou a lista de
 * teimosos já está grande. Devolve null quando está tudo bem.
 */
export function brakeFor(history: ActivityHistory, leeches: number, now: Date = new Date()): Brake | null {
  const recent = recentAccuracy(history, now);
  if (recent && recent.answers >= BRAKE_MIN_ANSWERS && recent.pct < BRAKE_ACCURACY_PCT) {
    return {
      reason: 'accuracy',
      message: `Seu acerto dos últimos dias está em ${recent.pct}%. Que tal revisar antes de começar uma lição nova? Fica mais firme.`,
    };
  }
  if (leeches >= BRAKE_LEECHES) {
    return {
      reason: 'leeches',
      message: `Você tem ${leeches} itens teimosos. Que tal revisar antes de começar uma lição nova? Fica mais firme.`,
    };
  }
  return null;
}
