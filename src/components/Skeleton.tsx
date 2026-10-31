import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { radii, spacing, useTheme } from '@/theme';
import { useMotionEnabled } from './motion';

/** Larguras (em %) das barras de texto: variam para parecer um parágrafo de verdade. */
const LINE_WIDTHS = ['92%', '78%', '85%', '60%'] as const;

/**
 * Esqueleto de carregamento: cartões cinzentos que pulsam devagar no lugar de uma lista que ainda está sendo montada.
 * Com "reduzir movimento" ligado, fica parado.
 */
export function Skeleton({ cards = 3 }: { cards?: number }) {
  const { colors } = useTheme();
  const motion = useMotionEnabled();
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = motion ? withRepeat(withTiming(0.55, { duration: 800 }), -1, true) : 1;
  }, [motion, pulse]);

  const fade = useAnimatedStyle(() => ({ opacity: pulse.value }));
  const bar = { backgroundColor: colors.line };

  return (
    <Animated.View accessible accessibilityLabel="Carregando" accessibilityRole="progressbar" style={[styles.root, fade]}>
      {Array.from({ length: cards }, (_, i) => (
        <View key={i} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          <View style={[styles.title, bar]} />
          {LINE_WIDTHS.slice(0, 3).map((width, j) => (
            <View key={j} style={[styles.line, bar, { width }]} />
          ))}
        </View>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.md },
  card: { gap: spacing.sm, padding: spacing.lg, borderRadius: radii.lg, borderWidth: 1 },
  title: { height: 18, width: '45%', borderRadius: radii.md },
  line: { height: 12, borderRadius: radii.md },
});
