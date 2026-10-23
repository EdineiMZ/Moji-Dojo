import { ClipPath, Circle, Defs, Ellipse, G, Path, Polygon, Rect } from 'react-native-svg';
import { LINE, star, type Art } from './artKit';

const W = 200;
const H = 190;

const backdrop = (fill: string) => <Rect width={W} height={H} rx={20} fill={fill} />;

// ---------------------------------------------------------------- fundos (novos)
export const BACK_MORE: Record<string, Art> = {
  'fundo-praia': () => (
    <G>
      {backdrop('#BFE9FF')}
      <Circle cx={160} cy={40} r={18} fill="#FFD166" />
      <Rect y={112} width={W} height={46} fill="#5DADE2" />
      <Path d="M0 124 Q25 116 50 124 T100 124 T150 124 T200 124 M0 138 Q25 130 50 138 T100 138 T150 138 T200 138" fill="none" stroke="#FFFFFF" strokeWidth={3} opacity={0.8} />
      <Path d="M0 152 Q60 140 120 152 T200 148 L200 190 L0 190 Z" fill="#F2D88C" />
      <Path d="M24 160 Q22 120 40 96 M40 96 Q24 92 14 100 M40 96 Q52 86 64 92 M40 96 Q50 100 54 112" fill="none" stroke="#6BAE5C" strokeWidth={5} strokeLinecap="round" />
    </G>
  ),
  'fundo-biblioteca': () => (
    <G>
      {backdrop('#E9D5B7')}
      {[24, 62, 100].map((y) => (
        <G key={y}>
          <Rect x={8} y={y + 26} width={184} height={6} fill="#8A5A44" />
          {[12, 24, 34, 48, 58, 74, 88, 100, 114, 126, 142, 156, 170].map((x, i) => (
            <Rect key={x} x={x} y={y + 2 + (i % 3) * 3} width={9} height={24 - (i % 3) * 3} fill={['#E5534B', '#4F86C0', '#6BAE5C', '#FFD166', '#8A63B8'][i % 5] ?? '#E5534B'} stroke={LINE} strokeWidth={1.5} />
          ))}
        </G>
      ))}
      <Rect y={156} width={W} height={34} fill="#A9744F" />
    </G>
  ),
  'fundo-onsen': () => (
    <G>
      {backdrop('#D8EEF2')}
      <Path d="M30 70 Q20 40 36 20 M60 76 Q48 46 66 22 M150 70 Q140 40 156 20" fill="none" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" opacity={0.85} />
      <Ellipse cx={100} cy={160} rx={110} ry={34} fill="#7FD1E8" />
      <Circle cx={22} cy={140} r={16} fill="#9AA0AD" stroke={LINE} strokeWidth={2.5} />
      <Circle cx={178} cy={144} r={20} fill="#8D93A1" stroke={LINE} strokeWidth={2.5} />
      <Circle cx={150} cy={160} r={10} fill="#9AA0AD" stroke={LINE} strokeWidth={2.5} />
    </G>
  ),
  'fundo-ramen': () => (
    <G>
      {backdrop('#FFE9C9')}
      <Rect y={0} width={W} height={50} fill="#C0392B" />
      {[0, 1, 2, 3].map((i) => (
        <Rect key={i} x={i * 50 + 2} y={0} width={46} height={64} rx={3} fill="#2A2438" stroke={LINE} strokeWidth={2} />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <Path key={i} d={`M${i * 50 + 16} 22 H${i * 50 + 36} M${i * 50 + 26} 14 V40`} stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" />
      ))}
      <Rect y={146} width={W} height={44} fill="#8A5A44" />
      <Path d="M70 146 Q100 120 130 146 Z" fill="#FFFFFF" stroke={LINE} strokeWidth={3} />
      <Path d="M86 130 Q82 112 92 100 M100 128 Q96 108 106 94 M114 130 Q110 114 120 104" fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={0.9} />
    </G>
  ),
  'fundo-metro': () => (
    <G>
      {backdrop('#DCE3EE')}
      <Rect y={156} width={W} height={34} fill="#9AA5B8" />
      <Rect y={160} width={W} height={5} fill="#FFD166" />
      <Rect x={0} y={44} width={W} height={76} fill="#F5F7FB" stroke={LINE} strokeWidth={3} />
      {[8, 56, 104, 152].map((x) => (
        <Rect key={x} x={x} y={56} width={40} height={36} rx={4} fill="#BFE3F7" stroke={LINE} strokeWidth={3} />
      ))}
      <Rect y={102} width={W} height={8} fill="#4F86C0" />
      <Circle cx={170} cy={24} r={11} fill="#FFFFFF" stroke={LINE} strokeWidth={3} />
      <Path d="M170 17 V25 L176 28" fill="none" stroke={LINE} strokeWidth={2.5} strokeLinecap="round" />
    </G>
  ),
  'fundo-neve': () => (
    <G>
      {backdrop('#E8F1FF')}
      {[[30, 24, 5], [74, 50, 4], [120, 18, 6], [166, 56, 5], [20, 80, 4], [100, 90, 5], [178, 98, 4]].map(([x, y, r], i) => (
        <Path key={i} d={star(x as number, y as number, r as number)} fill="#FFFFFF" stroke="#BCD2F5" strokeWidth={1.5} />
      ))}
      <Path d="M0 150 Q50 128 100 148 Q150 130 200 150 L200 190 L0 190 Z" fill="#FFFFFF" />
      <Polygon points="24,150 38,112 52,150" fill="#4E8A5E" stroke={LINE} strokeWidth={2.5} />
      <Polygon points="150,150 168,104 186,150" fill="#4E8A5E" stroke={LINE} strokeWidth={2.5} />
      <Path d="M30 128 L38 112 L46 128 M158 126 L168 104 L178 126" fill="#FFFFFF" />
    </G>
  ),
  'fundo-dojo': () => (
    <G>
      {backdrop('#F4E5C8')}
      <Rect y={140} width={W} height={50} fill="#C69C6D" />
      <Path d="M0 160 H200 M0 176 H200" stroke="#A9794F" strokeWidth={2} />
      {[10, 68, 126].map((x) => (
        <Rect key={x} x={x} y={14} width={56} height={118} fill="#FFFDF4" stroke="#8A5A44" strokeWidth={3} />
      ))}
      <Path d="M38 14 V132 M96 14 V132 M154 14 V132 M10 50 H66 M68 50 H124 M126 50 H182 M10 90 H66 M68 90 H124 M126 90 H182" stroke="#8A5A44" strokeWidth={2} />
      <Rect x={150} y={20} width={32} height={60} fill="#FFFFFF" stroke={LINE} strokeWidth={2.5} />
      <Path d="M158 32 H174 M158 44 H174 M166 28 V70" stroke="#C0392B" strokeWidth={4} strokeLinecap="round" />
    </G>
  ),
  'fundo-amanhecer': () => (
    <G>
      {backdrop('#FFD9C0')}
      <Rect width={W} height={70} rx={20} fill="#FFB9A0" />
      <Rect y={50} width={W} height={50} fill="#FFE0A8" />
      <Circle cx={100} cy={112} r={42} fill="#FFD166" />
      <Path d="M0 130 Q40 100 80 126 Q120 98 160 124 Q184 112 200 120 L200 190 L0 190 Z" fill="#7BA05B" />
      <Path d="M0 150 Q60 130 120 150 T200 146 L200 190 L0 190 Z" fill="#5E8A4E" />
    </G>
  ),
  'fundo-pagode': () => (
    <G>
      {backdrop('#CFE8FA')}
      <Ellipse cx={40} cy={44} rx={26} ry={9} fill="#FFFFFF" />
      <Ellipse cx={160} cy={30} rx={30} ry={10} fill="#FFFFFF" />
      {[[156, 156, 52, 126], [156, 126, 42, 100], [156, 100, 32, 80], [156, 80, 22, 64]].map(([cx, y, w, top], i) => (
        <G key={i}>
          <Rect x={(cx as number) - (w as number) / 2 + 6} y={top as number} width={(w as number) - 12} height={(y as number) - (top as number)} fill="#E8A36B" stroke={LINE} strokeWidth={2.5} />
          <Path d={`M${(cx as number) - (w as number)} ${(top as number) + 2} Q${cx as number} ${(top as number) - 14} ${(cx as number) + (w as number)} ${(top as number) + 2} Z`} fill="#8A3B3B" stroke={LINE} strokeWidth={2.5} />
        </G>
      ))}
      <Path d="M156 50 V30" stroke={LINE} strokeWidth={3} />
      <Rect y={158} width={W} height={32} fill="#9ED08A" />
    </G>
  ),
  'fundo-aurora': () => (
    <G>
      {backdrop('#141B3A')}
      <Path d="M0 90 Q50 30 100 70 T200 50 L200 100 Q150 120 100 100 T0 120 Z" fill="#3DF2A0" opacity={0.55} />
      <Path d="M0 110 Q60 60 110 92 T200 80 L200 120 Q150 140 100 124 T0 140 Z" fill="#FF7AD0" opacity={0.4} />
      {[[24, 24, 4], [64, 50, 3], [120, 20, 5], [176, 40, 4], [150, 70, 3], [90, 14, 3]].map(([x, y, r], i) => (
        <Path key={i} d={star(x as number, y as number, r as number)} fill="#FFFFFF" />
      ))}
      <Path d="M0 162 Q50 140 100 160 Q150 142 200 160 L200 190 L0 190 Z" fill="#0C1128" />
    </G>
  ),
  'fundo-sakura-noite': () => (
    <G>
      {backdrop('#1E2147')}
      <Circle cx={150} cy={44} r={24} fill="#FFF3C4" />
      <Path d="M-4 40 Q40 50 80 30 M30 44 Q44 70 70 80" fill="none" stroke="#6B4A3A" strokeWidth={6} strokeLinecap="round" />
      {[[16, 40], [42, 50], [66, 32], [58, 74], [34, 66], [80, 60]].map(([x, y], i) => (
        <Circle key={i} cx={x} cy={y} r={9} fill={i % 2 === 0 ? '#FFB9D0' : '#FF9EBB'} />
      ))}
      {[[120, 110], [150, 130], [100, 140], [176, 100], [130, 80]].map(([x, y], i) => (
        <Ellipse key={i} cx={x} cy={y} rx={5} ry={3} fill="#FFB9D0" rotation={i * 35} origin={`${x},${y}`} />
      ))}
      <Path d="M0 164 Q50 148 100 162 Q150 150 200 164 L200 190 L0 190 Z" fill="#12142F" />
    </G>
  ),
  'fundo-galaxia': () => (
    <G>
      {backdrop('#1A1040')}
      <Ellipse cx={100} cy={96} rx={86} ry={30} fill="#6B4FD6" opacity={0.45} rotation={-24} origin="100,96" />
      <Ellipse cx={100} cy={96} rx={64} ry={20} fill="#B58CFF" opacity={0.45} rotation={-24} origin="100,96" />
      <Ellipse cx={100} cy={96} rx={36} ry={11} fill="#FFE0F5" opacity={0.7} rotation={-24} origin="100,96" />
      {[[22, 26, 5], [60, 160, 4], [174, 30, 6], [154, 150, 5], [36, 120, 3], [120, 20, 4], [184, 96, 3], [90, 174, 4]].map(([x, y, r], i) => (
        <Path key={i} d={star(x as number, y as number, r as number)} fill={i % 2 === 0 ? '#FFD166' : '#FFFFFF'} />
      ))}
      <Circle cx={30} cy={64} r={9} fill="#FF8FB3" />
      <Circle cx={170} cy={140} r={7} fill="#7CC4FF" />
    </G>
  ),
};

