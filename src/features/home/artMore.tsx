import type { ReactNode } from 'react';
import { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

/** Fase 2 da Casa do Mochi: Sala, Cozinha, Ofurô e Varanda (mesma cena de 320 x 200 e mesmo traço da fase 1; o centro de baixo é do Mochi). */

const LINE = '#4A3B5C';
const stroke = { stroke: LINE, strokeWidth: 2.5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

export const MORE_BACKGROUND: Readonly<Record<string, ReactNode>> = {
  sala: (
    <G>
      <Rect x={0} y={0} width={320} height={140} fill="#EDE6FF" />
      <Rect x={0} y={140} width={320} height={60} fill="#C9D68F" />
      <Rect x={0} y={134} width={320} height={8} fill="#8A5A2B" />
      <Path d="M0 160 H320 M0 182 H320 M80 140 V200 M160 140 V200 M240 140 V200" stroke="#A9B873" strokeWidth={2} />
    </G>
  ),
  cozinha: (
    <G>
      <Rect x={0} y={0} width={320} height={140} fill="#FFF3C4" />
      <Path d="M0 70 H320 M0 100 H320 M40 40 V140 M80 40 V140 M120 40 V140 M160 40 V140 M200 40 V140 M240 40 V140 M280 40 V140" stroke="#F2DC8E" strokeWidth={1.5} />
      <Rect x={0} y={140} width={320} height={60} fill="#E8EEF2" />
      <Rect x={0} y={134} width={320} height={8} fill="#B8C4CC" />
      <Path d="M0 170 H320 M64 140 V200 M128 140 V200 M192 140 V200 M256 140 V200" stroke="#C9D4DB" strokeWidth={2} />
    </G>
  ),
  ofuro: (
    <G>
      <Rect x={0} y={0} width={320} height={140} fill="#E3C79C" />
      <Path d="M32 0 V140 M64 0 V140 M96 0 V140 M128 0 V140 M160 0 V140 M192 0 V140 M224 0 V140 M256 0 V140 M288 0 V140" stroke="#CDAE7F" strokeWidth={2} />
      <Rect x={0} y={140} width={320} height={60} fill="#B9C4C9" />
      <Rect x={0} y={134} width={320} height={8} fill="#8FA0A8" />
      <Path d="M0 164 H320 M0 184 H320 M70 140 V200 M150 140 V200 M230 140 V200" stroke="#A3B1B8" strokeWidth={2} />
    </G>
  ),
  varanda: (
    <G>
      <Rect x={0} y={0} width={320} height={120} fill="#CDEBFF" />
      <Circle cx={280} cy={30} r={16} fill="#FFE27A" />
      <Ellipse cx={90} cy={46} rx={34} ry={10} fill="#FFFFFF" opacity={0.9} />
      <Path d="M0 96 Q60 70 120 96 T240 96 T320 96 V120 H0 Z" fill="#9ED8A4" />
      <Rect x={0} y={120} width={320} height={80} fill="#C99A66" />
      <Rect x={0} y={116} width={320} height={8} fill="#8A5A2B" />
      <Path d="M0 148 H320 M0 176 H320" stroke="#A9794A" strokeWidth={2} />
      <Rect x={0} y={0} width={320} height={10} fill="#8A5A2B" />
    </G>
  ),
};

export const MORE_FURNITURE: Readonly<Record<string, ReactNode>> = {
  // --- Sala ---
  sofa: (
    <G>
      <Rect x={8} y={104} width={100} height={34} rx={10} fill="#9C86F2" {...stroke} />
      <Rect x={4} y={122} width={108} height={34} rx={10} fill="#B9A4FF" {...stroke} />
      <Rect x={2} y={112} width={16} height={46} rx={8} fill="#9C86F2" {...stroke} />
      <Rect x={98} y={112} width={16} height={46} rx={8} fill="#9C86F2" {...stroke} />
      <Rect x={14} y={156} width={8} height={10} fill="#8A5A2B" {...stroke} />
      <Rect x={94} y={156} width={8} height={10} fill="#8A5A2B" {...stroke} />
    </G>
  ),
  kotatsu: (
    <G>
      <Path d="M226 140 H312 L318 172 H220 Z" fill="#FF9EBB" {...stroke} />
      <Rect x={222} y={128} width={92} height={12} rx={3} fill="#C98E5A" {...stroke} />
      <Circle cx={250} cy={120} r={8} fill="#FF9A4D" {...stroke} />
      <Path d="M250 112 Q254 106 258 108" fill="none" stroke="#2E8B57" strokeWidth={2.5} strokeLinecap="round" />
      <Rect x={272} y={112} width={20} height={16} rx={3} fill="#FFFFFF" {...stroke} />
    </G>
  ),
  tv: (
    <G>
      <Rect x={232} y={34} width={76} height={52} rx={4} fill="#2B2B3A" {...stroke} />
      <Rect x={238} y={40} width={64} height={40} rx={2} fill="#7CC4FF" />
      <Path d="M246 70 L256 58 L264 66 L276 52 L294 72 Z" fill="#5CC783" />
      <Circle cx={286} cy={50} r={4} fill="#FFE27A" />
      <Rect x={260} y={86} width={20} height={8} rx={2} fill="#2B2B3A" {...stroke} />
    </G>
  ),
  almofadas: (
    <G>
      <Ellipse cx={34} cy={184} rx={26} ry={11} fill="#FF9EBB" {...stroke} />
      <Circle cx={34} cy={183} r={3} fill="#FFF3C4" />
      <Ellipse cx={80} cy={190} rx={22} ry={9} fill="#7CC4FF" {...stroke} />
      <Circle cx={80} cy={189} r={2.5} fill="#FFF3C4" />
    </G>
  ),
  relogio: (
    <G>
      <Circle cx={160} cy={40} r={24} fill="#FFFFFF" {...stroke} />
      <Path d="M160 24 V40 L172 46" fill="none" stroke={LINE} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={160} cy={40} r={2.5} fill={LINE} />
      <Path d="M160 18 V22 M160 58 V62 M138 40 H142 M178 40 H182" stroke={LINE} strokeWidth={2.5} strokeLinecap="round" />
    </G>
  ),

  // --- Cozinha ---
  geladeira: (
    <G>
      <Rect x={8} y={36} width={58} height={132} rx={6} fill="#E8EEF2" {...stroke} />
      <Path d="M8 90 H66" stroke={LINE} strokeWidth={2.5} />
      <Rect x={54} y={52} width={5} height={24} rx={2} fill="#8FA0A8" {...stroke} />
      <Rect x={54} y={102} width={5} height={32} rx={2} fill="#8FA0A8" {...stroke} />
      <Rect x={18} y={46} width={18} height={14} rx={2} fill="#FFB9D0" />
    </G>
  ),
  fogao: (
    <G>
      <Rect x={234} y={118} width={78} height={50} rx={5} fill="#D5D9DE" {...stroke} />
      <Rect x={242} y={128} width={62} height={30} rx={3} fill="#B8BEC6" />
      <Circle cx={252} cy={124} r={3.5} fill={LINE} />
      <Circle cx={292} cy={124} r={3.5} fill={LINE} />
      <Rect x={244} y={100} width={34} height={18} rx={4} fill="#FF9A76" {...stroke} />
      <Ellipse cx={261} cy={100} rx={20} ry={4} fill="#FFB89D" {...stroke} />
      <Path d="M254 92 Q250 84 256 78 M266 92 Q262 84 268 76" fill="none" stroke="#FFFFFF" strokeWidth={2.5} strokeLinecap="round" />
    </G>
  ),
  'prateleira-cozinha': (
    <G>
      <Rect x={100} y={60} width={120} height={6} rx={2} fill="#8A5A2B" {...stroke} />
      <Ellipse cx={120} cy={52} rx={12} ry={7} fill="#FFFFFF" {...stroke} />
      <Ellipse cx={146} cy={52} rx={12} ry={7} fill="#7CC4FF" {...stroke} />
      <Path d="M170 60 L174 42 H190 L194 60 Z" fill="#FF9EBB" {...stroke} />
      <Path d="M200 60 V44 H214 V60" fill="#FFD166" {...stroke} />
      <Rect x={100} y={96} width={120} height={6} rx={2} fill="#8A5A2B" {...stroke} />
      <Path d="M112 96 L116 80 H132 L136 96 Z" fill="#E5534B" {...stroke} />
      <Path d="M150 96 L154 78 H170 L174 96 Z" fill="#5DADE2" {...stroke} />
      <Path d="M188 96 L192 82 H206 L210 96 Z" fill="#7DD69A" {...stroke} />
    </G>
  ),
  frutas: (
    <G transform="translate(-226 10)">
      <Path d="M236 172 Q270 196 304 172 Z" fill="#C98E5A" {...stroke} />
      <Circle cx={252} cy={166} r={9} fill="#E5534B" {...stroke} />
      <Circle cx={272} cy={162} r={9} fill="#FFB347" {...stroke} />
      <Circle cx={290} cy={167} r={9} fill="#7DD69A" {...stroke} />
      <Path d="M272 154 Q276 148 282 150" fill="none" stroke="#2E8B57" strokeWidth={2.5} strokeLinecap="round" />
    </G>
  ),
  banqueta: (
    <G transform="translate(26 0)">
      <Ellipse cx={84} cy={140} rx={18} ry={7} fill="#C98E5A" {...stroke} />
      <Path d="M70 144 L66 176 M98 144 L102 176 M84 146 V176" stroke="#8A5A2B" strokeWidth={4} strokeLinecap="round" />
    </G>
  ),

  // --- Ofurô ---
  banheira: (
    <G>
      <Path d="M200 112 H312 V150 Q312 172 290 172 H222 Q200 172 200 150 Z" fill="#C98E5A" {...stroke} />
      <Ellipse cx={256} cy={112} rx={56} ry={9} fill="#9ADCF2" {...stroke} />
      <Path d="M214 124 V164 M232 124 V168 M256 124 V170 M280 124 V168 M298 124 V164" stroke="#A9794A" strokeWidth={2} />
      <Path d="M236 100 Q232 90 238 82 M256 100 Q252 90 258 80 M276 100 Q272 90 278 82" fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" opacity={0.9} />
    </G>
  ),
  banquinho: (
    <G>
      <Rect x={20} y={148} width={44} height={9} rx={3} fill="#D3B28A" {...stroke} />
      <Rect x={26} y={157} width={6} height={18} fill="#A9794A" {...stroke} />
      <Rect x={52} y={157} width={6} height={18} fill="#A9794A" {...stroke} />
      <Path d="M70 164 L74 148 H92 L96 164 Q83 172 70 164 Z" fill="#7CC4FF" {...stroke} />
    </G>
  ),
  toalhas: (
    <G transform="translate(86 4)">
      <Path d="M14 38 H84" stroke={LINE} strokeWidth={3.5} strokeLinecap="round" />
      <Path d="M24 38 V76 Q31 80 38 76 V38 Z" fill="#FFB9D0" {...stroke} />
      <Path d="M52 38 V68 Q59 72 66 68 V38 Z" fill="#8FB8FF" {...stroke} />
    </G>
  ),
  bambu: (
    <G>
      {[0, 1, 2].map((i) => (
        <G key={i}>
          <Rect x={16 + i * 14} y={0} width={9} height={112 - i * 8} fill="#7DD69A" {...stroke} />
          <Path d={`M${16 + i * 14} 30 H${25 + i * 14} M${16 + i * 14} 62 H${25 + i * 14} M${16 + i * 14} 90 H${25 + i * 14}`} stroke={LINE} strokeWidth={2} />
        </G>
      ))}
      <Path d="M44 40 Q60 30 70 36 Q58 46 44 40 Z" fill="#4FB872" {...stroke} />
    </G>
  ),
  patinho: (
    <G>
      <Ellipse cx={116} cy={190} rx={16} ry={9} fill="#FFE27A" {...stroke} />
      <Circle cx={128} cy={178} r={9} fill="#FFE27A" {...stroke} />
      <Path d="M135 178 L144 181 L135 184 Z" fill="#FF9A4D" {...stroke} />
      <Circle cx={129} cy={175} r={1.8} fill={LINE} />
    </G>
  ),

  // --- Varanda ---
  grade: (
    <G>
      <Path d="M0 100 H320 M0 114 H320" stroke="#FFFFFF" strokeWidth={6} />
      <Path d="M0 100 H320 M0 114 H320" stroke={LINE} strokeWidth={1.5} />
      {Array.from({ length: 17 }, (_, i) => (
        <Rect key={i} x={6 + i * 19} y={100} width={5} height={42} rx={2} fill="#FFFFFF" {...stroke} strokeWidth={1.8} />
      ))}
    </G>
  ),
  furin: (
    <G>
      <Path d="M60 10 V34" stroke={LINE} strokeWidth={2.5} />
      <Path d="M44 54 Q44 34 60 34 Q76 34 76 54 Z" fill="#BEE8FF" {...stroke} />
      <Path d="M60 54 V70" stroke={LINE} strokeWidth={2} />
      <Rect x={52} y={70} width={16} height={26} rx={2} fill="#FF9EBB" {...stroke} />
      <Path d="M56 78 H64 M56 84 H62" stroke={LINE} strokeWidth={1.8} />
    </G>
  ),
  vasos: (
    <G>
      <Path d="M262 172 L266 150 H286 L290 172 Z" fill="#C97A4B" {...stroke} />
      <Path d="M276 150 Q262 134 266 118 Q274 130 276 150 Z" fill="#4FB872" {...stroke} />
      <Path d="M276 150 Q290 130 288 112 Q280 128 276 150 Z" fill="#5CC783" {...stroke} />
      <Circle cx={270} cy={116} r={5} fill="#FF6F91" {...stroke} />
      <Path d="M296 172 L298 160 H312 L314 172 Z" fill="#B9A4FF" {...stroke} />
      <Path d="M305 160 Q298 148 302 140 Q308 148 305 160 Z" fill="#4FB872" {...stroke} />
    </G>
  ),
  'mesinha-cha': (
    <G>
      <Ellipse cx={46} cy={142} rx={36} ry={8} fill="#C98E5A" {...stroke} />
      <Path d="M22 146 L18 176 M70 146 L74 176 M46 150 V176" stroke="#8A5A2B" strokeWidth={4} strokeLinecap="round" />
      <Path d="M30 138 Q30 124 44 124 Q58 124 58 138 Z" fill="#FFFFFF" {...stroke} />
      <Path d="M58 130 H66" stroke={LINE} strokeWidth={2.5} strokeLinecap="round" />
      <Ellipse cx={74} cy={136} rx={7} ry={4} fill="#FFFFFF" {...stroke} />
    </G>
  ),
  'lanterna-pedra': (
    <G>
      <Rect x={218} y={150} width={30} height={20} rx={3} fill="#B8BEC6" {...stroke} />
      <Rect x={226} y={116} width={14} height={34} fill="#C9D0D6" {...stroke} />
      <Rect x={220} y={92} width={26} height={24} rx={3} fill="#B8BEC6" {...stroke} />
      <Rect x={228} y={98} width={10} height={12} fill="#FFD166" />
      <Path d="M214 92 L233 76 L252 92 Z" fill="#B8BEC6" {...stroke} />
    </G>
  ),
};
