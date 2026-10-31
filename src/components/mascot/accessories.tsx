import type { ReactElement } from 'react';
import { Circle, Ellipse, G, Path, Polygon, Rect } from 'react-native-svg';

/**
 * Os acessórios do Mochi, desenhados no mesmo espaço do corpo (viewBox 200 × 190) e com o mesmo traço escuro. Cada item é
 * uma função sem estado que devolve só as formas; a ordem das camadas é decidida por quem desenha o Mochi.
 */
import { Art, Bow, Flower, LINE, star, stroke } from './artKit';
import { BACK_MORE, SKIN, TINTS_MORE } from './artScenes';
import { FACE_MORE, HEAD_MORE, NECK_MORE } from './artWear';
import { SEASON_BACK, SEASON_FACE, SEASON_HEAD, SEASON_NECK, SEASON_SKIN, SEASON_TINTS } from './artSeasons';

export { LINE };

// ---------------------------------------------------------------- cabeça
const HEAD: Record<string, Art> = {
  'chapeu-palha': () => (
    <G>
      <Path d="M70 58 Q70 26 100 26 Q130 26 130 58 Z" fill="#F2D88C" {...stroke} />
      <Rect x={70} y={46} width={60} height={9} fill="#E5736F" stroke={LINE} strokeWidth={2.5} />
      <Ellipse cx={100} cy={59} rx={58} ry={10} fill="#E8C77A" {...stroke} />
    </G>
  ),
  boina: () => (
    <G>
      <Ellipse cx={100} cy={50} rx={42} ry={16} fill="#8A63B8" {...stroke} />
      <Path d="M62 52 Q100 66 138 52" fill="none" stroke={LINE} strokeWidth={2.5} />
      <Circle cx={100} cy={34} r={4} fill="#6E4C99" {...stroke} />
    </G>
  ),
  'gorro-la': () => (
    <G>
      <Path d="M64 60 Q64 24 100 24 Q136 24 136 60 Z" fill="#6FA8DC" {...stroke} />
      <Rect x={60} y={52} width={80} height={14} rx={6} fill="#4F86C0" {...stroke} />
      <Path d="M76 52 V66 M92 52 V66 M108 52 V66 M124 52 V66" stroke={LINE} strokeWidth={2} />
      <Circle cx={100} cy={22} r={9} fill="#FFFFFF" {...stroke} />
    </G>
  ),
  'fita-cabelo': () => <Bow x={64} y={52} color="#FF7AA8" />,
  'chapeu-chef': () => (
    <G>
      <Circle cx={80} cy={40} r={15} fill="#FFFFFF" {...stroke} />
      <Circle cx={120} cy={40} r={15} fill="#FFFFFF" {...stroke} />
      <Circle cx={100} cy={32} r={17} fill="#FFFFFF" {...stroke} />
      <Rect x={72} y={46} width={56} height={14} rx={3} fill="#FFFFFF" {...stroke} />
    </G>
  ),
  'hachimaki-ninja': () => (
    <G>
      <Path d="M32 84 Q100 66 168 84 L168 96 Q100 78 32 96 Z" fill="#2F3A56" {...stroke} />
      <Rect x={86} y={73} width={28} height={14} rx={3} fill="#C9D2E0" {...stroke} />
      <Path d="M168 90 L186 78 M168 94 L188 98" stroke="#2F3A56" strokeWidth={5} strokeLinecap="round" />
    </G>
  ),
  'coroa-flores': () => (
    <G>
      <Path d="M52 62 Q100 36 148 62" fill="none" stroke="#6BAE5C" strokeWidth={5} strokeLinecap="round" />
      {[60, 80, 100, 120, 140].map((x, i) => (
        <Flower key={x} x={x} y={i === 2 ? 46 : i % 2 === 0 ? 54 : 49} r={9} petal={['#FF9EBB', '#FFFFFF', '#FFD166', '#B9A4FF', '#FF9EBB'][i] ?? '#FFFFFF'} />
      ))}
    </G>
  ),
  'chapeu-bruxo': () => (
    <G>
      <Path d="M62 58 L106 6 Q110 28 138 58 Z" fill="#5B3F8C" {...stroke} />
      <Rect x={72} y={44} width={58} height={8} fill="#FFD166" stroke={LINE} strokeWidth={2.5} />
      <Ellipse cx={100} cy={58} rx={56} ry={9} fill="#4A2F78" {...stroke} />
      <Path d={star(110, 26, 5)} fill="#FFD166" />
    </G>
  ),
  'hachimaki-ganbare': () => (
    <G>
      <Path d="M32 84 Q100 66 168 84 L168 96 Q100 78 32 96 Z" fill="#FFFFFF" {...stroke} />
      <Circle cx={100} cy={80} r={8} fill="#E5534B" stroke={LINE} strokeWidth={2.5} />
      <Path d="M168 90 L186 78 M168 94 L188 98" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" />
    </G>
  ),
  'coroa-dourada': () => (
    <G>
      <Path d="M66 58 L70 26 L86 44 L100 20 L114 44 L130 26 L134 58 Z" fill="#FFD166" {...stroke} />
      <Circle cx={100} cy={50} r={4} fill="#E5534B" stroke={LINE} strokeWidth={2} />
      <Circle cx={80} cy={52} r={3} fill="#7CC4FF" stroke={LINE} strokeWidth={2} />
      <Circle cx={120} cy={52} r={3} fill="#7CC4FF" stroke={LINE} strokeWidth={2} />
    </G>
  ),
  'chapeu-formatura': () => (
    <G>
      <Path d="M72 46 L72 62 Q100 74 128 62 L128 46 Z" fill="#2F3A56" {...stroke} />
      <Polygon points="100,24 152,40 100,56 48,40" fill="#3B4A6B" {...stroke} />
      <Path d="M100 40 L142 44 L142 66" fill="none" stroke="#FFD166" strokeWidth={3} strokeLinecap="round" />
      <Circle cx={142} cy={68} r={4} fill="#FFD166" stroke={LINE} strokeWidth={2} />
    </G>
  ),
  'gorro-carpa': () => (
    <G>
      <Path d="M52 46 L36 34 L38 58 Z" fill="#F28C28" {...stroke} />
      <Ellipse cx={92} cy={44} rx={42} ry={19} fill="#F28C28" {...stroke} />
      <Path d="M70 32 Q76 44 70 56 M88 28 Q94 44 88 60 M106 30 Q112 44 106 58" fill="none" stroke={LINE} strokeWidth={2} />
      <Circle cx={122} cy={40} r={6} fill="#FFFFFF" {...stroke} />
      <Circle cx={123} cy={40} r={2.5} fill={LINE} />
    </G>
  ),
  'fones-ouvido': () => (
    <G>
      <Path d="M44 108 Q44 30 100 30 Q156 30 156 108" fill="none" stroke={LINE} strokeWidth={8} strokeLinecap="round" />
      <Path d="M44 108 Q44 30 100 30 Q156 30 156 108" fill="none" stroke="#7CC4FF" strokeWidth={3.5} strokeLinecap="round" />
      <Ellipse cx={42} cy={112} rx={10} ry={16} fill="#E5534B" {...stroke} />
      <Ellipse cx={158} cy={112} rx={10} ry={16} fill="#E5534B" {...stroke} />
    </G>
  ),
  'laco-semana': () => <Bow x={100} y={44} scale={1.15} color="#B9A4FF" />,
  'chapeu-natal': () => (
    <G>
      <Path d="M62 58 Q66 22 118 24 Q142 26 150 52 Q134 40 122 44 Q96 46 62 58 Z" fill="#E5534B" {...stroke} />
      <Rect x={58} y={52} width={84} height={13} rx={6} fill="#FFFFFF" {...stroke} />
      <Circle cx={152} cy={52} r={9} fill="#FFFFFF" {...stroke} />
    </G>
  ),
  'flor-sakura': () => <Flower x={62} y={56} r={12} petal="#FFB9D0" />,
  'chapeu-abobora': () => (
    <G>
      <Ellipse cx={100} cy={46} rx={32} ry={21} fill="#F28C28" {...stroke} />
      <Path d="M100 26 Q88 46 100 67 M80 30 Q70 46 82 64 M120 30 Q130 46 118 64" fill="none" stroke={LINE} strokeWidth={2} />
      <Rect x={96} y={16} width={8} height={12} rx={2} fill="#6BAE5C" {...stroke} />
      <Path d="M104 22 Q116 14 122 22" fill="none" stroke="#6BAE5C" strokeWidth={4} strokeLinecap="round" />
    </G>
  ),
};

