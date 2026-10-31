import { Circle, Ellipse, G, Path, Polygon, Rect } from 'react-native-svg';
import { Flower, LINE, star, stroke, type Art } from './artKit';
import { Clipped } from './artScenes';

/**
 * Cosméticos de datas comemorativas (só na loja dentro da janela de cada data). Mesmo espaço do corpo (viewBox 200 × 190) e mesmo
 * traço escuro dos demais acessórios: cabeça acima de y 60, olhos em y ≈ 104, pescoço entre y 142 e 160, fundo cobrindo tudo.
 */

const BACKDROP = { w: 200, h: 190 };

/** Coração centrado em (x, y), com largura 2s. */
const heart = (x: number, y: number, s: number) =>
  `M${x} ${y + s * 0.9} C${x - s * 1.6} ${y - s * 0.2} ${x - s * 0.8} ${y - s * 1.1} ${x} ${y - s * 0.3} C${x + s * 0.8} ${y - s * 1.1} ${x + s * 1.6} ${y - s * 0.2} ${x} ${y + s * 0.9} Z`;

/** Fundo liso com cantos arredondados, o primeiro desenho de todo cenário. */
const Sky = ({ fill }: { fill: string }) => <Rect width={BACKDROP.w} height={BACKDROP.h} rx={20} fill={fill} />;

/** Pontos onde as peles espalham seus desenhos (x, y, tamanho): os mesmos das outras peles. */
const SPOTS: readonly (readonly [number, number, number])[] = [
  [48, 96, 5], [70, 74, 4], [100, 66, 5], [132, 76, 4], [154, 98, 5], [44, 130, 4], [72, 152, 5], [100, 160, 4], [130, 152, 5], [158, 132, 4], [60, 116, 3], [140, 118, 3],
];

// ---------------------------------------------------------------- cabeça
export const SEASON_HEAD: Record<string, Art> = {
  // Ano-Novo: pinheiro, ameixeira e laço de mizuhiki.
  'enfeite-ano-novo': () => (
    <G>
      <Path d="M100 60 Q90 38 100 18 Q110 38 100 60 Z" fill="#4E9F5B" {...stroke} />
      <Path d="M92 60 Q72 52 66 34 Q86 38 92 60 Z" fill="#6BAE5C" {...stroke} />
      <Path d="M108 60 Q128 52 134 34 Q114 38 108 60 Z" fill="#6BAE5C" {...stroke} />
      <Rect x={84} y={54} width={32} height={9} rx={3} fill="#E5534B" {...stroke} />
      <Path d="M100 54 V63" stroke="#FFFFFF" strokeWidth={3} />
      <Flower x={130} y={52} r={7} petal="#FF7AA8" />
    </G>
  ),
  // Setsubun: chifres de oni numa faixa de pele de tigre.
  'chifres-setsubun': () => (
    <G>
      <Path d="M44 62 Q100 44 156 62 L156 72 Q100 54 44 72 Z" fill="#FFD166" {...stroke} />
      <Path d="M62 58 L66 70 M82 54 L86 66 M114 54 L110 66 M138 58 L134 70" stroke={LINE} strokeWidth={3.5} strokeLinecap="round" />
      <Path d="M72 56 L62 24 L92 50 Z" fill="#FFFFFF" {...stroke} />
      <Path d="M128 56 L138 24 L108 50 Z" fill="#FFFFFF" {...stroke} />
    </G>
  ),
  // Dia dos Namorados: coroa de corações.
  'coroa-coracoes': () => (
    <G>
      <Path d="M64 62 L68 40 L84 52 L100 34 L116 52 L132 40 L136 62 Z" fill="#FFD166" {...stroke} />
      <Path d={heart(68, 32, 7)} fill="#FF5E8A" {...stroke} />
      <Path d={heart(100, 24, 8)} fill="#FF5E8A" {...stroke} />
      <Path d={heart(132, 32, 7)} fill="#FF5E8A" {...stroke} />
    </G>
  ),
  // Hinamatsuri: coroa da imperatriz com pingentes.
  'coroa-hina': () => (
    <G>
      <Path d="M70 62 L70 42 Q85 54 100 28 Q115 54 130 42 L130 62 Z" fill="#FFD166" {...stroke} />
      <Circle cx={100} cy={48} r={6} fill="#E5534B" {...stroke} />
      <Path d="M70 50 V74 M130 50 V74" stroke={LINE} strokeWidth={2.5} />
      <Circle cx={70} cy={76} r={4} fill="#FF9EBB" {...stroke} />
      <Circle cx={130} cy={76} r={4} fill="#FF9EBB" {...stroke} />
    </G>
  ),
  // Dia das Crianças no Japão: kabuto de papel dobrado.
  'kabuto-papel': () => (
    <G>
      <Path d="M58 64 L72 36 Q100 18 128 36 L142 64 Q100 54 58 64 Z" fill="#F6EBD2" {...stroke} />
      <Path d="M72 36 L100 56 L128 36" fill="none" stroke={LINE} strokeWidth={2.5} strokeLinejoin="round" />
      <Path d="M90 32 L100 14 L110 32 Z" fill="#E5534B" {...stroke} />
    </G>
  ),
  // Festa Junina: chapéu de palha remendado.
  'chapeu-junino': () => (
    <G>
      <Ellipse cx={100} cy={62} rx={58} ry={10} fill="#E8C77A" {...stroke} />
      <Path d="M72 60 Q72 26 100 26 Q128 26 128 60 Z" fill="#F2D88C" {...stroke} />
      <Rect x={72} y={46} width={56} height={9} fill="#E5534B" stroke={LINE} strokeWidth={2.5} />
      <Rect x={104} y={30} width={14} height={12} fill="#6FA8DC" stroke={LINE} strokeWidth={2} />
      <Path d="M106 34 H116 M106 38 H116" stroke="#FFFFFF" strokeWidth={1.5} strokeDasharray="3 2" />
      <Path d="M46 66 L40 76 M60 72 L56 82 M154 66 L160 76 M140 72 L144 82" stroke="#C9A55A" strokeWidth={3} strokeLinecap="round" />
    </G>
  ),
  // Tanabata: ramo de bambu com tiras de desejo.
  'bambu-tanzaku': () => (
    <G>
      <Path d="M80 62 L66 8" stroke="#6BAE5C" strokeWidth={6} strokeLinecap="round" />
      <Path d="M74 36 L62 44 M70 22 L84 18" stroke="#6BAE5C" strokeWidth={3} strokeLinecap="round" />
      <Ellipse cx={60} cy={46} rx={9} ry={4} fill="#8CCB7A" {...stroke} />
      <Ellipse cx={88} cy={16} rx={9} ry={4} fill="#8CCB7A" {...stroke} />
      <Rect x={44} y={20} width={9} height={22} rx={1.5} fill="#FFD166" stroke={LINE} strokeWidth={2} />
      <Rect x={74} y={34} width={9} height={22} rx={1.5} fill="#FF9EBB" stroke={LINE} strokeWidth={2} />
      <Rect x={90} y={30} width={9} height={22} rx={1.5} fill="#7CC4FF" stroke={LINE} strokeWidth={2} />
    </G>
  ),
  // Natsu-matsuri e Obon: faixa de festival com o sol vermelho.
  'hachimaki-matsuri': () => (
    <G>
      <Path d="M32 84 Q100 66 168 84 L168 96 Q100 78 32 96 Z" fill="#FFFFFF" {...stroke} />
      <Circle cx={100} cy={82} r={7} fill="#E5534B" />
      <Path d="M164 92 L186 106 M164 90 L184 80" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" />
      <Path d="M164 92 L186 106 M164 90 L184 80" stroke={LINE} strokeWidth={1.5} strokeLinecap="round" />
    </G>
  ),
  // Tsukimi: tufo de susuki (capim-dos-pampas) amarrado.
  'enfeite-susuki': () => (
    <G>
      <Path d="M100 62 Q96 36 78 12 M100 62 Q100 34 98 8 M100 62 Q104 36 122 12 M100 62 Q88 40 66 28 M100 62 Q112 40 134 28" fill="none" stroke="#C9A66B" strokeWidth={3} strokeLinecap="round" />
      <Ellipse cx={78} cy={14} rx={6} ry={10} fill="#F3E7C9" {...stroke} rotation={-25} origin="78,14" />
      <Ellipse cx={98} cy={10} rx={6} ry={10} fill="#F3E7C9" {...stroke} />
      <Ellipse cx={122} cy={14} rx={6} ry={10} fill="#F3E7C9" {...stroke} rotation={25} origin="122,14" />
      <Rect x={90} y={54} width={20} height={8} rx={3} fill="#E5534B" {...stroke} />
    </G>
  ),
};

