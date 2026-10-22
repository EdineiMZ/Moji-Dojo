/** Posição de uma barra, em pixels, com a base no fundo da área do gráfico. */
export interface BarRect {
  x: number;
  width: number;
  height: number;
  value: number;
}

/**
 * Barras de largura igual, uma por valor, sempre a partir de zero (barras codificam magnitude
 * pelo comprimento). `barRatio` é a fração da faixa ocupada pela barra: barras finas deixam ar entre si.
 */
export function barLayout(values: readonly number[], width: number, height: number, barRatio = 0.5): BarRect[] {
  const max = Math.max(0, ...values);
  const slot = width / Math.max(values.length, 1);
  const barWidth = slot * barRatio;
  return values.map((value, i) => ({
    x: i * slot + (slot - barWidth) / 2,
    width: barWidth,
    height: max === 0 ? 0 : (value / max) * height,
    value,
  }));
}

export interface LinePoint {
  x: number;
  y: number;
  value: number;
}

/** Diferença mínima (em unidades) entre o menor e o maior valor, para uma variação pequena não parecer enorme. */
export const MIN_LINE_SPAN = 5;

/**
 * Pontos de uma linha: x espalhado de ponta a ponta, y de cima para baixo (o maior valor no topo).
 * O eixo vai do menor valor ao maior, com um intervalo mínimo; assim uma série parada vira uma reta
 * e um pequeno aumento não é exagerado.
 */
export function lineLayout(values: readonly number[], width: number, height: number): LinePoint[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(max - min, MIN_LINE_SPAN);
  const lastIndex = Math.max(values.length - 1, 1);
  return values.map((value, i) => ({
    x: (i / lastIndex) * width,
    y: height - ((value - min) / span) * height,
    value,
  }));
}

/** Os pontos como caminho SVG ("M x y L x y ..."). */
export const linePath = (points: readonly LinePoint[]): string =>
  points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
