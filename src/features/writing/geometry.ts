import type { Point } from '@/features/strokes/svgPath';

/** Quantos pontos representam cada traço na comparação. */
export const RESAMPLE_POINTS = 24;

const dist = (a: Point, b: Point): number => Math.hypot(a[0] - b[0], a[1] - b[1]);

/**
 * Reamostra um traço em `n` pontos igualmente espaçados ao longo do comprimento.
 * Assim, traços desenhados com velocidades (e quantidades de pontos) diferentes ficam comparáveis.
 * Um traço de um ponto só (um toque) repete esse ponto.
 */
export function resample(points: readonly Point[], n: number = RESAMPLE_POINTS): Point[] {
  const first = points[0];
  if (!first) return [];
  const cumulative = [0];
  for (let i = 1; i < points.length; i++) {
    cumulative.push((cumulative[i - 1] as number) + dist(points[i - 1] as Point, points[i] as Point));
  }
  const total = cumulative[cumulative.length - 1] as number;
  if (total === 0) return Array.from({ length: n }, () => first);

  const out: Point[] = [];
  let seg = 1;
  for (let k = 0; k < n; k++) {
    const target = (total * k) / (n - 1);
    while (seg < points.length - 1 && (cumulative[seg] as number) < target) seg++;
    const a = points[seg - 1] as Point;
    const b = points[seg] as Point;
    const length = (cumulative[seg] as number) - (cumulative[seg - 1] as number);
    const t = length === 0 ? 0 : (target - (cumulative[seg - 1] as number)) / length;
    out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
  }
  return out;
}

export interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export function boundsOf(strokes: readonly (readonly Point[])[]): Bounds | null {
  let b: Bounds | null = null;
  for (const stroke of strokes) {
    for (const [x, y] of stroke) {
      b = b
        ? { minX: Math.min(b.minX, x), minY: Math.min(b.minY, y), maxX: Math.max(b.maxX, x), maxY: Math.max(b.maxY, y) }
        : { minX: x, minY: y, maxX: x, maxY: y };
    }
  }
  return b;
}

/** Tamanho abaixo do qual o desenho é só um ponto e não dá para escalar. */
const MIN_SIZE = 1;

/**
 * Alinha o desenho ao modelo em posição e escala (proporção mantida), para que escrever
 * menor, maior ou fora do centro do quadro não prejudique a nota.
 * `drawnRef` e `modelRef` são os traços usados para medir: quando faltam traços, só os que
 * existem nos dois lados, para um desenho incompleto não ser esticado até a caixa inteira.
 */
export function alignToModel(
  drawn: readonly (readonly Point[])[],
  drawnRef: readonly (readonly Point[])[],
  modelRef: readonly (readonly Point[])[],
): Point[][] {
  const d = boundsOf(drawnRef);
  const m = boundsOf(modelRef);
  if (!d || !m) return drawn.map((s) => [...s]);

  const drawnSize = Math.max(d.maxX - d.minX, d.maxY - d.minY);
  const modelSize = Math.max(m.maxX - m.minX, m.maxY - m.minY);
  const scale = drawnSize < MIN_SIZE || modelSize < MIN_SIZE ? 1 : modelSize / drawnSize;
  const [dcx, dcy] = [(d.minX + d.maxX) / 2, (d.minY + d.maxY) / 2];
  const [mcx, mcy] = [(m.minX + m.maxX) / 2, (m.minY + m.maxY) / 2];

  return drawn.map((stroke) =>
    stroke.map(([x, y]): Point => [mcx + (x - dcx) * scale, mcy + (y - dcy) * scale]),
  );
}

/** Distância média entre dois traços já reamostrados, ponto a ponto, na mesma direção. */
export function meanDistance(a: readonly Point[], b: readonly Point[]): number {
  const n = Math.min(a.length, b.length);
  if (n === 0) return Infinity;
  let sum = 0;
  for (let i = 0; i < n; i++) sum += dist(a[i] as Point, b[i] as Point);
  return sum / n;
}

/**
 * Atribuição de custo mínimo (algoritmo húngaro) em matriz quadrada.
 * Devolve, para cada linha, a coluna escolhida. Serve para casar cada traço do modelo com o
 * traço desenhado que mais se parece, sem depender da ordem em que o usuário desenhou.
 */
export function assignMinCost(cost: readonly (readonly number[])[]): number[] {
  const n = cost.length;
  const u = new Array<number>(n + 1).fill(0);
  const v = new Array<number>(n + 1).fill(0);
  const p = new Array<number>(n + 1).fill(0);
  const way = new Array<number>(n + 1).fill(0);

  for (let i = 1; i <= n; i++) {
    p[0] = i;
    let j0 = 0;
    const minv = new Array<number>(n + 1).fill(Infinity);
    const used = new Array<boolean>(n + 1).fill(false);
    do {
      used[j0] = true;
      const i0 = p[j0] as number;
      let delta = Infinity;
      let j1 = 0;
      for (let j = 1; j <= n; j++) {
        if (used[j]) continue;
        const cur = (cost[i0 - 1]?.[j - 1] as number) - (u[i0] as number) - (v[j] as number);
        if (cur < (minv[j] as number)) {
          minv[j] = cur;
          way[j] = j0;
        }
        if ((minv[j] as number) < delta) {
          delta = minv[j] as number;
          j1 = j;
        }
      }
      for (let j = 0; j <= n; j++) {
        if (used[j]) {
          u[p[j] as number] = (u[p[j] as number] as number) + delta;
          v[j] = (v[j] as number) - delta;
        } else {
          minv[j] = (minv[j] as number) - delta;
        }
      }
      j0 = j1;
    } while (p[j0] !== 0);
    do {
      const j1 = way[j0] as number;
      p[j0] = p[j1] as number;
      j0 = j1;
    } while (j0 !== 0);
  }

  const assignment = new Array<number>(n).fill(-1);
  for (let j = 1; j <= n; j++) assignment[(p[j] as number) - 1] = j - 1;
  return assignment;
}
