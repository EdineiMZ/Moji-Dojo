// Gerado por scripts/grammar-n5/build.mjs a partir de scripts/grammar-n5/topics.mjs. Não edite à mão.
// Exemplos: frases do Tatoeba (CC BY 2.0 FR), conferidas por scripts/grammar-n5/verify.mjs. Ver LICENSE.md.
import type { GrammarTopic } from '@/data/types';

export const GRAMMAR_N5: readonly GrammarTopic[] = [
  {
    "id": "g11",
    "title": "です no negativo e no passado: ではありません, でした",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "Você já viu "
          },
          {
            "text": "じゃないです",
            "bold": true
          },
          {
            "text": " para negar. Em situações mais formais se usa "
          },
          {
            "text": "ではありません",
            "bold": true
          },
          {
            "text": ". O passado de "
          },
          {
            "text": "です",
            "bold": true
          },
          {
            "text": " é "
          },
          {
            "text": "でした",
            "bold": true
          },
          {
            "text": ", e o negativo do passado é "
          },
          {
            "text": "ではありませんでした",
            "bold": true
          },
          {
            "text": "."
          }
        ]
      },
      {
        "kind": "table",
        "rows": [
          [
            {
              "text": "",
              "header": true
            },
            {
              "text": "afirmativo",
              "header": true
            },
            {
              "text": "negativo",
              "header": true
            }
          ],
          [
            {
              "text": "presente",
              "header": true
            },
            {
              "text": "です",
              "ja": true
            },
            {
              "text": "ではありません (ou じゃないです)",
              "ja": true
            }
          ],
          [
            {
              "text": "passado",
              "header": true
            },
            {
              "text": "でした",
              "ja": true
            },
            {
              "text": "ではありませんでした (ou じゃなかったです)",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Vale para substantivos e para adjetivos do tipo "
          },
          {
            "text": "な",
            "bold": true
          },
          {
            "text": ". Em "
          },
          {
            "text": "ではありません",
            "bold": true
          },
          {
            "text": ", o "
          },
          {
            "text": "は",
            "bold": true
          },
          {
            "text": " é a partícula e lê-se \"wa\"."
          }
        ]
      }
    ],
    "pattern": "[coisa] ではありません · [coisa] でした · [coisa] ではありませんでした",
    "examples": [
      {
        "jp": "わたしは ねこではありません",
        "romaji": "watashi wa neko dewa arimasen",
        "pt": "Eu não sou um gato."
      },
      {
        "jp": "わたしは いしゃではありません",
        "romaji": "watashi wa isha dewa arimasen",
        "pt": "Eu não sou doutor."
      },
      {
        "jp": "ミスでした",
        "romaji": "misu deshita",
        "pt": "Foi um erro."
      },
      {
        "jp": "くうふくではありませんでした",
        "romaji": "kūfuku dewa arimasen deshita",
        "pt": "Eu não estava com fome."
      }
    ]
  },
  {
    "id": "g12",
    "title": "Adjetivos い: negativo e passado",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "O adjetivo do tipo "
          },
          {
            "text": "い",
            "bold": true
          },
          {
            "text": " muda no final, e o "
          },
          {
            "text": "です",
            "bold": true
          },
          {
            "text": " só deixa a frase educada. Para negar, troque o "
          },
          {
            "text": "い",
            "bold": true
          },
          {
            "text": " por "
          },
          {
            "text": "くない",
            "bold": true
          },
          {
            "text": ". Para o passado, troque por "
          },
          {
            "text": "かった",
            "bold": true
          },
          {
            "text": "."
          }
        ]
      },
      {
        "kind": "table",
        "rows": [
          [
            {
              "text": "",
              "header": true
            },
            {
              "text": "afirmativo",
              "header": true
            },
            {
              "text": "negativo",
              "header": true
            }
          ],
          [
            {
              "text": "presente",
              "header": true
            },
            {
              "text": "たかいです",
              "ja": true
            },
            {
              "text": "たかくないです",
              "ja": true
            }
          ],
          [
            {
              "text": "passado",
              "header": true
            },
            {
              "text": "たかかったです",
              "ja": true
            },
            {
              "text": "たかくなかったです",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Exceção: "
          },
          {
            "text": "いい",
            "bold": true
          },
          {
            "text": " (bom) vira "
          },
          {
            "text": "よい",
            "bold": true
          },
          {
            "text": " na conjugação: "
          },
          {
            "text": "よくないです",
            "ja": true
          },
          {
            "text": " (não é bom) e "
          },
          {
            "text": "よかったです",
            "ja": true
          },
          {
            "text": " (foi bom)."
          }
        ]
      }
    ],
    "pattern": "たかい → たかくないです · たかかったです",
    "examples": [
      {
        "jp": "これは たかくないです",
        "romaji": "kore wa takakunai desu",
        "pt": "Isso não é caro."
      },
      {
        "jp": "きょうは さむくないです",
        "romaji": "kyō wa samukunai desu",
        "pt": "Não está frio hoje."
      },
      {
        "jp": "おいしかったです",
        "romaji": "oishikatta desu",
        "pt": "Estava delicioso."
      },
      {
        "jp": "たのしかったですか",
        "romaji": "tanoshikatta desu ka",
        "pt": "Você se divertiu?"
      }
    ]
  },
  {
    "id": "g13",
    "title": "Adjetivos な: negativo e passado",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "O adjetivo do tipo "
          },
          {
            "text": "な",
            "bold": true
          },
          {
            "text": " não muda. Quem muda é o "
          },
          {
            "text": "です",
            "bold": true
          },
          {
            "text": ", igual aos substantivos: "
          },
          {
            "text": "きれいです",
            "ja": true
          },
          {
            "text": " (é bonito), "
          },
          {
            "text": "きれいでした",
            "ja": true
          },
          {
            "text": " (era bonito), "
          },
          {
            "text": "きれいではありません",
            "ja": true
          },
          {
            "text": " (não é bonito)."
          }
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Cuidado: "
          },
          {
            "text": "きれい",
            "bold": true
          },
          {
            "text": " termina em い, mas é do tipo な. O mesmo vale para "
          },
          {
            "text": "すき",
            "bold": true
          },
          {
            "text": " (gostar), "
          },
          {
            "text": "ゆうめい",
            "bold": true
          },
          {
            "text": " (famoso) e "
          },
          {
            "text": "しずか",
            "bold": true
          },
          {
            "text": " (silencioso). Se não dá para trocar o い por くない, é adjetivo な."
          }
        ]
      }
    ],
    "pattern": "[adjetivo な] ではありません · [adjetivo な] でした",
    "examples": [
      {
        "jp": "べんきょうは すきではありません",
        "romaji": "benkyō wa suki dewa arimasen",
        "pt": "Não gosto de estudar."
      },
      {
        "jp": "サラダは すきではありません",
        "romaji": "sarada wa suki dewa arimasen",
        "pt": "Eu não gosto de salada."
      },
      {
        "jp": "この まちは むかし きれいでした",
        "romaji": "kono machi wa mukashi kirei deshita",
        "pt": "Antigamente, esta cidade era linda."
      },
      {
        "jp": "その よるは たいへん しずかでした",
        "romaji": "sono yoru wa taihen shizuka deshita",
        "pt": "A noite estava muito silenciosa."
      }
    ]
  },
  {
    "id": "g14",
    "title": "Pedir com a forma て: 〜てください",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "A forma "
          },
          {
            "text": "て",
            "bold": true
          },
          {
            "text": " do verbo (treine no "
          },
          {
            "text": "Conjugar",
            "bold": true
          },
          {
            "text": ") mais "
          },
          {
            "text": "ください",
            "bold": true
          },
          {
            "text": " é o pedido educado do dia a dia: "
          },
          {
            "text": "すわって ください",
            "ja": true
          },
          {
            "text": " = sente-se, por favor."
          }
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Para pedir uma coisa, e não uma ação, o tópico 8 já mostrou "
          },
          {
            "text": "[coisa] を ください",
            "ja": true
          },
          {
            "text": "."
          }
        ]
      }
    ],
    "pattern": "[verbo na forma て] ください",
    "examples": [
      {
        "jp": "すわってください",
        "romaji": "suwatte kudasai",
        "pt": "Sente-se, por favor."
      },
      {
        "jp": "えいごで はなしてください",
        "romaji": "eigo de hanashite kudasai",
        "pt": "Por favor, fale em inglês."
      },
      {
        "jp": "たすけてください",
        "romaji": "tasukete kudasai",
        "pt": "Me ajude, por favor!"
      },
      {
        "jp": "きてください",
        "romaji": "kite kudasai",
        "pt": "Venha, por favor."
      }
    ]
  },
  {
    "id": "g15",
    "title": "〜ています: fazendo agora e estado",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "Forma "
          },
          {
            "text": "て",
            "bold": true
          },
          {
            "text": " + "
          },
          {
            "text": "います",
            "bold": true
          },
          {
            "text": " tem dois usos. O primeiro é a ação que está acontecendo: "
          },
          {
            "text": "たべています",
            "ja": true
          },
          {
            "text": " = estou comendo."
          }
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "O segundo é um estado que continua: "
          },
          {
            "text": "もっています",
            "ja": true
          },
          {
            "text": " (tenho), "
          },
          {
            "text": "しっています",
            "ja": true
          },
          {
            "text": " (sei, conheço), "
          },
          {
            "text": "くもっています",
            "ja": true
          },
          {
            "text": " (está nublado), "
          },
          {
            "text": "けっこんしています",
            "ja": true
          },
          {
            "text": " (sou casado)."
          }
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Atenção: o negativo de "
          },
          {
            "text": "しっています",
            "ja": true
          },
          {
            "text": " (sei) é "
          },
          {
            "text": "しりません",
            "ja": true
          },
          {
            "text": " (não sei), e não "
          },
          {
            "text": "しっていません",
            "ja": true
          },
          {
            "text": "."
          }
        ]
      }
    ],
    "pattern": "[verbo na forma て] います",
    "examples": [
      {
        "jp": "なにを していますか",
        "romaji": "nani o shite imasu ka",
        "pt": "O que você está fazendo?"
      },
      {
        "jp": "しっていますか",
        "romaji": "shitte imasu ka",
        "pt": "Você sabe?"
      },
      {
        "jp": "くもっています",
        "romaji": "kumotte imasu",
        "pt": "Está nublado."
      },
      {
        "jp": "もっています",
        "romaji": "motte imasu",
        "pt": "Eu tenho um."
      }
    ]
  },
  {
    "id": "g16",
    "title": "Pedir para não fazer: 〜ないでください",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "Para pedir que alguém "
          },
          {
            "text": "não",
            "bold": true
          },
          {
            "text": " faça algo, use a forma "
          },
          {
            "text": "ない",
            "bold": true
          },
          {
            "text": " do verbo + "
          },
          {
            "text": "で",
            "bold": true
          },
          {
            "text": " + "
          },
          {
            "text": "ください",
            "bold": true
          },
          {
            "text": ": "
          },
          {
            "text": "いかないで ください",
            "ja": true
          },
          {
            "text": " = por favor, não vá."
          }
        ]
      }
    ],
    "pattern": "[verbo na forma ない] で ください",
    "examples": [
      {
        "jp": "いかないでください",
        "romaji": "ikanaide kudasai",
        "pt": "Por favor, não vá embora."
      },
      {
        "jp": "しんぱい しないでください",
        "romaji": "shinpai shinaide kudasai",
        "pt": "Não te preocupes."
      },
      {
        "jp": "うごかないでください",
        "romaji": "ugokanaide kudasai",
        "pt": "Não se mexa, por favor."
      },
      {
        "jp": "おとを たてないでください",
        "romaji": "oto o tatenaide kudasai",
        "pt": "Não faça barulho."
      }
    ]
  },
  {
    "id": "g17",
    "title": "Pedir permissão: 〜てもいいですか",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "Forma "
          },
          {
            "text": "て",
            "bold": true
          },
          {
            "text": " + "
          },
          {
            "text": "も",
            "bold": true
          },
          {
            "text": " + "
          },
          {
            "text": "いいですか",
            "bold": true
          },
          {
            "text": " quer dizer \"posso...?\". Para dar permissão, responda "
          },
          {
            "text": "はい、いいですよ",
            "ja": true
          },
          {
            "text": ". Uma recusa suave é "
          },
          {
            "text": "ちょっと…",
            "ja": true
          },
          {
            "text": " (um pouco difícil)."
          }
        ]
      }
    ],
    "pattern": "[verbo na forma て] も いいですか",
    "examples": [
      {
        "jp": "はいってもいいですか",
        "romaji": "haitte mo ii desu ka",
        "pt": "Posso entrar?"
      },
      {
        "jp": "たべてもいいですか",
        "romaji": "tabete mo ii desu ka",
        "pt": "Posso comer?"
      },
      {
        "jp": "まどを あけてもいいですか",
        "romaji": "mado o akete mo ii desu ka",
        "pt": "Posso abrir a janela?"
      },
      {
        "jp": "すわってもいいですか",
        "romaji": "suwatte mo ii desu ka",
        "pt": "Posso sentar?"
      }
    ]
  },
  {
    "id": "g18",
    "title": "Proibir: 〜てはいけません",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "Forma "
          },
          {
            "text": "て",
            "bold": true
          },
          {
            "text": " + "
          },
          {
            "text": "は",
            "bold": true
          },
          {
            "text": " + "
          },
          {
            "text": "いけません",
            "bold": true
          },
          {
            "text": " quer dizer \"não pode\" ou \"não deve\". É a proibição direta, de regra ou de aviso. Aqui o "
          },
          {
            "text": "は",
            "bold": true
          },
          {
            "text": " lê-se \"wa\"."
          }
        ]
      }
    ],
    "pattern": "[verbo na forma て] は いけません",
    "examples": [
      {
        "jp": "たべてはいけません",
        "romaji": "tabete wa ikemasen",
        "pt": "Não coma."
      },
      {
        "jp": "テレビを みてはいけません",
        "romaji": "terebi o mite wa ikemasen",
        "pt": "Não assista televisão."
      },
      {
        "jp": "ドアを しめてはいけません",
        "romaji": "doa o shimete wa ikemasen",
        "pt": "Não feche a porta!"
      },
      {
        "jp": "そこへ いってはいけません",
        "romaji": "soko e itte wa ikemasen",
        "pt": "Não vá para lá."
      }
    ]
  },
  {
    "id": "g19",
    "title": "Convidar: 〜ましょう e 〜ませんか",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "Troque o "
          },
          {
            "text": "ます",
            "bold": true
          },
          {
            "text": " por "
          },
          {
            "text": "ましょう",
            "bold": true
          },
          {
            "text": " para dizer \"vamos...\": "
          },
          {
            "text": "たべましょう",
            "ja": true
          },
          {
            "text": " (vamos comer)."
          }
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Troque por "
          },
          {
            "text": "ませんか",
            "bold": true
          },
          {
            "text": " para convidar com mais delicadeza: "
          },
          {
            "text": "いきませんか",
            "ja": true
          },
          {
            "text": " (não quer ir?). A resposta mais comum é "
          },
          {
            "text": "いいですね",
            "ja": true
          },
          {
            "text": " (boa ideia)."
          }
        ]
      }
    ],
    "pattern": "[verbo sem ます] ましょう · [verbo sem ます] ませんか",
    "examples": [
      {
        "jp": "もどりましょう",
        "romaji": "modorimashō",
        "pt": "Vamos voltar."
      },
      {
        "jp": "はじめましょう",
        "romaji": "hajimemashō",
        "pt": "Vamos começar."
      },
      {
        "jp": "すわりませんか",
        "romaji": "suwarimasen ka",
        "pt": "Você não quer se sentar?"
      },
      {
        "jp": "はしりませんか",
        "romaji": "hashirimasen ka",
        "pt": "Que tal corrida?"
      }
    ]
  },
  {
    "id": "g20",
    "title": "Querer uma coisa: 〜がほしいです",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "Para querer "
          },
          {
            "text": "uma coisa",
            "bold": true
          },
          {
            "text": " use "
          },
          {
            "text": "が ほしい",
            "bold": true
          },
          {
            "text": " (polido: "
          },
          {
            "text": "ほしいです",
            "ja": true
          },
          {
            "text": "). Para querer "
          },
          {
            "text": "fazer",
            "bold": true
          },
          {
            "text": " algo, o tópico 8 mostrou o "
          },
          {
            "text": "たい",
            "ja": true
          },
          {
            "text": "."
          }
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "ほしい",
            "bold": true
          },
          {
            "text": " é um adjetivo do tipo い, então ele muda como os outros: "
          },
          {
            "text": "ほしくないです",
            "ja": true
          },
          {
            "text": " (não quero), "
          },
          {
            "text": "ほしかったです",
            "ja": true
          },
          {
            "text": " (eu queria)."
          }
        ]
      }
    ],
    "pattern": "[coisa] が ほしいです",
    "examples": [
      {
        "jp": "みずが ほしい",
        "romaji": "mizu ga hoshii",
        "pt": "Quero água."
      },
      {
        "jp": "あめが ほしい",
        "romaji": "ame ga hoshii",
        "pt": "Eu quero uma bala."
      },
      {
        "jp": "なにが ほしいの",
        "romaji": "nani ga hoshii no",
        "pt": "O que você quer?"
      },
      {
        "jp": "かのじょが ほしい",
        "romaji": "kanojo ga hoshii",
        "pt": "Eu quero uma namorada."
      }
    ]
  },
  {
    "id": "g21",
    "title": "Comparar: より e のほうが",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "Para dizer \"A é mais ... que B\", o japonês põe "
          },
          {
            "text": "より",
            "bold": true
          },
          {
            "text": " depois de B: "
          },
          {
            "text": "A は B より おおきいです",
            "ja": true
          },
          {
            "text": ". A coisa com que se compara vem marcada com "
          },
          {
            "text": "より",
            "bold": true
          },
          {
            "text": ", e o adjetivo não muda."
          }
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Para apontar o lado que ganha, use "
          },
          {
            "text": "のほうが",
            "bold": true
          },
          {
            "text": ": "
          },
          {
            "text": "こっちの ほうが やすいです",
            "ja": true
          },
          {
            "text": " = este aqui é mais barato."
          }
        ]
      }
    ],
    "pattern": "[A] は [B] より [adjetivo] · [A] のほうが [adjetivo]",
    "examples": [
      {
        "jp": "ちゅうごくは にほんより おおきいです",
        "romaji": "chūgoku wa nihon yori ōkii desu",
        "pt": "A China é maior que o Japão."
      },
      {
        "jp": "わたしは きみより せが たかい",
        "romaji": "watashi wa kimi yori se ga takai",
        "pt": "Sou mais alto que você."
      },
      {
        "jp": "きんは ぎんより おもい",
        "romaji": "kin wa gin yori omoi",
        "pt": "O ouro é mais pesado do que a prata."
      },
      {
        "jp": "こっちの ほうが やすいよ",
        "romaji": "kotchi no hō ga yasui yo",
        "pt": "Este aqui é mais barato."
      }
    ]
  },
  {
    "id": "g22",
    "title": "O mais...: いちばん",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "いちばん",
            "bold": true
          },
          {
            "text": " (literalmente \"número um\") antes de um adjetivo quer dizer \"o mais...\": "
          },
          {
            "text": "いちばん つよい",
            "ja": true
          },
          {
            "text": " (o mais forte)."
          }
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Para escolher dentro de um grupo, use "
          },
          {
            "text": "の なかで",
            "bold": true
          },
          {
            "text": ": "
          },
          {
            "text": "にほんりょうりの なかで なにが いちばん すきですか",
            "ja": true
          },
          {
            "text": " (entre as comidas japonesas, de qual você mais gosta?)."
          }
        ]
      }
    ],
    "pattern": "[coisa] が いちばん [adjetivo]",
    "examples": [
      {
        "jp": "トムが いちばん つよい",
        "romaji": "tomu ga ichiban tsuyoi",
        "pt": "Tom é o mais forte."
      },
      {
        "jp": "わたしが いちばん わかいです",
        "romaji": "watashi ga ichiban wakai desu",
        "pt": "Sou o mais jovem."
      },
      {
        "jp": "なんようびが いちばん すき",
        "romaji": "nan'yōbi ga ichiban suki",
        "pt": "Qual é o seu dia da semana favorito?"
      },
      {
        "jp": "どの きょうかが いちばん すき",
        "romaji": "dono kyōka ga ichiban suki",
        "pt": "De que matéria você gosta mais?"
      }
    ]
  },
  {
    "id": "g23",
    "title": "Gostar e ser bom em algo: が すき, が じょうず",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "Com "
          },
          {
            "text": "すき",
            "bold": true
          },
          {
            "text": " (gostar), "
          },
          {
            "text": "きらい",
            "bold": true
          },
          {
            "text": " (não gostar), "
          },
          {
            "text": "じょうず",
            "bold": true
          },
          {
            "text": " (ser bom em) e "
          },
          {
            "text": "へた",
            "bold": true
          },
          {
            "text": " (ser ruim em), a coisa de que se fala vem com "
          },
          {
            "text": "が",
            "bold": true
          },
          {
            "text": ", e não com "
          },
          {
            "text": "を",
            "bold": true
          },
          {
            "text": ": "
          },
          {
            "text": "ねこが すきです",
            "ja": true
          },
          {
            "text": "."
          }
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Para gostar muito, diga "
          },
          {
            "text": "だいすき",
            "ja": true
          },
          {
            "text": " (adoro). Todos são adjetivos do tipo な."
          }
        ]
      }
    ],
    "pattern": "[coisa] が すきです · [coisa] が じょうずです",
    "examples": [
      {
        "jp": "ねこが すきです",
        "romaji": "neko ga suki desu",
        "pt": "Eu gosto de gatos."
      },
      {
        "jp": "おんがくが すきです",
        "romaji": "ongaku ga suki desu",
        "pt": "Eu gosto de música."
      },
      {
        "jp": "いぬが すきですか",
        "romaji": "inu ga suki desu ka",
        "pt": "Você gosta de cães?"
      },
      {
        "jp": "べんきょうが すきです",
        "romaji": "benkyō ga suki desu",
        "pt": "Eu gosto de estudar."
      }
    ]
  },
  {
    "id": "g24",
    "title": "De... até...: から e まで",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "から",
            "bold": true
          },
          {
            "text": " quer dizer \"a partir de\" ou \"vindo de\", e vale para tempo e para lugar. "
          },
          {
            "text": "まで",
            "bold": true
          },
          {
            "text": " quer dizer \"até\"."
          }
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Cuidado com "
          },
          {
            "text": "までに",
            "bold": true
          },
          {
            "text": ": "
          },
          {
            "text": "ろくじまでに もどります",
            "ja": true
          },
          {
            "text": " é \"voltarei "
          },
          {
            "text": "antes das",
            "bold": true
          },
          {
            "text": " 6\" (um prazo), enquanto "
          },
          {
            "text": "ろくじまで まちます",
            "ja": true
          },
          {
            "text": " é \"esperarei "
          },
          {
            "text": "até",
            "bold": true
          },
          {
            "text": " as 6\" (uma duração)."
          }
        ]
      }
    ],
    "pattern": "[início] から [fim] まで",
    "examples": [
      {
        "jp": "ちゅうごくから きました",
        "romaji": "chūgoku kara kimashita",
        "pt": "Eu vim da China."
      },
      {
        "jp": "どこから きましたか",
        "romaji": "doko kara kimashita ka",
        "pt": "De onde é você?"
      },
      {
        "jp": "じゅぎょうは じゅうじからです",
        "romaji": "jugyō wa jūji kara desu",
        "pt": "A nossa aula começa às 10h."
      },
      {
        "jp": "にじはんまで まちます",
        "romaji": "nijihan made machimasu",
        "pt": "Eu irei esperar até 2:30."
      }
    ]
  },
  {
    "id": "g25",
    "title": "Dar o motivo: から",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "から",
            "bold": true
          },
          {
            "text": " também quer dizer \"porque\". Mas a ordem é a inversa da do português: o "
          },
          {
            "text": "motivo",
            "bold": true
          },
          {
            "text": " vem primeiro e "
          },
          {
            "text": "から",
            "bold": true
          },
          {
            "text": " vai logo depois dele, antes do resultado: "
          },
          {
            "text": "さむいから、まどを しめます",
            "ja": true
          },
          {
            "text": " = como está frio, fecho a janela."
          }
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Depois de "
          },
          {
            "text": "です",
            "bold": true
          },
          {
            "text": " fica "
          },
          {
            "text": "ですから",
            "ja": true
          },
          {
            "text": " (ou "
          },
          {
            "text": "だから",
            "ja": true
          },
          {
            "text": " entre amigos)."
          }
        ]
      }
    ],
    "pattern": "[motivo] から、[resultado]",
    "examples": [
      {
        "jp": "さむいから まど しめてもいい",
        "romaji": "samui kara mado shimete mo ii",
        "pt": "Estou com frio. Posso fechar a janela?"
      },
      {
        "jp": "ねむいから ねるね",
        "romaji": "nemui kara neru ne",
        "pt": "Eu estou com sono, então estou indo para a cama."
      },
      {
        "jp": "ほうりつですから",
        "romaji": "hōritsu desu kara",
        "pt": "É a lei."
      }
    ]
  },
  {
    "id": "g26",
    "title": "Perguntar: なに, だれ, どこ, いつ, いくら",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "A palavra interrogativa fica "
          },
          {
            "text": "no lugar da resposta",
            "bold": true
          },
          {
            "text": ", e a ordem da frase não muda. No fim, "
          },
          {
            "text": "か",
            "bold": true
          },
          {
            "text": " transforma em pergunta."
          }
        ]
      },
      {
        "kind": "table",
        "rows": [
          [
            {
              "text": "palavra",
              "header": true
            },
            {
              "text": "significa",
              "header": true
            }
          ],
          [
            {
              "text": "なに / なん",
              "ja": true
            },
            {
              "text": "o quê"
            }
          ],
          [
            {
              "text": "だれ",
              "ja": true
            },
            {
              "text": "quem"
            }
          ],
          [
            {
              "text": "どこ",
              "ja": true
            },
            {
              "text": "onde"
            }
          ],
          [
            {
              "text": "いつ",
              "ja": true
            },
            {
              "text": "quando"
            }
          ],
          [
            {
              "text": "いくら",
              "ja": true
            },
            {
              "text": "quanto custa"
            }
          ],
          [
            {
              "text": "いくつ",
              "ja": true
            },
            {
              "text": "quantos (e quantos anos)"
            }
          ],
          [
            {
              "text": "なんじ",
              "ja": true
            },
            {
              "text": "que horas"
            }
          ],
          [
            {
              "text": "どうして",
              "ja": true
            },
            {
              "text": "por quê"
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Quando a pergunta é sobre quem faz a ação, use "
          },
          {
            "text": "が",
            "bold": true
          },
          {
            "text": ": "
          },
          {
            "text": "だれが きましたか",
            "ja": true
          },
          {
            "text": " (quem veio?)."
          }
        ]
      }
    ],
    "pattern": "[assunto] は [なに / だれ / どこ / いくら] ですか",
    "examples": [
      {
        "jp": "なにを のみますか",
        "romaji": "nani o nomimasu ka",
        "pt": "O que você quer beber?"
      },
      {
        "jp": "かれは だれですか",
        "romaji": "kare wa dare desu ka",
        "pt": "Quem é ele?"
      },
      {
        "jp": "だいどころは どこ",
        "romaji": "daidokoro wa doko",
        "pt": "Onde fica a cozinha?"
      },
      {
        "jp": "これは いくらですか",
        "romaji": "kore wa ikura desu ka",
        "pt": "Quanto custa isto?"
      },
      {
        "jp": "いま なんじですか",
        "romaji": "ima nanji desu ka",
        "pt": "Que horas são?"
      }
    ]
  },
  {
    "id": "g27",
    "title": "Já e ainda: もう e まだ",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "もう",
            "bold": true
          },
          {
            "text": " + verbo no passado quer dizer \"já\": "
          },
          {
            "text": "もう たべました",
            "ja": true
          },
          {
            "text": " (já comi). Para responder que não, diga "
          },
          {
            "text": "いいえ、まだです",
            "ja": true
          },
          {
            "text": " (ainda não)."
          }
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "まだ",
            "bold": true
          },
          {
            "text": " + afirmativo quer dizer \"ainda (continua)\": "
          },
          {
            "text": "まだ さむいですか",
            "ja": true
          },
          {
            "text": " (ainda está frio?). "
          },
          {
            "text": "まだ",
            "bold": true
          },
          {
            "text": " + negativo quer dizer \"ainda não\": "
          },
          {
            "text": "まだ きていません",
            "ja": true
          },
          {
            "text": "."
          }
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Cuidado: "
          },
          {
            "text": "もう",
            "bold": true
          },
          {
            "text": " + negativo é \"não... mais\": "
          },
          {
            "text": "もう たべません",
            "ja": true
          },
          {
            "text": " (não como mais)."
          }
        ]
      }
    ],
    "pattern": "もう [verbo no passado] · まだ [verbo / adjetivo]",
    "examples": [
      {
        "jp": "もう たべましたか",
        "romaji": "mō tabemashita ka",
        "pt": "Você já comeu?"
      },
      {
        "jp": "もう たべました",
        "romaji": "mō tabemashita",
        "pt": "Já comi."
      },
      {
        "jp": "トムは まだ きてません",
        "romaji": "tomu wa mada kitemasen",
        "pt": "Tom ainda não chegou."
      },
      {
        "jp": "まだ さむい",
        "romaji": "mada samui",
        "pt": "Você ainda está com frio?"
      }
    ]
  },
  {
    "id": "g28",
    "title": "Onde está: うえ, した, なか e outras posições",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "Para dizer onde algo está, diga primeiro a "
          },
          {
            "text": "referência",
            "bold": true
          },
          {
            "text": ", ligue com "
          },
          {
            "text": "の",
            "bold": true
          },
          {
            "text": ", escolha a posição e termine com "
          },
          {
            "text": "に",
            "bold": true
          },
          {
            "text": ": "
          },
          {
            "text": "つくえの うえに あります",
            "ja": true
          },
          {
            "text": " (está em cima da mesa)."
          }
        ]
      },
      {
        "kind": "table",
        "rows": [
          [
            {
              "text": "posição",
              "header": true
            },
            {
              "text": "significa",
              "header": true
            }
          ],
          [
            {
              "text": "うえ",
              "ja": true
            },
            {
              "text": "em cima"
            }
          ],
          [
            {
              "text": "した",
              "ja": true
            },
            {
              "text": "embaixo"
            }
          ],
          [
            {
              "text": "なか",
              "ja": true
            },
            {
              "text": "dentro"
            }
          ],
          [
            {
              "text": "まえ",
              "ja": true
            },
            {
              "text": "na frente"
            }
          ],
          [
            {
              "text": "うしろ",
              "ja": true
            },
            {
              "text": "atrás"
            }
          ],
          [
            {
              "text": "よこ / となり",
              "ja": true
            },
            {
              "text": "ao lado"
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Lembre do tópico 7: "
          },
          {
            "text": "あります",
            "bold": true
          },
          {
            "text": " é para coisas e "
          },
          {
            "text": "います",
            "bold": true
          },
          {
            "text": " para pessoas e animais. Nos exemplos aparecem "
          },
          {
            "text": "ある",
            "bold": true
          },
          {
            "text": " e "
          },
          {
            "text": "いる",
            "bold": true
          },
          {
            "text": ", as formas simples (sem educação) dos mesmos verbos."
          }
        ]
      }
    ],
    "pattern": "[referência] の [posição] に あります / います",
    "examples": [
      {
        "jp": "つくえの うえに かぎが ある",
        "romaji": "tsukue no ue ni kagi ga aru",
        "pt": "Tem uma chave na escrivaninha."
      },
      {
        "jp": "じしょが つくえの うえに ある",
        "romaji": "jisho ga tsukue no ue ni aru",
        "pt": "Tem um dicionário em cima da mesa."
      },
      {
        "jp": "いぬは いえの なかに いる",
        "romaji": "inu wa ie no naka ni iru",
        "pt": "O cachorro está na casa."
      },
      {
        "jp": "はしの うえに いぬが いる",
        "romaji": "hashi no ue ni inu ga iru",
        "pt": "Há um cachorro na ponte."
      }
    ]
  },
  {
    "id": "g29",
    "title": "Virar e querer ser: 〜になります, 〜になりたい",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "に なります",
            "bold": true
          },
          {
            "text": " quer dizer \"tornar-se\", \"ficar\": "
          },
          {
            "text": "ひまに なります",
            "ja": true
          },
          {
            "text": " (ficar livre). Com adjetivos do tipo "
          },
          {
            "text": "い",
            "bold": true
          },
          {
            "text": ", troque o い por "
          },
          {
            "text": "く",
            "bold": true
          },
          {
            "text": ": "
          },
          {
            "text": "さむく なります",
            "ja": true
          },
          {
            "text": " (vai ficar frio)."
          }
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "に なりたい",
            "bold": true
          },
          {
            "text": " quer dizer \"quero ser\": "
          },
          {
            "text": "いしゃに なりたいです",
            "ja": true
          },
          {
            "text": " (quero ser médico)."
          }
        ]
      }
    ],
    "pattern": "[coisa / adjetivo な] に なります · [adjetivo い] く なります",
    "examples": [
      {
        "jp": "いつ ひまに なりますか",
        "romaji": "itsu hima ni narimasu ka",
        "pt": "Quando você estará livre?"
      },
      {
        "jp": "せいじかに なりたい",
        "romaji": "seijika ni naritai",
        "pt": "Quero ser político."
      },
      {
        "jp": "とりに なりたいな",
        "romaji": "tori ni naritai na",
        "pt": "Queria ser um pássaro."
      },
      {
        "jp": "ともだちに なりたいです",
        "romaji": "tomodachi ni naritai desu",
        "pt": "Quero que sejamos amigos."
      }
    ]
  },
  {
    "id": "g30",
    "title": "Saber e conseguir: が できます",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "できます",
            "bold": true
          },
          {
            "text": " quer dizer \"consegue\" ou \"sabe fazer\", e o que se sabe fazer vem com "
          },
          {
            "text": "が",
            "bold": true
          },
          {
            "text": ": "
          },
          {
            "text": "スキーが できます",
            "ja": true
          },
          {
            "text": " (sei esquiar). O negativo é "
          },
          {
            "text": "できません",
            "bold": true
          },
          {
            "text": "."
          }
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Com um verbo no lugar do substantivo, junte o verbo no dicionário e "
          },
          {
            "text": "ことが できます",
            "ja": true
          },
          {
            "text": " (assunto que aparece mais tarde no N4). Por enquanto, pratique com substantivos."
          }
        ]
      }
    ],
    "pattern": "[coisa] が できます · [coisa] が できません",
    "examples": [
      {
        "jp": "スキーが できます",
        "romaji": "sukī ga dekimasu",
        "pt": "Eu sei esquiar."
      },
      {
        "jp": "テニスが できますか",
        "romaji": "tenisu ga dekimasu ka",
        "pt": "Você joga tênis?"
      },
      {
        "jp": "わたしには できません",
        "romaji": "watashi ni wa dekimasen",
        "pt": "Não posso fazer isso."
      },
      {
        "jp": "わたしも せつめい できません",
        "romaji": "watashi mo setsumei dekimasen",
        "pt": "Eu também não consigo explicar."
      }
    ]
  }
];

/** Ids das frases do Tatoeba usadas nos exemplos (para o crédito). */
export const GRAMMAR_N5_SENTENCE_IDS: readonly number[] = [9740661,1193930,12055984,10081492,1019460,10901764,11643291,184159,1216866,4002000,338057,2128256,170848,5748800,1039551,78718,11630865,11512358,123257,5955826,2006378,2349145,123791,5845217,4147428,2242416,10899008,2040852,741581,201956,201775,213581,10631584,442923,170842,140285,143813,5272,3552884,11776723,625254,157401,179732,12412206,2626290,10625858,10366825,9644550,354378,13254283,3347455,10194978,2672966,5323,11029605,10967392,9755700,9199895,1700213,187577,347338,8532899,432825,2412106,13218484,2969830,2701348,8733259,183436,149673,2139043,5390444,177906,9475751,125811,14007955,215019,232933,1799658,920509];
