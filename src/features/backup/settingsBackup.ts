import { sanitizeAi } from '@/features/ai/settings';
import { sanitizeLimits } from '@/features/limits/limits';
import { DEFAULT_PROFILE, sanitizeProfile } from '@/features/profile/profile';
import { DEFAULT_REMINDERS, type ReminderSettings } from '@/features/reminders/plan';
import { sanitizeRetention } from '@/features/review/retention';
import { sanitizeFavorites, sanitizeIntonation, sanitizePitch, sanitizeStaffStyle } from '@/features/speech/voiceTuning';
import {
  DEFAULT_SETTINGS,
  sanitizeColorTheme,
  sanitizeThemeMode,
  sanitizeTypingGoal,
  type ReadingAid,
  type SettingsData,
  type SpeechSpeed,
  type TypingInput,
} from '@/store/settingsStore';
import { decodeUtf8, encodeUtf8 } from './backup';

/**
 * Backup só das configurações (tema, voz, leitura, lembretes, metas, IA...), sem o progresso. É um código à parte ("MDJC1:"),
 * para levar as preferências a outro aparelho sem mexer no que foi estudado. Ficam de fora: a chave da IA (nunca sai do
 * armazenamento seguro), o uso do dia, a voz do Android escolhida (varia de aparelho para aparelho) e o seu nome.
 */
export const SETTINGS_BACKUP_PREFIX = 'MDJC1:';
export const SETTINGS_BACKUP_VERSION = 1;

export type SettingsBackupError = 'format' | 'encoding' | 'json' | 'data' | 'version' | 'empty';

export const SETTINGS_BACKUP_ERROR_MESSAGES: Readonly<Record<SettingsBackupError, string>> = {
  format: 'Esse não é um código de configurações do Moji Dojo. Ele começa com "MDJC1:". Para o progresso, use "Importar backup".',
  encoding: 'O código está incompleto ou foi alterado. Copie de novo, inteiro.',
  json: 'O código está incompleto ou foi alterado. Copie de novo, inteiro.',
  data: 'O código não tem o formato esperado.',
  version: 'Esse código vem de uma versão mais nova do app. Atualize o app e tente de novo.',
  empty: 'O código não trouxe nenhuma configuração válida.',
};

export type ExportedSettings = Omit<SettingsData, 'voiceId' | 'aiUsage' | 'profile'> & { profile: Omit<SettingsData['profile'], 'username'> };

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const bool = (v: unknown): boolean | undefined => (typeof v === 'boolean' ? v : undefined);
const oneOf = <T extends string>(options: readonly T[]) => (v: unknown): T | undefined => options.find((o) => o === v);
const int = (min: number, max: number) => (v: unknown): number | undefined => (typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max ? v : undefined);

function readReminders(v: unknown): ReminderSettings | undefined {
  if (!isRecord(v)) return undefined;
  const hour = int(0, 23)(v.hour);
  const minute = int(0, 59)(v.minute);
  const weekdays = Array.isArray(v.weekdays) ? [...new Set(v.weekdays.filter((d): d is number => int(0, 6)(d) !== undefined))].sort() : undefined;
  if (hour === undefined || minute === undefined || !weekdays) return undefined;
  return {
    enabled: v.enabled === true,
    hour,
    minute,
    weekdays,
    risk: v.risk !== false,
    quietFrom: int(0, 23)(v.quietFrom) ?? DEFAULT_REMINDERS.quietFrom,
    quietTo: int(0, 23)(v.quietTo) ?? DEFAULT_REMINDERS.quietTo,
    // A pergunta de permissão já foi respondida neste aparelho? Cada aparelho decide a sua.
    asked: false,
  };
}