// ---------------------------------------------------------------- rosto
export const SEASON_FACE: Record<string, Art> = {
  // Natal: barba e bigode de Papai Noel.
  'barba-papai-noel': () => (
    <G>
      <Path d="M56 110 Q58 152 100 162 Q142 152 144 110 Q124 128 100 124 Q76 128 56 110 Z" fill="#FFFFFF" {...stroke} />
      <Ellipse cx={86} cy={118} rx={15} ry={8} fill="#FFFFFF" {...stroke} />
      <Ellipse cx={114} cy={118} rx={15} ry={8} fill="#FFFFFF" {...stroke} />
    </G>
  ),
  // Ano-Novo: sobrancelhas grossas de daruma.
  'daruma-sobrancelhas': () => (
    <G>
      <Path d="M54 90 Q74 70 96 88 Q74 80 54 90 Z" fill="#2A2438" {...stroke} />
      <Path d="M146 90 Q126 70 104 88 Q126 80 146 90 Z" fill="#2A2438" {...stroke} />
    </G>
  ),
  // Dia dos Namorados: olhos de coração.
  'olhos-apaixonados': () => (
    <G>
      <Path d={heart(75, 102, 9)} fill="#FF3D6E" {...stroke} />
      <Path d={heart(125, 102, 9)} fill="#FF3D6E" {...stroke} />
      <Circle cx={71} cy={98} r={2.5} fill="#FFFFFF" />
      <Circle cx={121} cy={98} r={2.5} fill="#FFFFFF" />
    </G>
  ),
  // Hinamatsuri: bochechas e lábios da maquiagem tradicional.
  'bochechas-hina': () => (
    <G>
      <Circle cx={50} cy={120} r={10} fill="#FF8FA8" opacity={0.75} />
      <Circle cx={150} cy={120} r={10} fill="#FF8FA8" opacity={0.75} />
      <Path d="M91 119 Q100 131 109 119 Q100 124 91 119 Z" fill="#D64545" {...stroke} strokeWidth={1.5} />
    </G>
  ),
  // Hanami: pétalas de cerejeira grudadas no rosto.
  'petalas-no-rosto': () => (
    <G>
      <Ellipse cx={52} cy={112} rx={8} ry={4.5} fill="#FFB9D0" stroke={LINE} strokeWidth={1.5} rotation={-30} origin="52,112" />
      <Ellipse cx={64} cy={128} rx={8} ry={4.5} fill="#FFD3E2" stroke={LINE} strokeWidth={1.5} rotation={20} origin="64,128" />
      <Ellipse cx={148} cy={110} rx={8} ry={4.5} fill="#FFD3E2" stroke={LINE} strokeWidth={1.5} rotation={30} origin="148,110" />
      <Ellipse cx={138} cy={128} rx={8} ry={4.5} fill="#FFB9D0" stroke={LINE} strokeWidth={1.5} rotation={-20} origin="138,128" />
      <Ellipse cx={100} cy={82} rx={7} ry={4} fill="#FFB9D0" stroke={LINE} strokeWidth={1.5} rotation={10} origin="100,82" />
    </G>
  ),
  // Dia das Crianças no Japão: bochechas vermelhas de Kintarō.
  'bochechas-kintaro': () => (
    <G>
      <Circle cx={48} cy={120} r={13} fill="#E5534B" opacity={0.88} />
      <Circle cx={152} cy={120} r={13} fill="#E5534B" opacity={0.88} />
      <Circle cx={44} cy={115} r={3.5} fill="#FFFFFF" opacity={0.8} />
      <Circle cx={148} cy={115} r={3.5} fill="#FFFFFF" opacity={0.8} />
    </G>
  ),
  // Festa Junina: bigode pintado e sardas.
  'bigode-junino': () => (
    <G>
      <Path d="M68 121 Q84 111 100 120 Q116 111 132 121 Q116 129 100 125 Q84 129 68 121 Z" fill="#6B3F22" {...stroke} strokeWidth={2} />
      {[[58, 112], [66, 118], [54, 122], [142, 112], [134, 118], [146, 122]].map(([x, y], i) => (
        <Circle key={i} cx={x} cy={y} r={1.8} fill="#B57A45" />
      ))}
    </G>
  ),
  // Tanabata: estrelas nos olhos.
  'olhos-estrelados': () => (
    <G>
      <Path d={star(75, 103, 11)} fill="#FFD166" {...stroke} strokeWidth={2} />
      <Path d={star(125, 103, 11)} fill="#FFD166" {...stroke} strokeWidth={2} />
      <Path d={star(54, 84, 5)} fill="#FFFFFF" stroke={LINE} strokeWidth={1.5} />
      <Path d={star(148, 86, 5)} fill="#FFFFFF" stroke={LINE} strokeWidth={1.5} />
    </G>
  ),
  // Natsu-matsuri: listras de tinta de festival nas bochechas.
  'pintura-matsuri': () => (
    <G>
      <Path d="M42 112 L62 118 M42 122 L62 126 M42 132 L62 134" stroke="#4F86C0" strokeWidth={4} strokeLinecap="round" />
      <Path d="M158 112 L138 118 M158 122 L138 126 M158 132 L138 134" stroke="#E5534B" strokeWidth={4} strokeLinecap="round" />
    </G>
  ),
  // Tsukimi: nariz e bigodes do coelho da lua.
  'bigode-coelho': () => (
    <G>
      <Path d="M96 114 L104 114 L100 120 Z" fill="#FF8FA8" {...stroke} strokeWidth={2} />
      <Path d="M80 118 L50 112 M80 124 L48 126 M80 130 L52 140 M120 118 L150 112 M120 124 L152 126 M120 130 L148 140" stroke={LINE} strokeWidth={2.2} strokeLinecap="round" />
    </G>
  ),
  // Halloween: presas de vampiro.
  'dentes-vampiro': () => (
    <G>
      <Path d="M90 119 L94 133 L99 120 Z" fill="#FFFFFF" {...stroke} strokeWidth={2} />
      <Path d="M101 120 L106 133 L110 119 Z" fill="#FFFFFF" {...stroke} strokeWidth={2} />
    </G>
  ),
};

