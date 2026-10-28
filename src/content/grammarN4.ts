// Gerado por scripts/grammar-n5/build.mjs n4 a partir de scripts/grammar-n4/topics.mjs. Não edite à mão.
// Exemplos: frases do Tatoeba (CC BY 2.0 FR), conferidas por scripts/grammar-n5/verify.mjs. Ver LICENSE.md.
import type { BuildExercise, GrammarTopic } from '@/data/types';

export const GRAMMAR_N4: readonly GrammarTopic[] = [
  {
    "id": "n4-1",
    "title": "Talvez: 〜かもしれません",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "Para dizer que algo "
          },
          {
            "text": "é possível",
            "bold": true
          },
          {
            "text": ", mas não é certo, coloque "
          },
          {
            "text": "かもしれません",
            "bold": true
          },
          {
            "text": " (na conversa, "
          },
          {
            "text": "かもしれない",
            "bold": true
          },
          {
            "text": ") depois da forma simples da frase. Quer dizer \"pode ser que\", \"talvez\"."
          }
        ]
      },
      {
        "kind": "table",
        "rows": [
          [
            {
              "text": "o que vem antes",
              "header": true
            },
            {
              "text": "exemplo",
              "header": true
            }
          ],
          [
            {
              "text": "verbo (forma simples)",
              "header": true
            },
            {
              "text": "ふる → ふるかもしれません",
              "ja": true
            }
          ],
          [
            {
              "text": "adjetivo い",
              "header": true
            },
            {
              "text": "たかい → たかいかもしれません",
              "ja": true
            }
          ],
          [
            {
              "text": "adjetivo な ou substantivo (sem だ)",
              "header": true
            },
            {
              "text": "あめ → あめかもしれません",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "É uma chance pequena ou média. Se você tem um bom motivo para esperar algo, use "
          },
          {
            "text": "はず",
            "bold": true
          },
          {
            "text": " (veja o tópico sobre ele)."
          }
        ]
      }
    ],
    "pattern": "[forma simples] かもしれません · [substantivo] かもしれません",
    "examples": [
      {
        "jp": "あしたは あめ かもしれない",
        "ruby": [
          {
            "text": "明日",
            "reading": "あした"
          },
          {
            "text": "は"
          },
          {
            "text": "雨",
            "reading": "あめ"
          },
          {
            "text": "かもしれない。"
          }
        ],
        "romaji": "ashita wa ame kamoshirenai",
        "pt": "Talvez chova amanhã."
      },
      {
        "jp": "あめが ふる かもしれない",
        "ruby": [
          {
            "text": "雨",
            "reading": "あめ"
          },
          {
            "text": "が"
          },
          {
            "text": "降",
            "reading": "ふ"
          },
          {
            "text": "るかもしれない。"
          }
        ],
        "romaji": "ame ga furu kamoshirenai",
        "pt": "Pode chover."
      },
      {
        "jp": "それは ほんとう かもしれない",
        "ruby": [
          {
            "text": "それは"
          },
          {
            "text": "本当",
            "reading": "ほんとう"
          },
          {
            "text": "かもしれない。"
          }
        ],
        "romaji": "sore wa hontō kamoshirenai",
        "pt": "Pode ser verdade."
      },
      {
        "jp": "かのじょは くる かもしれない",
        "ruby": [
          {
            "text": "彼女",
            "reading": "かのじょ"
          },
          {
            "text": "は"
          },
          {
            "text": "来",
            "reading": "く"
          },
          {
            "text": "るかもしれない。"
          }
        ],
        "romaji": "kanojo wa kuru kamoshirenai",
        "pt": "Pode ser que ela venha."
      }
    ]
  },
  {
    "id": "n4-2",
    "title": "Decidir: 〜ことにしました",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "Para dizer o que "
          },
          {
            "text": "você decidiu",
            "bold": true
          },
          {
            "text": ", use o verbo na forma do dicionário (ou na forma "
          },
          {
            "text": "ない",
            "bold": true
          },
          {
            "text": ") e "
          },
          {
            "text": "ことにしました",
            "bold": true
          },
          {
            "text": ". Na conversa, "
          },
          {
            "text": "ことにした",
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
              "text": "decidi",
              "header": true
            },
            {
              "text": "まつことにしました",
              "ja": true
            },
            {
              "text": "またないことにしました",
              "ja": true
            }
          ],
          [
            {
              "text": "decido (agora)",
              "header": true
            },
            {
              "text": "まつことにします",
              "ja": true
            },
            {
              "text": "またないことにします",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Quando a decisão não é sua (uma regra, uma combinação), usa-se "
          },
          {
            "text": "ことになりました",
            "bold": true
          },
          {
            "text": ": \"ficou decidido que\"."
          }
        ]
      }
    ],
    "pattern": "[verbo: dicionário ou ない] ことにしました",
    "examples": [
      {
        "jp": "まつ ことにしたよ",
        "ruby": [
          {
            "text": "待",
            "reading": "ま"
          },
          {
            "text": "つことにしたよ。"
          }
        ],
        "romaji": "matsu kotonishita yo",
        "pt": "Eu decidi esperar."
      },
      {
        "jp": "うる ことにしたんだ",
        "ruby": [
          {
            "text": "売",
            "reading": "う"
          },
          {
            "text": "ることにしたんだ。"
          }
        ],
        "romaji": "uru kotonishita nda",
        "pt": "Decidi vendê-lo."
      },
      {
        "jp": "いかない ことにしたよ",
        "ruby": [
          {
            "text": "行",
            "reading": "い"
          },
          {
            "text": "かないことにしたよ。"
          }
        ],
        "romaji": "ikanai kotonishita yo",
        "pt": "Eu decidi não ir."
      },
      {
        "jp": "かみんを とる ことにした",
        "ruby": [
          {
            "text": "仮眠",
            "reading": "かみん"
          },
          {
            "text": "をとることにした。"
          }
        ],
        "romaji": "kamin o toru kotonishita",
        "pt": "Eu decidi dar uma cochilada."
      }
    ]
  },
  {
    "id": "n4-3",
    "title": "Acabar fazendo: 〜てしまいます",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "Com "
          },
          {
            "text": "てしまいます",
            "bold": true
          },
          {
            "text": " (passado: "
          },
          {
            "text": "てしまいました",
            "bold": true
          },
          {
            "text": ") você diz que algo "
          },
          {
            "text": "acabou acontecendo",
            "bold": true
          },
          {
            "text": ", geralmente sem querer ou com pena. Também pode indicar que a ação foi "
          },
          {
            "text": "concluída por completo",
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
              "text": "forma て",
              "header": true
            },
            {
              "text": "com しまう",
              "header": true
            }
          ],
          [
            {
              "text": "ねて",
              "header": true
            },
            {
              "text": "ねてしまいました (acabei dormindo)",
              "ja": true
            }
          ],
          [
            {
              "text": "わすれて",
              "header": true
            },
            {
              "text": "わすれてしまいました (esqueci, que pena)",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Na conversa, "
          },
          {
            "text": "てしまった",
            "bold": true
          },
          {
            "text": " costuma virar "
          },
          {
            "text": "ちゃった",
            "bold": true
          },
          {
            "text": " (e "
          },
          {
            "text": "でしまった",
            "bold": true
          },
          {
            "text": " vira "
          },
          {
            "text": "じゃった",
            "bold": true
          },
          {
            "text": "): "
          },
          {
            "text": "ねちゃった",
            "ja": true
          },
          {
            "text": "."
          }
        ]
      }
    ],
    "pattern": "[verbo forma て] しまいました",
    "examples": [
      {
        "jp": "ねて しまった",
        "ruby": [
          {
            "text": "寝",
            "reading": "ね"
          },
          {
            "text": "てしまった。"
          }
        ],
        "romaji": "nete shimatta",
        "pt": "Eu adormeci."
      },
      {
        "jp": "つかまって しまった",
        "ruby": [
          {
            "text": "捕",
            "reading": "つか"
          },
          {
            "text": "まってしまった。"
          }
        ],
        "romaji": "tsukamatte shimatta",
        "pt": "Fui capturado."
      },
      {
        "jp": "かがみが われて しまった",
        "ruby": [
          {
            "text": "鏡",
            "reading": "かがみ"
          },
          {
            "text": "が"
          },
          {
            "text": "割",
            "reading": "わ"
          },
          {
            "text": "れてしまった。"
          }
        ],
        "romaji": "kagami ga warete shimatta",
        "pt": "Meu espelho quebrou."
      },
      {
        "jp": "みちに まよって しまった",
        "ruby": [
          {
            "text": "道",
            "reading": "みち"
          },
          {
            "text": "に"
          },
          {
            "text": "迷",
            "reading": "まよ"
          },
          {
            "text": "ってしまった。"
          }
        ],
        "romaji": "michi ni mayotte shimatta",
        "pt": "Estou perdido."
      }
    ]
  },
  {
    "id": "n4-4",
    "title": "Deixar feito: 〜ておきます",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "Com "
          },
          {
            "text": "ておきます",
            "bold": true
          },
          {
            "text": " você faz algo "
          },
          {
            "text": "de antemão",
            "bold": true
          },
          {
            "text": ", para ficar pronto, ou "
          },
          {
            "text": "deixa algo como está",
            "bold": true
          },
          {
            "text": ". A forma て do verbo vem antes de "
          },
          {
            "text": "おきます",
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
              "text": "forma て",
              "header": true
            },
            {
              "text": "com おく",
              "header": true
            }
          ],
          [
            {
              "text": "かんがえて",
              "header": true
            },
            {
              "text": "かんがえておきます (vou pensar antes)",
              "ja": true
            }
          ],
          [
            {
              "text": "あけて",
              "header": true
            },
            {
              "text": "あけておきます (deixo aberto)",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Na conversa, "
          },
          {
            "text": "ておく",
            "bold": true
          },
          {
            "text": " vira "
          },
          {
            "text": "とく",
            "bold": true
          },
          {
            "text": ": "
          },
          {
            "text": "かんがえとく",
            "ja": true
          },
          {
            "text": ". Com "
          },
          {
            "text": "べき",
            "bold": true
          },
          {
            "text": " (dever), "
          },
          {
            "text": "しっておくべき",
            "bold": true
          },
          {
            "text": " quer dizer \"convém saber\"."
          }
        ]
      }
    ],
    "pattern": "[verbo forma て] おきます",
    "examples": [
      {
        "jp": "かんがえて おくよ",
        "ruby": [
          {
            "text": "考",
            "reading": "かんが"
          },
          {
            "text": "えておくよ。"
          }
        ],
        "romaji": "kangaete oku yo",
        "pt": "Pensarei sobre isso."
      },
      {
        "jp": "さかなは いかして おくよ",
        "ruby": [
          {
            "text": "魚",
            "reading": "さかな"
          },
          {
            "text": "は"
          },
          {
            "text": "生",
            "reading": "い"
          },
          {
            "text": "かしておくよ。"
          }
        ],
        "romaji": "sakana wa ikashite oku yo",
        "pt": "Vou deixar os peixes vivos."
      },
      {
        "jp": "めを あけて おくのよ",
        "ruby": [
          {
            "text": "目",
            "reading": "め"
          },
          {
            "text": "を"
          },
          {
            "text": "開",
            "reading": "あ"
          },
          {
            "text": "けておくのよ。"
          }
        ],
        "romaji": "me o akete oku noyo",
        "pt": "Mantenha seus olhos abertos."
      },
      {
        "jp": "しって おくべきだよ",
        "ruby": [
          {
            "text": "知",
            "reading": "し"
          },
          {
            "text": "っておくべきだよ。"
          }
        ],
        "romaji": "shitte okubeki dayo",
        "pt": "Você deveria saber isso."
      }
    ]
  },
  {
    "id": "n4-5",
    "title": "Deve ser: 〜はずです",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "はずです",
            "bold": true
          },
          {
            "text": " diz que, pelo que você sabe, algo "
          },
          {
            "text": "deve ser assim",
            "bold": true
          },
          {
            "text": " ou "
          },
          {
            "text": "era para ser assim",
            "bold": true
          },
          {
            "text": ". É mais firme do que "
          },
          {
            "text": "かもしれません",
            "bold": true
          },
          {
            "text": ": você tem um motivo."
          }
        ]
      },
      {
        "kind": "table",
        "rows": [
          [
            {
              "text": "o que vem antes",
              "header": true
            },
            {
              "text": "exemplo",
              "header": true
            }
          ],
          [
            {
              "text": "verbo ou adjetivo い (forma simples)",
              "header": true
            },
            {
              "text": "ついている → ついているはずです",
              "ja": true
            }
          ],
          [
            {
              "text": "adjetivo な",
              "header": true
            },
            {
              "text": "しずか → しずかなはずです",
              "ja": true
            }
          ],
          [
            {
              "text": "substantivo",
              "header": true
            },
            {
              "text": "せんせい → せんせいのはずです",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "No passado, o verbo vem no passado: "
          },
          {
            "text": "いったはずです",
            "ja": true
          },
          {
            "text": " (\"eu tinha dito\", com um tom de reclamação)."
          }
        ]
      }
    ],
    "pattern": "[forma simples] はずです",
    "examples": [
      {
        "jp": "かれは もう ついてる はずだ",
        "ruby": [
          {
            "text": "彼",
            "reading": "かれ"
          },
          {
            "text": "はもう"
          },
          {
            "text": "着",
            "reading": "つ"
          },
          {
            "text": "いてるはずだ。"
          }
        ],
        "romaji": "kare wa mō tsuiteru hazu da",
        "pt": "Ele já deveria ter chegado."
      },
      {
        "jp": "すべて うまく いく はずだよ",
        "ruby": [
          {
            "text": "全",
            "reading": "すべ"
          },
          {
            "text": "てうまくいくはずだよ。"
          }
        ],
        "romaji": "subete umaku iku hazu dayo",
        "pt": "Eu aposto que tudo vai dar certo."
      },
      {
        "jp": "ねる ように いった はずだけど",
        "ruby": [
          {
            "text": "寝",
            "reading": "ね"
          },
          {
            "text": "るように"
          },
          {
            "text": "言",
            "reading": "い"
          },
          {
            "text": "ったはずだけど。"
          }
        ],
        "romaji": "neru yōni itta hazu dakedo",
        "pt": "Pensei que eu tinha mandado você ir dormir."
      }
    ]
  },
  {
    "id": "n4-6",
    "title": "A forma passiva: 〜られる",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "Na "
          },
          {
            "text": "forma passiva",
            "bold": true
          },
          {
            "text": ", quem sofre a ação vira o assunto, e quem a faz vem com "
          },
          {
            "text": "に",
            "bold": true
          },
          {
            "text": ": "
          },
          {
            "text": "せんせいに ほめられた",
            "ja": true
          },
          {
            "text": " (\"fui elogiado pelo professor\"). Muitas vezes mostra que a ação "
          },
          {
            "text": "incomodou",
            "bold": true
          },
          {
            "text": " a pessoa."
          }
        ]
      },
      {
        "kind": "table",
        "rows": [
          [
            {
              "text": "tipo do verbo",
              "header": true
            },
            {
              "text": "como fica",
              "header": true
            },
            {
              "text": "exemplo",
              "header": true
            }
          ],
          [
            {
              "text": "grupo 1 (terminam em う, く, ぐ, す, る...)",
              "header": true
            },
            {
              "text": "troca a última sílaba pela do あ + れる"
            },
            {
              "text": "しかる → しかられる",
              "ja": true
            }
          ],
          [
            {
              "text": "grupo 2 (る depois de い ou え)",
              "header": true
            },
            {
              "text": "tira る, põe られる"
            },
            {
              "text": "ほめる → ほめられる",
              "ja": true
            }
          ],
          [
            {
              "text": "する e くる",
              "header": true
            },
            {
              "text": "irregulares"
            },
            {
              "text": "する → される · くる → こられる",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "O passado de "
          },
          {
            "text": "しかられる",
            "bold": true
          },
          {
            "text": " é "
          },
          {
            "text": "しかられた",
            "bold": true
          },
          {
            "text": ", e o educado é "
          },
          {
            "text": "しかられました",
            "bold": true
          },
          {
            "text": "."
          }
        ]
      }
    ],
    "pattern": "[quem sofre] は [quem faz] に [verbo passivo]",
    "examples": [
      {
        "jp": "せんせいに ほめられたの",
        "ruby": [
          {
            "text": "先生",
            "reading": "せんせい"
          },
          {
            "text": "に"
          },
          {
            "text": "褒",
            "reading": "ほ"
          },
          {
            "text": "められたの？"
          }
        ],
        "romaji": "sensei ni homerareta no",
        "pt": "Você foi elogiado pelo professor?"
      },
      {
        "jp": "かれは くるまに はねられた",
        "ruby": [
          {
            "text": "彼",
            "reading": "かれ"
          },
          {
            "text": "は"
          },
          {
            "text": "車",
            "reading": "くるま"
          },
          {
            "text": "にはねられた。"
          }
        ],
        "romaji": "kare wa kuruma ni hanerareta",
        "pt": "Ele foi atropelado pelo carro."
      },
      {
        "jp": "かあさんに しかられたんだ",
        "ruby": [
          {
            "text": "母",
            "reading": "かあ"
          },
          {
            "text": "さんに"
          },
          {
            "text": "叱",
            "reading": "しか"
          },
          {
            "text": "られたんだ。"
          }
        ],
        "romaji": "kāsan ni shikarareta nda",
        "pt": "Minha mãe me repreendeu."
      }
    ]
  },
  {
    "id": "n4-7",
    "title": "Se... : a forma 〜ば",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "A forma "
          },
          {
            "text": "ば",
            "bold": true
          },
          {
            "text": " diz \""
          },
          {
            "text": "se",
            "bold": true
          },
          {
            "text": "\" ou \"bastando que\": "
          },
          {
            "text": "みれば わかる",
            "ja": true
          },
          {
            "text": " (\"se você olhar, vai entender\"). Também se usa para desejar o impossível, com "
          },
          {
            "text": "なあ",
            "bold": true
          },
          {
            "text": ": "
          },
          {
            "text": "わかければなあ",
            "ja": true
          },
          {
            "text": " (\"queria ser jovem\")."
          }
        ]
      },
      {
        "kind": "table",
        "rows": [
          [
            {
              "text": "tipo",
              "header": true
            },
            {
              "text": "como fica",
              "header": true
            },
            {
              "text": "exemplo",
              "header": true
            }
          ],
          [
            {
              "text": "verbo grupo 1",
              "header": true
            },
            {
              "text": "última sílaba → a do え + ば"
            },
            {
              "text": "およぐ → およげば",
              "ja": true
            }
          ],
          [
            {
              "text": "verbo grupo 2",
              "header": true
            },
            {
              "text": "tira る, põe れば"
            },
            {
              "text": "みる → みれば",
              "ja": true
            }
          ],
          [
            {
              "text": "adjetivo い",
              "header": true
            },
            {
              "text": "tira い, põe ければ"
            },
            {
              "text": "わかい → わかければ",
              "ja": true
            }
          ],
          [
            {
              "text": "substantivo e な",
              "header": true
            },
            {
              "text": "usa なら (ou であれば)"
            },
            {
              "text": "あめなら",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Com verbos, "
          },
          {
            "text": "あれば",
            "bold": true
          },
          {
            "text": " (\"se houver\") é o "
          },
          {
            "text": "ば",
            "bold": true
          },
          {
            "text": " de "
          },
          {
            "text": "ある",
            "bold": true
          },
          {
            "text": "."
          }
        ]
      }
    ],
    "pattern": "[verbo ou adjetivo na forma ば]、 ... · ...ばなあ (desejo)",
    "examples": [
      {
        "jp": "みれば わかるさ",
        "ruby": [
          {
            "text": "見",
            "reading": "み"
          },
          {
            "text": "ればわかるさ。"
          }
        ],
        "romaji": "mireba wakaru sa",
        "pt": "Você vai saber quando vir."
      },
      {
        "jp": "くるまが あればなあ",
        "ruby": [
          {
            "text": "車",
            "reading": "くるま"
          },
          {
            "text": "があればなあ。"
          }
        ],
        "romaji": "kuruma ga areba nā",
        "pt": "Queria ter um carro."
      },
      {
        "jp": "およげればなあ",
        "ruby": [
          {
            "text": "泳",
            "reading": "およ"
          },
          {
            "text": "げればなあ。"
          }
        ],
        "romaji": "oyogereba nā",
        "pt": "Queria saber nadar."
      },
      {
        "jp": "わかければなあ",
        "ruby": [
          {
            "text": "若",
            "reading": "わか"
          },
          {
            "text": "ければなあ。"
          }
        ],
        "romaji": "wakakereba nā",
        "pt": "Eu queria ser mais jovem."
      }
    ]
  }
];

