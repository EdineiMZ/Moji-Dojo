import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import type { StyleProp, ViewStyle } from 'react-native';

export type IconName = 'speaker' | 'gear' | 'lock' | 'gift' | 'camera' | 'sparkles';

interface IconProps {
  name: IconName;
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Ícones de traço (viewBox 24 × 24) que no lugar dos emojis ficam com o mesmo peso e a mesma cor do texto, em qualquer
 * versão do Android. São só visuais: quem usa dá o rótulo de acessibilidade.
 */
export function Icon({ name, size = 20, color, style }: IconProps) {
  const stroke = { stroke: color, strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style} accessible={false} importantForAccessibility="no-hide-descendants">
      {name === 'speaker' ? (
        <>
          <Path d="M4 9.5v5h3.5l5 4v-13l-5 4H4z" {...stroke} />
          <Path d="M16 9.5a3.5 3.5 0 0 1 0 5" {...stroke} />
          <Path d="M18.6 6.8a7.5 7.5 0 0 1 0 10.4" {...stroke} />
        </>
      ) : null}
      {name === 'gear' ? (
        <>
          <Circle cx={12} cy={12} r={3} {...stroke} />
          <Circle cx={12} cy={12} r={6.5} {...stroke} />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <Line key={deg} x1={12 + Math.cos(rad) * 6.5} y1={12 + Math.sin(rad) * 6.5} x2={12 + Math.cos(rad) * 9.5} y2={12 + Math.sin(rad) * 9.5} {...stroke} strokeWidth={3} />
            );
          })}
        </>
      ) : null}
      {name === 'lock' ? (
        <>
          <Rect x={5} y={11} width={14} height={9.5} rx={2.5} {...stroke} />
          <Path d="M8 11V8a4 4 0 0 1 8 0v3" {...stroke} />
        </>
      ) : null}
      {name === 'gift' ? (
        <>
          <Rect x={4} y={10} width={16} height={10.5} rx={1.5} {...stroke} />
          <Rect x={3} y={7} width={18} height={3} rx={1} {...stroke} />
          <Path d="M12 7v13.5" {...stroke} />
          <Path d="M12 7C10 7 8 6.2 8 4.8S10.2 3 12 7zM12 7c2 0 4-.8 4-2.2S13.8 3 12 7z" {...stroke} />
        </>
      ) : null}
      {name === 'camera' ? (
        <>
          <Path d="M4 8h3l1.5-2.5h7L17 8h3a1 1 0 0 1 1 1v9.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" {...stroke} />
          <Circle cx={12} cy={13.5} r={3.5} {...stroke} />
        </>
      ) : null}
      {name === 'sparkles' ? (
        <>
          <Path d="M10 3.5l1.7 4.8 4.8 1.7-4.8 1.7L10 16.5l-1.7-4.8L3.5 10l4.8-1.7z" {...stroke} />
          <Path d="M18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8z" {...stroke} strokeWidth={1.6} />
        </>
      ) : null}
    </Svg>
  );
}

/** Os emojis que viram ícone quando abrem um rótulo ("🔊 Ouvir", "📷 Câmera"). */
const LEADING: Readonly<Record<string, IconName>> = { '🔊': 'speaker', '🎁': 'gift', '📷': 'camera', '✨': 'sparkles', '🔒': 'lock', '⚙️': 'gear' };

/** Separa o emoji do começo de um rótulo: o ícone que o substitui e o resto do texto. */
export function splitIconLabel(label: string): { icon: IconName | null; text: string } {
  for (const [emoji, icon] of Object.entries(LEADING)) {
    if (label.startsWith(emoji)) return { icon, text: label.slice(emoji.length).trim() };
  }
  return { icon: null, text: label };
}
