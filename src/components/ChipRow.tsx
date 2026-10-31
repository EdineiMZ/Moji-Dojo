import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View, type LayoutChangeEvent, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { fonts, radii, spacing, useTheme } from '@/theme';
import { AppText } from './AppText';
import { Icon, splitIconLabel } from './Icon';
import { PressableScale } from './PressableScale';

interface ChipRowProps<T extends string> {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  /** Mostra todas as opções de uma vez, quebrando em linhas, em vez de rolar na horizontal. */
  wrap?: boolean;
}

/** Largura da névoa que avisa que há mais chips para o lado. */
const FADE_WIDTH = 36;
/** Folga (em dp) para considerar que chegou ao começo ou ao fim. */
const EDGE = 4;

/** `#RRGGBB` com transparência, para a névoa sumir sem escurecer. */
const withAlpha = (hex: string, alpha: number): string => {
  const value = hex.replace('#', '');
  const full = value.length === 3 ? value.replace(/(.)/g, '$1$1') : value;
  const n = parseInt(full, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

/**
 * Escolha de uma opção entre várias, em chips que rolam na horizontal (ex.: categorias). Quando há mais chips para
 * rolar, uma névoa e uma seta na borda avisam disso; o chip escolhido sempre rola para o meio, inteiro à vista.
 */
export function ChipRow<T extends string>({ options, value, onChange, wrap = false }: ChipRowProps<T>) {
  const { colors } = useTheme();
  const [viewport, setViewport] = useState(0);
  const [content, setContent] = useState(0);
  const [offset, setOffset] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  // Onde cada chip está (x e largura), para rolar até o escolhido e nunca deixá-lo sob a névoa.
  const spots = useRef(new Map<string, { x: number; width: number }>());

  const onLayout = (e: LayoutChangeEvent) => setViewport(e.nativeEvent.layout.width);
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => setOffset(e.nativeEvent.contentOffset.x);

  const overflows = !wrap && content > viewport + EDGE;
  const moreRight = overflows && offset + viewport < content - EDGE;
  const moreLeft = overflows && offset > EDGE;
  const transparent = withAlpha(colors.background, 0);
  const solid = withAlpha(colors.background, 0.95);

  useEffect(() => {
    const spot = spots.current.get(value);
    if (wrap || !spot || viewport === 0) return;
    const target = Math.max(0, spot.x + spot.width / 2 - viewport / 2);
    scrollRef.current?.scrollTo({ x: target, animated: true });
  }, [value, viewport, content, wrap]);

  const renderChip = (opt: { value: T; label: string }) => {
    const selected = opt.value === value;
    const { icon, text } = splitIconLabel(opt.label);
    return (
      <PressableScale
        key={opt.value}
        accessibilityRole="tab"
        accessibilityState={{ selected }}
        onPress={() => onChange(opt.value)}
        onLayout={(e: LayoutChangeEvent) => spots.current.set(opt.value, { x: e.nativeEvent.layout.x, width: e.nativeEvent.layout.width })}
        haptic
        style={[
          styles.chip,
          { backgroundColor: selected ? colors.primary : colors.surface, borderColor: selected ? colors.primary : colors.line },
        ]}
      >
        <View style={styles.chipContent}>
          {icon ? <Icon name={icon} size={20} color={selected ? colors.onPrimary : colors.ink} /> : null}
          <AppText color={selected ? 'onPrimary' : 'ink'} style={{ fontFamily: fonts.bold }}>
            {text}
          </AppText>
        </View>
      </PressableScale>
    );
  };

  if (wrap) return <View style={styles.wrap}>{options.map(renderChip)}</View>;

  return (
    <View onLayout={onLayout}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        onContentSizeChange={(w) => setContent(w)}
        onScroll={onScroll}
        scrollEventThrottle={32}
      >
        {options.map(renderChip)}
      </ScrollView>
      {moreLeft ? (
        <LinearGradient pointerEvents="none" colors={[solid, transparent]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.fade, styles.left]}>
          <AppText color="muted" style={styles.arrow}>
            ‹
          </AppText>
        </LinearGradient>
      ) : null}
      {moreRight ? (
        <LinearGradient pointerEvents="none" colors={[transparent, solid]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.fade, styles.right]}>
          <AppText color="muted" style={styles.arrow}>
            ›
          </AppText>
        </LinearGradient>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, paddingVertical: spacing.xs },
  // Folga no fim para o último chip poder sair de baixo da névoa.
  row: { gap: spacing.sm, paddingVertical: spacing.xs, paddingRight: FADE_WIDTH },
  chip: { borderRadius: radii.pill, borderWidth: 1.5, minHeight: 48, justifyContent: 'center', paddingHorizontal: spacing.lg },
  chipContent: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  fade: { position: 'absolute', top: 0, bottom: 0, width: FADE_WIDTH, justifyContent: 'center' },
  left: { left: 0, alignItems: 'flex-start' },
  right: { right: 0, alignItems: 'flex-end' },
  arrow: { fontSize: 28, lineHeight: 32 },
});
