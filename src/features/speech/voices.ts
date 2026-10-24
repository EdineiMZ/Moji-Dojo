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

/** Letras que a voz de fato fala: sem espaços e sem pontuação. */
const SPOKEN = /[^\s、。，．,.!?！？…・「」『』()（）\[\]~〜～ー]/gu;

/** Quantas letras a voz vai falar (o traço ー não conta: prolonga a anterior). */
export const spokenLength = (text: string): number => (text.match(SPOKEN) ?? []).length;

/** Um texto assim curto é onde a voz japonesa do Android costuma ficar muda. */
export const MIN_SPOKEN_LENGTH = 3;

/**
 * Texto enviado à voz. Tira o que não se fala (parênteses e o que vem de apoio, como "はし (箸)"), faz de uma barra entre
 * alternativas ("はい / いいえ") uma pausa, e repete o que é curto demais: a voz japonesa do Android costuma ficar muda com
 * um ou dois caracteres ("あ", "いえ", "箸"), e repetido com uma pausa ("いえ、いえ") ela fala. Sempre chegam à voz pelo menos três letras.
 *
 * `strong` é a segunda tentativa, quando a primeira não saiu: repete também os de três e quatro letras e fecha com ponto.
 */
export const speechText = (text: string, strong = false): string => {
  const clean = text
    .replace(/[(（][^)）]*[)）]/g, ' ')
    .replace(/\s*\/\s*/g, '。')
    .replace(/\s+/g, ' ')
    .trim();
  const length = spokenLength(clean);
  if (length === 0) return clean;
  if (length < MIN_SPOKEN_LENGTH) {
    // repete até a voz receber pelo menos três letras: "あ" vira "あ、あ、あ" e "いえ", "いえ、いえ"
    return Array.from({ length: Math.ceil(MIN_SPOKEN_LENGTH / length) }, () => clean).join('、');
  }
  if (strong && length <= 4) return `${clean}、${clean}。`;
  return strong ? `${clean}。` : clean;
};
