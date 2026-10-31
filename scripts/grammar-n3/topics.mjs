// Tópicos de gramática N3 (n3-1 a n3-15: primeira leva).
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
      "É um jeito informal de falar. Em geral dá um tom de crítica ou de impressão, não de elogio: __こども っぽい__ (\"infantil, meio criança\")."
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
  }
];
