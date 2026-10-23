import { conjugate, VERB_FORMS } from './conjugate';
import { cardKeysFor, conjCounts, dueCards, learnedVerbIds, newVerbs, parseCardKey } from './cards';
import { buildConjugationQuestion, buildConjugationQuestions, buildFormOptions, questionCardKey } from './questions';
import { findVerb, VERBS } from './verbs';

const verb = (id: string) => {
  const v = findVerb(id);
  if (!v) throw new Error(`verbo ${id} não existe`);
  return v;
};

describe('buildFormOptions', () => {
  it('sempre tem 4 alternativas diferentes, uma só certa', () => {
    for (const v of VERBS) {
      for (const form of VERB_FORMS) {
        const options = buildFormOptions(v, form);
        expect(options).toHaveLength(4);
        expect(new Set(options).size).toBe(4);
        expect(options.filter((o) => o === conjugate(v.word.jp, v.spec, form))).toHaveLength(1);
      }
    }
  });

  it('inclui respostas de regra errada (飲む no て: 飲いて, 飲って...)', () => {
    const options = new Set<string>();
    for (let i = 0; i < 40; i++) buildFormOptions(verb('飲む'), 'te').forEach((o) => options.add(o));
    expect(options.has('飲んで')).toBe(true);
    expect([...options].some((o) => o === '飲って' || o === '飲いて' || o === '飲して')).toBe(true);
  });
});

describe('buildConjugationQuestion', () => {
  it('pergunta a forma e guarda o cartão e a leitura', () => {
    const q = buildConjugationQuestion(verb('食べる'), 'nai');
    expect(q.item.char).toBe('食べない');
    expect(q.item.label).toContain('食べる');
    expect(q.item.label).toContain('ない');
    expect(q.item.script === 'pair' && q.item.reading).toBe('たべない');
    expect(questionCardKey(q)).toBe('食べる|nai');
    expect(q.options.map((o) => o.char)).toContain('食べない');
  });
});

describe('buildConjugationQuestions', () => {
  it('ignora chaves que não existem e não repete o verbo em seguida', () => {
    const keys = [...cardKeysFor(verb('飲む')), ...cardKeysFor(verb('食べる')), 'inexistente|te', '飲む|xx'];
    const questions = buildConjugationQuestions(keys);
    expect(questions).toHaveLength(8);
    for (let i = 1; i < questions.length; i++) {
      const [a, b] = [questions[i - 1], questions[i]].map((q) => (q ? (questionCardKey(q) ?? '').split('|')[0] : ''));
      expect(a).not.toBe(b);
    }
  });
});

describe('cartões', () => {
  it('lê e valida a chave', () => {
    expect(parseCardKey('飲む|te')?.form).toBe('te');
    expect(parseCardKey('飲む|zz')).toBeNull();
    expect(parseCardKey('xx|te')).toBeNull();
  });

  it('conta verbos aprendidos, novos e vencidos', () => {
    const now = 1_000;
    const conj = { '飲む|te': { b: 1, due: now }, '食べる|ta': { b: 3, due: now + 5_000 } };
    expect([...learnedVerbIds(conj)].sort()).toEqual(['食べる', '飲む'].sort());
    expect(dueCards(conj, now)).toEqual(['飲む|te']);
    expect(newVerbs(conj).some((v) => v.word.id === '飲む')).toBe(false);
    expect(conjCounts(conj, now)).toEqual({ learned: 2, total: VERBS.length, due: 1 });
  });
});

describe('progresso da conjugação', () => {
  // Importado aqui embaixo para o teste de cartões acima não depender do store.
  const { createProgressStore } = jest.requireActual('@/store/progressStore') as typeof import('@/store/progressStore');
  const memoryStorage = () => {
    const data = new Map<string, string>();
    return {
      getItem: (k: string) => data.get(k) ?? null,
      setItem: (k: string, v: string) => void data.set(k, v),
      removeItem: (k: string) => void data.delete(k),
    };
  };
  const NOW = 1_800_000_000_000;

  it('aprender um verbo cria um cartão por forma, vencido agora', () => {
    const store = createProgressStore(memoryStorage());
    store.getState().learnVerbs(['飲む', 'inexistente'], NOW);
    expect(Object.keys(store.getState().conj).sort()).toEqual(['飲む|masu', '飲む|nai', '飲む|ta', '飲む|te'].sort());
    expect(store.getState().conj['飲む|te']).toEqual({ b: 1, due: NOW });
  });

  it('acertar de primeira sobe a caixa; errar volta para a 1; marca o dia', () => {
    const store = createProgressStore(memoryStorage());
    store.getState().learnVerbs(['飲む'], NOW);
    store.getState().recordConjAnswer('飲む|te', true, true, NOW);
    expect(store.getState().conj['飲む|te']?.b).toBe(2);
    store.getState().recordConjAnswer('飲む|te', false, true, NOW);
    expect(store.getState().conj['飲む|te']).toEqual({ b: 1, due: NOW });
    expect(store.getState().days).toHaveLength(1);
    expect(store.getState().history).not.toEqual({});
  });

  it('responder um cartão que não existe não cria nada', () => {
    const store = createProgressStore(memoryStorage());
    store.getState().recordConjAnswer('飲む|te', true, true, NOW);
    expect(store.getState().conj).toEqual({});
  });

  it('o reset zera a conjugação', () => {
    const store = createProgressStore(memoryStorage());
    store.getState().learnVerbs(['飲む'], NOW);
    store.getState().resetProgress();
    expect(store.getState().conj).toEqual({});
  });
});
