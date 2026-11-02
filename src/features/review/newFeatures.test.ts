import { LOOKALIKES, lookalikesOf } from '@/features/chart/lookalikes';
import { ALL_ITEMS, getItem } from '@/features/catalog';
import { STROKES } from '@/data/strokes';
import { buildEarQuestions, buildLessonQuestions, buildOptions, buildReviewQuestions, isStudyItem, type Rng } from '@/features/quiz/quiz';
import { flattenPath } from '@/features/strokes/svgPath';
import { scoreWriting } from '@/features/writing/score';
import { WORDS_IN_REVIEW, withWordQuestions } from './readWords';
import { assistFor, guessDrawn } from '@/features/writing/assist';
import { createProgressStore } from '@/store/progressStore';
import { addConfusion, buildConfusedQuestions, confusedPairs, sanitizeConfusions, type Confusions } from './confusions';
import { BRAKE_LEECHES, BRAKE_MIN_ANSWERS, brakeFor, recentAccuracy } from './brake';

const seeded = (seed: number): Rng => {
  let s = seed;
  return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
};

const memory = () => {
  const data = new Map<string, string>();
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  };
};

// Data fixa: 22/10/2026 às 10:00.
const NOW = new Date(2026, 9, 22, 10, 0, 0);

describe('alternativas parecidas (item 5)', () => {
  it('さ, ち e き formam sósias', () => {
    expect(lookalikesOf('さ')).toEqual(expect.arrayContaining(['ち', 'き']));
    expect(lookalikesOf('ち')).toContain('さ');
    expect(lookalikesOf('あ')).toContain('お');
    expect(lookalikesOf('ん')).toEqual([]);
    expect(LOOKALIKES.every((g) => g.chars.length >= 2)).toBe(true);
  });

  it('com o pool que tem os sósias, eles entram nas alternativas', () => {
    const pool = ALL_ITEMS.filter((x) => x.script === 'hira');
    for (let seed = 1; seed <= 20; seed++) {
      const chars = buildOptions(getItem('さ'), pool, seeded(seed)).map((o) => o.char);
      expect(chars).toContain('さ');
      // os dois sósias (ち e き) são os primeiros distratores
      expect(chars).toEqual(expect.arrayContaining(['ち', 'き']));
    }
  });

  it('sósias que a pessoa ainda não conhece não entram (fora do pool e de `known`)', () => {
    const pool = ['さ', 'か', 'た', 'な'].map(getItem);
    for (let seed = 1; seed <= 20; seed++) {
      const chars = buildOptions(getItem('さ'), pool, seeded(seed)).map((o) => o.char);
      expect(chars).not.toContain('ち');
      expect(chars).not.toContain('き');
    }
  });

  it('na revisão, os sósias que ela já conhece entram mesmo fora do grupo', () => {
    const known = new Set(['さ', 'ち', 'き']);
    for (let seed = 1; seed <= 20; seed++) {
      const qs = buildReviewQuestions(['さ'], seeded(seed), { known });
      const q = qs[0]!;
      const chars = q.options.map((o) => o.char);
      expect(chars).toEqual(expect.arrayContaining(['さ', 'ち', 'き']));
      expect(new Set(q.options.map((o) => o.label)).size).toBe(4);
    }
  });
});

