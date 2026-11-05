import { addAttempt, makeAttempt, MAX_ATTEMPTS, sanitizeAttempts, summarizeByKind, type Attempt } from './attempts';

const NOW = new Date(2026, 10, 5, 10, 0, 0).getTime();
const at = (over: Partial<Attempt> = {}): Attempt => ({ c: 'い', k: 'k2r', ok: true, t: NOW, ...over });

describe('makeAttempt', () => {
  it('guarda só o necessário numa escolha', () => {
    expect(makeAttempt({ char: 'い', direction: 'r2k', ok: false })).toEqual({ c: 'い', k: 'r2k', ok: false });
  });

  it('no desenho guarda a nota arredondada e o corte', () => {
    expect(makeAttempt({ char: 'い', direction: 'write', ok: false, score: 48.6, need: 50 })).toEqual({ c: 'い', k: 'write', ok: false, n: 49, p: 50 });
  });

  it('não guarda o corte sem nota (desistência)', () => {
    expect(makeAttempt({ char: 'い', direction: 'write', ok: false, need: 50, gaveUp: true })).toEqual({ c: 'い', k: 'write', ok: false, g: 1 });
  });

  it('marca repetição e dica', () => {
    expect(makeAttempt({ char: 'い', direction: 'write', ok: true, retry: true, hinted: true, score: 90, need: 60 })).toEqual({ c: 'い', k: 'write', ok: true, r: 1, n: 90, p: 60, h: 1 });
  });
});

describe('addAttempt', () => {
  it('acrescenta no fim sem alterar a lista original', () => {
    const list = [at()];
    const next = addAttempt(list, at({ ok: false }));
    expect(next).toHaveLength(2);
    expect(list).toHaveLength(1);
  });

  it('guarda só as mais recentes', () => {
    let list: Attempt[] = [];
    for (let k = 0; k < MAX_ATTEMPTS + 25; k++) list = addAttempt(list, at({ t: k }));
    expect(list).toHaveLength(MAX_ATTEMPTS);
    expect(list[0]!.t).toBe(25);
    expect(list[list.length - 1]!.t).toBe(MAX_ATTEMPTS + 24);
  });
});

describe('sanitizeAttempts', () => {
  it('aceita o que ela mesma gera', () => {
    const list = [at(), at({ k: 'write', ok: false, n: 40, p: 50, r: 1, h: 1, g: 1 })];
    expect(sanitizeAttempts(JSON.parse(JSON.stringify(list)))).toEqual(list);
  });

  it('descarta lixo e mantém o que presta', () => {
    const raw = [at(), null, 'x', { c: '', k: 'k2r', ok: true, t: 1 }, { c: 'あ', k: 'foo', ok: true, t: 1 }, { c: 'あ', k: 'k2r', ok: 'sim', t: 1 }, { c: 'あ', k: 'k2r', ok: true, t: NaN }, { c: 'あ', k: 'write', ok: true, t: 1, n: 'alto' }];
    const out = sanitizeAttempts(raw);
    expect(out).toHaveLength(2);
    expect(out[1]).toEqual({ c: 'あ', k: 'write', ok: true, t: 1 });
  });

  it('não-lista vira lista vazia', () => {
    expect(sanitizeAttempts(undefined)).toEqual([]);
    expect(sanitizeAttempts({})).toEqual([]);
  });

  it('respeita o limite', () => {
    expect(sanitizeAttempts(Array.from({ length: MAX_ATTEMPTS + 10 }, (_, k) => at({ t: k })))).toHaveLength(MAX_ATTEMPTS);
  });
});

describe('summarizeByKind', () => {
  it('separa acertos e erros por tipo e tira a média das notas, ignorando as repetições', () => {
    const list = [
      at({ k: 'k2r' }),
      at({ k: 'k2r' }),
      at({ k: 'r2k', ok: false }),
      at({ k: 'write', ok: false, n: 40, p: 50 }),
      at({ k: 'write', ok: false, n: 20, p: 50, r: 1 }), // repetição: não conta
      at({ k: 'write', ok: true, n: 80, p: 50 }),
      at({ c: 'お', k: 'write', ok: false, n: 5 }), // outro caractere
    ];
    expect(summarizeByKind(list, 'い')).toEqual({
      k2r: { right: 2, wrong: 0 },
      r2k: { right: 0, wrong: 1 },
      write: { right: 1, wrong: 1, avgScore: 60 },
    });
  });
});
