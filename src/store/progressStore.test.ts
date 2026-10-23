import { parseBackup } from '@/features/backup/backup';
import { DAY_MS } from '@/features/review/srs';
import { createProgressStore, PROGRESS_STORAGE_KEY } from './progressStore';

// Data fixa: 22/10/2026 às 10:00 (fuso local).
const NOW = new Date(2026, 9, 22, 10, 0, 0).getTime();

/** Armazenamento em memória no lugar do SQLite. */
function memoryStorage() {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  };
}

beforeEach(() => jest.useFakeTimers({ now: NOW }));
afterEach(() => jest.useRealTimers());

describe('completeLesson', () => {
  it('conclui a lição, põe os caracteres na revisão e marca o dia', () => {
    const store = createProgressStore(memoryStorage());
    store.getState().completeLesson('hira:L0', ['あ', 'い']);
    const s = store.getState();
    expect(s.lessons).toEqual({ 'hira:L0': true });
    expect(s.srs['あ']).toEqual({ b: 1, due: NOW + DAY_MS });
    expect(s.days).toEqual(['2026-10-22']);
  });

  it('pelo "Já sei" os caracteres começam na caixa 2, com revisão em 3 dias', () => {
    const store = createProgressStore(memoryStorage());
    store.getState().completeLesson('hira:L0', ['あ'], true);
    expect(store.getState().srs['あ']).toEqual({ b: 2, due: NOW + 3 * DAY_MS });
  });

  it('refazer a lição não rebaixa o que já estava avançado', () => {
    const store = createProgressStore(memoryStorage());
    store.getState().replaceProgress({ srs: { あ: { b: 4, due: NOW + 14 * DAY_MS } }, lessons: {}, stats: {}, days: [] });
    store.getState().completeLesson('hira:L0', ['あ'], false);
    expect(store.getState().srs['あ']?.b).toBe(4);
  });
});

describe('recordAnswer', () => {
  it('acumula acertos e erros por caractere', () => {
    const store = createProgressStore(memoryStorage());
    const { recordAnswer } = store.getState();
    recordAnswer('あ', true);
    recordAnswer('あ', true);
    recordAnswer('あ', false);
    expect(store.getState().stats['あ']).toEqual({ c: 2, w: 1 });
  });
});

describe('recordReviewAnswer', () => {
  const withEntry = () => {
    const store = createProgressStore(memoryStorage());
    store.getState().replaceProgress({ srs: { あ: { b: 2, due: NOW - 1 } }, lessons: {}, stats: {}, days: [] });
    return store;
  };

  it('acerto de primeira sobe a caixa', () => {
    const store = withEntry();
    store.getState().recordReviewAnswer('あ', true, true, false);
    expect(store.getState().srs['あ']).toEqual({ b: 3, due: NOW + 7 * DAY_MS });
  });

  it('erro volta à caixa 1 e fica vencido agora', () => {
    const store = withEntry();
    store.getState().recordReviewAnswer('あ', false, true, false);
    expect(store.getState().srs['あ']).toEqual({ b: 1, due: NOW });
  });

  it('acerto numa repetição vence amanhã', () => {
    const store = withEntry();
    store.getState().recordReviewAnswer('あ', true, false, false);
    expect(store.getState().srs['あ']).toEqual({ b: 1, due: NOW + DAY_MS });
  });

  it('na revisão extra, acertar de primeira não reagenda, mas conta nas estatísticas', () => {
    const store = withEntry();
    store.getState().recordReviewAnswer('あ', true, true, true);
    expect(store.getState().srs['あ']).toEqual({ b: 2, due: NOW - 1 });
    expect(store.getState().stats['あ']).toEqual({ c: 1, w: 0 });
  });

  it('caractere fora da revisão não ganha entrada de SRS', () => {
    const store = withEntry();
    store.getState().recordReviewAnswer('い', true, true, false);
    expect(store.getState().srs['い']).toBeUndefined();
  });
});