// ---------------------------------------------------------------- cores (novas)
export const TINTS_MORE: Readonly<Record<string, { body: string; pink: string }>> = {
  'cor-laranja': { body: '#FFD9B0', pink: '#F59E50' },
  'cor-pink': { body: '#FFC2DA', pink: '#FF6FA3' },
  'cor-cinza': { body: '#E3E5EC', pink: '#A9AEC0' },
  'cor-carvao': { body: '#9A93A8', pink: '#C98FA8' },
  'cor-menta': { body: '#D2F5E8', pink: '#8FD9BE' },
  'cor-cristal': { body: '#E4F6FF', pink: '#9BD7F5' },
  'cor-galaxia': { body: '#B9A8F0', pink: '#7E63D4' },
  'cor-prisma': { body: '#F3E8FF', pink: '#FFC7A8' },
};

// ---------------------------------------------------------------- peles
/** O contorno do corpo do Mochi (o mesmo de MochiArt): as peles são recortadas por ele para não passar da borda. */
export const BODY_PATH = 'M30 118 C30 74 62 50 100 50 C138 50 170 74 170 118 C170 150 148 172 100 172 C52 172 30 150 30 118 Z';

function Clipped({ children }: { children: React.ReactNode }) {
  return (
    <G>
      <Defs>
        <ClipPath id="mochiBody">
          <Path d={BODY_PATH} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#mochiBody)">{children}</G>
    </G>
  );
}

