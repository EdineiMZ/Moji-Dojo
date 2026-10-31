// Gerado por scripts/grammar-n5/build.mjs n3 a partir de scripts/grammar-n3/topics.mjs. Não edite à mão.
// Exemplos: frases do Tatoeba (CC BY 2.0 FR), conferidas por scripts/grammar-n5/verify.mjs. Ver LICENSE.md.
import type { BuildExercise, GrammarTopic } from '@/data/types';

export const GRAMMAR_N3: readonly GrammarTopic[] = [
  {
    "id": "n3-1",
    "title": "Parece que: 〜らしい",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "Com "
          },
          {
            "text": "らしい",
            "bold": true
          },
          {
            "text": ", você diz que algo \"parece ser assim\" por causa do que ouviu ou viu: um boato, uma notícia, um indício. Vem depois da "
          },
          {
            "text": "forma simples",
            "bold": true
          },
          {
            "text": " do verbo ou do adjetivo, e direto depois de um substantivo."
          }
        ]
      },
      {
        "kind": "table",
        "rows": [
          [
            {
              "text": "padrão",
              "header": true
            },
            {
              "text": "exemplo",
              "header": true
            }
          ],
          [
            {
              "text": "forma simples + らしい"
            },
            {
              "text": "あめに なる らしい (parece que vai chover)",
              "ja": true
            }
          ],
          [
            {
              "text": "adjetivo い + らしい"
            },
            {
              "text": "ねむい らしい (parece estar com sono)",
              "ja": true
            }
          ],
          [
            {
              "text": "substantivo + らしい"
            },
            {
              "text": "びょうき らしい (parece estar doente)",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Em "
          },
          {
            "text": "らしい",
            "bold": true
          },
          {
            "text": " quem fala não viu com os próprios olhos: é uma conclusão ou uma informação de segunda mão. Depois de um substantivo, "
          },
          {
            "text": "らしい",
            "bold": true
          },
          {
            "text": " pode ainda querer dizer \"bem típico de\": "
          },
          {
            "text": "がくせい らしい",
            "ja": true
          },
          {
            "text": " pode ser \"parece ser estudante\" ou \"como um bom estudante\". O contexto mostra qual."
          }
        ]
      }
    ],
    "pattern": "[forma simples] らしい · [substantivo] らしい",
    "examples": [
      {
        "jp": "かれは びょうきらしい",
        "ruby": [
          {
            "text": "彼",
            "reading": "かれ"
          },
          {
            "text": "は"
          },
          {
            "text": "病気",
            "reading": "びょうき"
          },
          {
            "text": "らしい。"
          }
        ],
        "romaji": "kare wa byōkirashii",
        "pt": "Ele parece doente."
      },
      {
        "jp": "よるは あめに なるらしい",
        "ruby": [
          {
            "text": "夜",
            "reading": "よる"
          },
          {
            "text": "は"
          },
          {
            "text": "雨",
            "reading": "あめ"
          },
          {
            "text": "になるらしい。"
          }
        ],
        "romaji": "yoru wa ame ni narurashii",
        "pt": "Parece que vai chover esta noite."
      },
      {
        "jp": "かれは かねもちらしい",
        "ruby": [
          {
            "text": "彼",
            "reading": "かれ"
          },
          {
            "text": "は"
          },
          {
            "text": "金持",
            "reading": "かねも"
          },
          {
            "text": "ちらしい。"
          }
        ],
        "romaji": "kare wa kanemochirashii",
        "pt": "Ele parece ser rico."
      },
      {
        "jp": "かのじょは しあわせらしい",
        "ruby": [
          {
            "text": "彼女",
            "reading": "かのじょ"
          },
          {
            "text": "は"
          },
          {
            "text": "幸",
            "reading": "しあわ"
          },
          {
            "text": "せらしい。"
          }
        ],
        "romaji": "kanojo wa shiawaserashii",
        "pt": "Parece que ela está feliz."
      }
    ]
  },
  {
    "id": "n3-2",
    "title": "Sobre: 〜について",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "Para dizer "
          },
          {
            "text": "sobre",
            "bold": true
          },
          {
            "text": " o que se fala, escreve ou pensa, coloque "
          },
          {
            "text": "について",
            "bold": true
          },
          {
            "text": " depois do assunto: "
          },
          {
            "text": "おんがく について はなす",
            "ja": true
          },
          {
            "text": " (\"falar sobre música\"). Quando o assunto vem antes de um substantivo, junte "
          },
          {
            "text": "の",
            "bold": true
          },
          {
            "text": ": "
          },
          {
            "text": "ほし についての ほん",
            "ja": true
          },
          {
            "text": " (\"um livro sobre estrelas\")."
          }
        ]
      },
      {
        "kind": "table",
        "rows": [
          [
            {
              "text": "padrão",
              "header": true
            },
            {
              "text": "exemplo",
              "header": true
            }
          ],
          [
            {
              "text": "assunto + について + verbo"
            },
            {
              "text": "それ について はなした (falou sobre isso)",
              "ja": true
            }
          ],
          [
            {
              "text": "assunto + についての + substantivo"
            },
            {
              "text": "ほし についての ほん (livro sobre estrelas)",
              "ja": true
            }
          ],
          [
            {
              "text": "なに + について"
            },
            {
              "text": "なに について はなしている? (falando sobre o quê?)",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Os verbos mais comuns com "
          },
          {
            "text": "について",
            "bold": true
          },
          {
            "text": " são "
          },
          {
            "text": "はなす",
            "ja": true
          },
          {
            "text": " (falar), "
          },
          {
            "text": "かく",
            "ja": true
          },
          {
            "text": " (escrever), "
          },
          {
            "text": "しらべる",
            "ja": true
          },
          {
            "text": " (pesquisar), "
          },
          {
            "text": "かんがえる",
            "ja": true
          },
          {
            "text": " (pensar) e "
          },
          {
            "text": "きく",
            "ja": true
          },
          {
            "text": " (perguntar)."
          }
        ]
      }
    ],
    "pattern": "[assunto] について + verbo · [assunto] についての + [substantivo]",
    "examples": [
      {
        "jp": "おんがく について はなしたよ",
        "ruby": [
          {
            "text": "音楽",
            "reading": "おんがく"
          },
          {
            "text": "について"
          },
          {
            "text": "話",
            "reading": "はな"
          },
          {
            "text": "したよ。"
          }
        ],
        "romaji": "ongaku nitsuite hanashitayo",
        "pt": "Falei de música."
      },
      {
        "jp": "かれは それ について はなした",
        "ruby": [
          {
            "text": "彼",
            "reading": "かれ"
          },
          {
            "text": "はそれについて"
          },
          {
            "text": "話",
            "reading": "はな"
          },
          {
            "text": "した。"
          }
        ],
        "romaji": "kare wa sore nitsuite hanashita",
        "pt": "Ele mencionou-o."
      },
      {
        "jp": "これは ほし についての ほんです",
        "ruby": [
          {
            "text": "これは"
          },
          {
            "text": "星",
            "reading": "ほし"
          },
          {
            "text": "についての"
          },
          {
            "text": "本",
            "reading": "ほん"
          },
          {
            "text": "です。"
          }
        ],
        "romaji": "kore wa hoshi nitsuite no hon desu",
        "pt": "Este livro é sobre estrelas."
      },
      {
        "jp": "かれは なに について はなしている",
        "ruby": [
          {
            "text": "彼",
            "reading": "かれ"
          },
          {
            "text": "は"
          },
          {
            "text": "何",
            "reading": "なに"
          },
          {
            "text": "について"
          },
          {
            "text": "話",
            "reading": "はな"
          },
          {
            "text": "している？"
          }
        ],
        "romaji": "kare wa nani nitsuite hanashiteiru",
        "pt": "Do que ele está falando?"
      }
    ]
  },
  {
    "id": "n3-3",
    "title": "Como: 〜として",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "Com "
          },
          {
            "text": "として",
            "bold": true
          },
          {
            "text": " você diz em que "
          },
          {
            "text": "papel",
            "bold": true
          },
          {
            "text": ", função ou condição algo ou alguém é visto: \"como médico\", \"como amigo\", \"como cantora\". Vem logo depois do substantivo."
          }
        ]
      },
      {
        "kind": "table",
        "rows": [
          [
            {
              "text": "padrão",
              "header": true
            },
            {
              "text": "exemplo",
              "header": true
            }
          ],
          [
            {
              "text": "substantivo + として"
            },
            {
              "text": "いしゃ として ゆうめいだ (é famoso como médico)",
              "ja": true
            }
          ],
          [
            {
              "text": "pessoa + として"
            },
            {
              "text": "ともだち として すきよ (gosto de você como amigo)",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Compare com "
          },
          {
            "text": "に",
            "bold": true
          },
          {
            "text": " e com "
          },
          {
            "text": "で",
            "bold": true
          },
          {
            "text": ": "
          },
          {
            "text": "いしゃ として",
            "ja": true
          },
          {
            "text": " diz \"na função de médico\", e não \"em um médico\". Serve também para negar ou elogiar uma qualidade nessa função: "
          },
          {
            "text": "いしゃ として むのうだ",
            "ja": true
          },
          {
            "text": " (\"como médico, é incapaz\")."
          }
        ]
      }
    ],
    "pattern": "[substantivo] として",
    "examples": [
      {
        "jp": "かれは いしゃ として ゆうめいだ",
        "ruby": [
          {
            "text": "彼",
            "reading": "かれ"
          },
          {
            "text": "は"
          },
          {
            "text": "医者",
            "reading": "いしゃ"
          },
          {
            "text": "として"
          },
          {
            "text": "有名",
            "reading": "ゆうめい"
          },
          {
            "text": "だ。"
          }
        ],
        "romaji": "kare wa isha toshite yūmeida",
        "pt": "Ele é famoso como médico."
      },
      {
        "jp": "かのじょは かしゅ として ゆうめいだ",
        "ruby": [
          {
            "text": "彼女",
            "reading": "かのじょ"
          },
          {
            "text": "は"
          },
          {
            "text": "歌手",
            "reading": "かしゅ"
          },
          {
            "text": "として"
          },
          {
            "text": "有名",
            "reading": "ゆうめい"
          },
          {
            "text": "だ。"
          }
        ],
        "romaji": "kanojo wa kashu toshite yūmeida",
        "pt": "Como cantora, ela é bem conhecida."
      },
      {
        "jp": "ともだち として すきよ",
        "ruby": [
          {
            "text": "友達",
            "reading": "ともだち"
          },
          {
            "text": "として"
          },
          {
            "text": "好",
            "reading": "す"
          },
          {
            "text": "きよ。"
          }
        ],
        "romaji": "tomodachi toshite sukiyo",
        "pt": "Eu gosto de você como amigo."
      },
      {
        "jp": "かれは いしゃ として むのうだ",
        "ruby": [
          {
            "text": "彼",
            "reading": "かれ"
          },
          {
            "text": "は"
          },
          {
            "text": "医者",
            "reading": "いしゃ"
          },
          {
            "text": "として"
          },
          {
            "text": "無能",
            "reading": "むのう"
          },
          {
            "text": "だ。"
          }
        ],
        "romaji": "kare wa isha toshite munōda",
        "pt": "Ele não é bom como médico."
      }
    ]
  },
  {
    "id": "n3-4",
    "title": "Em relação a: 〜に対して",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "Com "
          },
          {
            "text": "にたいして",
            "bold": true
          },
          {
            "text": " (escreve-se 〜に対して) você aponta para "
          },
          {
            "text": "quem ou o quê",
            "bold": true
          },
          {
            "text": " recebe um sentimento ou uma atitude: raiva, carinho, gentileza, desculpa. Vem depois de "
          },
          {
            "text": "に",
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
              "text": "padrão",
              "header": true
            },
            {
              "text": "exemplo",
              "header": true
            }
          ],
          [
            {
              "text": "pessoa/coisa + に対して + sentimento"
            },
            {
              "text": "どうぶつ に たいして やさしい (gentil com os animais)",
              "ja": true
            }
          ],
          [
            {
              "text": "pessoa + に対して + ação"
            },
            {
              "text": "きみ に たいして おこっている (está com raiva de você)",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Outro uso do "
          },
          {
            "text": "にたいして",
            "bold": true
          },
          {
            "text": " é "
          },
          {
            "text": "contrastar",
            "bold": true
          },
          {
            "text": " dois lados (\"enquanto...\"). Quando a frase é só \"sobre um assunto\", prefira "
          },
          {
            "text": "について",
            "bold": true
          },
          {
            "text": "; quando há alguém na ponta de um sentimento, use "
          },
          {
            "text": "にたいして",
            "bold": true
          },
          {
            "text": "."
          }
        ]
      }
    ],
    "pattern": "[pessoa/coisa] に対して [sentimento/atitude]",
    "examples": [
      {
        "jp": "かのじょは どうぶつに たいして やさしい",
        "ruby": [
          {
            "text": "彼女",
            "reading": "かのじょ"
          },
          {
            "text": "は"
          },
          {
            "text": "動物",
            "reading": "どうぶつ"
          },
          {
            "text": "に"
          },
          {
            "text": "対",
            "reading": "たい"
          },
          {
            "text": "して"
          },
          {
            "text": "優",
            "reading": "やさ"
          },
          {
            "text": "しい。"
          }
        ],
        "romaji": "kanojo wa dōbutsu ni taishite yasashii",
        "pt": "Ela é gentil com animais."
      },
      {
        "jp": "かれは きみに たいして おこっている",
        "ruby": [
          {
            "text": "彼",
            "reading": "かれ"
          },
          {
            "text": "は"
          },
          {
            "text": "君",
            "reading": "きみ"
          },
          {
            "text": "に"
          },
          {
            "text": "対",
            "reading": "たい"
          },
          {
            "text": "して"
          },
          {
            "text": "怒",
            "reading": "おこ"
          },
          {
            "text": "っている。"
          }
        ],
        "romaji": "kare wa kimi ni taishite okotteiru",
        "pt": "Ele está com raiva de você."
      },
      {
        "jp": "わたしに たいして おこってるんでしょう",
        "ruby": [
          {
            "text": "私",
            "reading": "わたし"
          },
          {
            "text": "に"
          },
          {
            "text": "対",
            "reading": "たい"
          },
          {
            "text": "して"
          },
          {
            "text": "怒",
            "reading": "おこ"
          },
          {
            "text": "ってるんでしょう。"
          }
        ],
        "romaji": "watashi ni taishite okotterundeshō",
        "pt": "Você está chateado comigo, não está?"
      },
      {
        "jp": "かのじょに たいして すまない きが します",
        "ruby": [
          {
            "text": "彼女",
            "reading": "かのじょ"
          },
          {
            "text": "に"
          },
          {
            "text": "対",
            "reading": "たい"
          },
          {
            "text": "してすまない"
          },
          {
            "text": "気",
            "reading": "き"
          },
          {
            "text": "がします。"
          }
        ],
        "romaji": "kanojo ni taishite sumanai ki ga shimasu",
        "pt": "Eu sinto muito por ela."
      }
    ]
  },
  {
    "id": "n3-5",
    "title": "Depende de e por meio de: 〜によって",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "O "
          },
          {
            "text": "によって",
            "bold": true
          },
          {
            "text": " tem dois usos que aparecem muito: mostrar o que "
          },
          {
            "text": "depende",
            "bold": true
          },
          {
            "text": " de alguém ou de algo (\"varia conforme\") e indicar o "
          },
          {
            "text": "autor",
            "bold": true
          },
          {
            "text": " de uma frase na passiva (\"foi escrita por\", \"foi criado por\")."
          }
        ]
      },
      {
        "kind": "table",
        "rows": [
          [
            {
              "text": "uso",
              "header": true
            },
            {
              "text": "exemplo",
              "header": true
            }
          ],
          [
            {
              "text": "depende de"
            },
            {
              "text": "ひと によって いけん が ことなる (a opinião muda conforme a pessoa)",
              "ja": true
            }
          ],
          [
            {
              "text": "autor, na passiva"
            },
            {
              "text": "かのじょ によって かかれた (foi escrita por ela)",
              "ja": true
            }
          ],
          [
            {
              "text": "autor, na passiva"
            },
            {
              "text": "そぼ によって そだてられた (foi criado pela avó)",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Na passiva, "
          },
          {
            "text": "によって",
            "bold": true
          },
          {
            "text": " costuma aparecer com criações e fatos (\"a carta foi escrita por ela\"); com pessoas comuns, "
          },
          {
            "text": "に",
            "bold": true
          },
          {
            "text": " também serve. Mas, para dizer \"conforme o caso\", só o "
          },
          {
            "text": "によって",
            "bold": true
          },
          {
            "text": " funciona."
          }
        ]
      }
    ],
    "pattern": "[A] によって [verbo] · [A] によって + [passiva]",
    "examples": [
      {
        "jp": "ひとに よって いけんが ことなる",
        "ruby": [
          {
            "text": "人",
            "reading": "ひと"
          },
          {
            "text": "によって"
          },
          {
            "text": "意見",
            "reading": "いけん"
          },
          {
            "text": "が"
          },
          {
            "text": "異",
            "reading": "こと"
          },
          {
            "text": "なる。"
          }
        ],
        "romaji": "hito ni yotte iken ga kotonaru",
        "pt": "As opiniões variam de uma pessoa a outra."
      },
      {
        "jp": "かれは そぼに よって そだてられた",
        "ruby": [
          {
            "text": "彼",
            "reading": "かれ"
          },
          {
            "text": "は"
          },
          {
            "text": "祖母",
            "reading": "そぼ"
          },
          {
            "text": "によって"
          },
          {
            "text": "育",
            "reading": "そだ"
          },
          {
            "text": "てられた。"
          }
        ],
        "romaji": "kare wa sobo ni yotte sodaterareta",
        "pt": "Ele foi criado pela avó."
      },
      {
        "jp": "てがみは かのじょに よって かかれた",
        "ruby": [
          {
            "text": "手紙",
            "reading": "てがみ"
          },
          {
            "text": "は"
          },
          {
            "text": "彼女",
            "reading": "かのじょ"
          },
          {
            "text": "によって"
          },
          {
            "text": "書",
            "reading": "か"
          },
          {
            "text": "かれた。"
          }
        ],
        "romaji": "tegami wa kanojo ni yotte kakareta",
        "pt": "A carta foi escrita por ela."
      }
    ]
  },
  {
    "id": "n3-6",
    "title": "Tanto quanto: 〜ほど",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "A palavra "
          },
          {
            "text": "ほど",
            "bold": true
          },
          {
            "text": " mede um "
          },
          {
            "text": "grau",
            "bold": true
          },
          {
            "text": ": \"a ponto de\", \"tão... quanto\". Ela aparece em três formas muito comuns."
          }
        ]
      },
      {
        "kind": "table",
        "rows": [
          [
            {
              "text": "padrão",
              "header": true
            },
            {
              "text": "exemplo",
              "header": true
            }
          ],
          [
            {
              "text": "A は B ほど 〜ない"
            },
            {
              "text": "かれ は あに ほど かしこくない (não é tão inteligente quanto o irmão)",
              "ja": true
            }
          ],
          [
            {
              "text": "〜ば 〜ほど"
            },
            {
              "text": "はやければ はやい ほど いい (quanto mais cedo, melhor)",
              "ja": true
            }
          ],
          [
            {
              "text": "それほど 〜ない"
            },
            {
              "text": "それほど かんたんで は ない (não é tão simples assim)",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Na comparação com "
          },
          {
            "text": "ほど",
            "bold": true
          },
          {
            "text": ", o fim da frase é sempre "
          },
          {
            "text": "negativo",
            "bold": true
          },
          {
            "text": ": \"A não é tão... quanto B\". Para \"quanto mais... mais...\", repita a mesma palavra na forma "
          },
          {
            "text": "ば",
            "bold": true
          },
          {
            "text": " e depois com "
          },
          {
            "text": "ほど",
            "bold": true
          },
          {
            "text": "."
          }
        ]
      }
    ],
    "pattern": "A は B ほど [negativo] · [〜ば] [〜] ほど · それほど [negativo]",
    "examples": [
      {
        "jp": "かれは あに ほど かしこくない",
        "ruby": [
          {
            "text": "彼",
            "reading": "かれ"
          },
          {
            "text": "は"
          },
          {
            "text": "兄",
            "reading": "あに"
          },
          {
            "text": "ほど"
          },
          {
            "text": "賢",
            "reading": "かしこ"
          },
          {
            "text": "くない。"
          }
        ],
        "romaji": "kare wa ani hodo kashikokunai",
        "pt": "Ele não é tão inteligente como meu irmão."
      },
      {
        "jp": "かれは まえ ほど べんきょう しない",
        "ruby": [
          {
            "text": "彼",
            "reading": "かれ"
          },
          {
            "text": "は"
          },
          {
            "text": "前",
            "reading": "まえ"
          },
          {
            "text": "ほど"
          },
          {
            "text": "勉強",
            "reading": "べんきょう"
          },
          {
            "text": "しない。"
          }
        ],
        "romaji": "kare wa mae hodo benkyō shinai",
        "pt": "Não estuda tanto como antes."
      },
      {
        "jp": "はやければ はやい ほど いい",
        "ruby": [
          {
            "text": "早",
            "reading": "はや"
          },
          {
            "text": "ければ"
          },
          {
            "text": "早",
            "reading": "はや"
          },
          {
            "text": "いほどいい。"
          }
        ],
        "romaji": "hayakereba hayai hodo ii",
        "pt": "Quanto antes, melhor."
      },
      {
        "jp": "それほど かんたんでは ない",
        "ruby": [
          {
            "text": "それほど"
          },
          {
            "text": "簡単",
            "reading": "かんたん"
          },
          {
            "text": "ではない。"
          }
        ],
        "romaji": "sorehodo kantande wa nai",
        "pt": "Não é tão simples assim."
      }
    ]
  },
  {
    "id": "n3-7",
    "title": "Não é que...: 〜わけがない e 〜わけではない",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "A palavra "
          },
          {
            "text": "わけ",
            "bold": true
          },
          {
            "text": " é \"motivo, razão\". Com ela, você diz que algo "
          },
          {
            "text": "não pode ser",
            "bold": true
          },
          {
            "text": " ou que \"não é que seja assim\". Vem depois da forma simples."
          }
        ]
      },
      {
        "kind": "table",
        "rows": [
          [
            {
              "text": "padrão",
              "header": true
            },
            {
              "text": "exemplo",
              "header": true
            }
          ],
          [
            {
              "text": "forma simples + わけがない"
            },
            {
              "text": "ある わけ が ない (não tem como existir)",
              "ja": true
            }
          ],
          [
            {
              "text": "forma simples + わけがない"
            },
            {
              "text": "わすれる わけ ない (como eu esqueceria?)",
              "ja": true
            }
          ],
          [
            {
              "text": "forma simples + わけではない"
            },
            {
              "text": "そう いう わけ じゃない (não é bem assim)",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "O "
          },
          {
            "text": "わけがない",
            "bold": true
          },
          {
            "text": " é forte: \"é impossível\". Já "
          },
          {
            "text": "わけではない",
            "bold": true
          },
          {
            "text": " só corrige um mal-entendido, de forma mais leve (\"não é que...\"). Na fala, "
          },
          {
            "text": "が",
            "bold": true
          },
          {
            "text": " cai e "
          },
          {
            "text": "では",
            "bold": true
          },
          {
            "text": " vira "
          },
          {
            "text": "じゃ",
            "bold": true
          },
          {
            "text": "."
          }
        ]
      }
    ],
    "pattern": "[forma simples] わけがない · [forma simples] わけではない",
    "examples": [
      {
        "jp": "わすれる わけ ないでしょ",
        "ruby": [
          {
            "text": "忘",
            "reading": "わす"
          },
          {
            "text": "れるわけないでしょ？"
          }
        ],
        "romaji": "wasureru wake naidesho",
        "pt": "Como eu pude esquecer?"
      },
      {
        "jp": "ある わけが ない",
        "ruby": [
          {
            "text": "あるわけがない。"
          }
        ],
        "romaji": "aru wake ga nai",
        "pt": "De jeito nenhum."
      },
      {
        "jp": "そう いう わけ じゃない",
        "ruby": [
          {
            "text": "そう"
          },
          {
            "text": "言",
            "reading": "い"
          },
          {
            "text": "うわけじゃない。"
          }
        ],
        "romaji": "sō iu wake janai",
        "pt": "Não, nem por isso."
      },
      {
        "jp": "なにが いいたい わけ",
        "ruby": [
          {
            "text": "何",
            "reading": "なに"
          },
          {
            "text": "が"
          },
          {
            "text": "言",
            "reading": "い"
          },
          {
            "text": "いたいわけ？"
          }
        ],
        "romaji": "nani ga iitai wake",
        "pt": "O que você está insinuando?"
      }
    ]
  },
  {
    "id": "n3-8",
    "title": "Não pode ser: 〜はずがない",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "No N4 você viu "
          },
          {
            "text": "はず",
            "bold": true
          },
          {
            "text": " (\"deve ser\"). Com "
          },
          {
            "text": "はずがない",
            "bold": true
          },
          {
            "text": " vira \""
          },
          {
            "text": "não pode ser",
            "bold": true
          },
          {
            "text": "\": quem fala tem certeza de que é impossível. Vem depois da forma simples (e "
          },
          {
            "text": "の",
            "bold": true
          },
          {
            "text": " depois de substantivo)."
          }
        ]
      },
      {
        "kind": "table",
        "rows": [
          [
            {
              "text": "padrão",
              "header": true
            },
            {
              "text": "exemplo",
              "header": true
            }
          ],
          [
            {
              "text": "forma simples + はずがない"
            },
            {
              "text": "かれ が うそ を いった はず が ない (ele não pode ter mentido)",
              "ja": true
            }
          ],
          [
            {
              "text": "substantivo + の + はずがない"
            },
            {
              "text": "ほんき の はず が ない (não pode ser sério)",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "はずがない",
            "bold": true
          },
          {
            "text": " e "
          },
          {
            "text": "わけがない",
            "bold": true
          },
          {
            "text": " são parecidos: os dois dizem \"impossível\". Com "
          },
          {
            "text": "はず",
            "bold": true
          },
          {
            "text": ", a conclusão vem de um raciocínio ou de um fato conhecido; com "
          },
          {
            "text": "わけ",
            "bold": true
          },
          {
            "text": ", da razão ou do bom senso."
          }
        ]
      }
    ],
    "pattern": "[forma simples] はずがない · [substantivo] の はずがない",
    "examples": [
      {
        "jp": "ほんきの はずが ないわ",
        "ruby": [
          {
            "text": "本気",
            "reading": "ほんき"
          },
          {
            "text": "のはずがないわ。"
          }
        ],
        "romaji": "honki no hazu ga naiwa",
        "pt": "Não podes estar a falar a sério."
      },
      {
        "jp": "かれが うそを いった はずが ない",
        "ruby": [
          {
            "text": "彼",
            "reading": "かれ"
          },
          {
            "text": "がうそを"
          },
          {
            "text": "言",
            "reading": "い"
          },
          {
            "text": "ったはずがない。"
          }
        ],
        "romaji": "kare ga uso o itta hazu ga nai",
        "pt": "Ele não pode ter contado uma mentira."
      },
      {
        "jp": "かれが その ことを いった はずが ない",
        "ruby": [
          {
            "text": "彼",
            "reading": "かれ"
          },
          {
            "text": "がその"
          },
          {
            "text": "事",
            "reading": "こと"
          },
          {
            "text": "を"
          },
          {
            "text": "言",
            "reading": "い"
          },
          {
            "text": "ったはずがない。"
          }
        ],
        "romaji": "kare ga sono koto o itta hazu ga nai",
        "pt": "Ele não pode ter dito isso."
      },
      {
        "jp": "かれが そんな ことを した はずが ない",
        "ruby": [
          {
            "text": "彼",
            "reading": "かれ"
          },
          {
            "text": "がそんなことをしたはずがない。"
          }
        ],
        "romaji": "kare ga sonna koto o shita hazu ga nai",
        "pt": "Ele não pode ter feito tal coisa."
      }
    ]
  },
  {
    "id": "n3-9",
    "title": "O momento da ação: 〜ところだ",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "A palavra "
          },
          {
            "text": "ところ",
            "bold": true
          },
          {
            "text": " (\"lugar\") também mostra "
          },
          {
            "text": "em que ponto da ação",
            "bold": true
          },
          {
            "text": " a pessoa está. A forma do verbo antes dela muda o sentido."
          }
        ]
      },
      {
        "kind": "table",
        "rows": [
          [
            {
              "text": "forma",
              "header": true
            },
            {
              "text": "sentido",
              "header": true
            }
          ],
          [
            {
              "text": "forma de dicionário + ところだ"
            },
            {
              "text": "でかける ところだ (está prestes a sair)",
              "ja": true
            }
          ],
          [
            {
              "text": "〜ている + ところだ"
            },
            {
              "text": "あらっている ところです (está no meio de lavar)",
              "ja": true
            }
          ],
          [
            {
              "text": "〜た + ところだ"
            },
            {
              "text": "でた ところだ (acabou de sair)",
              "ja": true
            }
          ],
          [
            {
              "text": "dicionário + ところだった"
            },
            {
              "text": "わすれる ところだった (quase esqueci)",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Cuidado com "
          },
          {
            "text": "〜たところ",
            "bold": true
          },
          {
            "text": " (\"acabou de\") e "
          },
          {
            "text": "〜たばかり",
            "bold": true
          },
          {
            "text": " (também \"acabou de\"): "
          },
          {
            "text": "ところ",
            "bold": true
          },
          {
            "text": " fala de um instante, de uns minutos atrás; "
          },
          {
            "text": "ばかり",
            "bold": true
          },
          {
            "text": " admite uma época mais longa (\"faz pouco tempo\")."
          }
        ]
      }
    ],
    "pattern": "[dicionário] ところだ · [〜ている] ところだ · [〜た] ところだ · [dicionário] ところだった",
    "examples": [
      {
        "jp": "かれは いま でかける ところだ",
        "ruby": [
          {
            "text": "彼",
            "reading": "かれ"
          },
          {
            "text": "は"
          },
          {
            "text": "今",
            "reading": "いま"
          },
          {
            "text": "出",
            "reading": "で"
          },
          {
            "text": "かけるところだ。"
          }
        ],
        "romaji": "kare wa ima dekakeru tokoroda",
        "pt": "Ele está saindo de casa agora."
      },
      {
        "jp": "かれは くるまを あらっている ところです",
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
            "text": "を"
          },
          {
            "text": "洗",
            "reading": "あら"
          },
          {
            "text": "っているところです。"
          }
        ],
        "romaji": "kare wa kuruma o aratteiru tokoro desu",
        "pt": "Ele está lavando o carro."
      },
      {
        "jp": "でんしゃに かさを わすれる ところだった",
        "ruby": [
          {
            "text": "電車",
            "reading": "でんしゃ"
          },
          {
            "text": "に"
          },
          {
            "text": "傘",
            "reading": "かさ"
          },
          {
            "text": "を"
          },
          {
            "text": "忘",
            "reading": "わす"
          },
          {
            "text": "れるところだった。"
          }
        ],
        "romaji": "densha ni kasa o wasureru tokorodatta",
        "pt": "Eu quase deixei meu guarda-chuva no trem."
      },
      {
        "jp": "れっしゃは でた ところだ",
        "ruby": [
          {
            "text": "列車",
            "reading": "れっしゃ"
          },
          {
            "text": "は"
          },
          {
            "text": "出",
            "reading": "で"
          },
          {
            "text": "たところだ。"
          }
        ],
        "romaji": "ressha wa deta tokoroda",
        "pt": "O trem acaba de partir."
      }
    ]
  },
  {
    "id": "n3-10",
    "title": "Enquanto dá tempo: 〜うちに",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "Com "
          },
          {
            "text": "うちに",
            "bold": true
          },
          {
            "text": " você faz algo "
          },
          {
            "text": "enquanto",
            "bold": true
          },
          {
            "text": " uma situação ainda dura, antes que ela mude: \"enquanto está quente\", \"enquanto está escuro\". O que vem depois é uma ação que vale a pena fazer antes da mudança."
          }
        ]
      },
      {
        "kind": "table",
        "rows": [
          [
            {
              "text": "padrão",
              "header": true
            },
            {
              "text": "exemplo",
              "header": true
            }
          ],
          [
            {
              "text": "adjetivo い + うちに"
            },
            {
              "text": "あたたかい うちに たべよう (vamos comer enquanto está quente)",
              "ja": true
            }
          ],
          [
            {
              "text": "verbo (forma simples) + うちに"
            },
            {
              "text": "くらい うちに おきた (acordei enquanto ainda estava escuro)",
              "ja": true
            }
          ],
          [
            {
              "text": "substantivo + の + うちに"
            },
            {
              "text": "ひるま の うちに (durante o dia)",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "A expressão "
          },
          {
            "text": "ちかい うちに",
            "bold": true
          },
          {
            "text": " (\"um dia desses\", \"em breve\") é muito comum. Ela fixa o sentido de "
          },
          {
            "text": "うちに",
            "bold": true
          },
          {
            "text": " como \"dentro de um período que ainda não acabou\"."
          }
        ]
      }
    ],
    "pattern": "[adjetivo/verbo simples] うちに · [substantivo] の うちに",
    "examples": [
      {
        "jp": "ぼくは くらい うちに おきた",
        "ruby": [
          {
            "text": "僕",
            "reading": "ぼく"
          },
          {
            "text": "は"
          },
          {
            "text": "暗",
            "reading": "くら"
          },
          {
            "text": "いうちに"
          },
          {
            "text": "起",
            "reading": "お"
          },
          {
            "text": "きた。"
          }
        ],
        "romaji": "boku wa kurai uchi ni okita",
        "pt": "Levantei enquanto ainda estava escuro."
      },
      {
        "jp": "あたたかい うちに たべよう",
        "ruby": [
          {
            "text": "温",
            "reading": "あたた"
          },
          {
            "text": "かいうちに"
          },
          {
            "text": "食",
            "reading": "た"
          },
          {
            "text": "べよう。"
          }
        ],
        "romaji": "atatakai uchi ni tabeyō",
        "pt": "Comamos enquanto esteja quente."
      },
      {
        "jp": "ちかい うちに お たずね します",
        "ruby": [
          {
            "text": "近",
            "reading": "ちか"
          },
          {
            "text": "いうちにお"
          },
          {
            "text": "訪",
            "reading": "たず"
          },
          {
            "text": "ねします。"
          }
        ],
        "romaji": "chikai uchi ni o tazune shimasu",
        "pt": "Eu virei te ver um dia desses."
      }
    ]
  },
  {
    "id": "n3-11",
    "title": "Graças a e por culpa de: 〜おかげ e 〜せい",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "Para dar a "
          },
          {
            "text": "causa",
            "bold": true
          },
          {
            "text": " de algo, o japonês separa o bom do ruim. O "
          },
          {
            "text": "おかげで",
            "bold": true
          },
          {
            "text": " vem de um resultado positivo (\"graças a\"); o "
          },
          {
            "text": "せいで",
            "bold": true
          },
          {
            "text": ", de um negativo (\"por culpa de\")."
          }
        ]
      },
      {
        "kind": "table",
        "rows": [
          [
            {
              "text": "padrão",
              "header": true
            },
            {
              "text": "exemplo",
              "header": true
            }
          ],
          [
            {
              "text": "A の おかげ(で)"
            },
            {
              "text": "あなた の おかげ です (é graças a você)",
              "ja": true
            }
          ],
          [
            {
              "text": "A の せい(で)"
            },
            {
              "text": "あめ の せい で さんぽ できなかった (a chuva nos impediu de passear)",
              "ja": true
            }
          ],
          [
            {
              "text": "A の せい では ない"
            },
            {
              "text": "あなた の せい では ありません (não é culpa sua)",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Antes de "
          },
          {
            "text": "おかげ",
            "bold": true
          },
          {
            "text": " e "
          },
          {
            "text": "せい",
            "bold": true
          },
          {
            "text": " use "
          },
          {
            "text": "の",
            "bold": true
          },
          {
            "text": " depois de substantivo; depois de verbo ou adjetivo, a forma simples. Para agradecer de coração, "
          },
          {
            "text": "おかげさまで",
            "bold": true
          },
          {
            "text": " (\"graças a você\") é muito usado."
          }
        ]
      }
    ],
    "pattern": "[A] の おかげで · [A] の せいで · [A] の せいではない",
    "examples": [
      {
        "jp": "わたしが いる のは ちちの おかげです",
        "ruby": [
          {
            "text": "私",
            "reading": "わたし"
          },
          {
            "text": "がいるのは"
          },
          {
            "text": "父",
            "reading": "ちち"
          },
          {
            "text": "のおかげです。"
          }
        ],
        "romaji": "watashi ga iru no wa chichi no okage desu",
        "pt": "Devo tudo o que sou ao meu pai."
      },
      {
        "jp": "あなたの おかげです",
        "ruby": [
          {
            "text": "あなたのおかげです。"
          }
        ],
        "romaji": "anata no okage desu",
        "pt": "Graças a você."
      },
      {
        "jp": "あめの せいで さんぽ できなかったんだ",
        "ruby": [
          {
            "text": "雨",
            "reading": "あめ"
          },
          {
            "text": "のせいで"
          },
          {
            "text": "散歩",
            "reading": "さんぽ"
          },
          {
            "text": "できなかったんだ。"
          }
        ],
        "romaji": "ame no sei de sanpo dekinakatta nda",
        "pt": "A chuva nos impediu de dar uma caminhada."
      },
      {
        "jp": "あなたの せいでは ありません",
        "ruby": [
          {
            "text": "あなたのせいではありません。"
          }
        ],
        "romaji": "anata no sei de wa arimasen",
        "pt": "Não é culpa sua."
      }
    ]
  },
  {
    "id": "n3-12",
    "title": "Do jeito que está: 〜まま",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "Com "
          },
          {
            "text": "まま",
            "bold": true
          },
          {
            "text": " a situação "
          },
          {
            "text": "continua como estava",
            "bold": true
          },
          {
            "text": ", sem mudar: a porta fica aberta, a pessoa fica calada. Vem depois do verbo na forma "
          },
          {
            "text": "〜た",
            "bold": true
          },
          {
            "text": " (ou "
          },
          {
            "text": "〜ない",
            "bold": true
          },
          {
            "text": ") ou de um substantivo com "
          },
          {
            "text": "の",
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
              "text": "padrão",
              "header": true
            },
            {
              "text": "exemplo",
              "header": true
            }
          ],
          [
            {
              "text": "verbo 〜た + まま"
            },
            {
              "text": "だまった まま だった (ficou calado)",
              "ja": true
            }
          ],
          [
            {
              "text": "verbo 〜た + まま"
            },
            {
              "text": "あけた まま で ねた (dormiu de janela aberta)",
              "ja": true
            }
          ],
          [
            {
              "text": "substantivo + の + まま"
            },
            {
              "text": "ともだち の まま (continuaram amigos)",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "O "
          },
          {
            "text": "まま",
            "bold": true
          },
          {
            "text": " costuma trazer uma ideia de que a situação \"devia ter mudado\" e não mudou, ou que isso foi sem querer ou descuido: "
          },
          {
            "text": "ひらいた まま",
            "bold": true
          },
          {
            "text": " é \"ficou aberto (e ninguém fechou)\"."
          }
        ]
      }
    ],
    "pattern": "[〜た] まま · [substantivo] の まま",
    "examples": [
      {
        "jp": "かれは だまった ままだった",
        "ruby": [
          {
            "text": "彼",
            "reading": "かれ"
          },
          {
            "text": "は"
          },
          {
            "text": "黙",
            "reading": "だま"
          },
          {
            "text": "ったままだった。"
          }
        ],
        "romaji": "kare wa damatta mamadatta",
        "pt": "Ele ficou em silêncio."
      },
      {
        "jp": "もんは あいた ままだった",
        "ruby": [
          {
            "text": "門",
            "reading": "もん"
          },
          {
            "text": "は"
          },
          {
            "text": "開",
            "reading": "あ"
          },
          {
            "text": "いたままだった。"
          }
        ],
        "romaji": "mon wa aita mamadatta",
        "pt": "Deixaram o portão aberto."
      },
      {
        "jp": "とは しまった ままだった",
        "ruby": [
          {
            "text": "戸",
            "reading": "と"
          },
          {
            "text": "は"
          },
          {
            "text": "閉",
            "reading": "し"
          },
          {
            "text": "まったままだった。"
          }
        ],
        "romaji": "to wa shimatta mamadatta",
        "pt": "A porta permaneceu fechada."
      },
      {
        "jp": "かれらは ともだちの ままだった",
        "ruby": [
          {
            "text": "彼",
            "reading": "かれ"
          },
          {
            "text": "らは"
          },
          {
            "text": "友達",
            "reading": "ともだち"
          },
          {
            "text": "のままだった。"
          }
        ],
        "romaji": "karera wa tomodachi no mamadatta",
        "pt": "Eles continuaram amigos."
      }
    ]
  },
  {
    "id": "n3-13",
    "title": "Até e só: 〜さえ",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "O "
          },
          {
            "text": "さえ",
            "bold": true
          },
          {
            "text": " tem dois usos. O primeiro é \""
          },
          {
            "text": "até",
            "bold": true
          },
          {
            "text": "\": mostra um caso extremo, e se entende que os outros valem também (\"até uma criança entende\"). O segundo é "
          },
          {
            "text": "さえ 〜ば",
            "bold": true
          },
          {
            "text": ": \"basta que... \"."
          }
        ]
      },
      {
        "kind": "table",
        "rows": [
          [
            {
              "text": "padrão",
              "header": true
            },
            {
              "text": "exemplo",
              "header": true
            }
          ],
          [
            {
              "text": "A さえ + frase"
            },
            {
              "text": "こども で さえ も わかる (até uma criança entende)",
              "ja": true
            }
          ],
          [
            {
              "text": "A さえ 〜ば"
            },
            {
              "text": "みず さえ あれば いい (basta ter água)",
              "ja": true
            }
          ],
          [
            {
              "text": "verbo (ます) + さえ すれば"
            },
            {
              "text": "あり さえ すれば いい (basta existir)",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "No uso de \"basta que\", "
          },
          {
            "text": "さえ",
            "bold": true
          },
          {
            "text": " substitui "
          },
          {
            "text": "が",
            "bold": true
          },
          {
            "text": " ou "
          },
          {
            "text": "を",
            "bold": true
          },
          {
            "text": " (\"só a água resolve\"), e a frase termina com "
          },
          {
            "text": "ば",
            "bold": true
          },
          {
            "text": " (\"se\"). Com o verbo, use "
          },
          {
            "text": "〜さえ すれば",
            "ja": true
          },
          {
            "text": "."
          }
        ]
      }
    ],
    "pattern": "A さえ 〜 · A さえ 〜ば · [verbo ます] さえ すれば",
    "examples": [
      {
        "jp": "みず さえ あれば いい",
        "ruby": [
          {
            "text": "水",
            "reading": "みず"
          },
          {
            "text": "さえあればいい。"
          }
        ],
        "romaji": "mizu sae areba ii",
        "pt": "Só precisamos de água."
      },
      {
        "jp": "みずが あり さえ すれば いい",
        "ruby": [
          {
            "text": "水",
            "reading": "みず"
          },
          {
            "text": "がありさえすればいい。"
          }
        ],
        "romaji": "mizu ga ari sae sureba ii",
        "pt": "Tudo de que precisamos é água."
      },
      {
        "jp": "こどもで さえも それは わかる",
        "ruby": [
          {
            "text": "子供",
            "reading": "こども"
          },
          {
            "text": "でさえもそれはわかる。"
          }
        ],
        "romaji": "kodomo de sae mo sore wa wakaru",
        "pt": "Até uma criança entende isso."
      }
    ]
  },
  {
    "id": "n3-14",
    "title": "Com jeito de: 〜っぽい",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "O sufixo "
          },
          {
            "text": "っぽい",
            "bold": true
          },
          {
            "text": " dá a uma palavra a ideia de \""
          },
          {
            "text": "com jeito de",
            "bold": true
          },
          {
            "text": ", "
          },
          {
            "text": "tende a",
            "bold": true
          },
          {
            "text": "\". Ele funciona como um adjetivo い, e vem depois da raiz do verbo ou de um substantivo."
          }
        ]
      },
      {
        "kind": "table",
        "rows": [
          [
            {
              "text": "padrão",
              "header": true
            },
            {
              "text": "exemplo",
              "header": true
            }
          ],
          [
            {
              "text": "raiz do verbo + っぽい"
            },
            {
              "text": "わすれっぽい (esquecido, tende a esquecer)",
              "ja": true
            }
          ],
          [
            {
              "text": "raiz do verbo + っぽい"
            },
            {
              "text": "ほれっぽい (se apaixona fácil)",
              "ja": true
            }
          ],
          [
            {
              "text": "substantivo + っぽい"
            },
            {
              "text": "ねつっぽい (com jeito de febre)",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "É um jeito informal de falar. Em geral dá um tom de crítica ou de impressão, não de elogio: "
          },
          {
            "text": "こども っぽい",
            "ja": true
          },
          {
            "text": " (\"infantil, meio criança\")."
          }
        ]
      }
    ],
    "pattern": "[raiz do verbo] っぽい · [substantivo] っぽい",
    "examples": [
      {
        "jp": "かれは わすれっぽい",
        "ruby": [
          {
            "text": "彼",
            "reading": "かれ"
          },
          {
            "text": "は"
          },
          {
            "text": "忘",
            "reading": "わす"
          },
          {
            "text": "れっぽい。"
          }
        ],
        "romaji": "kare wa wasureppoi",
        "pt": "Ele esquece as coisas facilmente."
      },
      {
        "jp": "かれは ほれっぽい ひとだ",
        "ruby": [
          {
            "text": "彼",
            "reading": "かれ"
          },
          {
            "text": "は"
          },
          {
            "text": "惚",
            "reading": "ほ"
          },
          {
            "text": "れっぽい"
          },
          {
            "text": "人",
            "reading": "ひと"
          },
          {
            "text": "だ。"
          }
        ],
        "romaji": "kare wa horeppoi hitoda",
        "pt": "Ele frequentemente se apaixona."
      },
      {
        "jp": "からだが ねつっぽいんだ",
        "ruby": [
          {
            "text": "体",
            "reading": "からだ"
          },
          {
            "text": "が"
          },
          {
            "text": "熱",
            "reading": "ねつ"
          },
          {
            "text": "っぽいんだ。"
          }
        ],
        "romaji": "karada ga netsuppoi nda",
        "pt": "Eu sinto febre."
      }
    ]
  },
  {
    "id": "n3-15",
    "title": "Acabar sendo: 〜ことになる",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "A forma "
          },
          {
            "text": "ことになる",
            "bold": true
          },
          {
            "text": " diz que algo \""
          },
          {
            "text": "ficou decidido",
            "bold": true
          },
          {
            "text": "\" ou \""
          },
          {
            "text": "acabou sendo assim",
            "bold": true
          },
          {
            "text": "\", sem que o falante tenha escolhido: foi uma decisão das circunstâncias, da empresa, de outras pessoas. Vem depois da forma simples."
          }
        ]
      },
      {
        "kind": "table",
        "rows": [
          [
            {
              "text": "padrão",
              "header": true
            },
            {
              "text": "exemplo",
              "header": true
            }
          ],
          [
            {
              "text": "forma simples + ことになる"
            },
            {
              "text": "めんどうな こと に なる (vai dar encrenca)",
              "ja": true
            }
          ],
          [
            {
              "text": "forma simples + ことになった"
            },
            {
              "text": "そんな こと に なった (acabou assim)",
              "ja": true
            }
          ],
          [
            {
              "text": "forma simples + ことになっている"
            },
            {
              "text": "まずい こと に なってる (está numa situação ruim)",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Compare com o que você viu no N4: "
          },
          {
            "text": "ことにする",
            "bold": true
          },
          {
            "text": " (\"eu decido\") e "
          },
          {
            "text": "ことになる",
            "bold": true
          },
          {
            "text": " (\"foi decidido, acabou sendo\"). O primeiro é uma escolha sua; o segundo, algo que aconteceu ou foi decidido por outros."
          }
        ]
      }
    ],
    "pattern": "[forma simples] ことになる · [forma simples] ことになった",
    "examples": [
      {
        "jp": "まずい ことに なってるの",
        "ruby": [
          {
            "text": "まずいことになってるの？"
          }
        ],
        "romaji": "mazui koto ni natteru no",
        "pt": "Você está em apuros?"
      },
      {
        "jp": "どうして そんな ことに なったの",
        "ruby": [
          {
            "text": "どうしてそんなことになったの？"
          }
        ],
        "romaji": "dōshite sonna koto ni natta no",
        "pt": "Por que isso aconteceu?"
      },
      {
        "jp": "めんどうな ことに なるよ",
        "ruby": [
          {
            "text": "面倒",
            "reading": "めんどう"
          },
          {
            "text": "なことになるよ。"
          }
        ],
        "romaji": "mendōna koto ni naru yo",
        "pt": "Você vai se meter em encrenca."
      }
    ]
  }
];

