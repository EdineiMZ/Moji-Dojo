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

/** Toca a gravação. `rate` é a velocidade da fala (0,9 = normal); só abaixo disso desacelera. Devolve false se falhar. */
export function playRecording(rec: WordRecording, rate: number): boolean {
  try {
    if (!modeReady) {
      modeReady = true;
      setAudioModeAsync({ interruptionMode: 'duckOthers' }).catch(() => undefined);
    }
    if (!player) player = createAudioPlayer(rec.file);
    else player.replace(rec.file);
    player.setPlaybackRate(Math.max(0.5, Math.min(1, rate / 0.9)), 'high');
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
