import { LOOKALIKES, lookalikesOf } from '@/features/chart/lookalikes';
import { ALL_ITEMS, getItem } from '@/features/catalog';
import { buildOptions, buildReviewQuestions, type Rng } from '@/features/quiz/quiz';
import { assistFor } from '@/features/writing/assist';
import { createProgressStore } from '@/store/progressStore';
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
