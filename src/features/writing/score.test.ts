import { STROKES } from '@/data/strokes';
import { ALL_ITEMS } from '@/features/catalog';
import { flattenPath, type Point } from '@/features/strokes/svgPath';
import { isWritable } from './model';
import { isPassing, scoreWriting, strokeLabel, WRITE_PASS_SCORE } from './score';

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
  it('245 itens: 143 kana de um símbolo e 102 kanji; as combinações ficam de fora', () => {
    expect(writable).toHaveLength(245);
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

  it('todos os 245 itens, desenhados sobre o modelo, passam com folga', () => {
    const low = writable.filter((c) => scoreWriting(model(c), perfect(c)).pct < 95);
    expect(low).toEqual([]);
  });

  it('todos os 245 itens, com mão razoável (erro 3), ainda passam no corte do modo write', () => {
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
