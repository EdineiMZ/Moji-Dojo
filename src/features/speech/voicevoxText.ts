// Textos em português das vozes do VOICEVOX. O japonês original vem do site oficial (voicevox.hiroshiba.jp), em
// voicevoxCatalog.ts; a tradução é nossa (feita por IA, a revisar por um falante) e só descreve o tom da voz.

/** Descrição da voz de cada personagem, por slug do site oficial (tradução da frase "…な声" de cada página). */
export const VOICE_DESC_PT: Readonly<Record<string, string>> = {
  shikoku_metan: 'Voz firme e clara, com personalidade',
  zundamon: 'Voz aguda e infantil',
  kasukabe_tsumugi: 'Voz animada e alegre',
  amehare_hau: 'Voz gentil e fofa',
  namine_ritsu: 'Voz grave e descolada',
  kurono_takehiro: 'Voz de rapaz, fresca e agradável',
  shirakami_kotarou: 'Voz de menino logo depois da mudança de voz',
  aoyama_ryusei: 'Voz grave, densa e encorpada',
  meimei_himari: 'Voz suave e calorosa',
  kyushu_sora: 'Voz adulta, elegante e refinada',
  mochikosan: 'Voz clara e tranquila',
  kenzaki_mesuo: 'Voz calma que passa segurança',
  white_cul: 'Voz agradável de ouvir e direta',
  goki: 'Voz acolhedora e discreta',
  number_seven: 'Voz firme e imponente',
  chibishikiji: 'Voz rouca e simpática',
  ouka_miko: 'Voz fofa de garota',
  sayo: 'Voz serena e gentil',
  nurserobo_typet: 'Voz calma e recatada',
  horinaito_benizakura: 'Voz vivaz e bem articulada',
  wakamatsu_akashi: 'Voz quieta e estável',
  kigashima_sourin: 'Voz de homem maduro, sóbria e charmosa',
  haruka_nana: 'Voz enérgica e forte',
  nekotsuka_aru: 'Voz encorpada e descontraída',
  nekotsuka_bi: 'Voz pura e inocente',
  chugoku_usagi: 'Voz misteriosa e ingênua',
  kurita_maron: 'Voz profunda e andrógina',
  aierutan: 'Voz agradável e suave',
  manbetsu_hanamaru: 'Voz vivaz e marcante',
  kotoyomi_nia: 'Voz lisa e mecânica',
  voidoll: 'Voz modesta e eletrônica',
  zonko: 'Voz apaixonada e vívida',
  chubu_tsurugi: 'Voz digna, com presença',
  rito: 'Voz envolvente, com respiração audível',
  kurosawa_kohaku: 'Voz confiante e firme',
  yureichan: 'Voz suave e flutuante',
  tohoku_zunko: 'Voz graciosa e simpática',
  tohoku_kiritan: 'Voz delicada e contida',
  tohoku_itako: 'Voz elegante, que deixa eco',
  ankomon: 'Voz contida e competitiva',
  yogatari_tobari: 'Voz inteligente e bem definida',
  akatsuki_mitama: 'Voz frágil e etérea',
  // O site oficial ainda não descreve a voz de 里石ユカ.
  satoishi_yuka: '',
};

/** Nome dos estilos (tons) de voz, do japonês do VOICEVOX para o português. */
export const STYLE_PT: Readonly<Record<string, string>> = {
  ノーマル: 'Normal',
  ふつう: 'Comum',
  あまあま: 'Doce',
  甘々: 'Super doce',
  ツンツン: 'Ríspido',
  ツンギレ: 'Estourado',
  セクシー: 'Sensual',
  'セクシー／あん子': 'Sensual / Anko',
  クイーン: 'Rainha',
  おどろき: 'Surpreso',
  こわがり: 'Medroso',
  へろへろ: 'Exausto',
  ヘロヘロ: 'Exausto',
  ささやき: 'Sussurro',
  囁き: 'Sussurro',
  ヒソヒソ: 'Cochicho',
  内緒話: 'Segredo',
  アナウンス: 'Locução',
  読み聞かせ: 'Contar histórias',
  '人間ver.': 'Versão humana',
  'ぬいぐるみver.': 'Versão pelúcia',
  '人間（怒り）ver.': 'Humana, com raiva',
  '鬼ver.': 'Versão oni (demônio)',
  たのしい: 'Alegre',
  かなしい: 'Triste',
  かなしみ: 'Tristeza',
  悲しみ: 'Tristeza',
  哀しみ: 'Pesar',
  びえーん: 'Chorando',
  泣き: 'Choro',
  なみだめ: 'Olhos marejados',
  わーい: 'Empolgado',
  びくびく: 'Assustado',
  おこ: 'Bravo',
  怒り: 'Raiva',
  喜び: 'Alegria',
  第二形態: 'Segunda forma',
  ロリ: 'Infantil',
  楽々: 'Folgado',
  恐怖: 'Medo',
  おちつき: 'Calmo',
  うきうき: 'Animado',
  人見知り: 'Tímido',
  元気: 'Energético',
  ぶりっ子: 'Fazendo charme',
  ボーイ: 'Menino',
  熱血: 'Fervoroso',
  不機嫌: 'Mal-humorado',
  しっとり: 'Sereno',
  のんびり: 'Sem pressa',
  低血圧: 'Pressão baixa',
  覚醒: 'Despertar',
  実況風: 'Estilo narrador',
  おどおど: 'Nervoso',
  絶望と敗北: 'Desespero e derrota',
  シリアス: 'Sério',
  ツクモちゃん: 'Tsukumo-chan',
  つよつよ: 'Forte',
  よわよわ: 'Fraco',
  けだるげ: 'Lânguido',
  明るい: 'Radiante',
  呆れ: 'Exasperado',
  つぼみ: 'Botão de flor',
};

/** Grafias que o endereço do site não dá sozinho. */
const ROMAN_OVERRIDES: Readonly<Record<string, string>> = {
  number_seven: 'No.7',
  white_cul: 'WhiteCUL',
  nurserobo_typet: 'Nurse Robo Type T',
  chibishikiji: 'Chibishiki Jii',
  mochikosan: 'Mochiko-san',
  yureichan: 'Yurei-chan',
};

/** Nome romanizado, a partir do endereço oficial do personagem ("kasukabe_tsumugi" → "Kasukabe Tsumugi"). */
export const romanName = (slug: string): string =>
  ROMAN_OVERRIDES[slug] ??
  slug
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

/** "Zundamon (ずんだもん)"; sem repetir quando o nome já é escrito em letras latinas (WhiteCUL, Voidoll). */
export const speakerLabel = (name: string, slug: string): string => {
  const roman = romanName(slug);
  return roman.toLowerCase() === name.toLowerCase() ? name : `${roman} (${name})`;
};

/** O estilo em português; sem tradução, o nome original. */
export const styleLabel = (name: string): string => STYLE_PT[name] ?? name;
