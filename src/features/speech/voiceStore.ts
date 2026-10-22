import * as Speech from 'expo-speech';
import { create } from 'zustand';
import { pickJapaneseVoice, type VoiceInfo, type VoiceStatus } from './voices';

interface VoiceState {
  status: VoiceStatus;
  /** Voz japonesa escolhida; null enquanto verifica ou se não existe. */
  voice: VoiceInfo | null;
  /** O usuário fechou o aviso nesta sessão. */
  dismissed: boolean;
  /** Procura uma voz japonesa no aparelho. Pode ser chamada de novo após instalar a voz. */
  check: () => Promise<void>;
  dismiss: () => void;
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

async function findVoice(): Promise<VoiceInfo | null> {
  try {
    let voices = await Speech.getAvailableVoicesAsync();
    // Logo ao abrir o app, o Android às vezes responde com a lista vazia: tenta mais uma vez.
    if (voices.length === 0) {
      await wait(800);
      voices = await Speech.getAvailableVoicesAsync();
    }
    return pickJapaneseVoice(voices);
  } catch {
    return null;
  }
}

export const useVoiceStore = create<VoiceState>((set) => ({
  status: 'checking',
  voice: null,
  dismissed: false,
  check: async () => {
    set({ status: 'checking' });
    const voice = await findVoice();
    set({ voice, status: voice ? 'available' : 'missing', dismissed: false });
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

/** Lê um texto em japonês com a voz do Android (a japonesa, se existir). */
export function speakJapanese(text: string, rate = 0.9): void {
  const { voice } = useVoiceStore.getState();
  Speech.stop();
  Speech.speak(text, { language: 'ja-JP', rate, ...(voice ? { voice: voice.identifier } : {}) });
}
