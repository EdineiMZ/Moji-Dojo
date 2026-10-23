// Textos curtos para ler, escritos para o app (N5), com a tradução de cada frase. NÃO vêm de fonte externa: foram escritos
// por IA com o vocabulário e a gramática que o app ensina e precisam de revisão por quem fala japonês (ver LICENSE.md).
// O teste src/content/readings.test.ts garante que toda frase só usa palavras do vocabulário e do léxico do app.

export interface ReadingLine {
  jp: string;
  pt: string;
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
];
