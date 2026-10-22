import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

export type SpeechSpeed = 'normal' | 'slow';

/** Velocidade da voz japonesa (taxa do expo-speech). */
export const SPEECH_RATES: Readonly<Record<SpeechSpeed, number>> = { normal: 0.9, slow: 0.65 };

export interface SettingsData {
  /** Nas revisões, algumas perguntas pedem para desenhar o símbolo. */
  writeInReview: boolean;
  speechSpeed: SpeechSpeed;
}

export interface SettingsActions {
  setWriteInReview: (value: boolean) => void;
  setSpeechSpeed: (value: SpeechSpeed) => void;
}

export type SettingsState = SettingsData & SettingsActions;

export const SETTINGS_STORAGE_KEY = 'moji-dojo-settings';

export const DEFAULT_SETTINGS: SettingsData = { writeInReview: true, speechSpeed: 'normal' };

/**
 * Preferências do usuário. Ficam separadas do progresso: importar um backup ou zerar o
 * progresso não muda o que o usuário escolheu aqui.
 */
export function createSettingsStore(storage: StateStorage) {
  return create<SettingsState>()(
    persist(
      (set) => ({
        ...DEFAULT_SETTINGS,
        setWriteInReview: (value) => set({ writeInReview: value }),
        setSpeechSpeed: (value) => set({ speechSpeed: value }),
      }),
      {
        name: SETTINGS_STORAGE_KEY,
        version: 1,
        storage: createJSONStorage(() => storage),
        partialize: ({ writeInReview, speechSpeed }) => ({ writeInReview, speechSpeed }),
      },
    ),
  );
}

export type SettingsStore = ReturnType<typeof createSettingsStore>;
