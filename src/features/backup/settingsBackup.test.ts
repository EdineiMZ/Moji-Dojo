import { DEFAULT_AI } from '@/features/ai/settings';
import { DEFAULT_REMINDERS } from '@/features/reminders/plan';
import { DEFAULT_SETTINGS, type SettingsData } from '@/store/settingsStore';
import { decodeUtf8, encodeUtf8 } from './backup';
import { applySettings, exportSettings, parseSettings, pickExported, SETTINGS_BACKUP_PREFIX } from './settingsBackup';

const mine: SettingsData = {
  ...DEFAULT_SETTINGS,
  themeMode: 'dark',
  colorTheme: 'matcha',
  retention: 0.95,
  typingGoal: 200,
  speechSpeed: 'slow',
  romajiMode: 'never',
  showKanji: true,
  voiceId: 'ja-jp-x-abc-network',
  voiceEngine: 'voicevox',
  voicevoxStyle: 8,
  favoriteVoices: ['zundamon'],
  reminders: { ...DEFAULT_REMINDERS, enabled: true, hour: 21, minute: 30, weekdays: [1, 3, 5], asked: true },
  limits: { newPerDay: 10, reviewsPerDay: 60 },
  profile: { username: 'Edi', onboarded: true, goalMinutes: 25 },
  ai: { ...DEFAULT_AI, provider: 'custom', customUrl: 'https://ia.exemplo.com/v1', models: { ...DEFAULT_AI.models, custom: 'llama3.1:8b' } },
  aiUsage: { day: '2026-10-28', calls: 9, tokensIn: 100, tokensOut: 200 },
};

const mdjc = (payload: unknown) => SETTINGS_BACKUP_PREFIX + btoa(encodeUtf8(JSON.stringify(payload)));
const body = (code: string) => JSON.parse(decodeUtf8(atob(code.slice(SETTINGS_BACKUP_PREFIX.length)))) as { settings: Record<string, unknown> };

describe('backup só das configurações', () => {
  it('vai e volta sem perder nada do que deve viajar', () => {
    const result = parseSettings(exportSettings(mine));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.ignored).toBe(0);
    expect(result.changes).toMatchObject({
      themeMode: 'dark',
      colorTheme: 'matcha',
      retention: 0.95,
      typingGoal: 200,
      speechSpeed: 'slow',
      romajiMode: 'never',
      showKanji: true,
      voiceEngine: 'voicevox',
      voicevoxStyle: 8,
      favoriteVoices: ['zundamon'],
      limits: { newPerDay: 10, reviewsPerDay: 60 },
      profile: { onboarded: true, goalMinutes: 25 },
    });
    expect(result.changes.ai).toMatchObject({ provider: 'custom', customUrl: 'https://ia.exemplo.com/v1' });
    expect(result.changes.reminders).toMatchObject({ enabled: true, hour: 21, minute: 30, weekdays: [1, 3, 5] });
  });

  it('não leva o nome, a voz do aparelho, o uso da IA nem qualquer chave', () => {
    const code = exportSettings(mine);
    const settings = body(code).settings;
    expect(settings).not.toHaveProperty('voiceId');
    expect(settings).not.toHaveProperty('aiUsage');
    expect(settings.profile).not.toHaveProperty('username');
    expect(decodeUtf8(atob(code.slice(SETTINGS_BACKUP_PREFIX.length)))).not.toMatch(/Edi|network|api[_-]?key|sk-/i);
    expect(Object.keys(pickExported(mine))).not.toContain('voiceId');
  });

  it('ao aplicar, mantém o nome daqui e a pergunta de permissão de cada aparelho', () => {
    const result = parseSettings(exportSettings(mine));
    if (!result.ok) throw new Error('esperava ok');
    const here: SettingsData = { ...DEFAULT_SETTINGS, profile: { username: 'Maria', onboarded: false, goalMinutes: 10 }, reminders: { ...DEFAULT_REMINDERS, asked: false } };
    const applied = applySettings(here, result.changes);
    expect(applied.profile).toEqual({ username: 'Maria', onboarded: true, goalMinutes: 25 });
    expect(applied.reminders).toMatchObject({ enabled: true, hour: 21, asked: false });
  });

  it('valores inválidos são ignorados um a um; o resto vale', () => {
    const code = mdjc({ v: 1, kind: 'settings', settings: { themeMode: 'dark', colorTheme: 'rosa-choque', retention: 0.5, typingGoal: 7, speechSpeed: 'veloz', reminders: { hour: 99, minute: 0, weekdays: [1] }, voicevoxPitch: 'x', ai: 'lixo', desconhecida: true } });
    const result = parseSettings(code);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.keys).toEqual(['themeMode']);
    expect(result.ignored).toBe(7);
  });

  it('recusa o que não é um código de configurações', () => {
    expect(parseSettings('MDJ1:abc')).toEqual({ ok: false, error: 'format' });
    expect(parseSettings(SETTINGS_BACKUP_PREFIX + '@@@')).toEqual({ ok: false, error: 'encoding' });
    expect(parseSettings(SETTINGS_BACKUP_PREFIX + btoa('isto nao e json'))).toEqual({ ok: false, error: 'json' });
    expect(parseSettings(mdjc({ v: 1, kind: 'progress', settings: {} }))).toEqual({ ok: false, error: 'data' });
    expect(parseSettings(mdjc({ v: 99, kind: 'settings', settings: { themeMode: 'dark' } }))).toEqual({ ok: false, error: 'version' });
    expect(parseSettings(mdjc({ v: 1, kind: 'settings', settings: {} }))).toEqual({ ok: false, error: 'empty' });
  });
});
