import { exportBackup, parseBackup } from '@/features/backup/backup';
import { createProgressStore } from '@/store/progressStore';
import { checkPhrase, duePhrases, MAX_MY_PHRASES, MAX_PHRASE_LENGTH, newestFirst, newPhraseId, type MyPhrases } from './phrases';

const memoryStorage = () => {
  const data = new Map<string, string>();
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  };
};
const NOW = 1_800_000_000_000;
const DAY = 86_400_000;

describe('checkPhrase', () => {
  const existing: MyPhrases = { a: { jp: 'わたしは ねこが すきです', pt: 'Eu gosto de gatos.', at: 1, b: 1, due: 1 } };

  it('aceita uma frase com letras japonesas e uma tradução', () => {
    expect(checkPhrase('すしを たべます', 'Eu como sushi.', existing)).toBeNull();
    expect(checkPhrase('私は猫が好きです', 'Eu gosto de gatos.', {})).toBeNull();
  });

  it.each([
    ['', 'x', 'empty-jp'],
    ['  ', 'x', 'empty-jp'],
    ['すし', '', 'empty-pt'],
    ['sushi', 'sushi', 'not-japanese'],
    ['あ'.repeat(MAX_PHRASE_LENGTH + 1), 'x', 'too-long'],
    ['すし', 'x'.repeat(MAX_PHRASE_LENGTH + 1), 'too-long'],
  ])('recusa %j / %j', (jp, pt, problem) => {
    expect(checkPhrase(jp, pt, existing)).toBe(problem);
  });

  it('recusa a mesma frase (ignorando espaços, pontuação e katakana)', () => {
    expect(checkPhrase('わたしはねこがすきです。', 'outra', existing)).toBe('duplicate');
    expect(checkPhrase('ワタシハ ネコガ スキデス', 'outra', existing)).toBe('duplicate');
    // Ao editar a própria frase, ela não conta como repetida.
    expect(checkPhrase('わたしは ねこが すきです', 'Eu gosto de gatos!', existing, 'a')).toBeNull();
  });

  it('recusa quando chega ao limite', () => {
    const full: MyPhrases = Object.fromEntries(
      Array.from({ length: MAX_MY_PHRASES }, (_, i) => [`p${i}`, { jp: `あ${'い'.repeat(i)}`, pt: 'x', at: i, b: 1, due: i }]),
    );
    expect(checkPhrase('うえお', 'x', full)).toBe('full');
  });
});

describe('ids e ordem', () => {
  it('o id não repete, mesmo no mesmo instante', () => {
    const a = newPhraseId({}, NOW);
    const b = newPhraseId({ [a]: { jp: 'あ', pt: 'a', at: NOW, b: 1, due: NOW } }, NOW);
    expect(a).not.toBe(b);
  });

  it('vencidas: da mais atrasada à menos; todas: da mais nova à mais antiga', () => {
    const phrases: MyPhrases = {
      a: { jp: 'あ', pt: 'a', at: 1, b: 1, due: NOW - 5 },
      b: { jp: 'い', pt: 'b', at: 3, b: 2, due: NOW - 10 },
      c: { jp: 'う', pt: 'c', at: 2, b: 3, due: NOW + 1 },
    };
    expect(duePhrases(phrases, NOW)).toEqual(['b', 'a']);
    expect(newestFirst(phrases).map(([id]) => id)).toEqual(['b', 'c', 'a']);
  });
});

describe('frases próprias no progresso', () => {
  it('salvar cria a frase vencida e marca o dia; repetir é recusado', () => {
    const store = createProgressStore(memoryStorage());
    const result = store.getState().addMyPhrase('  わたしは がくせいです ', ' Eu sou estudante. ', NOW);
    expect('id' in result).toBe(true);
    const id = 'id' in result ? result.id : '';
    expect(store.getState().myPhrases[id]).toEqual({ jp: 'わたしは がくせいです', pt: 'Eu sou estudante.', at: NOW, b: 1, due: NOW });
    expect(store.getState().days).toHaveLength(1);
    expect(store.getState().addMyPhrase('わたしはがくせいです', 'de novo', NOW)).toEqual({ error: 'duplicate' });
    expect(Object.keys(store.getState().myPhrases)).toHaveLength(1);
  });

  it('editar troca o texto e mantém a revisão; apagar remove', () => {
    const store = createProgressStore(memoryStorage());
    const added = store.getState().addMyPhrase('すしを たべます', 'Eu como sushi.', NOW);
    const id = 'id' in added ? added.id : '';
    store.getState().recordMyPhraseAnswer(id, true, true, NOW);
    const before = store.getState().myPhrases[id];
    expect(store.getState().updateMyPhrase(id, 'すしを たべました', 'Eu comi sushi.')).toBeNull();
    expect(store.getState().myPhrases[id]).toMatchObject({ jp: 'すしを たべました', pt: 'Eu comi sushi.', b: before?.b, due: before?.due });
    expect(store.getState().updateMyPhrase(id, '', 'x')).toBe('empty-jp');
    store.getState().removeMyPhrase(id);
    expect(store.getState().myPhrases).toEqual({});
  });

  it('acertar de primeira sobe a caixa e agenda; errar volta para a caixa 1', () => {
    const store = createProgressStore(memoryStorage());
    const added = store.getState().addMyPhrase('すしを たべます', 'Eu como sushi.', NOW);
    const id = 'id' in added ? added.id : '';
    store.getState().recordMyPhraseAnswer(id, true, true, NOW);
    expect(store.getState().myPhrases[id]).toMatchObject({ b: 2, due: NOW + 3 * DAY });
    store.getState().recordMyPhraseAnswer(id, false, true, NOW);
    expect(store.getState().myPhrases[id]).toMatchObject({ b: 1, due: NOW });
    expect(store.getState().history).not.toEqual({});
    store.getState().recordMyPhraseAnswer('nao-existe', true, true, NOW);
    expect(Object.keys(store.getState().myPhrases)).toEqual([id]);
  });

  it('o reset apaga as frases próprias', () => {
    const store = createProgressStore(memoryStorage());
    store.getState().addMyPhrase('すし', 'sushi', NOW);
    store.getState().resetProgress();
    expect(store.getState().myPhrases).toEqual({});
  });

  it('o backup leva as frases e descarta as inválidas na volta', () => {
    const store = createProgressStore(memoryStorage());
    store.getState().completeLesson('hira:L0', ['あ'], false, NOW);
    store.getState().addMyPhrase('すしを たべます', 'Eu como sushi.', NOW);
    const parsed = parseBackup(exportBackup(store.getState(), new Date(NOW)));
    if (!parsed.ok) throw new Error('esperava sucesso');
    expect(Object.values(parsed.extras?.myPhrases ?? {}).map((p) => p.jp)).toEqual(['すしを たべます']);
    expect(parsed.summary.phrases).toBe(1);

    const payload = {
      v: 1,
      srs: { あ: { b: 1, due: 1 } },
      myPhrases: { ok: { jp: 'あ', pt: 'a', at: 1, b: 1, due: 1 }, bad: { jp: '', pt: 'a', at: 1, b: 1, due: 1 }, worse: 'x' },
    };
    const code = 'MDJ1:' + btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    const result = parseBackup(code);
    if (!result.ok) throw new Error('esperava sucesso');
    expect(Object.keys(result.extras?.myPhrases ?? {})).toEqual(['ok']);
    expect(result.summary.ignored).toBe(2);
  });
});
