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
        "jp": "ふくろは いりますか",
        "romaji": "fukuro wa irimasu ka",
        "pt": "Precisa de sacola?"
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
  }
];
