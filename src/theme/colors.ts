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
  /** Cor das marcas dos gráficos (linhas e barras): contraste de pelo menos 3:1 com o cartão. */
  chart: string;
  /** Cor da sombra suave dos cartões. */
  shadow: string;
}

export const lightPalette: Palette = {
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
  chart: '#D4487A',
  shadow: '#B58AA5',
};

/** Modo escuro: céu noturno de Tóquio. */
export const darkPalette: Palette = {
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
  chart: '#FF9EC4',
  shadow: '#000000',
};