describe('histórico por dia (painel de evolução)', () => {
  it('cada resposta soma respostas e acertos no dia de hoje (relógio congelado)', () => {
    const store = createProgressStore(memoryStorage());
    store.getState().recordAnswer('あ', true);
    store.getState().recordAnswer('あ', false);
    store.getState().recordReviewAnswer('い', true, true, false);
    expect(store.getState().history).toEqual({ '2026-10-22': { answers: 3, correct: 2, learned: 0 } });
  });

  it('concluir uma lição conta só os caracteres que ainda não estavam na revisão', () => {
    const store = createProgressStore(memoryStorage());
    store.getState().completeLesson('hira:L0', ['あ', 'い', 'う']);
    expect(store.getState().history['2026-10-22']?.learned).toBe(3);
    store.getState().completeLesson('hira:L0', ['あ', 'い', 'う', 'え']); // refazer: só え é novo
    expect(store.getState().history['2026-10-22']?.learned).toBe(4);
  });

  it('fica salvo ao reabrir; importar backup e zerar o progresso o limpam', () => {
    const storage = memoryStorage();
    const store = createProgressStore(storage);
    store.getState().recordAnswer('あ', true);
    expect(createProgressStore(storage).getState().history).toEqual(store.getState().history);

    store.getState().replaceProgress({ srs: {}, lessons: {}, stats: {}, days: [] });
    expect(store.getState().history).toEqual({});

    store.getState().recordAnswer('あ', true);
    store.getState().resetProgress();
    expect(store.getState().history).toEqual({});
  });
});

describe('rateShadow (Repetir)', () => {
  it('guarda a autoavaliação da frase, marca o dia e permite mudar de ideia', () => {
    const store = createProgressStore(memoryStorage());
    store.getState().rateShadow('こんにちは', 'mid');
    expect(store.getState().shadow).toEqual({ こんにちは: 'mid' });
    expect(store.getState().days).toEqual(['2026-10-22']);
    store.getState().rateShadow('こんにちは', 'ok');
    expect(store.getState().shadow['こんにちは']).toBe('ok');
  });

  it('fica salva ao reabrir; zerar o progresso apaga; importar backup não mexe', () => {
    const storage = memoryStorage();
    const store = createProgressStore(storage);
    store.getState().rateShadow('はい / いいえ', 'bad');
    expect(createProgressStore(storage).getState().shadow).toEqual({ 'はい / いいえ': 'bad' });

    store.getState().replaceProgress({ srs: {}, lessons: {}, stats: {}, days: [] });
    expect(store.getState().shadow).toEqual({ 'はい / いいえ': 'bad' });

    store.getState().resetProgress();
    expect(store.getState().shadow).toEqual({});
    expect(createProgressStore(storage).getState().shadow).toEqual({});
  });
});

describe('completeChallenge (Teclado)', () => {
  it('guarda o desafio feito, marca o dia e fica salvo; zerar apaga; importar backup não mexe', () => {
    const storage = memoryStorage();
    const store = createProgressStore(storage);
    store.getState().completeChallenge('ねこ');
    expect(store.getState().challenges).toEqual({ ねこ: true });
    expect(store.getState().days).toEqual(['2026-10-22']);
    expect(createProgressStore(storage).getState().challenges).toEqual({ ねこ: true });

    store.getState().replaceProgress({ srs: {}, lessons: {}, stats: {}, days: [] });
    expect(store.getState().challenges).toEqual({ ねこ: true });

    store.getState().resetProgress();
    expect(store.getState().challenges).toEqual({});
  });
});

describe('markStudied', () => {
  it('marca o dia de hoje uma única vez e mantém o streak', () => {
    const store = createProgressStore(memoryStorage());
    store.getState().markStudied();
    store.getState().markStudied();
    expect(store.getState().days).toEqual(['2026-10-22']);
  });
});