// ---------------------------------------------------------------- rosto
function Glasses({ rim, lens, chain = false }: { rim: string; lens: string; chain?: boolean }) {
  return (
    <G>
      <Circle cx={75} cy={108} r={15} fill={lens} stroke={rim} strokeWidth={3.5} />
      <Circle cx={125} cy={108} r={15} fill={lens} stroke={rim} strokeWidth={3.5} />
      <Path d="M90 106 Q100 100 110 106" fill="none" stroke={rim} strokeWidth={3.5} strokeLinecap="round" />
      <Path d="M60 106 L44 100 M140 106 L156 100" stroke={rim} strokeWidth={3} strokeLinecap="round" />
      {chain ? <Path d="M44 100 Q38 130 56 150" fill="none" stroke={rim} strokeWidth={2} strokeDasharray="3 3" /> : null}
    </G>
  );
}

const FACE: Record<string, Art> = {
  'oculos-redondos': () => <Glasses rim={LINE} lens="rgba(255,255,255,0.28)" />,
  'oculos-sabio': () => (
    <G>
      <Glasses rim="#C9972B" lens="rgba(255,236,170,0.3)" chain />
      <Path d={star(60, 94, 5)} fill="#FFD166" />
    </G>
  ),
  'oculos-escuros': () => (
    <G>
      <Ellipse cx={75} cy={108} rx={17} ry={12} fill="#2A2438" {...stroke} />
      <Ellipse cx={125} cy={108} rx={17} ry={12} fill="#2A2438" {...stroke} />
      <Path d="M92 106 Q100 100 108 106" fill="none" stroke={LINE} strokeWidth={4} />
      <Path d="M58 106 L44 100 M142 106 L156 100" stroke={LINE} strokeWidth={3} strokeLinecap="round" />
      <Path d="M66 103 L72 100 M116 103 L122 100" stroke="#FFFFFF" strokeWidth={2.5} strokeLinecap="round" />
    </G>
  ),
  'mascara-raposa': () => (
    <G transform="rotate(18 150 64)">
      <Path d="M132 52 L136 36 L146 46 Z M168 52 L164 36 L154 46 Z" fill="#FFFFFF" {...stroke} />
      <Ellipse cx={150} cy={66} rx={21} ry={24} fill="#FFFFFF" {...stroke} />
      <Path d="M134 62 Q142 58 146 66 M166 62 Q158 58 154 66" fill="none" stroke="#E5534B" strokeWidth={3} strokeLinecap="round" />
      <Path d="M134 74 L128 82 M166 74 L172 82" stroke="#E5534B" strokeWidth={3} strokeLinecap="round" />
      <Ellipse cx={150} cy={74} rx={4} ry={3} fill={LINE} />
    </G>
  ),
  bigode: () => (
    <Path d="M100 124 Q92 116 80 124 Q72 130 66 124 Q74 138 90 132 Q98 130 100 128 Q102 130 110 132 Q126 138 134 124 Q128 130 120 124 Q108 116 100 124 Z" fill="#3B2A2A" stroke={LINE} strokeWidth={2} strokeLinejoin="round" />
  ),
  microfone: () => (
    <G>
      <Path d="M150 172 L126 140" stroke="#6B6580" strokeWidth={9} strokeLinecap="round" />
      <Path d="M150 172 L126 140" stroke={LINE} strokeWidth={2.5} strokeLinecap="round" opacity={0.5} />
      <Circle cx={118} cy={132} r={11} fill="#A7A1BA" {...stroke} />
      <Path d="M110 128 L126 136 M110 134 L124 140" stroke={LINE} strokeWidth={1.8} />
    </G>
  ),
  'pincel-caligrafia': () => (
    <G>
      <Path d="M150 174 L176 118" stroke="#B8845A" strokeWidth={7} strokeLinecap="round" />
      <Path d="M150 174 L176 118" stroke={LINE} strokeWidth={1.8} strokeLinecap="round" opacity={0.5} />
      <Path d="M176 118 Q182 104 190 100 Q184 116 180 124 Z" fill="#2A2438" {...stroke} />
    </G>
  ),
  'mascara-oni': () => (
    <G>
      <Path d="M76 52 L70 34 L88 46 Z M124 52 L130 34 L112 46 Z" fill="#FFFFFF" {...stroke} />
      <Ellipse cx={100} cy={62} rx={28} ry={18} fill="#E5534B" {...stroke} />
      <Path d="M84 60 L96 64 M116 60 L104 64" stroke={LINE} strokeWidth={3} strokeLinecap="round" />
      <Path d="M88 72 L92 66 L96 72 L100 66 L104 72 L108 66 L112 72" fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinejoin="round" />
    </G>
  ),
};

