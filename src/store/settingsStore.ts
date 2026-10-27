import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import { DEFAULT_AI, EMPTY_USAGE, addUsage, sanitizeAi, sanitizeUsage, type AiSettings, type AiUsage } from '@/features/ai/settings';
import { DEFAULT_LIMITS, sanitizeLimits, type Limits } from '@/features/limits/limits';
import { DEFAULT_PROFILE, sanitizeProfile, type Profile } from '@/features/profile/profile';
import { DEFAULT_REMINDERS, type ReminderSettings } from '@/features/reminders/plan';

export type SpeechSpeed = 'normal' | 'slow';

/** Velocidade da voz japonesa (taxa do expo-speech). */
export const SPEECH_RATES: Readonly<Record<SpeechSpeed, number>> = { normal: 0.9, slow: 0.65 };

/** Quando mostrar um apoio de leitura: sempre, só ao tocar na frase, ou nunca. */
export type ReadingAid = 'always' | 'tap' | 'never';

/** Motor da voz japonesa: a do Android (padrão) ou o VOICEVOX, que roda dentro do app. */
export type VoiceEngine = 'system' | 'voicevox';

/** Estilo padrão do VOICEVOX: ずんだもん (ノーマル). */
export const DEFAULT_VOICEVOX_STYLE = 3;

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
  /** Motor da voz: Android ou VOICEVOX (se o app foi gerado com as vozes). */
  voiceEngine: VoiceEngine;
  /** Estilo (personagem + tom) do VOICEVOX. */
  voicevoxStyle: number;
  /** Usa gravações de falantes nativos nas palavras que as têm (senão, sempre a voz do aparelho). */
  nativeAudio: boolean;
  /** Lembretes de estudo (notificações locais). */
  reminders: ReminderSettings;
  /** Limites por dia de itens novos e de revisões (0 = sem limite). */
  limits: Limits;
  /** Nome, introdução feita e meta de minutos por dia. */
  profile: Profile;
  /** IA opcional: provedor, modelo e limite diário. A chave fica fora (armazenamento seguro). */
  ai: AiSettings;
  /** Pedidos à IA de hoje. */
  aiUsage: AiUsage;
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
  setVoiceEngine: (value: VoiceEngine) => void;
  setVoicevoxStyle: (value: number) => void;
  setNativeAudio: (value: boolean) => void;
  setVoiceId: (value: string | null) => void;
  /** Muda só os campos passados dos lembretes. */
  setReminders: (change: Partial<ReminderSettings>) => void;
  setLimits: (change: Partial<Limits>) => void;
  setProfile: (change: Partial<Profile>) => void;
  setAi: (change: Partial<AiSettings>) => void;
  /** Soma um pedido à IA ao uso do dia. */
  recordAiUsage: (tokensIn: number, tokensOut: number, now?: number) => void;
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
  voiceEngine: 'system',
  voicevoxStyle: DEFAULT_VOICEVOX_STYLE,
  nativeAudio: true,
  reminders: DEFAULT_REMINDERS,
  limits: DEFAULT_LIMITS,
  profile: DEFAULT_PROFILE,
  ai: DEFAULT_AI,
  aiUsage: EMPTY_USAGE,
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
        setVoiceEngine: (value) => set({ voiceEngine: value === 'voicevox' ? 'voicevox' : 'system' }),
        setVoicevoxStyle: (value) => set({ voicevoxStyle: Number.isInteger(value) && value >= 0 ? value : DEFAULT_VOICEVOX_STYLE }),
        setNativeAudio: (value) => set({ nativeAudio: value }),
        setReminders: (change) => set((s) => ({ reminders: { ...s.reminders, ...change } })),
        setLimits: (change) => set((s) => ({ limits: sanitizeLimits({ ...s.limits, ...change }) })),
        setProfile: (change) => set((s) => ({ profile: sanitizeProfile({ ...s.profile, ...change }) })),
        setAi: (change) => set((s) => ({ ai: sanitizeAi({ ...s.ai, ...change, models: { ...s.ai.models, ...change.models } }) })),
        recordAiUsage: (tokensIn, tokensOut, now = Date.now()) => set((s) => ({ aiUsage: addUsage(s.aiUsage, now, tokensIn, tokensOut) })),
      }),
      {
        name: SETTINGS_STORAGE_KEY,
        version: 1,
        storage: createJSONStorage(() => storage),
        // O que vem do disco passa pela leitura segura: estado salvo por uma versão antiga ganha os campos novos.
        merge: (persisted, current) => {
          const saved = (persisted ?? {}) as Partial<SettingsState>;
          return {
            ...current,
            ...saved,
            voiceEngine: saved.voiceEngine === 'voicevox' ? 'voicevox' : 'system',
            voicevoxStyle: typeof saved.voicevoxStyle === 'number' && Number.isInteger(saved.voicevoxStyle) && saved.voicevoxStyle >= 0 ? saved.voicevoxStyle : DEFAULT_VOICEVOX_STYLE,
            ai: sanitizeAi(saved.ai),
            aiUsage: sanitizeUsage(saved.aiUsage),
          };
        },
        partialize: ({ writeInReview, speechSpeed, hapticsEnabled, soundEnabled, romajiMode, showKanji, furiganaMode, typingInput, voiceId, voiceEngine, voicevoxStyle, nativeAudio, reminders, limits, profile, ai, aiUsage }) => ({
          writeInReview,
          speechSpeed,
          hapticsEnabled,
          soundEnabled,
          romajiMode,
          showKanji,
          furiganaMode,
          typingInput,
          voiceId,
          voiceEngine,
          voicevoxStyle,
          nativeAudio,
          reminders,
          limits,
          profile,
          ai,
          aiUsage,
        }),
      },
    ),
  );
}

export type SettingsStore = ReturnType<typeof createSettingsStore>;