describe('confusões e mnemônicos no store (itens 1 e 3)', () => {
  it('recordConfusion soma e persiste o que foi trocado pelo quê; igual e não-kana são ignorados', () => {
    const store = createProgressStore(memory());
    store.getState().recordConfusion('さ', 'ち');
    store.getState().recordConfusion('さ', 'ち');
    store.getState().recordConfusion('さ', 'さ');
    store.getState().recordConfusion('水', 'さ');
    expect(store.getState().confusions).toEqual({ さ: { ち: 2 } });
  });

  it('setCharNote guarda a historinha própria, apaga com texto vazio e recusa texto longo ou caractere desconhecido', () => {
    const store = createProgressStore(memory());
    expect(store.getState().setCharNote('さ', '  O sabre do samurai  ')).toBe(true);
    expect(store.getState().charNotes).toEqual({ さ: 'O sabre do samurai' });
    expect(store.getState().setCharNote('さ', 'x'.repeat(201))).toBe(false);
    expect(store.getState().setCharNote('Z', 'oi')).toBe(false);
    expect(store.getState().charNotes).toEqual({ さ: 'O sabre do samurai' });
    expect(store.getState().setCharNote('さ', '   ')).toBe(true);
    expect(store.getState().charNotes).toEqual({});
  });

  it('resetProgress zera confusões e mnemônicos', () => {
    const store = createProgressStore(memory());
    store.getState().recordConfusion('さ', 'ち');
    store.getState().setCharNote('さ', 'sabre');
    store.getState().resetProgress();
    expect(store.getState().confusions).toEqual({});
    expect(store.getState().charNotes).toEqual({});
  });
});

describe('rodinhas do desenho (item 2)', () => {
  it('caixa 1 (ou sem caixa) traça por cima, caixa 2 mostra o primeiro traço, caixa 3+ é de memória', () => {
    expect(assistFor(undefined)).toBe('trace');
    expect(assistFor(0)).toBe('trace');
    expect(assistFor(1)).toBe('trace');
    expect(assistFor(2)).toBe('first');
    expect(assistFor(3)).toBe('memory');
    expect(assistFor(7)).toBe('memory');
  });
});

describe('freio quando o acerto cai (item 6)', () => {
  const day = (answers: number, correct: number) => ({ answers, correct, learned: 0 });
  const history = {
    '2026-10-22': day(10, 4),
    '2026-10-21': day(10, 5),
    '2026-10-19': day(100, 0), // fora da janela de 3 dias
  };

  it('soma os últimos 3 dias (hoje incluído) e ignora os mais antigos', () => {
    expect(recentAccuracy(history, NOW)).toEqual({ pct: 45, answers: 20 });
    expect(recentAccuracy({}, NOW)).toBeNull();
  });

  it('sugere revisar quando o acerto recente fica abaixo de 60% (com respostas suficientes)', () => {
    const brake = brakeFor(history, 0, NOW);
    expect(brake?.reason).toBe('accuracy');
    expect(brake?.message).toContain('45%');
  });

  it('com poucas respostas ou acerto bom, não freia', () => {
    expect(brakeFor({ '2026-10-22': day(BRAKE_MIN_ANSWERS - 1, 0) }, 0, NOW)).toBeNull();
    expect(brakeFor({ '2026-10-22': day(30, 24) }, 0, NOW)).toBeNull();
    expect(brakeFor({}, 0, NOW)).toBeNull();
  });

  it('sugere revisar quando os teimosos passam do limite, mesmo com bom acerto', () => {
    const good = { '2026-10-22': day(30, 28) };
    expect(brakeFor(good, BRAKE_LEECHES - 1, NOW)).toBeNull();
    expect(brakeFor(good, BRAKE_LEECHES, NOW)?.reason).toBe('leeches');
  });
});

describe('o que foi desenhado errado vira confusão (item 1)', () => {
  const perfect = (char: string) => STROKES[char]!.p.map(flattenPath);
  const scribble = [[[5, 5], [20, 8], [10, 25], [30, 30]]] as unknown as ReturnType<typeof perfect>;

  it('pediu さ e desenhou um ち certinho: acha o ち', () => {
    const own = scoreWriting(STROKES['さ']!, perfect('ち')).pct;
    expect(own).toBeLessThan(70);
    expect(guessDrawn('さ', perfect('ち'), own, 70)).toBe('ち');
  });

  it('um rabisco não lembra nenhum outro kana: nada é anotado', () => {
    const own = scoreWriting(STROKES['さ']!, scribble).pct;
    expect(guessDrawn('さ', scribble, own, 70)).toBeNull();
    expect(guessDrawn('さ', [], 0, 70)).toBeNull();
  });

  it('só vale para kana (kanji não tem lista de confusões)', () => {
    expect(guessDrawn('水', perfect('あ'), 0, 70)).toBeNull();
  });
});

