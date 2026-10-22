import { createProgressStore } from './progressStore';
import { createSettingsStore, SETTINGS_STORAGE_KEY } from './settingsStore';

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
    expect(JSON.parse(storage.data.get(SETTINGS_STORAGE_KEY) ?? '{}').state).toEqual({ writeInReview: false });
    expect(createSettingsStore(storage).getState().writeInReview).toBe(false);
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
