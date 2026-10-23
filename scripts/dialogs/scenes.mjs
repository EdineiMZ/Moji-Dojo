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
  {
    id: 'aeroporto',
    title: 'Na imigração',
    place: 'Aeroporto',
    intro: 'Você acabou de pousar no Japão. Responda ao oficial da imigração e depois procure a sua bagagem.',
    turns: [
      { narrator: 'Você está na fila da imigração, e chega a sua vez.' },
      { staff: 'パスポート~を おねがいします', pt: 'O seu passaporte, por favor.' },
      {
        you: [
          ['パスポートを どうぞ', true],
          ['ちょっと まって ください', false, 'Pedir para esperar não entrega o passaporte que ele acabou de pedir.'],
          ['はじめまして', false, 'É um cumprimento de primeiro encontro. Aqui ele quer ver o seu passaporte.'],
        ],
      },
      { staff: 'りょこう~の もくてき~は なん です~か', pt: 'Qual é o motivo da viagem?' },
      {
        you: [
          ['りょこうの もくてきは かんこう です', true],
          ['ホテルは とうきょう です', false, 'Isso diz onde é o hotel, não o motivo da viagem.'],
          ['おしごとは なん ですか', false, 'Isso é perguntar a profissão dele. Ele quer saber a sua razão de estar no Japão.'],
        ],
      },
      { staff: 'どのくらい います~か', pt: 'Quanto tempo vai ficar?' },
      {
        you: [
          ['いっしゅうかん ほど います', true],
          ['いま なんじ ですか', false, 'Perguntar as horas não responde quanto tempo você fica.'],
          ['ブラジルじん です', false, 'A nacionalidade ele já viu no passaporte. A pergunta era sobre o tempo de estadia.'],
        ],
      },
      { staff: 'ホテル~は どこ です~か', pt: 'Onde fica o seu hotel?' },
      {
        you: [
          ['ホテルは とうきょう です', true],
          ['ゲートは どこ ですか', false, 'Ele perguntou do seu hotel, e o portão é de onde sai o avião.'],
          ['ちかくに えきは ありますか', false, 'Essa é uma pergunta sua sobre a estação. Ele quer saber onde você vai ficar.'],
        ],
      },
      { narrator: 'Você passou pela imigração e agora procura a sua mala.' },
      {
        you: [
          ['にもつは どこで うけとりますか', true],
          ['りょうがえは どこで できますか', false, 'Câmbio é útil, mas primeiro você precisa pegar a mala.'],
          ['タクシーを よんで ください', false, 'O táxi vem depois de pegar a bagagem.'],
        ],
      },
    ],
  },
  {
    id: 'taxi',
    title: 'No táxi',
    place: 'Transporte',
    intro: 'Você sai do hotel de táxi com o endereço do próximo destino no celular.',
    turns: [
      { narrator: 'Você está no hotel e precisa de um táxi.' },
      {
        you: [
          ['タクシーを よんで もらえますか', true],
          ['ここで おります', false, 'Isso se diz ao chegar, quando já está no carro.'],
          ['エアコンが こわれて います', false, 'É um problema de quarto, não um pedido de táxi.'],
        ],
      },
      { narrator: 'O táxi chegou e você entra.' },
      { staff: 'どちら~まで です~か', pt: 'Para onde vai?' },
      {
        you: [
          ['ここまで おねがいします', true],
          ['ここで とめて ください', false, 'Ainda não saiu: o motorista quer saber o destino.'],
          ['いくら ですか', false, 'O preço será dito no fim. Agora ele pergunta o destino.'],
        ],
      },
      { narrator: 'Você chegou perto do lugar certo e quer descer.' },
      {
        you: [
          ['ここで とめて ください', true],
          ['ここまで おねがいします', false, 'O destino já foi dito no começo. Agora é hora de pedir para parar.'],
          ['タクシーを よんで ください', false, 'Você já está dentro do táxi.'],
        ],
      },
      { staff: 'せんはっぴゃく|えん です', pt: 'São 1.800 ienes.' },
      {
        you: [
          ['クレジットカードは つかえますか', true],
          ['たかい です', false, 'Pode até ser, mas dizer só isso ao motorista não resolve o pagamento.'],
          ['レシートは いりません', false, 'O recibo vem depois de pagar. Primeiro veja como pagar.'],
        ],
      },
    ],
  },
  {
    id: 'conbini',
    title: 'No conbini',
    place: 'Conbini',
    intro: 'Você compra uma refeição pronta numa loja de conveniência, aberta a qualquer hora.',
    turns: [
      { narrator: 'Você leva uma marmita ao caixa.' },
      { staff: 'いらっしゃいませ ふくろ~は いります~か', pt: 'Bem-vindo! Precisa de sacola?' },
      {
        you: [
          ['ふくろは いりません', true],
          ['ふくろを ください', false, 'Seria uma resposta possível se você quisesse sacola, mas aqui a ideia é recusar.'],
          ['みてる だけです', false, 'Você já está no caixa, comprando.'],
        ],
      },
      { staff: 'あたためます~か', pt: 'Quer que eu esquente?' },
      {
        you: [
          ['あたためて ください', true],
          ['おかわりを ください', false, 'Esse é de restaurante, para pedir mais uma porção.'],
          ['わかりません', false, 'A pergunta é simples: esquentar ou não. Você sabe o que quer.'],
        ],
      },
      { staff: 'おはし~は いります~か', pt: 'Precisa de pauzinhos (hashi)?' },
      {
        you: [
          ['おはしを ください', true],
          ['スプーンを ください', false, 'A colher serviria para outro tipo de comida; ele ofereceu hashi e você vai comer com pauzinhos.'],
          ['ごちそうさまでした', false, 'Esse se diz depois de comer, e você ainda não comeu.'],
        ],
      },
      { staff: 'ポイントカード~は ありますか', pt: 'Tem cartão de pontos?' },
      {
        you: [
          ['ポイントカードは ありません', true],
          ['レシートを ください', false, 'O recibo não responde se você tem cartão de pontos.'],
          ['ひとりです', false, 'Ele perguntou sobre o cartão, não de quantas pessoas.'],
        ],
      },
      { narrator: 'Você pagou e ele estende o recibo, mas você não precisa dele.' },
      {
        you: [
          ['レシートは いりません', true],
          ['レシートを ください', false, 'Isso seria pedir o recibo, e você quer recusá-lo.'],
          ['ふくろは いりません', false, 'A sacola já foi tratada. Agora é o recibo.'],
        ],
      },
    ],
  },
  {
    id: 'michi',
    title: 'Pedindo o caminho',
    place: 'Direções',
    intro: 'Você está perdido no meio da cidade e pergunta o caminho a uma pessoa na rua.',
    turns: [
      { narrator: 'Você precisa chamar a atenção de uma pessoa na rua.' },
      {
        you: [
          ['すみません', true],
          ['はじめまして', false, 'Esse é para se apresentar. Para chamar alguém na rua, use すみません.'],
          ['さようなら', false, 'É uma despedida, e você está começando a conversa.'],
        ],
      },
      { staff: 'はい なん です~か', pt: 'Sim, o que foi?' },
      {
        you: [
          ['みちに まよいました', true],
          ['たのしかった です', false, 'Isso se diz depois de uma atividade divertida.'],
          ['ごめんなさい', false, 'Pedir desculpas não explica o que você precisa.'],
        ],
      },
      { narrator: 'Você quer saber se há uma estação por perto.' },
      {
        you: [
          ['ちかくに えきは ありますか', true],
          ['ここから とおい ですか', false, 'Você ainda não sabe se há estação; primeiro pergunte se existe.'],
          ['アレルギーが あります', false, 'Esse assunto não tem nada a ver com pedir o caminho.'],
        ],
      },
      { staff: 'あそこ~の かど~を みぎ~に まがって ください', pt: 'Vire à direita naquela esquina.' },
      {
        you: [
          ['わかりました', true],
          ['わかりません', false, 'Ele foi claro. Se tivesse dúvida, aí sim, mas aqui você entendeu.'],
          ['みぎに まがって ください', false, 'Você é quem vai virar; esse pedido é para outra pessoa (um motorista, por exemplo).'],
        ],
      },
      { narrator: 'Você quer saber se é longe a pé.' },
      {
        you: [
          ['あるいて なんぷん ですか', true],
          ['いくら ですか', false, 'Isso é sobre preço, e você pergunta o tempo de caminhada.'],
          ['なんじまで ですか', false, 'Isso é sobre horário de funcionamento. Aqui é distância.'],
        ],
      },
      { staff: 'ごふん ぐらい です', pt: 'Uns cinco minutos.' },
      {
        you: [
          ['ありがとうございます', true],
          ['どういたしまして', false, 'Esse é a resposta de quem recebe o agradecimento, e quem agradece aqui é você.'],
          ['ごちそうさまでした', false, 'Esse é de refeição.'],
        ],
      },
    ],
  },
  {
    id: 'yakkyoku',
    title: 'Na farmácia',
    place: 'Saúde',
    intro: 'Você não está se sentindo bem e vai a uma farmácia explicar o que sente.',
    turns: [
      { narrator: 'Você entra numa farmácia e pergunta se há remédio.' },
      {
        you: [
          ['くすりは ありますか', true],
          ['やっきょくは どこ ですか', false, 'Você já está na farmácia.'],
          ['ためして も いい ですか', false, 'Esse é de loja de roupa. Aqui você precisa de remédio.'],
        ],
      },
      { staff: 'どう しました~か', pt: 'O que aconteceu? / O que está sentindo?' },
      {
        you: [
          ['あたまが いたい です', true],
          ['おなかが すきました', false, 'Fome não é problema de saúde para a farmácia.'],
          ['たのしかった です', false, 'Não explica o que você sente.'],
        ],
      },
      { staff: 'ねつ~は ありますか', pt: 'Tem febre?' },
      {
        you: [
          ['ねつが あります', true],
          ['のどが かわきました', false, 'Ele perguntou da febre, não da sede.'],
          ['アレルギーが あります', false, 'Esse é sobre alergia. A pergunta é sobre febre.'],
        ],
      },
      { staff: 'アレルギー~は ありますか', pt: 'Tem alguma alergia?' },
      {
        you: [
          ['アレルギーが あります', true],
          ['ねつが あります', false, 'A febre você já mencionou. A pergunta agora é sobre alergia.'],
          ['ちょっと まって ください', false, 'Ele precisa da resposta para dar o remédio certo.'],
        ],
      },
      { narrator: 'Você quer saber quanto custa o remédio.' },
      {
        you: [
          ['いくら ですか', true],
          ['ぜんぶで いくら ですか', false, 'Esse serve para somar várias compras. Aqui é uma coisa só.'],
          ['なにが おいしい ですか', false, 'Essa é uma pergunta de restaurante.'],
        ],
      },
    ],
  },
  {
    id: 'yofuku',
    title: 'Comprando roupa',
    place: 'Compras',
    intro: 'Você quer comprar uma camiseta de presente e precisa experimentar e escolher.',
    turns: [
      { narrator: 'Você viu uma camiseta e quer olhar de perto.' },
      {
        you: [
          ['これを みせて ください', true],
          ['これを ください', false, 'Isso é para comprar. Você ainda quer apenas ver a peça.'],
          ['おもちかえりで おねがいします', false, 'Esse é de restaurante, para levar a comida.'],
        ],
      },
      { narrator: 'Você quer ver como fica em você.' },
      {
        you: [
          ['ためして も いい ですか', true],
          ['しゃしんを とって も いい ですか', false, 'Esse é para tirar foto. Aqui você quer vestir a peça.'],
          ['いくら ですか', false, 'O preço vem depois de decidir se serve.'],
        ],
      },
      { narrator: 'A camiseta ficou apertada.' },
      {
        you: [
          ['もっと おおきい のは ありますか', true],
          ['もっと ちいさい のは ありますか', false, 'Se ficou apertada, você precisa de um tamanho maior, não menor.'],
          ['ほかの いろは ありますか', false, 'O problema é o tamanho, não a cor.'],
        ],
      },
      { narrator: 'O tamanho maior serviu e você decide levar.' },
      {
        you: [
          ['これを ください', true],
          ['さようなら', false, 'Ainda não: você vai comprar a camiseta.'],
          ['これを みせて ください', false, 'Você já viu a peça e já experimentou.'],
        ],
      },
      { narrator: 'Na hora de pagar, você diz que é para presente.' },
      {
        you: [
          ['プレゼント です', true],
          ['レシートは いりません', false, 'Isso trata do recibo. O que você quer dizer agora é que é um presente.'],
          ['ふくろを ください', false, 'Pedir sacola é outra coisa: aqui o aviso é que se trata de um presente.'],
        ],
      },
      { narrator: 'Agora você pede para embrulhar.' },
      {
        you: [
          ['つつんで ください', true],
          ['あたためて ください', false, 'Esse é de conbini, para esquentar comida.'],
          ['おかわりを ください', false, 'Esse é de restaurante.'],
        ],
      },
    ],
  },
  {
    id: 'hajimete',
    title: 'Conhecendo alguém',
    place: 'Apresentação',
    intro: 'Você conhece uma pessoa simpática no Japão. Responda com educação e comece uma conversa.',
    turns: [
      { narrator: 'Alguém se aproxima e se apresenta.' },
      { staff: 'はじめまして', pt: 'Muito prazer.' },
      {
        you: [
          ['はじめまして', true],
          ['さようなら', false, 'É uma despedida, e vocês acabaram de se conhecer.'],
          ['おやすみなさい', false, 'Esse é para quem vai dormir.'],
        ],
      },
      { narrator: 'Agora você se apresenta.' },
      {
        you: [
          ['わたしの なまえは ジョアン です', true],
          ['これは わたしの です', false, 'Isso fala de um objeto seu. Você quer dizer o seu nome.'],
          ['げんき です', false, 'Isso diz que você está bem, mas ele ainda não sabe o seu nome.'],
        ],
      },
      { narrator: 'Para terminar a apresentação, você pede cordialidade.' },
      {
        you: [
          ['よろしく おねがいします', true],
          ['どういたしまして', false, 'É a resposta a um agradecimento, e ninguém agradeceu.'],
          ['ごめんなさい', false, 'Nada a pedir desculpas aqui.'],
        ],
      },
      { staff: 'どちら~から きました~か', pt: 'De onde você veio?' },
      {
        you: [
          ['ブラジルから きました', true],
          ['ブラジルじん です', false, 'Também fala da origem, mas a pergunta é de onde você veio: a resposta natural é ブラジルから きました.'],
          ['りょこうで きました', false, 'Isso responde o motivo da vinda, não de onde veio.'],
        ],
      },
      { staff: 'にほん~は はじめて です~か', pt: 'É a sua primeira vez no Japão?' },
      {
        you: [
          ['にほんは はじめて です', true],
          ['にほんが すき です', false, 'Pode até ser verdade, mas a pergunta é se é a primeira vez.'],
          ['わかりません', false, 'Você sabe: é só dizer que é a primeira vez.'],
        ],
      },
      { staff: 'にほん~は どう です~か', pt: 'O que está achando do Japão?' },
      {
        you: [
          ['にほんが すき です', true],
          ['にほんは はじめて です', false, 'Você já disse isso. Agora ele pergunta o que você acha.'],
          ['たかい です', false, 'Falaria só do preço; ele quer a sua impressão do país.'],
        ],
      },
    ],
  },
  {
    id: 'izakaya',
    title: 'No bar japonês',
    place: 'Restaurante',
    intro: 'Você vai a um izakaya, o bar japonês, com um amigo e quer pedir bebida e comida.',
    turns: [
      { narrator: 'Vocês são dois e o atendente se aproxima.' },
      { staff: 'いらっしゃいませ なんめいさま です~か', pt: 'Bem-vindos! Quantas pessoas?' },
      {
        you: [
          ['ふたり です', true],
          ['ひとりです', false, 'Vocês são dois, não uma pessoa só.'],
          ['さんにん です', false, 'Vocês são dois, não três.'],
        ],
      },
      { narrator: 'Sentados, vocês querem uma cerveja.' },
      {
        you: [
          ['ビールを ください', true],
          ['おちゃを ください', false, 'Chá é bebida de refeição, mas vocês queriam cerveja.'],
          ['ちゅうもんを おねがいします', false, 'Esse é para fazer o pedido depois. Aqui vocês dizem a bebida.'],
        ],
      },
      { narrator: 'Você não conhece um prato do cardápio.' },
      {
        you: [
          ['これは なん ですか', true],
          ['いただきます', false, 'Esse se diz quando a comida chega.'],
          ['わりかんで おねがいします', false, 'Dividir a conta é para o fim.'],
        ],
      },
      { narrator: 'Você não aguenta comida muito picante.' },
      {
        you: [
          ['からくない のは ありますか', true],
          ['さかなが たべられません', false, 'Seria pedir para evitar peixe, e a sua questão é a pimenta.'],
          ['おかわりを ください', false, 'Esse é para pedir mais uma. Aqui é sobre o tempero.'],
        ],
      },
      { narrator: 'A cerveja acabou e vocês querem mais uma.' },
      {
        you: [
          ['おかわりを ください', true],
          ['おいしかった です', false, 'Fala de algo que já passou. Vocês querem mais.'],
          ['これは なん ですか', false, 'Vocês já sabem o que é: querem repetir.'],
        ],
      },
      { narrator: 'Hora de pagar: vocês querem dividir.' },
      {
        you: [
          ['わりかんで おねがいします', true],
          ['レシートを ください', false, 'O recibo vem depois. Primeiro, como dividir a conta.'],
          ['おもちかえりで おねがいします', false, 'Esse é para levar comida embora.'],
        ],
      },
    ],
  },
  {
    id: 'hotel-problema',
    title: 'Problema no quarto',
    place: 'Hotel',
    intro: 'Algo deu errado no seu quarto de hotel, e você precisa explicar na recepção.',
    turns: [
      { narrator: 'Você volta ao hotel e vê que o ar-condicionado não funciona.' },
      { staff: 'どう されました~か', pt: 'O que houve?' },
      {
        you: [
          ['エアコンが こわれて います', true],
          ['カギを なくしました', false, 'Isso seria sobre a chave, e o problema é o ar-condicionado.'],
          ['おゆが でません', false, 'Seria sobre água quente, e o problema é o ar-condicionado.'],
        ],
      },
      { staff: 'もうしわけ ございません', pt: 'Sinto muito.' },
      {
        you: [
          ['へやを かえて もらえますか', true],
          ['チェックアウトは なんじ ですか', false, 'Você quer resolver o problema, não saber a hora de sair.'],
          ['ごちそうさまでした', false, 'Esse é de refeição.'],
        ],
      },
      { narrator: 'Você também precisa de mais uma toalha.' },
      {
        you: [
          ['タオルを もう ひとつ ください', true],
          ['ふくろを ください', false, 'Sacola é coisa de loja; você precisa de toalha.'],
          ['スプーンを ください', false, 'Uma colher não resolve a falta de toalha.'],
        ],
      },
      { narrator: 'Você quer saber o horário do café da manhã.' },
      {
        you: [
          ['あさごはんは なんじから ですか', true],
          ['チェックアウトは なんじ ですか', false, 'Esse é a hora de sair do quarto, não do café.'],
          ['いま なんじ ですか', false, 'Isso só diz que horas são agora.'],
        ],
      },
      { narrator: 'Por fim, você pergunta se ainda é possível ficar mais um dia.' },
      {
        you: [
          ['もう いちにち とまりたい です', true],
          ['もう いちど おねがいします', false, 'Isso pede para repetir a frase, não para ficar mais um dia.'],
          ['また あした', false, 'É uma despedida, não um pedido.'],
        ],
      },
    ],
  },
];
