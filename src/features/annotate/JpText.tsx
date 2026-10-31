import { Fragment, useMemo, useState, type ReactNode } from 'react';
import { Text, type TextProps } from 'react-native';
import { AppText } from '@/components/AppText';
import { useSettingsStore } from '@/store';
import { fonts, useTheme } from '@/theme';
import { annotate } from './annotate';

/**
 * Texto de explicação com o japonês acompanhado de como se lê (romaji) e, nas palavras do vocabulário, do que significa.
 * Segue o ajuste de romaji: sempre, só ao tocar no trecho, ou nunca. Vai dentro de um <Text>.
 */
export function JpInline({ text }: { text: string }) {
  const mode = useSettingsStore((s) => s.romajiMode);
  const { colors } = useTheme();
  const pieces = useMemo(() => annotate(text), [text]);
  const [shown, setShown] = useState<ReadonlySet<number>>(new Set());

  if (mode === 'never') return <>{text}</>;
  const toggle = (i: number) =>
    setShown((current) => {
      const next = new Set(current);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <>
      {pieces.map((piece, i) => {
        if (piece.kind === 'text') return <Fragment key={i}>{piece.text}</Fragment>;
        const next = pieces[i + 1];
        // Quando o texto já traduz logo depois, "(parece que vai chover)", o significado da palavra só repetiria.
        const translated = next?.kind === 'text' && /^\s*[(（]/.test(next.text);
        const aid = [piece.romaji, translated ? undefined : piece.meaning].filter(Boolean).join(' · ');
        if (!aid) return <Fragment key={i}>{piece.text}</Fragment>;
        const visible = mode === 'always' || shown.has(i);
        return (
          <Text key={i} onPress={mode === 'tap' ? () => toggle(i) : undefined} accessibilityHint={mode === 'tap' ? 'Mostra como se lê' : undefined}>
            {piece.text}
            {visible ? <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.muted }}>{` [${aid}]`}</Text> : mode === 'tap' ? <Text style={{ color: colors.primaryText }}>{' ⓘ'}</Text> : null}
          </Text>
        );
      })}
    </>
  );
}

/** Um texto de explicação (um AppText) com a leitura do japonês. Só aceita texto: junta os pedaços de `children` que são texto. */
export function JpText({ children, ...rest }: Omit<React.ComponentProps<typeof AppText>, 'children'> & { children?: ReactNode }) {
  const parts = Array.isArray(children) ? children : [children];
  // Com algo que não é texto dentro (um <Bold>, por exemplo), não dá para juntar: mostra como estava.
  const plain = parts.every((c) => c === undefined || c === null || c === false || typeof c === 'string' || typeof c === 'number');
  if (!plain) return <AppText {...(rest as TextProps)}>{children}</AppText>;
  const text = parts.map((c) => (typeof c === 'string' || typeof c === 'number' ? String(c) : '')).join('');
  return (
    <AppText {...(rest as TextProps)}>
      <JpInline text={text} />
    </AppText>
  );
}
