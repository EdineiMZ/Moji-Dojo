import * as Audio from 'expo-audio';
import { feedbackComplete, feedbackCorrect, feedbackTap, feedbackWrong } from './feedback';
import { setFeedbackPrefs } from './feedbackPrefs';
import * as Haptics from './haptics';

jest.mock('expo-audio', () => ({
  createAudioPlayer: jest.fn(),
  setAudioModeAsync: jest.fn(() => Promise.resolve()),
}));
jest.mock('./haptics', () => ({
  hapticSuccess: jest.fn(),
  hapticError: jest.fn(),
  hapticLight: jest.fn(),
}));

interface FakePlayer {
  volume: number;
  seekTo: jest.Mock<Promise<void>, [number]>;
  play: jest.Mock<void, []>;
}
const createAudioPlayer = Audio.createAudioPlayer as unknown as jest.Mock<FakePlayer, [unknown]>;
const setAudioModeAsync = Audio.setAudioModeAsync as unknown as jest.Mock;

const flush = () => new Promise<void>((resolve) => setImmediate(resolve));

/**
 * Cada teste começa com módulo "novo": os players e o modo de áudio ficam guardados no módulo.
 * O isolamento cria também uma cópia nova das preferências, então elas são configuradas aqui dentro.
 */
function load(sound = true) {
  let sfx!: typeof import('./sfx');
  jest.isolateModules(() => {
    (require('./feedbackPrefs') as typeof import('./feedbackPrefs')).setFeedbackPrefs({ sound });
    sfx = require('./sfx') as typeof import('./sfx');
  });
  return sfx;
}

beforeEach(() => {
  jest.clearAllMocks();
  setFeedbackPrefs({ sound: true, haptics: true });
  createAudioPlayer.mockImplementation(() => ({
    volume: 1,
    seekTo: jest.fn((_seconds: number) => Promise.resolve()),
    play: jest.fn(),
  }));
});

describe('playSfx', () => {
  it('toca o som do começo: volta ao início e então toca', async () => {
    const { playSfx } = load();
    playSfx('correct');
    await flush();
    const player = createAudioPlayer.mock.results[0]?.value as FakePlayer;
    expect(player.seekTo).toHaveBeenCalledWith(0);
    expect(player.play).toHaveBeenCalledTimes(1);
  });

  it('cria um player por som, uma única vez, e o reaproveita nos toques seguintes', async () => {
    const { playSfx } = load();
    playSfx('correct');
    playSfx('correct');
    playSfx('wrong');
    await flush();
    expect(createAudioPlayer).toHaveBeenCalledTimes(2);
    const correct = createAudioPlayer.mock.results[0]?.value as FakePlayer;
    expect(correct.play).toHaveBeenCalledTimes(2);
  });

  it('aplica o volume de cada som', async () => {
    const { playSfx, SFX_VOLUME } = load();
    playSfx('perfect');
    playSfx('tap');
    await flush();
    const volumes = createAudioPlayer.mock.results.map((r) => (r.value as FakePlayer).volume);
    expect(volumes).toEqual([SFX_VOLUME.perfect, SFX_VOLUME.tap]);
    expect(SFX_VOLUME.tap).toBeLessThan(SFX_VOLUME.perfect);
  });

  it('configura o áudio uma vez, para tocar junto com outros sons sem interrompê-los', async () => {
    const { playSfx } = load();
    playSfx('tap');
    playSfx('correct');
    await flush();
    expect(setAudioModeAsync).toHaveBeenCalledTimes(1);
    expect(setAudioModeAsync).toHaveBeenCalledWith({ interruptionMode: 'mixWithOthers' });
  });

  it('desligado em Ajustes: não cria player nem toca nada', async () => {
    const { playSfx, preloadSfx } = load(false);
    playSfx('correct');
    preloadSfx();
    await flush();
    expect(createAudioPlayer).not.toHaveBeenCalled();
    expect(setAudioModeAsync).not.toHaveBeenCalled();
  });

  it('falha ao tocar não derruba o app; se o reposicionamento falha, toca mesmo assim', async () => {
    createAudioPlayer.mockImplementationOnce(() => ({
      volume: 1,
      seekTo: jest.fn((_seconds: number) => Promise.reject(new Error('sem posição'))),
      play: jest.fn(),
    }));
    const { playSfx } = load();
    expect(() => playSfx('correct')).not.toThrow();
    await flush();
    expect((createAudioPlayer.mock.results[0]?.value as FakePlayer).play).toHaveBeenCalledTimes(1);
  });

  it('aparelho sem áudio (erro ao criar o player) é ignorado', () => {
    createAudioPlayer.mockImplementationOnce(() => {
      throw new Error('sem áudio');
    });
    const { playSfx } = load();
    expect(() => playSfx('wrong')).not.toThrow();
  });
});

describe('preloadSfx', () => {
  it('prepara os seis players com antecedência', () => {
    const { preloadSfx } = load();
    preloadSfx();
    expect(createAudioPlayer).toHaveBeenCalledTimes(6);
  });
});

describe('feedback (vibração + som)', () => {
  const sfxCalls = () => createAudioPlayer.mock.calls.length;

  it('acerto e erro vibram e tocam o som certo', async () => {
    feedbackCorrect();
    feedbackWrong();
    await flush();
    expect(Haptics.hapticSuccess).toHaveBeenCalledTimes(1);
    expect(Haptics.hapticError).toHaveBeenCalledTimes(1);
    expect(sfxCalls()).toBeGreaterThanOrEqual(1);
  });

  it('conclusão vibra de sucesso; 100% e conclusão normal usam sons diferentes', async () => {
    feedbackComplete(false);
    feedbackComplete(true);
    await flush();
    expect(Haptics.hapticSuccess).toHaveBeenCalledTimes(2);
  });

  it('toque de tecla vibra leve', () => {
    feedbackTap();
    expect(Haptics.hapticLight).toHaveBeenCalledTimes(1);
  });
});
