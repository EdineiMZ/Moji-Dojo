import { VOCAB } from '@/content';
import { cardKey } from '@/features/vocab/cards';
import { createProgressStore, PROGRESS_STORAGE_KEY } from '@/store/progressStore';
import { BRAKE_GROWTH, brakeFor, leechGrowth, recordLeechCount, sanitizeLeechTrend } from './brake';
import { snapshotLeeches } from './useLeechTrend';
import { useProgressStore } from '@/store';

jest.mock('expo-sqlite/kv-store', () => ({ __esModule: true, default: { getItemSync: () => null, setItemSync: jest.fn(), removeItemSync: jest.fn() } }));

// Quarta, 21/10/2026, 10:00 (fuso local).
const NOW = new Date(2026, 9, 21, 10, 0);
const day = (offset: number): string => {
  const d = new Date(2026, 9, 21 + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(NOW);
});
afterEach(() => jest.useRealTimers());

describe('crescimento dos teimosos', () => {
  it('compara com o primeiro dia contado nos últimos 7 (sem contar hoje)', () => {
    const trend = { [day(-9)]: 0, [day(-6)]: 2, [day(-3)]: 3, [day(-1)]: 4 };
    expect(leechGrowth(trend, 5, NOW)).toEqual({ from: 2, growth: 3 }); // -9 fica fora da janela; vale o de -6
  });

  it('sem nenhuma contagem na janela não há como medir', () => {
    expect(leechGrowth({}, 9, NOW)).toBeNull();
    expect(leechGrowth({ [day(-8)]: 0, [day(0)]: 0 }, 9, NOW)).toBeNull(); // 8 dias atrás e hoje não contam
  });

  it('3 teimosos novos em 7 dias sugerem revisar; 2 não', () => {
    const trend = { [day(-5)]: 1 };
    expect(brakeFor({}, 1 + BRAKE_GROWTH - 1, NOW, trend)).toBeNull();
    const brake = brakeFor({}, 1 + BRAKE_GROWTH, NOW, trend);
    expect(brake?.reason).toBe('growth');
    expect(brake?.message).toContain('subiram de 1 para 4 na última semana');
    expect(brake?.message).toContain('revisar antes de começar uma lição nova');
  });

  it('crescer a partir de uma lista grande ainda é crescimento; o limite fixo (6) segue valendo sem histórico', () => {
    expect(brakeFor({}, 9, NOW, { [day(-2)]: 6 })?.reason).toBe('growth');
    expect(brakeFor({}, 6, NOW, {})?.reason).toBe('leeches');
    expect(brakeFor({}, 6, NOW, { [day(-2)]: 6 })?.reason).toBe('leeches'); // não cresceu, mas está grande
    expect(brakeFor({}, 3, NOW, { [day(-2)]: 3 })).toBeNull();
  });

  it('teimosos que diminuíram nunca freiam', () => {
    expect(leechGrowth({ [day(-3)]: 5 }, 2, NOW)).toEqual({ from: 5, growth: -3 });
    expect(brakeFor({}, 2, NOW, { [day(-3)]: 5 })).toBeNull();
  });

  it('o acerto baixo continua tendo prioridade sobre o crescimento', () => {
    const history = { [day(0)]: { answers: 30, correct: 10, learned: 0 } };
    expect(brakeFor(history, 9, NOW, { [day(-2)]: 1 })?.reason).toBe('accuracy');
  });

  it('a janela anda pelo calendário local, também na semana da troca do horário de verão', () => {
    jest.setSystemTime(new Date(2026, 10, 3, 0, 30)); // 3/11: a semana contém a troca de 1/11 nos EUA
    const now = new Date();
    const trend = { '2026-10-28': 2, '2026-11-02': 4 };
    expect(leechGrowth(trend, 6, now)).toEqual({ from: 2, growth: 4 });
  });
});

describe('contagem diária guardada', () => {
  it('a contagem do dia é a última; guarda só os 14 dias mais recentes', () => {
    let trend = recordLeechCount({}, '2026-10-21', 2);
    expect(recordLeechCount(trend, '2026-10-21', 2)).toBe(trend);
    trend = recordLeechCount(trend, '2026-10-21', 5);
    expect(trend).toEqual({ '2026-10-21': 5 });
    for (let i = 1; i <= 20; i++) trend = recordLeechCount(trend, day(i), i);
    expect(Object.keys(trend)).toHaveLength(14);
    expect(trend[day(1)]).toBeUndefined();
    expect(trend[day(20)]).toBe(20);
  });

  it('a leitura do disco descarta lixo', () => {
    expect(sanitizeLeechTrend(null)).toEqual({});
    expect(sanitizeLeechTrend([1, 2])).toEqual({});
    expect(sanitizeLeechTrend({ '2026-10-20': 3, '2026-10-21': -1, ontem: 2, '2026-10-19': 1.5, '2026-10-18': '4' })).toEqual({ '2026-10-20': 3 });
    const many = Object.fromEntries(Array.from({ length: 30 }, (_, i) => [day(-i), i]));
    expect(Object.keys(sanitizeLeechTrend(many))).toHaveLength(14);
  });

  it('snapshotLeeches conta palavras (não cartões) e guarda no dia de hoje', () => {
    const words = VOCAB.filter((w) => w.reading === w.jp).slice(0, 2);
    const vocab = Object.fromEntries(words.flatMap((w) => (['jm', 'mj', 'au'] as const).map((d) => [cardKey(w.id, d), { b: 1, due: NOW.getTime(), l: 5 }])));
    useProgressStore.setState({ srs: {}, vocab, conj: {}, particles: {}, leechTrend: {} });
    snapshotLeeches();
    expect(useProgressStore.getState().leechTrend).toEqual({ [day(0)]: 2 });
  });

  it('persiste no disco, volta ao abrir o app e é zerada ao reiniciar o progresso e ao importar um backup', () => {
    const data = new Map<string, string>();
    const storage = { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => void data.set(k, v), removeItem: (k: string) => void data.delete(k) };
    const store = createProgressStore(storage);
    store.getState().setLeechCount(day(-2), 3);
    expect(JSON.parse(data.get(PROGRESS_STORAGE_KEY) as string).state.leechTrend).toEqual({ [day(-2)]: 3 });
    expect(createProgressStore(storage).getState().leechTrend).toEqual({ [day(-2)]: 3 });

    store.getState().replaceProgress({ srs: {}, lessons: {}, stats: {}, days: [] });
    expect(store.getState().leechTrend).toEqual({});
    store.getState().setLeechCount(day(0), 1);
    store.getState().resetProgress();
    expect(store.getState().leechTrend).toEqual({});
  });
});
