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
  },
  {
    "id": "n4-8",
    "title": "Fazer ou deixar fazer: a forma 〜させる",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "A "
          },
          {
            "text": "forma causativa",
            "bold": true
          },
          {
            "text": " diz que alguém "
          },
          {
            "text": "faz",
            "bold": true
          },
          {
            "text": " ou "
          },
          {
            "text": "deixa",
            "bold": true
          },
          {
            "text": " outra pessoa fazer algo. Quem recebe a ordem ou a permissão vem marcado com "
          },
          {
            "text": "に",
            "bold": true
          },
          {
            "text": " (ou "
          },
          {
            "text": "を",
            "bold": true
          },
          {
            "text": "): "
          },
          {
            "text": "わたしは かれに ゆかを そうじさせた",
            "ja": true
          },
          {
            "text": " (\"eu o fiz varrer o chão\")."
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
              "text": "grupo 1 (terminam em う, く, ぐ, す, つ, ぬ, ぶ, む, る)",
              "header": true
            },
            {
              "text": "troca a última sílaba pela do あ + せる (う vira わ)"
            },
            {
              "text": "いく → いかせる · かう → かわせる",
              "ja": true
            }
          ],
          [
            {
              "text": "grupo 2 (る depois de い ou え)",
              "header": true
            },
            {
              "text": "tira る, põe させる"
            },
            {
              "text": "たべる → たべさせる",
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
              "text": "する → させる · くる → こさせる",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Com "
          },
          {
            "text": "てください",
            "bold": true
          },
          {
            "text": ", vira pedido de permissão: "
          },
          {
            "text": "やらせて ください",
            "ja": true
          },
          {
            "text": " (\"deixe-me fazer\"). Com verbos de sentimento, indica "
          },
          {
            "text": "provocar",
            "bold": true
          },
          {
            "text": " esse sentimento: "
          },
          {
            "text": "いらいらさせる",
            "ja": true
          },
          {
            "text": " (\"irritar\")."
          }
        ]
      }
    ],
    "pattern": "[quem manda] は [quem faz] に [verbo causativo] · [verbo causativo て] ください",
    "examples": [
      {
        "jp": "わたしは かれに ゆかを そうじ させた",
        "ruby": [
          {
            "text": "私",
            "reading": "わたし"
          },
          {
            "text": "は"
          },
          {
            "text": "彼",
            "reading": "かれ"
          },
          {
            "text": "に"
          },
          {
            "text": "床",
            "reading": "ゆか"
          },
          {
            "text": "を"
          },
          {
            "text": "掃除",
            "reading": "そうじ"
          },
          {
            "text": "させた。"
          }
        ],
        "romaji": "watashi wa kare ni yuka o sōji saseta",
        "pt": "Eu o fiz varrer o chão."
      },
      {
        "jp": "わたしに やらせてください",
        "ruby": [
          {
            "text": "私",
            "reading": "わたし"
          },
          {
            "text": "にやらせてください。"
          }
        ],
        "romaji": "watashi ni yarasete kudasai",
        "pt": "Deixe-me fazer isso."
      },
      {
        "jp": "ねさせてよ",
        "ruby": [
          {
            "text": "寝",
            "reading": "ね"
          },
          {
            "text": "させてよ。"
          }
        ],
        "romaji": "nesasete yo",
        "pt": "Deixe-me dormir."
      },
      {
        "jp": "きみは ぼくを いらいら させる",
        "ruby": [
          {
            "text": "君",
            "reading": "きみ"
          },
          {
            "text": "は"
          },
          {
            "text": "僕",
            "reading": "ぼく"
          },
          {
            "text": "をいらいらさせる。"
          }
        ],
        "romaji": "kimi wa boku o iraira saseru",
        "pt": "Você me irrita!"
      }
    ]
  },
  {
    "id": "n4-9",
    "title": "Se ou quando: 〜たら",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "Com "
          },
          {
            "text": "たら",
            "bold": true
          },
          {
            "text": " você diz \""
          },
          {
            "text": "se",
            "bold": true
          },
          {
            "text": "\" ou \""
          },
          {
            "text": "quando",
            "bold": true
          },
          {
            "text": "\" algo acontecer, e o que vem depois depende disso. Forma: a forma "
          },
          {
            "text": "た",
            "bold": true
          },
          {
            "text": " do verbo ou do adjetivo + "
          },
          {
            "text": "ら",
            "bold": true
          },
          {
            "text": ". Com substantivo ou adjetivo "
          },
          {
            "text": "な",
            "bold": true
          },
          {
            "text": ", usa-se "
          },
          {
            "text": "だったら",
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
              "text": "o que vem antes",
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
              "text": "verbo",
              "header": true
            },
            {
              "text": "forma た + ら"
            },
            {
              "text": "ふる → ふったら",
              "ja": true
            }
          ],
          [
            {
              "text": "adjetivo い",
              "header": true
            },
            {
              "text": "tira い, põe かったら"
            },
            {
              "text": "たかい → たかかったら",
              "ja": true
            }
          ],
          [
            {
              "text": "substantivo e な",
              "header": true
            },
            {
              "text": "põe だったら"
            },
            {
              "text": "あめ → あめだったら",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Depois de "
          },
          {
            "text": "たら",
            "bold": true
          },
          {
            "text": " cabe quase tudo: vontade, pedido e também sugestão ("
          },
          {
            "text": "くるま かったら?",
            "ja": true
          },
          {
            "text": " \"que tal comprar um carro?\"). Para fatos que acontecem sempre em sequência, veja o "
          },
          {
            "text": "と",
            "bold": true
          },
          {
            "text": ", no próximo tópico."
          }
        ]
      }
    ],
    "pattern": "[forma た] ら、... · [substantivo] だったら、...",
    "examples": [
      {
        "jp": "あした あめが ふったら いえに います",
        "ruby": [
          {
            "text": "明日",
            "reading": "あした"
          },
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
            "text": "ったら、"
          },
          {
            "text": "家",
            "reading": "いえ"
          },
          {
            "text": "にいます。"
          }
        ],
        "romaji": "ashita ame ga futtara ie ni imasu",
        "pt": "Se chover amanhã, ficarei em casa."
      },
      {
        "jp": "こどもが できたら わかるさ",
        "ruby": [
          {
            "text": "子",
            "reading": "こ"
          },
          {
            "text": "どもができたら、"
          },
          {
            "text": "分",
            "reading": "わ"
          },
          {
            "text": "かるさ。"
          }
        ],
        "romaji": "kodomo ga dekitara wakaru sa",
        "pt": "Quando você tiver filhos, vai entender."
      },
      {
        "jp": "ぼく だったら ことわるな",
        "ruby": [
          {
            "text": "僕",
            "reading": "ぼく"
          },
          {
            "text": "だったら、"
          },
          {
            "text": "断",
            "reading": "ことわ"
          },
          {
            "text": "るな。"
          }
        ],
        "romaji": "boku dattara kotowaru na",
        "pt": "Eu diria não se eu fosse você."
      },
      {
        "jp": "くるま かったら",
        "ruby": [
          {
            "text": "車",
            "reading": "くるま"
          },
          {
            "text": "買",
            "reading": "か"
          },
          {
            "text": "ったら？"
          }
        ],
        "romaji": "kuruma kattara",
        "pt": "Por que você não compra um carro?"
      }
    ]
  },
  {
    "id": "n4-10",
    "title": "Quando... acontece...: 〜と",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "O "
          },
          {
            "text": "と",
            "bold": true
          },
          {
            "text": " liga duas coisas em que a segunda "
          },
          {
            "text": "acontece naturalmente",
            "bold": true
          },
          {
            "text": " depois da primeira: fatos da natureza, hábitos, resultados e descobertas. Vem depois da forma "
          },
          {
            "text": "simples",
            "bold": true
          },
          {
            "text": " (dicionário ou ない): "
          },
          {
            "text": "はるが くると、はなが さきます",
            "ja": true
          },
          {
            "text": " (\"quando a primavera chega, as flores desabrocham\")."
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
              "text": "verbo",
              "header": true
            },
            {
              "text": "みる → みると",
              "ja": true
            }
          ],
          [
            {
              "text": "adjetivo い",
              "header": true
            },
            {
              "text": "たかい → たかいと",
              "ja": true
            }
          ],
          [
            {
              "text": "substantivo e な",
              "header": true
            },
            {
              "text": "ひま → ひまだと",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Atenção: depois de "
          },
          {
            "text": "と",
            "bold": true
          },
          {
            "text": " não se usa vontade, pedido nem convite. Para isso, use "
          },
          {
            "text": "たら",
            "bold": true
          },
          {
            "text": " (ou "
          },
          {
            "text": "ば",
            "bold": true
          },
          {
            "text": "). No passado, "
          },
          {
            "text": "と",
            "bold": true
          },
          {
            "text": " conta uma descoberta ou uma reação: "
          },
          {
            "text": "キスすると、かのじょは あかくなった",
            "ja": true
          },
          {
            "text": "."
          }
        ]
      }
    ],
    "pattern": "[forma simples] と、...",
    "examples": [
      {
        "jp": "はるが くると きの はなが さきます",
        "ruby": [
          {
            "text": "春",
            "reading": "はる"
          },
          {
            "text": "が"
          },
          {
            "text": "来",
            "reading": "く"
          },
          {
            "text": "ると、"
          },
          {
            "text": "木",
            "reading": "き"
          },
          {
            "text": "の"
          },
          {
            "text": "花",
            "reading": "はな"
          },
          {
            "text": "が"
          },
          {
            "text": "咲",
            "reading": "さ"
          },
          {
            "text": "きます。"
          }
        ],
        "romaji": "haru ga kuruto ki no hana ga sakimasu",
        "pt": "Quando a primavera chegar, as flores nas árvores vão florescer."
      },
      {
        "jp": "そんなに たべると びょうきに なるよ",
        "ruby": [
          {
            "text": "そんなに"
          },
          {
            "text": "食",
            "reading": "た"
          },
          {
            "text": "べると、"
          },
          {
            "text": "病気",
            "reading": "びょうき"
          },
          {
            "text": "になるよ。"
          }
        ],
        "romaji": "sonnani taberuto byōki ni naru yo",
        "pt": "Se você comer muito, ficará doente."
      },
      {
        "jp": "よく みると むしが いるよ",
        "ruby": [
          {
            "text": "よく"
          },
          {
            "text": "見",
            "reading": "み"
          },
          {
            "text": "ると、"
          },
          {
            "text": "虫",
            "reading": "むし"
          },
          {
            "text": "がいるよ。"
          }
        ],
        "romaji": "yoku miruto mushi ga iru yo",
        "pt": "Se olhar cuidadosamente, irá encontrar alguns insetos."
      },
      {
        "jp": "キス すると かのじょは あかく なった",
        "ruby": [
          {
            "text": "キスすると、"
          },
          {
            "text": "彼女",
            "reading": "かのじょ"
          },
          {
            "text": "は"
          },
          {
            "text": "赤",
            "reading": "あか"
          },
          {
            "text": "くなった。"
          }
        ],
        "romaji": "kisu suruto kanojo wa akaku natta",
        "pt": "Ela ficou vermelha quando a beijei."
      }
    ]
  },
  {
    "id": "n4-11",
    "title": "Passar a poder fazer: 〜ようになる",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "Com "
          },
          {
            "text": "ようになる",
            "bold": true
          },
          {
            "text": " você diz que algo "
          },
          {
            "text": "passou a acontecer",
            "bold": true
          },
          {
            "text": ": uma habilidade nova, um hábito, uma mudança. O verbo fica na forma do dicionário (muitas vezes na forma "
          },
          {
            "text": "potencial",
            "bold": true
          },
          {
            "text": "): "
          },
          {
            "text": "およげる ように なった",
            "ja": true
          },
          {
            "text": " (\"aprendi a nadar\")."
          }
        ]
      },
      {
        "kind": "table",
        "rows": [
          [
            {
              "text": "sentido",
              "header": true
            },
            {
              "text": "exemplo",
              "header": true
            }
          ],
          [
            {
              "text": "passou a",
              "header": true
            },
            {
              "text": "およげるように なった",
              "ja": true
            }
          ],
          [
            {
              "text": "quero passar a",
              "header": true
            },
            {
              "text": "およげるように なりたい",
              "ja": true
            }
          ],
          [
            {
              "text": "deixou de",
              "header": true
            },
            {
              "text": "およげなく なった (já não consigo nadar)",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Repare no "
          },
          {
            "text": "に",
            "bold": true
          },
          {
            "text": ": "
          },
          {
            "text": "ようになる",
            "bold": true
          },
          {
            "text": " é \"tornar-se de um jeito\". Para o contrário, \"deixar de\", usa-se o "
          },
          {
            "text": "ない",
            "bold": true
          },
          {
            "text": " + "
          },
          {
            "text": "なる",
            "bold": true
          },
          {
            "text": ", como na última linha."
          }
        ]
      }
    ],
    "pattern": "[verbo: dicionário] ように なる · [verbo: ない → なく] なる",
    "examples": [
      {
        "jp": "かれは およげる ように なった",
        "ruby": [
          {
            "text": "彼",
            "reading": "かれ"
          },
          {
            "text": "は"
          },
          {
            "text": "泳",
            "reading": "およ"
          },
          {
            "text": "げるようになった。"
          }
        ],
        "romaji": "kare wa oyogeru yōni natta",
        "pt": "Ele aprendeu a nadar."
      },
      {
        "jp": "わたしは かれを しる ように なった",
        "ruby": [
          {
            "text": "私",
            "reading": "わたし"
          },
          {
            "text": "は"
          },
          {
            "text": "彼",
            "reading": "かれ"
          },
          {
            "text": "を"
          },
          {
            "text": "知",
            "reading": "し"
          },
          {
            "text": "るようになった。"
          }
        ],
        "romaji": "watashi wa kare o shiru yōni natta",
        "pt": "Eu vim conhecê-lo."
      },
      {
        "jp": "およげる ように なりたいんだ",
        "ruby": [
          {
            "text": "泳",
            "reading": "およ"
          },
          {
            "text": "げるようになりたいんだ。"
          }
        ],
        "romaji": "oyogeru yōni naritai nda",
        "pt": "Eu quero aprender a nadar."
      }
    ]
  },
  {
    "id": "n4-12",
    "title": "Para e por causa de: 〜ために",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "Com "
          },
          {
            "text": "ために",
            "bold": true
          },
          {
            "text": " você diz "
          },
          {
            "text": "para quê",
            "bold": true
          },
          {
            "text": " (o objetivo) ou "
          },
          {
            "text": "para quem",
            "bold": true
          },
          {
            "text": " se faz algo. Com verbo, usa-se a forma do dicionário e os dois verbos têm o "
          },
          {
            "text": "mesmo sujeito",
            "bold": true
          },
          {
            "text": ": "
          },
          {
            "text": "べんきょうする ために がっこうへ いく",
            "ja": true
          },
          {
            "text": " (\"vou à escola para estudar\")."
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
              "text": "sentido",
              "header": true
            },
            {
              "text": "exemplo",
              "header": true
            }
          ],
          [
            {
              "text": "verbo (dicionário)",
              "header": true
            },
            {
              "text": "objetivo (\"para\")"
            },
            {
              "text": "とる ために (para tirar)",
              "ja": true
            }
          ],
          [
            {
              "text": "substantivo + の",
              "header": true
            },
            {
              "text": "em benefício de (\"para\")"
            },
            {
              "text": "かのじょの ために (para ela)",
              "ja": true
            }
          ],
          [
            {
              "text": "substantivo + の",
              "header": true
            },
            {
              "text": "causa (\"por causa de\")"
            },
            {
              "text": "ゆきの ために (por causa da neve)",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Com substantivo + "
          },
          {
            "text": "の",
            "bold": true
          },
          {
            "text": ", quem decide se é benefício ou causa é o resto da frase: algo que você faz por alguém (\"para\") ou algo que aconteceu (\"por causa de\", um tom mais formal)."
          }
        ]
      }
    ],
    "pattern": "[verbo: dicionário] ために · [substantivo] の ために",
    "examples": [
      {
        "jp": "かのじょの ために かったんだ",
        "ruby": [
          {
            "text": "彼女",
            "reading": "かのじょ"
          },
          {
            "text": "のために"
          },
          {
            "text": "買",
            "reading": "か"
          },
          {
            "text": "ったんだ。"
          }
        ],
        "romaji": "kanojo no tameni katta nda",
        "pt": "Eu comprei isto para a minha namorada."
      },
      {
        "jp": "わたしたちは しゃしんを とる ために こうえんへ いきました",
        "ruby": [
          {
            "text": "私",
            "reading": "わたし"
          },
          {
            "text": "達",
            "reading": "たち"
          },
          {
            "text": "は"
          },
          {
            "text": "写真",
            "reading": "しゃしん"
          },
          {
            "text": "を"
          },
          {
            "text": "撮",
            "reading": "と"
          },
          {
            "text": "るために"
          },
          {
            "text": "公園",
            "reading": "こうえん"
          },
          {
            "text": "へ"
          },
          {
            "text": "行",
            "reading": "い"
          },
          {
            "text": "きました。"
          }
        ],
        "romaji": "watashitachi wa shashin o toru tameni kōen e ikimashita",
        "pt": "Fomos ao parque para tirar fotos."
      },
      {
        "jp": "わたしたちは べんきょう する ために がっこうへ いく",
        "ruby": [
          {
            "text": "私",
            "reading": "わたし"
          },
          {
            "text": "たちは"
          },
          {
            "text": "勉強",
            "reading": "べんきょう"
          },
          {
            "text": "するために"
          },
          {
            "text": "学校",
            "reading": "がっこう"
          },
          {
            "text": "へ"
          },
          {
            "text": "行",
            "reading": "い"
          },
          {
            "text": "く。"
          }
        ],
        "romaji": "watashitachi wa benkyō suru tameni gakkō e iku",
        "pt": "Vamos para a escola estudar."
      },
      {
        "jp": "れっしゃは ゆきの ために おくれた",
        "ruby": [
          {
            "text": "列車",
            "reading": "れっしゃ"
          },
          {
            "text": "は"
          },
          {
            "text": "雪",
            "reading": "ゆき"
          },
          {
            "text": "のために"
          },
          {
            "text": "遅",
            "reading": "おく"
          },
          {
            "text": "れた。"
          }
        ],
        "romaji": "ressha wa yuki no tameni okureta",
        "pt": "O trem estava atrasado devido à neve."
      }
    ]
  },
  {
    "id": "n4-13",
    "title": "Mas, embora: 〜のに",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "O "
          },
          {
            "text": "のに",
            "bold": true
          },
          {
            "text": " liga duas ideias quando o resultado é "
          },
          {
            "text": "o contrário do esperado",
            "bold": true
          },
          {
            "text": ", com tom de surpresa, queixa ou pena: \"embora\", \"apesar de\". Vem depois da forma "
          },
          {
            "text": "simples",
            "bold": true
          },
          {
            "text": "; com substantivo e adjetivo "
          },
          {
            "text": "な",
            "bold": true
          },
          {
            "text": ", usa-se "
          },
          {
            "text": "なのに",
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
              "text": "verbo",
              "header": true
            },
            {
              "text": "かった → かったのに",
              "ja": true
            }
          ],
          [
            {
              "text": "adjetivo い",
              "header": true
            },
            {
              "text": "いそがしい → いそがしいのに",
              "ja": true
            }
          ],
          [
            {
              "text": "substantivo e な",
              "header": true
            },
            {
              "text": "ひま → ひまなのに",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "No fim da frase, "
          },
          {
            "text": "のに",
            "bold": true
          },
          {
            "text": " expressa "
          },
          {
            "text": "pena",
            "bold": true
          },
          {
            "text": " ou "
          },
          {
            "text": "desejo irreal",
            "bold": true
          },
          {
            "text": ": "
          },
          {
            "text": "…ばいいのに",
            "ja": true
          },
          {
            "text": " (\"quem dera que...\"). Ao contrário de "
          },
          {
            "text": "けど",
            "bold": true
          },
          {
            "text": " e "
          },
          {
            "text": "が",
            "bold": true
          },
          {
            "text": ", que só contrastam, o "
          },
          {
            "text": "のに",
            "bold": true
          },
          {
            "text": " mostra a emoção de quem fala."
          }
        ]
      }
    ],
    "pattern": "[forma simples] のに、... · [substantivo/な] なのに、... · ...ばいいのに",
    "examples": [
      {
        "jp": "ともだち だと おもってたのに",
        "ruby": [
          {
            "text": "友達",
            "reading": "ともだち"
          },
          {
            "text": "だと"
          },
          {
            "text": "思",
            "reading": "おも"
          },
          {
            "text": "ってたのに！"
          }
        ],
        "romaji": "tomodachi da to omotteta noni",
        "pt": "Eu pensei que fôssemos amigos."
      },
      {
        "jp": "いそぐ ひつようは なかったのに",
        "ruby": [
          {
            "text": "急",
            "reading": "いそ"
          },
          {
            "text": "ぐ"
          },
          {
            "text": "必要",
            "reading": "ひつよう"
          },
          {
            "text": "はなかったのに。"
          }
        ],
        "romaji": "isogu hitsuyō wa nakatta noni",
        "pt": "Não precisávamos ter corrido."
      },
      {
        "jp": "あたらしい くつ かった ばっかり なのに",
        "ruby": [
          {
            "text": "新",
            "reading": "あたら"
          },
          {
            "text": "しい"
          },
          {
            "text": "靴",
            "reading": "くつ"
          },
          {
            "text": "、"
          },
          {
            "text": "買",
            "reading": "か"
          },
          {
            "text": "ったばっかりなのに。"
          }
        ],
        "romaji": "atarashii kutsu katta bakkari nanoni",
        "pt": "Acabei de comprar um novo par de sapatos."
      },
      {
        "jp": "うんと おかねが あれば いいのに",
        "ruby": [
          {
            "text": "うんとお"
          },
          {
            "text": "金",
            "reading": "かね"
          },
          {
            "text": "があればいいのに。"
          }
        ],
        "romaji": "unto okane ga areba ii noni",
        "pt": "Queria ter muito dinheiro."
      }
    ]
  },
  {
    "id": "n4-14",
    "title": "Mesmo que: 〜ても",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "Com "
          },
          {
            "text": "ても",
            "bold": true
          },
          {
            "text": " você diz \""
          },
          {
            "text": "mesmo que",
            "bold": true
          },
          {
            "text": "\", \""
          },
          {
            "text": "ainda que",
            "bold": true
          },
          {
            "text": "\": o que vem depois "
          },
          {
            "text": "não muda",
            "bold": true
          },
          {
            "text": " por causa da condição. Forma: "
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
            "text": " (verbo), "
          },
          {
            "text": "くても",
            "bold": true
          },
          {
            "text": " (adjetivo い) e "
          },
          {
            "text": "でも",
            "bold": true
          },
          {
            "text": " (substantivo e adjetivo "
          },
          {
            "text": "な",
            "bold": true
          },
          {
            "text": ")."
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
              "text": "verbo",
              "header": true
            },
            {
              "text": "forma て + も"
            },
            {
              "text": "おこる → おこっても",
              "ja": true
            }
          ],
          [
            {
              "text": "adjetivo い",
              "header": true
            },
            {
              "text": "tira い, põe くても"
            },
            {
              "text": "おそい → おそくても",
              "ja": true
            }
          ],
          [
            {
              "text": "substantivo e な",
              "header": true
            },
            {
              "text": "põe でも"
            },
            {
              "text": "あめ → あめでも",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Com "
          },
          {
            "text": "いくら",
            "bold": true
          },
          {
            "text": " ou "
          },
          {
            "text": "なにが",
            "bold": true
          },
          {
            "text": ", vira \"não importa quanto\" e \"aconteça o que acontecer\". Na forma negativa, "
          },
          {
            "text": "なくても",
            "bold": true
          },
          {
            "text": " quer dizer \"mesmo sem\"."
          }
        ]
      }
    ],
    "pattern": "[forma て] も · [adjetivo い: くても] · [substantivo/な] でも",
    "examples": [
      {
        "jp": "なにが おこっても わたしは おどろきません",
        "ruby": [
          {
            "text": "何",
            "reading": "なに"
          },
          {
            "text": "が"
          },
          {
            "text": "起",
            "reading": "お"
          },
          {
            "text": "こっても、"
          },
          {
            "text": "私",
            "reading": "わたし"
          },
          {
            "text": "は"
          },
          {
            "text": "驚",
            "reading": "おどろ"
          },
          {
            "text": "きません。"
          }
        ],
        "romaji": "nani ga okottemo watashi wa odorokimasen",
        "pt": "Não importa o que aconteça, não ficarei surpreso."
      },
      {
        "jp": "いくら かんがえても わかりません",
        "ruby": [
          {
            "text": "いくら"
          },
          {
            "text": "考",
            "reading": "かんが"
          },
          {
            "text": "えても、わかりません。"
          }
        ],
        "romaji": "ikura kangaetemo wakarimasen",
        "pt": "Não importa o quanto eu pense sobre isso, não consigo entendê-lo."
      },
      {
        "jp": "おそくても こない より まし",
        "ruby": [
          {
            "text": "遅",
            "reading": "おそ"
          },
          {
            "text": "くても"
          },
          {
            "text": "来",
            "reading": "こ"
          },
          {
            "text": "ないよりまし。"
          }
        ],
        "romaji": "osokutemo konai yori mashi",
        "pt": "Antes tarde do que nunca."
      },
      {
        "jp": "みずが なくても いきられる",
        "ruby": [
          {
            "text": "水",
            "reading": "みず"
          },
          {
            "text": "がなくても"
          },
          {
            "text": "生",
            "reading": "い"
          },
          {
            "text": "きられる。"
          }
        ],
        "romaji": "mizu ga nakutemo ikirareru",
        "pt": "Eu posso viver sem água."
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
  },
  {
    "topic": "n4-8",
    "pt": "Eu o fiz varrer o chão.",
    "answer": [
      "わたし",
      "は",
      "かれ",
      "に",
      "ゆか",
      "を",
      "そうじ",
      "させた"
    ],
    "extra": [
      "も",
      "の"
    ],
    "romaji": "watashi wa kare ni yuka o sōji saseta",
    "hint": "Fazer ou deixar alguém fazer: verbo + させる (grupo 1: あ + せる)."
  },
  {
    "topic": "n4-8",
    "pt": "Deixe-me fazer isso.",
    "answer": [
      "わたし",
      "に",
      "やらせてください"
    ],
    "extra": [
      "で",
      "を"
    ],
    "romaji": "watashi ni yarasete kudasai",
    "hint": "Fazer ou deixar alguém fazer: verbo + させる (grupo 1: あ + せる)."
  },
  {
    "topic": "n4-8",
    "pt": "Você me irrita!",
    "answer": [
      "きみ",
      "は",
      "ぼく",
      "を",
      "いらいら",
      "させる"
    ],
    "extra": [
      "も",
      "の"
    ],
    "romaji": "kimi wa boku o iraira saseru",
    "hint": "Fazer ou deixar alguém fazer: verbo + させる (grupo 1: あ + せる)."
  },
  {
    "topic": "n4-9",
    "pt": "Se chover amanhã, ficarei em casa.",
    "answer": [
      "あした",
      "あめ",
      "が",
      "ふったら",
      "いえ",
      "に",
      "います"
    ],
    "extra": [
      "で",
      "の"
    ],
    "romaji": "ashita ame ga futtara ie ni imasu",
    "hint": "Se ou quando: forma た + ら."
  },
  {
    "topic": "n4-9",
    "pt": "Quando você tiver filhos, vai entender.",
    "answer": [
      "こども",
      "が",
      "できたら",
      "わかる",
      "さ"
    ],
    "extra": [
      "に",
      "で"
    ],
    "romaji": "kodomo ga dekitara wakaru sa",
    "hint": "Se ou quando: forma た + ら."
  },
  {
    "topic": "n4-9",
    "pt": "Eu diria não se eu fosse você.",
    "answer": [
      "ぼく",
      "だったら",
      "ことわる",
      "な"
    ],
    "extra": [
      "を",
      "に"
    ],
    "romaji": "boku dattara kotowaru na",
    "hint": "Se ou quando: forma た + ら."
  },
  {
    "topic": "n4-10",
    "pt": "Quando a primavera chegar, as flores nas árvores vão florescer.",
    "answer": [
      "はる",
      "が",
      "くると",
      "き",
      "の",
      "はな",
      "が",
      "さきます"
    ],
    "extra": [
      "に",
      "で"
    ],
    "romaji": "haru ga kuruto ki no hana ga sakimasu",
    "hint": "Resultado natural: forma simples + と (sem pedido nem vontade depois)."
  },
  {
    "topic": "n4-10",
    "pt": "Se você comer muito, ficará doente.",
    "answer": [
      "そんなに",
      "たべると",
      "びょうき",
      "に",
      "なる",
      "よ"
    ],
    "extra": [
      "で",
      "を"
    ],
    "romaji": "sonnani taberuto byōki ni naru yo",
    "hint": "Resultado natural: forma simples + と (sem pedido nem vontade depois)."
  },
  {
    "topic": "n4-10",
    "pt": "Se olhar cuidadosamente, irá encontrar alguns insetos.",
    "answer": [
      "よく",
      "みると",
      "むし",
      "が",
      "いる",
      "よ"
    ],
    "extra": [
      "に",
      "で"
    ],
    "romaji": "yoku miruto mushi ga iru yo",
    "hint": "Resultado natural: forma simples + と (sem pedido nem vontade depois)."
  },
  {
    "topic": "n4-10",
    "pt": "Ela ficou vermelha quando a beijei.",
    "answer": [
      "キス",
      "すると",
      "かのじょ",
      "は",
      "あかく",
      "なった"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "kisu suruto kanojo wa akaku natta",
    "hint": "Resultado natural: forma simples + と (sem pedido nem vontade depois)."
  },
  {
    "topic": "n4-11",
    "pt": "Ele aprendeu a nadar.",
    "answer": [
      "かれ",
      "は",
      "およげる",
      "ように",
      "なった"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "kare wa oyogeru yōni natta",
    "hint": "Passar a: dicionário + ように なった (aprendi a, passei a)."
  },
  {
    "topic": "n4-11",
    "pt": "Eu vim conhecê-lo.",
    "answer": [
      "わたし",
      "は",
      "かれ",
      "を",
      "しる",
      "ように",
      "なった"
    ],
    "extra": [
      "も",
      "の"
    ],
    "romaji": "watashi wa kare o shiru yōni natta",
    "hint": "Passar a: dicionário + ように なった (aprendi a, passei a)."
  },
  {
    "topic": "n4-11",
    "pt": "Eu quero aprender a nadar.",
    "answer": [
      "およげる",
      "ように",
      "なりたいんだ"
    ],
    "extra": [
      "を",
      "に"
    ],
    "romaji": "oyogeru yōni naritai nda",
    "hint": "Passar a: dicionário + ように なった (aprendi a, passei a)."
  },
  {
    "topic": "n4-12",
    "pt": "Eu comprei isto para a minha namorada.",
    "answer": [
      "かのじょ",
      "の",
      "ために",
      "かったんだ"
    ],
    "extra": [
      "は",
      "を"
    ],
    "romaji": "kanojo no tameni katta nda",
    "hint": "Objetivo: dicionário + ために. Para quem ou por causa de: substantivo + のために."
  },
  {
    "topic": "n4-12",
    "pt": "Vamos para a escola estudar.",
    "answer": [
      "わたしたち",
      "は",
      "べんきょう",
      "する",
      "ために",
      "がっこう",
      "へ",
      "いく"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "watashitachi wa benkyō suru tameni gakkō e iku",
    "hint": "Objetivo: dicionário + ために. Para quem ou por causa de: substantivo + のために."
  },
  {
    "topic": "n4-12",
    "pt": "O trem estava atrasado devido à neve.",
    "answer": [
      "れっしゃ",
      "は",
      "ゆき",
      "の",
      "ために",
      "おくれた"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "ressha wa yuki no tameni okureta",
    "hint": "Objetivo: dicionário + ために. Para quem ou por causa de: substantivo + のために."
  },
  {
    "topic": "n4-13",
    "pt": "Eu pensei que fôssemos amigos.",
    "answer": [
      "ともだち",
      "だ",
      "と",
      "おもってたのに"
    ],
    "extra": [
      "も",
      "に"
    ],
    "romaji": "tomodachi da to omotteta noni",
    "hint": "Contrário do esperado: forma simples + のに (e ばいいのに para um desejo)."
  },
  {
    "topic": "n4-13",
    "pt": "Não precisávamos ter corrido.",
    "answer": [
      "いそぐ",
      "ひつよう",
      "は",
      "なかったのに"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "isogu hitsuyō wa nakatta noni",
    "hint": "Contrário do esperado: forma simples + のに (e ばいいのに para um desejo)."
  },
  {
    "topic": "n4-13",
    "pt": "Acabei de comprar um novo par de sapatos.",
    "answer": [
      "あたらしい",
      "くつ",
      "かった",
      "ばっかり",
      "なのに"
    ],
    "extra": [
      "を",
      "に"
    ],
    "romaji": "atarashii kutsu katta bakkari nanoni",
    "hint": "Contrário do esperado: forma simples + のに (e ばいいのに para um desejo)."
  },
  {
    "topic": "n4-13",
    "pt": "Queria ter muito dinheiro.",
    "answer": [
      "うんと",
      "おかね",
      "が",
      "あれば",
      "いいのに"
    ],
    "extra": [
      "に",
      "で"
    ],
    "romaji": "unto okane ga areba ii noni",
    "hint": "Contrário do esperado: forma simples + のに (e ばいいのに para um desejo)."
  },
  {
    "topic": "n4-14",
    "pt": "Não importa o que aconteça, não ficarei surpreso.",
    "answer": [
      "なに",
      "が",
      "おこっても",
      "わたし",
      "は",
      "おどろきません"
    ],
    "extra": [
      "に",
      "で"
    ],
    "romaji": "nani ga okottemo watashi wa odorokimasen",
    "hint": "Mesmo que: forma て + も (adjetivo い: くても; substantivo: でも)."
  },
  {
    "topic": "n4-14",
    "pt": "Não importa o quanto eu pense sobre isso, não consigo entendê-lo.",
    "answer": [
      "いくら",
      "かんがえても",
      "わかりません"
    ],
    "extra": [
      "を",
      "に"
    ],
    "romaji": "ikura kangaetemo wakarimasen",
    "hint": "Mesmo que: forma て + も (adjetivo い: くても; substantivo: でも)."
  },
  {
    "topic": "n4-14",
    "pt": "Antes tarde do que nunca.",
    "answer": [
      "おそくても",
      "こない",
      "より",
      "まし"
    ],
    "extra": [
      "から",
      "の"
    ],
    "romaji": "osokutemo konai yori mashi",
    "hint": "Mesmo que: forma て + も (adjetivo い: くても; substantivo: でも)."
  },
  {
    "topic": "n4-14",
    "pt": "Eu posso viver sem água.",
    "answer": [
      "みず",
      "が",
      "なくても",
      "いきられる"
    ],
    "extra": [
      "に",
      "で"
    ],
    "romaji": "mizu ga nakutemo ikirareru",
    "hint": "Mesmo que: forma て + も (adjetivo い: くても; substantivo: でも)."
  }
];

/** Ids das frases do Tatoeba usadas nos exemplos (para o crédito). */
export const GRAMMAR_N4_SENTENCE_IDS: readonly number[] = [2684823,189732,204854,92933,8935237,11831405,11852556,2490824,10333259,3552079,11878738,3480582,173469,10712752,79947,1452344,110575,10197580,2048906,10592243,115483,10682600,12135719,1202184,189249,148767,154105,3506608,5692169,136179,80357,12003646,10230338,11706769,6391927,204266,10380252,10179138,109752,153577,10711650,12957260,151482,165152,77478,12508745,165927,11746278,228053,188016,6015,126755,2656835];
