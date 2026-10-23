import { createProgressStore, type ProgressState } from '@/store/progressStore';
import { APP_BACKUP_PREFIX, APP_BACKUP_VERSION, exportBackup, parseBackup } from './backup';

const memoryStorage = () => {
  const data = new Map<string, string>();
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  };
};

const NOW = new Date(2026, 9, 22, 12);

const progress = {
  srs: { あ: { b: 3, due: 1_800_000_000_000 }, 水: { b: 1, due: 1_800_000_100_000 } },
  lessons: { 'hira:L0': true as const },
  stats: { あ: { c: 5, w: 1 }, 水: { c: 2, w: 0 } },
  days: ['2026-10-20', '2026-10-21'],
  history: { '2026-10-21': { answers: 10, correct: 8, learned: 2 } },
  shadow: { こんにちは: 'ok' as const, ありがとう: 'mid' as const },
  challenges: { ねこ: true as const },
  vocab: { 'ねこ|jm': { b: 2, due: 1_800_000_200_000 } },
  conj: { '食べる|te': { b: 3, due: 1_800_000_300_000 } },
  particles: { を: { b: 2, due: 1_800_000_400_000 } },
  wordNotes: { 学校: 'がっこう = escola; 学 (estudar) + 校 (escola)' },
  mastered: { g4: 1_800_000_400_000 },
  myPhrases: { m1: { jp: 'わたしは ブラジルに すんでいます', pt: 'Eu moro no Brasil.', at: 1_800_000_500_000, b: 2, due: 1_800_000_600_000 } },
};

/** Código MDJ1 a partir de um objeto qualquer (para forjar versões e dados inválidos). */
const mdj = (payload: unknown) =>
  APP_BACKUP_PREFIX + btoa(unescape(encodeURIComponent(JSON.stringify(payload))));

describe('exportBackup', () => {
  it('gera um código MDJ1: que o parseBackup lê de volta, sem perder nada', () => {
    const code = exportBackup(progress, NOW);
    expect(code.startsWith('MDJ1:')).toBe(true);
    const result = parseBackup(code);
    if (!result.ok) throw new Error(`esperava sucesso, veio ${result.error}`);
    expect(result.source).toBe('app');
    expect(result.snapshot).toEqual({ srs: progress.srs, lessons: progress.lessons, stats: progress.stats, days: progress.days });
    expect(result.extras).toEqual({ history: progress.history, shadow: progress.shadow, challenges: progress.challenges, vocab: progress.vocab, conj: progress.conj, particles: progress.particles, wordNotes: progress.wordNotes, mastered: progress.mastered, myPhrases: progress.myPhrases });
    expect(result.summary).toEqual({ lessons: 1, reviews: 2, characters: 2, days: 2, ignored: 0, words: 1, phrases: 1 });
  });

  it('preserva japonês, acentos e caracteres de 4 bytes (emoji) nas frases', () => {
    const phrase = 'お願いします 🌸 coração';
    const result = parseBackup(exportBackup({ ...progress, shadow: { [phrase]: 'bad' } }, NOW));
    if (!result.ok) throw new Error('esperava sucesso');
    expect(result.extras?.shadow).toEqual({ [phrase]: 'bad' });
  });

  it('é só ASCII (base64): pode ser colado em qualquer nota ou mensagem', () => {
    expect(exportBackup(progress, NOW)).toMatch(/^MDJ1:[A-Za-z0-9+/]+={0,2}$/);
  });

  it('aceita o código com quebras de linha e espaços (como vem de uma mensagem)', () => {
    const code = exportBackup(progress, NOW);
    const messy = `${code.slice(0, 30)}\n${code.slice(30, 90)}  \r\n${code.slice(90)}\n`;
    expect(parseBackup(messy).ok).toBe(true);
  });

  it('dá o mesmo resultado ao exportar de um store real e importar em outro', () => {
    const a = createProgressStore(memoryStorage());
    a.getState().completeLesson('hira:L0', ['あ', 'い'], false, NOW.getTime());
    a.getState().recordAnswer('あ', true, NOW.getTime());
    a.getState().rateShadow('こんにちは', 'ok', NOW.getTime());
    a.getState().completeChallenge('ねこ', NOW.getTime());

    const code = exportBackup(a.getState(), NOW);
    const parsed = parseBackup(code);
    if (!parsed.ok) throw new Error('esperava sucesso');

    const b = createProgressStore(memoryStorage());
    b.getState().replaceProgress(parsed.snapshot, parsed.extras);
    const keep = ({ srs, lessons, stats, days, history, shadow, challenges, vocab, conj, particles, wordNotes, mastered, myPhrases }: ProgressState) => ({ srs, lessons, stats, days, history, shadow, challenges, vocab, conj, particles, wordNotes, mastered, myPhrases });
    expect(keep(b.getState())).toEqual(keep(a.getState()));
  });
});

