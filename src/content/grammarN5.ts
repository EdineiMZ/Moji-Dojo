// Gerado por scripts/grammar-n5/build.mjs a partir de scripts/grammar-n5/topics.mjs. Não edite à mão.
// Exemplos: frases do Tatoeba (CC BY 2.0 FR), conferidas por scripts/grammar-n5/verify.mjs. Ver LICENSE.md.
import type { BuildExercise, GrammarTopic } from '@/data/types';

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
        "ruby": [
          {
            "text": "私",
            "reading": "わたし"
          },
          {
            "text": "は"
          },
          {
            "text": "猫",
            "reading": "ねこ"
          },
          {
            "text": "ではありません。"
          }
        ],
        "romaji": "watashi wa neko dewa arimasen",
        "pt": "Eu não sou um gato."
      },
      {
        "jp": "わたしは いしゃではありません",
        "ruby": [
          {
            "text": "私",
            "reading": "わたし"
          },
          {
            "text": "は"
          },
          {
            "text": "医者",
            "reading": "いしゃ"
          },
          {
            "text": "ではありません。"
          }
        ],
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
        "ruby": [
          {
            "text": "空腹",
            "reading": "くうふく"
          },
          {
            "text": "ではありませんでした。"
          }
        ],
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
        "ruby": [
          {
            "text": "これは"
          },
          {
            "text": "高",
            "reading": "たか"
          },
          {
            "text": "くないです。"
          }
        ],
        "romaji": "kore wa takakunai desu",
        "pt": "Isso não é caro."
      },
      {
        "jp": "きょうは さむくないです",
        "ruby": [
          {
            "text": "きょうは"
          },
          {
            "text": "寒",
            "reading": "さむ"
          },
          {
            "text": "くないです。"
          }
        ],
        "romaji": "kyō wa samukunai desu",
        "pt": "Não está frio hoje."
      },
      {
        "jp": "おいしかったです",
        "ruby": [
          {
            "text": "美味",
            "reading": "おい"
          },
          {
            "text": "しかったです。"
          }
        ],
        "romaji": "oishikatta desu",
        "pt": "Estava delicioso."
      },
      {
        "jp": "たのしかったですか",
        "ruby": [
          {
            "text": "楽",
            "reading": "たの"
          },
          {
            "text": "しかったですか。"
          }
        ],
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
        "ruby": [
          {
            "text": "勉強",
            "reading": "べんきょう"
          },
          {
            "text": "は"
          },
          {
            "text": "好",
            "reading": "す"
          },
          {
            "text": "きではありません。"
          }
        ],
        "romaji": "benkyō wa suki dewa arimasen",
        "pt": "Não gosto de estudar."
      },
      {
        "jp": "サラダは すきではありません",
        "ruby": [
          {
            "text": "サラダは"
          },
          {
            "text": "好",
            "reading": "す"
          },
          {
            "text": "きではありません。"
          }
        ],
        "romaji": "sarada wa suki dewa arimasen",
        "pt": "Eu não gosto de salada."
      },
      {
        "jp": "この まちは むかし きれいでした",
        "ruby": [
          {
            "text": "この"
          },
          {
            "text": "町",
            "reading": "まち"
          },
          {
            "text": "は"
          },
          {
            "text": "昔",
            "reading": "むかし"
          },
          {
            "text": "きれいでした。"
          }
        ],
        "romaji": "kono machi wa mukashi kirei deshita",
        "pt": "Antigamente, esta cidade era linda."
      },
      {
        "jp": "その よるは たいへん しずかでした",
        "ruby": [
          {
            "text": "その"
          },
          {
            "text": "夜",
            "reading": "よる"
          },
          {
            "text": "は"
          },
          {
            "text": "大変",
            "reading": "たいへん"
          },
          {
            "text": "静",
            "reading": "しず"
          },
          {
            "text": "かでした。"
          }
        ],
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
        "ruby": [
          {
            "text": "座",
            "reading": "すわ"
          },
          {
            "text": "って"
          },
          {
            "text": "下",
            "reading": "くだ"
          },
          {
            "text": "さい。"
          }
        ],
        "romaji": "suwatte kudasai",
        "pt": "Sente-se, por favor."
      },
      {
        "jp": "えいごで はなしてください",
        "ruby": [
          {
            "text": "英語",
            "reading": "えいご"
          },
          {
            "text": "で"
          },
          {
            "text": "話",
            "reading": "はな"
          },
          {
            "text": "してください。"
          }
        ],
        "romaji": "eigo de hanashite kudasai",
        "pt": "Por favor, fale em inglês."
      },
      {
        "jp": "たすけてください",
        "ruby": [
          {
            "text": "助",
            "reading": "たす"
          },
          {
            "text": "けてください。"
          }
        ],
        "romaji": "tasukete kudasai",
        "pt": "Me ajude, por favor!"
      },
      {
        "jp": "きてください",
        "ruby": [
          {
            "text": "来",
            "reading": "き"
          },
          {
            "text": "て"
          },
          {
            "text": "下",
            "reading": "くだ"
          },
          {
            "text": "さい。"
          }
        ],
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
        "ruby": [
          {
            "text": "何",
            "reading": "なに"
          },
          {
            "text": "をしていますか？"
          }
        ],
        "romaji": "nani o shite imasu ka",
        "pt": "O que você está fazendo?"
      },
      {
        "jp": "しっていますか",
        "ruby": [
          {
            "text": "知",
            "reading": "し"
          },
          {
            "text": "っていますか？"
          }
        ],
        "romaji": "shitte imasu ka",
        "pt": "Você sabe?"
      },
      {
        "jp": "くもっています",
        "ruby": [
          {
            "text": "曇",
            "reading": "くも"
          },
          {
            "text": "っています。"
          }
        ],
        "romaji": "kumotte imasu",
        "pt": "Está nublado."
      },
      {
        "jp": "もっています",
        "ruby": [
          {
            "text": "持",
            "reading": "も"
          },
          {
            "text": "っています。"
          }
        ],
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
        "ruby": [
          {
            "text": "行",
            "reading": "い"
          },
          {
            "text": "かないでください。"
          }
        ],
        "romaji": "ikanaide kudasai",
        "pt": "Por favor, não vá embora."
      },
      {
        "jp": "しんぱい しないでください",
        "ruby": [
          {
            "text": "心配",
            "reading": "しんぱい"
          },
          {
            "text": "しないでください。"
          }
        ],
        "romaji": "shinpai shinaide kudasai",
        "pt": "Não te preocupes."
      },
      {
        "jp": "うごかないでください",
        "ruby": [
          {
            "text": "動",
            "reading": "うご"
          },
          {
            "text": "かないでください。"
          }
        ],
        "romaji": "ugokanaide kudasai",
        "pt": "Não se mexa, por favor."
      },
      {
        "jp": "おとを たてないでください",
        "ruby": [
          {
            "text": "音",
            "reading": "おと"
          },
          {
            "text": "を"
          },
          {
            "text": "立",
            "reading": "た"
          },
          {
            "text": "てないでください。"
          }
        ],
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
        "ruby": [
          {
            "text": "入",
            "reading": "はい"
          },
          {
            "text": "ってもいいですか？"
          }
        ],
        "romaji": "haitte mo ii desu ka",
        "pt": "Posso entrar?"
      },
      {
        "jp": "たべてもいいですか",
        "ruby": [
          {
            "text": "食",
            "reading": "た"
          },
          {
            "text": "べてもいいですか？"
          }
        ],
        "romaji": "tabete mo ii desu ka",
        "pt": "Posso comer?"
      },
      {
        "jp": "まどを あけてもいいですか",
        "ruby": [
          {
            "text": "窓",
            "reading": "まど"
          },
          {
            "text": "を"
          },
          {
            "text": "開",
            "reading": "あ"
          },
          {
            "text": "けてもいいですか？"
          }
        ],
        "romaji": "mado o akete mo ii desu ka",
        "pt": "Posso abrir a janela?"
      },
      {
        "jp": "すわってもいいですか",
        "ruby": [
          {
            "text": "座",
            "reading": "すわ"
          },
          {
            "text": "ってもいいですか。"
          }
        ],
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
        "ruby": [
          {
            "text": "食",
            "reading": "た"
          },
          {
            "text": "べてはいけません。"
          }
        ],
        "romaji": "tabete wa ikemasen",
        "pt": "Não coma."
      },
      {
        "jp": "テレビを みてはいけません",
        "ruby": [
          {
            "text": "テレビを"
          },
          {
            "text": "見",
            "reading": "み"
          },
          {
            "text": "てはいけません。"
          }
        ],
        "romaji": "terebi o mite wa ikemasen",
        "pt": "Não assista televisão."
      },
      {
        "jp": "ドアを しめてはいけません",
        "ruby": [
          {
            "text": "ドアを"
          },
          {
            "text": "閉",
            "reading": "し"
          },
          {
            "text": "めてはいけません。"
          }
        ],
        "romaji": "doa o shimete wa ikemasen",
        "pt": "Não feche a porta!"
      },
      {
        "jp": "そこへ いってはいけません",
        "ruby": [
          {
            "text": "そこへ"
          },
          {
            "text": "行",
            "reading": "い"
          },
          {
            "text": "ってはいけません。"
          }
        ],
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
        "ruby": [
          {
            "text": "戻",
            "reading": "もど"
          },
          {
            "text": "りましょう。"
          }
        ],
        "romaji": "modorimashō",
        "pt": "Vamos voltar."
      },
      {
        "jp": "はじめましょう",
        "ruby": [
          {
            "text": "始",
            "reading": "はじ"
          },
          {
            "text": "めましょう。"
          }
        ],
        "romaji": "hajimemashō",
        "pt": "Vamos começar."
      },
      {
        "jp": "すわりませんか",
        "ruby": [
          {
            "text": "座",
            "reading": "すわ"
          },
          {
            "text": "りませんか。"
          }
        ],
        "romaji": "suwarimasen ka",
        "pt": "Você não quer se sentar?"
      },
      {
        "jp": "はしりませんか",
        "ruby": [
          {
            "text": "走",
            "reading": "はし"
          },
          {
            "text": "りませんか。"
          }
        ],
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
        "ruby": [
          {
            "text": "水",
            "reading": "みず"
          },
          {
            "text": "が"
          },
          {
            "text": "欲",
            "reading": "ほ"
          },
          {
            "text": "しい。"
          }
        ],
        "romaji": "mizu ga hoshii",
        "pt": "Quero água."
      },
      {
        "jp": "あめが ほしい",
        "ruby": [
          {
            "text": "飴",
            "reading": "あめ"
          },
          {
            "text": "がほしい。"
          }
        ],
        "romaji": "ame ga hoshii",
        "pt": "Eu quero uma bala."
      },
      {
        "jp": "なにが ほしいの",
        "ruby": [
          {
            "text": "何",
            "reading": "なに"
          },
          {
            "text": "が"
          },
          {
            "text": "欲",
            "reading": "ほ"
          },
          {
            "text": "しいの？"
          }
        ],
        "romaji": "nani ga hoshii no",
        "pt": "O que você quer?"
      },
      {
        "jp": "かのじょが ほしい",
        "ruby": [
          {
            "text": "彼女",
            "reading": "かのじょ"
          },
          {
            "text": "が"
          },
          {
            "text": "欲",
            "reading": "ほ"
          },
          {
            "text": "しい。"
          }
        ],
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
        "ruby": [
          {
            "text": "中国",
            "reading": "ちゅうごく"
          },
          {
            "text": "は"
          },
          {
            "text": "日本",
            "reading": "にほん"
          },
          {
            "text": "より"
          },
          {
            "text": "大",
            "reading": "おお"
          },
          {
            "text": "きいです。"
          }
        ],
        "romaji": "chūgoku wa nihon yori ōkii desu",
        "pt": "A China é maior que o Japão."
      },
      {
        "jp": "わたしは きみより せが たかい",
        "ruby": [
          {
            "text": "私",
            "reading": "わたし"
          },
          {
            "text": "は"
          },
          {
            "text": "君",
            "reading": "きみ"
          },
          {
            "text": "より"
          },
          {
            "text": "背",
            "reading": "せ"
          },
          {
            "text": "が"
          },
          {
            "text": "高",
            "reading": "たか"
          },
          {
            "text": "い。"
          }
        ],
        "romaji": "watashi wa kimi yori se ga takai",
        "pt": "Sou mais alto que você."
      },
      {
        "jp": "きんは ぎんより おもい",
        "ruby": [
          {
            "text": "金",
            "reading": "きん"
          },
          {
            "text": "は"
          },
          {
            "text": "銀",
            "reading": "ぎん"
          },
          {
            "text": "より"
          },
          {
            "text": "重",
            "reading": "おも"
          },
          {
            "text": "い。"
          }
        ],
        "romaji": "kin wa gin yori omoi",
        "pt": "O ouro é mais pesado do que a prata."
      },
      {
        "jp": "こっちの ほうが やすいよ",
        "ruby": [
          {
            "text": "こっちの"
          },
          {
            "text": "方",
            "reading": "ほう"
          },
          {
            "text": "が"
          },
          {
            "text": "安",
            "reading": "やす"
          },
          {
            "text": "いよ。"
          }
        ],
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
        "ruby": [
          {
            "text": "トムが"
          },
          {
            "text": "一番",
            "reading": "いちばん"
          },
          {
            "text": "強",
            "reading": "つよ"
          },
          {
            "text": "い。"
          }
        ],
        "romaji": "tomu ga ichiban tsuyoi",
        "pt": "Tom é o mais forte."
      },
      {
        "jp": "わたしが いちばん わかいです",
        "ruby": [
          {
            "text": "私",
            "reading": "わたし"
          },
          {
            "text": "が"
          },
          {
            "text": "一番",
            "reading": "いちばん"
          },
          {
            "text": "若",
            "reading": "わか"
          },
          {
            "text": "いです。"
          }
        ],
        "romaji": "watashi ga ichiban wakai desu",
        "pt": "Sou o mais jovem."
      },
      {
        "jp": "なんようびが いちばん すき",
        "ruby": [
          {
            "text": "何",
            "reading": "なん"
          },
          {
            "text": "曜日",
            "reading": "ようび"
          },
          {
            "text": "が"
          },
          {
            "text": "一番",
            "reading": "いちばん"
          },
          {
            "text": "好",
            "reading": "す"
          },
          {
            "text": "き？"
          }
        ],
        "romaji": "nan'yōbi ga ichiban suki",
        "pt": "Qual é o seu dia da semana favorito?"
      },
      {
        "jp": "どの きょうかが いちばん すき",
        "ruby": [
          {
            "text": "どの"
          },
          {
            "text": "教科",
            "reading": "きょうか"
          },
          {
            "text": "が"
          },
          {
            "text": "一番",
            "reading": "いちばん"
          },
          {
            "text": "好",
            "reading": "す"
          },
          {
            "text": "き？"
          }
        ],
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
        "ruby": [
          {
            "text": "猫",
            "reading": "ねこ"
          },
          {
            "text": "が"
          },
          {
            "text": "好",
            "reading": "す"
          },
          {
            "text": "きです。"
          }
        ],
        "romaji": "neko ga suki desu",
        "pt": "Eu gosto de gatos."
      },
      {
        "jp": "おんがくが すきです",
        "ruby": [
          {
            "text": "音楽",
            "reading": "おんがく"
          },
          {
            "text": "が"
          },
          {
            "text": "好",
            "reading": "す"
          },
          {
            "text": "きです。"
          }
        ],
        "romaji": "ongaku ga suki desu",
        "pt": "Eu gosto de música."
      },
      {
        "jp": "いぬが すきですか",
        "ruby": [
          {
            "text": "犬",
            "reading": "いぬ"
          },
          {
            "text": "が"
          },
          {
            "text": "好",
            "reading": "す"
          },
          {
            "text": "きですか？"
          }
        ],
        "romaji": "inu ga suki desu ka",
        "pt": "Você gosta de cães?"
      },
      {
        "jp": "べんきょうが すきです",
        "ruby": [
          {
            "text": "勉強",
            "reading": "べんきょう"
          },
          {
            "text": "が"
          },
          {
            "text": "好",
            "reading": "す"
          },
          {
            "text": "きです。"
          }
        ],
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
        "ruby": [
          {
            "text": "中国",
            "reading": "ちゅうごく"
          },
          {
            "text": "から"
          },
          {
            "text": "来",
            "reading": "き"
          },
          {
            "text": "ました。"
          }
        ],
        "romaji": "chūgoku kara kimashita",
        "pt": "Eu vim da China."
      },
      {
        "jp": "どこから きましたか",
        "ruby": [
          {
            "text": "どこから"
          },
          {
            "text": "来",
            "reading": "き"
          },
          {
            "text": "ましたか？"
          }
        ],
        "romaji": "doko kara kimashita ka",
        "pt": "De onde é você?"
      },
      {
        "jp": "じゅぎょうは じゅうじからです",
        "ruby": [
          {
            "text": "授業",
            "reading": "じゅぎょう"
          },
          {
            "text": "は"
          },
          {
            "text": "10",
            "reading": "じゅう"
          },
          {
            "text": "時",
            "reading": "じ"
          },
          {
            "text": "からです。"
          }
        ],
        "romaji": "jugyō wa jūji kara desu",
        "pt": "A nossa aula começa às 10h."
      },
      {
        "jp": "にじはんまで まちます",
        "ruby": [
          {
            "text": "二",
            "reading": "に"
          },
          {
            "text": "時半",
            "reading": "じはん"
          },
          {
            "text": "まで"
          },
          {
            "text": "待",
            "reading": "ま"
          },
          {
            "text": "ちます。"
          }
        ],
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
        "ruby": [
          {
            "text": "寒",
            "reading": "さむ"
          },
          {
            "text": "いから、"
          },
          {
            "text": "窓",
            "reading": "まど"
          },
          {
            "text": "閉",
            "reading": "し"
          },
          {
            "text": "めてもいい？"
          }
        ],
        "romaji": "samui kara mado shimete mo ii",
        "pt": "Estou com frio. Posso fechar a janela?"
      },
      {
        "jp": "ねむいから ねるね",
        "ruby": [
          {
            "text": "眠",
            "reading": "ねむ"
          },
          {
            "text": "いから、"
          },
          {
            "text": "寝",
            "reading": "ね"
          },
          {
            "text": "るね。"
          }
        ],
        "romaji": "nemui kara neru ne",
        "pt": "Eu estou com sono, então estou indo para a cama."
      },
      {
        "jp": "ほうりつですから",
        "ruby": [
          {
            "text": "法律",
            "reading": "ほうりつ"
          },
          {
            "text": "ですから。"
          }
        ],
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
        "ruby": [
          {
            "text": "何",
            "reading": "なに"
          },
          {
            "text": "を"
          },
          {
            "text": "飲",
            "reading": "の"
          },
          {
            "text": "みますか。"
          }
        ],
        "romaji": "nani o nomimasu ka",
        "pt": "O que você quer beber?"
      },
      {
        "jp": "かれは だれですか",
        "ruby": [
          {
            "text": "彼",
            "reading": "かれ"
          },
          {
            "text": "は"
          },
          {
            "text": "誰",
            "reading": "だれ"
          },
          {
            "text": "ですか。"
          }
        ],
        "romaji": "kare wa dare desu ka",
        "pt": "Quem é ele?"
      },
      {
        "jp": "だいどころは どこ",
        "ruby": [
          {
            "text": "台所",
            "reading": "だいどころ"
          },
          {
            "text": "はどこ？"
          }
        ],
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
        "ruby": [
          {
            "text": "いま"
          },
          {
            "text": "何",
            "reading": "なん"
          },
          {
            "text": "時",
            "reading": "じ"
          },
          {
            "text": "ですか？"
          }
        ],
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
        "ruby": [
          {
            "text": "もう"
          },
          {
            "text": "食",
            "reading": "た"
          },
          {
            "text": "べましたか？"
          }
        ],
        "romaji": "mō tabemashita ka",
        "pt": "Você já comeu?"
      },
      {
        "jp": "もう たべました",
        "ruby": [
          {
            "text": "もう"
          },
          {
            "text": "食",
            "reading": "た"
          },
          {
            "text": "べました。"
          }
        ],
        "romaji": "mō tabemashita",
        "pt": "Já comi."
      },
      {
        "jp": "トムは まだ きてません",
        "ruby": [
          {
            "text": "トムはまだ"
          },
          {
            "text": "来",
            "reading": "き"
          },
          {
            "text": "てません。"
          }
        ],
        "romaji": "tomu wa mada kitemasen",
        "pt": "Tom ainda não chegou."
      },
      {
        "jp": "まだ さむい",
        "ruby": [
          {
            "text": "まだ"
          },
          {
            "text": "寒",
            "reading": "さむ"
          },
          {
            "text": "い？"
          }
        ],
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
        "ruby": [
          {
            "text": "机",
            "reading": "つくえ"
          },
          {
            "text": "の"
          },
          {
            "text": "上",
            "reading": "うえ"
          },
          {
            "text": "に"
          },
          {
            "text": "鍵",
            "reading": "かぎ"
          },
          {
            "text": "がある。"
          }
        ],
        "romaji": "tsukue no ue ni kagi ga aru",
        "pt": "Tem uma chave na escrivaninha."
      },
      {
        "jp": "じしょが つくえの うえに ある",
        "ruby": [
          {
            "text": "辞書",
            "reading": "じしょ"
          },
          {
            "text": "が"
          },
          {
            "text": "机",
            "reading": "つくえ"
          },
          {
            "text": "の"
          },
          {
            "text": "上",
            "reading": "うえ"
          },
          {
            "text": "にある。"
          }
        ],
        "romaji": "jisho ga tsukue no ue ni aru",
        "pt": "Tem um dicionário em cima da mesa."
      },
      {
        "jp": "いぬは いえの なかに いる",
        "ruby": [
          {
            "text": "犬",
            "reading": "いぬ"
          },
          {
            "text": "は"
          },
          {
            "text": "家",
            "reading": "いえ"
          },
          {
            "text": "の"
          },
          {
            "text": "中",
            "reading": "なか"
          },
          {
            "text": "にいる。"
          }
        ],
        "romaji": "inu wa ie no naka ni iru",
        "pt": "O cachorro está na casa."
      },
      {
        "jp": "はしの うえに いぬが いる",
        "ruby": [
          {
            "text": "橋",
            "reading": "はし"
          },
          {
            "text": "の"
          },
          {
            "text": "上",
            "reading": "うえ"
          },
          {
            "text": "に"
          },
          {
            "text": "犬",
            "reading": "いぬ"
          },
          {
            "text": "がいる。"
          }
        ],
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
        "ruby": [
          {
            "text": "いつ"
          },
          {
            "text": "暇",
            "reading": "ひま"
          },
          {
            "text": "になりますか？"
          }
        ],
        "romaji": "itsu hima ni narimasu ka",
        "pt": "Quando você estará livre?"
      },
      {
        "jp": "せいじかに なりたい",
        "ruby": [
          {
            "text": "政治",
            "reading": "せいじ"
          },
          {
            "text": "家",
            "reading": "か"
          },
          {
            "text": "になりたい。"
          }
        ],
        "romaji": "seijika ni naritai",
        "pt": "Quero ser político."
      },
      {
        "jp": "とりに なりたいな",
        "ruby": [
          {
            "text": "鳥",
            "reading": "とり"
          },
          {
            "text": "になりたいな。"
          }
        ],
        "romaji": "tori ni naritai na",
        "pt": "Queria ser um pássaro."
      },
      {
        "jp": "ともだちに なりたいです",
        "ruby": [
          {
            "text": "友達",
            "reading": "ともだち"
          },
          {
            "text": "になりたいです。"
          }
        ],
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
        "ruby": [
          {
            "text": "私",
            "reading": "わたし"
          },
          {
            "text": "にはできません。"
          }
        ],
        "romaji": "watashi ni wa dekimasen",
        "pt": "Não posso fazer isso."
      },
      {
        "jp": "わたしも せつめい できません",
        "ruby": [
          {
            "text": "私",
            "reading": "わたし"
          },
          {
            "text": "も"
          },
          {
            "text": "説明",
            "reading": "せつめい"
          },
          {
            "text": "できません。"
          }
        ],
        "romaji": "watashi mo setsumei dekimasen",
        "pt": "Eu também não consigo explicar."
      }
    ]
  },
  {
    "id": "g31",
    "title": "Antes de fazer: 〜まえに",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "Para dizer "
          },
          {
            "text": "antes de",
            "bold": true
          },
          {
            "text": " fazer algo, use o verbo no "
          },
          {
            "text": "dicionário",
            "bold": true
          },
          {
            "text": " (a forma simples, como "
          },
          {
            "text": "ねる",
            "ja": true
          },
          {
            "text": ", "
          },
          {
            "text": "いく",
            "ja": true
          },
          {
            "text": ") + "
          },
          {
            "text": "まえに",
            "bold": true
          },
          {
            "text": ": "
          },
          {
            "text": "ねる まえに",
            "ja": true
          },
          {
            "text": " = antes de dormir. O verbo que vem antes de まえに "
          },
          {
            "text": "não",
            "bold": true
          },
          {
            "text": " fica em ます."
          }
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "A ação principal fica no fim da frase: "
          },
          {
            "text": "いく まえに でんわ します",
            "ja": true
          },
          {
            "text": " (ligo antes de ir)."
          }
        ]
      }
    ],
    "pattern": "[verbo no dicionário] まえに [ação principal]",
    "examples": [
      {
        "jp": "かれは ねる まえに ほんを よむ",
        "ruby": [
          {
            "text": "彼",
            "reading": "かれ"
          },
          {
            "text": "は"
          },
          {
            "text": "寝",
            "reading": "ね"
          },
          {
            "text": "る"
          },
          {
            "text": "前",
            "reading": "まえ"
          },
          {
            "text": "に"
          },
          {
            "text": "本",
            "reading": "ほん"
          },
          {
            "text": "を"
          },
          {
            "text": "読",
            "reading": "よ"
          },
          {
            "text": "む。"
          }
        ],
        "romaji": "kare wa neru mae ni hon o yomu",
        "pt": "Ele lê antes de ir para a cama."
      },
      {
        "jp": "いく まえに でんわ します",
        "ruby": [
          {
            "text": "行",
            "reading": "い"
          },
          {
            "text": "く"
          },
          {
            "text": "前",
            "reading": "まえ"
          },
          {
            "text": "に"
          },
          {
            "text": "電話",
            "reading": "でんわ"
          },
          {
            "text": "します。"
          }
        ],
        "romaji": "iku mae ni denwa shimasu",
        "pt": "Ligarei para ele antes de ir."
      },
      {
        "jp": "くる まえに でんわを してください",
        "ruby": [
          {
            "text": "来",
            "reading": "く"
          },
          {
            "text": "る"
          },
          {
            "text": "前",
            "reading": "まえ"
          },
          {
            "text": "に"
          },
          {
            "text": "電話",
            "reading": "でんわ"
          },
          {
            "text": "をしてください。"
          }
        ],
        "romaji": "kuru mae ni denwa o shite kudasai",
        "pt": "Por favor, me ligue antes de vir."
      }
    ]
  },
  {
    "id": "g32",
    "title": "Depois de fazer: 〜てから e あとで",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "Para dizer "
          },
          {
            "text": "depois de",
            "bold": true
          },
          {
            "text": " fazer algo, use a forma "
          },
          {
            "text": "て",
            "bold": true
          },
          {
            "text": " do verbo + "
          },
          {
            "text": "から",
            "bold": true
          },
          {
            "text": ": "
          },
          {
            "text": "たべてから",
            "ja": true
          },
          {
            "text": " = depois de comer. A ação que vem depois fica no fim da frase."
          }
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Com um substantivo, use "
          },
          {
            "text": "の あとで",
            "bold": true
          },
          {
            "text": ": "
          },
          {
            "text": "しごとの あとで",
            "ja": true
          },
          {
            "text": " = depois do trabalho. E "
          },
          {
            "text": "あとで",
            "bold": true
          },
          {
            "text": " sozinho quer dizer \"mais tarde\": "
          },
          {
            "text": "あとで でんわ します",
            "ja": true
          },
          {
            "text": "."
          }
        ]
      }
    ],
    "pattern": "[verbo na forma て] から · [substantivo] の あとで · あとで",
    "examples": [
      {
        "jp": "たべてから ねたよ",
        "ruby": [
          {
            "text": "食",
            "reading": "た"
          },
          {
            "text": "べてから"
          },
          {
            "text": "寝",
            "reading": "ね"
          },
          {
            "text": "たよ。"
          }
        ],
        "romaji": "tabetekara neta yo",
        "pt": "Depois que nós comemos, fomos dormir."
      },
      {
        "jp": "かえってから べんきょう するよ",
        "ruby": [
          {
            "text": "帰",
            "reading": "かえ"
          },
          {
            "text": "ってから"
          },
          {
            "text": "勉強",
            "reading": "べんきょう"
          },
          {
            "text": "するよ。"
          }
        ],
        "romaji": "kaettekara benkyō suru yo",
        "pt": "Vou estudar depois que chegar em casa."
      },
      {
        "jp": "あとで でんわ します",
        "ruby": [
          {
            "text": "後",
            "reading": "あと"
          },
          {
            "text": "で"
          },
          {
            "text": "電話",
            "reading": "でんわ"
          },
          {
            "text": "します。"
          }
        ],
        "romaji": "atode denwa shimasu",
        "pt": "Te ligo de volta mais tarde."
      },
      {
        "jp": "しごとの あとで いっぱい どう",
        "ruby": [
          {
            "text": "仕事",
            "reading": "しごと"
          },
          {
            "text": "の"
          },
          {
            "text": "後",
            "reading": "あと"
          },
          {
            "text": "で、"
          },
          {
            "text": "一杯",
            "reading": "いっぱい"
          },
          {
            "text": "どう？"
          }
        ],
        "romaji": "shigoto no ato de ippai dō",
        "pt": "E se sairmos para beber após o trabalho?"
      }
    ]
  },
  {
    "id": "g33",
    "title": "Fazer duas coisas juntas: 〜ながら",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "Quando "
          },
          {
            "text": "a mesma pessoa",
            "bold": true
          },
          {
            "text": " faz duas coisas ao mesmo tempo, tire o "
          },
          {
            "text": "ます",
            "bold": true
          },
          {
            "text": " do verbo e ponha "
          },
          {
            "text": "ながら",
            "bold": true
          },
          {
            "text": ": "
          },
          {
            "text": "たべながら",
            "ja": true
          },
          {
            "text": " = comendo, enquanto come."
          }
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "A ação principal fica no fim da frase, e a que vem com ながら é a de fundo: "
          },
          {
            "text": "たべながら はなす",
            "ja": true
          },
          {
            "text": " (falar comendo)."
          }
        ]
      }
    ],
    "pattern": "[verbo sem ます] ながら [ação principal]",
    "examples": [
      {
        "jp": "たべながら はなしちゃ ダメ だよ",
        "ruby": [
          {
            "text": "食",
            "reading": "た"
          },
          {
            "text": "べながら"
          },
          {
            "text": "話",
            "reading": "はな"
          },
          {
            "text": "しちゃダメだよ。"
          }
        ],
        "romaji": "tabenagara hanashicha dame da yo",
        "pt": "Não fale enquanto estiver comendo."
      },
      {
        "jp": "ははは ほほえみながら いいました",
        "ruby": [
          {
            "text": "母",
            "reading": "はは"
          },
          {
            "text": "は"
          },
          {
            "text": "微笑",
            "reading": "ほほえ"
          },
          {
            "text": "みながら"
          },
          {
            "text": "言",
            "reading": "い"
          },
          {
            "text": "いました。"
          }
        ],
        "romaji": "haha wa hohoeminagara iimashita",
        "pt": "A minha mãe disse isso com um sorriso."
      }
    ]
  },
  {
    "id": "g34",
    "title": "Ir fazer algo: 〜に いきます",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "Para dizer "
          },
          {
            "text": "ir fazer",
            "bold": true
          },
          {
            "text": " algo, tire o "
          },
          {
            "text": "ます",
            "bold": true
          },
          {
            "text": " do verbo e ponha "
          },
          {
            "text": "に",
            "bold": true
          },
          {
            "text": " + "
          },
          {
            "text": "いきます",
            "bold": true
          },
          {
            "text": ": "
          },
          {
            "text": "たべに いきます",
            "ja": true
          },
          {
            "text": " = vou comer. Com uma palavra de ação (compras, filme), é só "
          },
          {
            "text": "に",
            "bold": true
          },
          {
            "text": ": "
          },
          {
            "text": "かいものに いきます",
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
            "text": "Serve também com "
          },
          {
            "text": "きます",
            "bold": true
          },
          {
            "text": " (vir) e "
          },
          {
            "text": "かえります",
            "bold": true
          },
          {
            "text": " (voltar)."
          }
        ]
      }
    ],
    "pattern": "[verbo sem ます] に いきます · [ação] に いきます",
    "examples": [
      {
        "jp": "こんや すしを たべに いきませんか",
        "ruby": [
          {
            "text": "今夜",
            "reading": "こんや"
          },
          {
            "text": "、"
          },
          {
            "text": "寿司",
            "reading": "すし"
          },
          {
            "text": "を"
          },
          {
            "text": "食",
            "reading": "た"
          },
          {
            "text": "べに"
          },
          {
            "text": "行",
            "reading": "い"
          },
          {
            "text": "きませんか。"
          }
        ],
        "romaji": "kon'ya sushi o tabe ni ikimasen ka",
        "pt": "Você quer comer sushi hoje à noite?"
      },
      {
        "jp": "えいがを みに いきませんか",
        "ruby": [
          {
            "text": "映画",
            "reading": "えいが"
          },
          {
            "text": "を"
          },
          {
            "text": "見",
            "reading": "み"
          },
          {
            "text": "に"
          },
          {
            "text": "行",
            "reading": "い"
          },
          {
            "text": "きませんか？"
          }
        ],
        "romaji": "eiga o mi ni ikimasen ka",
        "pt": "Por que não vamos ver um filme?"
      },
      {
        "jp": "あした かいものに いきます",
        "ruby": [
          {
            "text": "明日",
            "reading": "あした"
          },
          {
            "text": "買",
            "reading": "か"
          },
          {
            "text": "い"
          },
          {
            "text": "物",
            "reading": "もの"
          },
          {
            "text": "に"
          },
          {
            "text": "行",
            "reading": "い"
          },
          {
            "text": "きます。"
          }
        ],
        "romaji": "ashita kaimono ni ikimasu",
        "pt": "Amanhã vou fazer compras."
      },
      {
        "jp": "わたしは よく えいがを みに いく",
        "ruby": [
          {
            "text": "私",
            "reading": "わたし"
          },
          {
            "text": "はよく"
          },
          {
            "text": "映画",
            "reading": "えいが"
          },
          {
            "text": "を"
          },
          {
            "text": "見",
            "reading": "み"
          },
          {
            "text": "に"
          },
          {
            "text": "行",
            "reading": "い"
          },
          {
            "text": "く。"
          }
        ],
        "romaji": "watashi wa yoku eiga o mi ni iku",
        "pt": "Vou ao cinema com frequência."
      }
    ]
  },
  {
    "id": "g35",
    "title": "Com que frequência: いつも, よく, ときどき, あまり, ぜんぜん",
    "body": [
      {
        "kind": "table",
        "rows": [
          [
            {
              "text": "palavra",
              "header": true
            },
            {
              "text": "quer dizer",
              "header": true
            },
            {
              "text": "frase",
              "header": true
            }
          ],
          [
            {
              "text": "いつも",
              "ja": true
            },
            {
              "text": "sempre"
            },
            {
              "text": "afirmativa"
            }
          ],
          [
            {
              "text": "よく",
              "ja": true
            },
            {
              "text": "muitas vezes"
            },
            {
              "text": "afirmativa"
            }
          ],
          [
            {
              "text": "ときどき",
              "ja": true
            },
            {
              "text": "às vezes"
            },
            {
              "text": "afirmativa"
            }
          ],
          [
            {
              "text": "あまり",
              "ja": true
            },
            {
              "text": "pouco, raramente"
            },
            {
              "text": "negativa"
            }
          ],
          [
            {
              "text": "ぜんぜん",
              "ja": true
            },
            {
              "text": "de jeito nenhum, nunca"
            },
            {
              "text": "negativa"
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "あまり",
            "bold": true
          },
          {
            "text": " e "
          },
          {
            "text": "ぜんぜん",
            "bold": true
          },
          {
            "text": " pedem o final "
          },
          {
            "text": "negativo",
            "bold": true
          },
          {
            "text": ": "
          },
          {
            "text": "あまり みえない",
            "ja": true
          },
          {
            "text": ", "
          },
          {
            "text": "ぜんぜん わかりません",
            "ja": true
          },
          {
            "text": ". O advérbio vem antes do verbo."
          }
        ]
      }
    ],
    "pattern": "[いつも / よく / ときどき] verbo · [あまり / ぜんぜん] verbo negativo",
    "examples": [
      {
        "jp": "ときどき ゴルフを します",
        "ruby": [
          {
            "text": "時々",
            "reading": "ときどき"
          },
          {
            "text": "ゴルフをします。"
          }
        ],
        "romaji": "tokidoki gorufu o shimasu",
        "pt": "De vez em quando eu jogo golfe."
      },
      {
        "jp": "いつも いそがしいの",
        "ruby": [
          {
            "text": "いつも"
          },
          {
            "text": "忙",
            "reading": "いそが"
          },
          {
            "text": "しいの？"
          }
        ],
        "romaji": "itsumo isogashii no",
        "pt": "Você está sempre ocupado?"
      },
      {
        "jp": "あまり みえない",
        "ruby": [
          {
            "text": "あまり"
          },
          {
            "text": "見",
            "reading": "み"
          },
          {
            "text": "えない。"
          }
        ],
        "romaji": "amari mienai",
        "pt": "Eu o vejo raramente."
      },
      {
        "jp": "ぜんぜん つかれてません",
        "ruby": [
          {
            "text": "全然",
            "reading": "ぜんぜん"
          },
          {
            "text": "疲",
            "reading": "つか"
          },
          {
            "text": "れてません。"
          }
        ],
        "romaji": "zenzen tsukarete masen",
        "pt": "Não estou nem um pouco cansado."
      }
    ]
  },
  {
    "id": "g36",
    "title": "Oferecer ajuda: 〜ましょうか",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "Além de convidar (\"vamos\"), "
          },
          {
            "text": "ましょうか",
            "bold": true
          },
          {
            "text": " serve para "
          },
          {
            "text": "se oferecer",
            "bold": true
          },
          {
            "text": ": tire o ます do verbo e ponha ましょうか. "
          },
          {
            "text": "てつだいましょうか",
            "ja": true
          },
          {
            "text": " = quer que eu ajude? Quem oferece é você; a outra pessoa responde sim ou não."
          }
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Também pergunta \"vamos?\" quando o grupo decide junto: "
          },
          {
            "text": "いきましょうか",
            "ja": true
          },
          {
            "text": "."
          }
        ]
      }
    ],
    "pattern": "[verbo sem ます] ましょうか",
    "examples": [
      {
        "jp": "なにか てつだいましょうか",
        "ruby": [
          {
            "text": "何",
            "reading": "なに"
          },
          {
            "text": "か"
          },
          {
            "text": "手伝",
            "reading": "てつだ"
          },
          {
            "text": "いましょうか？"
          }
        ],
        "romaji": "nani ka tetsudaimashō ka",
        "pt": "Posso ajudar com alguma coisa?"
      },
      {
        "jp": "まどを あけましょうか",
        "ruby": [
          {
            "text": "窓",
            "reading": "まど"
          },
          {
            "text": "を"
          },
          {
            "text": "開",
            "reading": "あ"
          },
          {
            "text": "けましょうか。"
          }
        ],
        "romaji": "mado o akemashō ka",
        "pt": "Você quer que eu abra a janela?"
      },
      {
        "jp": "おてつだい しましょうか",
        "ruby": [
          {
            "text": "お"
          },
          {
            "text": "手伝",
            "reading": "てつだ"
          },
          {
            "text": "いしましょうか。"
          }
        ],
        "romaji": "otetsudai shimashō ka",
        "pt": "Quer que eu te ajude?"
      },
      {
        "jp": "いきましょうか",
        "ruby": [
          {
            "text": "行",
            "reading": "い"
          },
          {
            "text": "きましょうか。"
          }
        ],
        "romaji": "ikimashō ka",
        "pt": "Vamos?"
      }
    ]
  },
  {
    "id": "g37",
    "title": "Só e apenas: だけ",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "だけ",
            "bold": true
          },
          {
            "text": " quer dizer \"só\", \"apenas\", e vem logo depois da palavra: "
          },
          {
            "text": "ひとつだけ",
            "ja": true
          },
          {
            "text": " (só um), "
          },
          {
            "text": "これだけ",
            "ja": true
          },
          {
            "text": " (só isto)."
          }
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Pode vir antes de outra partícula: "
          },
          {
            "text": "それだけで",
            "ja": true
          },
          {
            "text": " (só com isso)."
          }
        ]
      }
    ],
    "pattern": "[palavra] だけ",
    "examples": [
      {
        "jp": "ねがいは ひとつ だけ",
        "ruby": [
          {
            "text": "願",
            "reading": "ねが"
          },
          {
            "text": "いは"
          },
          {
            "text": "一",
            "reading": "ひと"
          },
          {
            "text": "つだけ。"
          }
        ],
        "romaji": "negai wa hitotsu dake",
        "pt": "Só tenho um desejo."
      },
      {
        "jp": "それ だけで けっこうです",
        "ruby": [
          {
            "text": "それだけで"
          },
          {
            "text": "結構",
            "reading": "けっこう"
          },
          {
            "text": "です。"
          }
        ],
        "romaji": "sore dake de kekkō desu",
        "pt": "Isso é tudo."
      }
    ]
  },
  {
    "id": "g38",
    "title": "Algo e alguém: なにか, だれか, どこか",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "Junte "
          },
          {
            "text": "か",
            "bold": true
          },
          {
            "text": " a uma palavra de pergunta e ela vira \"algum\": "
          },
          {
            "text": "なにか",
            "ja": true
          },
          {
            "text": " (alguma coisa), "
          },
          {
            "text": "だれか",
            "ja": true
          },
          {
            "text": " (alguém), "
          },
          {
            "text": "どこか",
            "ja": true
          },
          {
            "text": " (em algum lugar), "
          },
          {
            "text": "いつか",
            "ja": true
          },
          {
            "text": " (algum dia)."
          }
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "É diferente de perguntar \"o quê?\": "
          },
          {
            "text": "なにか のむ?",
            "ja": true
          },
          {
            "text": " quer dizer \"toma alguma coisa?\"."
          }
        ]
      }
    ],
    "pattern": "[なに / だれ / どこ / いつ] か",
    "examples": [
      {
        "jp": "なにか のむ",
        "ruby": [
          {
            "text": "何",
            "reading": "なに"
          },
          {
            "text": "か"
          },
          {
            "text": "飲",
            "reading": "の"
          },
          {
            "text": "む？"
          }
        ],
        "romaji": "nani ka nomu",
        "pt": "Quer beber algo?"
      },
      {
        "jp": "なにか みえる",
        "ruby": [
          {
            "text": "何",
            "reading": "なに"
          },
          {
            "text": "か"
          },
          {
            "text": "見",
            "reading": "み"
          },
          {
            "text": "える？"
          }
        ],
        "romaji": "nani ka mieru",
        "pt": "Você consegue ver algo?"
      },
      {
        "jp": "だれか いる",
        "ruby": [
          {
            "text": "誰",
            "reading": "だれ"
          },
          {
            "text": "かいる？"
          }
        ],
        "romaji": "dare ka iru",
        "pt": "Tem alguém aí?"
      },
      {
        "jp": "だれか くる",
        "ruby": [
          {
            "text": "誰",
            "reading": "だれ"
          },
          {
            "text": "か"
          },
          {
            "text": "来",
            "reading": "く"
          },
          {
            "text": "る。"
          }
        ],
        "romaji": "dare ka kuru",
        "pt": "Alguém está vindo."
      }
    ]
  },
  {
    "id": "g39",
    "title": "Quem faz: a partícula が",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "が",
            "bold": true
          },
          {
            "text": " marca o "
          },
          {
            "text": "sujeito",
            "bold": true
          },
          {
            "text": " quando ele é uma informação nova ou o foco da frase. Use "
          },
          {
            "text": "が",
            "bold": true
          },
          {
            "text": " em três casos principais:"
          }
        ]
      },
      {
        "kind": "table",
        "rows": [
          [
            {
              "text": "caso",
              "header": true
            },
            {
              "text": "exemplo",
              "header": true
            }
          ],
          [
            {
              "text": "Palavra de pergunta é o sujeito"
            },
            {
              "text": "だれが きましたか (quem veio?)",
              "ja": true
            }
          ],
          [
            {
              "text": "Existir: あります, います"
            },
            {
              "text": "ねこが います (há um gato)",
              "ja": true
            }
          ],
          [
            {
              "text": "Dizer QUEM faz (e não outra pessoa)"
            },
            {
              "text": "わたしが いきます (EU vou)",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Já "
          },
          {
            "text": "は",
            "bold": true
          },
          {
            "text": " apresenta o assunto sobre o qual você vai falar (\"quanto a mim...\"). A resposta de uma pergunta com "
          },
          {
            "text": "だれが",
            "bold": true
          },
          {
            "text": " também leva "
          },
          {
            "text": "が",
            "bold": true
          },
          {
            "text": ": "
          },
          {
            "text": "だれが きましたか?",
            "ja": true
          },
          {
            "text": " → "
          },
          {
            "text": "たなかさんが きました",
            "ja": true
          },
          {
            "text": "."
          }
        ]
      }
    ],
    "pattern": "[sujeito] が [verbo] · だれが / なにが ...?",
    "examples": [
      {
        "jp": "だれが きましたか",
        "ruby": [
          {
            "text": "誰",
            "reading": "だれ"
          },
          {
            "text": "が"
          },
          {
            "text": "来",
            "reading": "き"
          },
          {
            "text": "ましたか？"
          }
        ],
        "romaji": "dare ga kimashita ka",
        "pt": "Quem veio?"
      },
      {
        "jp": "わたしが いきます",
        "ruby": [
          {
            "text": "私",
            "reading": "わたし"
          },
          {
            "text": "が"
          },
          {
            "text": "行",
            "reading": "い"
          },
          {
            "text": "きます。"
          }
        ],
        "romaji": "watashi ga ikimasu",
        "pt": "Eu vou."
      },
      {
        "jp": "いえの もんの まえに ねこが います",
        "ruby": [
          {
            "text": "家",
            "reading": "いえ"
          },
          {
            "text": "の"
          },
          {
            "text": "門",
            "reading": "もん"
          },
          {
            "text": "の"
          },
          {
            "text": "前",
            "reading": "まえ"
          },
          {
            "text": "に"
          },
          {
            "text": "猫",
            "reading": "ねこ"
          },
          {
            "text": "がいます。"
          }
        ],
        "romaji": "ie no mon no mae ni neko ga imasu",
        "pt": "Há um gato na frente do portão."
      },
      {
        "jp": "ほかに なにが ありますか",
        "ruby": [
          {
            "text": "他",
            "reading": "ほか"
          },
          {
            "text": "に"
          },
          {
            "text": "何",
            "reading": "なに"
          },
          {
            "text": "がありますか。"
          }
        ],
        "romaji": "hoka ni nani ga arimasu ka",
        "pt": "O que mais você tem?"
      }
    ]
  }
];

