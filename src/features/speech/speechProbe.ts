import * as Speech from 'expo-speech';
import { useVoiceStore } from './voiceStore';

export interface ProbeResult {
  text: string;
  rate: number;
  /** Texto exatamente como veio (sem o reforço do app), para ver o que a voz faz sozinha. */
  raw: boolean;
  started: boolean;
  /** Duração entre o início e o fim da fala; null se não terminou. */
  ms: number | null;
  error: string | null;
}

/** Textos de teste: do mais curto (onde a voz costuma calar) a uma frase. */
export const PROBE_TEXTS = ['あ', 'あい', 'いえ', 'うえ', 'しお', '箸', 'ふじさん', 'ありがとうございます'] as const;
export const PROBE_RATES = [0.9, 0.65] as const;

const TIMEOUT_MS = 6000;

/** Fala um texto direto na voz do aparelho (sem o reforço do app) e mede o que aconteceu. */
export function probeSpeech(text: string, rate: number, withVoice = true): Promise<ProbeResult> {
  const { voice } = useVoiceStore.getState();
  return new Promise((resolve) => {
    let started = false;
    let begin = 0;
    let done = false;
    const finish = (error: string | null, finished: boolean) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      resolve({ text, rate, raw: true, started, ms: finished && started ? Date.now() - begin : null, error });
    };
    const timer = setTimeout(() => {
      void Speech.stop();
      finish('sem resposta em 6 s', false);
    }, TIMEOUT_MS);
    void Speech.stop();
    setTimeout(() => {
      Speech.speak(text, {
        language: 'ja-JP',
        rate,
        ...(withVoice && voice ? { voice: voice.identifier } : {}),
        onStart: () => {
          started = true;
          begin = Date.now();
        },
        onDone: () => finish(null, true),
        onStopped: () => finish('interrompida', false),
        onError: (e) => finish(e?.message ?? 'erro da voz', false),
      });
    }, 150);
  });
}

/** Resumo de uma linha para a tela de diagnóstico. */
export function describeProbe(result: ProbeResult): string {
  if (result.error) return `✗ ${result.error}`;
  if (!result.started) return '✗ terminou sem começar';
  if (result.ms !== null && result.ms < 90) return `✗ rápido demais (${result.ms} ms): provavelmente mudo`;
  return `✓ ${result.ms} ms`;
}