describe('parseBackup: backup do app (MDJ1)', () => {
  const errorOf = (code: string) => {
    const r = parseBackup(code);
    return r.ok ? 'ok' : r.error;
  };

  it('sem o campo de versão → data', () => {
    expect(errorOf(mdj({ srs: { あ: { b: 1, due: 1 } } }))).toBe('data');
  });

  it('versão mais nova que a deste app → version', () => {
    expect(errorOf(mdj({ v: APP_BACKUP_VERSION + 1, srs: { あ: { b: 1, due: 1 } } }))).toBe('version');
  });

  it('descarta o que não tem a forma certa nos extras e conta como ignorado', () => {
    const result = parseBackup(
      mdj({
        v: 1,
        stats: { あ: { c: 1, w: 0 } },
        history: { '2026-10-21': { answers: 3, correct: 2, learned: 1 }, ontem: { answers: 1, correct: 1, learned: 0 }, '2026-10-20': { answers: -1, correct: 0, learned: 0 } },
        shadow: { a: 'ok', b: 'otimo', c: 7 },
        challenges: { ねこ: true, いぬ: false },
      }),
    );
    if (!result.ok) throw new Error('esperava sucesso');
    expect(result.extras).toEqual({
      history: { '2026-10-21': { answers: 3, correct: 2, learned: 1 } },
      shadow: { a: 'ok' },
      challenges: { ねこ: true },
      vocab: {},
      conj: {},
      particles: {},
      wordNotes: {},
      mastered: {},
      myPhrases: {},
    });
    expect(result.summary.ignored).toBe(5);
  });

  it('guarda no máximo 400 dias de histórico, os mais recentes', () => {
    const history: Record<string, unknown> = {};
    for (let i = 0; i < 450; i++) {
      const d = new Date(Date.UTC(2025, 0, 1 + i));
      history[d.toISOString().slice(0, 10)] = { answers: 1, correct: 1, learned: 0 };
    }
    const result = parseBackup(mdj({ v: 1, days: ['2026-10-22'], history }));
    if (!result.ok) throw new Error('esperava sucesso');
    const kept = Object.keys(result.extras?.history ?? {});
    expect(kept).toHaveLength(400);
    expect(kept.at(-1)).toBe(Object.keys(history).sort().at(-1));
  });

  it('o backup do protótipo (NDJ1) continua sem extras', () => {
    const code = 'NDJ1:' + btoa(unescape(encodeURIComponent(JSON.stringify({ stats: { あ: { c: 1, w: 0 } } }))));
    const result = parseBackup(code);
    if (!result.ok) throw new Error('esperava sucesso');
    expect(result.source).toBe('prototype');
    expect(result.extras).toBeUndefined();
  });
});

describe('replaceProgress com extras', () => {
  it('sem extras (protótipo) mantém autoavaliação e desafios e zera o histórico', () => {
    const store = createProgressStore(memoryStorage());
    store.getState().rateShadow('こんにちは', 'ok', NOW.getTime());
    store.getState().completeChallenge('ねこ', NOW.getTime());
    store.getState().recordAnswer('あ', true, NOW.getTime());
    store.getState().replaceProgress({ srs: {}, lessons: {}, stats: {}, days: [] });
    expect(store.getState().shadow).toEqual({ こんにちは: 'ok' });
    expect(store.getState().challenges).toEqual({ ねこ: true });
    expect(store.getState().history).toEqual({});
  });

  it('com extras (app) troca tudo', () => {
    const store = createProgressStore(memoryStorage());
    store.getState().rateShadow('antiga', 'bad', NOW.getTime());
    store.getState().replaceProgress(
      { srs: {}, lessons: {}, stats: {}, days: [] },
      { history: progress.history, shadow: progress.shadow, challenges: progress.challenges, vocab: progress.vocab, conj: progress.conj, particles: progress.particles, wordNotes: progress.wordNotes, mastered: progress.mastered, myPhrases: progress.myPhrases },
    );
    expect(store.getState().shadow).toEqual(progress.shadow);
    expect(store.getState().challenges).toEqual(progress.challenges);
    expect(store.getState().history).toEqual(progress.history);
    expect(store.getState().vocab).toEqual(progress.vocab);
    expect(store.getState().conj).toEqual(progress.conj);
    expect(store.getState().particles).toEqual(progress.particles);
    expect(store.getState().wordNotes).toEqual(progress.wordNotes);
    expect(store.getState().mastered).toEqual(progress.mastered);
    expect(store.getState().myPhrases).toEqual(progress.myPhrases);
  });
});

describe('backup dos tópicos dominados', () => {
  it('ignora tópicos que não existem e valores inválidos', () => {
    const result = parseBackup(mdj({ v: 1, srs: { あ: { b: 1, due: 1 } }, mastered: { g4: 123, g99: 5, g5: 'x', g6: -1 } }));
    if (!result.ok) throw new Error('esperava sucesso');
    expect(result.extras?.mastered).toEqual({ g4: 123 });
    expect(result.summary.ignored).toBe(3);
  });
});