const scatter = (points: readonly (readonly [number, number, number])[], draw: (x: number, y: number, r: number, i: number) => React.ReactElement) =>
  points.map(([x, y, r], i) => draw(x, y, r, i));

const SPOTS: readonly (readonly [number, number, number])[] = [
  [48, 96, 5], [70, 74, 4], [100, 66, 5], [132, 76, 4], [154, 98, 5], [44, 130, 4], [72, 152, 5], [100, 160, 4], [130, 152, 5], [158, 132, 4], [60, 116, 3], [140, 118, 3],
];

export const SKIN: Record<string, Art> = {
  'pele-listras': () => (
    <Clipped>
      <Path d="M100 52 V74 M86 54 L88 70 M114 54 L112 70" stroke="#B98A5E" strokeWidth={6} strokeLinecap="round" opacity={0.85} />
      <Path d="M28 100 L52 108 M28 120 L50 124 M28 140 L52 138 M172 100 L148 108 M172 120 L150 124 M172 140 L148 138" stroke="#B98A5E" strokeWidth={6} strokeLinecap="round" opacity={0.85} />
    </Clipped>
  ),
  'pele-manchas': () => (
    <Clipped>
      <Ellipse cx={62} cy={80} rx={26} ry={22} fill="#F5A25D" opacity={0.92} />
      <Ellipse cx={146} cy={96} rx={26} ry={30} fill="#6B5B73" opacity={0.88} />
      <Ellipse cx={90} cy={166} rx={22} ry={12} fill="#F5A25D" opacity={0.9} />
    </Clipped>
  ),
  'pele-estrelas': () => (
    <Clipped>
      {scatter(SPOTS, (x, y, r, i) => (
        <Path key={i} d={star(x, y, r + 3)} fill={i % 3 === 0 ? '#FFD166' : i % 3 === 1 ? '#FF9EBB' : '#B9A4FF'} />
      ))}
    </Clipped>
  ),
  'pele-coracoes': () => (
    <Clipped>
      {scatter(SPOTS, (x, y, r, i) => (
        <Path
          key={i}
          d={`M${x} ${y + r * 1.6} C${x - r * 2.6} ${y - r * 0.4} ${x - r * 1.3} ${y - r * 1.9} ${x} ${y - r * 0.5} C${x + r * 1.3} ${y - r * 1.9} ${x + r * 2.6} ${y - r * 0.4} ${x} ${y + r * 1.6} Z`}
          fill={i % 2 === 0 ? '#FF7AA8' : '#FFB9D0'}
          opacity={0.9}
        />
      ))}
    </Clipped>
  ),
  'pele-onda': () => (
    <Clipped>
      {[142, 154, 166].map((y, row) => (
        <Path key={y} d={`M20 ${y} ${Array.from({ length: 8 }, (_, k) => `Q${40 + k * 24 + (row % 2) * 12} ${y - 10} ${48 + k * 24 + (row % 2) * 12} ${y}`).join(' ')}`} fill="none" stroke="#7CA7D8" strokeWidth={4} strokeLinecap="round" />
      ))}
      <Path d="M44 90 Q60 64 84 76 Q70 80 72 96" fill="none" stroke="#7CA7D8" strokeWidth={4} strokeLinecap="round" opacity={0.8} />
    </Clipped>
  ),
  'pele-sensei': () => (
    <G>
      <Clipped>
        <Path d="M30 150 Q100 134 170 150 L170 190 L30 190 Z" fill="#FFFFFF" opacity={0.95} />
        <Path d="M64 128 L100 168 L136 128" fill="none" stroke="#3B3350" strokeWidth={6} strokeLinejoin="round" />
        <Rect x={30} y={150} width={140} height={10} fill="#2A2438" />
      </Clipped>
    </G>
  ),
  'pele-coruja': () => (
    <G>
      <Path d="M54 44 L52 30 L68 40 Z M146 44 L148 30 L132 40 Z" fill="#B08968" stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
      <Clipped>
        {[[66, 142], [90, 148], [114, 148], [138, 142], [78, 160], [102, 164], [126, 160]].map(([x, y], i) => (
          <Path key={i} d={`M${(x as number) - 9} ${y as number} Q${x as number} ${(y as number) + 12} ${(x as number) + 9} ${y as number}`} fill="none" stroke="#B08968" strokeWidth={4} strokeLinecap="round" />
        ))}
        <Ellipse cx={75} cy={110} rx={22} ry={22} fill="none" stroke="#D9B992" strokeWidth={6} opacity={0.8} />
        <Ellipse cx={125} cy={110} rx={22} ry={22} fill="none" stroke="#D9B992" strokeWidth={6} opacity={0.8} />
      </Clipped>
    </G>
  ),
  'pele-panda': () => (
    <G>
      <Path d="M49 46 L52 32 L64 40 Z M151 46 L148 32 L136 40 Z" fill="#3B3350" stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
      <Clipped>
        <Ellipse cx={75} cy={110} rx={18} ry={24} fill="#3B3350" rotation={20} origin="75,110" />
        <Ellipse cx={125} cy={110} rx={18} ry={24} fill="#3B3350" rotation={-20} origin="125,110" />
      </Clipped>
      <Circle cx={72} cy={108} r={6} fill="#FFFFFF" />
      <Circle cx={128} cy={108} r={6} fill="#FFFFFF" />
    </G>
  ),
  'pele-robo': () => (
    <G>
      <Path d="M100 50 V30" stroke={LINE} strokeWidth={4} strokeLinecap="round" />
      <Circle cx={100} cy={26} r={7} fill="#E5534B" stroke={LINE} strokeWidth={3} />
      <Clipped>
        <Path d="M30 90 H170 M30 148 H170 M100 148 V172" stroke="#7B8499" strokeWidth={3} opacity={0.8} />
        {[[44, 98], [156, 98], [44, 140], [156, 140]].map(([x, y], i) => (
          <Circle key={i} cx={x} cy={y} r={3.5} fill="#A7A1BA" stroke={LINE} strokeWidth={1.5} />
        ))}
        <Rect x={78} y={152} width={44} height={14} rx={3} fill="#1B2A49" stroke={LINE} strokeWidth={2} />
        <Path d="M84 159 H116" stroke="#3DF2E0" strokeWidth={3} strokeLinecap="round" />
      </Clipped>
    </G>
  ),
  'pele-dragao': () => (
    <G>
      <Path d="M70 56 L62 34 L84 52 Z M130 56 L138 34 L116 52 Z" fill="#FFF3C4" stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
      <Clipped>
        <Rect width={W} height={H} fill="#6FC17A" opacity={0.55} />
        <Ellipse cx={100} cy={150} rx={44} ry={24} fill="#FFF3C4" opacity={0.85} />
        {[[56, 96], [84, 84], [116, 84], [144, 96], [70, 120], [130, 120], [48, 140], [152, 140]].map(([x, y], i) => (
          <Path key={i} d={`M${(x as number) - 8} ${y as number} Q${x as number} ${(y as number) - 10} ${(x as number) + 8} ${y as number}`} fill="none" stroke="#3E8E4C" strokeWidth={3} strokeLinecap="round" />
        ))}
      </Clipped>
      <Path d="M168 150 Q190 150 188 126 Q182 140 168 138 Z" fill="#6FC17A" stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
    </G>
  ),
  'pele-fantasma': () => (
    <G>
      <Clipped>
        <Rect width={W} height={H} fill="#C8DCFF" opacity={0.4} />
        <Path d="M30 150 Q45 168 60 152 Q75 172 90 154 Q105 174 120 154 Q135 172 150 152 Q160 166 170 150" fill="none" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.9} />
      </Clipped>
      <Path d={star(30, 56, 7)} fill="#DCE8FF" />
      <Path d={star(176, 70, 6)} fill="#DCE8FF" />
      <Path d="M170 138 Q192 128 184 104 Q196 122 176 146 Z" fill="#DCE8FF" stroke={LINE} strokeWidth={2.5} opacity={0.9} />
    </G>
  ),
  'pele-galaxia': () => (
    <G>
      <Clipped>
        <Rect width={W} height={H} fill="#4B3F9E" opacity={0.78} />
        <Ellipse cx={100} cy={120} rx={60} ry={18} fill="none" stroke="#FFC7F0" strokeWidth={4} opacity={0.8} rotation={-20} origin="100,120" />
        <Circle cx={72} cy={96} r={7} fill="#FF8FB3" />
        <Circle cx={132} cy={150} r={5} fill="#7CC4FF" />
        {scatter(SPOTS, (x, y, r, i) => (
          <Path key={i} d={star(x, y, r)} fill={i % 2 === 0 ? '#FFF3C4' : '#FFFFFF'} />
        ))}
      </Clipped>
    </G>
  ),
};
