import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import { DEFAULT_REMINDERS, type ReminderSettings } from '@/features/reminders/plan';

export type SpeechSpeed = 'normal' | 'slow';

/** Velocidade da voz japonesa (taxa do expo-speech). */
export const SPEECH_RATES: Readonly<Record<SpeechSpeed, number>> = { normal: 0.9, slow: 0.65 };

/** Quando mostrar um apoio de leitura: sempre, só ao tocar na frase, ou nunca. */
export type ReadingAid = 'always' | 'tap' | 'never';

/** Teclado para digitar em japonês nos exercícios: o do app (flick) ou o do celular. */
export type TypingInput = 'pad' | 'system';

export interface SettingsData {
  /** Nas revisões, algumas perguntas pedem para desenhar o símbolo. */
  writeInReview: boolean;
  speechSpeed: SpeechSpeed;
  /** Vibração leve ao acertar, errar e em alguns toques. */
  hapticsEnabled: boolean;
  /** Efeitos sonoros (acerto, erro, conclusão...). A voz japonesa não é afetada. */
  soundEnabled: boolean;
  /** Romaji nas frases e palavras. */
  romajiMode: ReadingAid;
  /** Nas frases que têm kanji, mostra a escrita com kanji no lugar do kana. */
  showKanji: boolean;
  /** Furigana (a leitura pequena sobre o kanji), quando os kanji estão à mostra. */
  furiganaMode: ReadingAid;
  /** Teclado usado nos exercícios de digitar frases. */
  typingInput: TypingInput;
  /** Voz japonesa escolhida (identificador do Android); null = a melhor disponível. */
  voiceId: string | null;
  /** Lembretes de estudo (notificações locais). */
  reminders: ReminderSettings;
}

export interface SettingsActions {
  setWriteInReview: (value: boolean) => void;
  setSpeechSpeed: (value: SpeechSpeed) => void;
  setHapticsEnabled: (value: boolean) => void;
  setSoundEnabled: (value: boolean) => void;
  setRomajiMode: (value: ReadingAid) => void;
  setShowKanji: (value: boolean) => void;
  setFuriganaMode: (value: ReadingAid) => void;
  setTypingInput: (value: TypingInput) => void;
  setVoiceId: (value: string | null) => void;
  /** Muda só os campos passados dos lembretes. */
  setReminders: (change: Partial<ReminderSettings>) => void;
}

export type SettingsState = SettingsData & SettingsActions;

export const SETTINGS_STORAGE_KEY = 'moji-dojo-settings';

export const DEFAULT_SETTINGS: SettingsData = {
  writeInReview: true,
  speechSpeed: 'normal',
  hapticsEnabled: true,
  soundEnabled: true,
  romajiMode: 'always',
  showKanji: false,
  furiganaMode: 'always',
  typingInput: 'pad',
  voiceId: null,
  reminders: DEFAULT_REMINDERS,
};

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
        setHapticsEnabled: (value) => set({ hapticsEnabled: value }),
        setSoundEnabled: (value) => set({ soundEnabled: value }),
        setRomajiMode: (value) => set({ romajiMode: value }),
        setShowKanji: (value) => set({ showKanji: value }),
        setFuriganaMode: (value) => set({ furiganaMode: value }),
        setTypingInput: (value) => set({ typingInput: value }),
        setVoiceId: (value) => set({ voiceId: value }),
        setReminders: (change) => set((s) => ({ reminders: { ...s.reminders, ...change } })),
      }),
      {
        name: SETTINGS_STORAGE_KEY,
        version: 1,
        storage: createJSONStorage(() => storage),
        partialize: ({ writeInReview, speechSpeed, hapticsEnabled, soundEnabled, romajiMode, showKanji, furiganaMode, typingInput, voiceId, reminders }) => ({
          writeInReview,
          speechSpeed,
          hapticsEnabled,
          soundEnabled,
          romajiMode,
          showKanji,
          furiganaMode,
          typingInput,
          voiceId,
          reminders,
        }),
      },
    ),
  );
}

export type SettingsStore = ReturnType<typeof createSettingsStore>;
