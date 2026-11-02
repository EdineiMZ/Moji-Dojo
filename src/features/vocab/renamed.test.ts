import { findWord, VOCAB } from '@/content';
import { RENAMED_WORDS as APP_RENAMES } from '@/content/renamedWords';
import { DAY_MS, type SrsState } from '@/features/review/srs';
import { exportBackup, parseBackup } from '@/features/backup/backup';
import { createProgressStore, PROGRESS_STORAGE_KEY } from '@/store/progressStore';
import { cardKey, learnedWordIds, parseCardKey } from './cards';
import { currentWordId, migrateVocabCards, migrateWordNotes } from './renamed';

// Sem @types/node no projeto: tipos mínimos do que o teste usa.
const scripts = require('../../../scripts/vocabFixes.cjs') as {
  FIXES: Record<string, { jp?: string; reading?: string }>;
  RENAMED_WORDS: Record<string, string>;
  applyFix: <T extends { jp: string; reading: string }>(w: T) => T;
  undoFix: (jp: string) => string;
};

// Data fixa: 22/10/2026 às 10:00 (fuso local).
const NOW = new Date(2026, 9, 22, 10, 0, 0);

const memoryStorage = () => {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  };
};

/** Um progresso que o backup aceita (um backup totalmente vazio é recusado). */
const withProgress = () => {
  const store = createProgressStore(memoryStorage());
  store.getState().completeLesson('hira:L0', ['あ'], false, NOW.getTime());
  return store.getState();
};

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(NOW);
});
afterEach(() => jest.useRealTimers());

describe('correções das listas (auditoria de 2026-11-01)', () => {
  it('o espelho do app confere com o do gerador', () => {
    expect(APP_RENAMES).toEqual(scripts.RENAMED_WORDS);
  });

  it('as palavras corrigidas estão com a escrita e a leitura do JMdict, e as velhas sumiram', () => {
    const want = (jp: string, reading: string) => {
      const w = findWord(jp);
      expect(w?.reading).toBe(reading);
    };
    want('伯父さん', 'おじさん');
    want('お金持ち', 'おかねもち');
    want('堅い', 'かたい');
    want('摩る', 'さする');
    want('田んぼ', 'たんぼ');
    for (const old of ['伯父', '堅', '摩する', '田ぼ']) expect(findWord(old)).toBeUndefined();
    expect(findWord('お金持ち')?.reading).not.toBe('かねもち');
  });

  it('cada palavra renomeada continua sendo uma só (sem duplicata do id novo)', () => {
    for (const to of Object.values(APP_RENAMES)) expect(VOCAB.filter((w) => w.id === to)).toHaveLength(1);
  });

  it('applyFix só mexe no que está na lista e undoFix volta ao nome da lista', () => {
    expect(scripts.applyFix({ jp: '堅', reading: 'かたい' })).toEqual({ jp: '堅い', reading: 'かたい' });
    expect(scripts.applyFix({ jp: '犬', reading: 'いぬ' })).toEqual({ jp: '犬', reading: 'いぬ' });
    expect(scripts.undoFix('堅い')).toBe('堅');
    expect(scripts.undoFix('犬')).toBe('犬');
  });
});