describe('palavras dentro da revisão normal (item 4)', () => {
  const hira = [...'あいうえおかきくけこさしすせそたちつてとなにぬねの'];
  const known = new Set(hira);
  const base = hira.slice(0, 8).map((c) => ({ item: getItem(c), direction: 'k2r' as const, options: [], retry: false }));

  it('mistura até 3 palavras entre as perguntas de kana, sem tirar nenhuma', () => {
    const out = withWordQuestions(base, known, seeded(3));
    expect(out).toHaveLength(base.length + WORDS_IN_REVIEW);
    expect(out.filter((q) => !isStudyItem(q.item))).toHaveLength(WORDS_IN_REVIEW);
    for (const q of base) expect(out).toContain(q);
  });

  it('com poucos kana conhecidos, ou revisão curta, nada muda', () => {
    expect(withWordQuestions(base, new Set(hira.slice(0, 5)), seeded(3))).toEqual(base);
    expect(withWordQuestions(base.slice(0, 3), known, seeded(3))).toEqual(base.slice(0, 3));
  });
});

describe('sósias nas lições e no ouvido (item 5)', () => {
  it('na lição, os sósias que a pessoa já conhece entram como alternativa', () => {
    const known = new Set(['ち', 'き']);
    for (let seed = 1; seed <= 15; seed++) {
      const qs = buildLessonQuestions(['さ', 'か', 'た', 'な'], false, seeded(seed), known);
      const q = qs.find((x) => x.item.char === 'さ' && x.direction === 'k2r')!;
      expect(q.options.map((o) => o.char)).toEqual(expect.arrayContaining(['さ', 'ち', 'き']));
    }
  });

  it('no ouvido também', () => {
    const known = new Set(['ち', 'き']);
    const pool = ['さ', 'か', 'た', 'な'].map(getItem);
    const qs = buildEarQuestions(pool, seeded(2), 8, known).filter((q) => q.item.char === 'さ');
    expect(qs.length).toBeGreaterThan(0);
    for (const q of qs) expect(q.options.map((o) => o.char)).toEqual(expect.arrayContaining(['ち', 'き']));
  });
});

describe('pares confusos: mesmo som (F14)', () => {
  it('じ/ぢ e ず/づ, mesmo sendo os mais trocados, não ocupam as vagas dos pares treináveis', () => {
    let c: Confusions = {};
    for (let i = 0; i < 20; i++) c = addConfusion(c, 'じ', 'ぢ');
    for (let i = 0; i < 15; i++) c = addConfusion(c, 'ず', 'づ');
    c = addConfusion(c, 'さ', 'ち');
    c = addConfusion(c, 'ぬ', 'め');
    c = addConfusion(c, 'ぬ', 'め');
    const pairs = confusedPairs(c, 2);
    expect(pairs.map((p) => `${p.a}${p.b}`)).toEqual(['ぬめ', 'さち']);
    expect(pairs.map((p) => p.count)).toEqual([2, 1]);
  });

  it('se só há pares de mesmo som, a lista fica vazia e o exercício não monta nada', () => {
    let c: Confusions = {};
    c = addConfusion(c, 'ヂ', 'ジ');
    c = addConfusion(c, 'じ', 'ぢ');
    expect(confusedPairs(c)).toEqual([]);
    expect(buildConfusedQuestions([{ a: 'じ', b: 'ぢ', count: 3 }])).toEqual([]);
  });

  it('o registro continua guardando a confusão (serve ao desenho e às estatísticas), só o treino por som a ignora', () => {
    expect(addConfusion({}, 'じ', 'ぢ')).toEqual({ じ: { ぢ: 1 } });
  });
});

