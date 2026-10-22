import Svg, { Circle, Ellipse, G, Path, Polygon } from 'react-native-svg';

export type MascotMood = 'neutral' | 'happy' | 'sad' | 'cheer';

// O Mochi mantém as mesmas cores nos dois temas: é um personagem, não um elemento de interface.
const BODY = '#FFF8F1';
const LINE = '#4A3B5C';
const PINK = '#FFB9D0';
const BLUSH = '#FF93B2';
const TEAR = '#7CC4FF';
const SPARKLE = ['#FFD166', '#B9A4FF', '#7CC4FF'] as const;

/** Estrela de 4 pontas centrada em (x, y). */
const sparkle = (x: number, y: number, r: number) =>
  `M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r} Z`;

function Eyes({ mood }: { mood: MascotMood }) {
  if (mood === 'happy' || mood === 'cheer') {
    // Olhos fechados de alegria: arcos virados para cima (^ ^).
    return (
      <G fill="none" stroke={LINE} strokeWidth={5} strokeLinecap="round">
        <Path d="M64 112 Q75 96 86 112" />
        <Path d="M114 112 Q125 96 136 112" />
      </G>
    );
  }
  const sad = mood === 'sad';
  return (
    <G>
      {[75, 125].map((x) => (
        <G key={x}>
          <Ellipse cx={x} cy={sad ? 112 : 108} rx={7} ry={sad ? 9 : 8} fill={LINE} />
          <Circle cx={x + 2.5} cy={sad ? 108 : 104} r={2.6} fill="#FFFFFF" />
        </G>
      ))}
      {sad && (
        <G fill="none" stroke={LINE} strokeWidth={4} strokeLinecap="round">
          <Path d="M62 94 L87 100" />
          <Path d="M138 94 L113 100" />
        </G>
      )}
    </G>
  );
}

function Mouth({ mood }: { mood: MascotMood }) {
  if (mood === 'cheer') {
    return <Path d="M88 128 Q100 150 112 128 Z" fill={BLUSH} stroke={LINE} strokeWidth={4} strokeLinejoin="round" />;
  }
  if (mood === 'happy') {
    return <Path d="M90 129 Q95 139 100 130 Q105 139 110 129" fill="none" stroke={LINE} strokeWidth={4} strokeLinecap="round" />;
  }
  if (mood === 'sad') {
    return <Path d="M91 138 Q100 128 109 138" fill="none" stroke={LINE} strokeWidth={4} strokeLinecap="round" />;
  }
  return <Path d="M92 130 Q96 135 100 130 Q104 135 108 130" fill="none" stroke={LINE} strokeWidth={4} strokeLinecap="round" />;
}

/** Desenho do Mochi (gatinho). viewBox 200 x 190. */
export function MochiArt({ mood, size }: { mood: MascotMood; size: number }) {
  const armsUp = mood === 'cheer';
  return (
    <Svg width={size} height={size * 0.95} viewBox="0 0 200 190">
      {/* orelhas */}
      <G stroke={LINE} strokeWidth={4} strokeLinejoin="round" fill={BODY}>
        <Polygon points="46,86 52,32 94,58" />
        <Polygon points="154,86 148,32 106,58" />
      </G>
      <G fill={PINK}>
        <Polygon points="58,72 59,48 79,60" />
        <Polygon points="142,72 141,48 121,60" />
      </G>

      {/* pezinhos (atrás do corpo) */}
      <G fill={BODY} stroke={LINE} strokeWidth={4}>
        <Ellipse cx={72} cy={170} rx={21} ry={11} />
        <Ellipse cx={128} cy={170} rx={21} ry={11} />
      </G>

      {/* corpo de mochi */}
      <Path
        d="M30 118 C30 74 62 50 100 50 C138 50 170 74 170 118 C170 150 148 172 100 172 C52 172 30 150 30 118 Z"
        fill={BODY}
        stroke={LINE}
        strokeWidth={4}
        strokeLinejoin="round"
      />

      {/* bracinhos */}
      <G fill={BODY} stroke={LINE} strokeWidth={4}>
        {armsUp ? (
          <>
            <Ellipse cx={28} cy={92} rx={10} ry={17} rotation={-35} origin="28,92" />
            <Ellipse cx={172} cy={92} rx={10} ry={17} rotation={35} origin="172,92" />
          </>
        ) : (
          <>
            <Ellipse cx={32} cy={134} rx={10} ry={16} rotation={14} origin="32,134" />
            <Ellipse cx={168} cy={134} rx={10} ry={16} rotation={-14} origin="168,134" />
          </>
        )}
      </G>

      {/* rosto */}
      <Ellipse cx={56} cy={128} rx={10} ry={6} fill={BLUSH} opacity={0.55} />
      <Ellipse cx={144} cy={128} rx={10} ry={6} fill={BLUSH} opacity={0.55} />
      <Eyes mood={mood} />
      <Ellipse cx={100} cy={120} rx={4.5} ry={3.2} fill={BLUSH} />
      <Mouth mood={mood} />
      <G stroke={LINE} strokeWidth={2} strokeLinecap="round" opacity={0.55}>
        <Path d="M36 120 L54 122" />
        <Path d="M36 130 L54 128" />
        <Path d="M164 120 L146 122" />
        <Path d="M164 130 L146 128" />
      </G>

      {mood === 'sad' && (
        <Path d="M82 126 Q78 136 82 142 Q88 138 86 130 Z" fill={TEAR} stroke={LINE} strokeWidth={2} />
      )}

      {mood === 'cheer' && (
        <G>
          <Path d={sparkle(22, 40, 11)} fill={SPARKLE[0]} />
          <Path d={sparkle(178, 36, 13)} fill={SPARKLE[1]} />
          <Path d={sparkle(100, 14, 9)} fill={SPARKLE[2]} />
          <Path d={sparkle(186, 78, 7)} fill={SPARKLE[0]} />
          <Path d={sparkle(12, 78, 7)} fill={SPARKLE[2]} />
        </G>
      )}
    </Svg>
  );
}
