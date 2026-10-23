import { COMEBACK_MESSAGES, DAILY_MESSAGES, DUE_MESSAGES, pick, RISK_MESSAGES, seedOf, STREAK_MESSAGES, type ReminderText } from './messages';

/** As preferências de lembrete (ficam nos Ajustes; não vão para o backup). */
export interface ReminderSettings {
  /** Lembretes ligados. Começa desligado: quem decide é a pessoa. */
  enabled: boolean;
  hour: number;
  minute: number;
  /** Dias da semana com lembrete (0 = domingo). */
  weekdays: number[];
  /** Aviso da noite quando a sequência está em risco. */
  risk: boolean;
  /** Horário de silêncio: nunca avisa dentro dele. `from` > `to` atravessa a meia-noite (22 a 8). */
  quietFrom: number;
  quietTo: number;
  /** A pergunta "quer lembretes?" já foi feita (aceita ou recusada). */
  asked: boolean;
}

export const DEFAULT_REMINDERS: ReminderSettings = {
  enabled: false,
  hour: 19,
  minute: 0,
  weekdays: [0, 1, 2, 3, 4, 5, 6],
  risk: true,
  quietFrom: 22,
  quietTo: 8,
  asked: false,
};

/** Hora do aviso da noite (sequência em risco). */
export const RISK_HOUR = 20;
export const RISK_MINUTE = 30;

/** Quantos dias à frente se agenda. */
export const HORIZON_DAYS = 14;

export interface PlanInput {
  now: Date;
  settings: ReminderSettings;
  /** Já houve estudo hoje. */
  studiedToday: boolean;
  /** Sequência atual (dias). */
  streak: number;
  /** Itens esperando revisão agora. */
  dueCount: number;
  /** Dias desde o último estudo (0 se estudou hoje). */
  daysAway: number;
}

export interface PlannedReminder {
  at: Date;
  kind: 'daily' | 'risk';
  title: string;
  body: string;
}

const MIN_STREAK_FOR_RISK = 3;

/** A hora `hour` cai no horário de silêncio? */
export function inQuiet(hour: number, minute: number, from: number, to: number): boolean {
  const t = hour * 60 + minute;
  const a = from * 60;
  const b = to * 60;
  if (a === b) return false;
  return a < b ? t >= a && t < b : t >= a || t < b;
}

const atTime = (base: Date, offset: number, hour: number, minute: number): Date =>
  new Date(base.getFullYear(), base.getMonth(), base.getDate() + offset, hour, minute, 0, 0);

/**
 * Esse dia entra no plano? Quem fica sem estudar recebe menos lembretes, não mais: até 2 dias de ausência, todos os dias;
 * de 3 a 6, de dois em dois dias; a partir de 7, um por semana. Quando a pessoa volta a estudar o plano é refeito do zero.
 */
export function dayAllowed(gap: number): boolean {
  if (gap <= 2) return true;
  if (gap < 7) return gap % 2 === 1;
  return gap % 7 === 0;
}

/** O texto do lembrete diário de um dia. Hoje usa o que se sabe agora; os dias seguintes, textos gerais. */
function dailyText(input: PlanInput, offset: number, gap: number, date: Date): ReminderText {
  const seed = seedOf(date);
  if (gap >= 3) return pick(COMEBACK_MESSAGES, seed);
  if (offset === 0 && input.dueCount > 0 && seed % 2 === 0) return pick(DUE_MESSAGES, seed)(input.dueCount);
  if (input.streak >= MIN_STREAK_FOR_RISK && offset <= 1 && seed % 3 === 0) return pick(STREAK_MESSAGES, seed)(input.streak);
  return pick(DAILY_MESSAGES, seed);
}

/**
 * O plano de lembretes dos próximos dias. Regras: só nos dias escolhidos, no horário escolhido (empurrado para o fim do
 * silêncio se cair nele), nada para hoje se já estudou ou se a hora passou, no máximo 2 por dia, e o aviso da noite só
 * para quem tem sequência de 3 dias ou mais e ainda não estudou. A lista vem em ordem de data.
 */
export function planReminders(input: PlanInput): PlannedReminder[] {
  const { now, settings } = input;
  if (!settings.enabled) return [];
  const plan: PlannedReminder[] = [];

  for (let offset = 0; offset < HORIZON_DAYS; offset++) {
    const day = atTime(now, offset, 0, 0);
    // Dias sem estudo até esse dia, se a pessoa não voltar: hoje já estudado zera a contagem.
    const gap = input.studiedToday ? offset : input.daysAway + offset;
    const studiedThatDay = offset === 0 && input.studiedToday;

    let dailyAt: Date | null = null;
    if (settings.weekdays.includes(day.getDay()) && !studiedThatDay && dayAllowed(gap)) {
      let hour = settings.hour;
      let minute = settings.minute;
      if (inQuiet(hour, minute, settings.quietFrom, settings.quietTo)) {
        hour = settings.quietTo;
        minute = 0;
      }
      const at = atTime(now, offset, hour, minute);
      if (at.getTime() > now.getTime() + 60_000) {
        dailyAt = at;
        const text = dailyText(input, offset, gap, at);
        plan.push({ at, kind: 'daily', ...text });
      }
    }

    // Aviso da noite: só hoje e amanhã (mais longe, ele seria ruído), para sequência em risco. Vem pelo menos 2 horas depois
    // do lembrete diário, para não parecer o mesmo aviso repetido.
    if (settings.risk && offset <= 1 && !studiedThatDay && input.streak >= MIN_STREAK_FOR_RISK && gap <= 1) {
      let at = atTime(now, offset, RISK_HOUR, RISK_MINUTE);
      if (dailyAt && at.getTime() - dailyAt.getTime() < 2 * 3_600_000) at = new Date(dailyAt.getTime() + 2 * 3_600_000);
      if (at.getTime() > now.getTime() + 60_000 && at.getDate() === day.getDate() && !inQuiet(at.getHours(), at.getMinutes(), settings.quietFrom, settings.quietTo)) {
        plan.push({ at, kind: 'risk', ...pick(RISK_MESSAGES, seedOf(at))(input.streak) });
      }
    }
  }
  return plan.sort((a, b) => a.at.getTime() - b.at.getTime());
}
