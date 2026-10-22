/** Parte de uma voz do expo-speech que nos interessa. */
export interface VoiceInfo {
  identifier: string;
  name: string;
  language: string;
}

/** "ja", "ja-JP", "ja_JP", "JA-jp"... */
export const isJapaneseLanguage = (language: string): boolean => /^ja([-_]|$)/i.test(language);

/** Primeira voz japonesa disponível, ou null se o aparelho não tem nenhuma. */
export function pickJapaneseVoice<T extends VoiceInfo>(voices: readonly T[]): T | null {
  return voices.find((v) => isJapaneseLanguage(v.language)) ?? null;
}

export type VoiceStatus = 'checking' | 'available' | 'missing';

/** Passos para instalar a voz no Android (os nomes dos menus variam um pouco entre aparelhos). */
export const VOICE_INSTALL_STEPS: readonly string[] = [
  'Abra as Configurações do Android.',
  'Vá em Sistema → Idiomas → Saída de conversão de texto em voz.',
  'Toque na engrenagem do mecanismo do Google.',
  'Escolha "Instalar dados de voz" e depois "Japonês".',
];

/** Texto enviado à voz: uma barra entre alternativas ("はい / いいえ") vira pausa, como no protótipo. */
export const speechText = (text: string): string => text.replace(/\s*\/\s*/g, '。');
