import { Text, type TextProps, type TextStyle } from 'react-native';
import { fonts, fontSizes, useTheme, type Palette } from '@/theme';

export type TextVariant = 'body' | 'caption' | 'title' | 'headline' | 'glyph';
type TextColor = keyof Pick<Palette, 'ink' | 'muted' | 'primary' | 'lilac' | 'sky' | 'ok' | 'bad' | 'onPrimary'>;

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

/** Texto com a fonte e as cores do tema. Use no lugar do Text puro. */
export function AppText({ variant = 'body', color = 'ink', center, style, ...rest }: AppTextProps) {
  const { colors } = useTheme();
  return (
    <Text
      style={[variantStyles[variant], { color: colors[color] }, center && { textAlign: 'center' }, style]}
      {...rest}
    />
  );
}

/** Negrito dentro de um texto: <Bold>palavra</Bold>. */
export function Bold({ style, ...rest }: TextProps) {
  return <Text style={[{ fontFamily: fonts.bold }, style]} {...rest} />;
}
