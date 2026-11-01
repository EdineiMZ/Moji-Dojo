import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedProps, useSharedValue } from 'react-native-reanimated';
import Svg, { G, Line, Path, Text as SvgText } from 'react-native-svg';
import { scheduleOnRN } from 'react-native-worklets';
import type { StrokeData } from '@/data/types';
import type { Point } from '@/features/strokes/svgPath';
import { radii, useTheme } from '@/theme';
import { MIN_POINT_STEP, parsePolyline, polylinePath } from './draw';
import { CANVAS_SIZE } from './canvas';
import type { StrokeVerdict } from './score';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const INK_WIDTH = 5.2;
const MODEL_WIDTH = 4;

interface DrawingPadProps {
  /** Lado do quadrado, em pixels. */
  size: number;
  /** Traços já feitos (em unidades do quadro de 109). */
  strokes: readonly (readonly Point[])[];
  onStrokeEnd: (stroke: Point[]) => void;
  /** Modelo do caractere: aparece cinza, com os números, se `showModel`. */
  model?: StrokeData;
  showModel?: boolean;
  /** Opacidade do modelo cinza (1 = cheio). Baixa no traçado guiado, para o caractere ficar "de fundo". */
  modelOpacity?: number;
  /** Depois de conferir: pinta cada traço do modelo (verde = certo, vermelho = o resto). */
  verdicts?: readonly StrokeVerdict[];
  disabled?: boolean;
  /** Avisa quando o dedo começa/termina um traço (para travar a rolagem da tela). */
  onDrawingChange?: (drawing: boolean) => void;
}

/**
 * Quadro de desenho com o dedo. O traço em andamento é desenhado na thread de UI (sem
 * re-renderizar o React a cada movimento); ao soltar, vira um traço guardado pelo pai.
 */
export function DrawingPad({
  size,
  strokes,
  onStrokeEnd,
  model,
  showModel = false,
  modelOpacity = 1,
  verdicts,
  disabled = false,
  onDrawingChange,
}: DrawingPadProps) {
  const { colors } = useTheme();
  const live = useSharedValue('');
  const lastX = useSharedValue(0);
  const lastY = useSharedValue(0);
  const previousCount = useRef(strokes.length);

  // Desfazer/limpar: o traço "ao vivo" ainda mostra o último, então some junto.
  useEffect(() => {
    if (strokes.length < previousCount.current) live.value = '';
    previousCount.current = strokes.length;
  }, [strokes.length, live]);

  const toStroke = (d: string) => {
    const points = parsePolyline(d);
    if (points.length > 0) onStrokeEnd(points);
  };
  const notify = (drawing: boolean) => onDrawingChange?.(drawing);

  const pan = Gesture.Pan()
    .enabled(!disabled)
    .minDistance(0)
    .maxPointers(1)
    .onBegin((e) => {
      const x = (e.x / size) * CANVAS_SIZE;
      const y = (e.y / size) * CANVAS_SIZE;
      lastX.value = x;
      lastY.value = y;
      live.set(`M${x.toFixed(1)} ${y.toFixed(1)}`);
      scheduleOnRN(notify, true);
    })
    .onUpdate((e) => {
      const x = (e.x / size) * CANVAS_SIZE;
      const y = (e.y / size) * CANVAS_SIZE;
      if (Math.hypot(x - lastX.value, y - lastY.value) < MIN_POINT_STEP) return;
      lastX.value = x;
      lastY.value = y;
      live.set(`${live.get()} L${x.toFixed(1)} ${y.toFixed(1)}`);
    })
    .onFinalize(() => {
      if (live.value) scheduleOnRN(toStroke, live.value);
      scheduleOnRN(notify, false);
    });

  const liveProps = useAnimatedProps(() => ({
    d: live.value || 'M0 0',
    opacity: live.value ? 1 : 0,
  }));

  const modelPaths = model?.p ?? [];
  const showNumbers = showModel || verdicts !== undefined;

  return (
    <View
      accessibilityLabel="Área de desenho"
      style={[
        styles.pad,
        { width: size, height: size, backgroundColor: colors.surface, borderColor: colors.line },
      ]}
    >
      <GestureDetector gesture={pan}>
        <View style={{ width: size, height: size }}>
          <Svg width={size} height={size} viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}>
            <G stroke={colors.line} strokeWidth={0.8} strokeDasharray={[3, 3]}>
              <Line x1={54.5} y1={2} x2={54.5} y2={107} />
              <Line x1={2} y1={54.5} x2={107} y2={54.5} />
            </G>

            {model && (showModel || verdicts) ? (
              <G>
                {modelPaths.map((d, i) => {
                  const verdict = verdicts?.[i];
                  const stroke = verdict ? (verdict === 'ok' ? colors.ok : colors.bad) : colors.line;
                  return (
                    <Path
                      key={`m-${i}`}
                      d={d}
                      stroke={stroke}
                      strokeOpacity={verdict ? 0.7 : modelOpacity}
                      strokeWidth={MODEL_WIDTH}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  );
                })}
              </G>
            ) : null}

            {model && showNumbers
              ? model.n.map(([x, y], i) => (
                  <SvgText key={`n-${i}`} x={x} y={y} fill={colors.muted} fontSize={7} fontWeight="bold" textAnchor="middle">
                    {i + 1}
                  </SvgText>
                ))
              : null}

            <G>
              {strokes.map((stroke, i) => (
                <Path
                  key={`s-${i}`}
                  d={polylinePath(stroke)}
                  stroke={colors.ink}
                  strokeWidth={INK_WIDTH}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              ))}
              <AnimatedPath
                animatedProps={liveProps}
                stroke={colors.ink}
                strokeWidth={INK_WIDTH}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </G>
          </Svg>
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  pad: { borderWidth: 1.5, borderRadius: radii.lg, overflow: 'hidden' },
});
