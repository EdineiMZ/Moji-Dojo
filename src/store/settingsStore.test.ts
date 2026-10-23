import { DEFAULT_REMINDERS } from '@/features/reminders/plan';
import { createProgressStore } from './progressStore';
import { createSettingsStore, SETTINGS_STORAGE_KEY, SPEECH_RATES } from './settingsStore';

const memory = () => {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  };
};

describe('settingsStore', () => {
  it('o write nas revisões vem ligado por padrão', () => {
    expect(createSettingsStore(memory()).getState().writeInReview).toBe(true);
  });

  it('a escolha fica salva e volta ao reabrir o app', () => {
    const storage = memory();
    createSettingsStore(storage).getState().setWriteInReview(false);
    expect(JSON.parse(storage.data.get(SETTINGS_STORAGE_KEY) ?? '{}').state).toEqual({
      writeInReview: false,
      speechSpeed: 'normal',
      hapticsEnabled: true,
      soundEnabled: true,
      romajiMode: 'always',
      showKanji: false,
      furiganaMode: 'always',
      typingInput: 'pad',
      voiceId: null,
      nativeAudio: true,
      reminders: DEFAULT_REMINDERS,
      limits: { newPerDay: 0, reviewsPerDay: 0 },
    });
    expect(createSettingsStore(storage).getState().writeInReview).toBe(false);
  });

  it('romaji e furigana vêm sempre à mostra, o kanji vem desligado, e as escolhas ficam salvas', () => {
    const storage = memory();
    const store = createSettingsStore(storage);
    expect(store.getState()).toMatchObject({ romajiMode: 'always', showKanji: false, furiganaMode: 'always' });
    store.getState().setRomajiMode('tap');
    store.getState().setShowKanji(true);
    store.getState().setFuriganaMode('never');
    expect(createSettingsStore(storage).getState()).toMatchObject({ romajiMode: 'tap', showKanji: true, furiganaMode: 'never' });
  });

  it('a velocidade da voz começa normal, pode ficar devagar e é lembrada', () => {
    const storage = memory();
    const store = createSettingsStore(storage);
    expect(store.getState().speechSpeed).toBe('normal');
    store.getState().setSpeechSpeed('slow');
    expect(createSettingsStore(storage).getState().speechSpeed).toBe('slow');
    expect(SPEECH_RATES.slow).toBeLessThan(SPEECH_RATES.normal);
  });

  it('vibração e efeitos sonoros vêm ligados e as escolhas ficam salvas', () => {
    const storage = memory();
    const store = createSettingsStore(storage);
    expect(store.getState()).toMatchObject({ hapticsEnabled: true, soundEnabled: true });
    store.getState().setHapticsEnabled(false);
    store.getState().setSoundEnabled(false);
    expect(createSettingsStore(storage).getState()).toMatchObject({ hapticsEnabled: false, soundEnabled: false });
  });

  it('zerar o progresso ou importar um backup não mexe nas preferências', () => {
    const storage = memory();
    const settings = createSettingsStore(storage);
    settings.getState().setWriteInReview(false);

    const progress = createProgressStore(storage);
    progress.getState().completeLesson('hira:L0', ['あ']);
    progress.getState().resetProgress();
    progress.getState().replaceProgress({ srs: {}, lessons: {}, stats: {}, days: [] });

    expect(createSettingsStore(storage).getState().writeInReview).toBe(false);
  });
});
