import { Text, type TextProps, type TextStyle } from 'react-native';
import { fonts, fontSizes, useTheme, type Palette } from '@/theme';

export type TextVariant = 'body' | 'caption' | 'title' | 'headline' | 'glyph';
type TextColor = keyof Pick<Palette, 'ink' | 'muted' | 'primary' | 'lilac' | 'sky' | 'ok' | 'bad' | 'warn' | 'onPrimary'>;

interface AppTextProps extends TextProps {
  variant?: TextVariant;
  color?: TextColor;
  center?: boolean;
}

const variantStyles: Record<TextVariant, TextStyle> = {
  body: { fontFamily: fonts.regular, fontSize: fontSizes.body, lineHeight: 24 },
  caption: { fontFamily: fonts.regular, fontSize: fontSizes.caption, lineHeight: 18 },
  title: { fontFamily: fonts.bold, fontSize: fontSizes.title, lineHeight: 30 },
  headline: { fontFamily: fonts.bold, fontSize: fontSizes.headline, lineHeight: 36 },
  glyph: { fontFamily: fonts.bold, fontSize: fontSizes.glyph, lineHeight: fontSizes.glyph * 1.15 },
};

/**
 * Até quanto a fonte do sistema pode crescer (tamanho de fonte grande nas configurações do Android). Texto corrido cresce bastante;
 * títulos e os caracteres grandes do quiz crescem menos, senão estouram os cartões.
 */
const MAX_SCALE: Record<TextVariant, number> = { body: 1.8, caption: 1.8, title: 1.5, headline: 1.4, glyph: 1.2 };

/** Texto com a fonte e as cores do tema. Use no lugar do Text puro. */
export function AppText({ variant = 'body', color = 'ink', center, style, ...rest }: AppTextProps) {
  const { colors } = useTheme();
  // Rosa e âmbar como texto usam a versão com contraste (no tema claro, o puro fica claro demais).
  const textColor = color === 'primary' ? colors.primaryText : color === 'warn' ? colors.warnText : colors[color];
  return (
    <Text
      maxFontSizeMultiplier={MAX_SCALE[variant]}
      style={[variantStyles[variant], { color: textColor }, center && { textAlign: 'center' }, style]}
      {...rest}
    />
  );
}

/** Negrito dentro de um texto: <Bold>palavra</Bold>. */
export function Bold({ style, ...rest }: TextProps) {
  return <Text style={[{ fontFamily: fonts.bold }, style]} {...rest} />;
}