// ---------------------------------------------------------------- pescoço
const NECK: Record<string, Art> = {
  'cachecol-vermelho': () => (
    <G>
      <Path d="M44 142 Q100 168 156 142 L158 158 Q100 184 42 158 Z" fill="#E5534B" {...stroke} />
      <Path d="M136 158 L150 188 L130 190 L122 166" fill="#E5534B" {...stroke} />
      <Path d="M70 152 V168 M100 158 V174 M130 152 V166" stroke="#FFFFFF" strokeWidth={2.5} opacity={0.7} />
    </G>
  ),
  'gravata-borboleta': () => <Bow x={100} y={152} color="#4F86C0" />,
  lenco: () => (
    <G>
      <Path d="M52 142 Q100 164 148 142 L100 182 Z" fill="#5DADE2" {...stroke} />
      <Circle cx={92} cy={158} r={2.5} fill="#FFFFFF" />
      <Circle cx={108} cy={158} r={2.5} fill="#FFFFFF" />
      <Circle cx={100} cy={168} r={2.5} fill="#FFFFFF" />
    </G>
  ),
  sininho: () => (
    <G>
      <Path d="M48 142 Q100 166 152 142" fill="none" stroke="#E5534B" strokeWidth={7} strokeLinecap="round" />
      <Circle cx={100} cy={163} r={9} fill="#FFD166" {...stroke} />
      <Path d="M92 163 H108 M100 163 V171" stroke={LINE} strokeWidth={2} strokeLinecap="round" />
    </G>
  ),
  'capa-heroi': () => (
    <G>
      <Path d="M36 144 Q100 170 164 144 L184 188 L16 188 Z" fill="#D64545" {...stroke} />
      <Path d="M60 160 L50 186 M140 160 L150 186" stroke={LINE} strokeWidth={2} opacity={0.5} />
      <Circle cx={100} cy={156} r={7} fill="#FFD166" {...stroke} />
    </G>
  ),
  lanterna: () => (
    <G>
      <Path d="M52 144 Q100 166 148 144" fill="none" stroke={LINE} strokeWidth={3} />
      <Path d="M62 152 V164" stroke={LINE} strokeWidth={2.5} />
      <Ellipse cx={62} cy={176} rx={11} ry={14} fill="#E5534B" {...stroke} />
      <Path d="M52 172 H72 M52 180 H72" stroke={LINE} strokeWidth={2} />
      <Rect x={56} y={161} width={12} height={4} fill="#4A3B5C" />
    </G>
  ),
  'medalha-sol': () => (
    <G>
      <Path d="M70 142 L100 170 L130 142" fill="none" stroke="#E5534B" strokeWidth={6} strokeLinejoin="round" />
      <Circle cx={100} cy={176} r={12} fill="#FFFFFF" {...stroke} />
      <Circle cx={100} cy={176} r={6} fill="#E5534B" />
    </G>
  ),
  'faixa-preta': () => (
    <G>
      <Path d="M38 146 Q100 166 162 146 L162 160 Q100 180 38 160 Z" fill="#2A2438" {...stroke} />
      <Rect x={92} y={156} width={16} height={14} rx={3} fill="#3B3350" {...stroke} />
      <Path d="M96 168 L86 188 M104 168 L116 188" stroke="#2A2438" strokeWidth={6} strokeLinecap="round" />
    </G>
  ),
  'fita-tanabata': () => (
    <G>
      <Path d="M48 142 Q100 166 152 142" fill="none" stroke="#7CC4FF" strokeWidth={5} strokeLinecap="round" />
      <Rect x={72} y={158} width={12} height={26} rx={2} fill="#FFD166" {...stroke} />
      <Rect x={114} y={160} width={12} height={22} rx={2} fill="#FF9EBB" {...stroke} />
      <Path d="M78 164 V178 M120 166 V176" stroke={LINE} strokeWidth={1.8} />
    </G>
  ),
};

