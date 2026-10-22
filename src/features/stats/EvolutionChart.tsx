import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { Easing, useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';
import { useMotionEnabled } from '@/components';
import { pathLength } from '@/features/strokes/svgPath';
import { fonts, useTheme } from '@/theme';
import { lineLayout, linePath } from './chartGeometry';
import type { EvolutionPoint } from './metrics';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const HEIGHT = 140;
const PAD_X = 16; // folga lateral para o marcador e os rótulos
const PAD_TOP = 22;
const PAD_BOTTOM = 22;
const MARKER_RADIUS = 5; // diâmetro de 10px
const RING = 2;

const shortDate = (day: string): string => `${day.slice(8, 10)}/${day.slice(5, 7)}`;

interface EvolutionChartProps {
  points: readonly EvolutionPoint[];
  width: number;
}

/**
 * Caracteres aprendidos ao longo dos últimos dias: uma linha de 2px que se desenha ao abrir, com
 * marcador no dia de hoje (anel da cor do cartão para destacar) e rótulos diretos só no começo e no fim.
 */
export function EvolutionChart({ points, width }: EvolutionChartProps) {
  const { colors } = useTheme();
  const motion = useMotionEnabled();
  const progress = useSharedValue(motion ? 0 : 1);

  const plotWidth = width - PAD_X * 2;
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const layout = lineLayout(points.map((p) => p.learned), plotWidth, plotHeight).map((p) => ({
    ...p,
    x: p.x + PAD_X,
    y: p.y + PAD_TOP,
  }));
  const d = linePath(layout);
  const length = layout.length > 1 ? pathLength(d) + 1 : 1;

  useEffect(() => {
    progress.value = motion ? 0 : 1;
    if (motion) progress.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) });
  }, [motion, progress, d]);

  const lineProps = useAnimatedProps(() => ({ strokeDashoffset: length * (1 - progress.value) }));

  const first = layout[0];
  const last = layout[layout.length - 1];
  const baseY = PAD_TOP + plotHeight;
  const summary = last ? `Caracteres aprendidos: ${last.value} hoje, ${first?.value ?? 0} há ${points.length - 1} dias.` : '';

  return (
    <View accessible accessibilityLabel={summary}>
      <Svg width={width} height={HEIGHT}>
        {/* grade discreta: o topo e a base da faixa */}
        <Line x1={PAD_X} x2={width - PAD_X} y1={PAD_TOP} y2={PAD_TOP} stroke={colors.line} strokeWidth={1} strokeDasharray={[3, 4]} />
        <Line x1={PAD_X} x2={width - PAD_X} y1={baseY} y2={baseY} stroke={colors.line} strokeWidth={1.5} />

        {layout.length > 1 ? (
          <AnimatedPath
            d={d}
            animatedProps={lineProps}
            stroke={colors.chart}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={[length, length]}
            fill="none"
          />
        ) : null}

        {/* rótulos diretos: valor no começo e hoje */}
        {first ? (
          <SvgText x={first.x} y={first.y - 9} fontSize={11} fontFamily={fonts.bold} fill={colors.ink} textAnchor="start">
            {first.value}
          </SvgText>
        ) : null}
        {last ? (
          <>
            <Circle cx={last.x} cy={last.y} r={MARKER_RADIUS + RING} fill={colors.surface} />
            <Circle cx={last.x} cy={last.y} r={MARKER_RADIUS} fill={colors.chart} />
            <SvgText x={last.x} y={last.y - 12} fontSize={12} fontFamily={fonts.bold} fill={colors.ink} textAnchor="end">
              {last.value}
            </SvgText>
          </>
        ) : null}

        {/* datas das pontas */}
        <SvgText x={PAD_X} y={HEIGHT - 5} fontSize={10} fontFamily={fonts.regular} fill={colors.muted} textAnchor="start">
          {points[0] ? shortDate(points[0].day) : ''}
        </SvgText>
        <SvgText x={width - PAD_X} y={HEIGHT - 5} fontSize={10} fontFamily={fonts.bold} fill={colors.ink} textAnchor="end">
          hoje
        </SvgText>
      </Svg>
    </View>
  );
}
