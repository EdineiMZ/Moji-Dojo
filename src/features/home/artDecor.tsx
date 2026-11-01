import type { ReactNode } from 'react';
import { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import type { TimeOfDay } from './decor';

/** Fase 3 da Casa do Mochi: decorações de datas, clima e luz da hora do dia (mesma cena de 320 x 200). */

const LINE = '#4A3B5C';
const stroke = { stroke: LINE, strokeWidth: 2.5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };
const thin = { stroke: LINE, strokeWidth: 1.8, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

/** Um coração de 12 de largura, com a ponta embaixo de (x, y). */
const heart = (x: number, y: number, color: string, key: number) => (
  <Path key={key} d={`M${x} ${y} C${x - 9} ${y - 7} ${x - 7} ${y - 16} ${x} ${y - 11} C${x + 7} ${y - 16} ${x + 9} ${y - 7} ${x} ${y} Z`} fill={color} {...thin} />
);

export const DECOR_ART: Readonly<Record<string, ReactNode>> = {
  'guirlanda-natal': (
    <G>
      <Circle cx={66} cy={58} r={25} fill="none" stroke="#4FB872" strokeWidth={13} />
      <Circle cx={66} cy={58} r={31.5} fill="none" {...stroke} strokeWidth={2} />
      <Circle cx={66} cy={58} r={18.5} fill="none" {...stroke} strokeWidth={2} />
      {([[48, 44], [84, 48], [50, 74], [86, 72], [66, 30]] as const).map(([x, y], i) => (
        <Circle key={i} cx={x} cy={y} r={3.6} fill={i % 2 === 0 ? '#E5534B' : '#FFD166'} />
      ))}
      <Path d="M66 84 L55 98 L63 94 L66 100 L69 94 L77 98 Z" fill="#E5534B" {...stroke} />
      <Circle cx={66} cy={86} r={4} fill="#E5534B" {...stroke} />
    </G>
  ),
  daruma: (
    <G>
      <Ellipse cx={34} cy={96} rx={17} ry={17} fill="#E5534B" {...stroke} />
      <Ellipse cx={34} cy={90} rx={11} ry={8} fill="#FFF3C4" {...stroke} strokeWidth={2} />
      <Circle cx={29} cy={90} r={2.6} fill={LINE} />
      <Circle cx={39} cy={90} r={2.6} fill="#FFFFFF" {...thin} />
      <Path d="M24 82 Q29 78 33 82 M35 82 Q39 78 44 82" fill="none" stroke={LINE} strokeWidth={2.2} strokeLinecap="round" />
      <Path d="M28 104 Q34 110 40 104" fill="none" stroke="#FFD166" strokeWidth={4} strokeLinecap="round" />
    </G>
  ),
  'mascara-oni': (
    <G>
      <Path d="M36 22 L42 40 L30 38 Z M76 22 L70 40 L82 38 Z" fill="#FFD166" {...stroke} />
      <Ellipse cx={56} cy={56} rx={23} ry={26} fill="#E5534B" {...stroke} />
      <Path d="M38 48 Q46 42 52 50 M74 48 Q66 42 60 50" fill="none" stroke={LINE} strokeWidth={3} strokeLinecap="round" />
      <Circle cx={45} cy={54} r={4.5} fill="#FFFFFF" {...thin} />
      <Circle cx={67} cy={54} r={4.5} fill="#FFFFFF" {...thin} />
      <Circle cx={45} cy={55} r={1.8} fill={LINE} />
      <Circle cx={67} cy={55} r={1.8} fill={LINE} />
      <Path d="M44 70 Q56 62 68 70 Q56 80 44 70 Z" fill="#7A1F2B" {...stroke} />
      <Path d="M49 68 V72 M63 68 V72" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" />
    </G>
  ),
  'guirlanda-coracoes': (
    <G>
      <Path d="M0 6 Q80 34 160 8 T320 8" fill="none" stroke={LINE} strokeWidth={2} />
      {([[20, 26, '#FF6F91'], [64, 33, '#FFB9D0'], [108, 33, '#E5534B'], [152, 20, '#FF9EBB'], [196, 12, '#FF6F91'], [240, 22, '#FFB9D0'], [284, 24, '#E5534B']] as const).map(([x, y, c], i) => heart(x, y + 6, c, i))}
    </G>
  ),
  hinadan: (
    <G>
      <Rect x={224} y={70} width={88} height={14} rx={2} fill="#E5534B" {...stroke} />
      <Rect x={236} y={56} width={64} height={14} rx={2} fill="#C93C3C" {...stroke} />
      <Rect x={248} y={42} width={40} height={14} rx={2} fill="#E5534B" {...stroke} />
      <Circle cx={262} cy={34} r={5} fill="#FFF3C4" {...thin} />
      <Rect x={257} y={38} width={10} height={4} fill="#7CC4FF" {...thin} />
      <Circle cx={276} cy={34} r={5} fill="#FFF3C4" {...thin} />
      <Rect x={271} y={38} width={10} height={4} fill="#FFB9D0" {...thin} />
      <Circle cx={250} cy={48} r={4} fill="#FFF3C4" {...thin} />
      <Circle cx={290} cy={48} r={4} fill="#FFF3C4" {...thin} />
      <Path d="M238 52 L246 52 L242 44 Z M294 52 L302 52 L298 44 Z" fill="#FF9EBB" {...thin} />
    </G>
  ),
  'galho-sakura': (
    <G>
      <Path d="M-4 14 Q40 6 70 30 Q84 40 104 36" fill="none" stroke="#8A5A2B" strokeWidth={6} strokeLinecap="round" />
      <Path d="M44 14 Q54 36 66 48" fill="none" stroke="#8A5A2B" strokeWidth={4} strokeLinecap="round" />
      {([[14, 10], [34, 14], [54, 22], [72, 34], [90, 36], [60, 48], [100, 40], [26, 24]] as const).map(([x, y], i) => (
        <G key={i}>
          <Circle cx={x} cy={y} r={7} fill={i % 2 === 0 ? '#FFB9D0' : '#FF9EBB'} {...thin} />
          <Circle cx={x} cy={y} r={2} fill="#FFF3C4" />
        </G>
      ))}
    </G>
  ),
  koinobori: (
    <G>
      <Path d="M122 0 V92" stroke="#8A5A2B" strokeWidth={5} strokeLinecap="round" />
      <Circle cx={122} cy={4} r={5} fill="#FFD166" {...thin} />
      {([[16, 36, '#E5534B'], [44, 28, '#2F6DB5'], [70, 20, '#2B2B3A']] as const).map(([y, w, c], i) => (
        <G key={i} transform={`translate(122 ${y})`}>
          <Path d={`M0 -9 Q${w * 0.6} -13 ${w} -6 L${w + 10} -12 V12 L${w} 6 Q${w * 0.6} 11 0 9 Z`} fill={c} {...stroke} />
          <Circle cx={6} cy={-2} r={3} fill="#FFFFFF" {...thin} />
          <Circle cx={5.5} cy={-2} r={1.2} fill={LINE} />
          <Path d={`M${w * 0.35} -8 Q${w * 0.35 + 6} 0 ${w * 0.35} 8 M${w * 0.6} -8 Q${w * 0.6 + 6} 0 ${w * 0.6} 7`} fill="none" stroke="#FFFFFF" strokeWidth={1.6} opacity={0.75} />
        </G>
      ))}
    </G>
  ),
  bandeirinhas: (
    <G>
      <Path d="M0 12 Q80 38 160 14 T320 12" fill="none" stroke={LINE} strokeWidth={2} />
      {Array.from({ length: 13 }, (_, i) => {
        const x = 12 + i * 25;
        const y = 22 + Math.sin((i / 12) * Math.PI * 2) * 5;
        return <Path key={i} d={`M${x - 8} ${y - 8} L${x + 8} ${y - 8} L${x} ${y + 12} Z`} fill={['#E5534B', '#FFD166', '#4FB872', '#5DADE2', '#FF9EBB'][i % 5]} {...thin} />;
      })}
    </G>
  ),
  tanabata: (
    <G>
      <Path d="M300 0 V112" stroke="#4FB872" strokeWidth={8} strokeLinecap="round" />
      <Path d="M300 0 V112" stroke={LINE} strokeWidth={1.5} opacity={0.5} />
      <Path d="M296 30 H304 M296 62 H304 M296 92 H304" stroke={LINE} strokeWidth={2} />
      <Path d="M300 22 Q280 22 270 36 M300 54 Q282 54 274 68" fill="none" stroke="#4FB872" strokeWidth={4} strokeLinecap="round" />
      {([[270, 36, '#FF9EBB'], [274, 68, '#FFD166'], [292, 40, '#7CC4FF'], [290, 76, '#7DD69A'], [282, 12, '#B9A4FF']] as const).map(([x, y, c], i) => (
        <G key={i}>
          <Path d={`M${x} ${y - 2} V${y + 2}`} stroke={LINE} strokeWidth={1.5} />
          <Rect x={x - 4} y={y + 2} width={8} height={22} fill={c} {...thin} />
        </G>
      ))}
    </G>
  ),
  'chochin-matsuri': (
    <G>
      <Path d="M0 8 H320" stroke={LINE} strokeWidth={2} />
      {([28, 74, 120, 200, 246, 292] as const).map((x, i) => (
        <G key={x}>
          <Path d={`M${x} 8 V14`} stroke={LINE} strokeWidth={2} />
          <Ellipse cx={x} cy={26} rx={10} ry={12} fill={['#E5534B', '#FF9A4D', '#FF6F91'][i % 3]} {...stroke} />
          <Path d={`M${x - 9} 22 Q${x} 26 ${x + 9} 22 M${x - 9} 30 Q${x} 34 ${x + 9} 30`} fill="none" stroke="#FFF3C4" strokeWidth={1.6} />
          <Rect x={x - 5} y={37} width={10} height={4} rx={1} fill="#8A5A2B" {...thin} />
        </G>
      ))}
    </G>
  ),
  'lua-tsukimi': (
    <G>
      <Circle cx={266} cy={56} r={34} fill="#1B2A4A" />
      <Circle cx={272} cy={48} r={19} fill="#FFF3A0" />
      <Circle cx={265} cy={44} r={3.5} fill="#F2E27A" />
      <Circle cx={278} cy={55} r={4.5} fill="#F2E27A" />
      <Circle cx={247} cy={34} r={1.5} fill="#FFFFFF" />
      <Circle cx={252} cy={72} r={1.5} fill="#FFFFFF" />
      <Path d="M246 90 Q244 66 252 54 M256 90 Q256 70 262 60 M236 90 Q236 72 242 62" fill="none" stroke="#D9C48F" strokeWidth={2.5} strokeLinecap="round" />
      <Circle cx={266} cy={56} r={34} fill="none" stroke="#8A5A2B" strokeWidth={6} />
      <Circle cx={266} cy={56} r={37.5} fill="none" {...stroke} strokeWidth={2} />
    </G>
  ),
  abobora: (
    <G>
      <Ellipse cx={36} cy={22} rx={22} ry={15} fill="#FF9A4D" {...stroke} />
      <Path d="M24 8 Q20 22 24 36 M48 8 Q52 22 48 36 M36 7 V37" fill="none" stroke="#E27A2B" strokeWidth={2} />
      <Rect x={33} y={2} width={6} height={9} rx={2} fill="#4FB872" {...stroke} />
      <Path d="M24 18 L30 18 L27 24 Z M42 18 L48 18 L45 24 Z" fill="#2B2B3A" />
      <Path d="M26 29 L31 26 L36 30 L41 26 L46 29 L40 33 L32 33 Z" fill="#FFE27A" {...thin} />
    </G>
  ),
};

/** Posições de gotas, flocos e luzinhas: fixas, para o desenho não mudar a cada vez. */
const SPOTS = Array.from({ length: 56 }, (_, i) => ({ x: (i * 53 + (i % 5) * 17) % 320, y: (i * 37 + (i % 7) * 11) % 200, k: i }));

/** Clima por cima da cena inteira. */
export const WEATHER_ART: Readonly<Record<string, ReactNode>> = {
  chuva: (
    <G>
      {SPOTS.map(({ x, y, k }) => (
        <Path key={k} d={`M${x} ${y} l-4 11`} stroke="#8FC8FF" strokeWidth={1.7} strokeLinecap="round" opacity={0.85} />
      ))}
    </G>
  ),
  neve: (
    <G>
      {SPOTS.map(({ x, y, k }) => (
        <Circle key={k} cx={x} cy={y} r={1.6 + (k % 3) * 0.8} fill="#FFFFFF" opacity={0.92} />
      ))}
    </G>
  ),
  petalas: (
    <G>
      {SPOTS.slice(0, 34).map(({ x, y, k }) => (
        <Ellipse key={k} cx={x} cy={y} rx={4} ry={2.4} fill={k % 2 === 0 ? '#FFB9D0' : '#FF9EBB'} transform={`rotate(${(k * 47) % 180} ${x} ${y})`} opacity={0.95} />
      ))}
    </G>
  ),
  vagalumes: (
    <G>
      {SPOTS.slice(0, 16).map(({ x, y, k }) => (
        <G key={k}>
          <Circle cx={x} cy={y} r={7} fill="#FFF27A" opacity={0.28} />
          <Circle cx={x} cy={y} r={2.2} fill="#FFF9B0" />
        </G>
      ))}
    </G>
  ),
};

/** A luz da hora do dia por cima da cena (o dia é a luz normal, sem cobertura). */
export function lightOverlay(time: TimeOfDay, outdoor: boolean): ReactNode {
  if (time === 'day') return null;
  if (time === 'dawn') return <Rect x={0} y={0} width={320} height={200} fill="#FF9A76" opacity={0.14} />;
  if (time === 'dusk') return <Rect x={0} y={0} width={320} height={200} fill="#FF6F91" opacity={0.2} />;
  return (
    <G>
      <Rect x={0} y={0} width={320} height={200} fill="#101A44" opacity={0.46} />
      {outdoor
        ? ([[24, 20], [70, 38], [112, 14], [182, 30], [226, 12], [262, 44], [300, 22], [150, 52]] as const).map(([x, y], i) => <Circle key={i} cx={x} cy={y} r={1.6} fill="#FFFFFF" />)
        : null}
    </G>
  );
}
