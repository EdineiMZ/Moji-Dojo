import { STROKES } from '@/data/strokes';
import { ALL_ITEMS } from '@/features/catalog';
import { flattenPath, type Point } from '@/features/strokes/svgPath';
import { sliceStroke } from './geometry';
import { isWritable } from './model';
import { COVERAGES, FAIR_SCORE, GOOD_SCORE, isPassing, MAX_STROKE_DISTANCE, MISSING_PENALTY, OK_STROKE_DISTANCE, scoreWriting, strokeLabel, TRIM_HYPOTHESIS_COST, WRITE_PASS_FIRST, WRITE_PASS_SCORE, writePassScore } from './score';

const model = (char: string) => {
  const m = STROKES[char];
  if (!m) throw new Error(`sem traços para ${char}`);
  return m;
};

/** O "usuário perfeito": desenha exatamente sobre o modelo, traço a traço. */
const perfect = (char: string): Point[][] => model(char).p.map(flattenPath);

/**
 * Mão realista: o desenho sai um pouco menor, deslocado e ondulado de forma suave.
 * `amp` é a gravidade do erro (3 ≈ ±7px num quadro de 300px).
 */
const hand = (strokes: Point[][], amp: number): Point[][] => {
  const scale = 1 - amp * 0.025;
  const dx = amp * 1.5;
  const dy = -amp * 1.1;
  return strokes.map((s, si) =>
    s.map(([x, y], i): Point => {
      const t = i / Math.max(1, s.length - 1);
      return [
        54.5 + (x - 54.5) * scale + dx + Math.sin(t * 6.28 + si) * amp * 0.9,
        54.5 + (y - 54.5) * scale + dy + Math.cos(t * 7.5 + si) * amp * 0.9,
      ];
    }),
  );
};

const writable = ALL_ITEMS.filter((it) => isWritable(it.char)).map((it) => it.char);

describe('quais itens têm modelo de escrita', () => {
  it('620 itens: 143 kana de um símbolo e 477 kanji; as combinações ficam de fora', () => {
    expect(writable).toHaveLength(620);
    expect(isWritable('か')).toBe(true);
    expect(isWritable('水')).toBe(true);
    expect(isWritable('きゃ')).toBe(false);
    expect(isWritable('ファ')).toBe(false);
  });
});

describe('scoreWriting: acertos', () => {
  it.each(['あ', 'ア', '水', '日', '一', '食'])('traço perfeito de %s: nota alta e todos os traços certos', (char) => {
    const score = scoreWriting(model(char), perfect(char));
    expect(score.pct).toBeGreaterThanOrEqual(95);
    expect(score.level).toBe('ok');
    expect(score.strokes.every((s) => s === 'ok')).toBe(true);
    expect(score.verdict).toBe('Ótimo, forma e ordem certas.');
    expect(isPassing(score)).toBe(true);
  });

  it('todos os 620 itens, desenhados sobre o modelo, passam com folga', () => {
    const low = writable.filter((c) => scoreWriting(model(c), perfect(c)).pct < 95);
    expect(low).toEqual([]);
  });

  it('todos os 620 itens, com mão razoável (erro 3), ainda passam no corte do modo write', () => {
    const failed = writable
      .map((c) => [c, scoreWriting(model(c), hand(perfect(c), 3)).pct] as const)
      .filter(([, pct]) => pct < WRITE_PASS_SCORE);
    expect(failed).toEqual([]);
  });

  it('não importa o tamanho nem a posição: o mesmo desenho pequeno e no canto passa igual', () => {
    const base = perfect('水');
    const small = base.map((s) => s.map(([x, y]): Point => [10 + x * 0.35, 60 + y * 0.35]));
    expect(scoreWriting(model('水'), small).pct).toBeGreaterThanOrEqual(95);
  });
});

