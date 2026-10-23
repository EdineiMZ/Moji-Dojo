import type { ReactElement } from 'react';
import { Circle, G, Path } from 'react-native-svg';

/** Peças comuns dos desenhos do Mochi (traço, estrela, flor, laço). */
export const LINE = '#4A3B5C';

export type Art = () => ReactElement;

export const stroke = { stroke: LINE, strokeWidth: 3.5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

/** Estrela de 4 pontas centrada em (x, y). */
export const star = (x: number, y: number, r: number) =>
  `M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r} Z`;

/** Flor de cinco pétalas centrada em (x, y). */
export function Flower({ x, y, r, petal, center = '#FFD166' }: { x: number; y: number; r: number; petal: string; center?: string }) {
  const points = Array.from({ length: 5 }, (_, i) => {
    const a = (i * 72 - 90) * (Math.PI / 180);
    return { cx: x + Math.cos(a) * r * 0.9, cy: y + Math.sin(a) * r * 0.9 };
  });
  return (
    <G>
      {points.map((p, i) => (
        <Circle key={i} cx={p.cx} cy={p.cy} r={r * 0.62} fill={petal} stroke={LINE} strokeWidth={2} />
      ))}
      <Circle cx={x} cy={y} r={r * 0.4} fill={center} stroke={LINE} strokeWidth={2} />
    </G>
  );
}

export function Bow({ x, y, scale = 1, color }: { x: number; y: number; scale?: number; color: string }) {
  return (
    <G transform={`translate(${x} ${y}) scale(${scale})`}>
      <Path d="M0 0 L-22 -12 L-22 12 Z" fill={color} {...stroke} />
      <Path d="M0 0 L22 -12 L22 12 Z" fill={color} {...stroke} />
      <Circle cx={0} cy={0} r={5} fill={color} {...stroke} />
    </G>
  );
}

