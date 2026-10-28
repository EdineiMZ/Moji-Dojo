import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import { VOCAB } from '@/content';
import { WORD_RECORDINGS, type WordRecording } from '@/content/wordAudio';

/** Texto → gravação: pela escrita da palavra e, nas que só têm kana igual à leitura, pela leitura. */
let index: Map<string, WordRecording> | null = null;
function recordingIndex(): Map<string, WordRecording> {
  if (index) return index;
  const map = new Map<string, WordRecording>();
  for (const [word, rec] of Object.entries(WORD_RECORDINGS)) map.set(word, rec);
  for (const w of VOCAB) {
    const rec = WORD_RECORDINGS[w.jp];
    if (rec && !map.has(w.reading)) map.set(w.reading, rec);
  }
  index = map;
  return map;
}

/** A gravação de um falante nativo para o texto, se ele é exatamente uma palavra que temos gravada. */
export const recordingFor = (text: string): WordRecording | null => recordingIndex().get(text.trim()) ?? null;

let player: AudioPlayer | null = null;
let modeReady = false;

/**
 * "mixWithOthers": não pede o foco de áudio. Com "duckOthers" a voz do Android tomava o foco, o expo-audio pausava a gravação
 * e a RETOMAVA sozinho quando o foco voltava, repetindo o som antigo. É o mesmo modo dos efeitos (lib/sfx.ts), que dividem o
 * estado global do módulo: antes os dois modos se alternavam conforme quem tocou por último.
 */
function ensureAudioMode(): void {
  if (modeReady) return;
  modeReady = true;
  setAudioModeAsync({ interruptionMode: 'mixWithOthers', playsInSilentMode: true }).catch(() => undefined);
}

/** Toca a gravação. `rate` é a velocidade da fala (0,9 = normal); só abaixo disso desacelera. Devolve false se falhar. */
export function playRecording(rec: WordRecording, rate: number): boolean {
  try {
    ensureAudioMode();
    if (!player) player = createAudioPlayer(rec.file);
    else player.replace(rec.file);
    player.setPlaybackRate(Math.max(0.5, Math.min(1, rate / 0.9)), 'high');
    player.play();
    return true;
  } catch {
    return false;
  }
}

/** Toca um arquivo de áudio gerado no aparelho (a voz VOICEVOX). Devolve false se falhar. */
export function playFile(uri: string): boolean {
  try {
    ensureAudioMode();
    if (!player) player = createAudioPlayer(uri);
    else player.replace(uri);
    // A velocidade já foi aplicada na síntese: aqui volta ao normal (uma gravação anterior pode ter desacelerado).
    player.setPlaybackRate(1, 'high');
    player.play();
    return true;
  } catch {
    return false;
  }
}

export function stopRecording(): void {
  try {
    player?.pause();
  } catch {
    // nada tocando
  }
}
