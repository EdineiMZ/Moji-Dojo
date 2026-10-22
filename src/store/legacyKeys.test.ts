import { LEGACY_STORAGE_KEYS, withLegacyKeys, type SyncStorage } from './legacyKeys';
import { createProgressStore, PROGRESS_STORAGE_KEY } from './progressStore';
import { createSettingsStore, SETTINGS_STORAGE_KEY } from './settingsStore';

const memory = (initial: Record<string, string> = {}) => {
  const data = new Map(Object.entries(initial));
  const storage: SyncStorage & { data: Map<string, string> } = {
    data,
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => void data.set(k, v),
    removeItem: (k) => void data.delete(k),
  };
  return storage;
};

describe('withLegacyKeys', () => {
  it('chave nova ausente e antiga presente: move o valor para a nova e apaga a antiga', () => {
    const storage = memory({ 'nihongo-dojo-progress': '{"state":1}' });
    const wrapped = withLegacyKeys(storage, LEGACY_STORAGE_KEYS);

    expect(wrapped.getItem('moji-dojo-progress')).toBe('{"state":1}');
    expect(storage.data.get('moji-dojo-progress')).toBe('{"state":1}');
    expect(storage.data.has('nihongo-dojo-progress')).toBe(false);
  });

  it('a chave nova que já existe vence e a antiga não é tocada', () => {
    const storage = memory({ 'moji-dojo-progress': 'novo', 'nihongo-dojo-progress': 'antigo' });
    const wrapped = withLegacyKeys(storage, LEGACY_STORAGE_KEYS);
    expect(wrapped.getItem('moji-dojo-progress')).toBe('novo');
    expect(storage.data.get('nihongo-dojo-progress')).toBe('antigo');
  });

  it('sem nenhuma das duas, ou chave sem equivalente antigo, devolve null', () => {
    const wrapped = withLegacyKeys(memory(), LEGACY_STORAGE_KEYS);
    expect(wrapped.getItem('moji-dojo-progress')).toBeNull();
    expect(wrapped.getItem('outra-chave')).toBeNull();
  });

  it('só migra uma vez: depois da migração a chave antiga não ressuscita', () => {
    const storage = memory({ 'nihongo-dojo-settings': 'x' });
    const wrapped = withLegacyKeys(storage, LEGACY_STORAGE_KEYS);
    wrapped.getItem('moji-dojo-settings');
    wrapped.removeItem('moji-dojo-settings'); // ex.: o app apagou o valor
    expect(wrapped.getItem('moji-dojo-settings')).toBeNull();
  });

  it('as chaves do app apontam para as antigas certas', () => {
    expect(LEGACY_STORAGE_KEYS[PROGRESS_STORAGE_KEY]).toBe('nihongo-dojo-progress');
    expect(LEGACY_STORAGE_KEYS[SETTINGS_STORAGE_KEY]).toBe('nihongo-dojo-settings');
  });
});

describe('quem já estudava com o nome antigo mantém tudo', () => {
  it('progresso e preferências salvos com as chaves antigas aparecem nas stores novas', () => {
    const storage = memory({
      'nihongo-dojo-progress': JSON.stringify({
        state: {
          srs: { あ: { b: 3, due: 123 } },
          lessons: { 'hira:L0': true },
          stats: { あ: { c: 4, w: 1 } },
          days: ['2026-10-20', '2026-10-21'],
          shadow: { こんにちは: 'ok' },
          challenges: { ねこ: true },
        },
        version: 1,
      }),
      'nihongo-dojo-settings': JSON.stringify({ state: { writeInReview: false, speechSpeed: 'slow' }, version: 1 }),
    });
    const wrapped = withLegacyKeys(storage, LEGACY_STORAGE_KEYS);

    const progress = createProgressStore(wrapped).getState();
    expect(progress.lessons).toEqual({ 'hira:L0': true });
    expect(progress.srs['あ']).toEqual({ b: 3, due: 123 });
    expect(progress.days).toHaveLength(2);
    expect(progress.shadow).toEqual({ こんにちは: 'ok' });

    const settings = createSettingsStore(wrapped).getState();
    expect(settings.writeInReview).toBe(false);
    expect(settings.speechSpeed).toBe('slow');

    expect([...storage.data.keys()].sort()).toEqual(['moji-dojo-progress', 'moji-dojo-settings']);
  });

  it('instalação nova (sem nada salvo) começa vazia', () => {
    const wrapped = withLegacyKeys(memory(), LEGACY_STORAGE_KEYS);
    expect(createProgressStore(wrapped).getState().lessons).toEqual({});
    expect(createSettingsStore(wrapped).getState().writeInReview).toBe(true);
  });
});
