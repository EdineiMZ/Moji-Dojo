import { useEffect, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { fonts, fontSizes, radii, spacing, useTheme } from '@/theme';
import { AppText } from './AppText';
import { SPRING, useMotionEnabled } from './motion';
import { PressableScale } from './PressableScale';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
}

/** Seletor de uma opção entre poucas (ex.: Hiragana / Katakana / Kanji), com um indicador que desliza. */
export function SegmentedControl<T extends string>({ options, value, onChange }: SegmentedControlProps<T>) {
  const { colors } = useTheme();
  const motion = useMotionEnabled();
  const [rowWidth, setRowWidth] = useState(0);
  const index = Math.max(0, options.findIndex((o) => o.value === value));
  const segmentWidth = rowWidth / Math.max(options.length, 1);

  const x = useSharedValue(0);
  useEffect(() => {
    const target = index * segmentWidth;
    x.value = motion && rowWidth > 0 ? withSpring(target, SPRING) : target;
  }, [index, segmentWidth, rowWidth, motion, x]);

  const indicator = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return (
    <View style={[styles.track, { backgroundColor: colors.surface, borderColor: colors.line }]}>
      <View style={styles.row} onLayout={(e: LayoutChangeEvent) => setRowWidth(e.nativeEvent.layout.width)}>
        {rowWidth > 0 ? (
          <Animated.View
            pointerEvents="none"
            style={[styles.indicator, { width: segmentWidth, backgroundColor: colors.primary }, indicator]}
          />
        ) : null}
        {options.map((opt) => {
          const selected = opt.value === value;
          return (
            <PressableScale
              key={opt.value}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              onPress={() => onChange(opt.value)}
              scaleTo={0.97}
              haptic
              style={styles.segment}
            >
              <AppText
                center
                style={{ fontFamily: fonts.bold, fontSize: fontSizes.body - 1 }}
                color={selected ? 'onPrimary' : 'muted'}
              >
                {opt.label}
              </AppText>
            </PressableScale>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: { borderRadius: radii.pill, borderWidth: 1.5, padding: spacing.xs },
  row: { flexDirection: 'row' },
  indicator: { position: 'absolute', top: 0, bottom: 0, left: 0, borderRadius: radii.pill },
  segment: { flex: 1, minHeight: 44, justifyContent: 'center', borderRadius: radii.pill },
});
