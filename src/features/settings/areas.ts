import { PRESETS, presetOf, timeChoiceOf } from '@/features/reminders/presets';
import type { SettingsData } from '@/store/settingsStore';

/** As áreas dos Ajustes: uma linha cada na tela inicial, e uma subtela para cada. */
export type SettingsArea = 'profile' | 'appearance' | 'reminders' | 'voice' | 'study' | 'sounds' | 'ai' | 'data' | 'advanced';

export interface AreaInfo {
  id: SettingsArea;
  icon: string;
  title: string;
}

export const AREAS: readonly AreaInfo[] = [
  { id: 'profile', icon: '🙂', title: 'Perfil e metas' },
  { id: 'appearance', icon: '🎨', title: 'Aparência' },
  { id: 'reminders', icon: '🔔', title: 'Lembretes' },
  { id: 'voice', icon: '🗣️', title: 'Voz japonesa' },
  { id: 'study', icon: '📖', title: 'Estudo e leitura' },
  { id: 'sounds', icon: '🔊', title: 'Sons e vibração' },
  { id: 'ai', icon: '✨', title: 'Inteligência artificial' },
  { id: 'data', icon: '💾', title: 'Dados e backup' },
  { id: 'advanced', icon: '🛠️', title: 'Avançado' },
];

export const isArea = (value: unknown): value is SettingsArea => AREAS.some((a) => a.id === value);

type Summarized = Pick<SettingsData, 'themeMode' | 'profile' | 'reminders' | 'voiceEngine' | 'speechSpeed' | 'romajiMode' | 'showKanji' | 'furiganaMode' | 'soundEnabled' | 'hapticsEnabled' | 'nativeAudio' | 'ai'>;

const AID: Record<Summarized['romajiMode'], string> = { always: 'sempre', tap: 'ao tocar', never: 'nunca' };

/** Uma linha sobre o estado de cada área, para a pessoa ver o que está ligado sem abrir. */
export function summaryOf(area: SettingsArea, s: Summarized): string {
  switch (area) {
    case 'profile': {
      const name = s.profile.username || 'sem nome';
      return `${name} · ${s.profile.goalMinutes > 0 ? `meta de ${s.profile.goalMinutes} min por dia` : 'sem meta de tempo'}`;
    }
    case 'appearance':
      return s.themeMode === 'light' ? 'Tema claro' : s.themeMode === 'dark' ? 'Tema escuro' : 'Automático (segue o sistema)';
    case 'reminders': {
      const preset = presetOf(s.reminders);
      if (preset === 'off') return 'Desligados';
      const label = PRESETS.find((p) => p.value === preset)?.label ?? '';
      const time = timeChoiceOf(s.reminders.hour, s.reminders.minute) ?? `${s.reminders.hour}h${String(s.reminders.minute).padStart(2, '0')}`;
      return `${label} · ${time}`;
    }
    case 'voice':
      return `${s.voiceEngine === 'voicevox' ? 'Voz de anime (VOICEVOX)' : 'Voz do Android'} · ${s.speechSpeed === 'slow' ? 'devagar' : 'velocidade normal'}`;
    case 'study':
      return `Romaji: ${AID[s.romajiMode]} · ${s.showKanji ? `furigana: ${AID[s.furiganaMode]}` : 'só kana'}`;
    case 'sounds':
      return `${s.soundEnabled ? 'Sons ligados' : 'Sons desligados'} · ${s.hapticsEnabled ? 'vibração ligada' : 'vibração desligada'}`;
    case 'ai':
      return s.ai.enabled ? 'Ligada' : 'Desligada';
    case 'data':
      return 'Exportar, backup e zerar o progresso';
    case 'advanced':
      return 'Diagnóstico de som e detalhes técnicos';
  }
}
