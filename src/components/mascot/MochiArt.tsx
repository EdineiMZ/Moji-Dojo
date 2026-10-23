import Svg, { Circle, Ellipse, G, Path, Polygon } from 'react-native-svg';
import { accessoryArt, TINTS } from './accessories';

export type MascotMood =
  | 'neutral'
  | 'happy'
  | 'sad'
  | 'cheer'
  | 'sleepy'
  | 'surprised'
  | 'love'
  | 'thinking'
  | 'proud'
  | 'wink'
  | 'excited';

export const MOODS: readonly MascotMood[] = ['neutral', 'happy', 'sad', 'cheer', 'sleepy', 'surprised', 'love', 'thinking', 'proud', 'wink', 'excited'];

/** Humores com os braços para o alto. */
const ARMS_UP: ReadonlySet<MascotMood> = new Set(['cheer', 'excited']);

const HEART = '#FF5C8A';
const ZZZ = '#7CA7D8';

/** Coração pequeno centrado em (x, y), com largura 2s. */
const tinyHeart = (x: number, y: number, s: number) =>
  `M${x} ${y + s * 0.9} C${x - s * 1.6} ${y - s * 0.2} ${x - s * 0.8} ${y - s * 1.1} ${x} ${y - s * 0.3} C${x + s * 0.8} ${y - s * 1.1} ${x + s * 1.6} ${y - s * 0.2} ${x} ${y + s * 0.9} Z`;

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