describe('freio: contar dias do calendário, não blocos de 24 h (F15)', () => {
  const day = (iso: string, answers: number, correct: number) => [iso, { answers, correct, learned: 0 }] as const;

  it('atravessa o início do horário de verão (dia de 23 h) sem pular um dia', () => {
    // 8/3/2026 tem 23 h em fusos com horário de verão dos EUA; de 9/3 às 0h30, "24 h atrás" cai em 7/3 e pulava o dia 8.
    const history = Object.fromEntries([day('2026-03-07', 10, 10), day('2026-03-08', 10, 0), day('2026-03-09', 10, 0)]);
    expect(recentAccuracy(history, new Date(2026, 2, 9, 0, 30))).toEqual({ pct: 33, answers: 30 });
  });

  it('atravessa o fim do horário de verão (dia de 25 h) sem repetir um dia', () => {
    const history = Object.fromEntries([day('2026-10-31', 10, 10), day('2026-11-01', 10, 0), day('2026-11-02', 10, 0)]);
    expect(recentAccuracy(history, new Date(2026, 10, 2, 23, 30))).toEqual({ pct: 33, answers: 30 });
    expect(recentAccuracy(history, new Date(2026, 10, 2, 0, 30))).toEqual({ pct: 33, answers: 30 });
  });

  it('em Auckland (horário de verão começa em 27/9) vale o mesmo', () => {
    const history = Object.fromEntries([day('2026-09-26', 10, 10), day('2026-09-27', 10, 0), day('2026-09-28', 10, 0)]);
    expect(recentAccuracy(history, new Date(2026, 8, 28, 0, 30))).toEqual({ pct: 33, answers: 30 });
  });
});

describe('pares confusos de kanji', () => {
  it('registra 大 trocado por 犬 e junta os dois sentidos no mesmo par, sem misturar com kana', () => {
    let c: Confusions = {};
    c = addConfusion(c, '大', '犬');
    c = addConfusion(c, '犬', '大');
    c = addConfusion(c, '大', '犬');
    c = addConfusion(c, '大', 'さ'); // kanji × kana: escritas diferentes, ignorado
    expect(c).toEqual({ 大: { 犬: 2 }, 犬: { 大: 1 } });
    expect(confusedPairs(c)).toEqual([{ a: '大', b: '犬', count: 3 }]);
  });

  it('kana e kanji dividem a lista, do mais confundido ao menos', () => {
    let c: Confusions = {};
    for (let i = 0; i < 3; i++) c = addConfusion(c, '問', '間');
    c = addConfusion(c, 'さ', 'ち');
    expect(confusedPairs(c).map((p) => `${p.a}${p.b}`)).toEqual(['問間', 'さち']);
  });

  it('o exercício mostra o significado e pede o kanji entre os dois', () => {
    const questions = buildConfusedQuestions([{ a: '大', b: '犬', count: 3 }], () => 0.3, 2);
    expect(questions).toHaveLength(2);
    for (const q of questions) {
      expect(q.direction).toBe('r2k');
      expect(q.options.map((o) => o.char).sort()).toEqual(['大', '犬']);
      expect(q.item.char === '大' || q.item.char === '犬').toBe(true);
    }
    expect(new Set(questions.map((q) => q.item.char))).toEqual(new Set(['大', '犬']));
  });

  it('o registro da loja vale para kanji e sobrevive à leitura segura do disco e do backup', () => {
    const store = createProgressStore({ getItem: () => null, setItem: () => undefined, removeItem: () => undefined });
    store.getState().recordConfusion('大', '犬');
    store.getState().recordConfusion('大', '犬');
    expect(store.getState().confusions).toEqual({ 大: { 犬: 2 } });
    expect(sanitizeConfusions(JSON.parse(JSON.stringify(store.getState().confusions)))).toEqual({ 大: { 犬: 2 } });
    expect(sanitizeConfusions({ 大: { 犬: 2, さ: 1, nada: 4 }, ZZ: { 大: 1 }, さ: { 大: 1 } })).toEqual({ 大: { 犬: 2 } });
  });
});
