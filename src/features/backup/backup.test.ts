import { BACKUP_PREFIX, parseBackup } from './backup';

/**
 * Gera o código do formato antigo (NDJ1) exatamente como ele era gerado:
 * btoa(unescape(encodeURIComponent(JSON.stringify(store)))).
 */
const htmlCode = (store: unknown): string => BACKUP_PREFIX + btoa(unescape(encodeURIComponent(JSON.stringify(store))));

/** Código a partir de texto qualquer (não necessariamente JSON). */
const htmlText = (text: string): string => BACKUP_PREFIX + btoa(unescape(encodeURIComponent(text)));

/** Código a partir de bytes crus, para forjar UTF-8 inválido. */
const rawCode = (bytes: number[]): string => BACKUP_PREFIX + btoa(String.fromCharCode(...bytes));

const htmlStore = {
  stats: { あ: { c: 3, w: 1 }, 水: { c: 1, w: 0 } },
  draw: { あ: 80 },
  best: 5,
  script: 'hira',
  tab: 'aprender',
  srs: { あ: { b: 2, due: 1_700_000_000_000 }, い: { b: 1, due: 1_700_000_100_000 }, 水: { b: 4, due: 1_700_000_200_000 } },
  lessons: { 'hira:L0': true, 'kanji:L0': true },
  days: ['2026-10-21', '2026-10-20', '2026-10-21'],
  introSeen: true,
  note: '🌸 caractere de 4 bytes em UTF-8',
};

describe('parseBackup: código gerado pelo HTML', () => {
  it('importa srs, lessons, stats e days e resume o conteúdo', () => {
    const result = parseBackup(htmlCode(htmlStore));
    if (!result.ok) throw new Error(`esperava sucesso, veio ${result.error}`);
    expect(result.summary).toEqual({ lessons: 2, reviews: 3, characters: 2, days: 2, ignored: 0 });
    expect(result.snapshot.lessons).toEqual({ 'hira:L0': true, 'kanji:L0': true });
    expect(result.snapshot.srs['あ']).toEqual({ b: 2, due: 1_700_000_000_000 });
    expect(result.snapshot.stats['水']).toEqual({ c: 1, w: 0 });
    // dias: sem repetição e em ordem
    expect(result.snapshot.days).toEqual(['2026-10-20', '2026-10-21']);
  });

  it('ignora os campos que não são progresso (draw, best, script...)', () => {
    const result = parseBackup(htmlCode(htmlStore));
    if (!result.ok) throw new Error('esperava sucesso');
    expect(Object.keys(result.snapshot).sort()).toEqual(['days', 'lessons', 'srs', 'stats']);
  });

  it('aceita o código com espaços e quebras de linha (colado de uma nota)', () => {
    const code = htmlCode(htmlStore);
    const messy = ` ${code.slice(0, 20)}\n${code.slice(20, 60)}  \r\n${code.slice(60)}\n`;
    expect(parseBackup(messy).ok).toBe(true);
  });

  it('só um dos campos já basta (ex.: backup só com stats)', () => {
    const result = parseBackup(htmlCode({ stats: { あ: { c: 1, w: 0 } } }));
    expect(result).toMatchObject({ ok: true, summary: { lessons: 0, reviews: 0, characters: 1, days: 0 } });
  });
});

describe('parseBackup: limpeza dos dados', () => {
  it('descarta o que não existe neste app e conta como ignorado', () => {
    const result = parseBackup(
      htmlCode({
        srs: { あ: { b: 2, due: 10 }, Z: { b: 1, due: 10 }, い: { b: 'x', due: 10 }, う: 'quebrado' },
        lessons: { 'hira:L0': true, 'hira:L99': true, 'kata:L0': false },
        stats: { あ: { c: 1, w: 0 }, Z: { c: 1, w: 1 }, い: { c: -1, w: 0 } },
        days: ['2026-10-20', 'ontem', 20261021, '2026-1-2'],
      }),
    );
    if (!result.ok) throw new Error('esperava sucesso');
    expect(result.summary).toEqual({ lessons: 1, reviews: 1, characters: 1, days: 1, ignored: 10 });
    expect(Object.keys(result.snapshot.srs)).toEqual(['あ']);
  });

  it('mantém a caixa do SRS entre 1 e 6', () => {
    const result = parseBackup(htmlCode({ srs: { あ: { b: 99, due: 1 }, い: { b: 0, due: 1 }, う: { b: 2.6, due: 1 } } }));
    if (!result.ok) throw new Error('esperava sucesso');
    expect(result.snapshot.srs['あ']?.b).toBe(6);
    expect(result.snapshot.srs['い']?.b).toBe(1);
    expect(result.snapshot.srs['う']?.b).toBe(3);
  });

  it('guarda no máximo os 400 dias mais recentes', () => {
    const days = Array.from({ length: 450 }, (_, i) => `2025-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`);
    const result = parseBackup(htmlCode({ days: [...days, '2026-10-22'] }));
    if (!result.ok) throw new Error('esperava sucesso');
    expect(result.snapshot.days.length).toBeLessThanOrEqual(400);
    expect(result.snapshot.days.at(-1)).toBe('2026-10-22');
  });
});

