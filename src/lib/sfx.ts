import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import { isSoundOn } from './feedbackPrefs';

/**
 * Efeitos sonoros curtos (acerto, erro, conclusão...). Os arquivos de assets/sfx são gerados por
 * scripts/generate-sounds.mjs: sons originais, sintetizados por código.
 */
const SOURCES = {
  tap: require('../../assets/sfx/tap.wav') as number,
  correct: require('../../assets/sfx/correct.wav') as number,
  wrong: require('../../assets/sfx/wrong.wav') as number,
  complete: require('../../assets/sfx/complete.wav') as number,
  perfect: require('../../assets/sfx/perfect.wav') as number,
} as const;

export type SfxName = keyof typeof SOURCES;

/** Volume de cada som (0 a 1): o toque é discreto e a comemoração é a mais forte. */
export const SFX_VOLUME: Readonly<Record<SfxName, number>> = {
  tap: 0.5,
  correct: 0.7,
  wrong: 0.6,
  complete: 0.8,
  perfect: 0.9,
};

const players: Partial<Record<SfxName, AudioPlayer>> = {};
let audioModeReady = false;

function ensureAudioMode(): void {
  if (audioModeReady) return;
  audioModeReady = true;
  // "mixWithOthers": efeitos de interface tocam junto com o que já estiver tocando (música, a voz
  // japonesa...), sem pedir o foco de áudio nem interromper nada.
  setAudioModeAsync({ interruptionMode: 'mixWithOthers' }).catch(() => undefined);
}

function playerFor(name: SfxName): AudioPlayer {
  let player = players[name];
  if (!player) {
    player = createAudioPlayer(SOURCES[name]);
    player.volume = SFX_VOLUME[name];
    players[name] = player;
  }
  return player;
}

/** Prepara os players com antecedência, para o primeiro som não atrasar. Não faz nada com o som desligado. */
export function preloadSfx(): void {
  if (!isSoundOn()) return;
  try {
    ensureAudioMode();
    for (const name of Object.keys(SOURCES) as SfxName[]) playerFor(name);
  } catch {
    // sem áudio neste aparelho: o app segue funcionando em silêncio
  }
}

/** Toca um efeito do começo. Respeita o interruptor de Ajustes; qualquer falha é ignorada. */
export function playSfx(name: SfxName): void {
  if (!isSoundOn()) return;
  try {
    ensureAudioMode();
    const player = playerFor(name);
    // Volta ao início para tocar de novo mesmo se ainda estiver terminando ou já tiver acabado.
    player.seekTo(0).then(
      () => player.play(),
      () => player.play(),
    );
  } catch {
    // sem áudio neste aparelho: o app segue funcionando em silêncio
  }
}