// ---------------------------------------------------------------- fundos
const BACKDROP = { w: 200, h: 190 };

const BACK: Record<string, Art> = {
  'fundo-cerejeira': () => (
    <G>
      <Rect width={BACKDROP.w} height={BACKDROP.h} rx={20} fill="#FDE8F0" />
      <Rect y={160} width={BACKDROP.w} height={30} fill="#CDE8B8" />
      <Rect x={14} y={70} width={14} height={100} fill="#8A5A44" />
      <Circle cx={22} cy={58} r={34} fill="#FFB9D0" />
      <Circle cx={48} cy={74} r={24} fill="#FF9EBB" />
      <Circle cx={0} cy={80} r={24} fill="#FFB9D0" />
      {[[150, 40], [172, 90], [128, 120], [180, 140], [90, 28], [160, 62]].map(([x, y], i) => (
        <Ellipse key={i} cx={x} cy={y} rx={5} ry={3} fill="#FFB9D0" rotation={i * 30} origin={`${x},${y}`} />
      ))}
    </G>
  ),
  'fundo-quarto': () => (
    <G>
      <Rect width={BACKDROP.w} height={BACKDROP.h} rx={20} fill="#F6E6CF" />
      <Rect y={150} width={BACKDROP.w} height={40} fill="#C69C6D" />
      <Rect x={118} y={22} width={58} height={50} rx={4} fill="#BFE3F7" stroke="#8A5A44" strokeWidth={4} />
      <Path d="M147 22 V72 M118 47 H176" stroke="#8A5A44" strokeWidth={3} />
      <Rect x={14} y={60} width={44} height={90} fill="#A9744F" />
      <Path d="M14 90 H58 M14 120 H58" stroke="#8A5A44" strokeWidth={3} />
      <Rect x={20} y={70} width={8} height={20} fill="#E5534B" />
      <Rect x={30} y={72} width={8} height={18} fill="#4F86C0" />
      <Rect x={42} y={68} width={9} height={22} fill="#6BAE5C" />
      <Ellipse cx={100} cy={176} rx={64} ry={9} fill="#D9726A" opacity={0.8} />
    </G>
  ),
  'fundo-noite': () => (
    <G>
      <Rect width={BACKDROP.w} height={BACKDROP.h} rx={20} fill="#23294F" />
      <Circle cx={156} cy={42} r={20} fill="#FFF3C4" />
      <Circle cx={166} cy={36} r={18} fill="#23294F" />
      {[[30, 30, 6], [70, 18, 4], [110, 40, 5], [24, 90, 4], [176, 100, 5], [90, 70, 3]].map(([x, y, r], i) => (
        <Path key={i} d={star(x as number, y as number, r as number)} fill="#FFD166" />
      ))}
      <Path d="M0 160 Q50 130 100 156 Q150 134 200 158 L200 190 L0 190 Z" fill="#1A1E3D" />
    </G>
  ),
  'fundo-festival': () => (
    <G>
      <Rect width={BACKDROP.w} height={BACKDROP.h} rx={20} fill="#3A2A5E" />
      <Path d="M0 28 Q100 52 200 28" fill="none" stroke={LINE} strokeWidth={3} />
      {[22, 56, 92, 128, 164].map((x, i) => (
        <G key={x}>
          <Ellipse cx={x} cy={44 + (i % 2 === 0 ? 2 : 10)} rx={11} ry={14} fill={i % 2 === 0 ? '#E5534B' : '#FFB347'} stroke={LINE} strokeWidth={2.5} />
          <Path d={`M${x - 8} ${40 + (i % 2 === 0 ? 2 : 10)} H${x + 8}`} stroke={LINE} strokeWidth={1.8} />
        </G>
      ))}
      <Rect y={150} width={BACKDROP.w} height={40} fill="#2A1E48" />
      <Path d="M0 150 L24 120 L48 150 Z" fill="#E5534B" />
      <Path d="M152 150 L176 118 L200 150 Z" fill="#FFB347" />
    </G>
  ),
  'fundo-torii': () => (
    <G>
      <Rect width={BACKDROP.w} height={BACKDROP.h} rx={20} fill="#FFE9D2" />
      <Rect y={158} width={BACKDROP.w} height={32} fill="#B9D9A6" />
      <Rect x={12} y={50} width={16} height={116} fill="#D64545" stroke={LINE} strokeWidth={2.5} />
      <Rect x={172} y={50} width={16} height={116} fill="#D64545" stroke={LINE} strokeWidth={2.5} />
      <Path d="M2 48 Q100 28 198 48 L194 64 Q100 46 6 64 Z" fill="#2A2438" />
      <Rect x={20} y={78} width={160} height={11} fill="#D64545" stroke={LINE} strokeWidth={2.5} />
    </G>
  ),
  'fundo-fuji': () => (
    <G>
      <Rect width={BACKDROP.w} height={BACKDROP.h} rx={20} fill="#BFE3F7" />
      <Circle cx={158} cy={42} r={16} fill="#E5534B" />
      <Path d="M-10 170 L84 40 Q100 24 116 40 L210 170 Z" fill="#6D86B8" />
      <Path d="M62 76 L84 40 Q100 24 116 40 L138 76 L120 68 L104 80 L90 68 Z" fill="#FFFFFF" />
      <Ellipse cx={40} cy={36} rx={22} ry={8} fill="#FFFFFF" />
      <Ellipse cx={60} cy={32} rx={16} ry={7} fill="#FFFFFF" />
      <Rect y={160} width={BACKDROP.w} height={30} fill="#9ED08A" />
    </G>
  ),
};

