import { DAILY_GOALS } from '@/features/journey/journey';
import { cleanUsername, isValidUsername, type Profile } from '@/features/profile/profile';
import { PRESETS, TIME_CHOICES, type ReminderPreset } from '@/features/reminders/presets';
import type { ReminderSettings } from '@/features/reminders/plan';

export type StepId = 'name' | 'tour' | 'goal' | 'rest' | 'reminders' | 'done';

export const STEPS: readonly StepId[] = ['name', 'tour', 'goal', 'rest', 'reminders', 'done'];

/** O que a pessoa respondeu na introdução. */
export interface Answers {
  username: string;
  goalMinutes: number;
  /** Dia de folga (0 = domingo) ou null para nenhum. */
  restDay: number | null;
  reminder: ReminderPreset;
  /** Índice em TIME_CHOICES. */
  timeIndex: number;
}

export const DEFAULT_ANSWERS: Answers = { username: '', goalMinutes: 15, restDay: null, reminder: 'normal', timeIndex: 2 };

/** O passo atual deixa avançar? Só o nome precisa de resposta (e há "Pular"). */
export const canAdvance = (step: StepId, answers: Answers): boolean => (step === 'name' ? isValidUsername(answers.username) : true);

export interface Applied {
  profile: Profile;
  /** Dias de folga da jornada. */
  restWeekdays: number[];
  /** Meta diária de respostas (a da jornada), coerente com os minutos escolhidos. */
  dailyGoal: number;
  reminders: Partial<ReminderSettings>;
}

/** Meta de respostas por dia que combina com os minutos (cerca de duas respostas por minuto, entre as opções que a jornada tem). */
export function dailyGoalFor(minutes: number): number {
  const wanted = minutes * 2;
  return DAILY_GOALS.reduce((best, g) => (Math.abs(g - wanted) < Math.abs(best - wanted) ? g : best), DAILY_GOALS[0] ?? 20);
}

/** O que a introdução grava: perfil, folga, meta e lembretes (os dias de lembrete são todos, menos a folga, que o plano já respeita). */
export function applyAnswers(answers: Answers): Applied {
  const preset = PRESETS.find((p) => p.value === answers.reminder) ?? PRESETS[0]!;
  const time = TIME_CHOICES[answers.timeIndex] ?? TIME_CHOICES[2]!;
  return {
    profile: { username: cleanUsername(answers.username), onboarded: true, goalMinutes: answers.goalMinutes },
    restWeekdays: answers.restDay === null ? [] : [answers.restDay],
    dailyGoal: dailyGoalFor(answers.goalMinutes),
    reminders: { ...preset.patch, hour: time.hour, minute: time.minute, weekdays: [0, 1, 2, 3, 4, 5, 6], asked: true },
  };
}

/** Pular a introdução: marca como feita, sem nome e sem mexer em metas nem lembretes. */
export const skipProfile = (current: Profile): Profile => ({ ...current, onboarded: true });

export interface Feature {
  glyph: string;
  title: string;
  text: string;
}

/** A apresentação das funções do app. */
export const FEATURES: readonly Feature[] = [
  { glyph: '道', title: 'Trilha', text: 'Hiragana, katakana e kanji passo a passo: você vê a ordem dos traços, ouve o som e desenha cada caractere.' },
  { glyph: '復', title: 'Revisão inteligente', text: 'O app lembra o que você está esquecendo e traz de volta no momento certo, em sessões curtas.' },
  { glyph: '話', title: 'Frases e viagem', text: 'Palavras, gramática, frases de viagem, diálogos, frases-modelo e leitura: o japonês para usar no dia a dia.' },
  { glyph: '聞', title: 'Ouvir e falar', text: 'Treino de ouvido, ditado, repetir a frase e reconhecimento de fala, com gravações de falantes nativos.' },
  { glyph: '🌸', title: 'Mochi', text: 'O Mochi acompanha o seu progresso: pétalas, roupas, metas, conquistas e os lembretes que você escolher.' },
];
