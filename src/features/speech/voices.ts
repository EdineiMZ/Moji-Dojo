/** Parte de uma voz do expo-speech que nos interessa. */
export interface VoiceInfo {
  identifier: string;
  name: string;
  language: string;
  /** "Enhanced" nas vozes de melhor qualidade do Android; "Default" nas comuns. */
  quality?: string;
}

/** "ja", "ja-JP", "ja_JP", "JA-jp"... */
export const isJapaneseLanguage = (language: string): boolean => /^ja([-_]|$)/i.test(language);

const isEnhanced = (voice: VoiceInfo): boolean => voice.quality === 'Enhanced';

/** Todas as vozes japonesas do aparelho, as de melhor qualidade primeiro (a ordem do aparelho se mantém entre iguais). */
export function japaneseVoices<T extends VoiceInfo>(voices: readonly T[]): T[] {
  const japanese = voices.filter((v) => isJapaneseLanguage(v.language));
  return [...japanese.filter(isEnhanced), ...japanese.filter((v) => !isEnhanced(v))];
}

/**
 * A voz japonesa a usar: a escolhida pela pessoa (se ainda existir) ou a melhor disponível. Null se o aparelho não tem
 * nenhuma.
 */
export function pickJapaneseVoice<T extends VoiceInfo>(voices: readonly T[], preferredId?: string | null): T | null {
  const japanese = japaneseVoices(voices);
  return (preferredId ? japanese.find((v) => v.identifier === preferredId) : undefined) ?? japanese[0] ?? null;
}

export type VoiceStatus = 'checking' | 'available' | 'missing';

/** Passos para instalar a voz no Android (os nomes dos menus variam um pouco entre aparelhos). */
export const VOICE_INSTALL_STEPS: readonly string[] = [
  'Abra as Configurações do Android.',
  'Vá em Sistema → Idiomas → Saída de conversão de texto em voz.',
  'Toque na engrenagem do mecanismo do Google.',
  'Escolha "Instalar dados de voz" e depois "Japonês".',
];

/** Nome para a lista de vozes: os identificadores do Android ("ja-jp-x-jab-network") não dizem nada a quem usa. */
export function voiceLabel(voice: VoiceInfo, index: number): string {
  const traits = [
    voice.quality === 'Enhanced' ? 'melhor qualidade' : null,
    /network/i.test(voice.identifier) ? 'online' : /local/i.test(voice.identifier) ? 'no aparelho' : null,
  ].filter(Boolean);
  return `Voz ${index + 1}${traits.length > 0 ? ` (${traits.join(', ')})` : ''}`;
}

/** Texto enviado à voz: uma barra entre alternativas ("はい / いいえ") vira pausa, como no protótipo. */
export const speechText = (text: string): string => text.replace(/\s*\/\s*/g, '。');
