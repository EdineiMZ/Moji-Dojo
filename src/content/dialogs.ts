// Gerado por `npm run build-dialogs` a partir de scripts/dialogs/scenes.mjs. Não edite à mão.
// As falas do aluno são frases de Viagem (src/data/travel.ts). As do atendente são frases fixas de atendimento,
// escritas para o app: precisam de revisão por quem fala japonês (ver src/content/LICENSE.md).

/** Uma resposta possível do aluno. As erradas dizem por que não servem naquele momento. */
export interface DialogOption {
  jp: string;
  romaji: string;
  pt: string;
  ok: boolean;
  why?: string;
}

export type DialogTurn =
  | { kind: 'narrator'; pt: string }
  | { kind: 'staff'; jp: string; romaji: string; pt: string }
  | { kind: 'you'; options: readonly DialogOption[] };

export interface DialogScene {
  id: string;
  title: string;
  /** Categoria de Viagem a que a cena se liga. */
  place: string;
  intro: string;
  turns: readonly DialogTurn[];
}

export const DIALOG_SCENES: readonly DialogScene[] = [
  {
    "id": "restaurante",
    "title": "No restaurante",
    "place": "Restaurante",
    "intro": "Você entra num restaurante em Tóquio, sozinho. Responda ao atendente com a frase certa para cada momento.",
    "turns": [
      {
        "kind": "narrator",
        "pt": "Você entra no restaurante."
      },
      {
        "kind": "staff",
        "jp": "いらっしゃいませ なんめいさま ですか",
        "romaji": "irasshaimase nanmeisama desu ka",
        "pt": "Bem-vindo! Quantas pessoas?"
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "ひとりです",
            "romaji": "hitori desu",
            "pt": "Sou só eu (mesa para um)",
            "ok": true
          },
          {
            "jp": "これを ください",
            "romaji": "kore o kudasai",
            "pt": "Quero isto, por favor",
            "ok": false,
            "why": "Isso é pedir um prato. O atendente perguntou quantas pessoas são."
          },
          {
            "jp": "ごちそうさまでした",
            "romaji": "gochisōsama deshita",
            "pt": "Dito depois de comer",
            "ok": false,
            "why": "Isso se diz ao terminar de comer, e você acabou de entrar."
          }
        ]
      },
      {
        "kind": "staff",
        "jp": "こちらへ どうぞ おのみものは いかが ですか",
        "romaji": "kochira e dōzo onomimono wa ikaga desu ka",
        "pt": "Por aqui, por favor. Aceita algo para beber?"
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "おみずを ください",
            "romaji": "omizu o kudasai",
            "pt": "Água, por favor",
            "ok": true
          },
          {
            "jp": "おかいけい おねがいします",
            "romaji": "okaikei onegaishimasu",
            "pt": "A conta, por favor",
            "ok": false,
            "why": "Pedir a conta agora seria cedo: você acabou de sentar."
          },
          {
            "jp": "ひとりです",
            "romaji": "hitori desu",
            "pt": "Sou só eu (mesa para um)",
            "ok": false,
            "why": "Ele já sabe disso. A pergunta agora é sobre bebida."
          }
        ]
      },
      {
        "kind": "staff",
        "jp": "ごちゅうもんは おきまり ですか",
        "romaji": "gochūmon wa okimari desu ka",
        "pt": "Já decidiu o pedido?"
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "これを ください",
            "romaji": "kore o kudasai",
            "pt": "Quero isto, por favor",
            "ok": true
          },
          {
            "jp": "いただきます",
            "romaji": "itadakimasu",
            "pt": "Dito antes de comer",
            "ok": false,
            "why": "Esse se diz quando a comida chega, antes de comer, e não para pedir."
          },
          {
            "jp": "メニューを ください",
            "romaji": "menyū o kudasai",
            "pt": "O cardápio, por favor",
            "ok": false,
            "why": "Você já está com o cardápio: ele perguntou se você já escolheu."
          }
        ]
      },
      {
        "kind": "narrator",
        "pt": "A comida chegou à mesa."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "いただきます",
            "romaji": "itadakimasu",
            "pt": "Dito antes de comer",
            "ok": true
          },
          {
            "jp": "ごちそうさまでした",
            "romaji": "gochisōsama deshita",
            "pt": "Dito depois de comer",
            "ok": false,
            "why": "Esse se diz depois de comer. Agora a comida acabou de chegar."
          },
          {
            "jp": "すみません",
            "romaji": "sumimasen",
            "pt": "Com licença / desculpe",
            "ok": false,
            "why": "Serve para chamar o atendente, e a comida já chegou."
          }
        ]
      },
      {
        "kind": "narrator",
        "pt": "Você terminou de comer."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "ごちそうさまでした",
            "romaji": "gochisōsama deshita",
            "pt": "Dito depois de comer",
            "ok": true
          },
          {
            "jp": "いただきます",
            "romaji": "itadakimasu",
            "pt": "Dito antes de comer",
            "ok": false,
            "why": "Esse se diz antes de comer. Você já terminou."
          },
          {
            "jp": "ひとりです",
            "romaji": "hitori desu",
            "pt": "Sou só eu (mesa para um)",
            "ok": false,
            "why": "Ninguém perguntou isso agora."
          }
        ]
      },
      {
        "kind": "narrator",
        "pt": "Agora você quer pagar."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "おかいけい おねがいします",
            "romaji": "okaikei onegaishimasu",
            "pt": "A conta, por favor",
            "ok": true
          },
          {
            "jp": "カードで はらえますか",
            "romaji": "kādo de haraemasu ka",
            "pt": "Posso pagar com cartão?",
            "ok": false,
            "why": "Boa pergunta, mas vem depois: primeiro peça a conta."
          },
          {
            "jp": "みてる だけです",
            "romaji": "miteru dake desu",
            "pt": "Só estou olhando",
            "ok": false,
            "why": "Esse é de loja, para quando você só está olhando."
          }
        ]
      }
    ]
  },
  {
    "id": "compras",
    "title": "Na loja",
    "place": "Compras",
    "intro": "Você entra numa loja de lembranças. Escolha o que dizer em cada momento da compra.",
    "turns": [
      {
        "kind": "narrator",
        "pt": "Você entra numa loja de lembranças."
      },
      {
        "kind": "staff",
        "jp": "いらっしゃいませ なにか おさがし ですか",
        "romaji": "irasshaimase nani ka osagashi desu ka",
        "pt": "Bem-vindo! Está procurando algo?"
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "みてる だけです",
            "romaji": "miteru dake desu",
            "pt": "Só estou olhando",
            "ok": true
          },
          {
            "jp": "ふくろは いりません",
            "romaji": "fukuro wa irimasen",
            "pt": "Não preciso de sacola",
            "ok": false,
            "why": "Você ainda não comprou nada: sacola é assunto da hora de pagar."
          },
          {
            "jp": "えきは どこですか",
            "romaji": "eki wa doko desu ka",
            "pt": "Onde fica a estação?",
            "ok": false,
            "why": "É uma pergunta útil, mas não responde se você procura algo."
          }
        ]
      },
      {
        "kind": "narrator",
        "pt": "Você pega uma camiseta e quer saber o preço."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "これは いくらですか",
            "romaji": "kore wa ikura desu ka",
            "pt": "Quanto custa isto?",
            "ok": true
          },
          {
            "jp": "もっと やすいのは ありますか",
            "romaji": "motto yasui no wa arimasu ka",
            "pt": "Tem algum mais barato?",
            "ok": false,
            "why": "Você ainda não sabe o preço: pedir um mais barato vem depois."
          },
          {
            "jp": "カードで はらえますか",
            "romaji": "kādo de haraemasu ka",
            "pt": "Posso pagar com cartão?",
            "ok": false,
            "why": "O cartão serve na hora de pagar, não para saber o preço."
          }
        ]
      },
      {
        "kind": "staff",
        "jp": "せんごひゃくえん です",
        "romaji": "sengohyaku en desu",
        "pt": "São 1.500 ienes."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "もっと やすいのは ありますか",
            "romaji": "motto yasui no wa arimasu ka",
            "pt": "Tem algum mais barato?",
            "ok": true
          },
          {
            "jp": "ここまで おねがいします",
            "romaji": "koko made onegaishimasu",
            "pt": "Até aqui, por favor (no táxi, mostrando o endereço)",
            "ok": false,
            "why": "Isso é para o motorista de táxi, com o endereço na mão."
          },
          {
            "jp": "ふくろは いりません",
            "romaji": "fukuro wa irimasen",
            "pt": "Não preciso de sacola",
            "ok": false,
            "why": "Sacola é assunto da hora de pagar; agora você está olhando o preço."
          }
        ]
      },
      {
        "kind": "narrator",
        "pt": "Você escolheu e foi ao caixa."
      },
      {
        "kind": "staff",
        "jp": "ふくろは ごりよう ですか",
        "romaji": "fukuro wa goriyō desu ka",
        "pt": "Vai querer sacola?"
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "ふくろは いりません",
            "romaji": "fukuro wa irimasen",
            "pt": "Não preciso de sacola",
            "ok": true
          },
          {
            "jp": "みてる だけです",
            "romaji": "miteru dake desu",
            "pt": "Só estou olhando",
            "ok": false,
            "why": "Você já está comprando, não só olhando."
          },
          {
            "jp": "ひとりです",
            "romaji": "hitori desu",
            "pt": "Sou só eu (mesa para um)",
            "ok": false,
            "why": "Ele perguntou da sacola, não de quantas pessoas."
          }
        ]
      },
      {
        "kind": "narrator",
        "pt": "Na hora de pagar, você quer usar o cartão."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "カードで はらえますか",
            "romaji": "kādo de haraemasu ka",
            "pt": "Posso pagar com cartão?",
            "ok": true
          },
          {
            "jp": "おかいけい おねがいします",
            "romaji": "okaikei onegaishimasu",
            "pt": "A conta, por favor",
            "ok": false,
            "why": "Esse é de restaurante, para pedir a conta da mesa."
          },
          {
            "jp": "これは いくらですか",
            "romaji": "kore wa ikura desu ka",
            "pt": "Quanto custa isto?",
            "ok": false,
            "why": "Você já sabe o preço. Agora a dúvida é como pagar."
          }
        ]
      }
    ]
  },
  {
    "id": "estacao",
    "title": "Na estação",
    "place": "Transporte",
    "intro": "Você quer ir de trem a Shinjuku. Escolha o que dizer na estação e dentro do trem.",
    "turns": [
      {
        "kind": "narrator",
        "pt": "Você chega a uma estação em Tóquio e precisa de um bilhete."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "きっぷは どこで かえますか",
            "romaji": "kippu wa doko de kaemasu ka",
            "pt": "Onde compro o bilhete?",
            "ok": true
          },
          {
            "jp": "チェックイン おねがいします",
            "romaji": "chekkuin onegaishimasu",
            "pt": "Check-in, por favor",
            "ok": false,
            "why": "Isso é de hotel, para chegar e fazer o registro."
          },
          {
            "jp": "ここまで おねがいします",
            "romaji": "koko made onegaishimasu",
            "pt": "Até aqui, por favor (no táxi, mostrando o endereço)",
            "ok": false,
            "why": "Isso é para o motorista de táxi, não para comprar bilhete."
          }
        ]
      },
      {
        "kind": "staff",
        "jp": "きっぷは あそこの きかいで かえます",
        "romaji": "kippu wa asoko no kikai de kaemasu",
        "pt": "Os bilhetes se compram naquela máquina ali."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "ありがとうございます",
            "romaji": "arigatō gozaimasu",
            "pt": "Muito obrigado",
            "ok": true
          },
          {
            "jp": "ごちそうさまでした",
            "romaji": "gochisōsama deshita",
            "pt": "Dito depois de comer",
            "ok": false,
            "why": "Esse é de refeição. Aqui você só agradece a informação."
          },
          {
            "jp": "ひとりです",
            "romaji": "hitori desu",
            "pt": "Sou só eu (mesa para um)",
            "ok": false,
            "why": "Ninguém perguntou quantas pessoas."
          }
        ]
      },
      {
        "kind": "narrator",
        "pt": "Você comprou o bilhete e está na plataforma. Quer confirmar o trem."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "この でんしゃは しんじゅくに いきますか",
            "romaji": "kono densha wa shinjuku ni ikimasu ka",
            "pt": "Este trem vai para Shinjuku?",
            "ok": true
          },
          {
            "jp": "つぎの えきは なんですか",
            "romaji": "tsugi no eki wa nan desu ka",
            "pt": "Qual é a próxima estação?",
            "ok": false,
            "why": "Boa pergunta, mas serve dentro do trem. Antes confirme se este é o trem certo."
          },
          {
            "jp": "えきは どこですか",
            "romaji": "eki wa doko desu ka",
            "pt": "Onde fica a estação?",
            "ok": false,
            "why": "Você já está na estação, na plataforma."
          }
        ]
      },
      {
        "kind": "staff",
        "jp": "はい しんじゅくに いきます",
        "romaji": "hai shinjuku ni ikimasu",
        "pt": "Sim, vai para Shinjuku."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "ありがとうございます",
            "romaji": "arigatō gozaimasu",
            "pt": "Muito obrigado",
            "ok": true
          },
          {
            "jp": "わかりません",
            "romaji": "wakarimasen",
            "pt": "Não entendo",
            "ok": false,
            "why": "Ele respondeu com clareza: sim. Não há o que não entender."
          },
          {
            "jp": "いただきます",
            "romaji": "itadakimasu",
            "pt": "Dito antes de comer",
            "ok": false,
            "why": "Esse é de refeição, para antes de comer."
          }
        ]
      },
      {
        "kind": "narrator",
        "pt": "Dentro do trem, você quer saber onde descer."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "つぎの えきは なんですか",
            "romaji": "tsugi no eki wa nan desu ka",
            "pt": "Qual é a próxima estação?",
            "ok": true
          },
          {
            "jp": "きっぷは どこで かえますか",
            "romaji": "kippu wa doko de kaemasu ka",
            "pt": "Onde compro o bilhete?",
            "ok": false,
            "why": "Você já tem o bilhete e já está no trem."
          },
          {
            "jp": "えきは どこですか",
            "romaji": "eki wa doko desu ka",
            "pt": "Onde fica a estação?",
            "ok": false,
            "why": "Você já está dentro do trem, na estação."
          }
        ]
      }
    ]
  },
  {
    "id": "hotel",
    "title": "No hotel",
    "place": "Hotel",
    "intro": "Você chega ao hotel depois de um dia longo. Escolha o que dizer na recepção.",
    "turns": [
      {
        "kind": "narrator",
        "pt": "Você chega à recepção do hotel."
      },
      {
        "kind": "staff",
        "jp": "いらっしゃいませ",
        "romaji": "irasshaimase",
        "pt": "Bem-vindo!"
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "チェックイン おねがいします",
            "romaji": "chekkuin onegaishimasu",
            "pt": "Check-in, por favor",
            "ok": true
          },
          {
            "jp": "ごちそうさまでした",
            "romaji": "gochisōsama deshita",
            "pt": "Dito depois de comer",
            "ok": false,
            "why": "Esse se diz ao terminar de comer, não ao chegar."
          },
          {
            "jp": "みてる だけです",
            "romaji": "miteru dake desu",
            "pt": "Só estou olhando",
            "ok": false,
            "why": "Esse é de loja, para quando você só está olhando."
          }
        ]
      },
      {
        "kind": "staff",
        "jp": "ごよやくは ありますか",
        "romaji": "goyoyaku wa arimasu ka",
        "pt": "Você tem reserva?"
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "よやくして います",
            "romaji": "yoyaku shite imasu",
            "pt": "Tenho reserva",
            "ok": true
          },
          {
            "jp": "ひとりです",
            "romaji": "hitori desu",
            "pt": "Sou só eu (mesa para um)",
            "ok": false,
            "why": "Ele perguntou da reserva, não de quantas pessoas."
          },
          {
            "jp": "みちに まよいました",
            "romaji": "michi ni mayoimashita",
            "pt": "Estou perdido",
            "ok": false,
            "why": "Isso quer dizer que você está perdido. A pergunta era sobre a reserva."
          }
        ]
      },
      {
        "kind": "narrator",
        "pt": "O quarto ainda não está pronto, mas você quer deixar a mala."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "にもつを あずかって もらえますか",
            "romaji": "nimotsu o azukatte moraemasu ka",
            "pt": "Pode guardar minha bagagem?",
            "ok": true
          },
          {
            "jp": "ここまで おねがいします",
            "romaji": "koko made onegaishimasu",
            "pt": "Até aqui, por favor (no táxi, mostrando o endereço)",
            "ok": false,
            "why": "Isso é para o motorista de táxi, com o endereço na mão."
          },
          {
            "jp": "ふくろは いりません",
            "romaji": "fukuro wa irimasen",
            "pt": "Não preciso de sacola",
            "ok": false,
            "why": "Isso é de loja, sobre a sacola da compra."
          }
        ]
      },
      {
        "kind": "narrator",
        "pt": "Você quer usar a internet no quarto."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "ワイファイの パスワードは なんですか",
            "romaji": "waifai no pasuwādo wa nan desu ka",
            "pt": "Qual é a senha do Wi-Fi?",
            "ok": true
          },
          {
            "jp": "トイレは どこですか",
            "romaji": "toire wa doko desu ka",
            "pt": "Onde fica o banheiro?",
            "ok": false,
            "why": "É útil, mas a dúvida agora é sobre a internet."
          },
          {
            "jp": "おすすめは なんですか",
            "romaji": "osusume wa nan desu ka",
            "pt": "O que você recomenda?",
            "ok": false,
            "why": "Essa pergunta é de restaurante, para saber o que pedir."
          }
        ]
      }
    ]
  },
  {
    "id": "aeroporto",
    "title": "Na imigração",
    "place": "Aeroporto",
    "intro": "Você acabou de pousar no Japão. Responda ao oficial da imigração e depois procure a sua bagagem.",
    "turns": [
      {
        "kind": "narrator",
        "pt": "Você está na fila da imigração, e chega a sua vez."
      },
      {
        "kind": "staff",
        "jp": "パスポートを おねがいします",
        "romaji": "pasupōto o onegaishimasu",
        "pt": "O seu passaporte, por favor."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "パスポートを どうぞ",
            "romaji": "pasupōto o dōzo",
            "pt": "Aqui está o meu passaporte",
            "ok": true
          },
          {
            "jp": "ちょっと まって ください",
            "romaji": "chotto matte kudasai",
            "pt": "Espere um pouco, por favor",
            "ok": false,
            "why": "Pedir para esperar não entrega o passaporte que ele acabou de pedir."
          },
          {
            "jp": "はじめまして",
            "romaji": "hajimemashite",
            "pt": "Prazer em conhecê-lo (primeiro encontro)",
            "ok": false,
            "why": "É um cumprimento de primeiro encontro. Aqui ele quer ver o seu passaporte."
          }
        ]
      },
      {
        "kind": "staff",
        "jp": "りょこうの もくてきは なん ですか",
        "romaji": "ryokō no mokuteki wa nan desu ka",
        "pt": "Qual é o motivo da viagem?"
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "りょこうの もくてきは かんこう です",
            "romaji": "ryokō no mokuteki wa kankō desu",
            "pt": "O motivo da viagem é turismo",
            "ok": true
          },
          {
            "jp": "ホテルは とうきょう です",
            "romaji": "hoteru wa tōkyō desu",
            "pt": "O hotel é em Tóquio",
            "ok": false,
            "why": "Isso diz onde é o hotel, não o motivo da viagem."
          },
          {
            "jp": "おしごとは なん ですか",
            "romaji": "oshigoto wa nan desu ka",
            "pt": "Qual é o seu trabalho?",
            "ok": false,
            "why": "Isso é perguntar a profissão dele. Ele quer saber a sua razão de estar no Japão."
          }
        ]
      },
      {
        "kind": "staff",
        "jp": "どのくらい たいざい しますか",
        "romaji": "donokurai taizai shimasu ka",
        "pt": "Quanto tempo vai ficar?"
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "いっしゅうかん ほど います",
            "romaji": "isshūkan hodo imasu",
            "pt": "Vou ficar cerca de uma semana",
            "ok": true
          },
          {
            "jp": "いま なんじ ですか",
            "romaji": "ima nanji desu ka",
            "pt": "Que horas são agora?",
            "ok": false,
            "why": "Perguntar as horas não responde quanto tempo você fica."
          },
          {
            "jp": "ブラジルじん です",
            "romaji": "burajirujin desu",
            "pt": "Sou brasileiro(a)",
            "ok": false,
            "why": "A nacionalidade ele já viu no passaporte. A pergunta era sobre o tempo de estadia."
          }
        ]
      },
      {
        "kind": "staff",
        "jp": "ホテルは どこ ですか",
        "romaji": "hoteru wa doko desu ka",
        "pt": "Onde fica o seu hotel?"
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "ホテルは とうきょう です",
            "romaji": "hoteru wa tōkyō desu",
            "pt": "O hotel é em Tóquio",
            "ok": true
          },
          {
            "jp": "ゲートは どこ ですか",
            "romaji": "gēto wa doko desu ka",
            "pt": "Onde fica o portão de embarque?",
            "ok": false,
            "why": "Ele perguntou do seu hotel, e o portão é de onde sai o avião."
          },
          {
            "jp": "ちかくに えきは ありますか",
            "romaji": "chikaku ni eki wa arimasuka",
            "pt": "Tem uma estação por perto?",
            "ok": false,
            "why": "Essa é uma pergunta sua sobre a estação. Ele quer saber onde você vai ficar."
          }
        ]
      },
      {
        "kind": "narrator",
        "pt": "Você passou pela imigração e agora procura a sua mala."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "にもつは どこで うけとれますか",
            "romaji": "nimotsu wa doko de uketoremasu ka",
            "pt": "Onde posso retirar a bagagem?",
            "ok": true
          },
          {
            "jp": "りょうがえは どこで できますか",
            "romaji": "ryōgae wa doko de dekimasu ka",
            "pt": "Onde posso trocar dinheiro?",
            "ok": false,
            "why": "Câmbio é útil, mas primeiro você precisa pegar a mala."
          },
          {
            "jp": "タクシーを よんで ください",
            "romaji": "takushī o yonde kudasai",
            "pt": "Chame um táxi, por favor",
            "ok": false,
            "why": "O táxi vem depois de pegar a bagagem."
          }
        ]
      }
    ]
  },
  {
    "id": "taxi",
    "title": "No táxi",
    "place": "Transporte",
    "intro": "Você sai do hotel de táxi com o endereço do próximo destino no celular.",
    "turns": [
      {
        "kind": "narrator",
        "pt": "Você está no hotel e precisa de um táxi."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "タクシーを よんで もらえますか",
            "romaji": "takushī o yonde moraemasuka",
            "pt": "Pode chamar um táxi para mim?",
            "ok": true
          },
          {
            "jp": "ここで おります",
            "romaji": "koko de orimasu",
            "pt": "Vou descer aqui",
            "ok": false,
            "why": "Isso se diz ao chegar, quando já está no carro."
          },
          {
            "jp": "エアコンが こわれて います",
            "romaji": "eakon ga kowarete imasu",
            "pt": "O ar-condicionado está quebrado",
            "ok": false,
            "why": "É um problema de quarto, não um pedido de táxi."
          }
        ]
      },
      {
        "kind": "narrator",
        "pt": "O táxi chegou e você entra."
      },
      {
        "kind": "staff",
        "jp": "どちらまで ですか",
        "romaji": "dochira made desu ka",
        "pt": "Para onde vai?"
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "ここまで おねがいします",
            "romaji": "koko made onegaishimasu",
            "pt": "Até aqui, por favor (no táxi, mostrando o endereço)",
            "ok": true
          },
          {
            "jp": "ここで とめて ください",
            "romaji": "koko de tomete kudasai",
            "pt": "Pare aqui, por favor",
            "ok": false,
            "why": "Ainda não saiu: o motorista quer saber o destino."
          },
          {
            "jp": "いくら ですか",
            "romaji": "ikura desu ka",
            "pt": "Quanto é?",
            "ok": false,
            "why": "O preço será dito no fim. Agora ele pergunta o destino."
          }
        ]
      },
      {
        "kind": "narrator",
        "pt": "Você chegou perto do lugar certo e quer descer."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "ここで とめて ください",
            "romaji": "koko de tomete kudasai",
            "pt": "Pare aqui, por favor",
            "ok": true
          },
          {
            "jp": "ここまで おねがいします",
            "romaji": "koko made onegaishimasu",
            "pt": "Até aqui, por favor (no táxi, mostrando o endereço)",
            "ok": false,
            "why": "O destino já foi dito no começo. Agora é hora de pedir para parar."
          },
          {
            "jp": "タクシーを よんで ください",
            "romaji": "takushī o yonde kudasai",
            "pt": "Chame um táxi, por favor",
            "ok": false,
            "why": "Você já está dentro do táxi."
          }
        ]
      },
      {
        "kind": "staff",
        "jp": "せんはっぴゃくえん です",
        "romaji": "senhappyaku en desu",
        "pt": "São 1.800 ienes."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "クレジットカードは つかえますか",
            "romaji": "kurejittokādo wa tsukaemasu ka",
            "pt": "Aceita cartão de crédito?",
            "ok": true
          },
          {
            "jp": "たかい です",
            "romaji": "takai desu",
            "pt": "É caro",
            "ok": false,
            "why": "Pode até ser, mas dizer só isso ao motorista não resolve o pagamento."
          },
          {
            "jp": "レシートは いりません",
            "romaji": "reshīto wa irimasen",
            "pt": "Não preciso do recibo",
            "ok": false,
            "why": "O recibo vem depois de pagar. Primeiro veja como pagar."
          }
        ]
      }
    ]
  },
  {
    "id": "conbini",
    "title": "No conbini",
    "place": "Conbini",
    "intro": "Você compra uma refeição pronta numa loja de conveniência, aberta a qualquer hora.",
    "turns": [
      {
        "kind": "narrator",
        "pt": "Você leva uma marmita ao caixa."
      },
      {
        "kind": "staff",
        "jp": "いらっしゃいませ ふくろは ごりよう ですか",
        "romaji": "irasshaimase fukuro wa goriyō desu ka",
        "pt": "Bem-vindo! Vai querer sacola?"
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "ふくろは いりません",
            "romaji": "fukuro wa irimasen",
            "pt": "Não preciso de sacola",
            "ok": true
          },
          {
            "jp": "ふくろを ください",
            "romaji": "fukuro o kudasai",
            "pt": "Pode me dar uma sacola?",
            "ok": false,
            "why": "Seria uma resposta possível se você quisesse sacola, mas aqui a ideia é recusar."
          },
          {
            "jp": "みてる だけです",
            "romaji": "miteru dake desu",
            "pt": "Só estou olhando",
            "ok": false,
            "why": "Você já está no caixa, comprando."
          }
        ]
      },
      {
        "kind": "staff",
        "jp": "あたためますか",
        "romaji": "atatamemasu ka",
        "pt": "Quer que eu esquente?"
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "あたためて ください",
            "romaji": "atatamete kudasai",
            "pt": "Pode esquentar, por favor?",
            "ok": true
          },
          {
            "jp": "おかわりを ください",
            "romaji": "okawari o kudasai",
            "pt": "Mais um (refil), por favor",
            "ok": false,
            "why": "Esse é de restaurante, para pedir mais uma porção."
          },
          {
            "jp": "わかりません",
            "romaji": "wakarimasen",
            "pt": "Não entendo",
            "ok": false,
            "why": "A pergunta é simples: esquentar ou não. Você sabe o que quer."
          }
        ]
      },
      {
        "kind": "staff",
        "jp": "おはしは おつけ しますか",
        "romaji": "ohashi wa otsuke shimasu ka",
        "pt": "Quer que eu coloque pauzinhos (hashi)?"
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "おはしを ください",
            "romaji": "ohashi o kudasai",
            "pt": "Pode dar hashi (pauzinhos)?",
            "ok": true
          },
          {
            "jp": "スプーンを ください",
            "romaji": "supūn o kudasai",
            "pt": "Pode dar uma colher?",
            "ok": false,
            "why": "A colher serviria para outro tipo de comida; ele ofereceu hashi e você vai comer com pauzinhos."
          },
          {
            "jp": "ごちそうさまでした",
            "romaji": "gochisōsama deshita",
            "pt": "Dito depois de comer",
            "ok": false,
            "why": "Esse se diz depois de comer, e você ainda não comeu."
          }
        ]
      },
      {
        "kind": "staff",
        "jp": "ポイントカードは おもち ですか",
        "romaji": "pointokādo wa omochi desu ka",
        "pt": "Tem cartão de pontos?"
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "ポイントカードは ありません",
            "romaji": "pointokādo wa arimasen",
            "pt": "Não tenho cartão de pontos",
            "ok": true
          },
          {
            "jp": "レシートを ください",
            "romaji": "reshīto o kudasai",
            "pt": "O recibo, por favor",
            "ok": false,
            "why": "O recibo não responde se você tem cartão de pontos."
          },
          {
            "jp": "ひとりです",
            "romaji": "hitori desu",
            "pt": "Sou só eu (mesa para um)",
            "ok": false,
            "why": "Ele perguntou sobre o cartão, não de quantas pessoas."
          }
        ]
      },
      {
        "kind": "narrator",
        "pt": "Você pagou e ele estende o recibo, mas você não precisa dele."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "レシートは いりません",
            "romaji": "reshīto wa irimasen",
            "pt": "Não preciso do recibo",
            "ok": true
          },
          {
            "jp": "レシートを ください",
            "romaji": "reshīto o kudasai",
            "pt": "O recibo, por favor",
            "ok": false,
            "why": "Isso seria pedir o recibo, e você quer recusá-lo."
          },
          {
            "jp": "ふくろは いりません",
            "romaji": "fukuro wa irimasen",
            "pt": "Não preciso de sacola",
            "ok": false,
            "why": "A sacola já foi tratada. Agora é o recibo."
          }
        ]
      }
    ]
  },
  {
    "id": "michi",
    "title": "Pedindo o caminho",
    "place": "Direções",
    "intro": "Você está perdido no meio da cidade e pergunta o caminho a uma pessoa na rua.",
    "turns": [
      {
        "kind": "narrator",
        "pt": "Você precisa chamar a atenção de uma pessoa na rua."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "すみません",
            "romaji": "sumimasen",
            "pt": "Com licença / desculpe",
            "ok": true
          },
          {
            "jp": "はじめまして",
            "romaji": "hajimemashite",
            "pt": "Prazer em conhecê-lo (primeiro encontro)",
            "ok": false,
            "why": "Esse é para se apresentar. Para chamar alguém na rua, use すみません."
          },
          {
            "jp": "さようなら",
            "romaji": "sayōnara",
            "pt": "Tchau (despedida)",
            "ok": false,
            "why": "É uma despedida, e você está começando a conversa."
          }
        ]
      },
      {
        "kind": "staff",
        "jp": "はい なん ですか",
        "romaji": "hai nan desu ka",
        "pt": "Sim, o que foi?"
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "みちに まよいました",
            "romaji": "michi ni mayoimashita",
            "pt": "Estou perdido",
            "ok": true
          },
          {
            "jp": "たのしかった です",
            "romaji": "tanoshikatta desu",
            "pt": "Foi divertido",
            "ok": false,
            "why": "Isso se diz depois de uma atividade divertida."
          },
          {
            "jp": "ごめんなさい",
            "romaji": "gomennasai",
            "pt": "Desculpe (mais pessoal que すみません)",
            "ok": false,
            "why": "Pedir desculpas não explica o que você precisa."
          }
        ]
      },
      {
        "kind": "narrator",
        "pt": "Você quer saber se há uma estação por perto."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "ちかくに えきは ありますか",
            "romaji": "chikaku ni eki wa arimasuka",
            "pt": "Tem uma estação por perto?",
            "ok": true
          },
          {
            "jp": "ここから とおい ですか",
            "romaji": "koko kara tōi desu ka",
            "pt": "É longe daqui?",
            "ok": false,
            "why": "Você ainda não sabe se há estação; primeiro pergunte se existe."
          },
          {
            "jp": "アレルギーが あります",
            "romaji": "arerugī ga arimasu",
            "pt": "Tenho alergia",
            "ok": false,
            "why": "Esse assunto não tem nada a ver com pedir o caminho."
          }
        ]
      },
      {
        "kind": "staff",
        "jp": "あそこの かどを みぎに まがって ください",
        "romaji": "asoko no kado o migi ni magatte kudasai",
        "pt": "Vire à direita naquela esquina."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "わかりました",
            "romaji": "wakarimashita",
            "pt": "Entendi",
            "ok": true
          },
          {
            "jp": "わかりません",
            "romaji": "wakarimasen",
            "pt": "Não entendo",
            "ok": false,
            "why": "Ele foi claro. Se tivesse dúvida, aí sim, mas aqui você entendeu."
          },
          {
            "jp": "みぎに まがって ください",
            "romaji": "migi ni magatte kudasai",
            "pt": "Vire à direita, por favor",
            "ok": false,
            "why": "Você é quem vai virar; esse pedido é para outra pessoa (um motorista, por exemplo)."
          }
        ]
      },
      {
        "kind": "narrator",
        "pt": "Você quer saber se é longe a pé."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "あるいて なんぷん ですか",
            "romaji": "aruite nanpun desu ka",
            "pt": "Quantos minutos a pé?",
            "ok": true
          },
          {
            "jp": "いくら ですか",
            "romaji": "ikura desu ka",
            "pt": "Quanto é?",
            "ok": false,
            "why": "Isso é sobre preço, e você pergunta o tempo de caminhada."
          },
          {
            "jp": "なんじまで ですか",
            "romaji": "nanji made desu ka",
            "pt": "Até que horas?",
            "ok": false,
            "why": "Isso é sobre horário de funcionamento. Aqui é distância."
          }
        ]
      },
      {
        "kind": "staff",
        "jp": "ごふん ぐらい です",
        "romaji": "gofun gurai desu",
        "pt": "Uns cinco minutos."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "ありがとうございます",
            "romaji": "arigatō gozaimasu",
            "pt": "Muito obrigado",
            "ok": true
          },
          {
            "jp": "どういたしまして",
            "romaji": "dōitashimashite",
            "pt": "De nada",
            "ok": false,
            "why": "Esse é a resposta de quem recebe o agradecimento, e quem agradece aqui é você."
          },
          {
            "jp": "ごちそうさまでした",
            "romaji": "gochisōsama deshita",
            "pt": "Dito depois de comer",
            "ok": false,
            "why": "Esse é de refeição."
          }
        ]
      }
    ]
  },
  {
    "id": "yakkyoku",
    "title": "Na farmácia",
    "place": "Saúde",
    "intro": "Você não está se sentindo bem e vai a uma farmácia explicar o que sente.",
    "turns": [
      {
        "kind": "narrator",
        "pt": "Você entra numa farmácia e pergunta se há remédio."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "くすりは ありますか",
            "romaji": "kusuri wa arimasuka",
            "pt": "Tem remédio (para isto)?",
            "ok": true
          },
          {
            "jp": "やっきょくは どこ ですか",
            "romaji": "yakkyoku wa doko desu ka",
            "pt": "Onde fica a farmácia?",
            "ok": false,
            "why": "Você já está na farmácia."
          },
          {
            "jp": "ためして も いい ですか",
            "romaji": "tameshite mo ii desu ka",
            "pt": "Posso experimentar?",
            "ok": false,
            "why": "Esse é de loja de roupa. Aqui você precisa de remédio."
          }
        ]
      },
      {
        "kind": "staff",
        "jp": "どう しましたか",
        "romaji": "dō shimashita ka",
        "pt": "O que aconteceu? / O que está sentindo?"
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "あたまが いたい です",
            "romaji": "atama ga itai desu",
            "pt": "Estou com dor de cabeça",
            "ok": true
          },
          {
            "jp": "おなかが すきました",
            "romaji": "onaka ga sukimashita",
            "pt": "Estou com fome",
            "ok": false,
            "why": "Fome não é problema de saúde para a farmácia."
          },
          {
            "jp": "たのしかった です",
            "romaji": "tanoshikatta desu",
            "pt": "Foi divertido",
            "ok": false,
            "why": "Não explica o que você sente."
          }
        ]
      },
      {
        "kind": "staff",
        "jp": "ねつは ありますか",
        "romaji": "netsu wa arimasuka",
        "pt": "Tem febre?"
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "ねつが あります",
            "romaji": "netsu ga arimasu",
            "pt": "Estou com febre",
            "ok": true
          },
          {
            "jp": "のどが かわきました",
            "romaji": "nodo ga kawakimashita",
            "pt": "Estou com sede",
            "ok": false,
            "why": "Ele perguntou da febre, não da sede."
          },
          {
            "jp": "アレルギーが あります",
            "romaji": "arerugī ga arimasu",
            "pt": "Tenho alergia",
            "ok": false,
            "why": "Esse é sobre alergia. A pergunta é sobre febre."
          }
        ]
      },
      {
        "kind": "staff",
        "jp": "アレルギーは ありますか",
        "romaji": "arerugī wa arimasuka",
        "pt": "Tem alguma alergia?"
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "アレルギーが あります",
            "romaji": "arerugī ga arimasu",
            "pt": "Tenho alergia",
            "ok": true
          },
          {
            "jp": "ねつが あります",
            "romaji": "netsu ga arimasu",
            "pt": "Estou com febre",
            "ok": false,
            "why": "A febre você já mencionou. A pergunta agora é sobre alergia."
          },
          {
            "jp": "ちょっと まって ください",
            "romaji": "chotto matte kudasai",
            "pt": "Espere um pouco, por favor",
            "ok": false,
            "why": "Ele precisa da resposta para dar o remédio certo."
          }
        ]
      },
      {
        "kind": "narrator",
        "pt": "Você quer saber quanto custa o remédio."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "いくら ですか",
            "romaji": "ikura desu ka",
            "pt": "Quanto é?",
            "ok": true
          },
          {
            "jp": "ぜんぶで いくら ですか",
            "romaji": "zenbu de ikura desu ka",
            "pt": "Quanto fica tudo?",
            "ok": false,
            "why": "Esse serve para somar várias compras. Aqui é uma coisa só."
          },
          {
            "jp": "なにが おいしい ですか",
            "romaji": "nani ga oishii desu ka",
            "pt": "O que é gostoso aqui?",
            "ok": false,
            "why": "Essa é uma pergunta de restaurante."
          }
        ]
      }
    ]
  },
  {
    "id": "yofuku",
    "title": "Comprando roupa",
    "place": "Compras",
    "intro": "Você quer comprar uma camiseta de presente e precisa experimentar e escolher.",
    "turns": [
      {
        "kind": "narrator",
        "pt": "Você viu uma camiseta e quer olhar de perto."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "これを みせて ください",
            "romaji": "kore o misete kudasai",
            "pt": "Pode me mostrar isto?",
            "ok": true
          },
          {
            "jp": "これを ください",
            "romaji": "kore o kudasai",
            "pt": "Quero isto, por favor",
            "ok": false,
            "why": "Isso é para comprar. Você ainda quer apenas ver a peça."
          },
          {
            "jp": "おもちかえりで おねがいします",
            "romaji": "omochikaeri de onegaishimasu",
            "pt": "Para levar, por favor",
            "ok": false,
            "why": "Esse é de restaurante, para levar a comida."
          }
        ]
      },
      {
        "kind": "narrator",
        "pt": "Você quer ver como fica em você."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "ためして も いい ですか",
            "romaji": "tameshite mo ii desu ka",
            "pt": "Posso experimentar?",
            "ok": true
          },
          {
            "jp": "しゃしんを とって も いい ですか",
            "romaji": "shashin o totte mo ii desu ka",
            "pt": "Posso tirar fotos?",
            "ok": false,
            "why": "Esse é para tirar foto. Aqui você quer vestir a peça."
          },
          {
            "jp": "いくら ですか",
            "romaji": "ikura desu ka",
            "pt": "Quanto é?",
            "ok": false,
            "why": "O preço vem depois de decidir se serve."
          }
        ]
      },
      {
        "kind": "narrator",
        "pt": "A camiseta ficou apertada."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "もっと おおきい のは ありますか",
            "romaji": "motto ōkii no wa arimasuka",
            "pt": "Tem um maior?",
            "ok": true
          },
          {
            "jp": "もっと ちいさい のは ありますか",
            "romaji": "motto chiisai no wa arimasuka",
            "pt": "Tem um menor?",
            "ok": false,
            "why": "Se ficou apertada, você precisa de um tamanho maior, não menor."
          },
          {
            "jp": "ほかの いろは ありますか",
            "romaji": "hokano iro wa arimasuka",
            "pt": "Tem outra cor?",
            "ok": false,
            "why": "O problema é o tamanho, não a cor."
          }
        ]
      },
      {
        "kind": "narrator",
        "pt": "O tamanho maior serviu e você decide levar."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "これを ください",
            "romaji": "kore o kudasai",
            "pt": "Quero isto, por favor",
            "ok": true
          },
          {
            "jp": "さようなら",
            "romaji": "sayōnara",
            "pt": "Tchau (despedida)",
            "ok": false,
            "why": "Ainda não: você vai comprar a camiseta."
          },
          {
            "jp": "これを みせて ください",
            "romaji": "kore o misete kudasai",
            "pt": "Pode me mostrar isto?",
            "ok": false,
            "why": "Você já viu a peça e já experimentou."
          }
        ]
      },
      {
        "kind": "narrator",
        "pt": "Na hora de pagar, você diz que é para presente."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "プレゼント です",
            "romaji": "purezento desu",
            "pt": "É um presente",
            "ok": true
          },
          {
            "jp": "レシートは いりません",
            "romaji": "reshīto wa irimasen",
            "pt": "Não preciso do recibo",
            "ok": false,
            "why": "Isso trata do recibo. O que você quer dizer agora é que é um presente."
          },
          {
            "jp": "ふくろを ください",
            "romaji": "fukuro o kudasai",
            "pt": "Pode me dar uma sacola?",
            "ok": false,
            "why": "Pedir sacola é outra coisa: aqui o aviso é que se trata de um presente."
          }
        ]
      },
      {
        "kind": "narrator",
        "pt": "Agora você pede para embrulhar."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "つつんで ください",
            "romaji": "tsutsunde kudasai",
            "pt": "Embrulhe, por favor",
            "ok": true
          },
          {
            "jp": "あたためて ください",
            "romaji": "atatamete kudasai",
            "pt": "Pode esquentar, por favor?",
            "ok": false,
            "why": "Esse é de conbini, para esquentar comida."
          },
          {
            "jp": "おかわりを ください",
            "romaji": "okawari o kudasai",
            "pt": "Mais um (refil), por favor",
            "ok": false,
            "why": "Esse é de restaurante."
          }
        ]
      }
    ]
  },
  {
    "id": "hajimete",
    "title": "Conhecendo alguém",
    "place": "Apresentação",
    "intro": "Você conhece uma pessoa simpática no Japão. Responda com educação e comece uma conversa.",
    "turns": [
      {
        "kind": "narrator",
        "pt": "Alguém se aproxima e se apresenta."
      },
      {
        "kind": "staff",
        "jp": "はじめまして",
        "romaji": "hajimemashite",
        "pt": "Muito prazer."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "はじめまして",
            "romaji": "hajimemashite",
            "pt": "Prazer em conhecê-lo (primeiro encontro)",
            "ok": true
          },
          {
            "jp": "さようなら",
            "romaji": "sayōnara",
            "pt": "Tchau (despedida)",
            "ok": false,
            "why": "É uma despedida, e vocês acabaram de se conhecer."
          },
          {
            "jp": "おやすみなさい",
            "romaji": "oyasuminasai",
            "pt": "Boa noite (para quem vai dormir)",
            "ok": false,
            "why": "Esse é para quem vai dormir."
          }
        ]
      },
      {
        "kind": "narrator",
        "pt": "Agora você se apresenta."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "わたしの なまえは ジョアン です",
            "romaji": "watashi no namae wa joan desu",
            "pt": "Meu nome é João (troque pelo seu)",
            "ok": true
          },
          {
            "jp": "これは わたしの です",
            "romaji": "kore wa watashi no desu",
            "pt": "Isto é meu",
            "ok": false,
            "why": "Isso fala de um objeto seu. Você quer dizer o seu nome."
          },
          {
            "jp": "げんき です",
            "romaji": "genki desu",
            "pt": "Estou bem",
            "ok": false,
            "why": "Isso diz que você está bem, mas ele ainda não sabe o seu nome."
          }
        ]
      },
      {
        "kind": "narrator",
        "pt": "Para terminar a apresentação, você pede cordialidade."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "よろしく おねがいします",
            "romaji": "yoroshiku onegaishimasu",
            "pt": "Prazer / Conto com você",
            "ok": true
          },
          {
            "jp": "どういたしまして",
            "romaji": "dōitashimashite",
            "pt": "De nada",
            "ok": false,
            "why": "É a resposta a um agradecimento, e ninguém agradeceu."
          },
          {
            "jp": "ごめんなさい",
            "romaji": "gomennasai",
            "pt": "Desculpe (mais pessoal que すみません)",
            "ok": false,
            "why": "Nada a pedir desculpas aqui."
          }
        ]
      },
      {
        "kind": "staff",
        "jp": "どちらから きましたか",
        "romaji": "dochira kara kimashita ka",
        "pt": "De onde você veio?"
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "ブラジルから きました",
            "romaji": "burajiru kara kimashita",
            "pt": "Vim do Brasil",
            "ok": true
          },
          {
            "jp": "ブラジルじん です",
            "romaji": "burajirujin desu",
            "pt": "Sou brasileiro(a)",
            "ok": false,
            "why": "Também fala da origem, mas a pergunta é de onde você veio: a resposta natural é ブラジルから きました."
          },
          {
            "jp": "りょこうで きました",
            "romaji": "ryokō de kimashita",
            "pt": "Vim a passeio",
            "ok": false,
            "why": "Isso responde o motivo da vinda, não de onde veio."
          }
        ]
      },
      {
        "kind": "staff",
        "jp": "にほんは はじめて ですか",
        "romaji": "nihon wa hajimete desu ka",
        "pt": "É a sua primeira vez no Japão?"
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "にほんは はじめて です",
            "romaji": "nihon wa hajimete desu",
            "pt": "É a minha primeira vez no Japão",
            "ok": true
          },
          {
            "jp": "にほんが すき です",
            "romaji": "nihon ga suki desu",
            "pt": "Eu gosto do Japão",
            "ok": false,
            "why": "Pode até ser verdade, mas a pergunta é se é a primeira vez."
          },
          {
            "jp": "わかりません",
            "romaji": "wakarimasen",
            "pt": "Não entendo",
            "ok": false,
            "why": "Você sabe: é só dizer que é a primeira vez."
          }
        ]
      },
      {
        "kind": "staff",
        "jp": "にほんは どう ですか",
        "romaji": "nihon wa dō desu ka",
        "pt": "O que está achando do Japão?"
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "にほんが すき です",
            "romaji": "nihon ga suki desu",
            "pt": "Eu gosto do Japão",
            "ok": true
          },
          {
            "jp": "にほんは はじめて です",
            "romaji": "nihon wa hajimete desu",
            "pt": "É a minha primeira vez no Japão",
            "ok": false,
            "why": "Você já disse isso. Agora ele pergunta o que você acha."
          },
          {
            "jp": "たかい です",
            "romaji": "takai desu",
            "pt": "É caro",
            "ok": false,
            "why": "Falaria só do preço; ele quer a sua impressão do país."
          }
        ]
      }
    ]
  },
  {
    "id": "izakaya",
    "title": "No bar japonês",
    "place": "Restaurante",
    "intro": "Você vai a um izakaya, o bar japonês, com um amigo e quer pedir bebida e comida.",
    "turns": [
      {
        "kind": "narrator",
        "pt": "Vocês são dois e o atendente se aproxima."
      },
      {
        "kind": "staff",
        "jp": "いらっしゃいませ なんめいさま ですか",
        "romaji": "irasshaimase nanmeisama desu ka",
        "pt": "Bem-vindos! Quantas pessoas?"
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "ふたり です",
            "romaji": "futari desu",
            "pt": "Somos dois",
            "ok": true
          },
          {
            "jp": "ひとりです",
            "romaji": "hitori desu",
            "pt": "Sou só eu (mesa para um)",
            "ok": false,
            "why": "Vocês são dois, não uma pessoa só."
          },
          {
            "jp": "さんにん です",
            "romaji": "sannin desu",
            "pt": "Somos três",
            "ok": false,
            "why": "Vocês são dois, não três."
          }
        ]
      },
      {
        "kind": "narrator",
        "pt": "Sentados, vocês querem uma cerveja."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "ビールを ください",
            "romaji": "bīru o kudasai",
            "pt": "Uma cerveja, por favor",
            "ok": true
          },
          {
            "jp": "おちゃを ください",
            "romaji": "ocha o kudasai",
            "pt": "Chá, por favor",
            "ok": false,
            "why": "Chá é bebida de refeição, mas vocês queriam cerveja."
          },
          {
            "jp": "ちゅうもんを おねがいします",
            "romaji": "chūmon o onegaishimasu",
            "pt": "Quero fazer o pedido",
            "ok": false,
            "why": "Esse é para fazer o pedido depois. Aqui vocês dizem a bebida."
          }
        ]
      },
      {
        "kind": "narrator",
        "pt": "Você não conhece um prato do cardápio."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "これは なん ですか",
            "romaji": "kore wa nan desu ka",
            "pt": "O que é isto?",
            "ok": true
          },
          {
            "jp": "いただきます",
            "romaji": "itadakimasu",
            "pt": "Dito antes de comer",
            "ok": false,
            "why": "Esse se diz quando a comida chega."
          },
          {
            "jp": "わりかんで おねがいします",
            "romaji": "warikan de onegaishimasu",
            "pt": "Dividir a conta, por favor",
            "ok": false,
            "why": "Dividir a conta é para o fim."
          }
        ]
      },
      {
        "kind": "narrator",
        "pt": "Você não aguenta comida muito picante."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "からくない のは ありますか",
            "romaji": "karakunai no wa arimasuka",
            "pt": "Tem algo que não seja picante?",
            "ok": true
          },
          {
            "jp": "さかなが たべられません",
            "romaji": "sakana ga taberaremasen",
            "pt": "Não posso comer peixe",
            "ok": false,
            "why": "Seria pedir para evitar peixe, e a sua questão é a pimenta."
          },
          {
            "jp": "おかわりを ください",
            "romaji": "okawari o kudasai",
            "pt": "Mais um (refil), por favor",
            "ok": false,
            "why": "Esse é para pedir mais uma. Aqui é sobre o tempero."
          }
        ]
      },
      {
        "kind": "narrator",
        "pt": "A cerveja acabou e vocês querem mais uma."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "おかわりを ください",
            "romaji": "okawari o kudasai",
            "pt": "Mais um (refil), por favor",
            "ok": true
          },
          {
            "jp": "おいしかった です",
            "romaji": "oishikatta desu",
            "pt": "Estava delicioso",
            "ok": false,
            "why": "Fala de algo que já passou. Vocês querem mais."
          },
          {
            "jp": "これは なん ですか",
            "romaji": "kore wa nan desu ka",
            "pt": "O que é isto?",
            "ok": false,
            "why": "Vocês já sabem o que é: querem repetir."
          }
        ]
      },
      {
        "kind": "narrator",
        "pt": "Hora de pagar: vocês querem dividir."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "わりかんで おねがいします",
            "romaji": "warikan de onegaishimasu",
            "pt": "Dividir a conta, por favor",
            "ok": true
          },
          {
            "jp": "レシートを ください",
            "romaji": "reshīto o kudasai",
            "pt": "O recibo, por favor",
            "ok": false,
            "why": "O recibo vem depois. Primeiro, como dividir a conta."
          },
          {
            "jp": "おもちかえりで おねがいします",
            "romaji": "omochikaeri de onegaishimasu",
            "pt": "Para levar, por favor",
            "ok": false,
            "why": "Esse é para levar comida embora."
          }
        ]
      }
    ]
  },
  {
    "id": "hotel-problema",
    "title": "Problema no quarto",
    "place": "Hotel",
    "intro": "Algo deu errado no seu quarto de hotel, e você precisa explicar na recepção.",
    "turns": [
      {
        "kind": "narrator",
        "pt": "Você volta ao hotel e vê que o ar-condicionado não funciona."
      },
      {
        "kind": "staff",
        "jp": "どう されましたか",
        "romaji": "dō saremashita ka",
        "pt": "O que houve?"
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "エアコンが こわれて います",
            "romaji": "eakon ga kowarete imasu",
            "pt": "O ar-condicionado está quebrado",
            "ok": true
          },
          {
            "jp": "カギを なくしました",
            "romaji": "kagi o nakushimashita",
            "pt": "Perdi a chave",
            "ok": false,
            "why": "Isso seria sobre a chave, e o problema é o ar-condicionado."
          },
          {
            "jp": "おゆが でません",
            "romaji": "oyu ga demasen",
            "pt": "Não sai água quente",
            "ok": false,
            "why": "Seria sobre água quente, e o problema é o ar-condicionado."
          }
        ]
      },
      {
        "kind": "staff",
        "jp": "もうしわけ ございません",
        "romaji": "mōshiwake gozaimasen",
        "pt": "Sinto muito."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "へやを かえて もらえますか",
            "romaji": "heya o kaete moraemasuka",
            "pt": "Pode trocar de quarto?",
            "ok": true
          },
          {
            "jp": "チェックアウトは なんじ ですか",
            "romaji": "chekkuauto wa nanji desu ka",
            "pt": "Que horas é o check-out?",
            "ok": false,
            "why": "Você quer resolver o problema, não saber a hora de sair."
          },
          {
            "jp": "ごちそうさまでした",
            "romaji": "gochisōsama deshita",
            "pt": "Dito depois de comer",
            "ok": false,
            "why": "Esse é de refeição."
          }
        ]
      },
      {
        "kind": "narrator",
        "pt": "Você também precisa de mais uma toalha."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "タオルを もう ひとつ ください",
            "romaji": "taoru o mō hitotsu kudasai",
            "pt": "Mais uma toalha, por favor",
            "ok": true
          },
          {
            "jp": "ふくろを ください",
            "romaji": "fukuro o kudasai",
            "pt": "Pode me dar uma sacola?",
            "ok": false,
            "why": "Sacola é coisa de loja; você precisa de toalha."
          },
          {
            "jp": "スプーンを ください",
            "romaji": "supūn o kudasai",
            "pt": "Pode dar uma colher?",
            "ok": false,
            "why": "Uma colher não resolve a falta de toalha."
          }
        ]
      },
      {
        "kind": "narrator",
        "pt": "Você quer saber o horário do café da manhã."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "あさごはんは なんじから ですか",
            "romaji": "asagohan wa nanji kara desu ka",
            "pt": "A partir de que horas é o café da manhã?",
            "ok": true
          },
          {
            "jp": "チェックアウトは なんじ ですか",
            "romaji": "chekkuauto wa nanji desu ka",
            "pt": "Que horas é o check-out?",
            "ok": false,
            "why": "Esse é a hora de sair do quarto, não do café."
          },
          {
            "jp": "いま なんじ ですか",
            "romaji": "ima nanji desu ka",
            "pt": "Que horas são agora?",
            "ok": false,
            "why": "Isso só diz que horas são agora."
          }
        ]
      },
      {
        "kind": "narrator",
        "pt": "Por fim, você pergunta se ainda é possível ficar mais um dia."
      },
      {
        "kind": "you",
        "options": [
          {
            "jp": "もう いっぱく したい です",
            "romaji": "mō ippaku shitai desu",
            "pt": "Quero ficar mais uma noite",
            "ok": true
          },
          {
            "jp": "もう いちど おねがいします",
            "romaji": "mō ichido onegaishimasu",
            "pt": "Mais uma vez, por favor",
            "ok": false,
            "why": "Isso pede para repetir a frase, não para ficar mais um dia."
          },
          {
            "jp": "また あした",
            "romaji": "mata ashita",
            "pt": "Até amanhã",
            "ok": false,
            "why": "É uma despedida, não um pedido."
          }
        ]
      }
    ]
  }
];