describe('migração do progresso das palavras renomeadas', () => {
  it('currentWordId: renomeada vira o id novo, o resto fica igual', () => {
    expect(currentWordId('伯父')).toBe('伯父さん');
    expect(currentWordId('犬')).toBe('犬');
    expect(currentWordId('constructor')).toBe('constructor');
  });

  it('os cartões passam para o id novo, com as datas e o agendamento intactos', () => {
    const due = NOW.getTime() + 3 * DAY_MS;
    const vocab: SrsState = { '伯父|jm': { b: 3, due, l: 1, s: 8, d: 5, t: NOW.getTime() - DAY_MS }, '犬|jm': { b: 1, due } };
    const next = migrateVocabCards(vocab);
    expect(Object.keys(next).sort()).toEqual(['伯父さん|jm', '犬|jm'].sort());
    expect(next['伯父さん|jm']).toEqual(vocab['伯父|jm']);
    expect(parseCardKey('伯父さん|jm')?.word.id).toBe('伯父さん');
    expect(learnedWordIds(next).has('伯父さん')).toBe(true);
  });

  it('nada para migrar: devolve o mesmo objeto', () => {
    const vocab: SrsState = { '犬|jm': { b: 1, due: 1 } };
    expect(migrateVocabCards(vocab)).toBe(vocab);
  });

  it('se as duas formas já tinham cartão, fica o revisado mais recentemente', () => {
    const old = { b: 4, due: 10, s: 20, d: 5, t: NOW.getTime() - 10 * DAY_MS };
    const fresh = { b: 2, due: 20, s: 3, d: 6, t: NOW.getTime() - DAY_MS };
    expect(migrateVocabCards({ '堅|mj': old, '堅い|mj': fresh })['堅い|mj']).toEqual(fresh);
    expect(migrateVocabCards({ '堅|mj': fresh, '堅い|mj': old })['堅い|mj']).toEqual(fresh);
    expect(Object.keys(migrateVocabCards({ '堅|mj': old, '堅い|mj': fresh }))).toEqual(['堅い|mj']);
  });

  it('cartões de leitura (rd) e de ouvido também migram', () => {
    const next = migrateVocabCards({ [cardKey('田ぼ', 'rd')]: { b: 2, due: 1 } });
    expect(Object.keys(next)).toEqual(['田んぼ|rd']);
  });

  it('historinhas: passam para o id novo; se a nova já existe, vale a nova', () => {
    expect(migrateWordNotes({ 摩する: 'minha' })).toEqual({ 摩る: 'minha' });
    expect(migrateWordNotes({ 摩する: 'velha', 摩る: 'nova' })).toEqual({ 摩る: 'nova' });
    expect(migrateWordNotes({ 摩る: 'nova', 摩する: 'velha' })).toEqual({ 摩る: 'nova' });
    const same = { 犬: 'x' };
    expect(migrateWordNotes(same)).toBe(same);
  });

  it('ao abrir o app, o progresso salvo com o id antigo é migrado', () => {
    const storage = memoryStorage();
    const due = NOW.getTime() + DAY_MS;
    storage.data.set(
      PROGRESS_STORAGE_KEY,
      JSON.stringify({ state: { vocab: { '伯父|jm': { b: 2, due } }, wordNotes: { 伯父: 'tio mais velho' } }, version: 1 }),
    );
    const store = createProgressStore(storage);
    expect(store.getState().vocab['伯父さん|jm']).toEqual({ b: 2, due });
    expect(store.getState().vocab['伯父|jm']).toBeUndefined();
    expect(store.getState().wordNotes['伯父さん']).toBe('tio mais velho');
    // e a próxima gravação já sai no id novo
    store.getState().setWordNote('伯父さん', 'tio mais velho!');
    const saved = JSON.parse(storage.data.get(PROGRESS_STORAGE_KEY) as string);
    expect(Object.keys(saved.state.vocab)).toEqual(['伯父さん|jm']);
  });

  it('importar um backup antigo (MDJ1) com o id antigo migra os cartões e as historinhas', () => {
    const due = NOW.getTime() + 2 * DAY_MS;
    const base = withProgress();
    const code = exportBackup({ ...base, vocab: { '堅|jm': { b: 2, due }, '犬|jm': { b: 1, due } }, wordNotes: { 堅: 'duro' } }, NOW);
    const result = parseBackup(code);
    if (!result.ok) throw new Error(`esperava sucesso, veio ${result.error}`);
    expect(Object.keys(result.extras?.vocab ?? {}).sort()).toEqual(['堅い|jm', '犬|jm'].sort());
    expect(result.extras?.vocab['堅い|jm']).toEqual({ b: 2, due });
    expect(result.extras?.wordNotes).toEqual({ 堅い: 'duro' });
    expect(result.summary.words).toBe(2);
  });

  it('backup com as duas formas da mesma palavra: fica o cartão revisado mais recentemente', () => {
    const now = NOW.getTime();
    const base = withProgress();
    const old = { b: 4, due: now + 9 * DAY_MS, s: 20, d: 5, t: now - 10 * DAY_MS };
    const fresh = { b: 2, due: now + DAY_MS, s: 3, d: 6, t: now - DAY_MS };
    const result = parseBackup(exportBackup({ ...base, vocab: { '堅|jm': old, '堅い|jm': fresh } }, NOW));
    if (!result.ok) throw new Error('esperava sucesso');
    expect(Object.keys(result.extras?.vocab ?? {})).toEqual(['堅い|jm']);
    expect(result.extras?.vocab['堅い|jm']?.t).toBe(fresh.t);
  });

  it('restaurar o backup num store deixa as palavras corrigidas como estudadas', () => {
    const due = NOW.getTime() + DAY_MS;
    const base = withProgress();
    const result = parseBackup(exportBackup({ ...base, vocab: { '田ぼ|jm': { b: 2, due } } }, NOW));
    if (!result.ok || !result.extras) throw new Error('esperava sucesso');
    const store = createProgressStore(memoryStorage());
    store.getState().replaceProgress(result.snapshot, result.extras);
    expect(learnedWordIds(store.getState().vocab).has('田んぼ')).toBe(true);
  });
});
