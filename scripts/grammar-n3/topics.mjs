// Tópicos de gramática N3 (n3-1 a n3-15: primeira leva; n3-16 a n3-27: segunda leva; n3-28 a n3-31: terceira leva).
//
// A lista de pontos parte do que o Guia JLPT do Wikibooks (CC BY-SA) e a prática do ensino de japonês tratam como N3; não há lista
// oficial do JLPT. As explicações são texto próprio, em português, ainda sem revisão por um falante. Os exemplos são frases reais do
// Tatoeba (CC BY 2.0 FR), escolhidas pelo id; `ja` é o texto original, `furi` a transcrição do Tatoeba, `pt` uma das traduções do
// Tatoeba e `kana` a mesma frase só em kana (mesma marcação dos tópicos do N5; ver scripts/grammar-n5/topics.mjs).
// Conferência: node scripts/grammar-n5/verify.mjs n3

export const TOPICS = [
  {
    "id": "n3-1",
    "title": "Parece que: 〜らしい",
    "body": [
      "Com **らしい**, você diz que algo \"parece ser assim\" por causa do que ouviu ou viu: um boato, uma notícia, um indício. Vem depois da **forma simples** do verbo ou do adjetivo, e direto depois de um substantivo.",
      {
        "table": [
          [
            "#padrão",
            "#exemplo"
          ],
          [
            "forma simples + らしい",
            "__あめに なる らしい__ (parece que vai chover)"
          ],
          [
            "adjetivo い + らしい",
            "__ねむい らしい__ (parece estar com sono)"
          ],
          [
            "substantivo + らしい",
            "__びょうき らしい__ (parece estar doente)"
          ]
        ]
      },
      "Em **らしい** quem fala não viu com os próprios olhos: é uma conclusão ou uma informação de segunda mão. Depois de um substantivo, **らしい** pode ainda querer dizer \"bem típico de\": __がくせい らしい__ pode ser \"parece ser estudante\" ou \"como um bom estudante\". O contexto mostra qual."
    ],
    "pattern": "[forma simples] らしい · [substantivo] らしい",
    "hint": "らしい: parece que, pelo que ouvi ou vi.",
    "examples": [
      {
        "id": 100541,
        "ja": "彼は病気らしい。",
        "furi": "[彼|かれ]は[病気|びょう|き]らしい。",
        "kana": "かれ~は びょうきらしい",
        "pt": "Ele parece doente."
      },
      {
        "id": 79709,
        "ja": "夜は雨になるらしい。",
        "furi": "[夜|よる]は[雨|あめ]になるらしい。",
        "kana": "よる~は あめ~に なるらしい",
        "pt": "Parece que vai chover esta noite."
      },
      {
        "id": 108153,
        "ja": "彼は金持ちらしい。",
        "furi": "[彼|かれ]は[金持|かね|も]ちらしい。",
        "kana": "かれ~は かねもちらしい",
        "pt": "Ele parece ser rico."
      },
      {
        "id": 90133,
        "ja": "彼女は幸せらしい。",
        "furi": "[彼女|かの|じょ]は[幸|しあわ]せらしい。",
        "kana": "かのじょ~は しあわせらしい",
        "pt": "Parece que ela está feliz."
      }
    ]
  },
  {
    "id": "n3-2",
    "title": "Sobre: 〜について",
    "body": [
      "Para dizer **sobre** o que se fala, escreve ou pensa, coloque **について** depois do assunto: __おんがく について はなす__ (\"falar sobre música\"). Quando o assunto vem antes de um substantivo, junte **の**: __ほし についての ほん__ (\"um livro sobre estrelas\").",
      {
        "table": [
          [
            "#padrão",
            "#exemplo"
          ],
          [
            "assunto + について + verbo",
            "__それ について はなした__ (falou sobre isso)"
          ],
          [
            "assunto + についての + substantivo",
            "__ほし についての ほん__ (livro sobre estrelas)"
          ],
          [
            "なに + について",
            "__なに について はなしている?__ (falando sobre o quê?)"
          ]
        ]
      },
      "Os verbos mais comuns com **について** são __はなす__ (falar), __かく__ (escrever), __しらべる__ (pesquisar), __かんがえる__ (pensar) e __きく__ (perguntar)."
    ],
    "pattern": "[assunto] について + verbo · [assunto] についての + [substantivo]",
    "hint": "について = sobre o assunto.",
    "examples": [
      {
        "id": 158200,
        "ja": "音楽について話したよ。",
        "furi": "[音楽|おん|がく]について[話|はな]したよ。",
        "kana": "おんがく について はなしたよ",
        "pt": "Falei de música."
      },
      {
        "id": 112236,
        "ja": "彼はそれについて話した。",
        "furi": "[彼|かれ]はそれについて[話|はな]した。",
        "kana": "かれ~は それ について はなした",
        "pt": "Ele mencionou-o."
      },
      {
        "id": 218242,
        "ja": "これは星についての本です。",
        "furi": "これは[星|ほし]についての[本|ほん]です。",
        "kana": "これ~は ほし について~の ほん|です",
        "pt": "Este livro é sobre estrelas."
      },
      {
        "id": 883097,
        "ja": "彼は何について話している？",
        "furi": "[彼|かれ]は[何|なに]について[話|はな]している？",
        "kana": "かれ~は なに について はなしている",
        "pt": "Do que ele está falando?"
      }
    ]
  },
  {
    "id": "n3-3",
    "title": "Como: 〜として",
    "body": [
      "Com **として** você diz em que **papel**, função ou condição algo ou alguém é visto: \"como médico\", \"como amigo\", \"como cantora\". Vem logo depois do substantivo.",
      {
        "table": [
          [
            "#padrão",
            "#exemplo"
          ],
          [
            "substantivo + として",
            "__いしゃ として ゆうめいだ__ (é famoso como médico)"
          ],
          [
            "pessoa + として",
            "__ともだち として すきよ__ (gosto de você como amigo)"
          ]
        ]
      },
      "Compare com **に** e com **で**: __いしゃ として__ diz \"na função de médico\", e não \"em um médico\". Serve também para negar ou elogiar uma qualidade nessa função: __いしゃ として むのうだ__ (\"como médico, é incapaz\")."
    ],
    "pattern": "[substantivo] として",
    "hint": "として = na função de, como.",
    "examples": [
      {
        "id": 110065,
        "ja": "彼は医者として有名だ。",
        "furi": "[彼|かれ]は[医者|い|しゃ]として[有名|ゆう|めい]だ。",
        "kana": "かれ~は いしゃ として ゆうめいだ",
        "pt": "Ele é famoso como médico."
      },
      {
        "id": 90817,
        "ja": "彼女は歌手として有名だ。",
        "furi": "[彼女|かの|じょ]は[歌手|か|しゅ]として[有名|ゆう|めい]だ。",
        "kana": "かのじょ~は かしゅ として ゆうめいだ",
        "pt": "Como cantora, ela é bem conhecida."
      },
      {
        "id": 11977679,
        "ja": "友達として好きよ。",
        "furi": "[友達|とも|だち]として[好|す]きよ。",
        "kana": "ともだち として すきよ",
        "pt": "Eu gosto de você como amigo."
      },
      {
        "id": 110066,
        "ja": "彼は医者として無能だ。",
        "furi": "[彼|かれ]は[医者|い|しゃ]として[無能|む|のう]だ。",
        "kana": "かれ~は いしゃ として むのうだ",
        "pt": "Ele não é bom como médico."
      }
    ]
  },
  {
    "id": "n3-4",
    "title": "Em relação a: 〜に対して",
    "body": [
      "Com **にたいして** (escreve-se 〜に対して) você aponta para **quem ou o quê** recebe um sentimento ou uma atitude: raiva, carinho, gentileza, desculpa. Vem depois de **に**.",
      {
        "table": [
          [
            "#padrão",
            "#exemplo"
          ],
          [
            "pessoa/coisa + に対して + sentimento",
            "__どうぶつ に たいして やさしい__ (gentil com os animais)"
          ],
          [
            "pessoa + に対して + ação",
            "__きみ に たいして おこっている__ (está com raiva de você)"
          ]
        ]
      },
      "Outro uso do **にたいして** é **contrastar** dois lados (\"enquanto...\"). Quando a frase é só \"sobre um assunto\", prefira **について**; quando há alguém na ponta de um sentimento, use **にたいして**."
    ],
    "pattern": "[pessoa/coisa] に対して [sentimento/atitude]",
    "hint": "に対して = em relação a, para com.",
    "examples": [
      {
        "id": 87698,
        "ja": "彼女は動物に対して優しい。",
        "furi": "[彼女|かの|じょ]は[動物|どう|ぶつ]に[対|たい]して[優|やさ]しい。",
        "kana": "かのじょ~は どうぶつ~に たいして やさしい",
        "pt": "Ela é gentil com animais."
      },
      {
        "id": 108056,
        "ja": "彼は君に対して怒っている。",
        "furi": "[彼|かれ]は[君|きみ]に[対|たい]して[怒|おこ]っている。",
        "kana": "かれ~は きみ~に たいして おこっている",
        "pt": "Ele está com raiva de você."
      },
      {
        "id": 4897810,
        "ja": "私に対して怒ってるんでしょう。",
        "furi": "[私|わたし]に[対|たい]して[怒|おこ]ってるんでしょう。",
        "kana": "わたし~に たいして おこってるんでしょう",
        "pt": "Você está chateado comigo, não está?"
      },
      {
        "id": 94795,
        "ja": "彼女に対してすまない気がします。",
        "furi": "[彼女|かの|じょ]に[対|たい]してすまない[気|き]がします。",
        "kana": "かのじょ~に たいして すまない き~が します",
        "pt": "Eu sinto muito por ela."
      }
    ]
  },
  {
    "id": "n3-5",
    "title": "Depende de e por meio de: 〜によって",
    "body": [
      "O **によって** tem dois usos que aparecem muito: mostrar o que **depende** de alguém ou de algo (\"varia conforme\") e indicar o **autor** de uma frase na passiva (\"foi escrita por\", \"foi criado por\").",
      {
        "table": [
          [
            "#uso",
            "#exemplo"
          ],
          [
            "depende de",
            "__ひと によって いけん が ことなる__ (a opinião muda conforme a pessoa)"
          ],
          [
            "autor, na passiva",
            "__かのじょ によって かかれた__ (foi escrita por ela)"
          ],
          [
            "autor, na passiva",
            "__そぼ によって そだてられた__ (foi criado pela avó)"
          ]
        ]
      },
      "Na passiva, **によって** costuma aparecer com criações e fatos (\"a carta foi escrita por ela\"); com pessoas comuns, **に** também serve. Mas, para dizer \"conforme o caso\", só o **によって** funciona."
    ],
    "pattern": "[A] によって [verbo] · [A] によって + [passiva]",
    "hint": "によって: depende de A, ou foi feito por A.",
    "examples": [
      {
        "id": 144656,
        "ja": "人によって意見が異なる。",
        "furi": "[人|ひと]によって[意見|い|けん]が[異|こと]なる。",
        "kana": "ひと~に よって いけん~が ことなる",
        "pt": "As opiniões variam de uma pessoa a outra."
      },
      {
        "id": 102896,
        "ja": "彼は祖母によって育てられた。",
        "furi": "[彼|かれ]は[祖母|そ|ぼ]によって[育|そだ]てられた。",
        "kana": "かれ~は そぼ~に よって そだてられた",
        "pt": "Ele foi criado pela avó."
      },
      {
        "id": 148574,
        "ja": "手紙は彼女によって書かれた。",
        "furi": "[手紙|て|がみ]は[彼女|かの|じょ]によって[書|か]かれた。",
        "kana": "てがみ~は かのじょ~に よって かかれた",
        "pt": "A carta foi escrita por ela."
      }
    ]
  },
  {
    "id": "n3-6",
    "title": "Tanto quanto: 〜ほど",
    "body": [
      "A palavra **ほど** mede um **grau**: \"a ponto de\", \"tão... quanto\". Ela aparece em três formas muito comuns.",
      {
        "table": [
          [
            "#padrão",
            "#exemplo"
          ],
          [
            "A は B ほど 〜ない",
            "__かれ は あに ほど かしこくない__ (não é tão inteligente quanto o irmão)"
          ],
          [
            "〜ば 〜ほど",
            "__はやければ はやい ほど いい__ (quanto mais cedo, melhor)"
          ],
          [
            "それほど 〜ない",
            "__それほど かんたんで は ない__ (não é tão simples assim)"
          ]
        ]
      },
      "Na comparação com **ほど**, o fim da frase é sempre **negativo**: \"A não é tão... quanto B\". Para \"quanto mais... mais...\", repita a mesma palavra na forma **ば** e depois com **ほど**."
    ],
    "pattern": "A は B ほど [negativo] · [〜ば] [〜] ほど · それほど [negativo]",
    "hint": "ほど: o grau; com ば, \"quanto mais... mais...\".",
    "examples": [
      {
        "id": 107998,
        "ja": "彼は兄ほど賢くない。",
        "furi": "[彼|かれ]は[兄|あに]ほど[賢|かしこ]くない。",
        "kana": "かれ~は あに ほど かしこくない",
        "pt": "Ele não é tão inteligente como meu irmão."
      },
      {
        "id": 102981,
        "ja": "彼は前ほど勉強しない。",
        "furi": "[彼|かれ]は[前|まえ]ほど[勉強|べん|きょう]しない。",
        "kana": "かれ~は まえ ほど べんきょう しない",
        "pt": "Não estuda tanto como antes."
      },
      {
        "id": 139697,
        "ja": "早ければ早いほどいい。",
        "furi": "[早|はや]ければ[早|はや]いほどいい。",
        "kana": "はやければ はやい ほど いい",
        "pt": "Quanto antes, melhor."
      },
      {
        "id": 3555706,
        "ja": "それほど簡単ではない。",
        "furi": "それほど[簡単|かん|たん]ではない。",
        "kana": "それほど かんたんで~は ない",
        "pt": "Não é tão simples assim."
      }
    ]
  },
  {
    "id": "n3-7",
    "title": "Não é que...: 〜わけがない e 〜わけではない",
    "body": [
      "A palavra **わけ** é \"motivo, razão\". Com ela, você diz que algo **não pode ser** ou que \"não é que seja assim\". Vem depois da forma simples.",
      {
        "table": [
          [
            "#padrão",
            "#exemplo"
          ],
          [
            "forma simples + わけがない",
            "__ある わけ が ない__ (não tem como existir)"
          ],
          [
            "forma simples + わけがない",
            "__わすれる わけ ない__ (como eu esqueceria?)"
          ],
          [
            "forma simples + わけではない",
            "__そう いう わけ じゃない__ (não é bem assim)"
          ]
        ]
      },
      "O **わけがない** é forte: \"é impossível\". Já **わけではない** só corrige um mal-entendido, de forma mais leve (\"não é que...\"). Na fala, **が** cai e **では** vira **じゃ**."
    ],
    "pattern": "[forma simples] わけがない · [forma simples] わけではない",
    "hint": "わけがない: impossível; わけではない: não é bem assim.",
    "examples": [
      {
        "id": 12022251,
        "ja": "忘れるわけないでしょ？",
        "furi": "[忘|わす]れるわけないでしょ？",
        "kana": "わすれる わけ ないでしょ",
        "pt": "Como eu pude esquecer?"
      },
      {
        "id": 2190027,
        "ja": "あるわけがない。",
        "furi": "あるわけがない。",
        "kana": "ある わけ~が ない",
        "pt": "De jeito nenhum."
      },
      {
        "id": 213803,
        "ja": "そう言うわけじゃない。",
        "furi": "そう[言|い]うわけじゃない。",
        "kana": "そう いう わけ じゃない",
        "pt": "Não, nem por isso."
      },
      {
        "id": 3455723,
        "ja": "何が言いたいわけ？",
        "furi": "[何|なに]が[言|い]いたいわけ？",
        "kana": "なに~が いいたい わけ",
        "pt": "O que você está insinuando?"
      }
    ]
  },
  {
    "id": "n3-8",
    "title": "Não pode ser: 〜はずがない",
    "body": [
      "No N4 você viu **はず** (\"deve ser\"). Com **はずがない** vira \"**não pode ser**\": quem fala tem certeza de que é impossível. Vem depois da forma simples (e **の** depois de substantivo).",
      {
        "table": [
          [
            "#padrão",
            "#exemplo"
          ],
          [
            "forma simples + はずがない",
            "__かれ が うそ を いった はず が ない__ (ele não pode ter mentido)"
          ],
          [
            "substantivo + の + はずがない",
            "__ほんき の はず が ない__ (não pode ser sério)"
          ]
        ]
      },
      "**はずがない** e **わけがない** são parecidos: os dois dizem \"impossível\". Com **はず**, a conclusão vem de um raciocínio ou de um fato conhecido; com **わけ**, da razão ou do bom senso."
    ],
    "pattern": "[forma simples] はずがない · [substantivo] の はずがない",
    "hint": "はずがない: impossível, não pode ser.",
    "examples": [
      {
        "id": 81586,
        "ja": "本気のはずがないわ。",
        "furi": "[本気|ほん|き]のはずがないわ。",
        "kana": "ほんき~の はず~が ないわ",
        "pt": "Não podes estar a falar a sério."
      },
      {
        "id": 121048,
        "ja": "彼がうそを言ったはずがない。",
        "furi": "[彼|かれ]がうそを[言|い]ったはずがない。",
        "kana": "かれ~が うそ~を いった はず~が ない",
        "pt": "Ele não pode ter contado uma mentira."
      },
      {
        "id": 120899,
        "ja": "彼がその事を言ったはずがない。",
        "furi": "[彼|かれ]がその[事|こと]を[言|い]ったはずがない。",
        "kana": "かれ~が その こと~を いった はず~が ない",
        "pt": "Ele não pode ter dito isso."
      },
      {
        "id": 120848,
        "ja": "彼がそんなことをしたはずがない。",
        "furi": "[彼|かれ]がそんなことをしたはずがない。",
        "kana": "かれ~が そんな こと~を した はず~が ない",
        "pt": "Ele não pode ter feito tal coisa."
      }
    ]
  },
  {
    "id": "n3-9",
    "title": "O momento da ação: 〜ところだ",
    "body": [
      "A palavra **ところ** (\"lugar\") também mostra **em que ponto da ação** a pessoa está. A forma do verbo antes dela muda o sentido.",
      {
        "table": [
          [
            "#forma",
            "#sentido"
          ],
          [
            "forma de dicionário + ところだ",
            "__でかける ところだ__ (está prestes a sair)"
          ],
          [
            "〜ている + ところだ",
            "__あらっている ところです__ (está no meio de lavar)"
          ],
          [
            "〜た + ところだ",
            "__でた ところだ__ (acabou de sair)"
          ],
          [
            "dicionário + ところだった",
            "__わすれる ところだった__ (quase esqueci)"
          ]
        ]
      },
      "Cuidado com **〜たところ** (\"acabou de\") e **〜たばかり** (também \"acabou de\"): **ところ** fala de um instante, de uns minutos atrás; **ばかり** admite uma época mais longa (\"faz pouco tempo\")."
    ],
    "pattern": "[dicionário] ところだ · [〜ている] ところだ · [〜た] ところだ · [dicionário] ところだった",
    "hint": "ところ: prestes a, no meio de, acabou de.",
    "examples": [
      {
        "id": 107131,
        "ja": "彼は今出かけるところだ。",
        "furi": "[彼|かれ]は[今|いま][出|で]かけるところだ。",
        "kana": "かれ~は いま でかける ところだ",
        "pt": "Ele está saindo de casa agora."
      },
      {
        "id": 104631,
        "ja": "彼は車を洗っているところです。",
        "furi": "[彼|かれ]は[車|くるま]を[洗|あら]っているところです。",
        "kana": "かれ~は くるま~を あらっている ところ|です",
        "pt": "Ele está lavando o carro."
      },
      {
        "id": 124805,
        "ja": "電車に傘を忘れるところだった。",
        "furi": "[電車|でん|しゃ]に[傘|かさ]を[忘|わす]れるところだった。",
        "kana": "でんしゃ~に かさ~を わすれる ところだった",
        "pt": "Eu quase deixei meu guarda-chuva no trem."
      },
      {
        "id": 77487,
        "ja": "列車は出たところだ。",
        "furi": "[列車|れっ|しゃ]は[出|で]たところだ。",
        "kana": "れっしゃ~は でた ところだ",
        "pt": "O trem acaba de partir."
      }
    ]
  },
  {
    "id": "n3-10",
    "title": "Enquanto dá tempo: 〜うちに",
    "body": [
      "Com **うちに** você faz algo **enquanto** uma situação ainda dura, antes que ela mude: \"enquanto está quente\", \"enquanto está escuro\". O que vem depois é uma ação que vale a pena fazer antes da mudança.",
      {
        "table": [
          [
            "#padrão",
            "#exemplo"
          ],
          [
            "adjetivo い + うちに",
            "__あたたかい うちに たべよう__ (vamos comer enquanto está quente)"
          ],
          [
            "verbo (forma simples) + うちに",
            "__くらい うちに おきた__ (acordei enquanto ainda estava escuro)"
          ],
          [
            "substantivo + の + うちに",
            "__ひるま の うちに__ (durante o dia)"
          ]
        ]
      },
      "A expressão **ちかい うちに** (\"um dia desses\", \"em breve\") é muito comum. Ela fixa o sentido de **うちに** como \"dentro de um período que ainda não acabou\"."
    ],
    "pattern": "[adjetivo/verbo simples] うちに · [substantivo] の うちに",
    "hint": "うちに: enquanto ainda dá, antes de mudar.",
    "examples": [
      {
        "id": 82003,
        "ja": "僕は暗いうちに起きた。",
        "furi": "[僕|ぼく]は[暗|くら]いうちに[起|お]きた。",
        "kana": "ぼく~は くらい うち~に おきた",
        "pt": "Levantei enquanto ainda estava escuro."
      },
      {
        "id": 188334,
        "ja": "温かいうちに食べよう。",
        "furi": "[温|あたた]かいうちに[食|た]べよう。",
        "kana": "あたたかい うち~に たべよう",
        "pt": "Comamos enquanto esteja quente."
      },
      {
        "id": 179920,
        "ja": "近いうちにお訪ねします。",
        "furi": "[近|ちか]いうちにお[訪|たず]ねします。",
        "kana": "ちかい うち~に お たずね します",
        "pt": "Eu virei te ver um dia desses."
      }
    ]
  },
  {
    "id": "n3-11",
    "title": "Graças a e por culpa de: 〜おかげ e 〜せい",
    "body": [
      "Para dar a **causa** de algo, o japonês separa o bom do ruim. O **おかげで** vem de um resultado positivo (\"graças a\"); o **せいで**, de um negativo (\"por culpa de\").",
      {
        "table": [
          [
            "#padrão",
            "#exemplo"
          ],
          [
            "A の おかげ(で)",
            "__あなた の おかげ です__ (é graças a você)"
          ],
          [
            "A の せい(で)",
            "__あめ の せい で さんぽ できなかった__ (a chuva nos impediu de passear)"
          ],
          [
            "A の せい では ない",
            "__あなた の せい では ありません__ (não é culpa sua)"
          ]
        ]
      },
      "Antes de **おかげ** e **せい** use **の** depois de substantivo; depois de verbo ou adjetivo, a forma simples. Para agradecer de coração, **おかげさまで** (\"graças a você\") é muito usado."
    ],
    "pattern": "[A] の おかげで · [A] の せいで · [A] の せいではない",
    "hint": "おかげ: graças a (bom); せい: por culpa de (ruim).",
    "examples": [
      {
        "id": 168056,
        "ja": "私がいるのは父のおかげです。",
        "furi": "[私|わたし]がいるのは[父|ちち]のおかげです。",
        "kana": "わたし~が いる の~は ちち~の おかげ|です",
        "pt": "Devo tudo o que sou ao meu pai."
      },
      {
        "id": 4760435,
        "ja": "あなたのおかげです。",
        "furi": "あなたのおかげです。",
        "kana": "あなた~の おかげ|です",
        "pt": "Graças a você."
      },
      {
        "id": 10784642,
        "ja": "雨のせいで散歩できなかったんだ。",
        "furi": "[雨|あめ]のせいで[散歩|さん|ぽ]できなかったんだ。",
        "kana": "あめ~の せい~で さんぽ できなかった~んだ",
        "pt": "A chuva nos impediu de dar uma caminhada."
      },
      {
        "id": 2043892,
        "ja": "あなたのせいではありません。",
        "furi": "あなたのせいではありません。",
        "kana": "あなた~の せい~で~は ありません",
        "pt": "Não é culpa sua."
      }
    ]
  },
  {
    "id": "n3-12",
    "title": "Do jeito que está: 〜まま",
    "body": [
      "Com **まま** a situação **continua como estava**, sem mudar: a porta fica aberta, a pessoa fica calada. Vem depois do verbo na forma **〜た** (ou **〜ない**) ou de um substantivo com **の**.",
      {
        "table": [
          [
            "#padrão",
            "#exemplo"
          ],
          [
            "verbo 〜た + まま",
            "__だまった まま だった__ (ficou calado)"
          ],
          [
            "verbo 〜た + まま",
            "__あけた まま で ねた__ (dormiu de janela aberta)"
          ],
          [
            "substantivo + の + まま",
            "__ともだち の まま__ (continuaram amigos)"
          ]
        ]
      },
      "O **まま** costuma trazer uma ideia de que a situação \"devia ter mudado\" e não mudou, ou que isso foi sem querer ou descuido: **ひらいた まま** é \"ficou aberto (e ninguém fechou)\"."
    ],
    "pattern": "[〜た] まま · [substantivo] の まま",
    "hint": "まま: continua como estava.",
    "examples": [
      {
        "id": 99535,
        "ja": "彼は黙ったままだった。",
        "furi": "[彼|かれ]は[黙|だま]ったままだった。",
        "kana": "かれ~は だまった ままだった",
        "pt": "Ele ficou em silêncio."
      },
      {
        "id": 10284360,
        "ja": "門は開いたままだった。",
        "furi": "[門|もん]は[開|あ]いたままだった。",
        "kana": "もん~は あいた ままだった",
        "pt": "Deixaram o portão aberto."
      },
      {
        "id": 174541,
        "ja": "戸は閉まったままだった。",
        "furi": "[戸|と]は[閉|し]まったままだった。",
        "kana": "と~は しまった ままだった",
        "pt": "A porta permaneceu fechada."
      },
      {
        "id": 96075,
        "ja": "彼らは友達のままだった。",
        "furi": "[彼|かれ]らは[友達|とも|だち]のままだった。",
        "kana": "かれら~は ともだち~の ままだった",
        "pt": "Eles continuaram amigos."
      }
    ]
  },
  {
    "id": "n3-13",
    "title": "Até e só: 〜さえ",
    "body": [
      "O **さえ** tem dois usos. O primeiro é \"**até**\": mostra um caso extremo, e se entende que os outros valem também (\"até uma criança entende\"). O segundo é **さえ 〜ば**: \"basta que... \".",
      {
        "table": [
          [
            "#padrão",
            "#exemplo"
          ],
          [
            "A さえ + frase",
            "__こども で さえ も わかる__ (até uma criança entende)"
          ],
          [
            "A さえ 〜ば",
            "__みず さえ あれば いい__ (basta ter água)"
          ],
          [
            "verbo (ます) + さえ すれば",
            "__あり さえ すれば いい__ (basta existir)"
          ]
        ]
      },
      "No uso de \"basta que\", **さえ** substitui **が** ou **を** (\"só a água resolve\"), e a frase termina com **ば** (\"se\"). Com o verbo, use __〜さえ すれば__."
    ],
    "pattern": "A さえ 〜 · A さえ 〜ば · [verbo ます] さえ すれば",
    "hint": "さえ: até; ou \"basta que\" com ば.",
    "examples": [
      {
        "id": 12453472,
        "ja": "水さえあればいい。",
        "furi": "[水|みず]さえあればいい。",
        "kana": "みず さえ あれば いい",
        "pt": "Só precisamos de água."
      },
      {
        "id": 10516148,
        "ja": "水がありさえすればいい。",
        "furi": "[水|みず]がありさえすればいい。",
        "kana": "みず~が あり さえ すれば いい",
        "pt": "Tudo de que precisamos é água."
      },
      {
        "id": 168690,
        "ja": "子供でさえもそれはわかる。",
        "furi": "[子供|こ|ども]でさえもそれはわかる。",
        "kana": "こども~で さえ~も それ~は わかる",
        "pt": "Até uma criança entende isso."
      }
    ]
  },
  {
    "id": "n3-14",
    "title": "Com jeito de: 〜っぽい",
    "body": [
      "O sufixo **っぽい** dá a uma palavra a ideia de \"**com jeito de**, **tende a**\". Ele funciona como um adjetivo い, e vem depois da raiz do verbo ou de um substantivo.",
      {
        "table": [
          [
            "#padrão",
            "#exemplo"
          ],
          [
            "raiz do verbo + っぽい",
            "__わすれっぽい__ (esquecido, tende a esquecer)"
          ],
          [
            "raiz do verbo + っぽい",
            "__ほれっぽい__ (se apaixona fácil)"
          ],
          [
            "substantivo + っぽい",
            "__ねつっぽい__ (com jeito de febre)"
          ]
        ]
      },
      "É um jeito informal de falar. Em geral dá um tom de crítica ou de impressão, não de elogio: __こどもっぽい__ (\"infantil, meio criança\")."
    ],
    "pattern": "[raiz do verbo] っぽい · [substantivo] っぽい",
    "hint": "っぽい: com jeito de, tende a.",
    "examples": [
      {
        "id": 100010,
        "ja": "彼は忘れっぽい。",
        "furi": "[彼|かれ]は[忘|わす]れっぽい。",
        "kana": "かれ~は わすれっぽい",
        "pt": "Ele esquece as coisas facilmente."
      },
      {
        "id": 2422273,
        "ja": "彼は惚れっぽい人だ。",
        "furi": "[彼|かれ]は[惚|ほ]れっぽい[人|ひと]だ。",
        "kana": "かれ~は ほれっぽい ひとだ",
        "pt": "Ele frequentemente se apaixona."
      },
      {
        "id": 138015,
        "ja": "体が熱っぽいんだ。",
        "furi": "[体|からだ]が[熱|ねつ]っぽいんだ。",
        "kana": "からだ~が ねつっぽい~んだ",
        "pt": "Eu sinto febre."
      }
    ]
  },
  {
    "id": "n3-15",
    "title": "Acabar sendo: 〜ことになる",
    "body": [
      "A forma **ことになる** diz que algo \"**ficou decidido**\" ou \"**acabou sendo assim**\", sem que o falante tenha escolhido: foi uma decisão das circunstâncias, da empresa, de outras pessoas. Vem depois da forma simples.",
      {
        "table": [
          [
            "#padrão",
            "#exemplo"
          ],
          [
            "forma simples + ことになる",
            "__めんどうな こと に なる__ (vai dar encrenca)"
          ],
          [
            "forma simples + ことになった",
            "__そんな こと に なった__ (acabou assim)"
          ],
          [
            "forma simples + ことになっている",
            "__まずい こと に なってる__ (está numa situação ruim)"
          ]
        ]
      },
      "Compare com o que você viu no N4: **ことにする** (\"eu decido\") e **ことになる** (\"foi decidido, acabou sendo\"). O primeiro é uma escolha sua; o segundo, algo que aconteceu ou foi decidido por outros."
    ],
    "pattern": "[forma simples] ことになる · [forma simples] ことになった",
    "hint": "ことになる: ficou decidido; acabou sendo.",
    "examples": [
      {
        "id": 8760370,
        "ja": "まずいことになってるの？",
        "furi": "まずいことになってるの？",
        "kana": "まずい こと~に なってる~の",
        "pt": "Você está em apuros?"
      },
      {
        "id": 11294717,
        "ja": "どうしてそんなことになったの？",
        "furi": "どうしてそんなことになったの？",
        "kana": "どうして そんな こと~に なった~の",
        "pt": "Por que isso aconteceu?"
      },
      {
        "id": 80195,
        "ja": "面倒なことになるよ。",
        "furi": "[面倒|めん|どう]なことになるよ。",
        "kana": "めんどうな こと~に なる~よ",
        "pt": "Você vai se meter em encrenca."
      }
    ]
  },
  {
    "id": "n3-16",
    "title": "Não aguento: 〜てたまらない",
    "body": [
      "O **〜てたまらない** diz que uma sensação ou um sentimento é **forte demais para suportar**: dor, calor, vontade. Vem a forma **て** de um adjetivo ou do **〜たい** + **たまらない**.",
      {
        "table": [
          [
            "#padrão",
            "#exemplo"
          ],
          [
            "adjetivo い (くて) + たまらない",
            "__いたくて たまらない__ (a dor é insuportável)"
          ],
          [
            "adjetivo い (くて) + たまらない",
            "__あつくて たまらない__ (o calor é insuportável)"
          ],
          [
            "adjetivo な (で) + たまらない",
            "__しんぱいで たまらない__ (estou preocupadíssimo)"
          ],
          [
            "〜たくて + たまらない",
            "__いきたくて たまらない__ (estou louco para ir)"
          ]
        ]
      },
      "Só se usa para a sensação de **quem fala**: dor, calor, desejo. Para dizer o mesmo de outra pessoa, o japonês muda a forma (__いたがっている__)."
    ],
    "pattern": "[adjetivo い, くて] たまらない · [adjetivo な, で] たまらない · [〜たくて] たまらない",
    "hint": "てたまらない: insuportável, forte demais.",
    "examples": [
      {
        "id": 125692,
        "ja": "痛くてたまらない。",
        "furi": "[痛|いた]くてたまらない。",
        "kana": "いたくて たまらない",
        "pt": "Eu não suporto a dor."
      },
      {
        "id": 147456,
        "ja": "暑くてたまらない。",
        "furi": "[暑|あつ]くてたまらない。",
        "kana": "あつくて たまらない",
        "pt": "Eu não suporto este calor."
      },
      {
        "id": 11016725,
        "ja": "足が痛くてたまらない。",
        "furi": "[足|あし]が[痛|いた]くてたまらない。",
        "kana": "あし~が いたくて たまらない",
        "pt": "Meus pés estão me matando."
      }
    ]
  },
  {
    "id": "n3-17",
    "title": "Se ou não: 〜かどうか",
    "body": [
      "Uma pergunta de sim ou não pode virar parte de outra frase com **かどうか**: \"se ele vem ou não\". Vem depois da **forma simples**, e a frase termina com um verbo como __しらない__ (não sei), __わからない__ (não entendo) ou __ぎもんだ__ (tenho dúvida).",
      {
        "table": [
          [
            "#padrão",
            "#exemplo"
          ],
          [
            "forma simples + かどうか",
            "__くる か どう か しらない__ (não sei se vem)"
          ],
          [
            "substantivo + かどうか",
            "__ほんとう か どう か__ (se é verdade)"
          ],
          [
            "かどうか + は + frase",
            "__くる か どう か は もんだいで は ない__ (não importa se vem ou não)"
          ]
        ]
      },
      "O **か** sozinho serve quando a frase já tem uma palavra de pergunta: __なに を たべる か__ (\"o que comer\"). O **かどうか** é para o \"sim ou não\": é o \"se\" do português."
    ],
    "pattern": "[forma simples] かどうか + [知らない / わからない / 問題だ]",
    "hint": "かどうか: se ... ou não.",
    "examples": [
      {
        "id": 119368,
        "ja": "彼が来るかどうか知らない。",
        "furi": "[彼|かれ]が[来|く]るかどうか[知|し]らない。",
        "kana": "かれ~が くる か どう か しらない",
        "pt": "Não sei se ele vem."
      },
      {
        "id": 80349,
        "ja": "明日雨が降るかどうかわからない。",
        "furi": "[明日|あした][雨|あめ]が[降|ふ]るかどうかわからない。",
        "kana": "あした あめ~が ふる か どう か わからない",
        "pt": "Não sei se amanhã vai chover."
      },
      {
        "id": 178848,
        "ja": "君が来るかどうかは問題ではない。",
        "furi": "[君|きみ]が[来|く]るかどうかは[問題|もん|だい]ではない。",
        "kana": "きみ~が くる か どう か~は もんだいで~は ない",
        "pt": "Não importa se você vem ou não."
      },
      {
        "id": 119369,
        "ja": "彼が来るかどうか疑問だ。",
        "furi": "[彼|かれ]が[来|く]るかどうか[疑問|ぎ|もん]だ。",
        "kana": "かれ~が くる か どう か ぎもんだ",
        "pt": "Tenho dúvidas se ele virá."
      }
    ]
  },
  {
    "id": "n3-18",
    "title": "Deveria: 〜べき",
    "body": [
      "Com **べき** você diz o que se **deve** fazer, o que é o certo. Vem depois do verbo na **forma de dicionário**. É mais forte que **〜ほうがいい**: pode soar como cobrança.",
      {
        "table": [
          [
            "#padrão",
            "#exemplo"
          ],
          [
            "dicionário + べきだ",
            "__いう べきだ__ (deve-se dizer)"
          ],
          [
            "する → すべき ou するべき",
            "__しゃざい すべきだ__ (deveria pedir desculpas)"
          ],
          [
            "べきではない",
            "__いう べき では ない__ (não se deve dizer)"
          ]
        ]
      },
      "Com **する** existem duas formas, __すべき__ e __するべき__, e as duas estão certas. Para aconselhar com mais leveza, use **〜ほうがいい**; para obrigação do dia a dia, **〜なければならない**."
    ],
    "pattern": "[dicionário] べきだ · [dicionário] べきではない",
    "hint": "べき: deve, é o certo a fazer.",
    "examples": [
      {
        "id": 144981,
        "ja": "真実を言うべきだ。",
        "furi": "[真実|しん|じつ]を[言|い]うべきだ。",
        "kana": "しんじつ~を いう べきだ",
        "pt": "Você deveria dizer a verdade."
      },
      {
        "id": 177174,
        "ja": "君は謝罪すべきだ。",
        "furi": "[君|きみ]は[謝罪|しゃ|ざい]すべきだ。",
        "kana": "きみ~は しゃざい すべきだ",
        "pt": "Você devia se desculpar."
      },
      {
        "id": 3366937,
        "ja": "辞めるべきだよ。",
        "furi": "[辞|や]めるべきだよ。",
        "kana": "やめる べきだ~よ",
        "pt": "Você deveria sair."
      },
      {
        "id": 2972449,
        "ja": "禁煙するべきです。",
        "furi": "[禁煙|きん|えん]するべきです。",
        "kana": "きんえん する べき|です",
        "pt": "Você deve parar de fumar."
      }
    ]
  },
  {
    "id": "n3-19",
    "title": "Sem fazer: 〜ずに",
    "body": [
      "O **ずに** diz \"**sem fazer**\": a ação não acontece enquanto outra acontece. Ele se forma com a **forma ない sem o ない** + **ずに**. É a versão mais formal (e mais de texto) do **〜ないで** que você já viu.",
      {
        "table": [
          [
            "#padrão",
            "#exemplo"
          ],
          [
            "verbo (sem ない) + ずに",
            "__わすれ ずに__ (sem esquecer)"
          ],
          [
            "verbo (sem ない) + ずに",
            "__ぬが ずに__ (sem tirar)"
          ],
          [
            "する → せずに",
            "__そうだん せ ずに__ (sem consultar)"
          ]
        ]
      },
      "A única exceção é **する**: __せずに__, e não __しずに__. Combinações como __〜ずにはいられない__ (\"não consigo deixar de...\") também usam essa forma."
    ],
    "pattern": "[verbo, forma ない sem ない] ずに",
    "hint": "ずに: sem fazer (como ないで, mais formal).",
    "examples": [
      {
        "id": 82564,
        "ja": "忘れずに電話してね。",
        "furi": "[忘|わす]れずに[電話|でん|わ]してね。",
        "kana": "わすれず に でんわ してね",
        "pt": "Não esqueça de me ligar."
      },
      {
        "id": 1147354,
        "ja": "誰にも相談せずにやった。",
        "furi": "[誰|だれ]にも[相談|そう|だん]せずにやった。",
        "kana": "だれ~に~も そうだん せず に やった",
        "pt": "Fiz aquilo sem consultar ninguém."
      },
      {
        "id": 157894,
        "ja": "私は外出せずに家にいた。",
        "furi": "[私|わたし]は[外出|がい|しゅつ]せずに[家|いえ]にいた。",
        "kana": "わたし~は がいしゅつ せず に いえ~に いた",
        "pt": "Eu fiquei em casa ao invés de sair."
      },
      {
        "id": 10840506,
        "ja": "靴は脱がずにどうぞ。",
        "furi": "[靴|くつ]は[脱|ぬ]がずにどうぞ。",
        "kana": "くつ~は ぬがず に どうぞ",
        "pt": "Por favor, não tire os sapatos."
      }
    ]
  },
  {
    "id": "n3-20",
    "title": "Quero que você faça: 〜てほしい",
    "body": [
      "Com **ほしい** depois da forma **て**, você diz o que quer que **outra pessoa** faça. Quem deve fazer vem com **に**. Se o desejo é seu, use **〜たい**; se é do outro, **〜てほしい**.",
      {
        "table": [
          [
            "#padrão",
            "#exemplo"
          ],
          [
            "verbo て + ほしい",
            "__うたって ほしい__ (quero que cante)"
          ],
          [
            "pessoa に + verbo て + ほしい",
            "__あなた に うたって ほしい__ (quero que você cante)"
          ],
          [
            "verbo ない + で + ほしい",
            "__いわ ないで ほしい__ (não quero que diga)"
          ]
        ]
      },
      "Para um pedido educado, termine com **〜のですが**: __かえて ほしい のですが__ (\"gostaria que trocasse...\"). Em frases do dia a dia, **ほしい** também aparece como pedido gentil, sem **あなた**."
    ],
    "pattern": "[pessoa に] [verbo て] ほしい · [verbo ない] で ほしい",
    "hint": "てほしい: quero que alguém faça.",
    "examples": [
      {
        "id": 1152237,
        "ja": "あなたに歌ってほしい。",
        "furi": "あなたに[歌|うた]ってほしい。",
        "kana": "あなた~に うたって ほしい",
        "pt": "Quero que cantes."
      },
      {
        "id": 142463,
        "ja": "席を替えてほしいのですが。",
        "furi": "[席|せき]を[替|か]えてほしいのですが。",
        "kana": "せき~を かえて ほしい|のですが",
        "pt": "Gostaria de trocar de lugar."
      },
      {
        "id": 9838008,
        "ja": "私と一緒にいてほしいの。",
        "furi": "[私|わたし]と[一緒|いっ|しょ]にいてほしいの。",
        "kana": "わたし~と いっしょ~に いて ほしい~の",
        "pt": "Quero que fiques comigo."
      },
      {
        "id": 78481,
        "ja": "卵をゆでてほしいのです。",
        "furi": "[卵|たまご]をゆでてほしいのです。",
        "kana": "たまご~を ゆでて ほしい|のです",
        "pt": "Eu quero um ovo cozido."
      }
    ]
  },
  {
    "id": "n3-21",
    "title": "Tentar e estar para: 〜ようとする",
    "body": [
      "Com a **forma volitiva** + **とする**, você diz que alguém **tenta** fazer algo (mas o resultado não está garantido) ou que algo **está para** acontecer.",
      {
        "table": [
          [
            "#padrão",
            "#exemplo"
          ],
          [
            "grupo 1: u → ō",
            "__にげる → にげよう__ · __いく → いこう__"
          ],
          [
            "volitiva + と する",
            "__あけよう と する__ (tenta abrir)"
          ],
          [
            "volitiva + と している",
            "__しゅっぱつ しよう と している__ (está para partir)"
          ]
        ]
      },
      "No **ている** o sentido é \"está prestes a\". Não confunda com **〜てみる** (\"experimentar, para ver como é\"): o **ようとする** é um esforço de fazer algo, que pode falhar."
    ],
    "pattern": "[forma volitiva] とする · [forma volitiva] としている",
    "hint": "ようとする: tenta; ようとしている: está para.",
    "examples": [
      {
        "id": 154843,
        "ja": "私は逃げようとした。",
        "furi": "[私|わたし]は[逃|に]げようとした。",
        "kana": "わたし~は にげよう と した",
        "pt": "Tentei escapar."
      },
      {
        "id": 111759,
        "ja": "彼はドアを開けようとした。",
        "furi": "[彼|かれ]はドアを[開|あ]けようとした。",
        "kana": "かれ~は ドア~を あけよう と した",
        "pt": "Ele tentou abrir a porta."
      },
      {
        "id": 157582,
        "ja": "私は曲を覚えようとした。",
        "furi": "[私|わたし]は[曲|きょく]を[覚|おぼ]えようとした。",
        "kana": "わたし~は きょく~を おぼえよう と した",
        "pt": "Tentei aprender a melodia de cor."
      },
      {
        "id": 88749,
        "ja": "彼女は出発しようとしている。",
        "furi": "[彼女|かの|じょ]は[出発|しゅっ|ぱつ]しようとしている。",
        "kana": "かのじょ~は しゅっぱつ しよう と している",
        "pt": "Ela está para partir."
      }
    ]
  },
  {
    "id": "n3-22",
    "title": "Do jeito que: 〜とおり",
    "body": [
      "A palavra **とおり** diz \"**exatamente do jeito que**\". Vem depois de um verbo na forma simples ou de um substantivo com **の**, e pode ser seguida de **に** ou de **だ**.",
      {
        "table": [
          [
            "#padrão",
            "#exemplo"
          ],
          [
            "verbo + とおりに + ação",
            "__いう とおり に して__ (faça como eu digo)"
          ],
          [
            "verbo + とおりだ",
            "__きみ が いう とおりだ__ (é como você diz)"
          ],
          [
            "substantivo + の + とおり",
            "__つぎ の とおり__ (como segue)"
          ],
          [
            "substantivo + どおり",
            "__よてい どおり__ (como planejado)"
          ]
        ]
      },
      "Cuidado: o **とおり** que significa \"rua\" (通り) é outra palavra. Aqui, depois de um verbo, ele quer dizer \"do jeito que\". Depois de um substantivo sem **の**, o som muda para **どおり**."
    ],
    "pattern": "[verbo] とおりに · [verbo] とおりだ · [substantivo] の とおり · [substantivo] どおり",
    "hint": "とおり: exatamente como.",
    "examples": [
      {
        "id": 3491589,
        "ja": "言うとおりにして。",
        "furi": "[言|い]うとおりにして。",
        "kana": "いう とおり に して",
        "pt": "Faça assim como lhe digo."
      },
      {
        "id": 117604,
        "ja": "彼の言うとおりだと思う。",
        "furi": "[彼|かれ]の[言|い]うとおりだと[思|おも]う。",
        "kana": "かれ~の いう とおりだ と おもう",
        "pt": "Acho que ele tem razão."
      },
      {
        "id": 140889,
        "ja": "全く君が言うとおりだ。",
        "furi": "[全|まった]く[君|きみ]が[言|い]うとおりだ。",
        "kana": "まったく きみ~が いう とおりだ",
        "pt": "Você tem toda a razão."
      },
      {
        "id": 117602,
        "ja": "彼の言うとおりにしなさい。",
        "furi": "[彼|かれ]の[言|い]うとおりにしなさい。",
        "kana": "かれ~の いう とおり に しなさい",
        "pt": "Faz como ele te diz."
      }
    ]
  },
  {
    "id": "n3-23",
    "title": "Toda vez que: 〜たびに e 〜ごとに",
    "body": [
      "As duas expressões dizem \"a cada\". O **たびに** vem depois de um verbo (forma de dicionário) ou de um substantivo com **の**: \"toda vez que...\". O **ごとに** vem depois de um substantivo de tempo: \"a cada dia, a cada três dias\".",
      {
        "table": [
          [
            "#padrão",
            "#exemplo"
          ],
          [
            "verbo (dicionário) + たびに",
            "__みる たび に なく__ (choro toda vez que vejo)"
          ],
          [
            "período + ごとに",
            "__ひ ごと に__ (a cada dia, dia após dia)"
          ],
          [
            "número + período + ごとに",
            "__みっか ごと に__ (a cada três dias)"
          ]
        ]
      },
      "Com **ごとに** e uma mudança (\"fica mais quente\", \"melhora\"), o sentido é de **progresso**: \"dia após dia\". O **たびに** é o que se repete toda vez que algo acontece."
    ],
    "pattern": "[verbo] たびに · [período] ごとに",
    "hint": "たびに: toda vez que; ごとに: a cada.",
    "examples": [
      {
        "id": 122929,
        "ja": "日ごとに暖かくなっている。",
        "furi": "[日|ひ]ごとに[暖|あたた]かくなっている。",
        "kana": "ひごと に あたたかく なっている",
        "pt": "Está ficando mais quente dia após dia."
      },
      {
        "id": 101500,
        "ja": "彼は日ごとによくなってきている。",
        "furi": "[彼|かれ]は[日|ひ]ごとによくなってきている。",
        "kana": "かれ~は ひごと に よく なってきている",
        "pt": "Ele está melhorando dia após dia."
      },
      {
        "id": 1780326,
        "ja": "この映画を見るたびに泣く。",
        "furi": "この[映画|えい|が]を[見|み]るたびに[泣|な]く。",
        "kana": "この えいが~を みる たび に なく",
        "pt": "Eu choro toda vez que assisto a este filme."
      }
    ]
  },
  {
    "id": "n3-24",
    "title": "Como e para que: 〜ように",
    "body": [
      "O **ように** tem quatro usos que aparecem o tempo todo: \"**como**\" (comparação), \"**do jeito que**\", \"**para que**\" (um desejo ou aviso) e \"**como quiser**\".",
      {
        "table": [
          [
            "#padrão",
            "#exemplo"
          ],
          [
            "substantivo + の + ように",
            "__ゆき の ように しろい__ (branco como a neve)"
          ],
          [
            "verbo (た) + ように",
            "__いわれた ように せよ__ (faça como lhe dizem)"
          ],
          [
            "verbo ない + ように",
            "__ころばない ように__ (para não cair)"
          ],
          [
            "adjetivo な + ように",
            "__すきな ように__ (como quiser)"
          ]
        ]
      },
      "Com **ないように** (ou o verbo de dicionário) você pede, deseja ou avisa algo: __ふとらない ように__ (\"não engorde\"). Isso é diferente de **〜ようになる** (\"passar a fazer\"), que você viu no N4."
    ],
    "pattern": "[substantivo] の ように · [verbo] ように · [verbo ない] ように",
    "hint": "ように: como, do jeito que, para que.",
    "examples": [
      {
        "id": 141991,
        "ja": "雪のように白い。",
        "furi": "[雪|ゆき]のように[白|しろ]い。",
        "kana": "ゆき~の よう に しろい",
        "pt": "É branco como a neve."
      },
      {
        "id": 174746,
        "ja": "言われたようにせよ。",
        "furi": "[言|い]われたようにせよ。",
        "kana": "いわれた よう に せよ",
        "pt": "Faça como lhe dizem."
      },
      {
        "id": 3241561,
        "ja": "転ばないようにね。",
        "furi": "[転|ころ]ばないようにね。",
        "kana": "ころばない よう に~ね",
        "pt": "Cuidado para não cair!"
      },
      {
        "id": 8531386,
        "ja": "お好きなように。",
        "furi": "お[好|す]きなように。",
        "kana": "お すきな よう に",
        "pt": "Faça como quiser."
      }
    ]
  },
  {
    "id": "n3-25",
    "title": "Não precisa e nunca: 〜ことはない",
    "body": [
      "O **ことはない** nega a coisa toda, e o sentido muda com o verbo antes dele. Com o verbo na **forma de dicionário**, quer dizer \"não há necessidade de\". Com a forma **た**, quer dizer \"nunca fiz\".",
      {
        "table": [
          [
            "#padrão",
            "#exemplo"
          ],
          [
            "dicionário + ことはない",
            "__こわがる こと は ない__ (não há por que temer)"
          ],
          [
            "た + ことはない",
            "__あった こと は ない__ (nunca encontrei)"
          ],
          [
            "expressão fixa",
            "__たいした こと は ない__ (não é nada demais)"
          ]
        ]
      },
      "Na frase \"nunca fiz\", o mais comum é **〜たことがない**. O **ことはない** deixa a frase mais enfática, como numa resposta: \"não, nunca\"."
    ],
    "pattern": "[dicionário] ことはない · [た] ことはない",
    "hint": "ことはない: não precisa; ou nunca.",
    "examples": [
      {
        "id": 187663,
        "ja": "何も怖がることはない。",
        "furi": "[何|なに]も[怖|こわ]がることはない。",
        "kana": "なに~も こわがる こと~は ない",
        "pt": "Não há o que temer."
      },
      {
        "id": 187667,
        "ja": "何も心配することはない。",
        "furi": "[何|なに]も[心配|しん|ぱい]することはない。",
        "kana": "なに~も しんぱい する こと~は ない",
        "pt": "Não há nada com que se preocupar."
      },
      {
        "id": 162165,
        "ja": "私は彼女に会ったことはない。",
        "furi": "[私|わたし]は[彼女|かの|じょ]に[会|あ]ったことはない。",
        "kana": "わたし~は かのじょ~に あった こと~は ない",
        "pt": "Nunca a conheci."
      },
      {
        "id": 137692,
        "ja": "大したことはないよ。",
        "furi": "[大|たい]したことはないよ。",
        "kana": "たいした こと~は ない~よ",
        "pt": "Não é nada sério."
      }
    ]
  },
  {
    "id": "n3-26",
    "title": "É assim mesmo: 〜ものだ",
    "body": [
      "O **ものだ** tem dois usos. O primeiro diz como as coisas **são por natureza** ou como **devem ser**: \"promessas se cumprem\", \"acidentes acontecem\". O segundo, junto de **〜たい**, mostra um **desejo forte**: \"como eu gostaria de...\".",
      {
        "table": [
          [
            "#padrão",
            "#exemplo"
          ],
          [
            "dicionário + ものだ",
            "__まもる ものだ__ (é para ser cumprido)"
          ],
          [
            "dicionário + ものだ",
            "__おこる ものだ__ (acontece)"
          ],
          [
            "〜たい + ものだ",
            "__あいたい ものだ__ (como eu gostaria de ver)"
          ]
        ]
      },
      "Não confunda **ものだ** com **のもの** de \"pertence a\": __あの いえ は わたし の もの だ__ (\"aquela casa é minha\"). Naquele caso, **もの** é uma \"coisa\"."
    ],
    "pattern": "[dicionário] ものだ · [〜たい] ものだ",
    "hint": "ものだ: é assim mesmo; gostaria muito.",
    "examples": [
      {
        "id": 79533,
        "ja": "約束は守るものだよ。",
        "furi": "[約束|やく|そく]は[守|まも]るものだよ。",
        "kana": "やくそく~は まもる ものだ~よ",
        "pt": "Promessas devem ser mantidas."
      },
      {
        "id": 150823,
        "ja": "事故は起こるものだ。",
        "furi": "[事故|じ|こ]は[起|お]こるものだ。",
        "kana": "じこ~は おこる ものだ",
        "pt": "Acidentes acontecem."
      },
      {
        "id": 78245,
        "ja": "留学したいものだ。",
        "furi": "[留学|りゅう|がく]したいものだ。",
        "kana": "りゅうがく したい ものだ",
        "pt": "Eu quero estudar no exterior."
      },
      {
        "id": 118661,
        "ja": "彼に会いたいものだ。",
        "furi": "[彼|かれ]に[会|あ]いたいものだ。",
        "kana": "かれ~に あいたい ものだ",
        "pt": "Gostaria de me encontrar com ele."
      }
    ]
  },
  {
    "id": "n3-27",
    "title": "Cheio de: 〜だらけ",
    "body": [
      "O **だらけ** vem depois de um substantivo e quer dizer \"**cheio de, coberto de**\". Quase sempre fala de algo **indesejado**: lama, sujeira, erros.",
      {
        "table": [
          [
            "#padrão",
            "#exemplo"
          ],
          [
            "substantivo + だらけ",
            "__どろ だらけ__ (coberto de lama)"
          ],
          [
            "substantivo + だらけ",
            "__らくがき だらけ__ (cheio de pichações)"
          ],
          [
            "substantivo + だらけの + substantivo",
            "__まちがい だらけ の ぶんしょう__ (um texto cheio de erros)"
          ]
        ]
      },
      "Para coisas boas, o japonês não usa **だらけ**: dizemos __いっぱい__ ou outra palavra. Quem ouve **だらけ** já entende que o que está cobrindo a coisa é ruim."
    ],
    "pattern": "[substantivo] だらけ",
    "hint": "だらけ: cheio de (algo ruim).",
    "examples": [
      {
        "id": 101972,
        "ja": "彼は泥だらけだった。",
        "furi": "[彼|かれ]は[泥|どろ]だらけだった。",
        "kana": "かれ~は どろ だらけだった",
        "pt": "Ele estava coberto de lama."
      },
      {
        "id": 10212624,
        "ja": "壁は落書きだらけです。",
        "furi": "[壁|かべ]は[落書|らく|が]きだらけです。",
        "kana": "かべ~は らくがき だらけ|です",
        "pt": "O muro está coberto de grafites."
      },
      {
        "id": 230972,
        "ja": "あの子はあかだらけだ。",
        "furi": "あの[子|こ]はあかだらけだ。",
        "kana": "あの こ~は あか だらけだ",
        "pt": "A criança está suja."
      }
    ]
  },
  {
    "id": "n3-28",
    "title": "Para mim, para você: 〜にとって",
    "body": [
      "O **にとって** mostra de **quem é o ponto de vista**: \"para as pessoas\", \"para mim\". Vem depois da pessoa ou da coisa, e a frase termina com uma **avaliação** (importante, necessário, estranho, difícil).",
      {
        "table": [
          [
            "#padrão",
            "#exemplo"
          ],
          [
            "pessoa + にとって",
            "__にんげん にとって たいせつだ__ (é importante para as pessoas)"
          ],
          [
            "pessoa + にとっては",
            "__わたし にとって は おかしい__ (para mim é estranho)"
          ],
          [
            "coisa + にとって",
            "__りょうり にとって ひつようだ__ (é necessário para a culinária)"
          ]
        ]
      },
      "Não é o \"para\" de **receber** algo (aí se usa **に**) nem o de **objetivo** (**〜のために**). O **にとって** só pede um julgamento."
    ],
    "pattern": "[pessoa/coisa] にとって [avaliação]",
    "hint": "にとって: do ponto de vista de, para.",
    "examples": [
      {
        "id": 143754,
        "ja": "水は人間にとって大切だ。",
        "furi": "[水|みず]は[人間|にん|げん]にとって[大切|たい|せつ]だ。",
        "kana": "みず~は にんげん にとって たいせつだ",
        "pt": "A água é importante para as pessoas."
      },
      {
        "id": 188602,
        "ja": "塩は料理にとって必要な物だ。",
        "furi": "[塩|しお]は[料理|りょう|り]にとって[必要|ひつ|よう]な[物|もの]だ。",
        "kana": "しお~は りょうり にとって ひつような ものだ",
        "pt": "O sal é necessário para cozinhar."
      },
      {
        "id": 602868,
        "ja": "私にとっては少しおかしいです。",
        "furi": "[私|わたし]にとっては[少|すこ]しおかしいです。",
        "kana": "わたし にとって~は すこし おかしい|です",
        "pt": "É um pouco estranho para mim."
      },
      {
        "id": 205147,
        "ja": "それは私にとって意外な話だった。",
        "furi": "それは[私|わたし]にとって[意外|い|がい]な[話|はなし]だった。",
        "kana": "それ~は わたし にとって いがいな はなしだった",
        "pt": "Isto foi uma revelação para mim."
      }
    ]
  },
  {
    "id": "n3-29",
    "title": "Não dá para não: 〜ずにはいられない",
    "body": [
      "O **〜ずにはいられない** diz que a pessoa **não consegue evitar** algo: rir, chorar, pensar. Vem a **forma ない sem o ない** + **ずにはいられない**; com **する**, vira __せずには__.",
      {
        "table": [
          [
            "#padrão",
            "#exemplo"
          ],
          [
            "verbo (sem ない) + ずにはいられない",
            "__なか ずには いられない__ (não consigo evitar chorar)"
          ],
          [
            "verbo (sem ない) + ずにはいられない",
            "__わらわ ずには いられない__ (não dá para não rir)"
          ],
          [
            "する → せずには",
            "__しんぱい せずには いられない__ (não consigo deixar de me preocupar)"
          ]
        ]
      },
      "É uma reação **do coração**, um impulso, e não uma obrigação. Não use para o que se **deve** fazer (aí é __〜なければならない__)."
    ],
    "pattern": "[verbo, forma ない sem ない] ずにはいられない",
    "hint": "ずにはいられない: não consigo evitar.",
    "examples": [
      {
        "id": 10946675,
        "ja": "泣かずにはいられないよ。",
        "furi": "[泣|な]かずにはいられないよ。",
        "kana": "なかず に~は いられない~よ",
        "pt": "Não posso evitar o choro."
      },
      {
        "id": 204561,
        "ja": "それを笑わずにはいられない。",
        "furi": "それを[笑|わら]わずにはいられない。",
        "kana": "それ~を わらわず に~は いられない",
        "pt": "Não tem como não rir disso."
      },
      {
        "id": 160448,
        "ja": "私はそう思わずにはいられない。",
        "furi": "[私|わたし]はそう[思|おも]わずにはいられない。",
        "kana": "わたし~は そう おもわず に~は いられない",
        "pt": "Não consigo deixar de pensar que é de facto esse o caso."
      }
    ]
  },
  {
    "id": "n3-30",
    "title": "Além de e exceto: 〜のほか e ほかに",
    "body": [
      "A palavra **ほか** (também escrita 他) quer dizer \"**outro**\" e \"**além de**\". Ela aparece em três usos comuns.",
      {
        "table": [
          [
            "#padrão",
            "#exemplo"
          ],
          [
            "ほかの + substantivo",
            "__ほかの を みせて ください__ (mostre outro)"
          ],
          [
            "A の ほかは B",
            "__にちようび の ほかは はたらく__ (trabalho todos os dias, menos domingo)"
          ],
          [
            "ほかに + frase",
            "__ほかに いたい ところは ありますか__ (dói em mais algum lugar?)"
          ]
        ]
      },
      "O **〜のほかは** costuma levar uma frase de **exceção** (\"exceto\"). O **ほかに** soma mais coisas (\"além disso, mais\")."
    ],
    "pattern": "ほかの [substantivo] · [A] のほかは [B] · ほかに [frase]",
    "hint": "ほか: outro, além de, exceto.",
    "examples": [
      {
        "id": 196433,
        "ja": "ほかのを見せてください。",
        "furi": "ほかのを[見|み]せてください。",
        "kana": "ほか~の~を みせて ください",
        "pt": "Por favor me mostre outro."
      },
      {
        "id": 154677,
        "ja": "私は日曜日のほかは毎日働く。",
        "furi": "[私|わたし]は[日曜日|にち|よう|び]のほかは[毎日|まい|にち][働|はたら]く。",
        "kana": "わたし~は にちようび~の ほか~は まいにち はたらく",
        "pt": "Eu trabalho todos os dias, exceto domingo."
      },
      {
        "id": 196436,
        "ja": "ほかに痛いところはありますか。",
        "furi": "ほかに[痛|いた]いところはありますか。",
        "kana": "ほか~に いたい ところ~は あります~か",
        "pt": "Você sente dor em alguma outra parte de seu corpo?"
      }
    ]
  },
  {
    "id": "n3-31",
    "title": "Que...! e \"uma coisa como\": 〜なんて",
    "body": [
      "O **なんて** tem dois usos. O primeiro é uma **exclamação**: \"**que** bonito!\". Vem antes de um adjetivo, e a frase termina com __のだろう__, __んだ__ ou __なの__. O segundo é falar de algo com **desdém ou surpresa**: \"uma coisa como a vida sem você\", \"apetite, nem pensar\".",
      {
        "table": [
          [
            "#padrão",
            "#exemplo"
          ],
          [
            "なんて + adjetivo + のだろう",
            "__かれ は なんて おおきい のだろう__ (como ele é alto!)"
          ],
          [
            "なんて + adjetivo + んだ",
            "__きみ は なんて しんせつな んだ__ (como você é gentil!)"
          ],
          [
            "substantivo + なんて + negativo",
            "__しょくよく なんて ありません__ (apetite? nenhum)"
          ]
        ]
      },
      "Atenção: __なんて いったの__ (\"o que ele disse?\") é outra coisa: aí **なんて** quer dizer \"o quê\". E o **なんて** de desdém soa informal e pode ser grosseiro com quem ouve."
    ],
    "pattern": "なんて [adjetivo] のだろう · [substantivo] なんて [negativo]",
    "hint": "なんて: que...! ou uma coisa como...",
    "examples": [
      {
        "id": 111389,
        "ja": "彼はなんて大きいのだろう。",
        "furi": "[彼|かれ]はなんて[大|おお]きいのだろう。",
        "kana": "かれ~は なんて おおきい のだろう",
        "pt": "Como ele é alto!"
      },
      {
        "id": 177591,
        "ja": "君はなんて親切なんだ。",
        "furi": "[君|きみ]はなんて[親切|しん|せつ]なんだ。",
        "kana": "きみ~は なんて しんせつな んだ",
        "pt": "Como você é gentil!"
      },
      {
        "id": 145768,
        "ja": "食欲なんてありません。",
        "furi": "[食欲|しょく|よく]なんてありません。",
        "kana": "しょくよく なんて ありません",
        "pt": "Estou sem apetite."
      },
      {
        "id": 178728,
        "ja": "君なしの生活なんて考えられない。",
        "furi": "[君|きみ]なしの[生活|せい|かつ]なんて[考|かんが]えられない。",
        "kana": "きみ なし~の せいかつ なんて かんがえられない",
        "pt": "Não consigo pensar na vida sem você."
      }
    ]
  }
];
