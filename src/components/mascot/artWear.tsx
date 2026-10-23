import { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import { Bow, Flower, LINE, star, stroke, type Art } from './artKit';

/** Coração centrado em (x, y), com largura 2s. */
const heart = (x: number, y: number, s: number) =>
  `M${x} ${y + s * 0.9} C${x - s * 1.6} ${y - s * 0.2} ${x - s * 0.8} ${y - s * 1.1} ${x} ${y - s * 0.3} C${x + s * 0.8} ${y - s * 1.1} ${x + s * 1.6} ${y - s * 0.2} ${x} ${y + s * 0.9} Z`;

const RAINBOW = ['#E5534B', '#F28C28', '#FFD166', '#6BAE5C', '#4F86C0', '#8A63B8'] as const;

// ---------------------------------------------------------------- cabeça (novos)
export const HEAD_MORE: Record<string, Art> = {
  'chapeu-festa': () => (
    <G>
      <Path d="M76 60 L100 8 L124 60 Z" fill="#FF9EBB" {...stroke} />
      <Path d="M84 42 L116 42 M80 52 L120 52" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" />
      <Circle cx={100} cy={8} r={7} fill="#FFD166" {...stroke} />
      <Circle cx={92} cy={30} r={3} fill="#7CC4FF" />
      <Circle cx={108} cy={26} r={3} fill="#B9A4FF" />
    </G>
  ),
  'orelhas-coelho': () => (
    <G>
      <Ellipse cx={72} cy={26} rx={12} ry={34} fill="#FFFFFF" rotation={-10} origin="72,26" {...stroke} />
      <Ellipse cx={72} cy={28} rx={5.5} ry={24} fill="#FFB9D0" rotation={-10} origin="72,28" />
      <Ellipse cx={128} cy={26} rx={12} ry={34} fill="#FFFFFF" rotation={10} origin="128,26" {...stroke} />
      <Ellipse cx={128} cy={28} rx={5.5} ry={24} fill="#FFB9D0" rotation={10} origin="128,28" />
    </G>
  ),
  'chapeu-cowboy': () => (
    <G>
      <Path d="M40 62 Q56 72 84 62 L84 52 Q70 52 60 44 Q48 54 40 62 Z" fill="#B57A45" {...stroke} />
      <Path d="M160 62 Q144 72 116 62 L116 52 Q130 52 140 44 Q152 54 160 62 Z" fill="#B57A45" {...stroke} />
      <Path d="M70 58 Q68 28 84 24 Q100 34 116 24 Q132 28 130 58 Q100 68 70 58 Z" fill="#C98F55" {...stroke} />
      <Path d="M71 50 Q100 60 129 50" fill="none" stroke="#6B3F22" strokeWidth={7} />
      <Circle cx={100} cy={57} r={4} fill="#FFD166" stroke={LINE} strokeWidth={2} />
    </G>
  ),
  'chapeu-pirata': () => (
    <G>
      <Path d="M40 62 Q62 24 100 24 Q138 24 160 62 Q130 50 100 52 Q70 50 40 62 Z" fill="#2A2438" {...stroke} />
      <Path d="M52 56 Q100 42 148 56" fill="none" stroke="#FFD166" strokeWidth={4} strokeLinecap="round" />
      <Circle cx={100} cy={38} r={8} fill="#FFFFFF" stroke={LINE} strokeWidth={2} />
      <Circle cx={97} cy={37} r={1.8} fill={LINE} />
      <Circle cx={103} cy={37} r={1.8} fill={LINE} />
      <Path d="M92 46 L108 30 M108 46 L92 30" stroke="#FFFFFF" strokeWidth={2.5} strokeLinecap="round" opacity={0.8} />
    </G>
  ),
  kabuto: () => (
    <G>
      <Path d="M58 66 L44 90 L70 80 Z" fill="#2F3A56" {...stroke} />
      <Path d="M142 66 L156 90 L130 80 Z" fill="#2F3A56" {...stroke} />
      <Path d="M60 66 Q60 26 100 26 Q140 26 140 66 Z" fill="#4A5A8A" {...stroke} />
      <Path d="M60 62 Q100 74 140 62" fill="none" stroke="#FFD166" strokeWidth={5} strokeLinecap="round" />
      <Path d="M100 30 Q86 4 56 8 Q84 14 96 34 Z" fill="#FFD166" {...stroke} />
      <Path d="M100 30 Q114 4 144 8 Q116 14 104 34 Z" fill="#FFD166" {...stroke} />
      <Circle cx={100} cy={46} r={5} fill="#E5534B" stroke={LINE} strokeWidth={2} />
    </G>
  ),
  'capacete-astronauta': () => (
    <G>
      <Circle cx={100} cy={102} r={78} fill="rgba(190,225,255,0.2)" stroke="#E8EEF7" strokeWidth={8} />
      <Path d="M48 70 Q58 44 84 34" fill="none" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" opacity={0.8} />
      <Ellipse cx={100} cy={176} rx={64} ry={9} fill="#C9D2E0" {...stroke} />
      <Circle cx={160} cy={72} r={5} fill="#E5534B" stroke={LINE} strokeWidth={2} />
    </G>
  ),
  tiara: () => (
    <G>
      <Path d="M70 58 L76 42 L88 54 L100 34 L112 54 L124 42 L130 58 Z" fill="#E8EEF7" {...stroke} />
      <Circle cx={100} cy={46} r={4.5} fill="#FF7AA8" stroke={LINE} strokeWidth={2} />
      <Circle cx={80} cy={54} r={3} fill="#7CC4FF" stroke={LINE} strokeWidth={1.8} />
      <Circle cx={120} cy={54} r={3} fill="#7CC4FF" stroke={LINE} strokeWidth={1.8} />
    </G>
  ),
  'bandana-vermelha': () => (
    <G>
      <Path d="M32 84 Q100 66 168 84 L168 96 Q100 78 32 96 Z" fill="#D64545" {...stroke} />
      <Circle cx={60} cy={86} r={2.5} fill="#FFFFFF" />
      <Circle cx={84} cy={80} r={2.5} fill="#FFFFFF" />
      <Circle cx={116} cy={80} r={2.5} fill="#FFFFFF" />
      <Circle cx={140} cy={86} r={2.5} fill="#FFFFFF" />
      <Path d="M168 90 L188 80 M168 94 L190 100" stroke="#D64545" strokeWidth={5} strokeLinecap="round" />
    </G>
  ),
  'coroa-imperial': () => (
    <G>
      <Path d="M62 62 L66 28 L82 46 L100 14 L118 46 L134 28 L138 62 Z" fill="#FFD166" {...stroke} />
      <Rect x={62} y={52} width={76} height={12} rx={3} fill="#C0392B" {...stroke} />
      <Circle cx={66} cy={26} r={4} fill="#FFFFFF" stroke={LINE} strokeWidth={2} />
      <Circle cx={134} cy={26} r={4} fill="#FFFFFF" stroke={LINE} strokeWidth={2} />
      <Circle cx={100} cy={12} r={4.5} fill="#FFFFFF" stroke={LINE} strokeWidth={2} />
      <Circle cx={100} cy={58} r={4} fill="#7CC4FF" stroke={LINE} strokeWidth={2} />
      <Circle cx={82} cy={58} r={3} fill="#6BAE5C" stroke={LINE} strokeWidth={1.8} />
      <Circle cx={118} cy={58} r={3} fill="#6BAE5C" stroke={LINE} strokeWidth={1.8} />
    </G>
  ),
  'chapeu-viajante': () => (
    <G>
      <Ellipse cx={100} cy={60} rx={60} ry={10} fill="#B89C62" {...stroke} />
      <Path d="M70 60 Q68 28 100 26 Q132 28 130 60 Z" fill="#C8A66A" {...stroke} />
      <Rect x={70} y={48} width={60} height={9} fill="#7A4B2A" stroke={LINE} strokeWidth={2.5} />
      <Path d="M124 50 Q140 30 150 22 Q146 38 134 54 Z" fill="#E5534B" {...stroke} />
    </G>
  ),
  'aureola-prata': () => (
    <G>
      <Ellipse cx={100} cy={20} rx={36} ry={9} fill="none" stroke={LINE} strokeWidth={11} />
      <Ellipse cx={100} cy={20} rx={36} ry={9} fill="none" stroke="#DDE3EE" strokeWidth={7} />
      <Path d="M70 17 Q100 8 130 17" fill="none" stroke="#FFFFFF" strokeWidth={2.5} strokeLinecap="round" />
    </G>
  ),
  'halo-dourado': () => (
    <G>
      <Ellipse cx={100} cy={20} rx={36} ry={9} fill="none" stroke={LINE} strokeWidth={11} />
      <Ellipse cx={100} cy={20} rx={36} ry={9} fill="none" stroke="#FFD166" strokeWidth={7} />
      <Path d={star(144, 12, 7)} fill="#FFF3C4" />
      <Path d={star(58, 10, 5)} fill="#FFF3C4" />
    </G>
  ),
  'chifres-oni': () => (
    <G>
      <Path d="M58 56 L50 24 L76 48 Z" fill="#E5534B" {...stroke} />
      <Path d="M142 56 L150 24 L124 48 Z" fill="#E5534B" {...stroke} />
      <Path d="M54 40 L62 42 M146 40 L138 42" stroke={LINE} strokeWidth={2} strokeLinecap="round" opacity={0.5} />
    </G>
  ),
  'coroa-arco-iris': () => (
    <G>
      <Path d="M64 62 L66 30 L82 48 L100 16 L118 48 L134 30 L136 62 Z" fill="#FFF3C4" {...stroke} />
      {[[66, 28], [82, 46], [100, 14], [118, 46], [134, 28]].map(([x, y], i) => (
        <Circle key={i} cx={x} cy={y} r={5} fill={RAINBOW[i] ?? '#FFFFFF'} stroke={LINE} strokeWidth={2} />
      ))}
      <Rect x={64} y={54} width={72} height={10} rx={3} fill="#FFFFFF" {...stroke} />
      {RAINBOW.map((c, i) => (
        <Rect key={c} x={68 + i * 11} y={56} width={9} height={6} fill={c} />
      ))}
      <Path d={star(152, 20, 7)} fill="#FFD166" />
      <Path d={star(48, 28, 5)} fill="#B9A4FF" />
    </G>
  ),
  'fita-sakura': () => (
    <G>
      <Bow x={70} y={54} color="#FFB9D0" />
      <Flower x={70} y={54} r={7} petal="#FFFFFF" center="#FF7AA8" />
    </G>
  ),
};

// ---------------------------------------------------------------- rosto (novos)
export const FACE_MORE: Record<string, Art> = {
  'oculos-coracao': () => (
    <G>
      <Path d={heart(75, 108, 15)} fill="rgba(255,122,168,0.55)" {...stroke} />
      <Path d={heart(125, 108, 15)} fill="rgba(255,122,168,0.55)" {...stroke} />
      <Path d="M90 104 Q100 98 110 104" fill="none" stroke={LINE} strokeWidth={3.5} strokeLinecap="round" />
      <Path d="M58 104 L44 98 M142 104 L156 98" stroke={LINE} strokeWidth={3} strokeLinecap="round" />
    </G>
  ),
  'oculos-3d': () => (
    <G>
      <Rect x={55} y={96} width={40} height={24} rx={4} fill="rgba(229,83,75,0.5)" {...stroke} />
      <Rect x={105} y={96} width={40} height={24} rx={4} fill="rgba(79,173,226,0.5)" {...stroke} />
      <Path d="M95 106 H105" stroke={LINE} strokeWidth={3.5} />
      <Path d="M55 104 L44 98 M145 104 L156 98" stroke={LINE} strokeWidth={3} strokeLinecap="round" />
    </G>
  ),
  monoculo: () => (
    <G>
      <Circle cx={125} cy={108} r={17} fill="rgba(255,255,255,0.28)" stroke="#C9972B" strokeWidth={4} />
      <Path d="M140 118 Q158 134 150 168" fill="none" stroke="#C9972B" strokeWidth={2.5} strokeDasharray="3 3" />
      <Path d="M115 100 Q120 96 127 98" fill="none" stroke="#FFFFFF" strokeWidth={2.5} strokeLinecap="round" />
    </G>
  ),
  'mascara-heroi': () => (
    <G>
      <Path d="M50 100 Q75 86 100 98 Q125 86 150 100 Q150 124 124 122 Q112 120 100 114 Q88 120 76 122 Q50 124 50 100 Z" fill="#3B6FD6" {...stroke} />
      <Ellipse cx={75} cy={108} rx={11} ry={9} fill="#FFFFFF" stroke={LINE} strokeWidth={2} />
      <Ellipse cx={125} cy={108} rx={11} ry={9} fill="#FFFFFF" stroke={LINE} strokeWidth={2} />
      <Circle cx={77} cy={108} r={4} fill={LINE} />
      <Circle cx={127} cy={108} r={4} fill={LINE} />
    </G>
  ),
  'oculos-leitor': () => (
    <G>
      <Path d="M58 102 H92 Q92 124 75 124 Q58 124 58 102 Z" fill="rgba(255,255,255,0.3)" stroke="#8A5A44" strokeWidth={3.5} strokeLinejoin="round" />
      <Path d="M108 102 H142 Q142 124 125 124 Q108 124 108 102 Z" fill="rgba(255,255,255,0.3)" stroke="#8A5A44" strokeWidth={3.5} strokeLinejoin="round" />
      <Path d="M92 104 Q100 98 108 104" fill="none" stroke="#8A5A44" strokeWidth={3} strokeLinecap="round" />
      <Path d="M58 104 L44 100 M142 104 L156 100" stroke="#8A5A44" strokeWidth={3} strokeLinecap="round" />
    </G>
  ),
  'brilho-estrela': () => (
    <G>
      <Path d={star(54, 94, 9)} fill="#FFD166" />
      <Path d={star(146, 92, 11)} fill="#FFD166" />
      <Path d={star(160, 116, 6)} fill="#FFF3C4" />
      <Path d={star(42, 118, 5)} fill="#FFF3C4" />
    </G>
  ),
  'oculos-estrela': () => (
    <G>
      <Path d={star(75, 108, 17)} fill="rgba(255,209,102,0.7)" {...stroke} />
      <Path d={star(125, 108, 17)} fill="rgba(255,209,102,0.7)" {...stroke} />
      <Path d="M92 106 Q100 100 108 106" fill="none" stroke={LINE} strokeWidth={3} strokeLinecap="round" />
      <Path d="M58 104 L44 98 M142 104 L156 98" stroke={LINE} strokeWidth={3} strokeLinecap="round" />
    </G>
  ),
  'oculos-cyber': () => (
    <G>
      <Rect x={50} y={96} width={100} height={24} rx={12} fill="#1B2A49" {...stroke} />
      <Rect x={58} y={103} width={84} height={6} rx={3} fill="#3DF2E0" />
      <Path d="M62 114 H92 M108 114 H138" stroke="#3DF2E0" strokeWidth={2} strokeLinecap="round" opacity={0.6} />
      <Path d="M50 108 L42 104 M150 108 L158 104" stroke={LINE} strokeWidth={3} strokeLinecap="round" />
    </G>
  ),
  'mascara-kitsune-ouro': () => (
    <G transform="rotate(18 150 64)">
      <Path d="M132 52 L136 34 L146 46 Z M168 52 L164 34 L154 46 Z" fill="#FFD166" {...stroke} />
      <Ellipse cx={150} cy={66} rx={21} ry={24} fill="#FFF3C4" {...stroke} />
      <Path d="M134 62 Q142 58 146 66 M166 62 Q158 58 154 66" fill="none" stroke="#C0392B" strokeWidth={3} strokeLinecap="round" />
      <Path d="M134 74 L128 84 M166 74 L172 84" stroke="#C0392B" strokeWidth={3} strokeLinecap="round" />
      <Ellipse cx={150} cy={74} rx={4} ry={3} fill={LINE} />
      <Path d={star(120, 44, 6)} fill="#FFD166" />
    </G>
  ),
};

// ---------------------------------------------------------------- pescoço (novos)
export const NECK_MORE: Record<string, Art> = {
  'cachecol-listrado': () => (
    <G>
      <Path d="M44 142 Q100 168 156 142 L158 158 Q100 184 42 158 Z" fill="#FFD166" {...stroke} />
      <Path d="M62 150 L58 170 M84 156 L82 176 M106 158 L106 178 M128 156 L130 176 M148 150 L152 168" stroke="#E5534B" strokeWidth={5} />
      <Path d="M136 158 L150 188 L130 190 L122 166" fill="#FFD166" {...stroke} />
      <Path d="M132 178 L142 176 M128 186 L146 184" stroke="#E5534B" strokeWidth={4} />
    </G>
  ),
  'gravata-longa': () => (
    <G>
      <Path d="M70 142 L100 158 L130 142 L130 152 L100 166 L70 152 Z" fill="#FFFFFF" {...stroke} />
      <Path d="M94 158 L106 158 L110 170 L100 188 L90 170 Z" fill="#4F86C0" {...stroke} />
      <Path d="M94 166 L106 172 M92 174 L108 180" stroke="#FFFFFF" strokeWidth={2.5} opacity={0.7} />
    </G>
  ),
  'colar-perola': () => (
    <G>
      {Array.from({ length: 9 }, (_, i) => {
        const t = i / 8;
        const x = 50 + t * 100;
        const y = 146 + Math.sin(t * Math.PI) * 22;
        return <Circle key={i} cx={x} cy={y} r={5.5} fill="#FFFDF7" stroke={LINE} strokeWidth={2} />;
      })}
    </G>
  ),
  'colar-havaiano': () => (
    <G>
      <Path d="M48 142 Q100 168 152 142" fill="none" stroke="#6BAE5C" strokeWidth={4} />
      {[[58, 148, '#FF9EBB'], [76, 158, '#FFD166'], [100, 164, '#FF7AA8'], [124, 158, '#FFD166'], [142, 148, '#FF9EBB']].map(([x, y, c], i) => (
        <Flower key={i} x={x as number} y={y as number} r={8} petal={c as string} />
      ))}
    </G>
  ),
  'lenco-seda': () => (
    <G>
      <Path d="M50 142 Q100 166 150 142 L132 164 Q100 180 68 164 Z" fill="#B9A4FF" {...stroke} />
      <Circle cx={100} cy={162} r={7} fill="#9B82F0" {...stroke} />
      <Path d="M96 168 L88 186 L100 180 L112 186 L104 168" fill="#B9A4FF" {...stroke} />
    </G>
  ),
  'faixa-azul': () => (
    <G>
      <Path d="M38 146 Q100 166 162 146 L162 160 Q100 180 38 160 Z" fill="#3B6FD6" {...stroke} />
      <Rect x={92} y={156} width={16} height={14} rx={3} fill="#2D55A8" {...stroke} />
      <Path d="M96 168 L86 188 M104 168 L116 188" stroke="#3B6FD6" strokeWidth={6} strokeLinecap="round" />
    </G>
  ),
  megafone: () => (
    <G>
      <Path d="M132 150 L168 134 L168 176 L132 164 Z" fill="#E5534B" {...stroke} />
      <Rect x={120} y={150} width={16} height={14} rx={3} fill="#A7A1BA" {...stroke} />
      <Path d="M176 142 Q184 155 176 168 M182 136 Q194 155 182 174" fill="none" stroke={LINE} strokeWidth={3} strokeLinecap="round" />
      <Path d="M126 164 L122 178" stroke={LINE} strokeWidth={5} strokeLinecap="round" />
    </G>
  ),
  'capa-mestre': () => (
    <G>
      <Path d="M36 144 Q100 170 164 144 L186 188 L14 188 Z" fill="#6B3FA0" {...stroke} />
      <Path d="M36 144 Q100 170 164 144" fill="none" stroke="#FFD166" strokeWidth={5} />
      <Path d="M60 162 L48 186 M140 162 L152 186" stroke={LINE} strokeWidth={2} opacity={0.5} />
      <Path d={star(100, 160, 9)} fill="#FFD166" stroke={LINE} strokeWidth={1.5} />
    </G>
  ),
  'asas-anjo': () => (
    <G>
      <Path d="M36 112 Q-2 84 6 126 Q10 156 40 154 Z" fill="#FFFFFF" {...stroke} />
      <Path d="M30 118 Q12 112 12 132 M34 130 Q18 130 18 146" fill="none" stroke="#C9D2E0" strokeWidth={3} strokeLinecap="round" />
      <Path d="M164 112 Q202 84 194 126 Q190 156 160 154 Z" fill="#FFFFFF" {...stroke} />
      <Path d="M170 118 Q188 112 188 132 M166 130 Q182 130 182 146" fill="none" stroke="#C9D2E0" strokeWidth={3} strokeLinecap="round" />
    </G>
  ),
  'capa-estrelada': () => (
    <G>
      <Path d="M34 144 Q100 172 166 144 L190 188 L10 188 Z" fill="#2A2F6B" {...stroke} />
      <Path d={star(60, 170, 6)} fill="#FFD166" />
      <Path d={star(100, 178, 8)} fill="#FFF3C4" />
      <Path d={star(140, 168, 6)} fill="#FFD166" />
      <Path d={star(82, 158, 4)} fill="#B9A4FF" />
      <Path d={star(122, 160, 4)} fill="#B9A4FF" />
      <Path d="M36 144 Q100 170 164 144" fill="none" stroke="#FFD166" strokeWidth={4} />
    </G>
  ),
};