function Eyes({ mood, blink }: { mood: MascotMood; blink: boolean }) {
  if (mood === 'love') {
    return (
      <G fill={HEART} stroke={LINE} strokeWidth={2.5} strokeLinejoin="round">
        <Path d={tinyHeart(75, 106, 10)} />
        <Path d={tinyHeart(125, 106, 10)} />
      </G>
    );
  }
  if (mood === 'excited') {
    return (
      <G fill={SPARKLE[0]} stroke={LINE} strokeWidth={2.5} strokeLinejoin="round">
        <Path d={sparkle(75, 108, 13)} />
        <Path d={sparkle(125, 108, 13)} />
      </G>
    );
  }
  if (mood === 'sleepy') {
    return (
      <G fill="none" stroke={LINE} strokeWidth={5} strokeLinecap="round">
        <Path d="M64 110 Q75 118 86 110" />
        <Path d="M114 110 Q125 118 136 110" />
      </G>
    );
  }
  if (mood === 'wink') {
    return (
      <G>
        <Ellipse cx={75} cy={108} rx={7} ry={8} fill={LINE} />
        <Circle cx={77.5} cy={104} r={2.6} fill="#FFFFFF" />
        <Path d="M114 110 Q125 98 136 110" fill="none" stroke={LINE} strokeWidth={5} strokeLinecap="round" />
      </G>
    );
  }
  if (mood === 'surprised') {
    return (
      <G>
        {[75, 125].map((x) => (
          <G key={x}>
            <Ellipse cx={x} cy={108} rx={10} ry={12} fill="#FFFFFF" stroke={LINE} strokeWidth={3.5} />
            <Circle cx={x} cy={109} r={4} fill={LINE} />
          </G>
        ))}
      </G>
    );
  }
  if (blink && mood !== 'happy' && mood !== 'cheer' && mood !== 'proud') {
    return (
      <G fill="none" stroke={LINE} strokeWidth={5} strokeLinecap="round">
        <Path d="M66 110 H84" />
        <Path d="M116 110 H134" />
      </G>
    );
  }
  if (mood === 'thinking') {
    return (
      <G>
        {[75, 125].map((x) => (
          <G key={x}>
            <Ellipse cx={x} cy={108} rx={7} ry={8} fill={LINE} />
            <Circle cx={x + 3} cy={103} r={2.6} fill="#FFFFFF" />
          </G>
        ))}
        <Path d="M114 92 L138 86" fill="none" stroke={LINE} strokeWidth={4} strokeLinecap="round" />
        <Path d="M62 96 L86 96" fill="none" stroke={LINE} strokeWidth={4} strokeLinecap="round" />
      </G>
    );
  }
  if (mood === 'happy' || mood === 'cheer' || mood === 'proud') {
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
  if (mood === 'excited') {
    return <Path d="M86 126 Q100 156 114 126 Z" fill={BLUSH} stroke={LINE} strokeWidth={4} strokeLinejoin="round" />;
  }
  if (mood === 'surprised') return <Ellipse cx={100} cy={136} rx={7} ry={9} fill={LINE} />;
  if (mood === 'sleepy') return <Ellipse cx={100} cy={134} rx={4} ry={3.5} fill={LINE} opacity={0.85} />;
  if (mood === 'love') {
    return <Path d="M90 128 Q100 146 110 128 Z" fill={BLUSH} stroke={LINE} strokeWidth={4} strokeLinejoin="round" />;
  }
  if (mood === 'thinking') return <Path d="M91 135 Q96 131 100 134 Q104 137 109 132" fill="none" stroke={LINE} strokeWidth={4} strokeLinecap="round" />;
  if (mood === 'proud') return <Path d="M88 128 Q100 144 112 128" fill="none" stroke={LINE} strokeWidth={4} strokeLinecap="round" />;
  if (mood === 'wink') {
    return (
      <G>
        <Path d="M90 129 Q95 139 100 130 Q105 139 110 129" fill="none" stroke={LINE} strokeWidth={4} strokeLinecap="round" />
        <Path d="M104 136 Q108 148 114 138 Q112 134 104 136 Z" fill="#FF7A9E" stroke={LINE} strokeWidth={2.5} strokeLinejoin="round" />
      </G>
    );
  }
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
/** O que o Mochi veste: o id do item de cada espaço (cabeça, rosto, pescoço, fundo e cor). */
export type MochiOutfit = Partial<Record<'head' | 'face' | 'neck' | 'back' | 'tint' | 'skin', string>>;

/** Abaixo deste tamanho o fundo não aparece (viraria só um quadrado colorido atrás de um Mochi pequeno). */
const MIN_BACKDROP_SIZE = 110;

export function MochiArt({ mood, size, outfit = {}, blink = false }: { mood: MascotMood; size: number; outfit?: MochiOutfit; blink?: boolean }) {
  const armsUp = ARMS_UP.has(mood);
  const tint = (outfit.tint ? TINTS[outfit.tint] : undefined) ?? { body: BODY, pink: PINK };
  return (
    <Svg width={size} height={size * 0.95} viewBox="0 0 200 190">
      {size >= MIN_BACKDROP_SIZE ? accessoryArt('back', outfit.back) : null}
      {/* orelhas */}
      <G stroke={LINE} strokeWidth={4} strokeLinejoin="round" fill={tint.body}>
        <Polygon points="46,86 52,32 94,58" />
        <Polygon points="154,86 148,32 106,58" />
      </G>
      <G fill={tint.pink}>
        <Polygon points="58,72 59,48 79,60" />
        <Polygon points="142,72 141,48 121,60" />
      </G>

      {/* pezinhos (atrás do corpo) */}
      <G fill={tint.body} stroke={LINE} strokeWidth={4}>
        <Ellipse cx={72} cy={170} rx={21} ry={11} />
        <Ellipse cx={128} cy={170} rx={21} ry={11} />
      </G>

      {/* corpo de mochi */}
      <Path
        d="M30 118 C30 74 62 50 100 50 C138 50 170 74 170 118 C170 150 148 172 100 172 C52 172 30 150 30 118 Z"
        fill={tint.body}
        stroke={LINE}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      {accessoryArt('skin', outfit.skin)}
      {accessoryArt('neck', outfit.neck)}

      {/* bracinhos */}
      <G fill={tint.body} stroke={LINE} strokeWidth={4}>
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
      <Eyes mood={mood} blink={blink} />
      <Ellipse cx={100} cy={120} rx={4.5} ry={3.2} fill={BLUSH} />
      <Mouth mood={mood} />
      <G stroke={LINE} strokeWidth={2} strokeLinecap="round" opacity={0.55}>
        <Path d="M36 120 L54 122" />
        <Path d="M36 130 L54 128" />
        <Path d="M164 120 L146 122" />
        <Path d="M164 130 L146 128" />
      </G>

      {accessoryArt('face', outfit.face)}
      {accessoryArt('head', outfit.head)}

      {mood === 'sad' && (
        <Path d="M82 126 Q78 136 82 142 Q88 138 86 130 Z" fill={TEAR} stroke={LINE} strokeWidth={2} />
      )}

      {mood === 'sleepy' && (
        <G fill="none" stroke={ZZZ} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M146 52 H162 L146 68 H162" />
          <Path d="M168 30 H179 L168 41 H179" />
          <Path d="M184 14 H191 L184 21 H191" />
        </G>
      )}
      {mood === 'surprised' && (
        <G>
          <Path d="M168 24 V52" stroke={LINE} strokeWidth={7} strokeLinecap="round" />
          <Circle cx={168} cy={66} r={4.5} fill={LINE} />
          <Path d="M150 38 L142 32 M186 38 L194 32" stroke={LINE} strokeWidth={3.5} strokeLinecap="round" />
        </G>
      )}
      {mood === 'love' && (
        <G fill={HEART} stroke={LINE} strokeWidth={2} strokeLinejoin="round">
          <Path d={tinyHeart(158, 44, 9)} />
          <Path d={tinyHeart(180, 72, 6)} />
          <Path d={tinyHeart(36, 52, 7)} />
        </G>
      )}
      {mood === 'thinking' && (
        <G fill="#FFFFFF" stroke={LINE} strokeWidth={2.5}>
          <Circle cx={148} cy={66} r={3.5} />
          <Circle cx={160} cy={52} r={5.5} />
          <Ellipse cx={176} cy={30} rx={15} ry={11} />
          <Path d="M170 30 H182 M176 25 V35" stroke={LINE} strokeWidth={0} />
        </G>
      )}
      {mood === 'proud' && (
        <G>
          <Path d={sparkle(30, 44, 9)} fill={SPARKLE[0]} />
          <Path d={sparkle(172, 40, 11)} fill={SPARKLE[0]} />
        </G>
      )}
      {mood === 'excited' && (
        <G>
          <Path d={sparkle(22, 40, 11)} fill={SPARKLE[0]} />
          <Path d={sparkle(178, 36, 13)} fill={SPARKLE[1]} />
          <Path d={sparkle(100, 14, 9)} fill={SPARKLE[2]} />
        </G>
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