/** Cores do corpo do Mochi. As orelhas por dentro acompanham o tom. */
export const TINTS: Readonly<Record<string, { body: string; pink: string }>> = {
  'cor-sakura': { body: '#FFE3EC', pink: '#FF8FB3' },
  'cor-matcha': { body: '#E6F3D2', pink: '#B7D98A' },
  'cor-ceu': { body: '#DDEBFF', pink: '#9CC4F5' },
  'cor-lavanda': { body: '#EBE1FF', pink: '#C7B0F5' },
  'cor-ouro': { body: '#FFEBA8', pink: '#F5B94B' },
  ...TINTS_MORE,
  ...SEASON_TINTS,
};

export type ArtSlot = 'head' | 'face' | 'neck' | 'back' | 'skin';

const ART: Record<ArtSlot, Record<string, Art>> = {
  head: { ...HEAD, ...HEAD_MORE, ...SEASON_HEAD },
  face: { ...FACE, ...FACE_MORE, ...SEASON_FACE },
  neck: { ...NECK, ...NECK_MORE, ...SEASON_NECK },
  back: { ...BACK, ...BACK_MORE, ...SEASON_BACK },
  skin: { ...SKIN, ...SEASON_SKIN },
};

export const hasArt = (slot: ArtSlot, id: string): boolean => ART[slot][id] !== undefined;

/** Desenha o item, ou null se não há desenho para ele (o app nunca quebra por um id desconhecido). */
export function accessoryArt(slot: ArtSlot, id: string | undefined): ReactElement | null {
  if (!id) return null;
  const art = ART[slot][id];
  return art ? art() : null;
}
