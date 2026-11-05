import type { Point } from '@/features/strokes/svgPath';
import { alignToModel, assignMinCost, boundsOf, meanDistance, resample, sliceStroke } from './geometry';

describe('resample', () => {
  it('reparte os pontos igualmente ao longo do traço', () => {
    const pts = resample([[0, 0], [10, 0]], 5);
    expect(pts).toEqual([[0, 0], [2.5, 0], [5, 0], [7.5, 0], [10, 0]]);
  });

  it('não depende de quantos pontos o traço original tinha', () => {
    const few = resample([[0, 0], [30, 40]], 7);
    const many = resample(Array.from({ length: 101 }, (_, i): Point => [i * 0.3, i * 0.4]), 7);
    few.forEach((p, i) => {
      expect(p[0]).toBeCloseTo(many[i]![0]);
      expect(p[1]).toBeCloseTo(many[i]![1]);
    });
  });

  it('segue as dobras: o ponto do meio de um "L" é o canto', () => {
    const [, mid] = resample([[0, 0], [10, 0], [10, 10]], 3);
    expect(mid![0]).toBeCloseTo(10);
    expect(mid![1]).toBeCloseTo(0);
  });

  it('um toque (um ponto só) repete o ponto; vazio devolve vazio', () => {
    expect(resample([[5, 5]], 3)).toEqual([[5, 5], [5, 5], [5, 5]]);
    expect(resample([], 3)).toEqual([]);
  });
});

describe('boundsOf / alignToModel', () => {
  it('caixa que envolve todos os traços', () => {
    expect(boundsOf([[[1, 2], [5, 3]], [[0, 9]]])).toEqual({ minX: 0, minY: 2, maxX: 5, maxY: 9 });
    expect(boundsOf([])).toBeNull();
  });

  it('leva um desenho menor e deslocado para a caixa do modelo', () => {
    const model: Point[][] = [[[10, 10], [90, 10]], [[50, 10], [50, 90]]]; // caixa 10..90
    const small: Point[][] = [[[100, 100], [110, 100]], [[105, 100], [105, 110]]]; // 10x10 em (100,100)
    const aligned = alignToModel(small, small, model);
    const box = boundsOf(aligned)!;
    expect(box.minX).toBeCloseTo(10);
    expect(box.maxX).toBeCloseTo(90);
    expect(box.minY).toBeCloseTo(10);
    expect(box.maxY).toBeCloseTo(90);
  });

  it('mantém a proporção (escala igual nos dois eixos)', () => {
    const model: Point[][] = [[[0, 0], [100, 50]]];
    const drawn: Point[][] = [[[0, 0], [10, 5]]];
    const [stroke] = alignToModel(drawn, drawn, model);
    expect(stroke![1]![0] - stroke![0]![0]).toBeCloseTo(100);
    expect(stroke![1]![1] - stroke![0]![1]).toBeCloseTo(50);
  });

  it('um desenho que é só um ponto não é escalado (e não dá divisão por zero)', () => {
    const aligned = alignToModel([[[5, 5]]], [[[5, 5]]], [[[0, 0], [100, 100]]]);
    expect(aligned[0]![0]!.every(Number.isFinite)).toBe(true);
  });
});

describe('meanDistance', () => {
  it('é a média das distâncias ponto a ponto', () => {
    expect(meanDistance([[0, 0], [10, 0]], [[0, 3], [10, 4]])).toBeCloseTo(3.5);
  });

  it('sensível à direção: traço invertido fica longe', () => {
    const a = resample([[0, 0], [100, 0]], 5);
    expect(meanDistance(a, a)).toBe(0);
    expect(meanDistance(a, [...a].reverse())).toBeGreaterThan(40);
  });
});

describe('assignMinCost (algoritmo húngaro)', () => {
  it('acha a atribuição de custo mínimo', () => {
    const cost = [
      [4, 1, 3],
      [2, 0, 5],
      [3, 2, 2],
    ];
    const result = assignMinCost(cost);
    expect(result.reduce((sum, col, row) => sum + cost[row]![col]!, 0)).toBe(5); // 1 + 2 + 2
    expect(new Set(result).size).toBe(3);
  });

  it('o ótimo global vence o guloso', () => {
    // O guloso pegaria 0,0 (custo 1) e ficaria com 1,1 (custo 100); o ótimo é 0,1 + 1,0 = 4.
    const cost = [
      [1, 2],
      [2, 100],
    ];
    expect(assignMinCost(cost)).toEqual([1, 0]);
  });

  it('matriz 1x1 e identidade', () => {
    expect(assignMinCost([[7]])).toEqual([0]);
    expect(assignMinCost([[0, 9, 9], [9, 0, 9], [9, 9, 0]])).toEqual([0, 1, 2]);
  });

  it('confere contra força bruta em matrizes aleatórias 5x5', () => {
    let seed = 7;
    const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
    const perms = (n: number): number[][] =>
      n === 1 ? [[0]] : perms(n - 1).flatMap((p) => Array.from({ length: n }, (_, k) => [...p.slice(0, k), n - 1, ...p.slice(k)]));
    for (let trial = 0; trial < 20; trial++) {
      const cost = Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => Math.floor(rnd() * 20)));
      const best = Math.min(...perms(5).map((p) => p.reduce((s, c, r) => s + cost[r]![c]!, 0)));
      const got = assignMinCost(cost);
      expect(got.reduce((s, c, r) => s + cost[r]![c]!, 0)).toBe(best);
    }
  });
});

describe('sliceStroke', () => {
  const line: Point[] = [[0, 0], [100, 0]];

  it('pega o começo ou o fim do traço pela fração do comprimento', () => {
    expect(sliceStroke(line, 0, 0.8)).toEqual([[0, 0], [80, 0]]);
    expect(sliceStroke(line, 0.2, 1)).toEqual([[20, 0], [100, 0]]);
  });

  it('segue as dobras e mantém os cantos que ficam dentro do trecho', () => {
    const ell: Point[] = [[0, 0], [10, 0], [10, 10]]; // comprimento 20
    expect(sliceStroke(ell, 0, 0.75)).toEqual([[0, 0], [10, 0], [10, 5]]);
    expect(sliceStroke(ell, 0.25, 1)).toEqual([[5, 0], [10, 0], [10, 10]]);
  });

  it('o trecho inteiro é o próprio traço', () => {
    const ell: Point[] = [[0, 0], [10, 0], [10, 10]];
    expect(sliceStroke(ell, 0, 1)).toEqual(ell);
  });

  it('traço sem comprimento ou faixa vazia devolve um ponto; vazio devolve vazio', () => {
    expect(sliceStroke([[3, 4], [3, 4]], 0, 0.5)).toEqual([[3, 4]]);
    expect(sliceStroke(line, 0.5, 0.5)).toEqual([[0, 0]]);
    expect(sliceStroke([], 0, 1)).toEqual([]);
  });
});

describe('meanDistance com limite', () => {
  const a: Point[] = [[0, 0], [10, 0], [20, 0], [30, 0]];
  const b: Point[] = [[0, 5], [10, 5], [20, 5], [30, 5]];

  it('abaixo do limite devolve a média de sempre', () => {
    expect(meanDistance(a, b, 6)).toBe(5);
  });

  it('desiste (Infinity) quando a média não pode ficar abaixo do limite', () => {
    expect(meanDistance(a, b, 5)).toBe(Infinity);
    expect(meanDistance(a, b, 2)).toBe(Infinity);
  });
});