describe('scoreWriting: erros', () => {
  it('um rabisco reprova', () => {
    const scribble: Point[][] = [[[5, 5], [15, 8], [8, 18], [20, 20], [10, 30]]];
    const score = scoreWriting(model('日'), scribble);
    expect(score.pct).toBeLessThan(40);
    expect(score.level).toBe('bad');
    expect(isPassing(score)).toBe(false);
  });

  it('desenhar um caractere parecido NÃO passa no corte (o motivo do critério geométrico)', () => {
    const similar: [string, string][] = [
      ['日', '水'], ['日', '目'], ['日', '白'], ['木', '本'], ['人', '入'], ['右', '左'], ['大', '天'], ['土', '上'],
      ['さ', 'ち'], ['ぬ', 'め'], ['は', 'ほ'], ['る', 'ろ'], ['シ', 'ツ'], ['ソ', 'ン'], ['ク', 'タ'], ['ス', 'ヌ'],
      ['わ', 'れ'], ['ね', 'れ'], ['あ', 'お'], ['き', 'さ'], ['い', 'り'],
    ];
    for (const [expected, drawn] of similar) {
      for (const [a, b] of [[expected, drawn], [drawn, expected]] as const) {
        const pct = scoreWriting(model(a), perfect(b)).pct;
        expect({ par: `${a}/${b}`, passa: pct >= WRITE_PASS_SCORE }).toEqual({ par: `${a}/${b}`, passa: false });
      }
    }
  });

  it('o caractere certo, mesmo meio torto, vence o parecido desenhado direito', () => {
    const right = scoreWriting(model('ぬ'), hand(perfect('ぬ'), 3)).pct;
    const wrong = scoreWriting(model('ぬ'), perfect('め')).pct;
    expect(right).toBeGreaterThan(wrong + 15);
  });

  it('faltar traços: os que faltam são marcados e a nota cai abaixo do corte', () => {
    const score = scoreWriting(model('水'), [perfect('水')[0]!]);
    expect(score.strokes).toEqual(['ok', 'miss', 'miss', 'miss']);
    expect(score.pct).toBeLessThan(WRITE_PASS_SCORE);
    expect(score.drawnCount).toBe(1);
    expect(score.expectedCount).toBe(4);
  });

  it('traço a mais custa nota e tira o "ótimo"', () => {
    const extra: Point[] = [[50, 50], [75, 55]];
    const score = scoreWriting(model('日'), [...perfect('日'), extra]);
    expect(score.drawnCount).toBe(score.expectedCount + 1);
    expect(score.pct).toBeLessThan(scoreWriting(model('日'), perfect('日')).pct);
    expect(score.verdict).not.toBe('Ótimo, forma e ordem certas.');
  });
});

describe('scoreWriting: ordem e direção são só feedback (não mudam o resultado)', () => {
  it('traço ao contrário: marcado como invertido, nota quase igual', () => {
    const strokes = perfect('日');
    strokes[0] = [...strokes[0]!].reverse();
    const score = scoreWriting(model('日'), strokes);
    expect(score.strokes[0]).toBe('rev');
    expect(score.strokes.slice(1).every((s) => s === 'ok')).toBe(true);
    expect(score.pct).toBeGreaterThanOrEqual(WRITE_PASS_SCORE);
    expect(score.verdict).toBe('Forma boa. Confira a ordem dos traços.');
  });

  it('traços na ordem errada: marcados como ordem, e a nota continua alta', () => {
    const strokes = perfect('日');
    [strokes[0], strokes[1]] = [strokes[1]!, strokes[0]!];
    const score = scoreWriting(model('日'), strokes);
    expect(score.strokes.filter((s) => s === 'order')).toHaveLength(2);
    expect(score.pct).toBeGreaterThanOrEqual(95);
    expect(isPassing(score)).toBe(true);
  });
});

describe('strokeLabel', () => {
  it('um texto por veredito', () => {
    expect(strokeLabel('ok', 0)).toBe('1 ✓');
    expect(strokeLabel('rev', 1)).toBe('2 ↺ invertido');
    expect(strokeLabel('order', 2)).toBe('3 ↕ ordem');
    expect(strokeLabel('miss', 3)).toBe('4 faltou');
    expect(strokeLabel('bad', 4)).toBe('5 ✗');
  });
});

describe('régua do desenho por caixa', () => {
  it('começa em 50% e sobe até 70%', () => {
    expect([undefined, 1, 2, 3, 4, 5, 6].map((b) => writePassScore(b))).toEqual([50, 50, 55, 60, 65, 70, 70]);
  });
});

// ---------------------------------------------------------------------------------------------------------------------
// Variações realistas do い e dos caracteres de um traço (traço final encurtado). Os cortes gerais não mudam.
// ---------------------------------------------------------------------------------------------------------------------

const MID = 54.5;
const tilt = (strokes: Point[][], deg: number): Point[][] => {
  const a = (deg * Math.PI) / 180;
  return strokes.map((s) => s.map(([x, y]): Point => [MID + (x - MID) * Math.cos(a) - (y - MID) * Math.sin(a), MID + (x - MID) * Math.sin(a) + (y - MID) * Math.cos(a)]));
};
const tremor = (strokes: Point[][], amp: number, seed: number): Point[][] =>
  strokes.map((s, si) =>
    s.map(([x, y], i): Point => {
      const t = i / Math.max(1, s.length - 1);
      return [x + Math.sin(t * 6.28 * 1.3 + si + seed) * amp, y + Math.cos(t * 5.1 + si * 2 + seed) * amp];
    }),
  );