// ---------------------------------------------------------------- pescoço
export const SEASON_NECK: Record<string, Art> = {
  // Natal: cachecol listrado de vermelho e verde.
  'cachecol-natal': () => (
    <G>
      <Path d="M44 142 Q100 168 156 142 L158 158 Q100 184 42 158 Z" fill="#2E8B57" {...stroke} />
      <Path d="M136 158 L150 188 L130 190 L122 166" fill="#2E8B57" {...stroke} />
      <Path d="M62 148 L60 166 M84 154 L82 172 M106 156 L104 174 M128 154 L126 170 M144 168 L138 176" stroke="#E5534B" strokeWidth={6} strokeLinecap="round" />
    </G>
  ),
  // Ano-Novo: omamori, o amuleto da sorte.
  omamori: () => (
    <G>
      <Path d="M48 142 Q100 166 152 142" fill="none" stroke="#E5534B" strokeWidth={5} strokeLinecap="round" />
      <Rect x={88} y={158} width={24} height={30} rx={4} fill="#E5534B" {...stroke} />
      <Path d="M88 166 H112" stroke="#FFD166" strokeWidth={3} />
      <Path d="M100 170 V182 M94 176 H106" stroke="#FFFFFF" strokeWidth={2.5} strokeLinecap="round" />
    </G>
  ),
  // Setsubun: saquinho de feijões.
  'saco-feijoes': () => (
    <G>
      <Path d="M48 142 Q100 166 152 142" fill="none" stroke="#B57A45" strokeWidth={4} strokeLinecap="round" />
      <Path d="M84 160 Q100 152 116 160 L122 186 Q100 192 78 186 Z" fill="#F2D88C" {...stroke} />
      <Path d="M90 158 L100 164 L110 158" fill="#E5534B" {...stroke} strokeWidth={2.5} />
      <Ellipse cx={92} cy={178} rx={3.5} ry={2.5} fill="#8A5A2B" />
      <Ellipse cx={104} cy={182} rx={3.5} ry={2.5} fill="#8A5A2B" />
      <Ellipse cx={112} cy={174} rx={3.5} ry={2.5} fill="#8A5A2B" />
    </G>
  ),
  // Dia dos Namorados: colar com pingente de coração.
  'colar-coracao': () => (
    <G>
      <Path d="M50 142 Q100 168 150 142" fill="none" stroke="#C9972B" strokeWidth={3} strokeLinecap="round" />
      <Path d={heart(100, 170, 11)} fill="#FF3D6E" {...stroke} />
      <Circle cx={95} cy={166} r={2.5} fill="#FFFFFF" />
    </G>
  ),
  // Hinamatsuri: guirlanda de flores de pessegueiro.
  'colar-pessego': () => (
    <G>
      <Path d="M48 142 Q100 166 152 142" fill="none" stroke="#6BAE5C" strokeWidth={3} strokeLinecap="round" />
      {([[58, 146], [78, 156], [100, 160], [122, 156], [142, 146]] as [number, number][]).map(([x, y], i) => (
        <Flower key={i} x={x} y={y} r={7} petal={i % 2 === 0 ? '#FF9EBB' : '#FFC8D8'} />
      ))}
    </G>
  ),
  // Hanami: furoshiki verde com flores de sakura.
  'furoshiki-sakura': () => (
    <G>
      <Path d="M50 142 Q100 164 150 142 L100 184 Z" fill="#8FD9BE" {...stroke} />
      <Circle cx={100} cy={160} r={6} fill="#6FBFA0" {...stroke} />
      <Flower x={84} y={158} r={5} petal="#FFB9D0" />
      <Flower x={116} y={158} r={5} petal="#FFB9D0" />
      <Flower x={100} y={174} r={5} petal="#FFFFFF" />
    </G>
  ),
  // Koinobori: três carpas de pano penduradas.
  'carpas-penduradas': () => (
    <G>
      <Path d="M48 142 Q100 166 152 142" fill="none" stroke={LINE} strokeWidth={3} strokeLinecap="round" />
      {[[66, '#E5534B'], [100, '#2F3A56'], [134, '#5DADE2']].map(([x, color], i) => (
        <G key={i}>
          <Path d={`M${x} 154 V160`} stroke={LINE} strokeWidth={2} />
          <Ellipse cx={x as number} cy={170} rx={7} ry={11} fill={color as string} {...stroke} strokeWidth={2.5} />
          <Path d={`M${x} 180 L${(x as number) - 6} 190 L${(x as number) + 6} 190 Z`} fill={color as string} {...stroke} strokeWidth={2.5} />
          <Circle cx={(x as number) - 2.5} cy={165} r={1.8} fill="#FFFFFF" />
        </G>
      ))}
    </G>
  ),
  // Festa Junina: bandana xadrez.
  'bandana-xadrez': () => (
    <G>
      <Path d="M52 142 Q100 164 148 142 L100 184 Z" fill="#D64545" {...stroke} />
      <Path d="M78 154 L100 176 L122 154 M90 148 L100 158 L110 148" fill="none" stroke="#FFFFFF" strokeWidth={2} opacity={0.75} />
      <Path d="M70 152 L130 152 M82 164 L118 164" stroke="#8E1F1F" strokeWidth={2} opacity={0.6} />
    </G>
  ),
  // Natsu-matsuri: sininho de vidro (furin) com tira de desejo.
  'furin-colar': () => (
    <G>
      <Path d="M48 142 Q100 166 152 142" fill="none" stroke="#5DADE2" strokeWidth={3.5} strokeLinecap="round" />
      <Path d="M86 164 Q86 148 100 148 Q114 148 114 164 Z" fill="#CFEFFF" opacity={0.92} {...stroke} />
      <Path d="M100 164 V176" stroke={LINE} strokeWidth={2} />
      <Rect x={93} y={176} width={14} height={14} rx={1.5} fill="#FF9EBB" {...stroke} strokeWidth={2} />
    </G>
  ),
  // Tsukimi: espeto de dango tricolor.
  'colar-dango': () => (
    <G>
      <Path d="M48 142 Q100 166 152 142" fill="none" stroke="#B57A45" strokeWidth={3} strokeLinecap="round" />
      <Path d="M100 154 V190" stroke="#B57A45" strokeWidth={3} />
      <Circle cx={100} cy={162} r={8} fill="#FFB9D0" {...stroke} />
      <Circle cx={100} cy={176} r={8} fill="#FFFFFF" {...stroke} />
      <Circle cx={100} cy={190} r={8} fill="#B7D98A" {...stroke} />
    </G>
  ),
  // Halloween: gola alta de vampiro.
  'gola-vampiro': () => (
    <G>
      <Path d="M40 142 L68 130 L100 152 L132 130 L160 142 L152 180 L100 162 L48 180 Z" fill="#2A2438" {...stroke} />
      <Path d="M72 138 L100 158 L128 138 L100 168 Z" fill="#B3202A" />
      <Circle cx={100} cy={160} r={4} fill="#FFD166" stroke={LINE} strokeWidth={2} />
    </G>
  ),
};

