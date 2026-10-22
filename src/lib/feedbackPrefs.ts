/**
 * Preferências de feedback (vibração e som) que o resto do app consulta sem depender das stores.
 * A store de configurações as atualiza (ver src/store/index.ts); por padrão tudo está ligado.
 */
interface FeedbackPrefs {
  haptics: boolean;
  sound: boolean;
}

let prefs: FeedbackPrefs = { haptics: true, sound: true };

export function setFeedbackPrefs(next: Partial<FeedbackPrefs>): void {
  prefs = { ...prefs, ...next };
}

export const isHapticsOn = (): boolean => prefs.haptics;
export const isSoundOn = (): boolean => prefs.sound;
