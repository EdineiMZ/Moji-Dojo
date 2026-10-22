import type { Point } from '@/features/strokes/svgPath';

/** Só guarda um novo ponto do dedo se ele andou pelo menos isto (unidades do quadro de 109). */
export const MIN_POINT_STEP = 0.6;

/**
 * Converte o traço atual, guardado como texto de caminho ("M10.0 20.0 L11.5 22.0 ..."), em pontos.
 * O pad monta o texto na thread de UI (barato a cada movimento) e só converte ao soltar o dedo.
 */
export function parsePolyline(d: string): Point[] {
  const numbers = d.match(/-?\d+(?:\.\d+)?/g) ?? [];
  const points: Point[] = [];
  for (let i = 0; i + 1 < numbers.length; i += 2) {
    points.push([Number(numbers[i]), Number(numbers[i + 1])]);
  }
  return points;
}

/** Linha quebrada como caminho SVG, para desenhar os traços já feitos. */
export function polylinePath(points: readonly Point[]): string {
  return points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
}
