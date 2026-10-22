/**
 * Caminhos SVG em JavaScript puro: comprimento, amostragem em pontos e extremidades.
 * Serve à animação dos traços (strokeDasharray) e à conferência da escrita, e como
 * não depende de medir elementos na tela também funciona nos testes.
 * Suporta os comandos M L H V C S Z (maiúsculos e minúsculos), os usados pelo KanjiVG.
 */
export type Point = readonly [number, number];

type Segment =
  | { kind: 'move'; to: Point }
  | { kind: 'line'; from: Point; to: Point }
  | { kind: 'cubic'; p0: Point; p1: Point; p2: Point; p3: Point };

/** Quantos trechos retos aproximam cada curva. */
const CURVE_STEPS = 24;

const dist = (a: Point, b: Point): number => Math.hypot(b[0] - a[0], b[1] - a[1]);

function cubicPoint(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]];
}

/** Quantos números cada comando consome por repetição. */
const ARITY: Readonly<Record<string, number>> = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Z: 0 };

const parsed = new Map<string, readonly Segment[]>();

/** Converte o texto do caminho em segmentos absolutos. Recusa comandos não suportados. */
function parsePath(d: string): readonly Segment[] {
  const cached = parsed.get(d);
  if (cached) return cached;

  const tokens = d.match(/[a-zA-Z]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/g) ?? [];
  const segments: Segment[] = [];
  let i = 0;
  let current: Point = [0, 0];
  let start: Point = [0, 0];
  /** Segundo ponto de controle do último C/S, para refletir no próximo S. */
  let lastControl: Point | null = null;
  let command = '';

  const num = (): number => {
    const token = tokens[i++];
    const value = token === undefined ? NaN : Number(token);
    if (Number.isNaN(value)) throw new Error(`Caminho SVG inválido: ${d}`);
    return value;
  };
  const lineTo = (to: Point) => {
    segments.push({ kind: 'line', from: current, to });
    current = to;
    lastControl = null;
  };
  const cubicTo = (p1: Point, p2: Point, p3: Point) => {
    segments.push({ kind: 'cubic', p0: current, p1, p2, p3 });
    current = p3;
    lastControl = p2;
  };

  while (i < tokens.length) {
    const token = tokens[i] as string;
    if (/[a-zA-Z]/.test(token)) {
      command = token;
      i++;
      if (command.toUpperCase() === 'Z') {
        if (current[0] !== start[0] || current[1] !== start[1]) lineTo(start);
        continue;
      }
    }
    const upper = command.toUpperCase();
    if (!(upper in ARITY)) throw new Error(`Comando SVG não suportado (${command}): ${d}`);
    const relative = command !== upper;
    const [ox, oy] = relative ? current : [0, 0];

    switch (upper) {
      case 'M': {
        current = [ox + num(), oy + num()];
        start = current;
        lastControl = null;
        segments.push({ kind: 'move', to: current });
        // Pares extras depois de um M valem como L.
        command = relative ? 'l' : 'L';
        break;
      }
      case 'L':
        lineTo([ox + num(), oy + num()]);
        break;
      case 'H':
        lineTo([ox + num(), current[1]]);
        break;
      case 'V':
        lineTo([current[0], oy + num()]);
        break;
      case 'C':
        cubicTo([ox + num(), oy + num()], [ox + num(), oy + num()], [ox + num(), oy + num()]);
        break;
      case 'S': {
        const c1: Point = lastControl ? [2 * current[0] - lastControl[0], 2 * current[1] - lastControl[1]] : current;
        cubicTo(c1, [ox + num(), oy + num()], [ox + num(), oy + num()]);
        break;
      }
    }
  }

  parsed.set(d, segments);
  return segments;
}

/** Pontos de uma curva, sem repetir o inicial. */
function sampleCubic(p0: Point, p1: Point, p2: Point, p3: Point): Point[] {
  const points: Point[] = [];
  for (let step = 1; step <= CURVE_STEPS; step++) points.push(cubicPoint(p0, p1, p2, p3, step / CURVE_STEPS));
  return points;
}

/**
 * O caminho como uma linha quebrada (lista de pontos), na ordem em que é desenhado.
 * Um traço do KanjiVG tem um único "M", então o resultado é uma linha contínua.
 */
export function flattenPath(d: string): Point[] {
  const points: Point[] = [];
  for (const seg of parsePath(d)) {
    if (seg.kind === 'move') points.push(seg.to);
    else if (seg.kind === 'line') points.push(seg.to);
    else points.push(...sampleCubic(seg.p0, seg.p1, seg.p2, seg.p3));
  }
  return points;
}

const lengthCache = new Map<string, number>();

export function pathLength(d: string): number {
  const cached = lengthCache.get(d);
  if (cached !== undefined) return cached;
  let length = 0;
  for (const seg of parsePath(d)) {
    if (seg.kind === 'line') length += dist(seg.from, seg.to);
    else if (seg.kind === 'cubic') {
      let prev = seg.p0;
      for (const p of sampleCubic(seg.p0, seg.p1, seg.p2, seg.p3)) {
        length += dist(prev, p);
        prev = p;
      }
    }
  }
  lengthCache.set(d, length);
  return length;
}

/** Início e fim do caminho. */
export function pathEndpoints(d: string): { start: Point; end: Point } {
  const points = flattenPath(d);
  const start = points[0];
  const end = points[points.length - 1];
  if (!start || !end) throw new Error(`Caminho SVG vazio: ${d}`);
  return { start, end };
}
