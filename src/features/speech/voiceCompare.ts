import { playFile } from './nativeAudio';
import { synthesizeStyle } from './voicevox';
import type { InstalledSpeaker } from './voicevoxPacks';

/** Frases para comparar as vozes: uma curta, uma de cumprimento e uma pergunta (a entonação aparece mais). */
export const COMPARE_PHRASES = [
  { value: 'a', label: 'Cumprimento', text: 'おはようございます。きょうも がんばりましょう。' },
  { value: 'b', label: 'Pergunta', text: 'すみません、えきは どこですか。' },
  { value: 'c', label: 'Curta', text: 'ありがとうございます。' },
] as const;

/** Duração de um WAV de 16 bits mono, pelo tamanho do arquivo (o cabeçalho tem 44 bytes). Na dúvida, arredonda para mais. */
export const wavSeconds = (bytes: number, sampleRate = 22050): number => Math.max(0, bytes - 44) / (sampleRate * 2);

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Toca a mesma frase com cada voz baixada, uma depois da outra, para comparar. `onStep` diz qual personagem está falando;
 * `stopped()` é consultado a cada passo para a pessoa poder parar.
 */
export async function compareVoices(text: string, voices: readonly InstalledSpeaker[], stopped: () => boolean, onStep: (slug: string | null) => void): Promise<void> {
  const { File } = await import('expo-file-system');
  try {
    for (const voice of voices) {
      if (stopped()) return;
      const style = voice.styles[0]?.[0];
      if (style === undefined) continue;
      onStep(voice.info.slug);
      const uri = await synthesizeStyle(text, style, 0.9);
      if (!uri || stopped()) continue;
      if (!playFile(uri)) continue;
      let size = 0;
      try {
        size = new File(uri).size;
      } catch {
        size = 0;
      }
      await sleep(Math.round((size > 0 ? wavSeconds(size) : 3) * 1000) + 350);
    }
  } finally {
    onStep(null);
  }
}
