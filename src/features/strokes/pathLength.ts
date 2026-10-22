/**
 * Comprimento de um caminho SVG, calculado em JavaScript.
 * A animação "traço se desenhando" precisa dele (strokeDasharray); calcular aqui
 * evita depender de medir o elemento na tela e funciona nos testes.
 * Suporta os comandos M L H V C S Z (maiúsculos e minúsculos), os usados pelo KanjiVG.
 */
type Point = readonly [number, number];

const CURVE_STEPS = 24;
const cache = new Map<string, number>();

const dist = (a: Point, b: Point): number => Math.hypot(b[0] - a[0], b[1] - a[1]);

function cubicPoint(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]];
}

function cubicLength(p0: Point, p1: Point, p2: Point, p3: Point): number {
  let length = 0;
  let prev = p0;
  for (let i = 1; i <= CURVE_STEPS; i++) {
    const next = cubicPoint(p0, p1, p2, p3, i / CURVE_STEPS);
    length += dist(prev, next);
    prev = next;
  }
  return length;
}

/** Quantos números cada comando consome por repetição. */
const ARITY: Readonly<Record<string, number>> = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Z: 0 };

export function pathLength(d: string): number {
  const cached = cache.get(d);
  if (cached !== undefined) return cached;

  const tokens = d.match(/[a-zA-Z]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/g) ?? [];
  let i = 0;
  let current: Point = [0, 0];
  let start: Point = [0, 0];
  /** Segundo ponto de controle do último C/S, para refletir no próximo S. */
  let lastControl: Point | null = null;
  let length = 0;
  let command = '';

  const num = (): number => {
    const token = tokens[i++];
    const value = token === undefined ? NaN : Number(token);
    if (Number.isNaN(value)) throw new Error(`Caminho SVG inválido: ${d}`);
    return value;
  };

  while (i < tokens.length) {
    const token = tokens[i] as string;
    if (/[a-zA-Z]/.test(token)) {
      command = token;
      i++;
      if (command.toUpperCase() === 'Z') {
        length += dist(current, start);
        current = start;
        lastControl = null;
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
        // Pares extras depois de um M valem como L.
        command = relative ? 'l' : 'L';
        break;
      }
      case 'L': {
        const next: Point = [ox + num(), oy + num()];
        length += dist(current, next);
        current = next;
        lastControl = null;
        break;
      }
      case 'H': {
        const next: Point = [ox + num(), current[1]];
        length += dist(current, next);
        current = next;
        lastControl = null;
        break;
      }
      case 'V': {
        const next: Point = [current[0], oy + num()];
        length += dist(current, next);
        current = next;
        lastControl = null;
        break;
      }
      case 'C': {
        const c1: Point = [ox + num(), oy + num()];
        const c2: Point = [ox + num(), oy + num()];
        const end: Point = [ox + num(), oy + num()];
        length += cubicLength(current, c1, c2, end);
        current = end;
        lastControl = c2;
        break;
      }
      case 'S': {
        const c1: Point = lastControl
          ? [2 * current[0] - lastControl[0], 2 * current[1] - lastControl[1]]
          : current;
        const c2: Point = [ox + num(), oy + num()];
        const end: Point = [ox + num(), oy + num()];
        length += cubicLength(current, c1, c2, end);
        current = end;
        lastControl = c2;
        break;
      }
    }
  }

  cache.set(d, length);
  return length;
}
