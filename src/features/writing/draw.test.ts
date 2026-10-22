import { parsePolyline, polylinePath } from './draw';

describe('parsePolyline / polylinePath', () => {
  it('converte o texto do traço em pontos', () => {
    expect(parsePolyline('M10.0 20.5 L11.5 22.0 L-3.2 0.0')).toEqual([[10, 20.5], [11.5, 22], [-3.2, 0]]);
  });

  it('um toque (só o M) vira um traço de um ponto; vazio vira vazio', () => {
    expect(parsePolyline('M5.0 6.0')).toEqual([[5, 6]]);
    expect(parsePolyline('')).toEqual([]);
  });

  it('ida e volta preserva os pontos (com uma casa decimal)', () => {
    const points: [number, number][] = [[1.2, 3.4], [50.5, 60.1], [108.9, 0.3]];
    expect(parsePolyline(polylinePath(points))).toEqual(points);
  });

  it('um número ímpar sobrando é ignorado em vez de quebrar', () => {
    expect(parsePolyline('M1.0 2.0 L3.0')).toEqual([[1, 2]]);
  });
});