// ---------------------------------------------------------------- fundos
export const SEASON_BACK: Record<string, Art> = {
  'fundo-natal': () => (
    <G>
      <Sky fill="#1F2A5A" />
      <Rect y={156} width={BACKDROP.w} height={34} fill="#F4F8FF" />
      <G transform="translate(88 44) scale(0.7)">
      <Polygon points="100,38 70,86 130,86" fill="#2E8B57" stroke={LINE} strokeWidth={2.5} strokeLinejoin="round" />
      <Polygon points="100,62 60,116 140,116" fill="#3AA06A" stroke={LINE} strokeWidth={2.5} strokeLinejoin="round" />
      <Polygon points="100,88 50,152 150,152" fill="#2E8B57" stroke={LINE} strokeWidth={2.5} strokeLinejoin="round" />
      <Rect x={92} y={152} width={16} height={14} fill="#8A5A2B" />
      <Path d={star(100, 32, 9)} fill="#FFD166" />
      {[[88, 70, '#E5534B'], [112, 78, '#FFD166'], [78, 104, '#7CC4FF'], [120, 108, '#FF9EBB'], [92, 130, '#FFD166'], [112, 138, '#E5534B']].map(([x, y, c], i) => (
        <Circle key={i} cx={x as number} cy={y as number} r={4} fill={c as string} />
      ))}
      </G>
      {[[24, 30], [168, 22], [40, 76], [160, 66], [22, 120], [178, 112]].map(([x, y], i) => (
        <Circle key={i} cx={x} cy={y} r={2.5} fill="#FFFFFF" />
      ))}
    </G>
  ),
  'fundo-hatsuhinode': () => (
    <G>
      <Sky fill="#FFC27A" />
      <Rect width={BACKDROP.w} height={70} rx={20} fill="#FFA95C" />
      <Circle cx={150} cy={118} r={32} fill="#E5534B" />
      <Rect y={118} width={BACKDROP.w} height={72} fill="#4F86C0" />
      <Path d="M30 138 H70 M96 150 H150 M52 166 H110 M126 134 H170 M140 172 H182" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" opacity={0.7} />
      <Ellipse cx={42} cy={44} rx={22} ry={7} fill="#FFFFFF" opacity={0.7} />
      <Ellipse cx={160} cy={60} rx={20} ry={6} fill="#FFFFFF" opacity={0.7} />
    </G>
  ),
  'fundo-setsubun': () => (
    <G>
      <Sky fill="#FFE4DC" />
      <Rect y={150} width={BACKDROP.w} height={40} fill="#D9A66B" />
      <Path d="M0 150 H200" stroke={LINE} strokeWidth={2.5} />
      {[[30, 40, 20], [70, 70, -30], [120, 36, 40], [158, 74, 10], [48, 112, -10], [100, 100, 25], [146, 120, -35], [180, 40, 15], [20, 84, 30], [126, 70, -15]].map(([x, y, r], i) => (
        <Ellipse key={i} cx={x} cy={y} rx={6} ry={4} fill="#8A5A2B" stroke={LINE} strokeWidth={1.5} rotation={r} origin={`${x},${y}`} />
      ))}
      <Rect x={140} y={150} width={38} height={28} fill="#E8C77A" stroke={LINE} strokeWidth={2.5} />
      <Path d="M140 160 H178" stroke={LINE} strokeWidth={2} />
      <Ellipse cx={150} cy={152} rx={5} ry={3} fill="#8A5A2B" />
      <Ellipse cx={164} cy={152} rx={5} ry={3} fill="#8A5A2B" />
    </G>
  ),
  'fundo-namorados': () => (
    <G>
      <Sky fill="#FFD6E3" />
      {[[34, 40, 12, '#FF7AA8'], [160, 34, 16, '#FF5E8A'], [100, 24, 9, '#FFFFFF'], [24, 100, 9, '#FFFFFF'], [176, 96, 12, '#FF7AA8'], [60, 146, 14, '#FF5E8A'], [150, 150, 10, '#FFFFFF'], [100, 170, 8, '#FF7AA8'], [46, 70, 6, '#FFFFFF'], [150, 70, 7, '#FF5E8A']].map(([x, y, s, c], i) => (
        <Path key={i} d={heart(x as number, y as number, s as number)} fill={c as string} stroke={LINE} strokeWidth={1.8} opacity={0.92} />
      ))}
    </G>
  ),
  'fundo-hinadan': () => (
    <G>
      <Sky fill="#FFE9E9" />
      <Rect x={14} y={120} width={172} height={22} fill="#C8353F" stroke={LINE} strokeWidth={2.5} />
      <Rect x={26} y={98} width={148} height={22} fill="#D64555" stroke={LINE} strokeWidth={2.5} />
      <Rect x={38} y={76} width={124} height={22} fill="#C8353F" stroke={LINE} strokeWidth={2.5} />
      <Rect x={14} y={142} width={172} height={48} fill="#9E2A33" />
      <Circle cx={46} cy={56} r={9} fill="#FFE6D0" {...stroke} strokeWidth={2.5} />
      <Path d="M32 98 L38 66 H54 L60 98 Z" fill="#2F3A56" {...stroke} strokeWidth={2.5} />
      <Circle cx={154} cy={56} r={9} fill="#FFE6D0" {...stroke} strokeWidth={2.5} />
      <Path d="M140 98 L146 66 H162 L168 98 Z" fill="#FF9EBB" {...stroke} strokeWidth={2.5} />
      <Path d="M70 24 Q100 12 130 24" fill="none" stroke="#8A5A2B" strokeWidth={3} />
      <Flower x={84} y={18} r={6} petal="#FF9EBB" />
      <Flower x={116} y={18} r={6} petal="#FFC8D8" />
    </G>
  ),
  'fundo-hanami': () => (
    <G>
      <Sky fill="#DDF1FF" />
      <Rect y={140} width={BACKDROP.w} height={50} fill="#B9D9A6" />
      <Rect x={28} y={70} width={16} height={80} fill="#8A5A2B" stroke={LINE} strokeWidth={2.5} />
      <Circle cx={36} cy={52} r={34} fill="#FFB9D0" stroke={LINE} strokeWidth={2.5} />
      <Circle cx={70} cy={60} r={26} fill="#FFC8D8" stroke={LINE} strokeWidth={2.5} />
      <Circle cx={14} cy={70} r={20} fill="#FFC8D8" stroke={LINE} strokeWidth={2.5} />
      <Path d="M80 150 L170 150 L186 180 L64 180 Z" fill="#FFFFFF" stroke={LINE} strokeWidth={2.5} />
      <Path d="M104 150 L96 180 M128 150 L128 180 M152 150 L160 180" stroke="#E5534B" strokeWidth={5} />
      {[[100, 40], [130, 70], [160, 50], [150, 100], [110, 110], [80, 90]].map(([x, y], i) => (
        <Ellipse key={i} cx={x} cy={y} rx={5} ry={3} fill="#FFB9D0" rotation={i * 40} origin={`${x},${y}`} />
      ))}
    </G>
  ),
  'fundo-koinobori': () => (
    <G>
      <Sky fill="#9ED3F5" />
      <Ellipse cx={50} cy={34} rx={26} ry={9} fill="#FFFFFF" />
      <Ellipse cx={70} cy={28} rx={16} ry={8} fill="#FFFFFF" />
      <Path d="M-10 170 Q50 130 110 160 Q160 140 210 168 V190 H-10 Z" fill="#8CCB7A" />
      <Rect x={160} y={18} width={6} height={150} fill="#8A5A2B" stroke={LINE} strokeWidth={2} />
      <Path d="M163 14 L156 4 M163 14 L170 4" stroke="#C9972B" strokeWidth={3} />
      <Path d="M160 20 Q136 14 118 22 L124 32 Q140 28 160 32 Z" fill="#E5534B" {...stroke} strokeWidth={2.5} />
      <Path d="M118 22 L108 16 L110 38 L124 32 Z" fill="#E5534B" {...stroke} strokeWidth={2.5} />
      <Circle cx={152} cy={24} r={2.2} fill="#FFFFFF" />
      <Path d="M160 44 Q136 38 118 46 L124 56 Q140 52 160 56 Z" fill="#2F3A56" {...stroke} strokeWidth={2.5} />
      <Path d="M118 46 L108 40 L110 62 L124 56 Z" fill="#2F3A56" {...stroke} strokeWidth={2.5} />
      <Path d="M160 68 Q142 64 128 70 L132 78 Q144 76 160 78 Z" fill="#5DADE2" {...stroke} strokeWidth={2.5} />
      <Path d="M128 70 L120 66 L122 84 L132 78 Z" fill="#5DADE2" {...stroke} strokeWidth={2.5} />
    </G>
  ),
  'fundo-fogueira': () => (
    <G>
      <Sky fill="#3A2F5B" />
      <Rect y={160} width={BACKDROP.w} height={30} fill="#2A2240" />
      {[[184, 100, 3], [176, 84, 2.4], [186, 68, 2], [172, 58, 2.6]].map(([x, y, r], i) => (
        <Circle key={i} cx={x} cy={y} r={r} fill={i % 2 === 0 ? '#FFD166' : '#F28C28'} />
      ))}
      <Path d="M0 18 Q100 40 200 18" fill="none" stroke={LINE} strokeWidth={2.5} />
      {[[20, 24, '#E5534B'], [52, 30, '#FFD166'], [84, 34, '#5DADE2'], [116, 34, '#6BAE5C'], [148, 30, '#FF9EBB'], [180, 24, '#FFD166']].map(([x, y, c], i) => (
        <Polygon key={i} points={`${(x as number) - 10},${y} ${(x as number) + 10},${y} ${x},${(y as number) + 20}`} fill={c as string} stroke={LINE} strokeWidth={2} strokeLinejoin="round" />
      ))}
      <G transform="translate(118 30) scale(0.58)">
      <Path d="M70 170 L130 150 M70 150 L130 170" stroke="#8A5A2B" strokeWidth={9} strokeLinecap="round" />
      <Path d="M100 156 Q76 140 86 112 Q92 128 102 120 Q96 98 114 80 Q112 112 126 124 Q134 140 100 156 Z" fill="#F28C28" stroke={LINE} strokeWidth={2.5} strokeLinejoin="round" />
      <Path d="M100 154 Q88 142 98 128 Q104 138 110 134 Q116 146 100 154 Z" fill="#FFD166" />
      </G>
    </G>
  ),
  'fundo-tanabata': () => (
    <G>
      <Sky fill="#1C2250" />
      <Path d="M-10 150 Q80 90 210 30" fill="none" stroke="#5560B8" strokeWidth={34} opacity={0.5} />
      {[[30, 120], [50, 106], [72, 96], [94, 84], [116, 70], [138, 58], [160, 48], [182, 36], [60, 130], [84, 112], [108, 100], [132, 86], [156, 72]].map(([x, y], i) => (
        <Circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2.5 : 1.8} fill="#E9ECFF" />
      ))}
      <Path d={star(34, 46, 12)} fill="#FFD166" />
      <Path d={star(170, 34, 11)} fill="#FF9EBB" />
      <Path d="M150 190 L162 100" stroke="#6BAE5C" strokeWidth={6} strokeLinecap="round" />
      <Rect x={140} y={126} width={9} height={24} rx={1.5} fill="#FFD166" stroke={LINE} strokeWidth={1.5} />
      <Rect x={166} y={116} width={9} height={24} rx={1.5} fill="#7CC4FF" stroke={LINE} strokeWidth={1.5} />
    </G>
  ),
  'fundo-fogos': () => (
    <G>
      <Sky fill="#141A3E" />
      <Rect y={150} width={BACKDROP.w} height={40} fill="#1E2C5E" />
      {[[40, 44, 26, '#E5534B'], [162, 40, 24, '#FFD166'], [100, 20, 14, '#FF9EBB']].map(([x, y, r, c], i) => (
        <G key={i}>
          <Path
            d={Array.from({ length: 12 }, (_, k) => {
              const a = (k * 30 * Math.PI) / 180;
              return `M${x} ${y} L${(x as number) + Math.cos(a) * (r as number)} ${(y as number) + Math.sin(a) * (r as number)}`;
            }).join(' ')}
            stroke={c as string}
            strokeWidth={3}
            strokeLinecap="round"
          />
          <Circle cx={x as number} cy={y as number} r={4} fill="#FFFFFF" />
        </G>
      ))}
      <Path d="M30 150 V168 M74 150 V172 M118 150 V166 M164 150 V172" stroke="#FFD166" strokeWidth={4} strokeLinecap="round" opacity={0.6} />
      <Path d="M0 130 Q100 112 200 130" fill="none" stroke={LINE} strokeWidth={2.5} />
      {[[24, '#E5534B'], [64, '#FFD166'], [104, '#E5534B'], [144, '#FFD166'], [184, '#E5534B']].map(([x, c], i) => (
        <Ellipse key={i} cx={x as number} cy={132} rx={7} ry={9} fill={c as string} stroke={LINE} strokeWidth={2} />
      ))}
    </G>
  ),
  'fundo-tsukimi': () => (
    <G>
      <Sky fill="#1E2B5E" />
      <G transform="translate(78 4) scale(0.7)">
      <Circle cx={100} cy={72} r={46} fill="#FFF3C4" />
      <Path d="M92 98 Q86 72 98 62 Q96 46 102 38 Q108 48 106 62 Q114 66 116 84 Q112 98 92 98 Z" fill="#E8D9A8" />
      <Ellipse cx={100} cy={102} rx={14} ry={4} fill="#E8D9A8" />
      </G>
      <Path d="M-10 160 Q60 140 110 158 Q160 140 210 160 V190 H-10 Z" fill="#2E5A3F" />
      <Path d="M30 170 Q26 130 12 110 M38 170 Q40 128 52 108 M170 170 Q168 134 182 114 M162 170 Q156 130 144 112" stroke="#C9A66B" strokeWidth={3} strokeLinecap="round" fill="none" />
      {[[12, 108], [52, 106], [182, 112], [144, 110]].map(([x, y], i) => (
        <Ellipse key={i} cx={x} cy={y} rx={4} ry={9} fill="#F3E7C9" />
      ))}
      {[[24, 24], [172, 30], [150, 12], [44, 50]].map(([x, y], i) => (
        <Circle key={i} cx={x} cy={y} r={1.8} fill="#FFFFFF" />
      ))}
    </G>
  ),
  'fundo-halloween': () => (
    <G>
      <Sky fill="#3B1F5C" />
      <Circle cx={152} cy={42} r={24} fill="#FFB24B" />
      <Circle cx={144} cy={36} r={4} fill="#F28C28" />
      <Circle cx={160} cy={50} r={5} fill="#F28C28" />
      <Rect y={160} width={BACKDROP.w} height={30} fill="#1B0F2E" />
      <Path d="M0 160 V104 L24 84 L48 104 V160 Z" fill="#1B0F2E" />
      <Rect x={6} y={112} width={10} height={14} fill="#FFD166" />
      <Rect x={30} y={112} width={10} height={14} fill="#FFD166" />
      <Rect x={18} y={140} width={10} height={20} fill="#3B1F5C" />
      <Path d="M24 84 V66" stroke="#1B0F2E" strokeWidth={4} />
      <Path d="M168 160 Q172 124 160 104 M166 130 Q184 122 188 104 M164 118 Q148 110 142 94" stroke="#1B0F2E" strokeWidth={5} strokeLinecap="round" fill="none" />
      {([[80, 40], [110, 64], [128, 26]] as [number, number][]).map(([x, y], i) => (
        <Path key={i} d={`M${x} ${y} Q${x - 8} ${y - 8} ${x - 14} ${y - 2} Q${x - 8} ${y - 2} ${x} ${y + 4} Q${x + 8} ${y - 2} ${x + 14} ${y - 2} Q${x + 8} ${y - 8} ${x} ${y} Z`} fill="#1B0F2E" />
      ))}
    </G>
  ),
};

