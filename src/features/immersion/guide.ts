/**
 * Guia de imersão e de conversa: o que consumir e como praticar fora do app, por nível.
 * Texto escrito aqui, em português, e a revisar por um falante. Os nomes de serviços são exemplos, não parcerias:
 * sites e apps mudam de preço e de endereço, por isso o guia diz o tipo de coisa a procurar antes do nome.
 */

export type ImmersionLevel = 'n5' | 'n4' | 'n3';

export interface ImmersionStep {
  /** Tipo de material (áudio, vídeo, leitura). */
  kind: 'Áudio' | 'Vídeo' | 'Leitura';
  /** O que procurar e quanto tempo dedicar. */
  what: string;
  /** Exemplos de onde achar (o aluno confere se ainda existem). */
  examples: string;
}

export interface ImmersionPlan {
  level: ImmersionLevel;
  label: string;
  /** Como saber que é a hora de estar neste nível. */
  when: string;
  steps: readonly ImmersionStep[];
  /** Como usar as legendas neste nível. */
  subtitles: string;
}

export const IMMERSION: readonly ImmersionPlan[] = [
  {
    level: 'n5',
    label: 'N5 (começando)',
    when: 'Você lê hiragana e katakana e sabe umas 300 palavras.',
    steps: [
      { kind: 'Áudio', what: 'Aulas curtas em japonês simples, de 5 a 10 minutos por dia, só para acostumar o ouvido ao ritmo. Entender tudo não é o objetivo.', examples: 'Podcasts e vídeos feitos para iniciantes, como os de "japonês fácil" ou o "Easy Japanese" da NHK.' },
      { kind: 'Vídeo', what: 'Programas infantis e desenhos do dia a dia: frases curtas, fala devagar e muita imagem ajudando.', examples: 'Desenhos como Doraemon ou Shin-chan e programas de TV para crianças.' },
      { kind: 'Leitura', what: 'Livros graduados do nível mais baixo e textos com furigana sobre rotina, comida e viagem.', examples: 'Leitura graduada gratuita (Tadoku), mangá com furigana e as leituras do próprio Moji Dojo.' },
    ],
    subtitles: 'Assista com legenda em português para acompanhar a história e, na segunda vez, tente ouvir sem olhar. Palavra que você já estudou e reconhece vale como vitória.',
  },
  {
    level: 'n4',
    label: 'N4 (frases do dia a dia)',
    when: 'Você entende frases simples de loja, estação e restaurante e conhece cerca de 600 palavras.',
    steps: [
      { kind: 'Áudio', what: 'Conversas lentas entre duas pessoas e podcasts de compreensão, 15 a 20 minutos por dia. Ouça a mesma faixa 2 ou 3 vezes em dias diferentes.', examples: 'Podcasts de "input compreensível" em japonês simples e conversas gravadas para estudantes.' },
      { kind: 'Vídeo', what: 'Vlogs e programas de culinária ou viagem, onde a imagem mostra o que a fala diz.', examples: 'Canais de japonês compreensível no YouTube e dramas leves de rotina, com episódios curtos.' },
      { kind: 'Leitura', what: 'Notícias simplificadas e histórias curtas. Leia com furigana ligado e vá desligando aos poucos.', examples: 'Sites de notícias em japonês fácil (como o da NHK) e leitores graduados de nível 1 a 2.' },
    ],
    subtitles: 'Troque a legenda em português pela legenda em japonês quando a história já for conhecida. Pausar para procurar uma palavra é bom, mas limite a 3 pausas por episódio para não perder o ritmo.',
  },
  {
    level: 'n3',
    label: 'N3 (conteúdo de verdade)',
    when: 'Você acompanha uma conversa lenta e lê textos curtos sem furigana em quase tudo.',
    steps: [
      { kind: 'Áudio', what: 'Podcasts de bate-papo entre nativos e rádio de notícias, 20 a 30 minutos por dia. Aceite que vai perder partes: busque a ideia geral.', examples: 'Podcasts de conversa em japonês natural e programas de rádio ou notícias da NHK.' },
      { kind: 'Vídeo', what: 'Anime e drama do seu gosto com legenda em japonês, e vídeos do YouTube sobre assuntos que você já curte.', examples: 'Extensões que mostram a legenda em japonês com dicionário por cima (como o Language Reactor, para navegador).' },
      { kind: 'Leitura', what: 'Artigos curtos, mangá sem furigana e romances leves. Marque palavras novas só se aparecerem de novo na mesma semana.', examples: 'Leitores de livros digitais com dicionário embutido e mangá com versão digital.' },
    ],
    subtitles: 'Legenda só em japonês. Se perdeu uma fala, volte 10 segundos, ouça de novo com a legenda e só depois olhe a tradução. Desligue a legenda em cenas que você já domina.',
  },
] as const;

export interface ConversationTip {
  title: string;
  body: string;
}

/** Como achar com quem falar japonês. */
export const CONVERSATION_WAYS: readonly ConversationTip[] = [
  { title: 'Tutor (aula particular)', body: 'Plataformas de aulas online têm tutores de japonês com preço por aula. Escolha quem tem avaliações, faça uma aula de teste e diga o seu nível logo no começo. Para o N5 e o N4, prefira quem fala português ou inglês, para tirar dúvidas.' },
  { title: 'Troca de idiomas (intercâmbio)', body: 'Apps de troca de idiomas ligam você a um japonês que estuda português ou inglês. É de graça, mas depende de combinar horários: divida o encontro ao meio, metade em japonês e metade na outra língua.' },
  { title: 'Grupos e comunidades', body: 'Servidores de estudo no Discord, grupos de estudantes de japonês e encontros de cultura japonesa na sua cidade. Apresente-se em japonês, mesmo errando, e peça correção.' },
  { title: 'Segurança', body: 'Combine tudo dentro da plataforma, não passe endereço, documento ou dado bancário, e saia da conversa se alguém insistir em assuntos que você não quer.' },
];

/** Roteiro de uma primeira conversa de 15 a 20 minutos. */
export const FIRST_CONVERSATION: readonly ConversationTip[] = [
  { title: 'Antes: prepare 5 frases', body: 'Escreva e ensaie em voz alta: o seu nome, de onde você é, há quanto tempo estuda, um hobby e ゆっくり話してください (fale devagar, por favor). Leve-as anotadas.' },
  { title: 'Abertura (2 min)', body: 'はじめまして。〇〇です。ブラジルから来ました。日本語を勉強しています。よろしくお願いします。 Respire e fale devagar: ninguém espera perfeição de quem acabou de começar.' },
  { title: 'Perguntas fáceis (5 a 8 min)', body: 'Faça perguntas de uma frase: お仕事は何ですか。/ 趣味は何ですか。/ どこに住んでいますか。 Quando entender só metade, repita o que entendeu: 〇〇ですか。' },
  { title: 'Quando travar', body: 'Use as frases de salvação: もう一度お願いします (mais uma vez), わかりません (não entendi), 〇〇は日本語で何ですか (como se diz 〇〇 em japonês?). Pedir ajuda faz parte da conversa.' },
  { title: 'Fechamento (2 min)', body: '今日はありがとうございました。また話しましょう。 Combine o próximo encontro na hora e anote 3 palavras ou frases novas que apareceram.' },
  { title: 'Depois: aproveite o erro', body: 'Anote o que você não conseguiu dizer e procure no app (Frases → Montar ou Banco). Na próxima conversa, tente usar essas frases.' },
];
