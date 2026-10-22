import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

export interface SettingsData {
  /** Nas revisões, algumas perguntas pedem para desenhar o símbolo. */
  writeInReview: boolean;
}

export interface SettingsActions {
  setWriteInReview: (value: boolean) => void;
}

export type SettingsState = SettingsData & SettingsActions;

export const SETTINGS_STORAGE_KEY = 'nihongo-dojo-settings';

export const DEFAULT_SETTINGS: SettingsData = { writeInReview: true };

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
      }),
      {
        name: SETTINGS_STORAGE_KEY,
        version: 1,
        storage: createJSONStorage(() => storage),
        partialize: ({ writeInReview }) => ({ writeInReview }),
      },
    ),
  );
}

export type SettingsStore = ReturnType<typeof createSettingsStore>;