/** Como ler cada configuração: devolve o valor limpo, ou `undefined` se o valor não serve. */
const READERS: { readonly [K in keyof ExportedSettings]: (v: unknown) => ExportedSettings[K] | undefined } = {
  themeMode: (v) => (v === 'light' || v === 'dark' || v === 'system' ? sanitizeThemeMode(v) : undefined),
  colorTheme: (v) => (typeof v === 'string' && sanitizeColorTheme(v) === v ? sanitizeColorTheme(v) : undefined),
  typingGoal: (v) => (typeof v === 'number' && sanitizeTypingGoal(v) === v ? v : undefined),
  retention: (v) => (typeof v === 'number' && sanitizeRetention(v) === v ? v : undefined),
  writeInReview: bool,
  autoAdvance: bool,
  speechSpeed: oneOf<SpeechSpeed>(['normal', 'slow']),
  hapticsEnabled: bool,
  soundEnabled: bool,
  romajiMode: oneOf<ReadingAid>(['always', 'tap', 'never']),
  showKanji: bool,
  furiganaMode: oneOf<ReadingAid>(['always', 'tap', 'never']),
  typingInput: oneOf<TypingInput>(['pad', 'system']),
  voiceEngine: oneOf(['system', 'voicevox'] as const),
  voicevoxStyle: int(0, 100_000),
  voicevoxPitch: (v) => (typeof v === 'number' ? sanitizePitch(v) : undefined),
  voicevoxIntonation: (v) => (typeof v === 'number' ? sanitizeIntonation(v) : undefined),
  voicevoxStaffStyle: (v) => (v === null ? null : sanitizeStaffStyle(v)),
  favoriteVoices: (v) => (Array.isArray(v) ? sanitizeFavorites(v) : undefined),
  nativeAudio: bool,
  reminders: readReminders,
  limits: (v) => (isRecord(v) ? sanitizeLimits(v) : undefined),
  profile: (v) => {
    if (!isRecord(v)) return undefined;
    const { onboarded, goalMinutes } = sanitizeProfile({ ...v, username: '' });
    return { onboarded, goalMinutes };
  },
  ai: (v) => (isRecord(v) ? sanitizeAi(v) : undefined),
};

export const SETTINGS_KEYS = Object.keys(READERS) as (keyof ExportedSettings)[];

/** O que sai no código: as configurações, sem o que não deve viajar. */
export function pickExported(settings: SettingsData): ExportedSettings {
  const { voiceId: _voiceId, aiUsage: _aiUsage, profile, ...rest } = settings;
  const { username: _username, ...profileRest } = profile;
  return { ...rest, profile: profileRest };
}

export function exportSettings(settings: SettingsData, now: Date = new Date()): string {
  const payload = { v: SETTINGS_BACKUP_VERSION, app: 'moji-dojo', kind: 'settings', at: now.toISOString(), settings: pickExported(settings) };
  return SETTINGS_BACKUP_PREFIX + btoa(encodeUtf8(JSON.stringify(payload)));
}

export type SettingsParseResult =
  | { ok: true; /** O que será aplicado, já limpo. */ changes: Partial<SettingsData>; /** Chaves lidas e quantas foram ignoradas por estarem inválidas. */ keys: (keyof ExportedSettings)[]; ignored: number }
  | { ok: false; error: SettingsBackupError };

/** Lê e valida um código "MDJC1:". Valores inválidos são ignorados um a um; o resto vale. */
export function parseSettings(code: string): SettingsParseResult {
  const text = code.trim();
  if (!text.startsWith(SETTINGS_BACKUP_PREFIX)) return { ok: false, error: 'format' };
  let json: string;
  try {
    json = decodeUtf8(atob(text.slice(SETTINGS_BACKUP_PREFIX.length).replace(/\s+/g, '')));
  } catch {
    return { ok: false, error: 'encoding' };
  }
  let root: unknown;
  try {
    root = JSON.parse(json);
  } catch {
    return { ok: false, error: 'json' };
  }
  if (!isRecord(root) || root.kind !== 'settings' || !isRecord(root.settings)) return { ok: false, error: 'data' };
  if (typeof root.v !== 'number') return { ok: false, error: 'data' };
  if (root.v > SETTINGS_BACKUP_VERSION) return { ok: false, error: 'version' };

  const changes: Record<string, unknown> = {};
  const keys: (keyof ExportedSettings)[] = [];
  let ignored = 0;
  for (const key of SETTINGS_KEYS) {
    if (!(key in root.settings)) continue;
    const value = (READERS[key] as (v: unknown) => unknown)(root.settings[key]);
    if (value === undefined) {
      ignored++;
      continue;
    }
    changes[key] = value;
    keys.push(key);
  }
  if (keys.length === 0) return { ok: false, error: 'empty' };
  return { ok: true, changes: changes as Partial<SettingsData>, keys, ignored };
}

/** Aplica o resultado de `parseSettings` sobre as configurações atuais: o perfil guarda o nome que já existe aqui. */
export function applySettings(current: SettingsData, changes: Partial<SettingsData>): Partial<SettingsData> {
  const out: Partial<SettingsData> = { ...changes };
  if (changes.profile) out.profile = { ...DEFAULT_PROFILE, ...current.profile, onboarded: changes.profile.onboarded, goalMinutes: changes.profile.goalMinutes };
  if (changes.reminders) out.reminders = { ...changes.reminders, asked: current.reminders.asked };
  return out;
}

export { DEFAULT_SETTINGS };
