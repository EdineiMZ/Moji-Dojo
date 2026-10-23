// Fonte dos diálogos curtos. Gera src/content/dialogs.ts com `npm run build-dialogs`.
//
// As falas do ALUNO (`you`) são sempre frases de Viagem (src/data/travel.ts, vindas do HTML original): aqui só se
// escreve o texto japonês exatamente como está lá, e o gerador busca o romaji e a tradução. As falas do ATENDENTE
// (`staff`) são frases fixas de atendimento, escritas com a marcação de kana de scripts/grammar-n5 (espaço = palavra,
// | = só no romaji, ~X = partícula). Elas precisam de revisão por quem fala japonês antes de publicar.
//
// Cada turno do aluno tem exatamente uma resposta certa (`true`); as erradas levam o motivo, em português.

export const SCENES = [
  {
    id: 'restaurante',
    title: 'No restaurante',
    place: 'Restaurante',
    intro: 'Você entra num restaurante em Tóquio, sozinho. Responda ao atendente com a frase certa para cada momento.',
    turns: [
      { narrator: 'Você entra no restaurante.' },
      { staff: 'いらっしゃいませ なんめいさま です~か', pt: 'Bem-vindo! Quantas pessoas?' },
      {
        you: [
          ['ひとりです', true],
          ['これを ください', false, 'Isso é pedir um prato. O atendente perguntou quantas pessoas são.'],
          ['ごちそうさまでした', false, 'Isso se diz ao terminar de comer, e você acabou de entrar.'],
        ],
      },
      { staff: 'こちら~へ どうぞ おのみもの~は いかが です~か', pt: 'Por aqui, por favor. Aceita algo para beber?' },
      {
        you: [
          ['おみずを ください', true],
          ['おかいけい おねがいします', false, 'Pedir a conta agora seria cedo: você acabou de sentar.'],
          ['ひとりです', false, 'Ele já sabe disso. A pergunta agora é sobre bebida.'],
        ],
      },
      { staff: 'ごちゅうもん~は おきまり です~か', pt: 'Já decidiu o pedido?' },
      {
        you: [
          ['これを ください', true],
          ['いただきます', false, 'Esse se diz quando a comida chega, antes de comer, e não para pedir.'],
          ['メニューを ください', false, 'Você já está com o cardápio: ele perguntou se você já escolheu.'],
        ],
      },
      { narrator: 'A comida chegou à mesa.' },
      {
        you: [
          ['いただきます', true],
          ['ごちそうさまでした', false, 'Esse se diz depois de comer. Agora a comida acabou de chegar.'],
          ['すみません', false, 'Serve para chamar o atendente, e a comida já chegou.'],
        ],
      },
      { narrator: 'Você terminou de comer.' },
      {
        you: [
          ['ごちそうさまでした', true],
          ['いただきます', false, 'Esse se diz antes de comer. Você já terminou.'],
          ['ひとりです', false, 'Ninguém perguntou isso agora.'],
        ],
      },
      { narrator: 'Agora você quer pagar.' },
      {
        you: [
          ['おかいけい おねがいします', true],
          ['カードで はらえますか', false, 'Boa pergunta, mas vem depois: primeiro peça a conta.'],
          ['みてる だけです', false, 'Esse é de loja, para quando você só está olhando.'],
        ],
      },
    ],
  },
  {
    id: 'compras',
    title: 'Na loja',
    place: 'Compras',
    intro: 'Você entra numa loja de lembranças. Escolha o que dizer em cada momento da compra.',
    turns: [
      { narrator: 'Você entra numa loja de lembranças.' },
      { staff: 'いらっしゃいませ なに~か おさがし です~か', pt: 'Bem-vindo! Está procurando algo?' },
      {
        you: [
          ['みてる だけです', true],
          ['ふくろは いりません', false, 'Você ainda não comprou nada: sacola é assunto da hora de pagar.'],
          ['えきは どこですか', false, 'É uma pergunta útil, mas não responde se você procura algo.'],
        ],
      },
      { narrator: 'Você pega uma camiseta e quer saber o preço.' },
      {
        you: [
          ['これは いくらですか', true],
          ['もっと やすいのは ありますか', false, 'Você ainda não sabe o preço: pedir um mais barato vem depois.'],
          ['カードで はらえますか', false, 'O cartão serve na hora de pagar, não para saber o preço.'],
        ],
      },
      { staff: 'せんごひゃく|えん です', pt: 'São 1.500 ienes.' },
      {
        you: [
          ['もっと やすいのは ありますか', true],
          ['ここまで おねがいします', false, 'Isso é para o motorista de táxi, com o endereço na mão.'],
          ['ふくろは いりません', false, 'Sacola é assunto da hora de pagar; agora você está olhando o preço.'],
        ],
      },
      { narrator: 'Você escolheu e foi ao caixa.' },
      { staff: 'ふくろ~は いります~か', pt: 'Precisa de sacola?' },
      {
        you: [
          ['ふくろは いりません', true],
          ['みてる だけです', false, 'Você já está comprando, não só olhando.'],
          ['ひとりです', false, 'Ele perguntou da sacola, não de quantas pessoas.'],
        ],
      },
      { narrator: 'Na hora de pagar, você quer usar o cartão.' },
      {
        you: [
          ['カードで はらえますか', true],
          ['おかいけい おねがいします', false, 'Esse é de restaurante, para pedir a conta da mesa.'],
          ['これは いくらですか', false, 'Você já sabe o preço. Agora a dúvida é como pagar.'],
        ],
      },
    ],
  },
  {
    id: 'estacao',
    title: 'Na estação',
    place: 'Transporte',
    intro: 'Você quer ir de trem a Shinjuku. Escolha o que dizer na estação e dentro do trem.',
    turns: [
      { narrator: 'Você chega a uma estação em Tóquio e precisa de um bilhete.' },
      {
        you: [
          ['きっぷは どこで かえますか', true],
          ['チェックイン おねがいします', false, 'Isso é de hotel, para chegar e fazer o registro.'],
          ['ここまで おねがいします', false, 'Isso é para o motorista de táxi, não para comprar bilhete.'],
        ],
      },
      { staff: 'きっぷ~は あそこ~の きかい~で かえます', pt: 'Os bilhetes se compram naquela máquina ali.' },
      {
        you: [
          ['ありがとうございます', true],
          ['ごちそうさまでした', false, 'Esse é de refeição. Aqui você só agradece a informação.'],
          ['ひとりです', false, 'Ninguém perguntou quantas pessoas.'],
        ],
      },
      { narrator: 'Você comprou o bilhete e está na plataforma. Quer confirmar o trem.' },
      {
        you: [
          ['この でんしゃは しんじゅくに いきますか', true],
          ['つぎの えきは なんですか', false, 'Boa pergunta, mas serve dentro do trem. Antes confirme se este é o trem certo.'],
          ['えきは どこですか', false, 'Você já está na estação, na plataforma.'],
        ],
      },
      { staff: 'はい しんじゅく~に いきます', pt: 'Sim, vai para Shinjuku.' },
      {
        you: [
          ['ありがとうございます', true],
          ['わかりません', false, 'Ele respondeu com clareza: sim. Não há o que não entender.'],
          ['いただきます', false, 'Esse é de refeição, para antes de comer.'],
        ],
      },
      { narrator: 'Dentro do trem, você quer saber onde descer.' },
      {
        you: [
          ['つぎの えきは なんですか', true],
          ['きっぷは どこで かえますか', false, 'Você já tem o bilhete e já está no trem.'],
          ['えきは どこですか', false, 'Você já está dentro do trem, na estação.'],
        ],
      },
    ],
  },
  {
    id: 'hotel',
    title: 'No hotel',
    place: 'Hotel',
    intro: 'Você chega ao hotel depois de um dia longo. Escolha o que dizer na recepção.',
    turns: [
      { narrator: 'Você chega à recepção do hotel.' },
      { staff: 'いらっしゃいませ', pt: 'Bem-vindo!' },
      {
        you: [
          ['チェックイン おねがいします', true],
          ['ごちそうさまでした', false, 'Esse se diz ao terminar de comer, não ao chegar.'],
          ['みてる だけです', false, 'Esse é de loja, para quando você só está olhando.'],
        ],
      },
      { staff: 'ごよやく~は あります~か', pt: 'Você tem reserva?' },
      {
        you: [
          ['よやくして います', true],
          ['ひとりです', false, 'Ele perguntou da reserva, não de quantas pessoas.'],
          ['みちに まよいました', false, 'Isso quer dizer que você está perdido. A pergunta era sobre a reserva.'],
        ],
      },
      { narrator: 'O quarto ainda não está pronto, mas você quer deixar a mala.' },
      {
        you: [
          ['にもつを あずかって もらえますか', true],
          ['ここまで おねがいします', false, 'Isso é para o motorista de táxi, com o endereço na mão.'],
          ['ふくろは いりません', false, 'Isso é de loja, sobre a sacola da compra.'],
        ],
      },
      { narrator: 'Você quer usar a internet no quarto.' },
      {
        you: [
          ['ワイファイの パスワードは なんですか', true],
          ['トイレは どこですか', false, 'É útil, mas a dúvida agora é sobre a internet.'],
          ['おすすめは なんですか', false, 'Essa pergunta é de restaurante, para saber o que pedir.'],
        ],
      },
    ],
  },
];
