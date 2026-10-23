// Textos curtos para ler, escritos para o app (N5), com a tradução de cada frase. NÃO vêm de fonte externa: foram escritos
// por IA com o vocabulário e a gramática que o app ensina e precisam de revisão por quem fala japonês (ver LICENSE.md).
// O teste src/content/readings.test.ts garante que as frases sem `parts` só usam palavras do vocabulário do app. Os textos do dia a dia
// (placas, cardápios, avisos) usam kanji de verdade e trazem `parts`, com a leitura e o significado de cada pedaço.

/** Um pedaço de uma frase real (uma placa, um cardápio) com a leitura e o significado, para palavras que o vocabulário do app ainda não tem. */
export interface LinePart {
  jp: string;
  /** Leitura em kana, quando o pedaço tem kanji. */
  reading?: string;
  /** O que significa. */
  pt?: string;
}

export interface ReadingLine {
  jp: string;
  pt: string;
  /** Pedaços tocáveis da frase. Sem isto, o leitor corta a frase pelo léxico do app (que precisa conhecer todas as palavras). */
  parts?: readonly LinePart[];
}

export interface ReadingText {
  id: string;
  title: string;
  /** "texto" = pequeno texto corrido; "dia" = leitura do dia a dia (aviso, cardápio, horário...). */
  kind: 'texto' | 'dia';
  /** Onde se vê isso na vida real, para as leituras do dia a dia. */
  where?: string;
  lines: readonly ReadingLine[];
}

/** Atalho para escrever os pedaços de uma placa ou cardápio. */
const P = (jp: string, reading?: string, pt?: string): LinePart => ({ jp, ...(reading ? { reading } : {}), ...(pt ? { pt } : {}) });