/** Fim de cada traço encurtado: fica só a fração `keep` do comprimento, a partir do começo (como a pessoa que não termina o rabisco). */
const shortenEnds = (strokes: Point[][], keep: number): Point[][] => strokes.map((s) => sliceStroke(s, 0, keep));
/** Só o último traço fica mais curto. */
const shortenLast = (strokes: Point[][], keep: number): Point[][] => strokes.map((s, i) => (i === strokes.length - 1 ? sliceStroke(s, 0, keep) : s));

const ONE_STROKE_TAILS = ['そ', 'つ', 'の', 'ろ', 'ん', 'フ', '夕'];

describe('os cortes de nota continuam os mesmos', () => {
  it('constantes de nota e de distância', () => {
    expect(WRITE_PASS_SCORE).toBe(70);
    expect(WRITE_PASS_FIRST).toBe(50);
    expect(GOOD_SCORE).toBe(80);
    expect(FAIR_SCORE).toBe(60);
    expect(MAX_STROKE_DISTANCE).toBe(18);
    expect(OK_STROKE_DISTANCE).toBe(10);
    expect([1, 2, 3, 4, 5, 6].map(writePassScore)).toEqual([50, 55, 60, 65, 70, 70]);
  });

  it('a tolerância ao traço encurtado é limitada (até 20% a menos) e cobra pelo que falta', () => {
    expect(Math.min(...COVERAGES)).toBeGreaterThanOrEqual(0.8);
    expect(MISSING_PENALTY).toBeGreaterThanOrEqual(25);
  });
});

describe('い com variações realistas', () => {
  const ideal = perfect('い');
  const nota = (strokes: Point[][]) => scoreWriting(model('い'), strokes).pct;

  it('perfeito = 100', () => {
    expect(nota(ideal)).toBe(100);
  });

  it.each([-8, 8])('inclinado %i°: passa folgado no corte de quem está começando', (deg) => {
    expect(nota(tilt(ideal, deg))).toBeGreaterThanOrEqual(writePassScore(1) + 15);
  });

  it('tremor de mão (amplitude 4) passa no corte de quem domina', () => {
    expect(nota(tremor(ideal, 4, 2))).toBeGreaterThanOrEqual(WRITE_PASS_SCORE);
  });

  it('traços 15% mais curtos passam no corte de quem domina', () => {
    expect(nota(shortenEnds(ideal, 0.85))).toBeGreaterThanOrEqual(WRITE_PASS_SCORE);
  });

  it('inclinado + 15% mais curto + tremor: passa no corte de quem está começando', () => {
    expect(nota(tremor(shortenEnds(tilt(ideal, 8), 0.85), 3, 4))).toBeGreaterThanOrEqual(writePassScore(1));
  });

  it('desenho deslocado ou menor não perde nota', () => {
    const moved = ideal.map((s) => s.map(([x, y]): Point => [x * 0.6 + 30, y * 0.6 + 20]));
    expect(nota(moved)).toBe(100);
  });

  it('inclinar demais (25°) continua reprovando', () => {
    expect(nota(tilt(ideal, 25))).toBeLessThan(writePassScore(1));
  });
});