/** Exercícios do Montar e das Lacunas feitos com os exemplos acima (mesmo formato dos exercícios iniciais). */
export const BUILD_N4: readonly BuildExercise[] = [
  {
    "topic": "n4-1",
    "pt": "Talvez chova amanhã.",
    "answer": [
      "あした",
      "は",
      "あめ",
      "かもしれない"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "ashita wa ame kamoshirenai",
    "hint": "Possibilidade: forma simples + かもしれません."
  },
  {
    "topic": "n4-1",
    "pt": "Pode chover.",
    "answer": [
      "あめ",
      "が",
      "ふる",
      "かもしれない"
    ],
    "extra": [
      "に",
      "で"
    ],
    "romaji": "ame ga furu kamoshirenai",
    "hint": "Possibilidade: forma simples + かもしれません."
  },
  {
    "topic": "n4-1",
    "pt": "Pode ser verdade.",
    "answer": [
      "それ",
      "は",
      "ほんとう",
      "かもしれない"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "sore wa hontō kamoshirenai",
    "hint": "Possibilidade: forma simples + かもしれません."
  },
  {
    "topic": "n4-1",
    "pt": "Pode ser que ela venha.",
    "answer": [
      "かのじょ",
      "は",
      "くる",
      "かもしれない"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "kanojo wa kuru kamoshirenai",
    "hint": "Possibilidade: forma simples + かもしれません."
  },
  {
    "topic": "n4-2",
    "pt": "Eu decidi esperar.",
    "answer": [
      "まつ",
      "ことにした",
      "よ"
    ],
    "extra": [
      "を",
      "に"
    ],
    "romaji": "matsu kotonishita yo",
    "hint": "Decidi fazer: dicionário + ことにしました."
  },
  {
    "topic": "n4-2",
    "pt": "Eu decidi não ir.",
    "answer": [
      "いかない",
      "ことにした",
      "よ"
    ],
    "extra": [
      "を",
      "に"
    ],
    "romaji": "ikanai kotonishita yo",
    "hint": "Decidi fazer: dicionário + ことにしました."
  },
  {
    "topic": "n4-2",
    "pt": "Eu decidi dar uma cochilada.",
    "answer": [
      "かみん",
      "を",
      "とる",
      "ことにした"
    ],
    "extra": [
      "に",
      "は"
    ],
    "romaji": "kamin o toru kotonishita",
    "hint": "Decidi fazer: dicionário + ことにしました."
  },
  {
    "topic": "n4-3",
    "pt": "Meu espelho quebrou.",
    "answer": [
      "かがみ",
      "が",
      "われて",
      "しまった"
    ],
    "extra": [
      "に",
      "で"
    ],
    "romaji": "kagami ga warete shimatta",
    "hint": "Sem querer ou por completo: forma て + しまいました."
  },
  {
    "topic": "n4-3",
    "pt": "Estou perdido.",
    "answer": [
      "みち",
      "に",
      "まよって",
      "しまった"
    ],
    "extra": [
      "で",
      "を"
    ],
    "romaji": "michi ni mayotte shimatta",
    "hint": "Sem querer ou por completo: forma て + しまいました."
  },
  {
    "topic": "n4-4",
    "pt": "Pensarei sobre isso.",
    "answer": [
      "かんがえて",
      "おく",
      "よ"
    ],
    "extra": [
      "を",
      "に"
    ],
    "romaji": "kangaete oku yo",
    "hint": "De antemão ou deixar como está: forma て + おきます."
  },
  {
    "topic": "n4-4",
    "pt": "Vou deixar os peixes vivos.",
    "answer": [
      "さかな",
      "は",
      "いかして",
      "おく",
      "よ"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "sakana wa ikashite oku yo",
    "hint": "De antemão ou deixar como está: forma て + おきます."
  },
  {
    "topic": "n4-4",
    "pt": "Mantenha seus olhos abertos.",
    "answer": [
      "め",
      "を",
      "あけて",
      "おくのよ"
    ],
    "extra": [
      "に",
      "は"
    ],
    "romaji": "me o akete oku noyo",
    "hint": "De antemão ou deixar como está: forma て + おきます."
  },
  {
    "topic": "n4-5",
    "pt": "Ele já deveria ter chegado.",
    "answer": [
      "かれ",
      "は",
      "もう",
      "ついてる",
      "はずだ"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "kare wa mō tsuiteru hazu da",
    "hint": "Expectativa com motivo: forma simples + はずです."
  },
  {
    "topic": "n4-5",
    "pt": "Eu aposto que tudo vai dar certo.",
    "answer": [
      "すべて",
      "うまく",
      "いく",
      "はずだよ"
    ],
    "extra": [
      "を",
      "に"
    ],
    "romaji": "subete umaku iku hazu dayo",
    "hint": "Expectativa com motivo: forma simples + はずです."
  },
  {
    "topic": "n4-5",
    "pt": "Pensei que eu tinha mandado você ir dormir.",
    "answer": [
      "ねる",
      "ように",
      "いった",
      "はずだけど"
    ],
    "extra": [
      "を",
      "に"
    ],
    "romaji": "neru yōni itta hazu dakedo",
    "hint": "Expectativa com motivo: forma simples + はずです."
  },
  {
    "topic": "n4-6",
    "pt": "Você foi elogiado pelo professor?",
    "answer": [
      "せんせい",
      "に",
      "ほめられた",
      "の"
    ],
    "extra": [
      "で",
      "を"
    ],
    "romaji": "sensei ni homerareta no",
    "hint": "Passiva: quem faz vem com に e o verbo termina em れる ou られる."
  },
  {
    "topic": "n4-6",
    "pt": "Ele foi atropelado pelo carro.",
    "answer": [
      "かれ",
      "は",
      "くるま",
      "に",
      "はねられた"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "kare wa kuruma ni hanerareta",
    "hint": "Passiva: quem faz vem com に e o verbo termina em れる ou られる."
  },
  {
    "topic": "n4-6",
    "pt": "Minha mãe me repreendeu.",
    "answer": [
      "かあさん",
      "に",
      "しかられたんだ"
    ],
    "extra": [
      "で",
      "を"
    ],
    "romaji": "kāsan ni shikarareta nda",
    "hint": "Passiva: quem faz vem com に e o verbo termina em れる ou られる."
  },
  {
    "topic": "n4-7",
    "pt": "Você vai saber quando vir.",
    "answer": [
      "みれば",
      "わかる",
      "さ"
    ],
    "extra": [
      "を",
      "に"
    ],
    "romaji": "mireba wakaru sa",
    "hint": "Condição: forma ば. Desejo impossível: ばなあ."
  },
  {
    "topic": "n4-7",
    "pt": "Queria ter um carro.",
    "answer": [
      "くるま",
      "が",
      "あれば",
      "なあ"
    ],
    "extra": [
      "に",
      "で"
    ],
    "romaji": "kuruma ga areba nā",
    "hint": "Condição: forma ば. Desejo impossível: ばなあ."
  }
];

/** Ids das frases do Tatoeba usadas nos exemplos (para o crédito). */
export const GRAMMAR_N4_SENTENCE_IDS: readonly number[] = [2684823,189732,204854,92933,8935237,11831405,11852556,2490824,10333259,3552079,11878738,3480582,173469,10712752,79947,1452344,110575,10197580,2048906,10592243,115483,10682600,12135719,1202184,189249,148767];
