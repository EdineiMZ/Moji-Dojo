import { LESSONS } from '@/data/lessons';
import { buildTodaySummary, scriptProgress } from '@/features/home/summary';
import { lessonStatus } from '@/features/lessons/trail';
import { DAY_MS } from '@/features/review/srs';
import { createProgressStore } from '@/store/progressStore';
import { parseBackup } from './backup';
import { describeCounts, ignoredNote } from './describe';

// Data fixa: 22/10/2026 às 10:00.
const NOW = new Date(2026, 9, 22, 10, 0, 0).getTime();

/** Código do formato antigo (NDJ1), exatamente como era gerado. */
const htmlCode = (store: unknown): string => 'NDJ1:' + btoa(unescape(encodeURIComponent(JSON.stringify(store))));

const memory = () => {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  };
};

/** Um progresso realista do formato antigo: 3 lições de hiragana, revisões em vários estados e 4 dias seguidos. */
function prototypeStore() {
  const hira = LESSONS.hira.slice(0, 3);
  const chars = hira.flatMap((l) => l.items);
  return {
    stats: Object.fromEntries(chars.map((c) => [c, { c: 3, w: 1 }])),
    draw: { あ: 90 },
    best: 12,
    script: 'hira',
    tab: 'aprender',
    srs: Object.fromEntries(
      chars.map((c, i) => [c, { b: (i % 5) + 1, due: i < 6 ? NOW - DAY_MS : NOW + (i % 4) * DAY_MS + 3_600_000 }]),
    ),
    lessons: Object.fromEntries(hira.map((l) => [l.id, true])),
    days: ['2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22'],
    introSeen: true,
  };
}

describe('importar o backup do formato antigo (NDJ1)', () => {
  it('o app passa a mostrar a trilha, as revisões vencidas e a sequência do backup', () => {
    const store = createProgressStore(memory());
    store.getState().completeLesson('kata:L0', ['ア'], false, NOW); // progresso anterior, que será substituído

    const parsed = parseBackup(htmlCode(prototypeStore()));
    if (!parsed.ok) throw new Error(`esperava sucesso, veio ${parsed.error}`);
    expect(describeCounts(parsed.summary)).toEqual([
      '3 lições concluídas',
      '15 caracteres na revisão',
      '15 caracteres com histórico de acertos',
      '4 dias de estudo',
    ]);
    expect(ignoredNote(parsed.summary.ignored)).toBe('');

    store.getState().replaceProgress(parsed.snapshot);
    const s = store.getState();

    // trilha: 3 feitas, a 4ª aberta, a 5ª bloqueada; a lição de katakana de antes sumiu
    expect([0, 1, 2, 3, 4].map((i) => lessonStatus('hira', i, s.lessons))).toEqual(['done', 'done', 'done', 'open', 'lock']);
    expect(lessonStatus('kata', 0, s.lessons)).toBe('open');

    // Início: 6 vencidas há mais de um dia + 2 que vencem hoje mais tarde (antes da virada das 4h, já contam), 4 dias seguidos,
    // próxima lição é a 4ª de hiragana
    const summary = buildTodaySummary(s, NOW);
    expect(summary.dueCount).toBe(8);
    expect(summary.streak).toBe(4);
    expect(summary.learnedCount).toBe(15);
    expect(summary.nextLesson).toMatchObject({ script: 'hira', index: 3 });
    expect(summary.upcoming?.count).toBeGreaterThan(0);
    expect(scriptProgress(s.srs).hira.learned).toBe(15);
  });

  it('o progresso importado continua salvo ao reabrir o app', () => {
    const storage = memory();
    const parsed = parseBackup(htmlCode(prototypeStore()));
    if (!parsed.ok) throw new Error('esperava sucesso');
    createProgressStore(storage).getState().replaceProgress(parsed.snapshot);

    const reopened = createProgressStore(storage).getState();
    expect(Object.keys(reopened.lessons)).toHaveLength(3);
    expect(Object.keys(reopened.srs)).toHaveLength(15);
    expect(reopened.days).toHaveLength(4);
  });

  it('um código inválido não altera nada do progresso atual', () => {
    const store = createProgressStore(memory());
    store.getState().completeLesson('hira:L0', ['あ'], false, NOW);
    const before = store.getState().lessons;

    const parsed = parseBackup('NDJ1:isto-nao-e-base64!');
    expect(parsed.ok).toBe(false);
    // quem chama só substitui quando ok === true: o estado fica como estava
    expect(store.getState().lessons).toBe(before);
  });

  it('itens que não existem mais são ignorados e contados', () => {
    const data = prototypeStore();
    const parsed = parseBackup(
      htmlCode({ ...data, srs: { ...data.srs, 𠮷: { b: 1, due: 1 } }, lessons: { ...data.lessons, 'hira:L99': true } }),
    );
    if (!parsed.ok) throw new Error('esperava sucesso');
    expect(parsed.summary.ignored).toBe(2);
    expect(ignoredNote(2)).toContain('2 itens do código foram ignorados');
  });
});

