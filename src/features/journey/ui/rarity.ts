import type { Palette } from '@/theme';
import type { Rarity } from '../items';

export interface RarityStyle {
  /** Cor do texto e da borda. */
  fg: string;
  /** Cor de fundo suave. */
  bg: string;
  /** Quantas "estrelinhas" mostrar ao lado do nome. */
  stars: string;
}

/** As cores de cada raridade, tiradas da paleta do tema (funcionam no claro e no escuro). */
export function rarityStyle(rarity: Rarity, colors: Palette): RarityStyle {
  switch (rarity) {
    case 'common':
      return { fg: colors.muted, bg: colors.surface, stars: '' };
    case 'rare':
      return { fg: colors.sky, bg: colors.skySoft, stars: '★' };
    case 'epic':
      return { fg: colors.lilac, bg: colors.lilacSoft, stars: '★★' };
    case 'legendary':
      return { fg: colors.warn, bg: colors.primarySoft, stars: '★★★' };
  }
}
