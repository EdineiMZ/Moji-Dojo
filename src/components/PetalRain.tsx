import { useEffect, useMemo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { useMotionEnabled } from './motion';

const PETAL_COLORS = ['#FFC1D6', '#FFD6E4', '#FFADC8', '#FFE3EE'] as const;

interface PetalConfig {
  /** Posição horizontal, de 0 a 1 da largura. */
  x: number;
  size: number;
  delay: number;
  duration: number;
  /** Quanto a pétala balança para os lados, em px. */
  sway: number;
  color: string;
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);

function makePetals(count: number): PetalConfig[] {
  return Array.from({ length: count }, (_, i) => ({
    x: rand(0, 1),
    size: rand(12, 22),
    delay: rand(0, 5000),
    duration: rand(5000, 8500),
    sway: rand(14, 36),
    color: PETAL_COLORS[i % PETAL_COLORS.length] ?? PETAL_COLORS[0],
  }));
}

function Petal({ config, width, height }: { config: PetalConfig; width: number; height: number }) {
  const fall = useSharedValue(0);
  const sway = useSharedValue(0);
  const spin = useSharedValue(0);

  useEffect(() => {
    fall.value = withDelay(
      config.delay,
      withRepeat(withTiming(1, { duration: config.duration, easing: Easing.linear }), -1, false),
    );
    sway.value = withRepeat(
      withTiming(1, { duration: config.duration / 2.4, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    spin.value = withRepeat(withTiming(1, { duration: config.duration / 1.6, easing: Easing.linear }), -1, false);
  }, [config, fall, sway, spin]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: -config.size * 2 + fall.value * (height + config.size * 4) },
      { translateX: (sway.value * 2 - 1) * config.sway },
      { rotate: `${spin.value * 360}deg` },
    ],
  }));

  return (
    <Animated.View style={[styles.petal, { left: config.x * width, top: 0 }, style]}>
      <Svg width={config.size} height={config.size} viewBox="0 0 20 20">
        <Path
          d="M10 1.5 C14.5 1.5 17.5 6 15.5 11 C14.5 14 11.5 17 10 19 C8.5 17 5.5 14 4.5 11 C2.5 6 5.5 1.5 10 1.5 Z"
          fill={config.color}
          opacity={0.9}
        />
      </Svg>
    </Animated.View>
  );
}

/**
 * Chuva de pétalas de sakura por cima da tela (não intercepta toques).
 * Com "reduzir movimento" não aparece.
 */
export function PetalRain({ count = 16 }: { count?: number }) {
  const motion = useMotionEnabled();
  const { width, height } = useWindowDimensions();
  const petals = useMemo(() => makePetals(count), [count]);

  if (!motion) return null;
  return (
    <Animated.View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {petals.map((config, i) => (
        <Petal key={i} config={config} width={width} height={height} />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  petal: { position: 'absolute' },
});
