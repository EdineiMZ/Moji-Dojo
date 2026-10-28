import * as Speech from 'expo-speech';
import { create } from 'zustand';
import { useSettingsStore } from '@/store';
import { playFile, playRecording, recordingFor, stopRecording } from './nativeAudio';
import { synthesizeFile, voicevoxActive, warmUpVoicevox } from './voicevox';
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
  warmUpVoicevox();
}

/** Uma tentativa de fala: a voz do aparelho (ou não) e o texto, no jeito normal ou reforçado. */
interface Attempt {
  withVoice: boolean;
  strong: boolean;
}

/**
 * As tentativas, em ordem. Se a fala der erro ou terminar sem ter começado (a voz japonesa do Android às vezes "toca" em
 * silêncio), tenta de novo: reforçando o texto, depois sem a voz escolhida (uma voz online sem internet não fala nada).
 */
const ATTEMPTS: readonly Attempt[] = [
  { withVoice: true, strong: false },
  { withVoice: true, strong: true },
  { withVoice: false, strong: true },
];

/** Uma fala que terminou antes disto (ms) não chegou a ser dita. */
const TOO_SHORT_MS = 90;
/** Sem aviso de início, uma fala que durou menos que isto (ms) não foi dita; mais que isso, o motor só não avisou. */
const NO_START_MS = 350;

export interface SpeechLogEntry {
  text: string;
  /** Qual tentativa (1 a 3) acabou valendo, ou 0 se nenhuma saiu. */
  attempt: number;
  note: string;
}

const LOG_SIZE = 20;
let speechLog: SpeechLogEntry[] = [];
/** As últimas falas e o que aconteceu com cada uma (para o diagnóstico nos Ajustes). */
export const recentSpeech = (): readonly SpeechLogEntry[] => speechLog;
const remember = (entry: SpeechLogEntry) => {
  speechLog = [entry, ...speechLog].slice(0, LOG_SIZE);
};

let speaking = false;
let request = 0;
let lastSpokenAt = 0;

function speakAttempt(text: string, rate: number, step: number, id: number): void {
  const attempt = ATTEMPTS[step];
  if (!attempt || id !== request) return;
  const { voice } = useVoiceStore.getState();
  let started = false;
  const begin = Date.now();
  const retry = (why: string) => {
    if (id !== request) return;
    speaking = false;
    if (step + 1 < ATTEMPTS.length) {
      remember({ text, attempt: step + 1, note: `repetiu: ${why}` });
      speakAttempt(text, rate, step + 1, id);
    } else {
      remember({ text, attempt: 0, note: `não saiu (${why})` });
    }
  };
  Speech.speak(speechText(text, attempt.strong), {
    language: 'ja-JP',
    rate,
    ...(attempt.withVoice && voice ? { voice: voice.identifier } : {}),
    onStart: () => {
      started = true;
      speaking = true;
    },
    onDone: () => {
      if (id !== request) return;
      speaking = false;
      const elapsed = Date.now() - begin;
      // Alguns motores falam sem avisar o início: sem `onStart`, só conta como silêncio se acabou quase na hora.
      if (!started && elapsed < NO_START_MS) retry('terminou sem começar');
      else if (elapsed < TOO_SHORT_MS) retry('terminou rápido demais');
      else remember({ text, attempt: step + 1, note: `ok em ${Date.now() - begin} ms` });
    },
    onStopped: () => {
      speaking = false;
    },
    onError: (error) => retry(error?.message ?? 'erro da voz'),
  });
}

/** Fala com a voz do Android (a japonesa, se existir), com o respiro e as novas tentativas de sempre. */
function speakSystem(text: string, rate: number, id: number): void {
  stopRecording();
  // Parar a fala e começar outra no mesmo instante faz alguns Android descartarem a nova: dá um respiro quando havia fala.
  const busy = speaking || Date.now() - lastSpokenAt < 600;
  lastSpokenAt = Date.now();
  if (busy) {
    // O Speech.speak enfileira: `speaking` só vira true no onStart, então a janela de `lastSpokenAt` cobre as falas ainda não iniciadas.
    speaking = false;
    void Speech.stop();
    setTimeout(() => speakAttempt(text, rate, 0, id), 80);
    return;
  }
  speakAttempt(text, rate, 0, id);
}

/** Fala com o VOICEVOX; se não der (módulo ausente, erro de síntese), cai na voz do Android. */
async function speakVoicevox(text: string, rate: number, id: number, role: 'you' | 'staff'): Promise<void> {
  try {
    const uri = await synthesizeFile(text, rate, role);
    if (id !== request) return;
    if (uri && playFile(uri)) {
      remember({ text, attempt: 0, note: 'voz VOICEVOX' });
      return;
    }
  } catch (error) {
    remember({ text, attempt: 0, note: `VOICEVOX falhou: ${error instanceof Error ? error.message : 'erro'}` });
  }
  if (id === request) speakSystem(text, rate, id);
}

/**
 * Lê um texto em japonês: gravação de falante nativo quando a palavra tem; senão a voz VOICEVOX (se escolhida e pronta);
 * senão a voz do Android (a japonesa, se existir).
 */
export function speakJapanese(text: string, rate = 0.9, role: 'you' | 'staff' = 'you'): void {
  const id = ++request;
  // Palavra gravada por um falante nativo: toca a gravação (mais natural que qualquer voz sintética).
  if (useSettingsStore.getState().nativeAudio) {
    const recording = recordingFor(text);
    if (recording) {
      speaking = false;
      void Speech.stop();
      if (playRecording(recording, rate)) return;
    }
  }
  if (voicevoxActive()) {
    speaking = false;
    void Speech.stop();
    stopRecording();
    void speakVoicevox(text, rate, id, role);
    return;
  }
  speakSystem(text, rate, id);
}