describe('caracteres de um traço com o final encurtado (そ つ の ろ ん フ 夕)', () => {
  it.each(ONE_STROKE_TAILS)('%s: perfeito = 100', (c) => {
    expect(scoreWriting(model(c), perfect(c)).pct).toBe(100);
  });

  it.each(ONE_STROKE_TAILS)('%s: 5%% a menos quase não pesa e 10%% passa até no corte de quem domina', (c) => {
    expect(scoreWriting(model(c), shortenEnds(perfect(c), 0.95)).pct).toBeGreaterThanOrEqual(80);
    expect(scoreWriting(model(c), shortenEnds(perfect(c), 0.9)).pct).toBeGreaterThanOrEqual(WRITE_PASS_SCORE);
  });

  it.each(ONE_STROKE_TAILS)('%s: 15%% a menos ainda passa no corte de quem está começando', (c) => {
    expect(scoreWriting(model(c), shortenEnds(perfect(c), 0.85)).pct).toBeGreaterThanOrEqual(writePassScore(1) + 10);
  });

  it.each(ONE_STROKE_TAILS)('%s: encurtar 30%% ou mais continua sendo nota baixa', (c) => {
    expect(scoreWriting(model(c), shortenEnds(perfect(c), 0.7)).pct).toBeLessThan(writePassScore(1));
    expect(scoreWriting(model(c), shortenEnds(perfect(c), 0.6)).pct).toBeLessThan(writePassScore(1));
  });

  it.each(ONE_STROKE_TAILS)('%s: quanto mais falta, menor a nota', (c) => {
    const pct = [1, 0.95, 0.9, 0.8, 0.7, 0.6].map((keep) => scoreWriting(model(c), shortenEnds(perfect(c), keep)).pct);
    for (let i = 1; i < pct.length; i++) expect(pct[i]!).toBeLessThanOrEqual(pct[i - 1]! + 3);
  });

  it('o começo encurtado (a pessoa começa depois) também é tolerado', () => {
    const drop = (s: Point[][], from: number) => s.map((st) => sliceStroke(st, from, 1));
    for (const c of ONE_STROKE_TAILS) expect(scoreWriting(model(c), drop(perfect(c), 0.1)).pct).toBeGreaterThanOrEqual(writePassScore(1));
  });

  it('o último traço mais curto, num caractere de vários traços, quase não pesa', () => {
    for (const c of ['い', 'こ', 'に', 'ハ']) expect(scoreWriting(model(c), shortenLast(perfect(c), 0.85)).pct).toBeGreaterThanOrEqual(WRITE_PASS_SCORE);
  });

  it('todos os caracteres de um traço: 10% do final a menos passa no corte de quem domina', () => {
    const oneStroke = writable.filter((c) => model(c).p.length === 1);
    expect(oneStroke.length).toBeGreaterThanOrEqual(10);
    const failed = oneStroke.map((c) => [c, scoreWriting(model(c), shortenEnds(perfect(c), 0.9)).pct] as const).filter(([, pct]) => pct < WRITE_PASS_SCORE);
    expect(failed).toEqual([]);
  });

  it('todos os 620 itens: 10% do final a menos passa no corte de quem está começando', () => {
    const failed = writable.map((c) => [c, scoreWriting(model(c), shortenEnds(perfect(c), 0.9)).pct] as const).filter(([, pct]) => pct < writePassScore(1));
    expect(failed).toEqual([]);
  });
});

describe('a tolerância não vira porta aberta para o caractere errado', () => {
  // Pares bem diferentes: o desenho certo de um contra o modelo do outro tem de ficar abaixo do corte de quem está começando.
  const DIFFERENT: [string, string][] = [['あ', 'い'], ['あ', 'ん'], ['か', 'ま'], ['そ', 'ん'], ['の', 'つ'], ['ろ', 'そ'], ['い', 'り'], ['こ', 'に'], ['た', 'な'], ['さ', 'ち'], ['ハ', 'ヘ'], ['フ', 'ワ'], ['ク', 'ケ'], ['シ', 'ツ']];

  it.each(DIFFERENT)('o desenho de %s contra o modelo de %s reprova', (drawn, modelChar) => {
    expect(scoreWriting(model(modelChar), perfect(drawn)).pct).toBeLessThan(writePassScore(1));
  });

  it('desenho com o número de traços errado não ganha o alinhamento alternativo do traço encurtado', () => {
    // 'い' tem 2 traços; um traço só (mesmo o primeiro, perfeito) vale metade e não pode virar "い encurtado".
    const score = scoreWriting(model('い'), [perfect('い')[0]!]);
    expect(score.pct).toBe(50);
    expect(score.strokes).toEqual(['ok', 'miss']);
  });

  it('a hipótese de traço encurtado custa pontos: o parecido não ganha folga (れ/わ, ぬ/め, 土/上 ficam como estavam)', () => {
    expect(TRIM_HYPOTHESIS_COST).toBeGreaterThanOrEqual(5);
    for (const [drawn, modelChar] of [['れ', 'わ'], ['わ', 'れ'], ['め', 'ぬ'], ['ぬ', 'め'], ['土', '上'], ['上', '土']] as const) {
      expect(scoreWriting(model(modelChar), perfect(drawn)).pct).toBeLessThan(WRITE_PASS_SCORE);
    }
  });

  it('um desenho vazio continua nota 0', () => {
    expect(scoreWriting(model('い'), []).pct).toBe(0);
  });
});