describe('importação de backup', () => {
  it('replaceProgress troca todo o progresso pelo do backup', () => {
    const store = createProgressStore(memoryStorage());
    store.getState().completeLesson('kata:L0', ['ア']);
    const code = 'NDJ1:' + btoa(unescape(encodeURIComponent(JSON.stringify({
      srs: { あ: { b: 3, due: 5 } }, lessons: { 'hira:L0': true }, stats: { あ: { c: 2, w: 0 } }, days: ['2026-10-01'],
    }))));
    const parsed = parseBackup(code);
    if (!parsed.ok) throw new Error('esperava sucesso');
    store.getState().replaceProgress(parsed.snapshot);
    const s = store.getState();
    expect(s.lessons).toEqual({ 'hira:L0': true }); // a lição de katakana sumiu
    expect(s.srs).toEqual({ あ: { b: 3, due: 5 } });
    expect(s.days).toEqual(['2026-10-01']);
  });
});

describe('persistência', () => {
  it('salva só os dados (nunca as funções) e restaura num novo store', () => {
    const storage = memoryStorage();
    const first = createProgressStore(storage);
    first.getState().completeLesson('hira:L0', ['あ', 'い']);
    first.getState().recordAnswer('あ', true);

    const saved = JSON.parse(storage.data.get(PROGRESS_STORAGE_KEY) ?? '{}');
    expect(Object.keys(saved.state).sort()).toEqual(['challenges', 'conj', 'days', 'history', 'journey', 'lessons', 'mastered', 'myPhrases', 'particles', 'shadow', 'srs', 'stats', 'vocab', 'wordNotes']);

    const second = createProgressStore(storage);
    expect(second.persist.hasHydrated()).toBe(true);
    expect(second.getState().lessons).toEqual({ 'hira:L0': true });
    expect(second.getState().stats['あ']).toEqual({ c: 1, w: 0 });
    expect(typeof second.getState().completeLesson).toBe('function');
  });

  it('resetProgress zera tudo, inclusive o que está salvo', () => {
    const storage = memoryStorage();
    const store = createProgressStore(storage);
    store.getState().completeLesson('hira:L0', ['あ']);
    store.getState().resetProgress();
    expect(store.getState().lessons).toEqual({});
    expect(createProgressStore(storage).getState().lessons).toEqual({});
  });
});

describe('jornada no progresso', () => {
  const memory = () => {
    const data = new Map<string, string>();
    return {
      getItem: (k: string) => data.get(k) ?? null,
      setItem: (k: string, v: string) => void data.set(k, v),
      removeItem: (k: string) => void data.delete(k),
    };
  };

  it('comprar e vestir pelo store, com o motivo quando não dá', () => {
    const store = createProgressStore(memory());
    expect(store.getState().buyJourneyItem('boina')).toBe('poor');
    store.getState().updateJourney((j) => ({ ...j, petals: 500 }));
    expect(store.getState().buyJourneyItem('boina', Date.now())).toBeNull();
    expect(store.getState().journey.petals).toBe(400);
    expect(store.getState().journey.equipped.head).toBe('boina');
    store.getState().unequipJourneySlot('head');
    expect(store.getState().journey.equipped).toEqual({});
    store.getState().equipJourneyItem('boina');
    expect(store.getState().journey.equipped.head).toBe('boina');
  });

  it('o reset zera a jornada', () => {
    const store = createProgressStore(memory());
    store.getState().updateJourney((j) => ({ ...j, petals: 99 }));
    store.getState().resetProgress();
    expect(store.getState().journey.petals).toBe(0);
  });

  it('um estado salvo por uma versão antiga (sem jornada) abre com a jornada vazia', () => {
    const storage = memory();
    storage.setItem('moji-dojo-progress', JSON.stringify({ state: { srs: {}, lessons: {}, stats: {}, days: ['2026-10-01'] }, version: 1 }));
    const store = createProgressStore(storage);
    expect(store.getState().journey.petals).toBe(0);
    expect(store.getState().days).toEqual(['2026-10-01']);
  });
});