// ---------------------------------------------------------------- cores
export const SEASON_TINTS: Readonly<Record<string, { body: string; pink: string }>> = {
  'cor-natal': { body: '#E3F5E1', pink: '#E5534B' },
  'cor-kohaku': { body: '#FFF6F0', pink: '#E5534B' },
  'cor-oni': { body: '#FFC9C0', pink: '#D64545' },
  'cor-chocolate': { body: '#D9B59A', pink: '#8B5A3C' },
  'cor-pessego': { body: '#FFE6D5', pink: '#F28FA0' },
  'cor-petala': { body: '#FFF0F5', pink: '#FFB3C7' },
  'cor-carpa': { body: '#FFD8C4', pink: '#E5534B' },
  'cor-milho': { body: '#FFF1B8', pink: '#F5B94B' },
  'cor-via-lactea': { body: '#C9D4FF', pink: '#8A8FE6' },
  'cor-yukata': { body: '#DCE8FF', pink: '#4F86C0' },
  'cor-lua': { body: '#FFF7D6', pink: '#F5D76E' },
  'cor-fantasma': { body: '#F5F5FF', pink: '#C9C3E8' },
};

// ---------------------------------------------------------------- peles
export const SEASON_SKIN: Record<string, Art> = {
  'pele-natal': () => (
    <Clipped>
      {SPOTS.map(([x, y, r], i) => (
        <Path
          key={i}
          d={`M${x - r - 2} ${y} H${x + r + 2} M${x} ${y - r - 2} V${y + r + 2} M${x - r} ${y - r} L${x + r} ${y + r} M${x - r} ${y + r} L${x + r} ${y - r}`}
          stroke={i % 3 === 0 ? '#E5534B' : '#7CC4FF'}
          strokeWidth={2.4}
          strokeLinecap="round"
        />
      ))}
    </Clipped>
  ),
  'pele-kohaku': () => (
    <Clipped>
      <Path d="M30 96 C40 70 80 62 90 84 C98 104 70 118 50 112 C36 108 28 104 30 96 Z" fill="#E5534B" opacity={0.9} />
      <Path d="M120 128 C132 108 170 108 172 134 C174 160 140 176 120 160 C112 150 112 138 120 128 Z" fill="#E5534B" opacity={0.9} />
      <Circle cx={134} cy={70} r={5} fill="#FFD166" />
      <Circle cx={70} cy={150} r={4} fill="#FFD166" />
    </Clipped>
  ),
  'pele-tigre-oni': () => (
    <Clipped>
      <Rect width={200} height={190} fill="#FFD166" opacity={0.5} />
      <Path d="M40 80 L70 92 M34 108 L66 116 M38 138 L68 140 M160 80 L130 92 M166 108 L134 116 M162 138 L132 140 M88 62 L94 80 M112 62 L106 80 M80 160 L90 146 M120 160 L110 146" stroke="#2A2438" strokeWidth={7} strokeLinecap="round" opacity={0.85} />
    </Clipped>
  ),
  'pele-chocolate': () => (
    <Clipped>
      <Path d="M0 40 H200 V74 Q186 106 172 76 Q154 112 136 78 Q118 100 104 80 Q84 112 66 80 Q48 104 34 78 Q16 90 0 74 Z" fill="#7A4A2E" />
      {[[60, 70, 20, '#FF9EBB'], [90, 84, -30, '#FFFFFF'], [120, 74, 40, '#FFD166'], [150, 86, 10, '#FF9EBB'], [44, 86, 60, '#FFFFFF'], [104, 66, 70, '#B7D98A']].map(([x, y, r, c], i) => (
        <Rect key={i} x={(x as number) - 5} y={(y as number) - 1.5} width={10} height={3} rx={1.5} fill={c as string} rotation={r as number} origin={`${x},${y}`} />
      ))}
    </Clipped>
  ),
  'pele-hishimochi': () => (
    <Clipped>
      <Path d="M-20 60 L220 -20 V10 L-20 90 Z" fill="#FFB3C7" opacity={0.8} />
      <Path d="M-20 100 L220 20 V50 L-20 130 Z" fill="#FFFFFF" opacity={0.85} />
      <Path d="M-20 140 L220 60 V90 L-20 170 Z" fill="#BFE3A8" opacity={0.8} />
      <Path d="M-20 180 L220 100 V130 L-20 210 Z" fill="#FFB3C7" opacity={0.8} />
      <Path d="M-20 220 L220 140 V170 L-20 250 Z" fill="#FFFFFF" opacity={0.85} />
    </Clipped>
  ),
  'pele-petalas': () => (
    <Clipped>
      {SPOTS.map(([x, y, r], i) => (
        <Ellipse key={i} cx={x} cy={y} rx={r + 4} ry={r} fill={i % 2 === 0 ? '#FFB9D0' : '#FFFFFF'} opacity={0.92} rotation={i * 37} origin={`${x},${y}`} />
      ))}
    </Clipped>
  ),
  'pele-escamas-carpa': () => (
    <Clipped>
      {[0, 1, 2, 3, 4, 5].map((row) =>
        [0, 1, 2, 3, 4, 5, 6, 7].map((col) => (
          <Path
            key={`${row}-${col}`}
            d={`M${col * 22 + (row % 2) * 11 - 4} ${row * 20 + 50} a11 11 0 0 0 22 0`}
            fill="none"
            stroke="#E5534B"
            strokeWidth={2.6}
            opacity={0.55}
          />
        )),
      )}
    </Clipped>
  ),
  'pele-xadrez': () => (
    <Clipped>
      <Path d="M44 40 V180 M72 40 V180 M100 40 V180 M128 40 V180 M156 40 V180" stroke="#D64545" strokeWidth={9} opacity={0.5} />
      <Path d="M20 76 H180 M20 104 H180 M20 132 H180 M20 160 H180" stroke="#D64545" strokeWidth={9} opacity={0.5} />
      <Rect x={118} y={108} width={22} height={20} fill="#6FA8DC" stroke={LINE} strokeWidth={2} />
      <Path d="M121 112 H137 M121 124 H137" stroke="#FFFFFF" strokeWidth={1.5} strokeDasharray="3 2" />
    </Clipped>
  ),
  'pele-via-lactea': () => (
    <Clipped>
      <Rect width={200} height={190} fill="#3B3F8C" opacity={0.35} />
      <Path d="M20 160 Q90 110 180 70" fill="none" stroke="#B9C2FF" strokeWidth={14} opacity={0.5} />
      {SPOTS.map(([x, y, r], i) => (
        <Path key={i} d={star(x, y, r + 3)} fill={i % 2 === 0 ? '#FFFFFF' : '#FFD166'} />
      ))}
    </Clipped>
  ),
  'pele-yukata': () => (
    <Clipped>
      <Rect width={200} height={190} fill="#2F4B8F" opacity={0.45} />
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2, 3, 4].map((col) => (
          <G key={`${row}-${col}`}>
            <Circle cx={36 + col * 32 + (row % 2) * 16} cy={66 + row * 30} r={11} fill="none" stroke="#FFFFFF" strokeWidth={2.4} opacity={0.85} />
            <Circle cx={36 + col * 32 + (row % 2) * 16} cy={66 + row * 30} r={5} fill="none" stroke="#FFFFFF" strokeWidth={2.4} opacity={0.85} />
          </G>
        )),
      )}
    </Clipped>
  ),
  'pele-lua-cheia': () => (
    <Clipped>
      <Rect width={200} height={190} fill="#FFE98A" opacity={0.45} />
      <Circle cx={70} cy={84} r={14} fill="#E5CF8A" opacity={0.75} />
      <Circle cx={134} cy={106} r={18} fill="#E5CF8A" opacity={0.75} />
      <Circle cx={88} cy={146} r={11} fill="#E5CF8A" opacity={0.75} />
      <Circle cx={150} cy={70} r={8} fill="#E5CF8A" opacity={0.75} />
      <Circle cx={52} cy={126} r={7} fill="#E5CF8A" opacity={0.75} />
    </Clipped>
  ),
  'pele-abobora': () => (
    <Clipped>
      <Rect width={200} height={190} fill="#F28C28" opacity={0.55} />
      <Path d="M100 50 V172 M78 54 Q58 112 78 170 M122 54 Q142 112 122 170 M56 68 Q34 118 56 158 M144 68 Q166 118 144 158" fill="none" stroke="#B35A12" strokeWidth={3.5} opacity={0.7} />
    </Clipped>
  ),
};
