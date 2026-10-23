import * as Speech from 'expo-speech';
import { create } from 'zustand';
import { useSettingsStore } from '@/store';
import { playRecording, recordingFor, stopRecording } from './nativeAudio';
import { japaneseVoices, pickJapaneseVoice, speechText, type VoiceInfo, type VoiceStatus } from './voices';

interface VoiceState {
  status: VoiceStatus;
  /** Voz japonesa em uso; null enquanto verifica ou se não existe. */
  voice: VoiceInfo | null;
  /** Todas as vozes japonesas do aparelho, as melhores primeiro. */
  voices: VoiceInfo[];
  /** Troca a voz em uso (null = a melhor disponível) e guarda a escolha nos Ajustes. */
  choose: (identifier: string | null) => void;
  /** O usuário fechou o aviso nesta sessão. */
  dismissed: boolean;
  /** Procura uma voz japonesa no aparelho. Pode ser chamada de novo após instalar a voz. */
  check: () => Promise<void>;
  dismiss: () => void;
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

async function findVoices(): Promise<VoiceInfo[]> {
  try {
    let voices = await Speech.getAvailableVoicesAsync();
    // Logo ao abrir o app, o Android às vezes responde com a lista vazia: tenta mais uma vez.
    if (voices.length === 0) {
      await wait(800);
      voices = await Speech.getAvailableVoicesAsync();
    }
    return japaneseVoices(voices);
  } catch {
    return [];
  }
}

export const useVoiceStore = create<VoiceState>((set) => ({
  status: 'checking',
  voice: null,
  voices: [],
  dismissed: false,
  check: async () => {
    set({ status: 'checking' });
    const voices = await findVoices();
    const voice = pickJapaneseVoice(voices, useSettingsStore.getState().voiceId);
    set({ voices, voice, status: voice ? 'available' : 'missing', dismissed: false });
  },
  choose: (identifier) => {
    useSettingsStore.getState().setVoiceId(identifier);
    set((s) => ({ voice: pickJapaneseVoice(s.voices, identifier) }));
  },
  dismiss: () => set({ dismissed: true }),
}));

let started = false;

/** Dispara a verificação da voz uma única vez por execução do app. */
export function ensureVoiceChecked(): void {
  if (started) return;
  started = true;
  void useVoiceStore.getState().check();
}

/** Lê um texto em japonês: gravação de falante nativo quando a palavra tem, senão a voz do Android (a japonesa, se existir). */
export function speakJapanese(text: string, rate = 0.9): void {
  const { voice } = useVoiceStore.getState();
  Speech.stop();
  // Palavra gravada por um falante nativo: toca a gravação (mais natural que a voz do aparelho).
  if (useSettingsStore.getState().nativeAudio) {
    const recording = recordingFor(text);
    if (recording && playRecording(recording, rate)) return;
  }
  stopRecording();
  Speech.speak(speechText(text), { language: 'ja-JP', rate, ...(voice ? { voice: voice.identifier } : {}) });
}
