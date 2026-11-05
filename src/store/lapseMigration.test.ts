import { DAY_MS } from '@/features/review/srs';
import { SMOOTHED_MAX_DIFFICULTY, SMOOTHED_MIN_STABILITY } from '@/features/review/lapseReset';
import { createProgressStore, PRE_LAPSE_FIX_BACKUP_KEY, PROGRESS_STORAGE_KEY } from './progressStore';

// Data fixa: 5/11/2026 às 10:00 (fuso local).
const NOW = new Date(2026, 10, 5, 10, 0, 0).getTime();

function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map<string, string>(Object.entries(initial));
  return {
    data,
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string): void => {
      data.set(k, v);
    },
    removeItem: (k: string): void => {
      data.delete(k);
    },
  };
}

/** O progresso salvo pela v1, com os números inflados do backup real (い: 40 erros, l=42, d=9,89, s=0,1). */
const v1State = () => ({
  srs: {
    い: { b: 1, due: NOW, l: 42, s: 0.1, d: 9.889508071968493, t: NOW - DAY_MS },
    お: { b: 1, due: NOW, l: 15, s: 0.8517259717803227, d: 9.942842932763842, t: NOW - DAY_MS },
    き: { b: 3, due: NOW + 7 * DAY_MS, l: 1, s: 8, d: 4.2, t: NOW - DAY_MS },
    に: { b: 1, due: NOW + DAY_MS },
    ほ: { b: 2, due: NOW + 3 * DAY_MS, l: 2 }, // agendamento antigo: sem s/d
  },
  lessons: { 'hira:L0': { first: 5, total: 5 } },
  stats: { い: { c: 13, w: 40 }, お: { c: 14, w: 15 } },
  days: ['2026-10-31', '2026-11-04'],
  vocab: { 'w1:jp2m': { b: 1, due: NOW, l: 7, s: 0.2, d: 9.5, t: NOW - DAY_MS } },
  conj: { 'v1:te': { b: 1, due: NOW, l: 5 } },
  particles: { は: { b: 2, due: NOW, l: 4, s: 3, d: 6, t: NOW - DAY_MS } },
  history: { '2026-11-04': { answers: 20, correct: 8 } },
  leechTrend: { '2026-11-03': 6, '2026-11-04': 9 },
});

const savedV1 = (state: object = v1State()) => JSON.stringify({ state, version: 1 });
const hydrate = (storage: ReturnType<typeof memoryStorage>) => createProgressStore(storage);

beforeEach(() => jest.useFakeTimers({ now: NOW }));
afterEach(() => jest.useRealTimers());