/** Exercícios do Montar e das Lacunas feitos com os exemplos acima (mesmo formato dos exercícios iniciais). */
export const BUILD_N3: readonly BuildExercise[] = [
  {
    "topic": "n3-1",
    "pt": "Ele parece doente.",
    "answer": [
      "かれ",
      "は",
      "びょうきらしい"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "kare wa byōkirashii",
    "hint": "らしい: parece que, pelo que ouvi ou vi."
  },
  {
    "topic": "n3-1",
    "pt": "Parece que vai chover esta noite.",
    "answer": [
      "よる",
      "は",
      "あめ",
      "に",
      "なるらしい"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "yoru wa ame ni narurashii",
    "hint": "らしい: parece que, pelo que ouvi ou vi."
  },
  {
    "topic": "n3-1",
    "pt": "Ele parece ser rico.",
    "answer": [
      "かれ",
      "は",
      "かねもちらしい"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "kare wa kanemochirashii",
    "hint": "らしい: parece que, pelo que ouvi ou vi."
  },
  {
    "topic": "n3-1",
    "pt": "Parece que ela está feliz.",
    "answer": [
      "かのじょ",
      "は",
      "しあわせらしい"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "kanojo wa shiawaserashii",
    "hint": "らしい: parece que, pelo que ouvi ou vi."
  },
  {
    "topic": "n3-2",
    "pt": "Falei de música.",
    "answer": [
      "おんがく",
      "について",
      "はなしたよ"
    ],
    "extra": [
      "を",
      "に"
    ],
    "romaji": "ongaku nitsuite hanashitayo",
    "hint": "について = sobre o assunto."
  },
  {
    "topic": "n3-2",
    "pt": "Ele mencionou-o.",
    "answer": [
      "かれ",
      "は",
      "それ",
      "について",
      "はなした"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "kare wa sore nitsuite hanashita",
    "hint": "について = sobre o assunto."
  },
  {
    "topic": "n3-2",
    "pt": "Este livro é sobre estrelas.",
    "answer": [
      "これ",
      "は",
      "ほし",
      "について",
      "の",
      "ほんです"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "kore wa hoshi nitsuite no hon desu",
    "hint": "について = sobre o assunto."
  },
  {
    "topic": "n3-2",
    "pt": "Do que ele está falando?",
    "answer": [
      "かれ",
      "は",
      "なに",
      "について",
      "はなしている"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "kare wa nani nitsuite hanashiteiru",
    "hint": "について = sobre o assunto."
  },
  {
    "topic": "n3-3",
    "pt": "Ele é famoso como médico.",
    "answer": [
      "かれ",
      "は",
      "いしゃ",
      "として",
      "ゆうめいだ"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "kare wa isha toshite yūmeida",
    "hint": "として = na função de, como."
  },
  {
    "topic": "n3-3",
    "pt": "Como cantora, ela é bem conhecida.",
    "answer": [
      "かのじょ",
      "は",
      "かしゅ",
      "として",
      "ゆうめいだ"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "kanojo wa kashu toshite yūmeida",
    "hint": "として = na função de, como."
  },
  {
    "topic": "n3-3",
    "pt": "Eu gosto de você como amigo.",
    "answer": [
      "ともだち",
      "として",
      "すきよ"
    ],
    "extra": [
      "を",
      "に"
    ],
    "romaji": "tomodachi toshite sukiyo",
    "hint": "として = na função de, como."
  },
  {
    "topic": "n3-3",
    "pt": "Ele não é bom como médico.",
    "answer": [
      "かれ",
      "は",
      "いしゃ",
      "として",
      "むのうだ"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "kare wa isha toshite munōda",
    "hint": "として = na função de, como."
  },
  {
    "topic": "n3-4",
    "pt": "Ela é gentil com animais.",
    "answer": [
      "かのじょ",
      "は",
      "どうぶつ",
      "に",
      "たいして",
      "やさしい"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "kanojo wa dōbutsu ni taishite yasashii",
    "hint": "に対して = em relação a, para com."
  },
  {
    "topic": "n3-4",
    "pt": "Ele está com raiva de você.",
    "answer": [
      "かれ",
      "は",
      "きみ",
      "に",
      "たいして",
      "おこっている"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "kare wa kimi ni taishite okotteiru",
    "hint": "に対して = em relação a, para com."
  },
  {
    "topic": "n3-4",
    "pt": "Você está chateado comigo, não está?",
    "answer": [
      "わたし",
      "に",
      "たいして",
      "おこってるんでしょう"
    ],
    "extra": [
      "で",
      "を"
    ],
    "romaji": "watashi ni taishite okotterundeshō",
    "hint": "に対して = em relação a, para com."
  },
  {
    "topic": "n3-4",
    "pt": "Eu sinto muito por ela.",
    "answer": [
      "かのじょ",
      "に",
      "たいして",
      "すまない",
      "き",
      "が",
      "します"
    ],
    "extra": [
      "で",
      "を"
    ],
    "romaji": "kanojo ni taishite sumanai ki ga shimasu",
    "hint": "に対して = em relação a, para com."
  },
  {
    "topic": "n3-5",
    "pt": "As opiniões variam de uma pessoa a outra.",
    "answer": [
      "ひと",
      "に",
      "よって",
      "いけん",
      "が",
      "ことなる"
    ],
    "extra": [
      "で",
      "を"
    ],
    "romaji": "hito ni yotte iken ga kotonaru",
    "hint": "によって: depende de A, ou foi feito por A."
  },
  {
    "topic": "n3-5",
    "pt": "Ele foi criado pela avó.",
    "answer": [
      "かれ",
      "は",
      "そぼ",
      "に",
      "よって",
      "そだてられた"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "kare wa sobo ni yotte sodaterareta",
    "hint": "によって: depende de A, ou foi feito por A."
  },
  {
    "topic": "n3-5",
    "pt": "A carta foi escrita por ela.",
    "answer": [
      "てがみ",
      "は",
      "かのじょ",
      "に",
      "よって",
      "かかれた"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "tegami wa kanojo ni yotte kakareta",
    "hint": "によって: depende de A, ou foi feito por A."
  },
  {
    "topic": "n3-6",
    "pt": "Ele não é tão inteligente como meu irmão.",
    "answer": [
      "かれ",
      "は",
      "あに",
      "ほど",
      "かしこくない"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "kare wa ani hodo kashikokunai",
    "hint": "ほど: o grau; com ば, \"quanto mais... mais...\"."
  },
  {
    "topic": "n3-6",
    "pt": "Não estuda tanto como antes.",
    "answer": [
      "かれ",
      "は",
      "まえ",
      "ほど",
      "べんきょう",
      "しない"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "kare wa mae hodo benkyō shinai",
    "hint": "ほど: o grau; com ば, \"quanto mais... mais...\"."
  },
  {
    "topic": "n3-6",
    "pt": "Quanto antes, melhor.",
    "answer": [
      "はやければ",
      "はやい",
      "ほど",
      "いい"
    ],
    "extra": [
      "を",
      "に"
    ],
    "romaji": "hayakereba hayai hodo ii",
    "hint": "ほど: o grau; com ば, \"quanto mais... mais...\"."
  },
  {
    "topic": "n3-6",
    "pt": "Não é tão simples assim.",
    "answer": [
      "それほど",
      "かんたんで",
      "は",
      "ない"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "sorehodo kantande wa nai",
    "hint": "ほど: o grau; com ば, \"quanto mais... mais...\"."
  },
  {
    "topic": "n3-7",
    "pt": "Como eu pude esquecer?",
    "answer": [
      "わすれる",
      "わけ",
      "ないでしょ"
    ],
    "extra": [
      "を",
      "に"
    ],
    "romaji": "wasureru wake naidesho",
    "hint": "わけがない: impossível; わけではない: não é bem assim."
  },
  {
    "topic": "n3-7",
    "pt": "De jeito nenhum.",
    "answer": [
      "ある",
      "わけ",
      "が",
      "ない"
    ],
    "extra": [
      "に",
      "で"
    ],
    "romaji": "aru wake ga nai",
    "hint": "わけがない: impossível; わけではない: não é bem assim."
  },
  {
    "topic": "n3-7",
    "pt": "Não, nem por isso.",
    "answer": [
      "そう",
      "いう",
      "わけ",
      "じゃない"
    ],
    "extra": [
      "を",
      "に"
    ],
    "romaji": "sō iu wake janai",
    "hint": "わけがない: impossível; わけではない: não é bem assim."
  },
  {
    "topic": "n3-7",
    "pt": "O que você está insinuando?",
    "answer": [
      "なに",
      "が",
      "いいたい",
      "わけ"
    ],
    "extra": [
      "に",
      "で"
    ],
    "romaji": "nani ga iitai wake",
    "hint": "わけがない: impossível; わけではない: não é bem assim."
  },
  {
    "topic": "n3-8",
    "pt": "Não podes estar a falar a sério.",
    "answer": [
      "ほんき",
      "の",
      "はず",
      "が",
      "ないわ"
    ],
    "extra": [
      "は",
      "を"
    ],
    "romaji": "honki no hazu ga naiwa",
    "hint": "はずがない: impossível, não pode ser."
  },
  {
    "topic": "n3-8",
    "pt": "Ele não pode ter contado uma mentira.",
    "answer": [
      "かれ",
      "が",
      "うそ",
      "を",
      "いった",
      "はず",
      "が",
      "ない"
    ],
    "extra": [
      "に",
      "で"
    ],
    "romaji": "kare ga uso o itta hazu ga nai",
    "hint": "はずがない: impossível, não pode ser."
  },
  {
    "topic": "n3-9",
    "pt": "Ele está saindo de casa agora.",
    "answer": [
      "かれ",
      "は",
      "いま",
      "でかける",
      "ところだ"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "kare wa ima dekakeru tokoroda",
    "hint": "ところ: prestes a, no meio de, acabou de."
  },
  {
    "topic": "n3-9",
    "pt": "Ele está lavando o carro.",
    "answer": [
      "かれ",
      "は",
      "くるま",
      "を",
      "あらっている",
      "ところです"
    ],
    "extra": [
      "も",
      "の"
    ],
    "romaji": "kare wa kuruma o aratteiru tokoro desu",
    "hint": "ところ: prestes a, no meio de, acabou de."
  },
  {
    "topic": "n3-9",
    "pt": "Eu quase deixei meu guarda-chuva no trem.",
    "answer": [
      "でんしゃ",
      "に",
      "かさ",
      "を",
      "わすれる",
      "ところだった"
    ],
    "extra": [
      "で",
      "は"
    ],
    "romaji": "densha ni kasa o wasureru tokorodatta",
    "hint": "ところ: prestes a, no meio de, acabou de."
  },
  {
    "topic": "n3-9",
    "pt": "O trem acaba de partir.",
    "answer": [
      "れっしゃ",
      "は",
      "でた",
      "ところだ"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "ressha wa deta tokoroda",
    "hint": "ところ: prestes a, no meio de, acabou de."
  },
  {
    "topic": "n3-10",
    "pt": "Levantei enquanto ainda estava escuro.",
    "answer": [
      "ぼく",
      "は",
      "くらい",
      "うち",
      "に",
      "おきた"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "boku wa kurai uchi ni okita",
    "hint": "うちに: enquanto ainda dá, antes de mudar."
  },
  {
    "topic": "n3-10",
    "pt": "Comamos enquanto esteja quente.",
    "answer": [
      "あたたかい",
      "うち",
      "に",
      "たべよう"
    ],
    "extra": [
      "で",
      "を"
    ],
    "romaji": "atatakai uchi ni tabeyō",
    "hint": "うちに: enquanto ainda dá, antes de mudar."
  },
  {
    "topic": "n3-10",
    "pt": "Eu virei te ver um dia desses.",
    "answer": [
      "ちかい",
      "うち",
      "に",
      "お",
      "たずね",
      "します"
    ],
    "extra": [
      "で",
      "を"
    ],
    "romaji": "chikai uchi ni o tazune shimasu",
    "hint": "うちに: enquanto ainda dá, antes de mudar."
  },
  {
    "topic": "n3-11",
    "pt": "Devo tudo o que sou ao meu pai.",
    "answer": [
      "わたし",
      "が",
      "いる",
      "の",
      "は",
      "ちち",
      "の",
      "おかげです"
    ],
    "extra": [
      "に",
      "で"
    ],
    "romaji": "watashi ga iru no wa chichi no okage desu",
    "hint": "おかげ: graças a (bom); せい: por culpa de (ruim)."
  },
  {
    "topic": "n3-11",
    "pt": "Graças a você.",
    "answer": [
      "あなた",
      "の",
      "おかげです"
    ],
    "extra": [
      "は",
      "を"
    ],
    "romaji": "anata no okage desu",
    "hint": "おかげ: graças a (bom); せい: por culpa de (ruim)."
  },
  {
    "topic": "n3-11",
    "pt": "A chuva nos impediu de dar uma caminhada.",
    "answer": [
      "あめ",
      "の",
      "せい",
      "で",
      "さんぽ",
      "できなかった",
      "んだ"
    ],
    "extra": [
      "は",
      "を"
    ],
    "romaji": "ame no sei de sanpo dekinakatta nda",
    "hint": "おかげ: graças a (bom); せい: por culpa de (ruim)."
  },
  {
    "topic": "n3-11",
    "pt": "Não é culpa sua.",
    "answer": [
      "あなた",
      "の",
      "せい",
      "で",
      "は",
      "ありません"
    ],
    "extra": [
      "を",
      "に"
    ],
    "romaji": "anata no sei de wa arimasen",
    "hint": "おかげ: graças a (bom); せい: por culpa de (ruim)."
  },
  {
    "topic": "n3-12",
    "pt": "Ele ficou em silêncio.",
    "answer": [
      "かれ",
      "は",
      "だまった",
      "ままだった"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "kare wa damatta mamadatta",
    "hint": "まま: continua como estava."
  },
  {
    "topic": "n3-12",
    "pt": "Deixaram o portão aberto.",
    "answer": [
      "もん",
      "は",
      "あいた",
      "ままだった"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "mon wa aita mamadatta",
    "hint": "まま: continua como estava."
  },
  {
    "topic": "n3-12",
    "pt": "A porta permaneceu fechada.",
    "answer": [
      "と",
      "は",
      "しまった",
      "ままだった"
    ],
    "extra": [
      "も",
      "に"
    ],
    "romaji": "to wa shimatta mamadatta",
    "hint": "まま: continua como estava."
  },
  {
    "topic": "n3-12",
    "pt": "Eles continuaram amigos.",
    "answer": [
      "かれら",
      "は",
      "ともだち",
      "の",
      "ままだった"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "karera wa tomodachi no mamadatta",
    "hint": "まま: continua como estava."
  },
  {
    "topic": "n3-13",
    "pt": "Só precisamos de água.",
    "answer": [
      "みず",
      "さえ",
      "あれば",
      "いい"
    ],
    "extra": [
      "を",
      "に"
    ],
    "romaji": "mizu sae areba ii",
    "hint": "さえ: até; ou \"basta que\" com ば."
  },
  {
    "topic": "n3-13",
    "pt": "Tudo de que precisamos é água.",
    "answer": [
      "みず",
      "が",
      "あり",
      "さえ",
      "すれば",
      "いい"
    ],
    "extra": [
      "に",
      "で"
    ],
    "romaji": "mizu ga ari sae sureba ii",
    "hint": "さえ: até; ou \"basta que\" com ば."
  },
  {
    "topic": "n3-13",
    "pt": "Até uma criança entende isso.",
    "answer": [
      "こども",
      "で",
      "さえ",
      "も",
      "それ",
      "は",
      "わかる"
    ],
    "extra": [
      "に",
      "を"
    ],
    "romaji": "kodomo de sae mo sore wa wakaru",
    "hint": "さえ: até; ou \"basta que\" com ば."
  },
  {
    "topic": "n3-14",
    "pt": "Ele esquece as coisas facilmente.",
    "answer": [
      "かれ",
      "は",
      "わすれっぽい"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "kare wa wasureppoi",
    "hint": "っぽい: com jeito de, tende a."
  },
  {
    "topic": "n3-14",
    "pt": "Ele frequentemente se apaixona.",
    "answer": [
      "かれ",
      "は",
      "ほれっぽい",
      "ひとだ"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "kare wa horeppoi hitoda",
    "hint": "っぽい: com jeito de, tende a."
  },
  {
    "topic": "n3-14",
    "pt": "Eu sinto febre.",
    "answer": [
      "からだ",
      "が",
      "ねつっぽい",
      "んだ"
    ],
    "extra": [
      "に",
      "で"
    ],
    "romaji": "karada ga netsuppoi nda",
    "hint": "っぽい: com jeito de, tende a."
  },
  {
    "topic": "n3-15",
    "pt": "Você está em apuros?",
    "answer": [
      "まずい",
      "こと",
      "に",
      "なってる",
      "の"
    ],
    "extra": [
      "で",
      "を"
    ],
    "romaji": "mazui koto ni natteru no",
    "hint": "ことになる: ficou decidido; acabou sendo."
  },
  {
    "topic": "n3-15",
    "pt": "Por que isso aconteceu?",
    "answer": [
      "どうして",
      "そんな",
      "こと",
      "に",
      "なった",
      "の"
    ],
    "extra": [
      "で",
      "を"
    ],
    "romaji": "dōshite sonna koto ni natta no",
    "hint": "ことになる: ficou decidido; acabou sendo."
  },
  {
    "topic": "n3-15",
    "pt": "Você vai se meter em encrenca.",
    "answer": [
      "めんどうな",
      "こと",
      "に",
      "なる",
      "よ"
    ],
    "extra": [
      "で",
      "を"
    ],
    "romaji": "mendōna koto ni naru yo",
    "hint": "ことになる: ficou decidido; acabou sendo."
  }
];

/** Ids das frases do Tatoeba usadas nos exemplos (para o crédito). */
export const GRAMMAR_N3_SENTENCE_IDS: readonly number[] = [100541,79709,108153,90133,158200,112236,218242,883097,110065,90817,11977679,110066,87698,108056,4897810,94795,144656,102896,148574,107998,102981,139697,3555706,12022251,2190027,213803,3455723,81586,121048,120899,120848,107131,104631,124805,77487,82003,188334,179920,168056,4760435,10784642,2043892,99535,10284360,174541,96075,12453472,10516148,168690,100010,2422273,138015,8760370,11294717,80195];