export const READINGS: readonly ReadingText[] = [
  {
    id: 'eu-e-a-escola',
    title: 'Eu e a escola',
    kind: 'texto',
    lines: [
      { jp: 'わたしは学生です。', pt: 'Eu sou estudante.' },
      { jp: 'わたしの学校は大きいです。', pt: 'Minha escola é grande.' },
      { jp: '先生はやさしいです。', pt: 'O professor é gentil.' },
      { jp: '毎日、学校へ行きます。', pt: 'Todos os dias eu vou à escola.' },
    ],
  },
  {
    id: 'cafe-da-manha',
    title: 'Café da manhã',
    kind: 'texto',
    lines: [
      { jp: '七時に起きます。', pt: 'Eu acordo às sete.' },
      { jp: '朝、パンを食べます。', pt: 'De manhã, eu como pão.' },
      { jp: 'それから、水を飲みます。', pt: 'Depois, eu bebo água.' },
      { jp: 'コーヒーも好きです。', pt: 'Também gosto de café.' },
    ],
  },
  {
    id: 'meu-dia',
    title: 'Meu dia',
    kind: 'texto',
    lines: [
      { jp: '毎日、日本語を勉強します。', pt: 'Todos os dias eu estudo japonês.' },
      { jp: '日本語はおもしろいです。', pt: 'O japonês é divertido.' },
      { jp: '夜、テレビを見ます。', pt: 'À noite, eu vejo televisão.' },
      { jp: '十時に寝ます。', pt: 'Eu durmo às dez.' },
    ],
  },
  {
    id: 'domingo',
    title: 'Domingo',
    kind: 'texto',
    lines: [
      { jp: '今日は日曜日です。', pt: 'Hoje é domingo.' },
      { jp: '学校は休みです。', pt: 'A escola está de folga.' },
      { jp: '今日は天気がいいです。', pt: 'Hoje o tempo está bom.' },
      { jp: '明日も休みです。', pt: 'Amanhã também é folga.' },
    ],
  },
  {
    id: 'chuva',
    title: 'Dia de chuva',
    kind: 'texto',
    lines: [
      { jp: '今日は雨です。', pt: 'Hoje é dia de chuva.' },
      { jp: '雨ですから、うちにいます。', pt: 'Como está chovendo, eu fico em casa.' },
      { jp: '夜、テレビを見ます。', pt: 'À noite, eu vejo televisão.' },
    ],
  },
  {
    id: 'cardapio',
    title: 'Cardápio',
    kind: 'dia',
    where: 'Na porta de um restaurante',
    lines: [
      { jp: 'ラーメン 八百円', pt: 'Lámen: 800 ienes.' },
      { jp: 'ごはん 三百円', pt: 'Arroz: 300 ienes.' },
      { jp: 'お水をください。', pt: 'Água, por favor. (o que você diz ao pedir)' },
    ],
  },
  {
    id: 'aviso-estacao',
    title: 'Aviso e horário na estação',
    kind: 'dia',
    where: 'Na plataforma do trem',
    lines: [
      { jp: 'ここでたばこをすわないでください。', pt: 'Não fume aqui.' },
      { jp: '次の電車は十時です。', pt: 'O próximo trem é às dez.' },
      { jp: 'この電車は東京へ行きます。', pt: 'Este trem vai para Tóquio.' },
    ],
  },
  {
    id: 'biblioteca',
    title: 'Horário da biblioteca',
    kind: 'dia',
    where: 'Na porta de uma biblioteca',
    lines: [
      { jp: '図書館は九時から五時までです。', pt: 'A biblioteca abre das nove às cinco.' },
      { jp: '日曜日はお休みです。', pt: 'No domingo está fechada.' },
      { jp: 'トイレはどこですか。', pt: 'Onde fica o banheiro? (o que você pergunta)' },
    ],
  },
  {
    id: 'placas-estacao',
    title: 'Placas da estação',
    kind: 'dia',
    where: 'Dentro de uma estação de trem ou metrô',
    lines: [
      { jp: '出口', pt: 'Saída', parts: [P('出口', 'でぐち', 'saída')] },
      { jp: '入口', pt: 'Entrada', parts: [P('入口', 'いりぐち', 'entrada')] },
      { jp: '乗り換え', pt: 'Baldeação (trocar de linha)', parts: [P('乗り換え', 'のりかえ', 'baldeação, trocar de linha')] },
      { jp: '切符売り場', pt: 'Bilheteria', parts: [P('切符', 'きっぷ', 'bilhete'), P('売り場', 'うりば', 'local de venda')] },
      { jp: '改札口', pt: 'Catraca (portão de acesso aos trens)', parts: [P('改札口', 'かいさつぐち', 'catraca, portão onde se passa o bilhete')] },
      { jp: '次は新宿', pt: 'A próxima é Shinjuku (aviso no trem)', parts: [P('次', 'つぎ', 'próximo'), P('は', undefined, 'quanto a'), P('新宿', 'しんじゅく', 'Shinjuku')] },
      { jp: '急行', pt: 'Expresso (para em poucas estações)', parts: [P('急行', 'きゅうこう', 'expresso')] },
      { jp: '各駅停車', pt: 'Local (para em todas as estações)', parts: [P('各駅停車', 'かくえきていしゃ', 'trem local, para em todas as estações')] },
    ],
  },
  {
    id: 'avisos-proibicoes',
    title: 'Avisos e proibições',
    kind: 'dia',
    where: 'Em ruas, templos, museus e prédios',
    lines: [
      { jp: '禁煙', pt: 'Proibido fumar', parts: [P('禁煙', 'きんえん', 'proibido fumar')] },
      { jp: '立入禁止', pt: 'Entrada proibida', parts: [P('立入', 'たちいり', 'entrada'), P('禁止', 'きんし', 'proibição')] },
      { jp: '撮影禁止', pt: 'Proibido fotografar', parts: [P('撮影', 'さつえい', 'fotografar, filmar'), P('禁止', 'きんし', 'proibição')] },
      { jp: '非常口', pt: 'Saída de emergência', parts: [P('非常口', 'ひじょうぐち', 'saída de emergência')] },
      { jp: '危険', pt: 'Perigo', parts: [P('危険', 'きけん', 'perigo')] },
      { jp: '注意', pt: 'Atenção, cuidado', parts: [P('注意', 'ちゅうい', 'atenção, cuidado')] },
      { jp: '工事中', pt: 'Em obras', parts: [P('工事', 'こうじ', 'obra'), P('中', 'ちゅう', 'em andamento')] },
      { jp: '土足厳禁', pt: 'Proibido entrar com o calçado da rua', parts: [P('土足', 'どそく', 'calçado da rua'), P('厳禁', 'げんきん', 'estritamente proibido')] },
    ],
  },
  {
    id: 'horarios-loja',
    title: 'Horários e avisos de loja',
    kind: 'dia',
    where: 'Na porta de lojas e restaurantes',
    lines: [
      { jp: '営業中', pt: 'Aberto', parts: [P('営業', 'えいぎょう', 'funcionamento'), P('中', 'ちゅう', 'em andamento')] },
      { jp: '準備中', pt: 'Em preparação (ainda fechado)', parts: [P('準備', 'じゅんび', 'preparação'), P('中', 'ちゅう', 'em andamento')] },
      { jp: '営業時間 10:00〜20:00', pt: 'Horário de funcionamento: das 10h às 20h', parts: [P('営業時間', 'えいぎょうじかん', 'horário de funcionamento'), P('10:00〜20:00', undefined, 'das 10h às 20h')] },
      { jp: '定休日 水曜日', pt: 'Dia de folga da loja: quarta-feira', parts: [P('定休日', 'ていきゅうび', 'dia de folga da loja'), P('水曜日', 'すいようび', 'quarta-feira')] },
      { jp: '本日休業', pt: 'Fechado hoje', parts: [P('本日', 'ほんじつ', 'hoje'), P('休業', 'きゅうぎょう', 'fechado, sem funcionar')] },
      { jp: '現金のみ', pt: 'Só dinheiro vivo', parts: [P('現金', 'げんきん', 'dinheiro vivo'), P('のみ', undefined, 'somente')] },
    ],
  },
  {
    id: 'cardapio-real',
    title: 'Cardápio de uma casa de lámen',
    kind: 'dia',
    where: 'Na vitrine e na máquina de tickets do restaurante',
    lines: [
      { jp: 'ラーメン 800円', pt: 'Lámen: 800 ienes', parts: [P('ラーメン', undefined, 'lámen'), P('800円', 'はっぴゃくえん', '800 ienes')] },
      { jp: '餃子 5個 500円', pt: 'Guioza, 5 peças: 500 ienes', parts: [P('餃子', 'ぎょうざ', 'guioza (pastel grelhado)'), P('5個', 'ごこ', '5 peças'), P('500円', 'ごひゃくえん', '500 ienes')] },
      { jp: '大盛り +100円', pt: 'Porção grande: mais 100 ienes', parts: [P('大盛り', 'おおもり', 'porção grande'), P('+100円', 'プラスひゃくえん', 'mais 100 ienes')] },
      { jp: '生ビール', pt: 'Chope', parts: [P('生ビール', 'なまビール', 'chope')] },
      { jp: 'ライス おかわり自由', pt: 'Arroz à vontade (pode repetir)', parts: [P('ライス', undefined, 'arroz'), P('おかわり', undefined, 'repetir, servir mais'), P('自由', 'じゆう', 'à vontade')] },
      { jp: '食券機', pt: 'Máquina de tickets de refeição (você paga antes de sentar)', parts: [P('食券機', 'しょっけんき', 'máquina de tickets de refeição')] },
    ],
  },
  {
    id: 'precos-impostos',
    title: 'Preços e impostos',
    kind: 'dia',
    where: 'Em etiquetas, cardápios e recibos',
    lines: [
      { jp: '税込 1,100円', pt: 'Com imposto: 1.100 ienes', parts: [P('税込', 'ぜいこみ', 'com imposto incluído'), P('1,100円', 'せんひゃくえん', '1.100 ienes')] },
      { jp: '税別 1,000円', pt: 'Sem imposto: 1.000 ienes (o imposto é somado no caixa)', parts: [P('税別', 'ぜいべつ', 'sem imposto'), P('1,000円', 'せんえん', '1.000 ienes')] },
      { jp: '免税', pt: 'Isento de imposto (tax-free, para turistas)', parts: [P('免税', 'めんぜい', 'isento de imposto')] },
      { jp: '割引', pt: 'Desconto', parts: [P('割引', 'わりびき', 'desconto')] },
      { jp: '半額', pt: 'Metade do preço', parts: [P('半額', 'はんがく', 'metade do preço')] },
    ],
  },
  {
    id: 'banho-onsen',
    title: 'Banheiros e onsen',
    kind: 'dia',
    where: 'Em banheiros públicos, onsen (águas termais) e pousadas',
    lines: [
      { jp: '男', pt: 'Homens', parts: [P('男', 'おとこ', 'homem')] },
      { jp: '女', pt: 'Mulheres', parts: [P('女', 'おんな', 'mulher')] },
      { jp: '男湯', pt: 'Banho masculino', parts: [P('男', 'おとこ', 'homem'), P('湯', 'ゆ', 'água quente, banho')] },
      { jp: '女湯', pt: 'Banho feminino', parts: [P('女', 'おんな', 'mulher'), P('湯', 'ゆ', 'água quente, banho')] },
      { jp: '脱衣所', pt: 'Vestiário', parts: [P('脱衣所', 'だついじょ', 'vestiário')] },
      { jp: '入れ墨・タトゥーお断り', pt: 'Não aceitamos tatuagens', parts: [P('入れ墨', 'いれずみ', 'tatuagem'), P('・'), P('タトゥー', undefined, 'tatuagem'), P('お断り', 'おことわり', 'não aceitamos')] },
    ],
  },
  {
    id: 'regras-transporte',
    title: 'Regras no trem e no ônibus',
    kind: 'dia',
    where: 'Em avisos e anúncios dentro do transporte',
    lines: [
      { jp: '優先席', pt: 'Assento preferencial', parts: [P('優先席', 'ゆうせんせき', 'assento preferencial (idosos, gestantes...)')] },
      { jp: '女性専用車両', pt: 'Vagão exclusivo para mulheres', parts: [P('女性', 'じょせい', 'mulher'), P('専用', 'せんよう', 'exclusivo'), P('車両', 'しゃりょう', 'vagão')] },
      { jp: '携帯電話はマナーモードに', pt: 'Ponha o celular no modo silencioso', parts: [P('携帯電話', 'けいたいでんわ', 'celular'), P('は', undefined, 'quanto a'), P('マナーモード', undefined, 'modo silencioso'), P('に', undefined, 'em')] },
      { jp: '駆け込み乗車はおやめください', pt: 'Por favor, não corra para entrar quando as portas estiverem fechando', parts: [P('駆け込み乗車', 'かけこみじょうしゃ', 'correr para entrar na hora de fechar'), P('は', undefined, 'quanto a'), P('おやめください', undefined, 'por favor, não faça')] },
    ],
  },
  {
    id: 'conbini-supermercado',
    title: 'No conbini e no supermercado',
    kind: 'dia',
    where: 'Em embalagens, prateleiras e no caixa',
    lines: [
      { jp: '賞味期限', pt: 'Validade (melhor consumir até)', parts: [P('賞味期限', 'しょうみきげん', 'validade, melhor consumir até')] },
      { jp: 'お弁当', pt: 'Marmita (refeição pronta)', parts: [P('お弁当', 'おべんとう', 'marmita, refeição pronta')] },
      { jp: '温めますか', pt: 'Quer que esquente? (o atendente pergunta)', parts: [P('温めますか', 'あたためますか', 'quer que eu esquente?')] },
      { jp: 'レジ袋 有料', pt: 'Sacola do caixa é paga', parts: [P('レジ袋', 'レジぶくろ', 'sacola do caixa'), P('有料', 'ゆうりょう', 'pago, com taxa')] },
    ],
  },
];