/** Exercícios do Montar e das Lacunas feitos com os exemplos acima (mesmo formato dos do protótipo). */
export const BUILD_N5: readonly BuildExercise[] = [
  {
    "topic": "g11",
    "pt": "Eu não sou um gato.",
    "answer": [
      "わたし",
      "は",
      "ねこ",
      "ではありません"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "watashi wa neko dewa arimasen",
    "hint": "Negativo formal: ではありません. Passado: でした."
  },
  {
    "topic": "g11",
    "pt": "Eu não sou doutor.",
    "answer": [
      "わたし",
      "は",
      "いしゃ",
      "ではありません"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "watashi wa isha dewa arimasen",
    "hint": "Negativo formal: ではありません. Passado: でした."
  },
  {
    "topic": "g12",
    "pt": "Isso não é caro.",
    "answer": [
      "これ",
      "は",
      "たかくないです"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "kore wa takakunai desu",
    "hint": "Adjetivo い: troque o い por くない (negativo) ou かった (passado)."
  },
  {
    "topic": "g12",
    "pt": "Não está frio hoje.",
    "answer": [
      "きょう",
      "は",
      "さむくないです"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "kyō wa samukunai desu",
    "hint": "Adjetivo い: troque o い por くない (negativo) ou かった (passado)."
  },
  {
    "topic": "g13",
    "pt": "Não gosto de estudar.",
    "answer": [
      "べんきょう",
      "は",
      "すき",
      "ではありません"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "benkyō wa suki dewa arimasen",
    "hint": "Adjetivo な não muda: quem muda é o です (ではありません, でした)."
  },
  {
    "topic": "g13",
    "pt": "Eu não gosto de salada.",
    "answer": [
      "サラダ",
      "は",
      "すき",
      "ではありません"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "sarada wa suki dewa arimasen",
    "hint": "Adjetivo な não muda: quem muda é o です (ではありません, でした)."
  },
  {
    "topic": "g13",
    "pt": "Antigamente, esta cidade era linda.",
    "answer": [
      "この",
      "まち",
      "は",
      "むかし",
      "きれいでした"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "kono machi wa mukashi kirei deshita",
    "hint": "Adjetivo な não muda: quem muda é o です (ではありません, でした)."
  },
  {
    "topic": "g13",
    "pt": "A noite estava muito silenciosa.",
    "answer": [
      "その",
      "よる",
      "は",
      "たいへん",
      "しずかでした"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "sono yoru wa taihen shizuka deshita",
    "hint": "Adjetivo な não muda: quem muda é o です (ではありません, でした)."
  },
  {
    "topic": "g14",
    "pt": "Por favor, fale em inglês.",
    "answer": [
      "えいご",
      "で",
      "はなしてください"
    ],
    "extra": [
      "に",
      "を"
    ],
    "romaji": "eigo de hanashite kudasai",
    "hint": "Forma て + ください = pedido educado."
  },
  {
    "topic": "g15",
    "pt": "O que você está fazendo?",
    "answer": [
      "なに",
      "を",
      "しています",
      "か"
    ],
    "extra": [
      "に",
      "は"
    ],
    "romaji": "nani o shite imasu ka",
    "hint": "Forma て + います = fazendo agora, ou um estado que continua."
  },
  {
    "topic": "g16",
    "pt": "Não faça barulho.",
    "answer": [
      "おと",
      "を",
      "たてないでください"
    ],
    "extra": [
      "に",
      "は"
    ],
    "romaji": "oto o tatenaide kudasai",
    "hint": "Forma ない + で + ください = por favor, não faça."
  },
  {
    "topic": "g17",
    "pt": "Posso entrar?",
    "answer": [
      "はいって",
      "もいいです",
      "か"
    ],
    "extra": [
      "を",
      "に"
    ],
    "romaji": "haitte mo ii desu ka",
    "hint": "Forma て + も + いいですか = posso...?"
  },
  {
    "topic": "g17",
    "pt": "Posso comer?",
    "answer": [
      "たべて",
      "もいいです",
      "か"
    ],
    "extra": [
      "を",
      "に"
    ],
    "romaji": "tabete mo ii desu ka",
    "hint": "Forma て + も + いいですか = posso...?"
  },
  {
    "topic": "g17",
    "pt": "Posso abrir a janela?",
    "answer": [
      "まど",
      "を",
      "あけて",
      "もいいです",
      "か"
    ],
    "extra": [
      "に",
      "は"
    ],
    "romaji": "mado o akete mo ii desu ka",
    "hint": "Forma て + も + いいですか = posso...?"
  },
  {
    "topic": "g17",
    "pt": "Posso sentar?",
    "answer": [
      "すわって",
      "もいいです",
      "か"
    ],
    "extra": [
      "を",
      "に"
    ],
    "romaji": "suwatte mo ii desu ka",
    "hint": "Forma て + も + いいですか = posso...?"
  },
  {
    "topic": "g18",
    "pt": "Não assista televisão.",
    "answer": [
      "テレビ",
      "を",
      "みて",
      "はいけません"
    ],
    "extra": [
      "に",
      "は"
    ],
    "romaji": "terebi o mite wa ikemasen",
    "hint": "Forma て + は + いけません = não pode."
  },
  {
    "topic": "g18",
    "pt": "Não feche a porta!",
    "answer": [
      "ドア",
      "を",
      "しめて",
      "はいけません"
    ],
    "extra": [
      "に",
      "は"
    ],
    "romaji": "doa o shimete wa ikemasen",
    "hint": "Forma て + は + いけません = não pode."
  },
  {
    "topic": "g18",
    "pt": "Não vá para lá.",
    "answer": [
      "そこ",
      "へ",
      "いって",
      "はいけません"
    ],
    "extra": [
      "で",
      "を"
    ],
    "romaji": "soko e itte wa ikemasen",
    "hint": "Forma て + は + いけません = não pode."
  },
  {
    "topic": "g20",
    "pt": "Quero água.",
    "answer": [
      "みず",
      "が",
      "ほしい"
    ],
    "extra": [
      "に",
      "で"
    ],
    "romaji": "mizu ga hoshii",
    "hint": "Uma coisa que se quer vem com が + ほしい."
  },
  {
    "topic": "g20",
    "pt": "Eu quero uma bala.",
    "answer": [
      "あめ",
      "が",
      "ほしい"
    ],
    "extra": [
      "に",
      "で"
    ],
    "romaji": "ame ga hoshii",
    "hint": "Uma coisa que se quer vem com が + ほしい."
  },
  {
    "topic": "g20",
    "pt": "O que você quer?",
    "answer": [
      "なに",
      "が",
      "ほしい",
      "の"
    ],
    "extra": [
      "に",
      "で"
    ],
    "romaji": "nani ga hoshii no",
    "hint": "Uma coisa que se quer vem com が + ほしい."
  },
  {
    "topic": "g20",
    "pt": "Eu quero uma namorada.",
    "answer": [
      "かのじょ",
      "が",
      "ほしい"
    ],
    "extra": [
      "に",
      "で"
    ],
    "romaji": "kanojo ga hoshii",
    "hint": "Uma coisa que se quer vem com が + ほしい."
  },
  {
    "topic": "g21",
    "pt": "A China é maior que o Japão.",
    "answer": [
      "ちゅうごく",
      "は",
      "にほん",
      "より",
      "おおきいです"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "chūgoku wa nihon yori ōkii desu",
    "hint": "A は B より [adjetivo] = A é mais ... que B."
  },
  {
    "topic": "g21",
    "pt": "Sou mais alto que você.",
    "answer": [
      "わたし",
      "は",
      "きみ",
      "より",
      "せ",
      "が",
      "たかい"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "watashi wa kimi yori se ga takai",
    "hint": "A は B より [adjetivo] = A é mais ... que B."
  },
  {
    "topic": "g21",
    "pt": "O ouro é mais pesado do que a prata.",
    "answer": [
      "きん",
      "は",
      "ぎん",
      "より",
      "おもい"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "kin wa gin yori omoi",
    "hint": "A は B より [adjetivo] = A é mais ... que B."
  },
  {
    "topic": "g21",
    "pt": "Este aqui é mais barato.",
    "answer": [
      "こっち",
      "の",
      "ほう",
      "が",
      "やすい",
      "よ"
    ],
    "extra": [
      "は",
      "を"
    ],
    "romaji": "kotchi no hō ga yasui yo",
    "hint": "A は B より [adjetivo] = A é mais ... que B."
  },
  {
    "topic": "g22",
    "pt": "Tom é o mais forte.",
    "answer": [
      "トム",
      "が",
      "いちばん",
      "つよい"
    ],
    "extra": [
      "に",
      "で"
    ],
    "romaji": "tomu ga ichiban tsuyoi",
    "hint": "いちばん + adjetivo = o mais..."
  },
  {
    "topic": "g22",
    "pt": "Sou o mais jovem.",
    "answer": [
      "わたし",
      "が",
      "いちばん",
      "わかいです"
    ],
    "extra": [
      "に",
      "で"
    ],
    "romaji": "watashi ga ichiban wakai desu",
    "hint": "いちばん + adjetivo = o mais..."
  },
  {
    "topic": "g22",
    "pt": "Qual é o seu dia da semana favorito?",
    "answer": [
      "なんようび",
      "が",
      "いちばん",
      "すき"
    ],
    "extra": [
      "に",
      "で"
    ],
    "romaji": "nan'yōbi ga ichiban suki",
    "hint": "いちばん + adjetivo = o mais..."
  },
  {
    "topic": "g22",
    "pt": "De que matéria você gosta mais?",
    "answer": [
      "どの",
      "きょうか",
      "が",
      "いちばん",
      "すき"
    ],
    "extra": [
      "に",
      "で"
    ],
    "romaji": "dono kyōka ga ichiban suki",
    "hint": "いちばん + adjetivo = o mais..."
  },
  {
    "topic": "g23",
    "pt": "Eu gosto de gatos.",
    "answer": [
      "ねこ",
      "が",
      "すきです"
    ],
    "extra": [
      "に",
      "で"
    ],
    "romaji": "neko ga suki desu",
    "hint": "Com すき, きらい e じょうず, a coisa vem com が."
  },
  {
    "topic": "g23",
    "pt": "Eu gosto de música.",
    "answer": [
      "おんがく",
      "が",
      "すきです"
    ],
    "extra": [
      "に",
      "で"
    ],
    "romaji": "ongaku ga suki desu",
    "hint": "Com すき, きらい e じょうず, a coisa vem com が."
  },
  {
    "topic": "g23",
    "pt": "Você gosta de cães?",
    "answer": [
      "いぬ",
      "が",
      "すきです",
      "か"
    ],
    "extra": [
      "に",
      "で"
    ],
    "romaji": "inu ga suki desu ka",
    "hint": "Com すき, きらい e じょうず, a coisa vem com が."
  },
  {
    "topic": "g23",
    "pt": "Eu gosto de estudar.",
    "answer": [
      "べんきょう",
      "が",
      "すきです"
    ],
    "extra": [
      "に",
      "で"
    ],
    "romaji": "benkyō ga suki desu",
    "hint": "Com すき, きらい e じょうず, a coisa vem com が."
  },
  {
    "topic": "g24",
    "pt": "Eu vim da China.",
    "answer": [
      "ちゅうごく",
      "から",
      "きました"
    ],
    "extra": [
      "まで",
      "に"
    ],
    "romaji": "chūgoku kara kimashita",
    "hint": "から = a partir de / vindo de. まで = até."
  },
  {
    "topic": "g24",
    "pt": "De onde é você?",
    "answer": [
      "どこ",
      "から",
      "きました",
      "か"
    ],
    "extra": [
      "まで",
      "に"
    ],
    "romaji": "doko kara kimashita ka",
    "hint": "から = a partir de / vindo de. まで = até."
  },
  {
    "topic": "g24",
    "pt": "A nossa aula começa às 10h.",
    "answer": [
      "じゅぎょう",
      "は",
      "じゅうじ",
      "からです"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "jugyō wa jūji kara desu",
    "hint": "から = a partir de / vindo de. まで = até."
  },
  {
    "topic": "g24",
    "pt": "Eu irei esperar até 2:30.",
    "answer": [
      "にじはん",
      "まで",
      "まちます"
    ],
    "extra": [
      "から",
      "に"
    ],
    "romaji": "nijihan made machimasu",
    "hint": "から = a partir de / vindo de. まで = até."
  },
  {
    "topic": "g25",
    "pt": "Estou com frio. Posso fechar a janela?",
    "answer": [
      "さむい",
      "から",
      "まど",
      "しめて",
      "もいい"
    ],
    "extra": [
      "まで",
      "に"
    ],
    "romaji": "samui kara mado shimete mo ii",
    "hint": "O motivo vem primeiro, com から no fim dele."
  },
  {
    "topic": "g25",
    "pt": "Eu estou com sono, então estou indo para a cama.",
    "answer": [
      "ねむい",
      "から",
      "ねる",
      "ね"
    ],
    "extra": [
      "まで",
      "に"
    ],
    "romaji": "nemui kara neru ne",
    "hint": "O motivo vem primeiro, com から no fim dele."
  },
  {
    "topic": "g26",
    "pt": "O que você quer beber?",
    "answer": [
      "なに",
      "を",
      "のみます",
      "か"
    ],
    "extra": [
      "に",
      "は"
    ],
    "romaji": "nani o nomimasu ka",
    "hint": "A palavra interrogativa fica no lugar da resposta."
  },
  {
    "topic": "g26",
    "pt": "Quem é ele?",
    "answer": [
      "かれ",
      "は",
      "だれです",
      "か"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "kare wa dare desu ka",
    "hint": "A palavra interrogativa fica no lugar da resposta."
  },
  {
    "topic": "g26",
    "pt": "Onde fica a cozinha?",
    "answer": [
      "だいどころ",
      "は",
      "どこ"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "daidokoro wa doko",
    "hint": "A palavra interrogativa fica no lugar da resposta."
  },
  {
    "topic": "g26",
    "pt": "Quanto custa isto?",
    "answer": [
      "これ",
      "は",
      "いくらです",
      "か"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "kore wa ikura desu ka",
    "hint": "A palavra interrogativa fica no lugar da resposta."
  },
  {
    "topic": "g26",
    "pt": "Que horas são?",
    "answer": [
      "いま",
      "なんじです",
      "か"
    ],
    "extra": [
      "を",
      "に"
    ],
    "romaji": "ima nanji desu ka",
    "hint": "A palavra interrogativa fica no lugar da resposta."
  },
  {
    "topic": "g27",
    "pt": "Você já comeu?",
    "answer": [
      "もう",
      "たべました",
      "か"
    ],
    "extra": [
      "を",
      "に"
    ],
    "romaji": "mō tabemashita ka",
    "hint": "もう = já (com passado). まだ = ainda."
  },
  {
    "topic": "g27",
    "pt": "Tom ainda não chegou.",
    "answer": [
      "トム",
      "は",
      "まだ",
      "きてません"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "tomu wa mada kitemasen",
    "hint": "もう = já (com passado). まだ = ainda."
  },
  {
    "topic": "g28",
    "pt": "Tem uma chave na escrivaninha.",
    "answer": [
      "つくえ",
      "の",
      "うえ",
      "に",
      "かぎ",
      "が",
      "ある"
    ],
    "extra": [
      "は",
      "を"
    ],
    "romaji": "tsukue no ue ni kagi ga aru",
    "hint": "[referência] の [posição] に あります / います."
  },
  {
    "topic": "g28",
    "pt": "Tem um dicionário em cima da mesa.",
    "answer": [
      "じしょ",
      "が",
      "つくえ",
      "の",
      "うえ",
      "に",
      "ある"
    ],
    "extra": [
      "で",
      "は"
    ],
    "romaji": "jisho ga tsukue no ue ni aru",
    "hint": "[referência] の [posição] に あります / います."
  },
  {
    "topic": "g28",
    "pt": "O cachorro está na casa.",
    "answer": [
      "いぬ",
      "は",
      "いえ",
      "の",
      "なか",
      "に",
      "いる"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "inu wa ie no naka ni iru",
    "hint": "[referência] の [posição] に あります / います."
  },
  {
    "topic": "g28",
    "pt": "Há um cachorro na ponte.",
    "answer": [
      "はし",
      "の",
      "うえ",
      "に",
      "いぬ",
      "が",
      "いる"
    ],
    "extra": [
      "は",
      "を"
    ],
    "romaji": "hashi no ue ni inu ga iru",
    "hint": "[referência] の [posição] に あります / います."
  },
  {
    "topic": "g29",
    "pt": "Quando você estará livre?",
    "answer": [
      "いつ",
      "ひま",
      "に",
      "なります",
      "か"
    ],
    "extra": [
      "で",
      "を"
    ],
    "romaji": "itsu hima ni narimasu ka",
    "hint": "に なります = virar. に なりたい = quero ser."
  },
  {
    "topic": "g29",
    "pt": "Quero ser político.",
    "answer": [
      "せいじか",
      "に",
      "なりたい"
    ],
    "extra": [
      "で",
      "を"
    ],
    "romaji": "seijika ni naritai",
    "hint": "に なります = virar. に なりたい = quero ser."
  },
  {
    "topic": "g29",
    "pt": "Queria ser um pássaro.",
    "answer": [
      "とり",
      "に",
      "なりたい",
      "な"
    ],
    "extra": [
      "で",
      "を"
    ],
    "romaji": "tori ni naritai na",
    "hint": "に なります = virar. に なりたい = quero ser."
  },
  {
    "topic": "g29",
    "pt": "Quero que sejamos amigos.",
    "answer": [
      "ともだち",
      "に",
      "なりたいです"
    ],
    "extra": [
      "で",
      "を"
    ],
    "romaji": "tomodachi ni naritai desu",
    "hint": "に なります = virar. に なりたい = quero ser."
  },
  {
    "topic": "g30",
    "pt": "Eu sei esquiar.",
    "answer": [
      "スキー",
      "が",
      "できます"
    ],
    "extra": [
      "に",
      "で"
    ],
    "romaji": "sukī ga dekimasu",
    "hint": "O que se sabe fazer vem com が + できます."
  },
  {
    "topic": "g30",
    "pt": "Você joga tênis?",
    "answer": [
      "テニス",
      "が",
      "できます",
      "か"
    ],
    "extra": [
      "に",
      "で"
    ],
    "romaji": "tenisu ga dekimasu ka",
    "hint": "O que se sabe fazer vem com が + できます."
  },
  {
    "topic": "g30",
    "pt": "Não posso fazer isso.",
    "answer": [
      "わたし",
      "に",
      "は",
      "できません"
    ],
    "extra": [
      "で",
      "を"
    ],
    "romaji": "watashi ni wa dekimasen",
    "hint": "O que se sabe fazer vem com が + できます."
  },
  {
    "topic": "g30",
    "pt": "Eu também não consigo explicar.",
    "answer": [
      "わたし",
      "も",
      "せつめい",
      "できません"
    ],
    "extra": [
      "は",
      "を"
    ],
    "romaji": "watashi mo setsumei dekimasen",
    "hint": "O que se sabe fazer vem com が + できます."
  },
  {
    "topic": "g31",
    "pt": "Ele lê antes de ir para a cama.",
    "answer": [
      "かれ",
      "は",
      "ねる",
      "まえ",
      "に",
      "ほん",
      "を",
      "よむ"
    ],
    "extra": [
      "も",
      "の"
    ],
    "romaji": "kare wa neru mae ni hon o yomu",
    "hint": "Antes de: verbo no dicionário + まえに (nunca ます)."
  },
  {
    "topic": "g31",
    "pt": "Ligarei para ele antes de ir.",
    "answer": [
      "いく",
      "まえ",
      "に",
      "でんわ",
      "します"
    ],
    "extra": [
      "で",
      "を"
    ],
    "romaji": "iku mae ni denwa shimasu",
    "hint": "Antes de: verbo no dicionário + まえに (nunca ます)."
  },
  {
    "topic": "g31",
    "pt": "Por favor, me ligue antes de vir.",
    "answer": [
      "くる",
      "まえ",
      "に",
      "でんわ",
      "を",
      "してください"
    ],
    "extra": [
      "で",
      "は"
    ],
    "romaji": "kuru mae ni denwa o shite kudasai",
    "hint": "Antes de: verbo no dicionário + まえに (nunca ます)."
  },
  {
    "topic": "g32",
    "pt": "Depois que nós comemos, fomos dormir.",
    "answer": [
      "たべてから",
      "ねた",
      "よ"
    ],
    "extra": [
      "を",
      "に"
    ],
    "romaji": "tabetekara neta yo",
    "hint": "Depois de: forma て + から, ou substantivo + の あとで."
  },
  {
    "topic": "g32",
    "pt": "Vou estudar depois que chegar em casa.",
    "answer": [
      "かえってから",
      "べんきょう",
      "する",
      "よ"
    ],
    "extra": [
      "を",
      "に"
    ],
    "romaji": "kaettekara benkyō suru yo",
    "hint": "Depois de: forma て + から, ou substantivo + の あとで."
  },
  {
    "topic": "g32",
    "pt": "Te ligo de volta mais tarde.",
    "answer": [
      "あとで",
      "でんわ",
      "します"
    ],
    "extra": [
      "を",
      "に"
    ],
    "romaji": "atode denwa shimasu",
    "hint": "Depois de: forma て + から, ou substantivo + の あとで."
  },
  {
    "topic": "g32",
    "pt": "E se sairmos para beber após o trabalho?",
    "answer": [
      "しごと",
      "の",
      "あと",
      "で",
      "いっぱい",
      "どう"
    ],
    "extra": [
      "は",
      "を"
    ],
    "romaji": "shigoto no ato de ippai dō",
    "hint": "Depois de: forma て + から, ou substantivo + の あとで."
  },
  {
    "topic": "g33",
    "pt": "Não fale enquanto estiver comendo.",
    "answer": [
      "たべながら",
      "はなしちゃ",
      "ダメ",
      "だ",
      "よ"
    ],
    "extra": [
      "を",
      "に"
    ],
    "romaji": "tabenagara hanashicha dame da yo",
    "hint": "Ao mesmo tempo: radical do verbo (sem ます) + ながら."
  },
  {
    "topic": "g33",
    "pt": "A minha mãe disse isso com um sorriso.",
    "answer": [
      "はは",
      "は",
      "ほほえみながら",
      "いいました"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "haha wa hohoeminagara iimashita",
    "hint": "Ao mesmo tempo: radical do verbo (sem ます) + ながら."
  },
  {
    "topic": "g34",
    "pt": "Você quer comer sushi hoje à noite?",
    "answer": [
      "こんや",
      "すし",
      "を",
      "たべ",
      "に",
      "いきません",
      "か"
    ],
    "extra": [
      "は",
      "で"
    ],
    "romaji": "kon'ya sushi o tabe ni ikimasen ka",
    "hint": "Ir fazer: radical do verbo (sem ます) + に + いきます."
  },
  {
    "topic": "g34",
    "pt": "Por que não vamos ver um filme?",
    "answer": [
      "えいが",
      "を",
      "み",
      "に",
      "いきません",
      "か"
    ],
    "extra": [
      "は",
      "で"
    ],
    "romaji": "eiga o mi ni ikimasen ka",
    "hint": "Ir fazer: radical do verbo (sem ます) + に + いきます."
  },
  {
    "topic": "g34",
    "pt": "Amanhã vou fazer compras.",
    "answer": [
      "あした",
      "かいもの",
      "に",
      "いきます"
    ],
    "extra": [
      "で",
      "を"
    ],
    "romaji": "ashita kaimono ni ikimasu",
    "hint": "Ir fazer: radical do verbo (sem ます) + に + いきます."
  },
  {
    "topic": "g34",
    "pt": "Vou ao cinema com frequência.",
    "answer": [
      "わたし",
      "は",
      "よく",
      "えいが",
      "を",
      "み",
      "に",
      "いく"
    ],
    "extra": [
      "も",
      "の"
    ],
    "romaji": "watashi wa yoku eiga o mi ni iku",
    "hint": "Ir fazer: radical do verbo (sem ます) + に + いきます."
  },
  {
    "topic": "g35",
    "pt": "De vez em quando eu jogo golfe.",
    "answer": [
      "ときどき",
      "ゴルフ",
      "を",
      "します"
    ],
    "extra": [
      "に",
      "は"
    ],
    "romaji": "tokidoki gorufu o shimasu",
    "hint": "いつも, よく, ときどき com afirmativa; あまり e ぜんぜん com negativa."
  },
  {
    "topic": "g35",
    "pt": "Você está sempre ocupado?",
    "answer": [
      "いつも",
      "いそがしい",
      "の"
    ],
    "extra": [
      "は",
      "を"
    ],
    "romaji": "itsumo isogashii no",
    "hint": "いつも, よく, ときどき com afirmativa; あまり e ぜんぜん com negativa."
  },
  {
    "topic": "g36",
    "pt": "Posso ajudar com alguma coisa?",
    "answer": [
      "なに",
      "か",
      "てつだいましょう",
      "か"
    ],
    "extra": [
      "を",
      "に"
    ],
    "romaji": "nani ka tetsudaimashō ka",
    "hint": "Quer que eu...?: radical do verbo + ましょうか."
  },
  {
    "topic": "g36",
    "pt": "Você quer que eu abra a janela?",
    "answer": [
      "まど",
      "を",
      "あけましょう",
      "か"
    ],
    "extra": [
      "に",
      "は"
    ],
    "romaji": "mado o akemashō ka",
    "hint": "Quer que eu...?: radical do verbo + ましょうか."
  },
  {
    "topic": "g36",
    "pt": "Quer que eu te ajude?",
    "answer": [
      "おてつだい",
      "しましょう",
      "か"
    ],
    "extra": [
      "を",
      "に"
    ],
    "romaji": "otetsudai shimashō ka",
    "hint": "Quer que eu...?: radical do verbo + ましょうか."
  },
  {
    "topic": "g37",
    "pt": "Só tenho um desejo.",
    "answer": [
      "ねがい",
      "は",
      "ひとつ",
      "だけ"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "negai wa hitotsu dake",
    "hint": "だけ vai depois da palavra e quer dizer só."
  },
  {
    "topic": "g37",
    "pt": "Isso é tudo.",
    "answer": [
      "それ",
      "だけ",
      "で",
      "けっこうです"
    ],
    "extra": [
      "に",
      "を"
    ],
    "romaji": "sore dake de kekkō desu",
    "hint": "だけ vai depois da palavra e quer dizer só."
  },
  {
    "topic": "g38",
    "pt": "Quer beber algo?",
    "answer": [
      "なに",
      "か",
      "のむ"
    ],
    "extra": [
      "を",
      "に"
    ],
    "romaji": "nani ka nomu",
    "hint": "Palavra de pergunta + か = algum(a)."
  },
  {
    "topic": "g38",
    "pt": "Você consegue ver algo?",
    "answer": [
      "なに",
      "か",
      "みえる"
    ],
    "extra": [
      "を",
      "に"
    ],
    "romaji": "nani ka mieru",
    "hint": "Palavra de pergunta + か = algum(a)."
  },
  {
    "topic": "g38",
    "pt": "Tem alguém aí?",
    "answer": [
      "だれ",
      "か",
      "いる"
    ],
    "extra": [
      "を",
      "に"
    ],
    "romaji": "dare ka iru",
    "hint": "Palavra de pergunta + か = algum(a)."
  },
  {
    "topic": "g38",
    "pt": "Alguém está vindo.",
    "answer": [
      "だれ",
      "か",
      "くる"
    ],
    "extra": [
      "を",
      "に"
    ],
    "romaji": "dare ka kuru",
    "hint": "Palavra de pergunta + か = algum(a)."
  },
  {
    "topic": "g39",
    "pt": "Quem veio?",
    "answer": [
      "だれ",
      "が",
      "きました",
      "か"
    ],
    "extra": [
      "に",
      "で"
    ],
    "romaji": "dare ga kimashita ka",
    "hint": "が: sujeito novo, pergunta com だれ/なに e existência (あります, います)."
  },
  {
    "topic": "g39",
    "pt": "Eu vou.",
    "answer": [
      "わたし",
      "が",
      "いきます"
    ],
    "extra": [
      "に",
      "で"
    ],
    "romaji": "watashi ga ikimasu",
    "hint": "が: sujeito novo, pergunta com だれ/なに e existência (あります, います)."
  },
  {
    "topic": "g39",
    "pt": "O que mais você tem?",
    "answer": [
      "ほか",
      "に",
      "なに",
      "が",
      "あります",
      "か"
    ],
    "extra": [
      "で",
      "を"
    ],
    "romaji": "hoka ni nani ga arimasu ka",
    "hint": "が: sujeito novo, pergunta com だれ/なに e existência (あります, います)."
  }
];

/** Ids das frases do Tatoeba usadas nos exemplos (para o crédito). */
export const GRAMMAR_N5_SENTENCE_IDS: readonly number[] = [9740661,1193930,12055984,10081492,1019460,10901764,11643291,184159,1216866,4002000,338057,2128256,170848,5748800,1039551,78718,11630865,11512358,123257,5955826,2006378,2349145,123791,5845217,4147428,2242416,10899008,2040852,741581,201956,201775,213581,10631584,442923,170842,140285,143813,5272,3552884,11776723,625254,157401,179732,12412206,2626290,10625858,10366825,9644550,354378,13254283,3347455,10194978,2672966,5323,11029605,10967392,9755700,9199895,1700213,187577,347338,8532899,432825,2412106,13218484,2969830,2701348,8733259,183436,149673,2139043,5390444,177906,9475751,125811,14007955,215019,232933,1799658,920509,873959,11065768,13201627,10617667,11017844,174334,169135,11009755,82874,171179,1299272,80265,158658,150453,8723018,5157,213984,10671567,140345,227047,173392,3449190,205799,890127,2552450,137130,11610218,7551823,1507527,11003497,3553343];
