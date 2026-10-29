import { COLOR_THEMES, darkPalette, lightPalette, paletteFor, type Palette } from './colors';

/** Luminância relativa e razão de contraste do WCAG 2.x. */
const luminance = (hex: string): number => {
  const [r = 0, g = 0, b = 0] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string): number => {
  const [hi = 0, lo = 0] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/** Texto (cor, fundo) usado no app: precisa de 4,5:1 (WCAG AA para texto normal). */
const TEXT_PAIRS: readonly [keyof Palette, keyof Palette][] = [
  ['ink', 'background'],
  ['ink', 'surface'],
  ['ink', 'primarySoft'],
  ['ink', 'lilacSoft'],
  ['muted', 'background'],
  ['muted', 'surface'],
  ['muted', 'primarySoft'],
  ['muted', 'lilacSoft'],
  ['muted', 'skySoft'],
  ['onPrimary', 'primary'],
  ['primaryText', 'background'],
  ['primaryText', 'surface'],
  ['primaryText', 'primarySoft'],
  ['ok', 'okSoft'],
  ['ok', 'surface'],
  ['ok', 'background'],
  ['bad', 'badSoft'],
  ['bad', 'surface'],
  ['bad', 'background'],
];

const ALL_PALETTES: readonly [string, Palette][] = [
  ['claro', lightPalette],
  ['escuro', darkPalette],
  ...COLOR_THEMES.flatMap((t) => [
    [`${t.label} claro`, paletteFor(t.id, false)] as [string, Palette],
    [`${t.label} escuro`, paletteFor(t.id, true)] as [string, Palette],
  ]),
];

describe.each(ALL_PALETTES)('contraste do tema %s', (_name, palette) => {
  it.each(TEXT_PAIRS)('%s sobre %s tem pelo menos 4,5:1', (fg, bg) => {
    expect(contrast(palette[fg] as string, palette[bg] as string)).toBeGreaterThanOrEqual(4.5);
  });
});
