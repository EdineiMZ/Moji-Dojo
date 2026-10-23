import { useState } from 'react';
import { ScrollView, StyleSheet, View, type LayoutChangeEvent, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { fonts, radii, spacing, useTheme } from '@/theme';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

interface ChipRowProps<T extends string> {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
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
 * rolar, uma névoa e uma seta na borda avisam disso.
 */
export function ChipRow<T extends string>({ options, value, onChange }: ChipRowProps<T>) {
  const { colors } = useTheme();
  const [viewport, setViewport] = useState(0);
  const [content, setContent] = useState(0);
  const [offset, setOffset] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => setViewport(e.nativeEvent.layout.width);
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => setOffset(e.nativeEvent.contentOffset.x);

  const overflows = content > viewport + EDGE;
  const moreRight = overflows && offset + viewport < content - EDGE;
  const moreLeft = overflows && offset > EDGE;
  const transparent = withAlpha(colors.background, 0);
  const solid = withAlpha(colors.background, 0.95);

  return (
    <View onLayout={onLayout}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        onContentSizeChange={(w) => setContent(w)}
        onScroll={onScroll}
        scrollEventThrottle={32}
      >
        {options.map((opt) => {
          const selected = opt.value === value;
          return (
            <PressableScale
              key={opt.value}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              onPress={() => onChange(opt.value)}
              haptic
              style={[
                styles.chip,
                { backgroundColor: selected ? colors.primary : colors.surface, borderColor: selected ? colors.primary : colors.line },
              ]}
            >
              <AppText color={selected ? 'onPrimary' : 'ink'} style={{ fontFamily: fonts.bold }}>
                {opt.label}
              </AppText>
            </PressableScale>
          );
        })}
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
  row: { gap: spacing.sm, paddingVertical: spacing.xs },
  chip: { borderRadius: radii.pill, borderWidth: 1.5, minHeight: 48, justifyContent: 'center', paddingHorizontal: spacing.lg },
  fade: { position: 'absolute', top: 0, bottom: 0, width: FADE_WIDTH, justifyContent: 'center' },
  left: { left: 0, alignItems: 'flex-start' },
  right: { right: 0, alignItems: 'flex-end' },
  arrow: { fontSize: 28, lineHeight: 32 },
});
