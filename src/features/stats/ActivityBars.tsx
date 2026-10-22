import { useEffect, useId } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { ClipPath, Defs, G, Line, Rect, Text as SvgText } from 'react-native-svg';
import { useMotionEnabled } from '@/components';
import { fonts, useTheme } from '@/theme';
import { barLayout, type BarRect } from './chartGeometry';
import type { DailyAnswers } from './metrics';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

const HEIGHT = 120;
const LABEL_ROOM = 18; // espaço embaixo para as letras dos dias
const TOP_ROOM = 16; // espaço em cima para o rótulo do maior valor
const CORNER = 4;
const WEEKDAY_LETTERS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'] as const;

interface BarProps {
  rect: BarRect;
  baseline: number;
  grow: SharedValue<number>;
  color: string;
  clipId: string;
}

function Bar({ rect, baseline, grow, color, clipId }: BarProps) {
  // A barra tem cantos arredondados nos dois lados, mas é prolongada abaixo da base e recortada
  // ali: só a ponta de cima fica arredondada, e a base encosta na linha.
  const animatedProps = useAnimatedProps(() => {
    const h = rect.height * grow.value;
    return { y: baseline - h, height: h + CORNER };
  });
  return (
    <AnimatedRect
      x={rect.x}
      width={rect.width}
      rx={CORNER}
      fill={color}
      clipPath={`url(#${clipId})`}
      animatedProps={animatedProps}
    />
  );
}

interface ActivityBarsProps {
  data: readonly DailyAnswers[];
  width: number;
}

/**
 * Respostas por dia, em barras finas a partir de zero. Uma série só (o título do cartão a nomeia),
 * grade discreta e rótulos só nos pontos que importam: o maior valor e o de hoje.
 */
export function ActivityBars({ data, width }: ActivityBarsProps) {
  const { colors } = useTheme();
  const motion = useMotionEnabled();
  const clipId = useId().replace(/[^a-zA-Z0-9]/g, '');
  const grow = useSharedValue(motion ? 0 : 1);

  const plotHeight = HEIGHT - LABEL_ROOM - TOP_ROOM;
  const baseline = TOP_ROOM + plotHeight;
  const bars = barLayout(data.map((d) => d.answers), width, plotHeight, 0.5);
  const max = Math.max(0, ...data.map((d) => d.answers));
  const maxIndex = data.findIndex((d) => d.answers === max);

  useEffect(() => {
    grow.value = motion ? 0 : 1;
    if (motion) grow.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) });
  }, [motion, grow, data]);

  return (
    <View accessible accessibilityLabel={`Respostas por dia nos últimos ${data.length} dias. Maior dia: ${max}.`}>
      <Svg width={width} height={HEIGHT}>
        <Defs>
          <ClipPath id={clipId}>
            <Rect x={0} y={0} width={width} height={baseline} />
          </ClipPath>
        </Defs>

        {/* grade discreta: uma linha no meio e a base */}
        <Line x1={0} x2={width} y1={TOP_ROOM + plotHeight / 2} y2={TOP_ROOM + plotHeight / 2} stroke={colors.line} strokeWidth={1} strokeDasharray={[3, 4]} />
        <Line x1={0} x2={width} y1={baseline} y2={baseline} stroke={colors.line} strokeWidth={1.5} />

        <G>
          {bars.map((rect, i) => (
            <Bar
              key={data[i]?.day ?? i}
              rect={rect}
              baseline={baseline}
              grow={grow}
              color={colors.chart}
              clipId={clipId}
            />
          ))}
        </G>

        {/* rótulos diretos só no maior dia e em hoje */}
        {bars.map((rect, i) => {
          const isToday = i === data.length - 1;
          const isMax = i === maxIndex && max > 0;
          if (!isToday && !isMax) return null;
          const value = data[i]?.answers ?? 0;
          if (value === 0) return null;
          return (
            <SvgText
              key={`v-${i}`}
              x={rect.x + rect.width / 2}
              y={baseline - rect.height - 5}
              fontSize={11}
              fontFamily={fonts.bold}
              fill={colors.ink}
              textAnchor="middle"
            >
              {value}
            </SvgText>
          );
        })}

        {/* dia da semana embaixo de cada barra */}
        {bars.map((rect, i) => {
          const weekday = data[i]?.weekday ?? 0;
          const isToday = i === data.length - 1;
          return (
            <SvgText
              key={`d-${i}`}
              x={rect.x + rect.width / 2}
              y={HEIGHT - 4}
              fontSize={10}
              fontFamily={isToday ? fonts.bold : fonts.regular}
              fill={isToday ? colors.ink : colors.muted}
              textAnchor="middle"
            >
              {WEEKDAY_LETTERS[weekday] ?? ''}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
}