describe('datas absurdas no backup (relógio errado no aparelho de origem)', () => {
  const YEAR_MS = 365 * DAY_MS;
  const code = (entry: object, extra: object = {}) =>
    'MDJ1:' + btoa(unescape(encodeURIComponent(JSON.stringify({ v: 1, app: 'moji-dojo', srs: { あ: entry }, lessons: {}, stats: {}, days: [], ...extra }))));

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(NOW);
  });
  afterEach(() => jest.useRealTimers());

  it('vencimento a anos de distância é limitado a um ano mais um dia', () => {
    const result = parseBackup(code({ b: 6, due: NOW + 50 * YEAR_MS }));
    if (!result.ok) throw new Error('esperava sucesso');
    expect(result.snapshot.srs['あ']?.due).toBe(NOW + 366 * DAY_MS);
  });

  it('vencimento normal passa intacto, inclusive o de um cartão atrasado', () => {
    const ok = parseBackup(code({ b: 3, due: NOW + 10 * DAY_MS }));
    const late = parseBackup(code({ b: 1, due: NOW - 400 * DAY_MS }));
    if (!ok.ok || !late.ok) throw new Error('esperava sucesso');
    expect(ok.snapshot.srs['あ']?.due).toBe(NOW + 10 * DAY_MS);
    expect(late.snapshot.srs['あ']?.due).toBe(NOW - 400 * DAY_MS);
  });

  it('a última revisão no futuro vira agora (senão o tempo decorrido ficaria zerado e a estabilidade não cresceria)', () => {
    const result = parseBackup(code({ b: 3, due: NOW + DAY_MS, s: 8, d: 5, t: NOW + 30 * DAY_MS }));
    if (!result.ok) throw new Error('esperava sucesso');
    expect(result.snapshot.srs['あ']).toMatchObject({ s: 8, d: 5, t: NOW });
  });

  it('a última revisão no passado fica como está', () => {
    const result = parseBackup(code({ b: 3, due: NOW + DAY_MS, s: 8, d: 5, t: NOW - 5 * DAY_MS }));
    if (!result.ok) throw new Error('esperava sucesso');
    expect(result.snapshot.srs['あ']?.t).toBe(NOW - 5 * DAY_MS);
  });

  it('o mesmo vale para vocabulário e frases próprias', () => {
    const result = parseBackup(
      code(
        { b: 1, due: NOW },
        {
          vocab: { 'ねこ|jm': { b: 2, due: NOW + 99 * YEAR_MS } },
          myPhrases: { m1: { jp: 'わたしは ブラジルに すんでいます', pt: 'Eu moro no Brasil.', at: NOW, b: 2, due: NOW + 99 * YEAR_MS } },
        },
      ),
    );
    if (!result.ok) throw new Error('esperava sucesso');
    expect(result.extras?.vocab['ねこ|jm']?.due).toBe(NOW + 366 * DAY_MS);
    expect(result.extras?.myPhrases['m1']?.due).toBe(NOW + 366 * DAY_MS);
  });

  it('importar com a data absurda e abrir a revisão: o cartão aparece em no máximo um ano, não em décadas', () => {
    const result = parseBackup(code({ b: 6, due: NOW + 80 * YEAR_MS }));
    if (!result.ok) throw new Error('esperava sucesso');
    const store = createProgressStore(memory());
    store.getState().replaceProgress(result.snapshot);
    expect(Object.values(store.getState().srs).every((e) => e.due <= NOW + 366 * DAY_MS)).toBe(true);
  });
});