describe('parseBackup: erros', () => {
  const errorOf = (code: string) => {
    const r = parseBackup(code);
    return r.ok ? 'ok' : r.error;
  };

  it('texto sem o prefixo NDJ1: → format', () => {
    expect(errorOf('')).toBe('format');
    expect(errorOf('olá')).toBe('format');
    expect(errorOf('NDJ2:abcd')).toBe('format');
  });

  it('base64 inválido ou cortado → encoding', () => {
    expect(errorOf('NDJ1:')).toBe('encoding');
    expect(errorOf('NDJ1:!!!!')).toBe('encoding');
    expect(errorOf(htmlCode(htmlStore).slice(0, -3))).toBe('encoding');
  });

  it('UTF-8 inválido → encoding', () => {
    expect(errorOf(rawCode([0xff, 0xfe, 0xfd, 0x00]))).toBe('encoding');
    expect(errorOf(rawCode([0xe3, 0x81, 0x00, 0x00]))).toBe('encoding'); // sequência truncada
  });

  it('não é JSON → json', () => {
    expect(errorOf(htmlText('isto não é json'))).toBe('json');
  });

  it('JSON sem a forma de backup → data', () => {
    expect(errorOf(htmlCode([1, 2, 3]))).toBe('data');
    expect(errorOf(htmlCode(42))).toBe('data');
    expect(errorOf(htmlCode(null))).toBe('data');
    expect(errorOf(htmlCode({ foo: 'bar' }))).toBe('data');
    expect(errorOf(htmlCode({ srs: [] }))).toBe('data');
    expect(errorOf(htmlCode({ days: 'hoje' }))).toBe('data');
  });

  it('backup sem nenhum progresso → empty (não apaga o que existe à toa)', () => {
    expect(errorOf(htmlCode({ stats: {}, srs: {}, lessons: {}, days: [] }))).toBe('empty');
    expect(errorOf(htmlCode({ srs: { Z: { b: 1, due: 1 } } }))).toBe('empty');
  });
});

describe('parseBackup: memória do FSRS', () => {
  const withMemory = (entry: Record<string, unknown>) => {
    const result = parseBackup(htmlCode({ ...htmlStore, srs: { あ: { b: 3, due: 1_700_000_000_000, ...entry } } }));
    if (!result.ok) throw new Error(`esperava sucesso, veio ${result.error}`);
    return result.snapshot.srs['あ'];
  };

  it('guarda estabilidade, dificuldade e a última revisão quando são plausíveis', () => {
    expect(withMemory({ s: 12.5, d: 4.2, t: 1_699_000_000_000 })).toEqual({ b: 3, due: 1_700_000_000_000, s: 12.5, d: 4.2, t: 1_699_000_000_000 });
  });

  it('descarta a memória inteira se algum valor é absurdo, e o cartão volta ao agendamento pela caixa', () => {
    expect(withMemory({ s: -1, d: 4, t: 5 })).toEqual({ b: 3, due: 1_700_000_000_000 });
    expect(withMemory({ s: 5, d: 99, t: 5 })).toEqual({ b: 3, due: 1_700_000_000_000 });
    expect(withMemory({ s: 5, d: 4 })).toEqual({ b: 3, due: 1_700_000_000_000 });
    expect(withMemory({ s: 'x', d: 4, t: 5 })).toEqual({ b: 3, due: 1_700_000_000_000 });
  });
});
