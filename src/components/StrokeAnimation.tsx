import { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { G, Line, Path, Text as SvgText } from 'react-native-svg';
import type { StrokeData } from '@/data/types';
import { pathLength } from '@/features/strokes/svgPath';
import { useTheme } from '@/theme';
import { useMotionEnabled } from './motion';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedText = Animated.createAnimatedComponent(SvgText);

/** Tempo de cada traço, incluindo a pausa antes do próximo. */
const STROKE_MS = 650;
/** Parte do tempo do traço em que ele de fato se desenha; o resto é a pausa. */
const DRAW_FRACTION = 0.8;
const STROKE_WIDTH = 4;

const clamp01 = (v: number) => {
  'worklet';
  return Math.min(Math.max(v, 0), 1);
};

interface StrokeProps {
  d: string;
  index: number;
  /** Linha do tempo: o valor vai de 0 ao número de traços; o traço i desenha entre i e i + 0.8. */
  timeline: SharedValue<number>;
  color: string;
}

function AnimatedStroke({ d, index, timeline, color }: StrokeProps) {
  // +1 evita um pontinho visível no início, por causa da ponta arredondada.
  const length = pathLength(d) + 1;
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: length * (1 - clamp01((timeline.value - index) / DRAW_FRACTION)),
  }));
  return (
    <AnimatedPath
      d={d}
      animatedProps={animatedProps}
      stroke={color}
      strokeWidth={STROKE_WIDTH}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      strokeDasharray={[length, length]}
    />
  );
}

function AnimatedNumber({ label, x, y, index, timeline, color }: {
  label: number;
  x: number;
  y: number;
  index: number;
  timeline: SharedValue<number>;
  color: string;
}) {
  const animatedProps = useAnimatedProps(() => ({ opacity: clamp01((timeline.value - index) * 6) }));
  return (
    <AnimatedText
      x={x}
      y={y}
      animatedProps={animatedProps}
      fill={color}
      fontSize={7}
      fontWeight="bold"
      textAnchor="middle"
    >
      {label}
    </AnimatedText>
  );
}

interface StrokeAnimationProps {
  strokes: StrokeData;
  size: number;
  /** Mude o valor para repetir a animação ("Ver traços de novo"). */
  replayKey?: number;
}

/**
 * Mostra o caractere sendo escrito traço a traço, na ordem certa, com o número de cada
 * traço. O modelo em cinza fica por baixo. Com "reduzir movimento", mostra tudo de uma vez.
 */
export function StrokeAnimation({ strokes, size, replayKey = 0 }: StrokeAnimationProps) {
  const { colors } = useTheme();
  const motion = useMotionEnabled();
  const count = strokes.p.length;
  const timeline = useSharedValue(motion ? 0 : count);

  useEffect(() => {
    if (!motion) {
      timeline.value = count;
      return;
    }
    timeline.value = 0;
    timeline.value = withTiming(count, { duration: count * STROKE_MS, easing: Easing.linear });
  }, [strokes, count, motion, replayKey, timeline]);

  return (
    <Svg width={size} height={size} viewBox="0 0 109 109" accessibilityLabel={`Ordem dos ${count} traços`}>
      <G stroke={colors.line} strokeWidth={0.8} strokeDasharray={[3, 3]}>
        <Line x1={54.5} y1={2} x2={54.5} y2={107} />
        <Line x1={2} y1={54.5} x2={107} y2={54.5} />
      </G>
      {/* modelo completo, em cinza */}
      <G>
        {strokes.p.map((d, i) => (
          <Path
            key={`under-${i}`}
            d={d}
            stroke={colors.line}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ))}
      </G>
      {/* traços se desenhando por cima */}
      <G>
        {strokes.p.map((d, i) => (
          <AnimatedStroke key={`over-${i}`} d={d} index={i} timeline={timeline} color={colors.ink} />
        ))}
      </G>
      <G>
        {strokes.n.map(([x, y], i) => (
          <AnimatedNumber key={`n-${i}`} label={i + 1} x={x} y={y} index={i} timeline={timeline} color={colors.primary} />
        ))}
      </G>
    </Svg>
  );
}
