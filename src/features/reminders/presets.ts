import { GOAL_DAILY_MESSAGES, GOAL_EVENING_TODAY, NEW_THING_MESSAGES } from './messages';
import type { ReminderSettings } from './plan';

export type ReminderPreset = 'off' | 'light' | 'normal';

export interface PresetInfo {
  value: ReminderPreset;
  label: string;
  description: string;
  patch: Partial<ReminderSettings>;
}

/** Os três jeitos de receber lembrete: o que a maioria precisa, sem mexer em horário nem em regras. */
export const PRESETS: readonly PresetInfo[] = [
  { value: 'off', label: 'Sem lembretes', description: 'O Mochi não manda nenhum aviso.', patch: { enabled: false } },
  {
    value: 'light',
    label: 'Leves',
    description: 'Um aviso por dia, no horário que você escolher.',
    patch: { enabled: true, risk: false },
  },
  {
    value: 'normal',
    label: 'Normais',
    description: 'Um aviso no seu horário e outro à noite se a meta de minutos do dia ainda não foi cumprida.',
    patch: { enabled: true, risk: true },
  },
];

/** Em qual dos três está a configuração de agora. */
export const presetOf = (s: Pick<ReminderSettings, 'enabled' | 'risk'>): ReminderPreset => (!s.enabled ? 'off' : s.risk ? 'normal' : 'light');

/** Horários prontos para escolher com um toque. */
export const TIME_CHOICES = [
  { hour: 8, minute: 0, label: 'Manhã (8h)' },
  { hour: 12, minute: 0, label: 'Almoço (12h)' },
  { hour: 18, minute: 0, label: 'Fim da tarde (18h)' },
  { hour: 20, minute: 0, label: 'Noite (20h)' },
] as const;

/** O horário de agora está entre os prontos? Devolve o rótulo ou null (horário personalizado). */
export const timeChoiceOf = (hour: number, minute: number): string | null =>
  TIME_CHOICES.find((t) => t.hour === hour && t.minute === minute)?.label ?? null;

/** Exemplos de como os avisos aparecem (com o nome e a meta da pessoa), para ela saber o que esperar. */
export function exampleMessages(preset: ReminderPreset, name: string, goal: number): string[] {
  if (preset === 'off') return [];
  const g = goal > 0 ? goal : 15;
  const daily = GOAL_DAILY_MESSAGES[0]!(g, name);
  const novelty = NEW_THING_MESSAGES[0]!(name);
  const evening = GOAL_EVENING_TODAY[0]!(g, Math.max(1, Math.round(g / 2)), name);
  const lines = [`${daily.title} — ${daily.body}`, `${novelty.title} — ${novelty.body}`];
  if (preset === 'normal') lines.push(`${evening.title} — ${evening.body}`);
  return lines;
}
