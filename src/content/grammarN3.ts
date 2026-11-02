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
        "pt": "Você não pode estar falando sério."
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
        "pt": "Vamos comer enquanto a comida está quente."
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
            "text": "こどもっぽい",
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
  },
  {
    "id": "n3-16",
    "title": "Não aguento: 〜てたまらない",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "O "
          },
          {
            "text": "〜てたまらない",
            "bold": true
          },
          {
            "text": " diz que uma sensação ou um sentimento é "
          },
          {
            "text": "forte demais para suportar",
            "bold": true
          },
          {
            "text": ": dor, calor, vontade. Vem a forma "
          },
          {
            "text": "て",
            "bold": true
          },
          {
            "text": " de um adjetivo ou do "
          },
          {
            "text": "〜たい",
            "bold": true
          },
          {
            "text": " + "
          },
          {
            "text": "たまらない",
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
              "text": "adjetivo い (くて) + たまらない"
            },
            {
              "text": "いたくて たまらない (a dor é insuportável)",
              "ja": true
            }
          ],
          [
            {
              "text": "adjetivo い (くて) + たまらない"
            },
            {
              "text": "あつくて たまらない (o calor é insuportável)",
              "ja": true
            }
          ],
          [
            {
              "text": "adjetivo な (で) + たまらない"
            },
            {
              "text": "しんぱいで たまらない (estou preocupadíssimo)",
              "ja": true
            }
          ],
          [
            {
              "text": "〜たくて + たまらない"
            },
            {
              "text": "いきたくて たまらない (estou louco para ir)",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Só se usa para a sensação de "
          },
          {
            "text": "quem fala",
            "bold": true
          },
          {
            "text": ": dor, calor, desejo. Para dizer o mesmo de outra pessoa, o japonês muda a forma ("
          },
          {
            "text": "いたがっている",
            "ja": true
          },
          {
            "text": ")."
          }
        ]
      }
    ],
    "pattern": "[adjetivo い, くて] たまらない · [adjetivo な, で] たまらない · [〜たくて] たまらない",
    "examples": [
      {
        "jp": "いたくて たまらない",
        "ruby": [
          {
            "text": "痛",
            "reading": "いた"
          },
          {
            "text": "くてたまらない。"
          }
        ],
        "romaji": "itakute tamaranai",
        "pt": "Eu não suporto a dor."
      },
      {
        "jp": "あつくて たまらない",
        "ruby": [
          {
            "text": "暑",
            "reading": "あつ"
          },
          {
            "text": "くてたまらない。"
          }
        ],
        "romaji": "atsukute tamaranai",
        "pt": "Eu não suporto este calor."
      },
      {
        "jp": "あしが いたくて たまらない",
        "ruby": [
          {
            "text": "足",
            "reading": "あし"
          },
          {
            "text": "が"
          },
          {
            "text": "痛",
            "reading": "いた"
          },
          {
            "text": "くてたまらない。"
          }
        ],
        "romaji": "ashi ga itakute tamaranai",
        "pt": "Meus pés estão me matando."
      }
    ]
  },
  {
    "id": "n3-17",
    "title": "Se ou não: 〜かどうか",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "Uma pergunta de sim ou não pode virar parte de outra frase com "
          },
          {
            "text": "かどうか",
            "bold": true
          },
          {
            "text": ": \"se ele vem ou não\". Vem depois da "
          },
          {
            "text": "forma simples",
            "bold": true
          },
          {
            "text": ", e a frase termina com um verbo como "
          },
          {
            "text": "しらない",
            "ja": true
          },
          {
            "text": " (não sei), "
          },
          {
            "text": "わからない",
            "ja": true
          },
          {
            "text": " (não entendo) ou "
          },
          {
            "text": "ぎもんだ",
            "ja": true
          },
          {
            "text": " (tenho dúvida)."
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
              "text": "forma simples + かどうか"
            },
            {
              "text": "くる か どう か しらない (não sei se vem)",
              "ja": true
            }
          ],
          [
            {
              "text": "substantivo + かどうか"
            },
            {
              "text": "ほんとう か どう か (se é verdade)",
              "ja": true
            }
          ],
          [
            {
              "text": "かどうか + は + frase"
            },
            {
              "text": "くる か どう か は もんだいで は ない (não importa se vem ou não)",
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
            "text": "か",
            "bold": true
          },
          {
            "text": " sozinho serve quando a frase já tem uma palavra de pergunta: "
          },
          {
            "text": "なに を たべる か",
            "ja": true
          },
          {
            "text": " (\"o que comer\"). O "
          },
          {
            "text": "かどうか",
            "bold": true
          },
          {
            "text": " é para o \"sim ou não\": é o \"se\" do português."
          }
        ]
      }
    ],
    "pattern": "[forma simples] かどうか + [知らない / わからない / 問題だ]",
    "examples": [
      {
        "jp": "かれが くる か どう か しらない",
        "ruby": [
          {
            "text": "彼",
            "reading": "かれ"
          },
          {
            "text": "が"
          },
          {
            "text": "来",
            "reading": "く"
          },
          {
            "text": "るかどうか"
          },
          {
            "text": "知",
            "reading": "し"
          },
          {
            "text": "らない。"
          }
        ],
        "romaji": "kare ga kuru ka dō ka shiranai",
        "pt": "Não sei se ele vem."
      },
      {
        "jp": "あした あめが ふる か どう か わからない",
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
            "text": "るかどうかわからない。"
          }
        ],
        "romaji": "ashita ame ga furu ka dō ka wakaranai",
        "pt": "Não sei se amanhã vai chover."
      },
      {
        "jp": "きみが くる か どう かは もんだいでは ない",
        "ruby": [
          {
            "text": "君",
            "reading": "きみ"
          },
          {
            "text": "が"
          },
          {
            "text": "来",
            "reading": "く"
          },
          {
            "text": "るかどうかは"
          },
          {
            "text": "問題",
            "reading": "もんだい"
          },
          {
            "text": "ではない。"
          }
        ],
        "romaji": "kimi ga kuru ka dō ka wa mondaide wa nai",
        "pt": "Não importa se você vem ou não."
      },
      {
        "jp": "かれが くる か どう か ぎもんだ",
        "ruby": [
          {
            "text": "彼",
            "reading": "かれ"
          },
          {
            "text": "が"
          },
          {
            "text": "来",
            "reading": "く"
          },
          {
            "text": "るかどうか"
          },
          {
            "text": "疑問",
            "reading": "ぎもん"
          },
          {
            "text": "だ。"
          }
        ],
        "romaji": "kare ga kuru ka dō ka gimonda",
        "pt": "Tenho dúvidas se ele virá."
      }
    ]
  },
  {
    "id": "n3-18",
    "title": "Deveria: 〜べき",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "Com "
          },
          {
            "text": "べき",
            "bold": true
          },
          {
            "text": " você diz o que se "
          },
          {
            "text": "deve",
            "bold": true
          },
          {
            "text": " fazer, o que é o certo. Vem depois do verbo na "
          },
          {
            "text": "forma de dicionário",
            "bold": true
          },
          {
            "text": ". É mais forte que "
          },
          {
            "text": "〜ほうがいい",
            "bold": true
          },
          {
            "text": ": pode soar como cobrança."
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
              "text": "dicionário + べきだ"
            },
            {
              "text": "いう べきだ (deve-se dizer)",
              "ja": true
            }
          ],
          [
            {
              "text": "する → すべき ou するべき"
            },
            {
              "text": "しゃざい すべきだ (deveria pedir desculpas)",
              "ja": true
            }
          ],
          [
            {
              "text": "べきではない"
            },
            {
              "text": "いう べき では ない (não se deve dizer)",
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
            "text": "する",
            "bold": true
          },
          {
            "text": " existem duas formas, "
          },
          {
            "text": "すべき",
            "ja": true
          },
          {
            "text": " e "
          },
          {
            "text": "するべき",
            "ja": true
          },
          {
            "text": ", e as duas estão certas. Para aconselhar com mais leveza, use "
          },
          {
            "text": "〜ほうがいい",
            "bold": true
          },
          {
            "text": "; para obrigação do dia a dia, "
          },
          {
            "text": "〜なければならない",
            "bold": true
          },
          {
            "text": "."
          }
        ]
      }
    ],
    "pattern": "[dicionário] べきだ · [dicionário] べきではない",
    "examples": [
      {
        "jp": "しんじつを いう べきだ",
        "ruby": [
          {
            "text": "真実",
            "reading": "しんじつ"
          },
          {
            "text": "を"
          },
          {
            "text": "言",
            "reading": "い"
          },
          {
            "text": "うべきだ。"
          }
        ],
        "romaji": "shinjitsu o iu bekida",
        "pt": "Você deveria dizer a verdade."
      },
      {
        "jp": "きみは しゃざい すべきだ",
        "ruby": [
          {
            "text": "君",
            "reading": "きみ"
          },
          {
            "text": "は"
          },
          {
            "text": "謝罪",
            "reading": "しゃざい"
          },
          {
            "text": "すべきだ。"
          }
        ],
        "romaji": "kimi wa shazai subekida",
        "pt": "Você devia se desculpar."
      },
      {
        "jp": "やめる べきだよ",
        "ruby": [
          {
            "text": "辞",
            "reading": "や"
          },
          {
            "text": "めるべきだよ。"
          }
        ],
        "romaji": "yameru bekida yo",
        "pt": "Você deveria sair."
      },
      {
        "jp": "きんえん する べきです",
        "ruby": [
          {
            "text": "禁煙",
            "reading": "きんえん"
          },
          {
            "text": "するべきです。"
          }
        ],
        "romaji": "kin'en suru beki desu",
        "pt": "Você deve parar de fumar."
      }
    ]
  },
  {
    "id": "n3-19",
    "title": "Sem fazer: 〜ずに",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "O "
          },
          {
            "text": "ずに",
            "bold": true
          },
          {
            "text": " diz \""
          },
          {
            "text": "sem fazer",
            "bold": true
          },
          {
            "text": "\": a ação não acontece enquanto outra acontece. Ele se forma com a "
          },
          {
            "text": "forma ない sem o ない",
            "bold": true
          },
          {
            "text": " + "
          },
          {
            "text": "ずに",
            "bold": true
          },
          {
            "text": ". É a versão mais formal (e mais de texto) do "
          },
          {
            "text": "〜ないで",
            "bold": true
          },
          {
            "text": " que você já viu."
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
              "text": "verbo (sem ない) + ずに"
            },
            {
              "text": "わすれ ずに (sem esquecer)",
              "ja": true
            }
          ],
          [
            {
              "text": "verbo (sem ない) + ずに"
            },
            {
              "text": "ぬが ずに (sem tirar)",
              "ja": true
            }
          ],
          [
            {
              "text": "する → せずに"
            },
            {
              "text": "そうだん せ ずに (sem consultar)",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "A única exceção é "
          },
          {
            "text": "する",
            "bold": true
          },
          {
            "text": ": "
          },
          {
            "text": "せずに",
            "ja": true
          },
          {
            "text": ", e não "
          },
          {
            "text": "しずに",
            "ja": true
          },
          {
            "text": ". Combinações como "
          },
          {
            "text": "〜ずにはいられない",
            "ja": true
          },
          {
            "text": " (\"não consigo deixar de...\") também usam essa forma."
          }
        ]
      }
    ],
    "pattern": "[verbo, forma ない sem ない] ずに",
    "examples": [
      {
        "jp": "わすれず に でんわ してね",
        "ruby": [
          {
            "text": "忘",
            "reading": "わす"
          },
          {
            "text": "れずに"
          },
          {
            "text": "電話",
            "reading": "でんわ"
          },
          {
            "text": "してね。"
          }
        ],
        "romaji": "wasurezu ni denwa shitene",
        "pt": "Não esqueça de me ligar."
      },
      {
        "jp": "だれにも そうだん せず に やった",
        "ruby": [
          {
            "text": "誰",
            "reading": "だれ"
          },
          {
            "text": "にも"
          },
          {
            "text": "相談",
            "reading": "そうだん"
          },
          {
            "text": "せずにやった。"
          }
        ],
        "romaji": "dare ni mo sōdan sezu ni yatta",
        "pt": "Fiz aquilo sem consultar ninguém."
      },
      {
        "jp": "わたしは がいしゅつ せず に いえに いた",
        "ruby": [
          {
            "text": "私",
            "reading": "わたし"
          },
          {
            "text": "は"
          },
          {
            "text": "外出",
            "reading": "がいしゅつ"
          },
          {
            "text": "せずに"
          },
          {
            "text": "家",
            "reading": "いえ"
          },
          {
            "text": "にいた。"
          }
        ],
        "romaji": "watashi wa gaishutsu sezu ni ie ni ita",
        "pt": "Eu fiquei em casa ao invés de sair."
      },
      {
        "jp": "くつは ぬがず に どうぞ",
        "ruby": [
          {
            "text": "靴",
            "reading": "くつ"
          },
          {
            "text": "は"
          },
          {
            "text": "脱",
            "reading": "ぬ"
          },
          {
            "text": "がずにどうぞ。"
          }
        ],
        "romaji": "kutsu wa nugazu ni dōzo",
        "pt": "Por favor, não tire os sapatos."
      }
    ]
  },
  {
    "id": "n3-20",
    "title": "Quero que você faça: 〜てほしい",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "Com "
          },
          {
            "text": "ほしい",
            "bold": true
          },
          {
            "text": " depois da forma "
          },
          {
            "text": "て",
            "bold": true
          },
          {
            "text": ", você diz o que quer que "
          },
          {
            "text": "outra pessoa",
            "bold": true
          },
          {
            "text": " faça. Quem deve fazer vem com "
          },
          {
            "text": "に",
            "bold": true
          },
          {
            "text": ". Se o desejo é seu, use "
          },
          {
            "text": "〜たい",
            "bold": true
          },
          {
            "text": "; se é do outro, "
          },
          {
            "text": "〜てほしい",
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
              "text": "verbo て + ほしい"
            },
            {
              "text": "うたって ほしい (quero que cante)",
              "ja": true
            }
          ],
          [
            {
              "text": "pessoa に + verbo て + ほしい"
            },
            {
              "text": "あなた に うたって ほしい (quero que você cante)",
              "ja": true
            }
          ],
          [
            {
              "text": "verbo ない + で + ほしい"
            },
            {
              "text": "いわ ないで ほしい (não quero que diga)",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Para um pedido educado, termine com "
          },
          {
            "text": "〜のですが",
            "bold": true
          },
          {
            "text": ": "
          },
          {
            "text": "かえて ほしい のですが",
            "ja": true
          },
          {
            "text": " (\"gostaria que trocasse...\"). Em frases do dia a dia, "
          },
          {
            "text": "ほしい",
            "bold": true
          },
          {
            "text": " também aparece como pedido gentil, sem "
          },
          {
            "text": "あなた",
            "bold": true
          },
          {
            "text": "."
          }
        ]
      }
    ],
    "pattern": "[pessoa に] [verbo て] ほしい · [verbo ない] で ほしい",
    "examples": [
      {
        "jp": "あなたに うたって ほしい",
        "ruby": [
          {
            "text": "あなたに"
          },
          {
            "text": "歌",
            "reading": "うた"
          },
          {
            "text": "ってほしい。"
          }
        ],
        "romaji": "anata ni utatte hoshii",
        "pt": "Quero que cantes."
      },
      {
        "jp": "せきを かえて ほしいのですが",
        "ruby": [
          {
            "text": "席",
            "reading": "せき"
          },
          {
            "text": "を"
          },
          {
            "text": "替",
            "reading": "か"
          },
          {
            "text": "えてほしいのですが。"
          }
        ],
        "romaji": "seki o kaete hoshii nodesuga",
        "pt": "Gostaria de trocar de lugar."
      },
      {
        "jp": "わたしと いっしょに いて ほしいの",
        "ruby": [
          {
            "text": "私",
            "reading": "わたし"
          },
          {
            "text": "と"
          },
          {
            "text": "一緒",
            "reading": "いっしょ"
          },
          {
            "text": "にいてほしいの。"
          }
        ],
        "romaji": "watashi to issho ni ite hoshii no",
        "pt": "Quero que fiques comigo."
      },
      {
        "jp": "たまごを ゆでて ほしいのです",
        "ruby": [
          {
            "text": "卵",
            "reading": "たまご"
          },
          {
            "text": "をゆでてほしいのです。"
          }
        ],
        "romaji": "tamago o yudete hoshii nodesu",
        "pt": "Eu quero um ovo cozido."
      }
    ]
  },
  {
    "id": "n3-21",
    "title": "Tentar e estar para: 〜ようとする",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "Com a "
          },
          {
            "text": "forma volitiva",
            "bold": true
          },
          {
            "text": " + "
          },
          {
            "text": "とする",
            "bold": true
          },
          {
            "text": ", você diz que alguém "
          },
          {
            "text": "tenta",
            "bold": true
          },
          {
            "text": " fazer algo (mas o resultado não está garantido) ou que algo "
          },
          {
            "text": "está para",
            "bold": true
          },
          {
            "text": " acontecer."
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
              "text": "grupo 1: u → ō"
            },
            {
              "text": "にげる → にげよう · いく → いこう",
              "ja": true
            }
          ],
          [
            {
              "text": "volitiva + と する"
            },
            {
              "text": "あけよう と する (tenta abrir)",
              "ja": true
            }
          ],
          [
            {
              "text": "volitiva + と している"
            },
            {
              "text": "しゅっぱつ しよう と している (está para partir)",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "No "
          },
          {
            "text": "ている",
            "bold": true
          },
          {
            "text": " o sentido é \"está prestes a\". Não confunda com "
          },
          {
            "text": "〜てみる",
            "bold": true
          },
          {
            "text": " (\"experimentar, para ver como é\"): o "
          },
          {
            "text": "ようとする",
            "bold": true
          },
          {
            "text": " é um esforço de fazer algo, que pode falhar."
          }
        ]
      }
    ],
    "pattern": "[forma volitiva] とする · [forma volitiva] としている",
    "examples": [
      {
        "jp": "わたしは にげよう と した",
        "ruby": [
          {
            "text": "私",
            "reading": "わたし"
          },
          {
            "text": "は"
          },
          {
            "text": "逃",
            "reading": "に"
          },
          {
            "text": "げようとした。"
          }
        ],
        "romaji": "watashi wa nigeyō to shita",
        "pt": "Tentei escapar."
      },
      {
        "jp": "かれは ドアを あけよう と した",
        "ruby": [
          {
            "text": "彼",
            "reading": "かれ"
          },
          {
            "text": "はドアを"
          },
          {
            "text": "開",
            "reading": "あ"
          },
          {
            "text": "けようとした。"
          }
        ],
        "romaji": "kare wa doa o akeyō to shita",
        "pt": "Ele tentou abrir a porta."
      },
      {
        "jp": "わたしは きょくを おぼえよう と した",
        "ruby": [
          {
            "text": "私",
            "reading": "わたし"
          },
          {
            "text": "は"
          },
          {
            "text": "曲",
            "reading": "きょく"
          },
          {
            "text": "を"
          },
          {
            "text": "覚",
            "reading": "おぼ"
          },
          {
            "text": "えようとした。"
          }
        ],
        "romaji": "watashi wa kyoku o oboeyō to shita",
        "pt": "Tentei aprender a melodia de cor."
      },
      {
        "jp": "かのじょは しゅっぱつ しよう と している",
        "ruby": [
          {
            "text": "彼女",
            "reading": "かのじょ"
          },
          {
            "text": "は"
          },
          {
            "text": "出発",
            "reading": "しゅっぱつ"
          },
          {
            "text": "しようとしている。"
          }
        ],
        "romaji": "kanojo wa shuppatsu shiyō to shiteiru",
        "pt": "Ela está para partir."
      }
    ]
  },
  {
    "id": "n3-22",
    "title": "Do jeito que: 〜とおり",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "A palavra "
          },
          {
            "text": "とおり",
            "bold": true
          },
          {
            "text": " diz \""
          },
          {
            "text": "exatamente do jeito que",
            "bold": true
          },
          {
            "text": "\". Vem depois de um verbo na forma simples ou de um substantivo com "
          },
          {
            "text": "の",
            "bold": true
          },
          {
            "text": ", e pode ser seguida de "
          },
          {
            "text": "に",
            "bold": true
          },
          {
            "text": " ou de "
          },
          {
            "text": "だ",
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
              "text": "verbo + とおりに + ação"
            },
            {
              "text": "いう とおり に して (faça como eu digo)",
              "ja": true
            }
          ],
          [
            {
              "text": "verbo + とおりだ"
            },
            {
              "text": "きみ が いう とおりだ (é como você diz)",
              "ja": true
            }
          ],
          [
            {
              "text": "substantivo + の + とおり"
            },
            {
              "text": "つぎ の とおり (como segue)",
              "ja": true
            }
          ],
          [
            {
              "text": "substantivo + どおり"
            },
            {
              "text": "よてい どおり (como planejado)",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Cuidado: o "
          },
          {
            "text": "とおり",
            "bold": true
          },
          {
            "text": " que significa \"rua\" (通り) é outra palavra. Aqui, depois de um verbo, ele quer dizer \"do jeito que\". Depois de um substantivo sem "
          },
          {
            "text": "の",
            "bold": true
          },
          {
            "text": ", o som muda para "
          },
          {
            "text": "どおり",
            "bold": true
          },
          {
            "text": "."
          }
        ]
      }
    ],
    "pattern": "[verbo] とおりに · [verbo] とおりだ · [substantivo] の とおり · [substantivo] どおり",
    "examples": [
      {
        "jp": "いう とおり に して",
        "ruby": [
          {
            "text": "言",
            "reading": "い"
          },
          {
            "text": "うとおりにして。"
          }
        ],
        "romaji": "iu tōri ni shite",
        "pt": "Faça assim como lhe digo."
      },
      {
        "jp": "かれの いう とおりだ と おもう",
        "ruby": [
          {
            "text": "彼",
            "reading": "かれ"
          },
          {
            "text": "の"
          },
          {
            "text": "言",
            "reading": "い"
          },
          {
            "text": "うとおりだと"
          },
          {
            "text": "思",
            "reading": "おも"
          },
          {
            "text": "う。"
          }
        ],
        "romaji": "kare no iu tōrida to omō",
        "pt": "Acho que ele tem razão."
      },
      {
        "jp": "まったく きみが いう とおりだ",
        "ruby": [
          {
            "text": "全",
            "reading": "まった"
          },
          {
            "text": "く"
          },
          {
            "text": "君",
            "reading": "きみ"
          },
          {
            "text": "が"
          },
          {
            "text": "言",
            "reading": "い"
          },
          {
            "text": "うとおりだ。"
          }
        ],
        "romaji": "mattaku kimi ga iu tōrida",
        "pt": "Você tem toda a razão."
      },
      {
        "jp": "かれの いう とおり に しなさい",
        "ruby": [
          {
            "text": "彼",
            "reading": "かれ"
          },
          {
            "text": "の"
          },
          {
            "text": "言",
            "reading": "い"
          },
          {
            "text": "うとおりにしなさい。"
          }
        ],
        "romaji": "kare no iu tōri ni shinasai",
        "pt": "Faz como ele te diz."
      }
    ]
  },
  {
    "id": "n3-23",
    "title": "Toda vez que: 〜たびに e 〜ごとに",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "As duas expressões dizem \"a cada\". O "
          },
          {
            "text": "たびに",
            "bold": true
          },
          {
            "text": " vem depois de um verbo (forma de dicionário) ou de um substantivo com "
          },
          {
            "text": "の",
            "bold": true
          },
          {
            "text": ": \"toda vez que...\". O "
          },
          {
            "text": "ごとに",
            "bold": true
          },
          {
            "text": " vem depois de um substantivo de tempo: \"a cada dia, a cada três dias\"."
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
              "text": "verbo (dicionário) + たびに"
            },
            {
              "text": "みる たび に なく (choro toda vez que vejo)",
              "ja": true
            }
          ],
          [
            {
              "text": "período + ごとに"
            },
            {
              "text": "ひ ごと に (a cada dia, dia após dia)",
              "ja": true
            }
          ],
          [
            {
              "text": "número + período + ごとに"
            },
            {
              "text": "みっか ごと に (a cada três dias)",
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
            "text": "ごとに",
            "bold": true
          },
          {
            "text": " e uma mudança (\"fica mais quente\", \"melhora\"), o sentido é de "
          },
          {
            "text": "progresso",
            "bold": true
          },
          {
            "text": ": \"dia após dia\". O "
          },
          {
            "text": "たびに",
            "bold": true
          },
          {
            "text": " é o que se repete toda vez que algo acontece."
          }
        ]
      }
    ],
    "pattern": "[verbo] たびに · [período] ごとに",
    "examples": [
      {
        "jp": "ひごと に あたたかく なっている",
        "ruby": [
          {
            "text": "日",
            "reading": "ひ"
          },
          {
            "text": "ごとに"
          },
          {
            "text": "暖",
            "reading": "あたた"
          },
          {
            "text": "かくなっている。"
          }
        ],
        "romaji": "higoto ni atatakaku natteiru",
        "pt": "Está ficando mais quente dia após dia."
      },
      {
        "jp": "かれは ひごと に よく なってきている",
        "ruby": [
          {
            "text": "彼",
            "reading": "かれ"
          },
          {
            "text": "は"
          },
          {
            "text": "日",
            "reading": "ひ"
          },
          {
            "text": "ごとによくなってきている。"
          }
        ],
        "romaji": "kare wa higoto ni yoku nattekiteiru",
        "pt": "Ele está melhorando dia após dia."
      },
      {
        "jp": "この えいがを みる たび に なく",
        "ruby": [
          {
            "text": "この"
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
            "text": "るたびに"
          },
          {
            "text": "泣",
            "reading": "な"
          },
          {
            "text": "く。"
          }
        ],
        "romaji": "kono eiga o miru tabi ni naku",
        "pt": "Eu choro toda vez que assisto a este filme."
      }
    ]
  },
  {
    "id": "n3-24",
    "title": "Como e para que: 〜ように",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "O "
          },
          {
            "text": "ように",
            "bold": true
          },
          {
            "text": " tem quatro usos que aparecem o tempo todo: \""
          },
          {
            "text": "como",
            "bold": true
          },
          {
            "text": "\" (comparação), \""
          },
          {
            "text": "do jeito que",
            "bold": true
          },
          {
            "text": "\", \""
          },
          {
            "text": "para que",
            "bold": true
          },
          {
            "text": "\" (um desejo ou aviso) e \""
          },
          {
            "text": "como quiser",
            "bold": true
          },
          {
            "text": "\"."
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
              "text": "substantivo + の + ように"
            },
            {
              "text": "ゆき の ように しろい (branco como a neve)",
              "ja": true
            }
          ],
          [
            {
              "text": "verbo (た) + ように"
            },
            {
              "text": "いわれた ように せよ (faça como lhe dizem)",
              "ja": true
            }
          ],
          [
            {
              "text": "verbo ない + ように"
            },
            {
              "text": "ころばない ように (para não cair)",
              "ja": true
            }
          ],
          [
            {
              "text": "adjetivo な + ように"
            },
            {
              "text": "すきな ように (como quiser)",
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
            "text": "ないように",
            "bold": true
          },
          {
            "text": " (ou o verbo de dicionário) você pede, deseja ou avisa algo: "
          },
          {
            "text": "ふとらない ように",
            "ja": true
          },
          {
            "text": " (\"não engorde\"). Isso é diferente de "
          },
          {
            "text": "〜ようになる",
            "bold": true
          },
          {
            "text": " (\"passar a fazer\"), que você viu no N4."
          }
        ]
      }
    ],
    "pattern": "[substantivo] の ように · [verbo] ように · [verbo ない] ように",
    "examples": [
      {
        "jp": "ゆきの よう に しろい",
        "ruby": [
          {
            "text": "雪",
            "reading": "ゆき"
          },
          {
            "text": "のように"
          },
          {
            "text": "白",
            "reading": "しろ"
          },
          {
            "text": "い。"
          }
        ],
        "romaji": "yuki no yō ni shiroi",
        "pt": "É branco como a neve."
      },
      {
        "jp": "いわれた よう に せよ",
        "ruby": [
          {
            "text": "言",
            "reading": "い"
          },
          {
            "text": "われたようにせよ。"
          }
        ],
        "romaji": "iwareta yō ni seyo",
        "pt": "Faça como lhe dizem."
      },
      {
        "jp": "ころばない よう にね",
        "ruby": [
          {
            "text": "転",
            "reading": "ころ"
          },
          {
            "text": "ばないようにね。"
          }
        ],
        "romaji": "korobanai yō ni ne",
        "pt": "Cuidado para não cair!"
      },
      {
        "jp": "お すきな よう に",
        "ruby": [
          {
            "text": "お"
          },
          {
            "text": "好",
            "reading": "す"
          },
          {
            "text": "きなように。"
          }
        ],
        "romaji": "o sukina yō ni",
        "pt": "Faça como quiser."
      }
    ]
  },
  {
    "id": "n3-25",
    "title": "Não precisa e nunca: 〜ことはない",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "O "
          },
          {
            "text": "ことはない",
            "bold": true
          },
          {
            "text": " nega a coisa toda, e o sentido muda com o verbo antes dele. Com o verbo na "
          },
          {
            "text": "forma de dicionário",
            "bold": true
          },
          {
            "text": ", quer dizer \"não há necessidade de\". Com a forma "
          },
          {
            "text": "た",
            "bold": true
          },
          {
            "text": ", quer dizer \"nunca fiz\"."
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
              "text": "dicionário + ことはない"
            },
            {
              "text": "こわがる こと は ない (não há por que temer)",
              "ja": true
            }
          ],
          [
            {
              "text": "た + ことはない"
            },
            {
              "text": "あった こと は ない (nunca encontrei)",
              "ja": true
            }
          ],
          [
            {
              "text": "expressão fixa"
            },
            {
              "text": "たいした こと は ない (não é nada demais)",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Na frase \"nunca fiz\", o mais comum é "
          },
          {
            "text": "〜たことがない",
            "bold": true
          },
          {
            "text": ". O "
          },
          {
            "text": "ことはない",
            "bold": true
          },
          {
            "text": " deixa a frase mais enfática, como numa resposta: \"não, nunca\"."
          }
        ]
      }
    ],
    "pattern": "[dicionário] ことはない · [た] ことはない",
    "examples": [
      {
        "jp": "なにも こわがる ことは ない",
        "ruby": [
          {
            "text": "何",
            "reading": "なに"
          },
          {
            "text": "も"
          },
          {
            "text": "怖",
            "reading": "こわ"
          },
          {
            "text": "がることはない。"
          }
        ],
        "romaji": "nani mo kowagaru koto wa nai",
        "pt": "Não há o que temer."
      },
      {
        "jp": "なにも しんぱい する ことは ない",
        "ruby": [
          {
            "text": "何",
            "reading": "なに"
          },
          {
            "text": "も"
          },
          {
            "text": "心配",
            "reading": "しんぱい"
          },
          {
            "text": "することはない。"
          }
        ],
        "romaji": "nani mo shinpai suru koto wa nai",
        "pt": "Não há nada com que se preocupar."
      },
      {
        "jp": "わたしは かのじょに あった ことは ない",
        "ruby": [
          {
            "text": "私",
            "reading": "わたし"
          },
          {
            "text": "は"
          },
          {
            "text": "彼女",
            "reading": "かのじょ"
          },
          {
            "text": "に"
          },
          {
            "text": "会",
            "reading": "あ"
          },
          {
            "text": "ったことはない。"
          }
        ],
        "romaji": "watashi wa kanojo ni atta koto wa nai",
        "pt": "Nunca a conheci."
      },
      {
        "jp": "たいした ことは ないよ",
        "ruby": [
          {
            "text": "大",
            "reading": "たい"
          },
          {
            "text": "したことはないよ。"
          }
        ],
        "romaji": "taishita koto wa nai yo",
        "pt": "Não é nada sério."
      }
    ]
  },
  {
    "id": "n3-26",
    "title": "É assim mesmo: 〜ものだ",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "O "
          },
          {
            "text": "ものだ",
            "bold": true
          },
          {
            "text": " tem dois usos. O primeiro diz como as coisas "
          },
          {
            "text": "são por natureza",
            "bold": true
          },
          {
            "text": " ou como "
          },
          {
            "text": "devem ser",
            "bold": true
          },
          {
            "text": ": \"promessas se cumprem\", \"acidentes acontecem\". O segundo, junto de "
          },
          {
            "text": "〜たい",
            "bold": true
          },
          {
            "text": ", mostra um "
          },
          {
            "text": "desejo forte",
            "bold": true
          },
          {
            "text": ": \"como eu gostaria de...\"."
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
              "text": "dicionário + ものだ"
            },
            {
              "text": "まもる ものだ (é para ser cumprido)",
              "ja": true
            }
          ],
          [
            {
              "text": "dicionário + ものだ"
            },
            {
              "text": "おこる ものだ (acontece)",
              "ja": true
            }
          ],
          [
            {
              "text": "〜たい + ものだ"
            },
            {
              "text": "あいたい ものだ (como eu gostaria de ver)",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Não confunda "
          },
          {
            "text": "ものだ",
            "bold": true
          },
          {
            "text": " com "
          },
          {
            "text": "のもの",
            "bold": true
          },
          {
            "text": " de \"pertence a\": "
          },
          {
            "text": "あの いえ は わたし の もの だ",
            "ja": true
          },
          {
            "text": " (\"aquela casa é minha\"). Naquele caso, "
          },
          {
            "text": "もの",
            "bold": true
          },
          {
            "text": " é uma \"coisa\"."
          }
        ]
      }
    ],
    "pattern": "[dicionário] ものだ · [〜たい] ものだ",
    "examples": [
      {
        "jp": "やくそくは まもる ものだよ",
        "ruby": [
          {
            "text": "約束",
            "reading": "やくそく"
          },
          {
            "text": "は"
          },
          {
            "text": "守",
            "reading": "まも"
          },
          {
            "text": "るものだよ。"
          }
        ],
        "romaji": "yakusoku wa mamoru monoda yo",
        "pt": "Promessas devem ser mantidas."
      },
      {
        "jp": "じこは おこる ものだ",
        "ruby": [
          {
            "text": "事故",
            "reading": "じこ"
          },
          {
            "text": "は"
          },
          {
            "text": "起",
            "reading": "お"
          },
          {
            "text": "こるものだ。"
          }
        ],
        "romaji": "jiko wa okoru monoda",
        "pt": "Acidentes acontecem."
      },
      {
        "jp": "りゅうがく したい ものだ",
        "ruby": [
          {
            "text": "留学",
            "reading": "りゅうがく"
          },
          {
            "text": "したいものだ。"
          }
        ],
        "romaji": "ryūgaku shitai monoda",
        "pt": "Eu quero estudar no exterior."
      },
      {
        "jp": "かれに あいたい ものだ",
        "ruby": [
          {
            "text": "彼",
            "reading": "かれ"
          },
          {
            "text": "に"
          },
          {
            "text": "会",
            "reading": "あ"
          },
          {
            "text": "いたいものだ。"
          }
        ],
        "romaji": "kare ni aitai monoda",
        "pt": "Gostaria de me encontrar com ele."
      }
    ]
  },
  {
    "id": "n3-27",
    "title": "Cheio de: 〜だらけ",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "O "
          },
          {
            "text": "だらけ",
            "bold": true
          },
          {
            "text": " vem depois de um substantivo e quer dizer \""
          },
          {
            "text": "cheio de, coberto de",
            "bold": true
          },
          {
            "text": "\". Quase sempre fala de algo "
          },
          {
            "text": "indesejado",
            "bold": true
          },
          {
            "text": ": lama, sujeira, erros."
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
              "text": "substantivo + だらけ"
            },
            {
              "text": "どろ だらけ (coberto de lama)",
              "ja": true
            }
          ],
          [
            {
              "text": "substantivo + だらけ"
            },
            {
              "text": "らくがき だらけ (cheio de pichações)",
              "ja": true
            }
          ],
          [
            {
              "text": "substantivo + だらけの + substantivo"
            },
            {
              "text": "まちがい だらけ の ぶんしょう (um texto cheio de erros)",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Para coisas boas, o japonês não usa "
          },
          {
            "text": "だらけ",
            "bold": true
          },
          {
            "text": ": dizemos "
          },
          {
            "text": "いっぱい",
            "ja": true
          },
          {
            "text": " ou outra palavra. Quem ouve "
          },
          {
            "text": "だらけ",
            "bold": true
          },
          {
            "text": " já entende que o que está cobrindo a coisa é ruim."
          }
        ]
      }
    ],
    "pattern": "[substantivo] だらけ",
    "examples": [
      {
        "jp": "かれは どろ だらけだった",
        "ruby": [
          {
            "text": "彼",
            "reading": "かれ"
          },
          {
            "text": "は"
          },
          {
            "text": "泥",
            "reading": "どろ"
          },
          {
            "text": "だらけだった。"
          }
        ],
        "romaji": "kare wa doro darakedatta",
        "pt": "Ele estava coberto de lama."
      },
      {
        "jp": "かべは らくがき だらけです",
        "ruby": [
          {
            "text": "壁",
            "reading": "かべ"
          },
          {
            "text": "は"
          },
          {
            "text": "落書",
            "reading": "らくが"
          },
          {
            "text": "きだらけです。"
          }
        ],
        "romaji": "kabe wa rakugaki darake desu",
        "pt": "O muro está coberto de grafites."
      },
      {
        "jp": "あの こは あか だらけだ",
        "ruby": [
          {
            "text": "あの"
          },
          {
            "text": "子",
            "reading": "こ"
          },
          {
            "text": "はあかだらけだ。"
          }
        ],
        "romaji": "ano ko wa aka darakeda",
        "pt": "A criança está suja."
      }
    ]
  },
  {
    "id": "n3-28",
    "title": "Para mim, para você: 〜にとって",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "O "
          },
          {
            "text": "にとって",
            "bold": true
          },
          {
            "text": " mostra de "
          },
          {
            "text": "quem é o ponto de vista",
            "bold": true
          },
          {
            "text": ": \"para as pessoas\", \"para mim\". Vem depois da pessoa ou da coisa, e a frase termina com uma "
          },
          {
            "text": "avaliação",
            "bold": true
          },
          {
            "text": " (importante, necessário, estranho, difícil)."
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
              "text": "pessoa + にとって"
            },
            {
              "text": "にんげん にとって たいせつだ (é importante para as pessoas)",
              "ja": true
            }
          ],
          [
            {
              "text": "pessoa + にとっては"
            },
            {
              "text": "わたし にとって は おかしい (para mim é estranho)",
              "ja": true
            }
          ],
          [
            {
              "text": "coisa + にとって"
            },
            {
              "text": "りょうり にとって ひつようだ (é necessário para a culinária)",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Não é o \"para\" de "
          },
          {
            "text": "receber",
            "bold": true
          },
          {
            "text": " algo (aí se usa "
          },
          {
            "text": "に",
            "bold": true
          },
          {
            "text": ") nem o de "
          },
          {
            "text": "objetivo",
            "bold": true
          },
          {
            "text": " ("
          },
          {
            "text": "〜のために",
            "bold": true
          },
          {
            "text": "). O "
          },
          {
            "text": "にとって",
            "bold": true
          },
          {
            "text": " só pede um julgamento."
          }
        ]
      }
    ],
    "pattern": "[pessoa/coisa] にとって [avaliação]",
    "examples": [
      {
        "jp": "みずは にんげん にとって たいせつだ",
        "ruby": [
          {
            "text": "水",
            "reading": "みず"
          },
          {
            "text": "は"
          },
          {
            "text": "人間",
            "reading": "にんげん"
          },
          {
            "text": "にとって"
          },
          {
            "text": "大切",
            "reading": "たいせつ"
          },
          {
            "text": "だ。"
          }
        ],
        "romaji": "mizu wa ningen nitotte taisetsuda",
        "pt": "A água é importante para as pessoas."
      },
      {
        "jp": "しおは りょうり にとって ひつような ものだ",
        "ruby": [
          {
            "text": "塩",
            "reading": "しお"
          },
          {
            "text": "は"
          },
          {
            "text": "料理",
            "reading": "りょうり"
          },
          {
            "text": "にとって"
          },
          {
            "text": "必要",
            "reading": "ひつよう"
          },
          {
            "text": "な"
          },
          {
            "text": "物",
            "reading": "もの"
          },
          {
            "text": "だ。"
          }
        ],
        "romaji": "shio wa ryōri nitotte hitsuyōna monoda",
        "pt": "O sal é necessário para cozinhar."
      },
      {
        "jp": "わたし にとっては すこし おかしいです",
        "ruby": [
          {
            "text": "私",
            "reading": "わたし"
          },
          {
            "text": "にとっては"
          },
          {
            "text": "少",
            "reading": "すこ"
          },
          {
            "text": "しおかしいです。"
          }
        ],
        "romaji": "watashi nitotte wa sukoshi okashii desu",
        "pt": "É um pouco estranho para mim."
      },
      {
        "jp": "それは わたし にとって いがいな はなしだった",
        "ruby": [
          {
            "text": "それは"
          },
          {
            "text": "私",
            "reading": "わたし"
          },
          {
            "text": "にとって"
          },
          {
            "text": "意外",
            "reading": "いがい"
          },
          {
            "text": "な"
          },
          {
            "text": "話",
            "reading": "はなし"
          },
          {
            "text": "だった。"
          }
        ],
        "romaji": "sore wa watashi nitotte igaina hanashidatta",
        "pt": "Isto foi uma revelação para mim."
      }
    ]
  },
  {
    "id": "n3-29",
    "title": "Não dá para não: 〜ずにはいられない",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "O "
          },
          {
            "text": "〜ずにはいられない",
            "bold": true
          },
          {
            "text": " diz que a pessoa "
          },
          {
            "text": "não consegue evitar",
            "bold": true
          },
          {
            "text": " algo: rir, chorar, pensar. Vem a "
          },
          {
            "text": "forma ない sem o ない",
            "bold": true
          },
          {
            "text": " + "
          },
          {
            "text": "ずにはいられない",
            "bold": true
          },
          {
            "text": "; com "
          },
          {
            "text": "する",
            "bold": true
          },
          {
            "text": ", vira "
          },
          {
            "text": "せずには",
            "ja": true
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
              "text": "verbo (sem ない) + ずにはいられない"
            },
            {
              "text": "なか ずには いられない (não consigo evitar chorar)",
              "ja": true
            }
          ],
          [
            {
              "text": "verbo (sem ない) + ずにはいられない"
            },
            {
              "text": "わらわ ずには いられない (não dá para não rir)",
              "ja": true
            }
          ],
          [
            {
              "text": "する → せずには"
            },
            {
              "text": "しんぱい せずには いられない (não consigo deixar de me preocupar)",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "É uma reação "
          },
          {
            "text": "do coração",
            "bold": true
          },
          {
            "text": ", um impulso, e não uma obrigação. Não use para o que se "
          },
          {
            "text": "deve",
            "bold": true
          },
          {
            "text": " fazer (aí é "
          },
          {
            "text": "〜なければならない",
            "ja": true
          },
          {
            "text": ")."
          }
        ]
      }
    ],
    "pattern": "[verbo, forma ない sem ない] ずにはいられない",
    "examples": [
      {
        "jp": "なかず には いられないよ",
        "ruby": [
          {
            "text": "泣",
            "reading": "な"
          },
          {
            "text": "かずにはいられないよ。"
          }
        ],
        "romaji": "nakazu ni wa irarenai yo",
        "pt": "Não posso evitar o choro."
      },
      {
        "jp": "それを わらわず には いられない",
        "ruby": [
          {
            "text": "それを"
          },
          {
            "text": "笑",
            "reading": "わら"
          },
          {
            "text": "わずにはいられない。"
          }
        ],
        "romaji": "sore o warawazu ni wa irarenai",
        "pt": "Não tem como não rir disso."
      },
      {
        "jp": "わたしは そう おもわず には いられない",
        "ruby": [
          {
            "text": "私",
            "reading": "わたし"
          },
          {
            "text": "はそう"
          },
          {
            "text": "思",
            "reading": "おも"
          },
          {
            "text": "わずにはいられない。"
          }
        ],
        "romaji": "watashi wa sō omowazu ni wa irarenai",
        "pt": "Não consigo deixar de pensar que é de facto esse o caso."
      }
    ]
  },
  {
    "id": "n3-30",
    "title": "Além de e exceto: 〜のほか e ほかに",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "A palavra "
          },
          {
            "text": "ほか",
            "bold": true
          },
          {
            "text": " (também escrita 他) quer dizer \""
          },
          {
            "text": "outro",
            "bold": true
          },
          {
            "text": "\" e \""
          },
          {
            "text": "além de",
            "bold": true
          },
          {
            "text": "\". Ela aparece em três usos comuns."
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
              "text": "ほかの + substantivo"
            },
            {
              "text": "ほかの を みせて ください (mostre outro)",
              "ja": true
            }
          ],
          [
            {
              "text": "A の ほかは B"
            },
            {
              "text": "にちようび の ほかは はたらく (trabalho todos os dias, menos domingo)",
              "ja": true
            }
          ],
          [
            {
              "text": "ほかに + frase"
            },
            {
              "text": "ほかに いたい ところは ありますか (dói em mais algum lugar?)",
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
            "text": "〜のほかは",
            "bold": true
          },
          {
            "text": " costuma levar uma frase de "
          },
          {
            "text": "exceção",
            "bold": true
          },
          {
            "text": " (\"exceto\"). O "
          },
          {
            "text": "ほかに",
            "bold": true
          },
          {
            "text": " soma mais coisas (\"além disso, mais\")."
          }
        ]
      }
    ],
    "pattern": "ほかの [substantivo] · [A] のほかは [B] · ほかに [frase]",
    "examples": [
      {
        "jp": "ほかのを みせて ください",
        "ruby": [
          {
            "text": "ほかのを"
          },
          {
            "text": "見",
            "reading": "み"
          },
          {
            "text": "せてください。"
          }
        ],
        "romaji": "hoka no o misete kudasai",
        "pt": "Por favor me mostre outro."
      },
      {
        "jp": "わたしは にちようびの ほかは まいにち はたらく",
        "ruby": [
          {
            "text": "私",
            "reading": "わたし"
          },
          {
            "text": "は"
          },
          {
            "text": "日曜日",
            "reading": "にちようび"
          },
          {
            "text": "のほかは"
          },
          {
            "text": "毎日",
            "reading": "まいにち"
          },
          {
            "text": "働",
            "reading": "はたら"
          },
          {
            "text": "く。"
          }
        ],
        "romaji": "watashi wa nichiyōbi no hoka wa mainichi hataraku",
        "pt": "Eu trabalho todos os dias, exceto domingo."
      },
      {
        "jp": "ほかに いたい ところは ありますか",
        "ruby": [
          {
            "text": "ほかに"
          },
          {
            "text": "痛",
            "reading": "いた"
          },
          {
            "text": "いところはありますか。"
          }
        ],
        "romaji": "hoka ni itai tokoro wa arimasu ka",
        "pt": "Você sente dor em alguma outra parte de seu corpo?"
      }
    ]
  },
  {
    "id": "n3-31",
    "title": "Que...! e \"uma coisa como\": 〜なんて",
    "body": [
      {
        "kind": "p",
        "runs": [
          {
            "text": "O "
          },
          {
            "text": "なんて",
            "bold": true
          },
          {
            "text": " tem dois usos. O primeiro é uma "
          },
          {
            "text": "exclamação",
            "bold": true
          },
          {
            "text": ": \""
          },
          {
            "text": "que",
            "bold": true
          },
          {
            "text": " bonito!\". Vem antes de um adjetivo, e a frase termina com "
          },
          {
            "text": "のだろう",
            "ja": true
          },
          {
            "text": ", "
          },
          {
            "text": "んだ",
            "ja": true
          },
          {
            "text": " ou "
          },
          {
            "text": "なの",
            "ja": true
          },
          {
            "text": ". O segundo é falar de algo com "
          },
          {
            "text": "desdém ou surpresa",
            "bold": true
          },
          {
            "text": ": \"uma coisa como a vida sem você\", \"apetite, nem pensar\"."
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
              "text": "なんて + adjetivo + のだろう"
            },
            {
              "text": "かれ は なんて おおきい のだろう (como ele é alto!)",
              "ja": true
            }
          ],
          [
            {
              "text": "なんて + adjetivo + んだ"
            },
            {
              "text": "きみ は なんて しんせつな んだ (como você é gentil!)",
              "ja": true
            }
          ],
          [
            {
              "text": "substantivo + なんて + negativo"
            },
            {
              "text": "しょくよく なんて ありません (apetite? nenhum)",
              "ja": true
            }
          ]
        ]
      },
      {
        "kind": "p",
        "runs": [
          {
            "text": "Atenção: "
          },
          {
            "text": "なんて いったの",
            "ja": true
          },
          {
            "text": " (\"o que ele disse?\") é outra coisa: aí "
          },
          {
            "text": "なんて",
            "bold": true
          },
          {
            "text": " quer dizer \"o quê\". E o "
          },
          {
            "text": "なんて",
            "bold": true
          },
          {
            "text": " de desdém soa informal e pode ser grosseiro com quem ouve."
          }
        ]
      }
    ],
    "pattern": "なんて [adjetivo] のだろう · [substantivo] なんて [negativo]",
    "examples": [
      {
        "jp": "かれは なんて おおきい のだろう",
        "ruby": [
          {
            "text": "彼",
            "reading": "かれ"
          },
          {
            "text": "はなんて"
          },
          {
            "text": "大",
            "reading": "おお"
          },
          {
            "text": "きいのだろう。"
          }
        ],
        "romaji": "kare wa nante ōkii nodarō",
        "pt": "Como ele é alto!"
      },
      {
        "jp": "きみは なんて しんせつな んだ",
        "ruby": [
          {
            "text": "君",
            "reading": "きみ"
          },
          {
            "text": "はなんて"
          },
          {
            "text": "親切",
            "reading": "しんせつ"
          },
          {
            "text": "なんだ。"
          }
        ],
        "romaji": "kimi wa nante shinsetsuna nda",
        "pt": "Como você é gentil!"
      },
      {
        "jp": "しょくよく なんて ありません",
        "ruby": [
          {
            "text": "食欲",
            "reading": "しょくよく"
          },
          {
            "text": "なんてありません。"
          }
        ],
        "romaji": "shokuyoku nante arimasen",
        "pt": "Estou sem apetite."
      },
      {
        "jp": "きみ なしの せいかつ なんて かんがえられない",
        "ruby": [
          {
            "text": "君",
            "reading": "きみ"
          },
          {
            "text": "なしの"
          },
          {
            "text": "生活",
            "reading": "せいかつ"
          },
          {
            "text": "なんて"
          },
          {
            "text": "考",
            "reading": "かんが"
          },
          {
            "text": "えられない。"
          }
        ],
        "romaji": "kimi nashi no seikatsu nante kangaerarenai",
        "pt": "Não consigo pensar na vida sem você."
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
    "pt": "Você não pode estar falando sério.",
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
    "pt": "Vamos comer enquanto a comida está quente.",
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
  },
  {
    "topic": "n3-16",
    "pt": "Meus pés estão me matando.",
    "answer": [
      "あし",
      "が",
      "いたくて",
      "たまらない"
    ],
    "extra": [
      "に",
      "で"
    ],
    "romaji": "ashi ga itakute tamaranai",
    "hint": "てたまらない: insuportável, forte demais."
  },
  {
    "topic": "n3-17",
    "pt": "Não sei se ele vem.",
    "answer": [
      "かれ",
      "が",
      "くる",
      "か",
      "どう",
      "か",
      "しらない"
    ],
    "extra": [
      "に",
      "で"
    ],
    "romaji": "kare ga kuru ka dō ka shiranai",
    "hint": "かどうか: se ... ou não."
  },
  {
    "topic": "n3-17",
    "pt": "Não sei se amanhã vai chover.",
    "answer": [
      "あした",
      "あめ",
      "が",
      "ふる",
      "か",
      "どう",
      "か",
      "わからない"
    ],
    "extra": [
      "に",
      "で"
    ],
    "romaji": "ashita ame ga furu ka dō ka wakaranai",
    "hint": "かどうか: se ... ou não."
  },
  {
    "topic": "n3-17",
    "pt": "Tenho dúvidas se ele virá.",
    "answer": [
      "かれ",
      "が",
      "くる",
      "か",
      "どう",
      "か",
      "ぎもんだ"
    ],
    "extra": [
      "に",
      "で"
    ],
    "romaji": "kare ga kuru ka dō ka gimonda",
    "hint": "かどうか: se ... ou não."
  },
  {
    "topic": "n3-18",
    "pt": "Você deveria dizer a verdade.",
    "answer": [
      "しんじつ",
      "を",
      "いう",
      "べきだ"
    ],
    "extra": [
      "に",
      "は"
    ],
    "romaji": "shinjitsu o iu bekida",
    "hint": "べき: deve, é o certo a fazer."
  },
  {
    "topic": "n3-18",
    "pt": "Você devia se desculpar.",
    "answer": [
      "きみ",
      "は",
      "しゃざい",
      "すべきだ"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "kimi wa shazai subekida",
    "hint": "べき: deve, é o certo a fazer."
  },
  {
    "topic": "n3-18",
    "pt": "Você deveria sair.",
    "answer": [
      "やめる",
      "べきだ",
      "よ"
    ],
    "extra": [
      "を",
      "に"
    ],
    "romaji": "yameru bekida yo",
    "hint": "べき: deve, é o certo a fazer."
  },
  {
    "topic": "n3-18",
    "pt": "Você deve parar de fumar.",
    "answer": [
      "きんえん",
      "する",
      "べきです"
    ],
    "extra": [
      "を",
      "に"
    ],
    "romaji": "kin'en suru beki desu",
    "hint": "べき: deve, é o certo a fazer."
  },
  {
    "topic": "n3-19",
    "pt": "Não esqueça de me ligar.",
    "answer": [
      "わすれず",
      "に",
      "でんわ",
      "してね"
    ],
    "extra": [
      "で",
      "を"
    ],
    "romaji": "wasurezu ni denwa shitene",
    "hint": "ずに: sem fazer (como ないで, mais formal)."
  },
  {
    "topic": "n3-19",
    "pt": "Fiz aquilo sem consultar ninguém.",
    "answer": [
      "だれ",
      "に",
      "も",
      "そうだん",
      "せず",
      "に",
      "やった"
    ],
    "extra": [
      "で",
      "を"
    ],
    "romaji": "dare ni mo sōdan sezu ni yatta",
    "hint": "ずに: sem fazer (como ないで, mais formal)."
  },
  {
    "topic": "n3-19",
    "pt": "Eu fiquei em casa ao invés de sair.",
    "answer": [
      "わたし",
      "は",
      "がいしゅつ",
      "せず",
      "に",
      "いえ",
      "に",
      "いた"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "watashi wa gaishutsu sezu ni ie ni ita",
    "hint": "ずに: sem fazer (como ないで, mais formal)."
  },
  {
    "topic": "n3-19",
    "pt": "Por favor, não tire os sapatos.",
    "answer": [
      "くつ",
      "は",
      "ぬがず",
      "に",
      "どうぞ"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "kutsu wa nugazu ni dōzo",
    "hint": "ずに: sem fazer (como ないで, mais formal)."
  },
  {
    "topic": "n3-20",
    "pt": "Quero que cantes.",
    "answer": [
      "あなた",
      "に",
      "うたって",
      "ほしい"
    ],
    "extra": [
      "で",
      "を"
    ],
    "romaji": "anata ni utatte hoshii",
    "hint": "てほしい: quero que alguém faça."
  },
  {
    "topic": "n3-20",
    "pt": "Gostaria de trocar de lugar.",
    "answer": [
      "せき",
      "を",
      "かえて",
      "ほしいのですが"
    ],
    "extra": [
      "に",
      "は"
    ],
    "romaji": "seki o kaete hoshii nodesuga",
    "hint": "てほしい: quero que alguém faça."
  },
  {
    "topic": "n3-20",
    "pt": "Quero que fiques comigo.",
    "answer": [
      "わたし",
      "と",
      "いっしょ",
      "に",
      "いて",
      "ほしい",
      "の"
    ],
    "extra": [
      "も",
      "を"
    ],
    "romaji": "watashi to issho ni ite hoshii no",
    "hint": "てほしい: quero que alguém faça."
  },
  {
    "topic": "n3-20",
    "pt": "Eu quero um ovo cozido.",
    "answer": [
      "たまご",
      "を",
      "ゆでて",
      "ほしいのです"
    ],
    "extra": [
      "に",
      "は"
    ],
    "romaji": "tamago o yudete hoshii nodesu",
    "hint": "てほしい: quero que alguém faça."
  },
  {
    "topic": "n3-21",
    "pt": "Tentei escapar.",
    "answer": [
      "わたし",
      "は",
      "にげよう",
      "と",
      "した"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "watashi wa nigeyō to shita",
    "hint": "ようとする: tenta; ようとしている: está para."
  },
  {
    "topic": "n3-21",
    "pt": "Ele tentou abrir a porta.",
    "answer": [
      "かれ",
      "は",
      "ドア",
      "を",
      "あけよう",
      "と",
      "した"
    ],
    "extra": [
      "も",
      "の"
    ],
    "romaji": "kare wa doa o akeyō to shita",
    "hint": "ようとする: tenta; ようとしている: está para."
  },
  {
    "topic": "n3-21",
    "pt": "Tentei aprender a melodia de cor.",
    "answer": [
      "わたし",
      "は",
      "きょく",
      "を",
      "おぼえよう",
      "と",
      "した"
    ],
    "extra": [
      "も",
      "の"
    ],
    "romaji": "watashi wa kyoku o oboeyō to shita",
    "hint": "ようとする: tenta; ようとしている: está para."
  },
  {
    "topic": "n3-21",
    "pt": "Ela está para partir.",
    "answer": [
      "かのじょ",
      "は",
      "しゅっぱつ",
      "しよう",
      "と",
      "している"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "kanojo wa shuppatsu shiyō to shiteiru",
    "hint": "ようとする: tenta; ようとしている: está para."
  },
  {
    "topic": "n3-22",
    "pt": "Faça assim como lhe digo.",
    "answer": [
      "いう",
      "とおり",
      "に",
      "して"
    ],
    "extra": [
      "で",
      "を"
    ],
    "romaji": "iu tōri ni shite",
    "hint": "とおり: exatamente como."
  },
  {
    "topic": "n3-22",
    "pt": "Acho que ele tem razão.",
    "answer": [
      "かれ",
      "の",
      "いう",
      "とおりだ",
      "と",
      "おもう"
    ],
    "extra": [
      "は",
      "を"
    ],
    "romaji": "kare no iu tōrida to omō",
    "hint": "とおり: exatamente como."
  },
  {
    "topic": "n3-22",
    "pt": "Você tem toda a razão.",
    "answer": [
      "まったく",
      "きみ",
      "が",
      "いう",
      "とおりだ"
    ],
    "extra": [
      "に",
      "で"
    ],
    "romaji": "mattaku kimi ga iu tōrida",
    "hint": "とおり: exatamente como."
  },
  {
    "topic": "n3-22",
    "pt": "Faz como ele te diz.",
    "answer": [
      "かれ",
      "の",
      "いう",
      "とおり",
      "に",
      "しなさい"
    ],
    "extra": [
      "は",
      "を"
    ],
    "romaji": "kare no iu tōri ni shinasai",
    "hint": "とおり: exatamente como."
  },
  {
    "topic": "n3-23",
    "pt": "Está ficando mais quente dia após dia.",
    "answer": [
      "ひごと",
      "に",
      "あたたかく",
      "なっている"
    ],
    "extra": [
      "で",
      "を"
    ],
    "romaji": "higoto ni atatakaku natteiru",
    "hint": "たびに: toda vez que; ごとに: a cada."
  },
  {
    "topic": "n3-23",
    "pt": "Ele está melhorando dia após dia.",
    "answer": [
      "かれ",
      "は",
      "ひごと",
      "に",
      "よく",
      "なってきている"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "kare wa higoto ni yoku nattekiteiru",
    "hint": "たびに: toda vez que; ごとに: a cada."
  },
  {
    "topic": "n3-23",
    "pt": "Eu choro toda vez que assisto a este filme.",
    "answer": [
      "この",
      "えいが",
      "を",
      "みる",
      "たび",
      "に",
      "なく"
    ],
    "extra": [
      "は",
      "で"
    ],
    "romaji": "kono eiga o miru tabi ni naku",
    "hint": "たびに: toda vez que; ごとに: a cada."
  },
  {
    "topic": "n3-24",
    "pt": "É branco como a neve.",
    "answer": [
      "ゆき",
      "の",
      "よう",
      "に",
      "しろい"
    ],
    "extra": [
      "は",
      "を"
    ],
    "romaji": "yuki no yō ni shiroi",
    "hint": "ように: como, do jeito que, para que."
  },
  {
    "topic": "n3-24",
    "pt": "Faça como lhe dizem.",
    "answer": [
      "いわれた",
      "よう",
      "に",
      "せよ"
    ],
    "extra": [
      "で",
      "を"
    ],
    "romaji": "iwareta yō ni seyo",
    "hint": "ように: como, do jeito que, para que."
  },
  {
    "topic": "n3-24",
    "pt": "Cuidado para não cair!",
    "answer": [
      "ころばない",
      "よう",
      "に",
      "ね"
    ],
    "extra": [
      "で",
      "を"
    ],
    "romaji": "korobanai yō ni ne",
    "hint": "ように: como, do jeito que, para que."
  },
  {
    "topic": "n3-24",
    "pt": "Faça como quiser.",
    "answer": [
      "お",
      "すきな",
      "よう",
      "に"
    ],
    "extra": [
      "で",
      "を"
    ],
    "romaji": "o sukina yō ni",
    "hint": "ように: como, do jeito que, para que."
  },
  {
    "topic": "n3-25",
    "pt": "Não há o que temer.",
    "answer": [
      "なに",
      "も",
      "こわがる",
      "こと",
      "は",
      "ない"
    ],
    "extra": [
      "を",
      "に"
    ],
    "romaji": "nani mo kowagaru koto wa nai",
    "hint": "ことはない: não precisa; ou nunca."
  },
  {
    "topic": "n3-25",
    "pt": "Não há nada com que se preocupar.",
    "answer": [
      "なに",
      "も",
      "しんぱい",
      "する",
      "こと",
      "は",
      "ない"
    ],
    "extra": [
      "を",
      "に"
    ],
    "romaji": "nani mo shinpai suru koto wa nai",
    "hint": "ことはない: não precisa; ou nunca."
  },
  {
    "topic": "n3-25",
    "pt": "Nunca a conheci.",
    "answer": [
      "わたし",
      "は",
      "かのじょ",
      "に",
      "あった",
      "こと",
      "は",
      "ない"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "watashi wa kanojo ni atta koto wa nai",
    "hint": "ことはない: não precisa; ou nunca."
  },
  {
    "topic": "n3-25",
    "pt": "Não é nada sério.",
    "answer": [
      "たいした",
      "こと",
      "は",
      "ない",
      "よ"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "taishita koto wa nai yo",
    "hint": "ことはない: não precisa; ou nunca."
  },
  {
    "topic": "n3-26",
    "pt": "Promessas devem ser mantidas.",
    "answer": [
      "やくそく",
      "は",
      "まもる",
      "ものだ",
      "よ"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "yakusoku wa mamoru monoda yo",
    "hint": "ものだ: é assim mesmo; gostaria muito."
  },
  {
    "topic": "n3-26",
    "pt": "Acidentes acontecem.",
    "answer": [
      "じこ",
      "は",
      "おこる",
      "ものだ"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "jiko wa okoru monoda",
    "hint": "ものだ: é assim mesmo; gostaria muito."
  },
  {
    "topic": "n3-26",
    "pt": "Eu quero estudar no exterior.",
    "answer": [
      "りゅうがく",
      "したい",
      "ものだ"
    ],
    "extra": [
      "を",
      "に"
    ],
    "romaji": "ryūgaku shitai monoda",
    "hint": "ものだ: é assim mesmo; gostaria muito."
  },
  {
    "topic": "n3-26",
    "pt": "Gostaria de me encontrar com ele.",
    "answer": [
      "かれ",
      "に",
      "あいたい",
      "ものだ"
    ],
    "extra": [
      "で",
      "を"
    ],
    "romaji": "kare ni aitai monoda",
    "hint": "ものだ: é assim mesmo; gostaria muito."
  },
  {
    "topic": "n3-27",
    "pt": "Ele estava coberto de lama.",
    "answer": [
      "かれ",
      "は",
      "どろ",
      "だらけだった"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "kare wa doro darakedatta",
    "hint": "だらけ: cheio de (algo ruim)."
  },
  {
    "topic": "n3-27",
    "pt": "O muro está coberto de grafites.",
    "answer": [
      "かべ",
      "は",
      "らくがき",
      "だらけです"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "kabe wa rakugaki darake desu",
    "hint": "だらけ: cheio de (algo ruim)."
  },
  {
    "topic": "n3-27",
    "pt": "A criança está suja.",
    "answer": [
      "あの",
      "こ",
      "は",
      "あか",
      "だらけだ"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "ano ko wa aka darakeda",
    "hint": "だらけ: cheio de (algo ruim)."
  },
  {
    "topic": "n3-28",
    "pt": "A água é importante para as pessoas.",
    "answer": [
      "みず",
      "は",
      "にんげん",
      "にとって",
      "たいせつだ"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "mizu wa ningen nitotte taisetsuda",
    "hint": "にとって: do ponto de vista de, para."
  },
  {
    "topic": "n3-28",
    "pt": "O sal é necessário para cozinhar.",
    "answer": [
      "しお",
      "は",
      "りょうり",
      "にとって",
      "ひつような",
      "ものだ"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "shio wa ryōri nitotte hitsuyōna monoda",
    "hint": "にとって: do ponto de vista de, para."
  },
  {
    "topic": "n3-28",
    "pt": "É um pouco estranho para mim.",
    "answer": [
      "わたし",
      "にとって",
      "は",
      "すこし",
      "おかしいです"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "watashi nitotte wa sukoshi okashii desu",
    "hint": "にとって: do ponto de vista de, para."
  },
  {
    "topic": "n3-28",
    "pt": "Isto foi uma revelação para mim.",
    "answer": [
      "それ",
      "は",
      "わたし",
      "にとって",
      "いがいな",
      "はなしだった"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "sore wa watashi nitotte igaina hanashidatta",
    "hint": "にとって: do ponto de vista de, para."
  },
  {
    "topic": "n3-29",
    "pt": "Não posso evitar o choro.",
    "answer": [
      "なかず",
      "に",
      "は",
      "いられない",
      "よ"
    ],
    "extra": [
      "で",
      "を"
    ],
    "romaji": "nakazu ni wa irarenai yo",
    "hint": "ずにはいられない: não consigo evitar."
  },
  {
    "topic": "n3-29",
    "pt": "Não tem como não rir disso.",
    "answer": [
      "それ",
      "を",
      "わらわず",
      "に",
      "は",
      "いられない"
    ],
    "extra": [
      "で",
      "も"
    ],
    "romaji": "sore o warawazu ni wa irarenai",
    "hint": "ずにはいられない: não consigo evitar."
  },
  {
    "topic": "n3-29",
    "pt": "Não consigo deixar de pensar que é de facto esse o caso.",
    "answer": [
      "わたし",
      "は",
      "そう",
      "おもわず",
      "に",
      "は",
      "いられない"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "watashi wa sō omowazu ni wa irarenai",
    "hint": "ずにはいられない: não consigo evitar."
  },
  {
    "topic": "n3-30",
    "pt": "Por favor me mostre outro.",
    "answer": [
      "ほか",
      "の",
      "を",
      "みせて",
      "ください"
    ],
    "extra": [
      "は",
      "に"
    ],
    "romaji": "hoka no o misete kudasai",
    "hint": "ほか: outro, além de, exceto."
  },
  {
    "topic": "n3-30",
    "pt": "Eu trabalho todos os dias, exceto domingo.",
    "answer": [
      "わたし",
      "は",
      "にちようび",
      "の",
      "ほか",
      "は",
      "まいにち",
      "はたらく"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "watashi wa nichiyōbi no hoka wa mainichi hataraku",
    "hint": "ほか: outro, além de, exceto."
  },
  {
    "topic": "n3-30",
    "pt": "Você sente dor em alguma outra parte de seu corpo?",
    "answer": [
      "ほか",
      "に",
      "いたい",
      "ところ",
      "は",
      "あります",
      "か"
    ],
    "extra": [
      "で",
      "を"
    ],
    "romaji": "hoka ni itai tokoro wa arimasu ka",
    "hint": "ほか: outro, além de, exceto."
  },
  {
    "topic": "n3-31",
    "pt": "Como ele é alto!",
    "answer": [
      "かれ",
      "は",
      "なんて",
      "おおきい",
      "のだろう"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "kare wa nante ōkii nodarō",
    "hint": "なんて: que...! ou uma coisa como..."
  },
  {
    "topic": "n3-31",
    "pt": "Como você é gentil!",
    "answer": [
      "きみ",
      "は",
      "なんて",
      "しんせつな",
      "んだ"
    ],
    "extra": [
      "を",
      "も"
    ],
    "romaji": "kimi wa nante shinsetsuna nda",
    "hint": "なんて: que...! ou uma coisa como..."
  },
  {
    "topic": "n3-31",
    "pt": "Estou sem apetite.",
    "answer": [
      "しょくよく",
      "なんて",
      "ありません"
    ],
    "extra": [
      "を",
      "に"
    ],
    "romaji": "shokuyoku nante arimasen",
    "hint": "なんて: que...! ou uma coisa como..."
  },
  {
    "topic": "n3-31",
    "pt": "Não consigo pensar na vida sem você.",
    "answer": [
      "きみ",
      "なし",
      "の",
      "せいかつ",
      "なんて",
      "かんがえられない"
    ],
    "extra": [
      "は",
      "を"
    ],
    "romaji": "kimi nashi no seikatsu nante kangaerarenai",
    "hint": "なんて: que...! ou uma coisa como..."
  }
];

/** Ids das frases do Tatoeba usadas nos exemplos (para o crédito). */
export const GRAMMAR_N3_SENTENCE_IDS: readonly number[] = [100541,79709,108153,90133,158200,112236,218242,883097,110065,90817,11977679,110066,87698,108056,4897810,94795,144656,102896,148574,107998,102981,139697,3555706,12022251,2190027,213803,3455723,81586,121048,120899,120848,107131,104631,124805,77487,82003,188334,179920,168056,4760435,10784642,2043892,99535,10284360,174541,96075,12453472,10516148,168690,100010,2422273,138015,8760370,11294717,80195,125692,147456,11016725,119368,80349,178848,119369,144981,177174,3366937,2972449,82564,1147354,157894,10840506,1152237,142463,9838008,78481,154843,111759,157582,88749,3491589,117604,140889,117602,122929,101500,1780326,141991,174746,3241561,8531386,187663,187667,162165,137692,79533,150823,78245,118661,101972,10212624,230972,143754,188602,602868,205147,10946675,204561,160448,196433,154677,196436,111389,177591,145768,178728];
