/** Paleta do app. Todas as cores usadas na interface vêm daqui. */
export interface Palette {
  /** Fundo da tela. */
  background: string;
  /** Degradê do fundo (topo → base). */
  backgroundGradient: readonly [string, string];
  /** Cartões e superfícies elevadas. */
  surface: string;
  ink: string;
  muted: string;
  line: string;
  /** Rosa sakura: ação principal. */
  primary: string;
  /** O rosa quando é texto ou ícone sobre fundo claro (o `primary` não tem contraste suficiente ali). */
  primaryText: string;
  primarySoft: string;
  onPrimary: string;
  /** Lilás: destaque secundário. */
  lilac: string;
  lilacSoft: string;
  /** Azul-céu: informação. */
  sky: string;
  skySoft: string;
  ok: string;
  okSoft: string;
  bad: string;
  badSoft: string;
  warn: string;
  /** O âmbar quando é texto sobre fundo claro (o `warn` puro tem menos de 3:1 ali). */
  warnText: string;
  /** Contorno de campos de texto e controles: pelo menos 3:1 com o fundo e com o cartão (WCAG 1.4.11). Calculado por tema. */
  field: string;
  /** Cor das marcas dos gráficos (linhas e barras): contraste de pelo menos 3:1 com o cartão. */
  chart: string;
  /** Cor da sombra suave dos cartões. */
  shadow: string;
}

const lightBase: Omit<Palette, 'field'> = {
  background: '#FFF8F3',
  backgroundGradient: ['#FFF1F5', '#EEF6FF'],
  surface: '#FFFFFF',
  ink: '#3B2F4A',
  muted: '#726481',
  line: '#F1E2EA',
  primary: '#F2799F',
  primaryText: '#C42A5F',
  primarySoft: '#FFE3EE',
  onPrimary: '#2A1030',
  lilac: '#A78BEA',
  lilacSoft: '#EEE8FF',
  sky: '#6DB9F2',
  skySoft: '#E1F3FF',
  ok: '#247B59',
  okSoft: '#DFF5EA',
  bad: '#CA2443',
  badSoft: '#FFE4E9',
  warn: '#D98E1F',
  warnText: '#8A5600',
  chart: '#D4487A',
  shadow: '#B58AA5',
};

/** Modo escuro: céu noturno de Tóquio. */
const darkBase: Omit<Palette, 'field'> = {
  background: '#12122B',
  backgroundGradient: ['#1B1740', '#0D1230'],
  surface: '#1F1F45',
  ink: '#F3EEFF',
  muted: '#A9A3CB',
  line: '#33336B',
  primary: '#FF9EC4',
  primaryText: '#FF9EC4',
  primarySoft: '#4A2A4F',
  onPrimary: '#2A1030',
  lilac: '#B9A4FF',
  lilacSoft: '#35296B',
  sky: '#7CC4FF',
  skySoft: '#1E3A66',
  ok: '#5FD4A0',
  okSoft: '#17402F',
  bad: '#FF8498',
  badSoft: '#4A1F2C',
  warn: '#F2BC5E',
  warnText: '#F2BC5E',
  chart: '#FF9EC4',
  shadow: '#000000',
};