describe('migração v1 → v2: esquecimentos inflados', () => {
  it('zera o l de srs, vocabulário, conjugação e partículas', () => {
    const s = hydrate(memoryStorage({ [PROGRESS_STORAGE_KEY]: savedV1() })).getState();
    for (const entry of [...Object.values(s.srs), ...Object.values(s.vocab), ...Object.values(s.conj), ...Object.values(s.particles)]) {
      expect(entry.l).toBeUndefined();
    }
  });

  it('mantém acertos e erros, caixa, vencimento, lições, dias e histórico', () => {
    const s = hydrate(memoryStorage({ [PROGRESS_STORAGE_KEY]: savedV1() })).getState();
    expect(s.stats['い']).toEqual({ c: 13, w: 40 });
    expect(s.stats['お']).toEqual({ c: 14, w: 15 });
    expect(s.srs['き']).toMatchObject({ b: 3, due: NOW + 7 * DAY_MS, s: 8, d: 4.2 });
    expect(s.srs['に']).toEqual({ b: 1, due: NOW + DAY_MS });
    expect(s.srs['ほ']).toEqual({ b: 2, due: NOW + 3 * DAY_MS });
    expect(s.lessons).toEqual({ 'hira:L0': { first: 5, total: 5 } });
    expect(s.days).toEqual(['2026-10-31', '2026-11-04']);
    expect(s.history['2026-11-04']).toEqual({ answers: 20, correct: 8 });
  });

  it('suaviza a dificuldade e a estabilidade esmagadas, sem mexer no que estava normal', () => {
    const s = hydrate(memoryStorage({ [PROGRESS_STORAGE_KEY]: savedV1() })).getState();
    expect(s.srs['い']!.d).toBe(SMOOTHED_MAX_DIFFICULTY);
    expect(s.srs['い']!.s).toBe(SMOOTHED_MIN_STABILITY);
    expect(s.srs['お']!.d).toBe(SMOOTHED_MAX_DIFFICULTY);
    expect(s.srs['お']!.s).toBeCloseTo(0.8517, 3); // já acima do piso
    expect(s.vocab['w1:jp2m']!.d).toBe(SMOOTHED_MAX_DIFFICULTY);
    expect(s.srs['き']).toMatchObject({ s: 8, d: 4.2 });
    expect(s.particles['は']).toMatchObject({ s: 3, d: 6 });
  });

  it('o ranking de teimosos recomeça: ninguém é teimoso com l zerado e o freio recomeça a contagem', () => {
    const s = hydrate(memoryStorage({ [PROGRESS_STORAGE_KEY]: savedV1() })).getState();
    expect(Object.values(s.srs).some((e) => (e.l ?? 0) > 0)).toBe(false);
    expect(s.leechTrend).toEqual({});
  });

  it('guarda uma cópia exata do estado antigo antes de alterar', () => {
    const storage = memoryStorage({ [PROGRESS_STORAGE_KEY]: savedV1() });
    hydrate(storage);
    const backup = JSON.parse(storage.data.get(PRE_LAPSE_FIX_BACKUP_KEY)!);
    expect(backup.version).toBe(1);
    expect(backup.backedUpAt).toBe(NOW);
    expect(backup.state).toEqual(v1State());
    expect(backup.state.srs['い'].l).toBe(42);
  });

  it('a cópia pode ser devolvida à chave principal para desfazer', () => {
    const storage = memoryStorage({ [PROGRESS_STORAGE_KEY]: savedV1() });
    hydrate(storage);
    const { state, version } = JSON.parse(storage.data.get(PRE_LAPSE_FIX_BACKUP_KEY)!);
    expect(JSON.parse(JSON.stringify({ state, version }))).toEqual({ state: v1State(), version: 1 });
  });

  it('roda uma vez só: a v2 não é migrada de novo nem refaz a cópia', () => {
    const storage = memoryStorage({ [PROGRESS_STORAGE_KEY]: savedV1() });
    const first = hydrate(storage);
    first.getState().recordReviewAnswer('い', false, true, false); // volta a ter l=1
    const backupBefore = storage.data.get(PRE_LAPSE_FIX_BACKUP_KEY);
    expect(JSON.parse(storage.data.get(PROGRESS_STORAGE_KEY)!).version).toBe(2);

    const second = hydrate(storage).getState();
    expect(second.srs['い']!.l).toBe(1);
    expect(storage.data.get(PRE_LAPSE_FIX_BACKUP_KEY)).toBe(backupBefore);
  });

  it('não sobrescreve uma cópia que já existe', () => {
    const storage = memoryStorage({ [PROGRESS_STORAGE_KEY]: savedV1(), [PRE_LAPSE_FIX_BACKUP_KEY]: 'cópia anterior' });
    hydrate(storage);
    expect(storage.data.get(PRE_LAPSE_FIX_BACKUP_KEY)).toBe('cópia anterior');
  });

  it('se a cópia não puder ser gravada, o progresso não é alterado', () => {
    const storage = memoryStorage({ [PROGRESS_STORAGE_KEY]: savedV1() });
    const failing = {
      ...storage,
      setItem: (k: string, v: string): void => {
        if (k === PRE_LAPSE_FIX_BACKUP_KEY) throw new Error('disco cheio');
        storage.setItem(k, v);
      },
    };
    const s = hydrate(failing).getState();
    expect(s.srs['い']).toMatchObject({ l: 42, d: 9.889508071968493 });
    expect(s.stats['い']).toEqual({ c: 13, w: 40 });
  });

  it('instalação nova (nada salvo) não cria cópia nem migra', () => {
    const storage = memoryStorage();
    const s = hydrate(storage).getState();
    expect(s.srs).toEqual({});
    expect(storage.data.has(PRE_LAPSE_FIX_BACKUP_KEY)).toBe(false);
  });

  it('depois da migração, um erro novo conta um esquecimento só, mesmo com várias tentativas', () => {
    const store = hydrate(memoryStorage({ [PROGRESS_STORAGE_KEY]: savedV1() }));
    const { recordReviewAnswer } = store.getState();
    recordReviewAnswer('い', false, true, false); // 1ª resposta do dia: esquecimento
    recordReviewAnswer('い', false, false, false); // repetição errada
    recordReviewAnswer('い', false, false, false); // repetição errada
    recordReviewAnswer('い', true, false, false); // acerto na repetição
    const entry = store.getState().srs['い']!;
    expect(entry.l).toBe(1);
    expect(entry.d).toBeGreaterThan(SMOOTHED_MAX_DIFFICULTY - 1); // subiu uma vez só a partir do valor suavizado
    expect(entry.d).toBeLessThan(10);
    expect(entry.due).toBeGreaterThanOrEqual(NOW + DAY_MS);
  });
});
