import { useEffect, useMemo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { useTheme } from '@/theme';
import { useMotionEnabled } from './motion';

const DURATION_S = 2.4;
const GRAVITY = 900;

interface PieceConfig {
  /** Velocidade inicial em px/s (vy negativo = para cima). */
  vx: number;
  vy: number;
  spin: number;
  width: number;
  height: number;
  color: string;
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);

function makePieces(count: number, colors: readonly string[]): PieceConfig[] {
  return Array.from({ length: count }, (_, i) => {
    // Leque aberto para cima: de -160° a -20°.
    const angle = (rand(-160, -20) * Math.PI) / 180;
    const speed = rand(260, 620);
    return {
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      spin: rand(-720, 720),
      width: rand(6, 10),
      height: rand(10, 16),
      color: colors[i % colors.length] ?? '#FF9EC4',
    };
  });
}

function Piece({ config, progress }: { config: PieceConfig; progress: SharedValue<number> }) {
  const style = useAnimatedStyle(() => {
    const t = progress.value * DURATION_S;
    return {
      opacity: Math.min(1, Math.max(0, (1 - progress.value) / 0.25)),
      transform: [
        { translateX: config.vx * t },
        { translateY: config.vy * t + 0.5 * GRAVITY * t * t },
        { rotate: `${config.spin * t}deg` },
      ],
    };
  });
  return (
    <Animated.View
      style={[
        styles.piece,
        { width: config.width, height: config.height, backgroundColor: config.color },
        style,
      ]}
    />
  );
}

/** Explosão de confete que sobe e cai uma vez, a partir do alto da tela. */
export function Confetti({ count = 40 }: { count?: number }) {
  const { colors } = useTheme();
  const motion = useMotionEnabled();
  const { width, height } = useWindowDimensions();
  const progress = useSharedValue(0);
  const pieces = useMemo(
    () => makePieces(count, [colors.primary, colors.lilac, colors.sky, colors.warn, colors.ok]),
    [count, colors],
  );

  useEffect(() => {
    if (!motion) return;
    progress.value = 0;
    progress.value = withTiming(1, { duration: DURATION_S * 1000, easing: Easing.linear });
  }, [motion, progress]);

  if (!motion) return null;
  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.origin, { left: width / 2, top: height * 0.3 }]}
    >
      {pieces.map((config, i) => (
        <Piece key={i} config={config} progress={progress} />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  origin: { position: 'absolute', width: 0, height: 0 },
  piece: { position: 'absolute', borderRadius: 2 },
});
