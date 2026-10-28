import { DEFAULT_VOICEVOX_STYLE, createSettingsStore } from '@/store/settingsStore';
import { creditFor, resolveStyle, speedScaleFor, styleForRole, useVoicevoxStore, type VoicevoxSpeaker } from './voicevox';

const speakers: VoicevoxSpeaker[] = [
  { name: '四国めたん', styles: [{ id: 2, name: 'ノーマル' }, { id: 0, name: 'あまあま' }] },
  { name: 'ずんだもん', styles: [{ id: 3, name: 'ノーマル' }, { id: 1, name: 'あまあま' }] },
];

describe('speedScaleFor', () => {
  it('mapeia a velocidade normal do app (0,9) para 1,0 e a lenta para menos', () => {
    expect(speedScaleFor(0.9)).toBe(1);
    expect(speedScaleFor(0.65)).toBe(0.72);
  });

  it('limita para a fala não ficar impossível', () => {
    expect(speedScaleFor(0.1)).toBe(0.55);
    expect(speedScaleFor(5)).toBe(1.4);
  });
});

describe('creditFor', () => {
  it('monta o crédito que os termos pedem a partir do estilo em uso', () => {
    expect(creditFor(speakers, 3)).toBe('VOICEVOX:ずんだもん');
    expect(creditFor(speakers, 0)).toBe('VOICEVOX:四国めたん');
  });

  it('não inventa crédito para um estilo que não está instalado', () => {
    expect(creditFor(speakers, 99)).toBeNull();
    expect(creditFor([], 3)).toBeNull();
  });
});

describe('resolveStyle', () => {
  it('mantém o estilo escolhido se ele existe', () => {
    expect(resolveStyle(speakers, 2)).toBe(2);
  });

  it('volta ao ずんだもん ノーマル e, sem ele, ao primeiro estilo instalado', () => {
    expect(resolveStyle(speakers, 99)).toBe(DEFAULT_VOICEVOX_STYLE);
    expect(resolveStyle([speakers[0] as VoicevoxSpeaker], 99)).toBe(2);
  });
});

describe('configurações da voz', () => {
  const memory = () => {
    const data = new Map<string, string>();
    return { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => void data.set(k, v), removeItem: (k: string) => void data.delete(k) };
  };

  it('começam na voz do Android e aceitam só valores válidos', () => {
    const store = createSettingsStore(memory());
    expect(store.getState().voiceEngine).toBe('system');
    expect(store.getState().voicevoxStyle).toBe(DEFAULT_VOICEVOX_STYLE);
    store.getState().setVoiceEngine('voicevox');
    expect(store.getState().voiceEngine).toBe('voicevox');
    store.getState().setVoiceEngine('outro' as never);
    expect(store.getState().voiceEngine).toBe('system');
    store.getState().setVoicevoxStyle(-4);
    expect(store.getState().voicevoxStyle).toBe(DEFAULT_VOICEVOX_STYLE);
    store.getState().setVoicevoxStyle(8);
    expect(store.getState().voicevoxStyle).toBe(8);
  });

});

describe('download de vozes', () => {
  beforeEach(() => useVoicevoxStore.setState({ download: null, packError: '' }));

  it('sem o aceite dos termos dos personagens, nada é baixado e a pessoa é avisada', async () => {
    await useVoicevoxStore.getState().downloadPack('0.vvm', false);
    const { download, packError } = useVoicevoxStore.getState();
    expect(download).toBeNull();
    expect(packError).toMatch(/termos/i);
  });

  it('com o aceite, não mostra erro de termos (e, sem o módulo nativo dos testes, não começa nada)', async () => {
    await useVoicevoxStore.getState().downloadPack('0.vvm', true);
    const { download, packError } = useVoicevoxStore.getState();
    expect(download).toBeNull();
    expect(packError).toBe('');
  });

  it('arquivo que não existe no catálogo é ignorado', async () => {
    await useVoicevoxStore.getState().downloadPack('999.vvm', true);
    expect(useVoicevoxStore.getState().packError).toBe('');
  });
});

describe('voz de cada papel', () => {
  const speakers = [
    { name: 'ずんだもん', styles: [{ id: 3, name: 'ノーマル' }] },
    { name: '四国めたん', styles: [{ id: 2, name: 'ノーマル' }] },
  ];

  it('o atendente usa a voz própria se ela está baixada; você usa a sua', () => {
    expect(styleForRole(speakers, 3, 2, 'staff')).toBe(2);
    expect(styleForRole(speakers, 3, 2, 'you')).toBe(3);
  });

  it('sem voz do atendente, ou com uma que não está baixada, volta para a voz de sempre', () => {
    expect(styleForRole(speakers, 3, null, 'staff')).toBe(3);
    expect(styleForRole(speakers, 3, 99, 'staff')).toBe(3);
  });
});