const channel = (hex: string, i: number) => parseInt(hex.slice(i, i + 2), 16);
const luminance = (hex: string): number => {
  const [r = 0, g = 0, b = 0] = [1, 3, 5].map((i) => channel(hex, i) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrastOf = (a: string, b: string): number => {
  const [hi = 0, lo = 0] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const mix = (from: string, to: string, t: number): string =>
  `#${[1, 3, 5].map((i) => Math.round(channel(from, i) * (1 - t) + channel(to, i) * t).toString(16).padStart(2, '0')).join('')}`;

/** O tom mais suave entre o fundo e o `muted` que ainda dá 3:1 com o fundo e com o cartão: contorno visível sem pesar no visual. */
function fieldColor(p: Omit<Palette, 'field'>): string {
  for (let t = 0.3; t < 1; t += 0.05) {
    const c = mix(p.background, p.muted, t);
    if (contrastOf(c, p.background) >= 3.05 && contrastOf(c, p.surface) >= 3.05) return c;
  }
  return p.muted;
}

const withField = (p: Omit<Palette, 'field'>): Palette => ({ ...p, field: fieldColor(p) });

export const lightPalette: Palette = withField(lightBase);
export const darkPalette: Palette = withField(darkBase);

/** Temas de cor: o "tema" claro/escuro continua à parte (cada tema de cor tem as duas versões). */
export type ColorTheme = 'sakura' | 'matcha' | 'oceano' | 'lavanda';

export const COLOR_THEMES: readonly { id: ColorTheme; label: string; emoji: string }[] = [
  { id: 'sakura', label: 'Sakura', emoji: '🌸' },
  { id: 'matcha', label: 'Matcha', emoji: '🍵' },
  { id: 'oceano', label: 'Oceano', emoji: '🌊' },
  { id: 'lavanda', label: 'Lavanda', emoji: '💜' },
];

export const DEFAULT_COLOR_THEME: ColorTheme = 'sakura';

type Accent = Pick<Palette, 'background' | 'backgroundGradient' | 'line' | 'primary' | 'primaryText' | 'primarySoft' | 'onPrimary' | 'chart' | 'shadow'>;
type Variants = { light: Accent; dark: Accent & Pick<Palette, 'surface' | 'ink' | 'muted'> };

/** Só o que muda de um tema de cor para outro; o resto (verde, vermelho, âmbar, lilás e azul de apoio) fica igual. */
const ACCENTS: Readonly<Record<Exclude<ColorTheme, 'sakura'>, Variants>> = {
  matcha: {
    light: { background: '#F6FBF7', backgroundGradient: ['#EEF9F2', '#EEF6FF'], line: '#DCEBDF', primary: '#6CCB97', primaryText: '#1D6B45', primarySoft: '#DDF3E6', onPrimary: '#0C2A1D', chart: '#2E8B5B', shadow: '#7FB394' },
    dark: { background: '#0F1F1A', backgroundGradient: ['#14302A', '#0B1A16'], surface: '#18302A', ink: '#EAF7F0', muted: '#9FC3B2', line: '#2C5446', primary: '#7FE0A8', primaryText: '#7FE0A8', primarySoft: '#1E4A38', onPrimary: '#0C2A1D', chart: '#7FE0A8', shadow: '#000000' },
  },
  oceano: {
    light: { background: '#F3F8FF', backgroundGradient: ['#EAF4FF', '#F4F0FF'], line: '#DDE8F5', primary: '#62AEF2', primaryText: '#1B5FA8', primarySoft: '#DDEEFF', onPrimary: '#0B1F3A', chart: '#2F7FCC', shadow: '#8AA9C8' },
    dark: { background: '#0E1630', backgroundGradient: ['#13224A', '#0A1128'], surface: '#182450', ink: '#EEF3FF', muted: '#A5B5DA', line: '#2D3F78', primary: '#7DB8FF', primaryText: '#7DB8FF', primarySoft: '#223A6B', onPrimary: '#0B1F3A', chart: '#7DB8FF', shadow: '#000000' },
  },
  lavanda: {
    light: { background: '#FAF6FF', backgroundGradient: ['#F3ECFF', '#EEF6FF'], line: '#E6DDF3', primary: '#A98BEF', primaryText: '#5B33B0', primarySoft: '#EEE8FF', onPrimary: '#20103A', chart: '#7E57C8', shadow: '#A58FC4' },
    dark: { background: '#16112B', backgroundGradient: ['#211848', '#100C26'], surface: '#231B48', ink: '#F4EFFF', muted: '#B3A9D6', line: '#3B3170', primary: '#BCA6FF', primaryText: '#BCA6FF', primarySoft: '#3A2D70', onPrimary: '#20103A', chart: '#BCA6FF', shadow: '#000000' },
  },
};

export const isColorTheme = (value: unknown): value is ColorTheme => COLOR_THEMES.some((t) => t.id === value);

/** A paleta de um tema de cor, no modo claro ou escuro. */
export function paletteFor(theme: ColorTheme, isDark: boolean): Palette {
  const base = isDark ? darkPalette : lightPalette;
  if (theme === 'sakura') return base;
  const accent = ACCENTS[theme];
  return withField({ ...base, ...(isDark ? accent.dark : accent.light) });
}
