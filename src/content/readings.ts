// Textos curtos para ler, escritos para o app (N5 e N4), com a tradução de cada frase. NÃO vêm de fonte externa: foram escritos
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
  /** Nível do JLPT do texto; sem isto, N5. */
  level?: 'N5' | 'N4';
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
  {
    id: 'n4-viagem-com-amigo',
    title: 'Viagem com um amigo',
    kind: 'texto',
    level: 'N4',
    lines: [
      { jp: '来週、友だちと京都へ行くことにしました。', pt: 'Na semana que vem, decidi ir a Quioto com um amigo.', parts: [P('来週', 'らいしゅう', 'semana que vem'), P('、'), P('友だち', 'ともだち', 'amigo'), P('と'), P('京都', 'きょうと', 'Quioto'), P('へ'), P('行く', 'いく', 'ir'), P('ことにしました。', undefined, 'decidi (ことにする)')] },
      { jp: '朝早く出かけるので、今晩は早く寝ておきます。', pt: 'Como vou sair cedo de manhã, esta noite vou dormir cedo (para me preparar).' },
      { jp: '天気予報では、雨が降るかもしれません。', pt: 'Segundo a previsão do tempo, talvez chova.', parts: [P('天気予報', 'てんきよほう', 'previsão do tempo'), P('では、'), P('雨', 'あめ', 'chuva'), P('が'), P('降る', 'ふる', 'cair (chuva)'), P('かもしれません。', undefined, 'talvez')] },
      { jp: 'だから、かさを持っていきます。', pt: 'Por isso, vou levar um guarda-chuva.' },
      { jp: '京都でお寺を見て、おいしいものを食べるつもりです。', pt: 'Em Quioto, pretendo ver templos e comer coisas gostosas.', parts: [P('京都', 'きょうと', 'Quioto'), P('で'), P('お寺', 'おてら', 'templo'), P('を'), P('見て', 'みて', 'ver'), P('、おいしいものを'), P('食べる', 'たべる', 'comer'), P('つもりです。', undefined, 'pretendo, tenho a intenção')] },
    ],
  },
  {
    id: 'n4-erro-de-manha',
    title: 'Um erro de manhã',
    kind: 'texto',
    level: 'N4',
    lines: [
      { jp: '今朝、寝坊してしまいました。', pt: 'Hoje de manhã, acabei dormindo demais.' },
      { jp: '電車に乗り遅れて、会社に遅れました。', pt: 'Perdi o trem e me atrasei para a empresa.', parts: [P('電車', 'でんしゃ', 'trem'), P('に'), P('乗り遅れて', 'のりおくれて', 'perder (o trem)'), P('、'), P('会社', 'かいしゃ', 'empresa'), P('に'), P('遅れました。', 'おくれました', 'atrasei-me')] },
      { jp: '課長に注意されました。', pt: 'Fui advertido pelo chefe de seção.', parts: [P('課長', 'かちょう', 'chefe de seção'), P('に'), P('注意', 'ちゅうい', 'advertência, atenção'), P('されました。', undefined, 'fui (advertido): passiva de する')] },
      { jp: '明日は早く起きるつもりです。', pt: 'Amanhã pretendo acordar cedo.' },
    ],
  },
  {
    id: 'n4-doente',
    title: 'Dor de garganta',
    kind: 'texto',
    level: 'N4',
    lines: [
      { jp: 'きのうから、のどが痛いです。', pt: 'Desde ontem estou com dor de garganta.' },
      { jp: '熱があるかもしれません。', pt: 'Talvez eu esteja com febre.', parts: [P('熱', 'ねつ', 'febre'), P('がある'), P('かもしれません。', undefined, 'talvez')] },
      { jp: '今日は会社を休むことにしました。', pt: 'Hoje decidi faltar ao trabalho.' },
      { jp: '薬を飲んで、ゆっくり休みます。', pt: 'Vou tomar remédio e descansar bem.', parts: [P('薬', 'くすり', 'remédio'), P('を'), P('飲んで', 'のんで', 'tomar, beber'), P('、ゆっくり'), P('休みます。', 'やすみます', 'descansar')] },
      { jp: '早く治ればいいのですが。', pt: 'Se eu me recuperar logo, seria bom.', parts: [P('早く', 'はやく', 'cedo, logo'), P('治れば', 'なおれば', 'se eu me recuperar'), P('いいのですが。', undefined, 'seria bom (mas...)')] },
    ],
  },
  {
    id: 'n4-arubaito',
    title: 'O trabalho de meio período',
    kind: 'texto',
    level: 'N4',
    lines: [
      { jp: '私は土曜日にアルバイトをしています。', pt: 'Aos sábados eu trabalho meio período.' },
      { jp: '店長はとても厳しいですが、やさしい人です。', pt: 'O gerente é muito rigoroso, mas é uma pessoa gentil.', parts: [P('店長', 'てんちょう', 'gerente da loja'), P('はとても'), P('厳しい', 'きびしい', 'rigoroso'), P('ですが、やさしい'), P('人', 'ひと', 'pessoa'), P('です。')] },
      { jp: '先週、お客さんに怒られました。', pt: 'Na semana passada, fui repreendido por um cliente.', parts: [P('先週', 'せんしゅう', 'semana passada'), P('、'), P('お客さん', 'おきゃくさん', 'cliente'), P('に'), P('怒られました。', 'おこられました', 'fui repreendido (passiva de 怒る)')] },
      { jp: 'でも、店長にほめられて、うれしかったです。', pt: 'Mas fui elogiado pelo gerente e fiquei feliz.', parts: [P('でも、'), P('店長', 'てんちょう', 'gerente da loja'), P('に'), P('ほめられて', undefined, 'ser elogiado'), P('、うれしかったです。')] },
    ],
  },
  {
    id: 'n4-aniversario-da-mae',
    title: 'O aniversário da mãe',
    kind: 'texto',
    level: 'N4',
    lines: [
      { jp: '来週の日曜日は母の誕生日です。', pt: 'No próximo domingo é o aniversário da minha mãe.' },
      { jp: 'プレゼントを買いに行くことにしました。', pt: 'Decidi ir comprar um presente.' },
      { jp: '母は花が好きなはずです。', pt: 'Minha mãe deve gostar de flores.' },
      { jp: '花を買えば、きっと喜びます。', pt: 'Se eu comprar flores, ela com certeza vai ficar feliz.', parts: [P('花', 'はな', 'flor'), P('を'), P('買えば', 'かえば', 'se eu comprar'), P('、きっと'), P('喜びます。', 'よろこびます', 'ficar feliz')] },
    ],
  },
  {
    id: 'n4-estudo-de-japones',
    title: 'Estudando japonês',
    kind: 'texto',
    level: 'N4',
    lines: [
      { jp: '毎日、日本語を勉強しています。', pt: 'Estudo japonês todos os dias.' },
      { jp: '去年は、漢字が読めませんでした。', pt: 'No ano passado, eu não conseguia ler kanji.', parts: [P('去年', 'きょねん', 'ano passado'), P('は、'), P('漢字', 'かんじ', 'kanji'), P('が'), P('読めません', 'よめません', 'não consigo ler'), P('でした。')] },
      { jp: '今は、新聞が少し読めるようになりました。', pt: 'Agora passei a conseguir ler um pouco do jornal.', parts: [P('今', 'いま', 'agora'), P('は、'), P('新聞', 'しんぶん', 'jornal'), P('が'), P('少し', 'すこし', 'um pouco'), P('読める', 'よめる', 'conseguir ler'), P('ようになりました。', undefined, 'passei a (ようになる)')] },
      { jp: '毎晩、日本語のニュースを聞いています。', pt: 'Toda noite escuto notícias em japonês.' },
    ],
  },
  {
    id: 'n4-mudanca',
    title: 'A mudança',
    kind: 'texto',
    level: 'N4',
    lines: [
      { jp: '来月、新しいアパートに引っ越します。', pt: 'No mês que vem, vou me mudar para um apartamento novo.', parts: [P('来月', 'らいげつ', 'mês que vem'), P('、'), P('新しい', 'あたらしい', 'novo'), P('アパートに'), P('引っ越します。', 'ひっこします', 'mudar-se')] },
      { jp: '駅から近いのに、家賃は安いです。', pt: 'Embora seja perto da estação, o aluguel é barato.', parts: [P('駅', 'えき', 'estação'), P('から'), P('近い', 'ちかい', 'perto'), P('のに、', undefined, 'embora'), P('家賃', 'やちん', 'aluguel'), P('は'), P('安い', 'やすい', 'barato'), P('です。')] },
      { jp: '引っ越しのために、お金をためています。', pt: 'Estou juntando dinheiro para a mudança.', parts: [P('引っ越し', 'ひっこし', 'mudança'), P('のために、', undefined, 'para'), P('お金', 'おかね', 'dinheiro'), P('を'), P('ためています。', undefined, 'estou juntando')] },
      { jp: '荷物が多いので、友だちに手伝ってもらいます。', pt: 'Como tenho muitas coisas, vou pedir ajuda a um amigo.', parts: [P('荷物', 'にもつ', 'bagagem, coisas'), P('が'), P('多い', 'おおい', 'muito'), P('ので、'), P('友だち', 'ともだち', 'amigo'), P('に'), P('手伝って', 'てつだって', 'ajudar'), P('もらいます。', undefined, 'recebo (a ajuda de alguém)')] },
      { jp: '引っ越したら、パーティーをするつもりです。', pt: 'Quando me mudar, pretendo fazer uma festa.', parts: [P('引っ越したら', 'ひっこしたら', 'quando me mudar'), P('、パーティーをするつもりです。')] },
    ],
  },
  {
    id: 'n4-minha-mae',
    title: 'Minha mãe',
    kind: 'texto',
    level: 'N4',
    lines: [
      { jp: '母はとても厳しい人です。', pt: 'Minha mãe é uma pessoa muito rigorosa.' },
      { jp: '弟に毎朝、犬の散歩をさせます。', pt: 'Ela faz meu irmão mais novo passear com o cachorro toda manhã.', parts: [P('弟', 'おとうと', 'irmão mais novo'), P('に'), P('毎朝', 'まいあさ', 'toda manhã'), P('、'), P('犬', 'いぬ', 'cachorro'), P('の'), P('散歩', 'さんぽ', 'passeio'), P('を'), P('させます。', undefined, 'faz (alguém) fazer: causativa de する')] },
      { jp: 'でも、母の料理を食べると、いつも元気になります。', pt: 'Mas quando como a comida da minha mãe, sempre fico animado.' },
    ],
  },
  {
    id: 'n4-atraso-de-trem',
    title: 'Aviso de atraso do trem',
    kind: 'dia',
    level: 'N4',
    where: 'Nas plataformas e nos alto-falantes da estação',
    lines: [
      { jp: '事故のため、電車が遅れています。', pt: 'Por causa de um acidente, os trens estão atrasados.', parts: [P('事故', 'じこ', 'acidente'), P('のため、'), P('電車', 'でんしゃ', 'trem'), P('が'), P('遅れて', 'おくれて', 'atrasando'), P('います。')] },
      { jp: 'ご迷惑をおかけして、申し訳ありません。', pt: 'Pedimos desculpas pelo transtorno.', parts: [P('ご'), P('迷惑', 'めいわく', 'incômodo, transtorno'), P('をおかけして、'), P('申し訳', 'もうしわけ', 'desculpa'), P('ありません。')] },
      { jp: '次の電車は五分後に来ます。', pt: 'O próximo trem chega em cinco minutos.', parts: [P('次', 'つぎ', 'próximo'), P('の'), P('電車', 'でんしゃ', 'trem'), P('は'), P('五分後', 'ごふんご', 'daqui a cinco minutos'), P('に'), P('来ます。', 'きます', 'vem, chega')] },
    ],
  },
  {
    id: 'n4-hotel',
    title: 'Aviso no hotel',
    kind: 'dia',
    level: 'N4',
    where: 'Na recepção e no quarto do hotel',
    lines: [
      { jp: 'チェックアウトは十一時までです。', pt: 'O check-out é até as onze horas.', parts: [P('チェックアウトは'), P('十一時', 'じゅういちじ', 'onze horas'), P('までです。')] },
      { jp: '貴重品は、フロントにお預けください。', pt: 'Deixe seus objetos de valor na recepção.', parts: [P('貴重品', 'きちょうひん', 'objetos de valor'), P('は、フロントに'), P('お預け', 'おあずけ', 'deixar em guarda'), P('ください。')] },
      { jp: '部屋で、たばこを吸わないでください。', pt: 'Não fume no quarto.', parts: [P('部屋', 'へや', 'quarto'), P('で、たばこを'), P('吸わ', 'すわ', 'fumar (raiz de 吸う)'), P('ないでください。')] },
    ],
  },
  {
    id: 'n4-elevador-e-terremoto',
    title: 'Elevador e terremoto',
    kind: 'dia',
    level: 'N4',
    where: 'Dentro de elevadores e em prédios',
    lines: [
      { jp: '地震のときは、エレベーターを使わないでください。', pt: 'Em caso de terremoto, não use o elevador.', parts: [P('地震', 'じしん', 'terremoto'), P('のときは、エレベーターを'), P('使わ', 'つかわ', 'usar (raiz de 使う)'), P('ないでください。')] },
      { jp: '階段を使って、外に逃げてください。', pt: 'Use a escada e fuja para fora.', parts: [P('階段', 'かいだん', 'escada'), P('を'), P('使って', 'つかって', 'usando'), P('、'), P('外', 'そと', 'fora'), P('に'), P('逃げて', 'にげて', 'fugir'), P('ください。')] },
      { jp: '非常ボタンを押せば、助けを呼べます。', pt: 'Se você apertar o botão de emergência, pode chamar ajuda.', parts: [P('非常', 'ひじょう', 'emergência'), P('ボタンを'), P('押せば、', 'おせば', 'se apertar'), P('助け', 'たすけ', 'ajuda'), P('を'), P('呼べます。', 'よべます', 'consegue chamar')] },
    ],
  },
];

/** O nível de um texto (sem `level`, N5). */
export const levelOf = (text: ReadingText): 'N5' | 'N4' => text.level ?? 'N5';
