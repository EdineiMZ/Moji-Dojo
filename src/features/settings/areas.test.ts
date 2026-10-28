import { DEFAULT_REMINDERS } from '@/features/reminders/plan';
import { DEFAULT_PROFILE } from '@/features/profile/profile';
import { DEFAULT_AI } from '@/features/ai/settings';
import { AREAS, isArea, summaryOf } from './areas';

const base = {
  themeMode: 'system' as const,
  profile: { ...DEFAULT_PROFILE, username: 'Edi', goalMinutes: 20 },
  reminders: { ...DEFAULT_REMINDERS, enabled: true, risk: false, hour: 20, minute: 0 },
  voiceEngine: 'system' as const,
  speechSpeed: 'normal' as const,
  romajiMode: 'tap' as const,
  showKanji: true,
  furiganaMode: 'always' as const,
  soundEnabled: true,
  hapticsEnabled: false,
  nativeAudio: true,
  ai: { ...DEFAULT_AI, enabled: false },
};

describe('áreas dos Ajustes', () => {
  it('cada área tem id único, ícone e título', () => {
    expect(new Set(AREAS.map((a) => a.id)).size).toBe(AREAS.length);
    for (const a of AREAS) expect(a.icon && a.title).toBeTruthy();
  });

  it('isArea só aceita áreas conhecidas', () => {
    expect(isArea('voice')).toBe(true);
    expect(isArea('nada')).toBe(false);
    expect(isArea(undefined)).toBe(false);
  });

  it('todas as áreas têm um resumo em uma linha', () => {
    for (const a of AREAS) {
      const text = summaryOf(a.id, base);
      expect(text.length).toBeGreaterThan(0);
      expect(text).not.toContain('\n');
    }
  });

  it('os resumos refletem o estado', () => {
    expect(summaryOf('profile', base)).toBe('Edi · meta de 20 min por dia');
    expect(summaryOf('reminders', base)).toBe('Leves · Noite (20h)');
    expect(summaryOf('reminders', { ...base, reminders: { ...base.reminders, enabled: false } })).toBe('Desligados');
    expect(summaryOf('voice', { ...base, voiceEngine: 'voicevox' })).toContain('VOICEVOX');
    expect(summaryOf('sounds', base)).toBe('Sons ligados · vibração desligada');
    expect(summaryOf('ai', base)).toBe('Desligada');
    expect(summaryOf('appearance', base)).toContain('Automático');
    expect(summaryOf('appearance', { ...base, themeMode: 'dark' })).toBe('Tema escuro');
    expect(summaryOf('study', { ...base, showKanji: false })).toContain('só kana');
  });
});
