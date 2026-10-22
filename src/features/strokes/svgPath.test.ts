import { KANJI } from '@/data/kanji';
import { KANA } from '@/data/kana';
import { STROKES } from '@/data/strokes';
import { flattenPath, pathEndpoints, pathLength } from './svgPath';

describe('pathLength', () => {
  it('linhas retas (absolutas e relativas)', () => {
    expect(pathLength('M0,0 L3,4')).toBeCloseTo(5);
    expect(pathLength('M0,0 l3,4')).toBeCloseTo(5);
    expect(pathLength('M1,1 h10 v10')).toBeCloseTo(20);
    expect(pathLength('M1,1 H11 V11')).toBeCloseTo(20);
  });

  it('Z fecha o caminho', () => {
    expect(pathLength('M0,0 h10 v10 z')).toBeCloseTo(10 + 10 + Math.hypot(10, 10));
  });

  it('pares extras depois do M valem como linhas', () => {
    expect(pathLength('M0,0 3,4')).toBeCloseTo(5);
  });

  it('curva cúbica que é uma reta tem o comprimento da reta', () => {
    expect(pathLength('M0,0 C10,0 20,0 30,0')).toBeCloseTo(30, 3);
    expect(pathLength('M0,0 c10,0 20,0 30,0')).toBeCloseTo(30, 3);
  });

  it('S reflete o ponto de controle anterior (S equivale ao C refletido)', () => {
    // C0,0→(0,10),(10,10),(10,0) seguido de S: o 1º controle vira (10,-10).
    const withS = pathLength('M0,0 C0,10 10,10 10,0 S20,-10 20,0');
    const withC = pathLength('M0,0 C0,10 10,10 10,0 C10,-10 20,-10 20,0');
    expect(withS).toBeCloseTo(withC);
  });

  it('números negativos e decimais colados', () => {
    expect(pathLength('M10.5-2.5l-3.5,4')).toBeCloseTo(Math.hypot(3.5, 4));
  });

  it('recusa comandos que não suporta em vez de errar em silêncio', () => {
    expect(() => pathLength('M0,0 A5,5 0 0 1 10,0')).toThrow();
  });

  it('todos os traços dos dados têm comprimento positivo e finito', () => {
    for (const { char } of [...KANA, ...KANJI]) {
      for (const d of STROKES[char]?.p ?? []) {
        const length = pathLength(d);
        expect(Number.isFinite(length)).toBe(true);
        expect(length).toBeGreaterThan(1);
      }
    }
  });
});

describe('flattenPath / pathEndpoints', () => {
  it('linhas: devolve os vértices na ordem', () => {
    expect(flattenPath('M0,0 L10,0 L10,5')).toEqual([[0, 0], [10, 0], [10, 5]]);
    expect(flattenPath('M1,1 h4 v2')).toEqual([[1, 1], [5, 1], [5, 3]]);
  });

  it('curvas viram muitos pontos que terminam no ponto final', () => {
    const points = flattenPath('M0,0 C0,10 10,10 10,0');
    expect(points.length).toBeGreaterThan(10);
    expect(points[0]).toEqual([0, 0]);
    expect(points.at(-1)?.[0]).toBeCloseTo(10);
    expect(points.at(-1)?.[1]).toBeCloseTo(0);
  });

  it('o comprimento da linha quebrada bate com pathLength', () => {
    const d = 'M31.01,33c0.88,0.88,2.75,1.82,5.25,1.75c8.62-0.25,20-2.12,29.5-4.25';
    const pts = flattenPath(d);
    let sum = 0;
    for (let i = 1; i < pts.length; i++) sum += Math.hypot(pts[i]![0] - pts[i - 1]![0], pts[i]![1] - pts[i - 1]![1]);
    expect(sum).toBeCloseTo(pathLength(d));
  });

  it('extremidades de um traço real e de um caminho vazio', () => {
    const { start, end } = pathEndpoints('M10,20 c5,0 10,5 15,10');
    expect(start).toEqual([10, 20]);
    expect(end[0]).toBeCloseTo(25);
    expect(end[1]).toBeCloseTo(30);
    expect(() => pathEndpoints('')).toThrow();
  });
});
