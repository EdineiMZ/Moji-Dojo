import type { ReactNode } from 'react';
import { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import { MORE_BACKGROUND, MORE_FURNITURE } from './artMore';

/**
 * Desenhos da Casa do Mochi. Cada cômodo é uma cena de 320 x 200; o Mochi fica no meio, na frente, então os móveis ficam
 * nas laterais e no alto (o centro de baixo é dele).
 */

export const SCENE_WIDTH = 320;
export const SCENE_HEIGHT = 200;

const LINE = '#4A3B5C';
const stroke = { stroke: LINE, strokeWidth: 2.5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

/** Fundo de cada cômodo (parede e chão, ou céu e grama). */
const BASE_BACKGROUND: Readonly<Record<string, ReactNode>> = {
  quarto: (
    <G>
      <Rect x={0} y={0} width={320} height={140} fill="#FDE9D9" />
      <Rect x={0} y={140} width={320} height={60} fill="#D9A87C" />
      <Rect x={0} y={134} width={320} height={8} fill="#F4C9A6" />
      <Path d="M0 160 H320 M0 182 H320" stroke="#C48F63" strokeWidth={2} />
    </G>
  ),
  jardim: (
    <G>
      <Rect x={0} y={0} width={320} height={130} fill="#BEE8FF" />
      <Circle cx={36} cy={34} r={18} fill="#FFE27A" />
      <Ellipse cx={130} cy={40} rx={30} ry={10} fill="#FFFFFF" opacity={0.9} />
      <Ellipse cx={156} cy={34} rx={20} ry={9} fill="#FFFFFF" opacity={0.9} />
      <Rect x={0} y={130} width={320} height={70} fill="#8FD18A" />
      <Path d="M0 130 Q80 120 160 130 T320 130" fill="#8FD18A" />
    </G>
  ),
  escritorio: (
    <G>
      <Rect x={0} y={0} width={320} height={140} fill="#E6EEF9" />
      <Rect x={0} y={140} width={320} height={60} fill="#B58B5F" />
      <Rect x={0} y={134} width={320} height={8} fill="#D3B28A" />
      <Path d="M0 160 H320 M0 182 H320" stroke="#9F7549" strokeWidth={2} />
    </G>
  ),
};

export const ROOM_BACKGROUND: Readonly<Record<string, ReactNode>> = { ...BASE_BACKGROUND, ...MORE_BACKGROUND };

const BASE_FURNITURE: Readonly<Record<string, ReactNode>> = {
  // --- Quarto ---
  cama: (
    <G>
      <Rect x={10} y={118} width={92} height={40} rx={6} fill="#B98A5E" {...stroke} />
      <Rect x={14} y={104} width={84} height={24} rx={8} fill="#FFFFFF" {...stroke} />
      <Rect x={18} y={106} width={30} height={16} rx={7} fill="#FFB9D0" {...stroke} />
      <Rect x={14} y={124} width={84} height={22} rx={6} fill="#8FB8FF" {...stroke} />
      <Rect x={14} y={156} width={8} height={10} fill="#8A5A2B" {...stroke} />
      <Rect x={90} y={156} width={8} height={10} fill="#8A5A2B" {...stroke} />
    </G>
  ),
  tapete: (
    <G>
      <Ellipse cx={160} cy={186} rx={78} ry={11} fill="#FFB9D0" {...stroke} />
      <Ellipse cx={160} cy={186} rx={52} ry={6.5} fill="#FFE0EC" />
    </G>
  ),
  abajur: (
    <G>
      <Rect x={252} y={128} width={40} height={30} rx={4} fill="#B98A5E" {...stroke} />
      <Rect x={254} y={158} width={6} height={14} fill="#8A5A2B" {...stroke} />
      <Rect x={284} y={158} width={6} height={14} fill="#8A5A2B" {...stroke} />
      <Rect x={268} y={112} width={8} height={16} fill="#8A5A2B" {...stroke} />
      <Path d="M258 112 L266 90 H278 L286 112 Z" fill="#FFD166" {...stroke} />
    </G>
  ),
  'estante-quarto': (
    <G>
      <Rect x={226} y={28} width={84} height={6} rx={2} fill="#8A5A2B" {...stroke} />
      <Rect x={232} y={8} width={10} height={20} fill="#E5534B" {...stroke} />
      <Rect x={244} y={12} width={9} height={16} fill="#5DADE2" {...stroke} />
      <Rect x={255} y={6} width={10} height={22} fill="#7DD69A" {...stroke} />
      <Path d="M286 28 L282 18 H300 L296 28 Z" fill="#C97A4B" {...stroke} />
      <Path d="M291 18 Q283 8 288 4 M291 18 Q300 8 296 3" fill="none" stroke="#2E8B57" strokeWidth={3} strokeLinecap="round" />
      <Rect x={226} y={62} width={84} height={6} rx={2} fill="#8A5A2B" {...stroke} />
      <Circle cx={244} cy={54} r={7} fill="#FFB9D0" {...stroke} />
      <Rect x={262} y={44} width={22} height={18} rx={3} fill="#FFD166" {...stroke} />
    </G>
  ),
  janela: (
    <G>
      <Rect x={118} y={22} width={84} height={64} rx={4} fill="#BEE8FF" {...stroke} />
      <Path d="M160 22 V86 M118 54 H202" stroke={LINE} strokeWidth={2.5} />
      <Circle cx={140} cy={38} r={6} fill="#FFE27A" />
      <Path d="M112 18 H132 V92 Q122 84 112 92 Z" fill="#FF9EBB" {...stroke} />
      <Path d="M208 18 H188 V92 Q198 84 208 92 Z" fill="#FF9EBB" {...stroke} />
    </G>
  ),

  // --- Jardim ---
  cerca: (
    <G>
      <Path d="M0 118 H320 M0 130 H320" stroke={LINE} strokeWidth={2.5} />
      {Array.from({ length: 13 }, (_, i) => (
        <Path key={i} d={`M${6 + i * 25} 142 V108 L${12 + i * 25} 100 L${18 + i * 25} 108 V142 Z`} fill="#F4DDB0" {...stroke} />
      ))}
    </G>
  ),
  canteiro: (
    <G>
      <Ellipse cx={52} cy={178} rx={44} ry={14} fill="#8A5A2B" {...stroke} />
      {(
        [
          [28, '#FF6F91'],
          [46, '#FFD166'],
          [64, '#B9A4FF'],
          [80, '#FF9EBB'],
        ] as const
      ).map(([x, c], i) => (
        <G key={i}>
          <Path d={`M${x} 176 V158`} stroke="#2E8B57" strokeWidth={3} strokeLinecap="round" />
          <Circle cx={x} cy={154 - (i % 2) * 6} r={7} fill={c} {...stroke} />
          <Circle cx={x} cy={154 - (i % 2) * 6} r={2.5} fill="#FFF3C4" />
        </G>
      ))}
    </G>
  ),
  arvore: (
    <G transform="translate(-16 0)">
      <Path d="M262 148 L266 80 H282 L286 148 Z" fill="#8A5A2B" {...stroke} />
      <Circle cx={274} cy={56} r={38} fill="#4FB872" {...stroke} />
      <Circle cx={246} cy={78} r={24} fill="#5CC783" {...stroke} />
      <Circle cx={302} cy={78} r={24} fill="#5CC783" {...stroke} />
      <Circle cx={262} cy={44} r={5} fill="#FF6F91" />
      <Circle cx={290} cy={64} r={5} fill="#FF6F91" />
      <Circle cx={252} cy={78} r={4} fill="#FF6F91" />
    </G>
  ),
  lago: (
    <G>
      <Ellipse cx={262} cy={176} rx={52} ry={16} fill="#7CC4FF" {...stroke} />
      <Path d="M236 176 Q246 172 256 176 M268 180 Q278 176 288 180" fill="none" stroke="#FFFFFF" strokeWidth={2.5} strokeLinecap="round" />
      <Ellipse cx={288} cy={172} rx={9} ry={4} fill="#5CC783" {...stroke} />
    </G>
  ),
  banco: (
    <G>
      <Rect x={8} y={88} width={78} height={9} rx={3} fill="#C98E5A" {...stroke} />
      <Rect x={8} y={102} width={78} height={9} rx={3} fill="#C98E5A" {...stroke} />
      <Rect x={14} y={88} width={7} height={44} fill="#8A5A2B" {...stroke} />
      <Rect x={73} y={88} width={7} height={44} fill="#8A5A2B" {...stroke} />
    </G>
  ),

  // --- Escritório ---
  mesa: (
    <G>
      <Rect x={214} y={116} width={96} height={10} rx={3} fill="#C98E5A" {...stroke} />
      <Rect x={220} y={126} width={8} height={44} fill="#8A5A2B" {...stroke} />
      <Rect x={296} y={126} width={8} height={44} fill="#8A5A2B" {...stroke} />
      <Rect x={228} y={100} width={34} height={16} rx={2} fill="#FFFFFF" {...stroke} />
      <Path d="M234 106 H256 M234 111 H250" stroke="#B9A4FF" strokeWidth={2} />
      <Rect x={274} y={100} width={18} height={16} rx={3} fill="#FF9EBB" {...stroke} />
      <Path d="M292 104 Q300 106 292 112" fill="none" stroke={LINE} strokeWidth={2.5} />
    </G>
  ),
  quadro: (
    <G>
      <Rect x={22} y={20} width={58} height={58} rx={4} fill="#FFFFFF" {...stroke} />
      <Rect x={28} y={26} width={46} height={46} fill="#FFF3C4" />
      <Path d="M51 32 V64 M36 46 V64 M66 46 V64 M32 64 H70" fill="none" stroke={LINE} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
    </G>
  ),
  livros: (
    <G>
      <Rect x={10} y={148} width={52} height={12} rx={2} fill="#E5534B" {...stroke} />
      <Rect x={14} y={136} width={46} height={12} rx={2} fill="#5DADE2" {...stroke} />
      <Rect x={8} y={124} width={48} height={12} rx={2} fill="#7DD69A" {...stroke} />
      <Rect x={18} y={112} width={40} height={12} rx={2} fill="#FFD166" {...stroke} />
    </G>
  ),
  lanterna: (
    <G>
      <Path d="M160 0 V22" stroke={LINE} strokeWidth={2.5} />
      <Rect x={146} y={22} width={28} height={6} rx={2} fill="#8A5A2B" {...stroke} />
      <Ellipse cx={160} cy={46} rx={19} ry={19} fill="#FF9A76" {...stroke} />
      <Path d="M146 36 Q160 42 174 36 M144 48 Q160 54 176 48 M148 58 Q160 63 172 58" fill="none" stroke={LINE} strokeWidth={1.8} />
      <Rect x={146} y={64} width={28} height={6} rx={2} fill="#8A5A2B" {...stroke} />
    </G>
  ),
  planta: (
    <G>
      <Path d="M70 170 L74 142 H98 L102 170 Z" fill="#C97A4B" {...stroke} />
      <Path d="M86 142 Q70 126 74 108 Q84 118 86 142 Z" fill="#4FB872" {...stroke} />
      <Path d="M86 142 Q100 120 98 100 Q90 116 86 142 Z" fill="#5CC783" {...stroke} />
      <Path d="M86 142 Q84 118 88 96 Q92 118 86 142 Z" fill="#4FB872" {...stroke} />
    </G>
  ),
};

/** Cada móvel desenhado no lugar dele no cômodo (fases 1 e 2). */
export const FURNITURE_ART: Readonly<Record<string, ReactNode>> = { ...BASE_FURNITURE, ...MORE_FURNITURE };
