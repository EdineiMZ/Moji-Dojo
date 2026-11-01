import Svg, { G, Line, Path } from 'react-native-svg';
import type { Point } from '@/features/strokes/svgPath';
import { useTheme } from '@/theme';
import { CANVAS_SIZE } from './canvas';
import { polylinePath } from './draw';

const INK_WIDTH = 5.2;

/** O desenho do usuário, parado, no mesmo quadro de 109 (para comparar ao lado do caractere certo). */
export function DrawingPreview({ strokes, size, label }: { strokes: readonly (readonly Point[])[]; size: number; label: string }) {
  const { colors } = useTheme();
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`} accessibilityLabel={label}>
      <G stroke={colors.line} strokeWidth={0.8} strokeDasharray={[3, 3]}>
        <Line x1={54.5} y1={2} x2={54.5} y2={107} />
        <Line x1={2} y1={54.5} x2={107} y2={54.5} />
      </G>
      <G>
        {strokes.map((stroke, i) => (
          <Path
            key={i}
            d={polylinePath(stroke)}
            stroke={colors.ink}
            strokeWidth={INK_WIDTH}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ))}
      </G>
    </Svg>
  );
}
