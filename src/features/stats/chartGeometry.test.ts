import { barLayout, lineLayout, linePath, MIN_LINE_SPAN } from './chartGeometry';

describe('barLayout', () => {
  it('a maior barra ocupa a altura toda e as outras são proporcionais, sempre a partir de zero', () => {
    const bars = barLayout([0, 5, 10], 300, 100);
    expect(bars.map((b) => b.height)).toEqual([0, 50, 100]);
  });

  it('barras finas, de largura igual, centradas na própria faixa', () => {
    const bars = barLayout([1, 2, 3, 4], 200, 80, 0.5);
    expect(bars.every((b) => b.width === 25)).toBe(true);
    expect(bars[0]?.x).toBe(12.5);
    expect(bars[3]?.x).toBe(162.5);
    for (const b of bars) expect(b.x + b.width).toBeLessThanOrEqual(200);
  });

  it('tudo zero: sem altura (o componente mostra um estado vazio em vez de eixos sem dados)', () => {
    expect(barLayout([0, 0, 0], 100, 50).every((b) => b.height === 0)).toBe(true);
    expect(barLayout([], 100, 50)).toEqual([]);
  });
});

describe('lineLayout', () => {
  it('x vai de ponta a ponta e o maior valor fica no topo (y = 0), o menor na base', () => {
    const pts = lineLayout([10, 20, 30], 200, 100);
    expect(pts.map((p) => p.x)).toEqual([0, 100, 200]);
    expect(pts[0]?.y).toBe(100);
    expect(pts[2]?.y).toBe(0);
    expect(pts[1]?.y).toBe(50);
  });

  it('série parada vira uma reta na base, sem dividir por zero', () => {
    const pts = lineLayout([12, 12, 12, 12], 90, 60);
    expect(new Set(pts.map((p) => p.y)).size).toBe(1);
    expect(pts.every((p) => Number.isFinite(p.y))).toBe(true);
  });

  it('uma variação pequena não é esticada até a altura toda (intervalo mínimo)', () => {
    const pts = lineLayout([20, 21], 100, 100);
    expect(pts[0]?.y).toBe(100);
    expect(pts[1]?.y).toBe(100 - (1 / MIN_LINE_SPAN) * 100); // 80, e não 0
  });

  it('um único ponto não quebra', () => {
    const [p] = lineLayout([7], 100, 50);
    expect(p).toMatchObject({ x: 0, value: 7 });
    expect(Number.isFinite(p?.y)).toBe(true);
  });
});

describe('linePath', () => {
  it('monta o caminho SVG com uma casa decimal', () => {
    expect(linePath([{ x: 0, y: 10, value: 1 }, { x: 5.26, y: 2.24, value: 2 }])).toBe('M0.0 10.0 L5.3 2.2');
  });
});
