import { useEffect } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { radii, useTheme } from '@/theme';
import { EASE_OUT, useMotionEnabled } from './motion';

interface ProgressBarProps {
  /** De 0 a 1. */
  value: number;
  height?: number;
  /** Cor do preenchimento (padrão: rosa sakura). */
  color?: string;
  style?: StyleProp<ViewStyle>;
}

/** Barra de progresso cujo preenchimento anima suavemente a cada mudança de valor. */
export function ProgressBar({ value, height = 12, color, style }: ProgressBarProps) {
  const { colors } = useTheme();
  const motion = useMotionEnabled();
  const clamped = Math.min(Math.max(value, 0), 1);
  const progress = useSharedValue(clamped);

  useEffect(() => {
    progress.value = motion ? withTiming(clamped, { duration: 550, easing: EASE_OUT }) : clamped;
  }, [clamped, motion, progress]);

  const fill = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      style={[styles.track, { height, backgroundColor: colors.line }, style]}
    >
      <Animated.View style={[styles.fill, { backgroundColor: color ?? colors.primary }, fill]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { borderRadius: radii.pill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radii.pill },
});
