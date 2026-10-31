import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';

/**
 * Skins de móveis: o mesmo desenho em outras cores, trocando o tom das cores do móvel (o branco, o cinza e os traços escuros ficam).
 * Só tem skin o móvel cuja cor é uma escolha (a cama, o sofá, a banheira...), não o que tem cor própria (a água do lago, a tela da TV).
 */

export interface Skin {
  id: string;
  name: string;
  /** Quantos graus o tom gira no círculo de cores. */
  shift: number;
}

export const SKINS: readonly Skin[] = [
  { id: 'oceano', name: 'Oceano', shift: 180 },
  { id: 'matcha', name: 'Matcha', shift: 90 },
  { id: 'lavanda', name: 'Lavanda', shift: 270 },
];

/** Os móveis que têm skins. */
export const SKINNABLE: ReadonlySet<string> = new Set([
  'cama',
  'tapete',
  'abajur',
  'estante-quarto',
  'janela',
  'banco',
  'mesa',
  'livros',
  'lanterna',
  'vasos',
  'mesinha-cha',
  'sofa',
  'kotatsu',
  'almofadas',
  'geladeira',
  'banqueta',
  'banheira',
  'banquinho',
  'toalhas',
]);

export const findSkin = (id: string): Skin | undefined => SKINS.find((s) => s.id === id);

/** A chave de uma skin comprada: "móvel:skin". */
export const skinKey = (furnitureId: string, skinId: string): string => `${furnitureId}:${skinId}`;

/** Quanto custa uma skin: metade do preço do móvel, no mínimo 60 pétalas. */
export const skinPriceFor = (furniturePrice: number): number => Math.max(60, Math.round((furniturePrice * 0.5) / 10) * 10);

// --- cores ---

const HEX = /^#([0-9a-f]{6})$/i;

/** Gira o tom de uma cor "#RRGGBB"; cores sem tom (branco, cinza), muito claras ou muito escuras ficam como estão. */
export function shiftHex(hex: string, degrees: number): string {
  const match = HEX.exec(hex);
  if (!match) return hex;
  const n = parseInt(match[1] as string, 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (s < 0.15 || l > 0.93 || l < 0.32) return hex;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
  }
  const hue = (((h * 60 + degrees) % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = l - c / 2;
  const [r1, g1, b1] = hue < 60 ? [c, x, 0] : hue < 120 ? [x, c, 0] : hue < 180 ? [0, c, x] : hue < 240 ? [0, x, c] : hue < 300 ? [x, 0, c] : [c, 0, x];
  const to = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
  return `#${to(r1)}${to(g1)}${to(b1)}`.toUpperCase();
}

/** Refaz um desenho com o tom das cores (`fill`) girado. */
export function recolor(node: ReactNode, degrees: number): ReactNode {
  if (degrees === 0) return node;
  return Children.map(node, (child) => {
    if (!isValidElement(child)) return child;
    const element = child as ReactElement<{ fill?: unknown; children?: ReactNode }>;
    const props: { fill?: string; children?: ReactNode } = {};
    if (typeof element.props.fill === 'string') props.fill = shiftHex(element.props.fill, degrees);
    if (element.props.children !== undefined) props.children = recolor(element.props.children, degrees);
    return cloneElement(element, props);
  });
}
