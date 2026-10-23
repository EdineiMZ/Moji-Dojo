// Tópicos de gramática N5 além dos 10 do protótipo (g1 a g10).
//
// As explicações são texto próprio, em português. Os exemplos são frases reais do Tatoeba (CC BY 2.0 FR),
// escolhidas pelo id; `ja` é o texto original, `pt` uma das traduções do Tatoeba e `kana` a mesma frase só em
// kana, que o build confere com a leitura do Tatoeba (npm run verify-grammar). Nada de japonês inventado.
//
// Marcação do `kana` (usada para gerar o romaji e a escrita com espaços):
//   espaço   separa palavras na escrita e no romaji (como nos exemplos do app);
//   |        separa só no romaji (です, ます, ください ficam grudados no japonês);
//   ~X       partícula X: vai grudada na palavra e vira uma palavra no romaji (は = wa, を = o, へ = e).
//
// Marcação do texto: **negrito**, __japonês__. Tabela: { table: [[...]] }, célula "#x" = cabeçalho.

export const TOPICS = [
  {
    id: 'g11',
    title: 'です no negativo e no passado: ではありません, でした',
    body: [
      'Você já viu **じゃないです** para negar. Em situações mais formais se usa **ではありません**. O passado de **です** é **でした**, e o negativo do passado é **ではありませんでした**.',
      {
        table: [
          ['#', '#afirmativo', '#negativo'],
          ['#presente', '__です__', '__ではありません__ (ou __じゃないです__)'],
          ['#passado', '__でした__', '__ではありませんでした__ (ou __じゃなかったです__)'],
        ],
      },
      'Vale para substantivos e para adjetivos do tipo **な**. Em **ではありません**, o **は** é a partícula e lê-se "wa".',
    ],
    pattern: '[coisa] ではありません · [coisa] でした · [coisa] ではありませんでした',
    hint: 'Negativo formal: ではありません. Passado: でした.',
    examples: [
      { id: 9740661, ja: '私は猫ではありません。', furi: '[私|わたし]は[猫|ねこ]ではありません。', kana: 'わたし~は ねこ~では|ありません', pt: 'Eu não sou um gato.' },
      { id: 1193930, ja: '私は医者ではありません。', furi: '[私|わたし]は[医者|い|しゃ]ではありません。', kana: 'わたし~は いしゃ~では|ありません', pt: 'Eu não sou doutor.' },
      { id: 12055984, ja: 'ミスでした。', kana: 'ミス|でした', pt: 'Foi um erro.' },
      { id: 10081492, ja: '空腹ではありませんでした。', furi: '[空腹|くう|ふく]ではありませんでした。', kana: 'くうふく~では|ありません|でした', pt: 'Eu não estava com fome.' },
    ],
  },
  {
    id: 'g12',
    title: 'Adjetivos い: negativo e passado',
    body: [
      'O adjetivo do tipo **い** muda no final, e o **です** só deixa a frase educada. Para negar, troque o **い** por **くない**. Para o passado, troque por **かった**.',
      {
        table: [
          ['#', '#afirmativo', '#negativo'],
          ['#presente', '__たかいです__', '__たかくないです__'],
          ['#passado', '__たかかったです__', '__たかくなかったです__'],
        ],
      },
      'Exceção: **いい** (bom) vira **よい** na conjugação: __よくないです__ (não é bom) e __よかったです__ (foi bom).',
    ],
    pattern: 'たかい → たかくないです · たかかったです',
    hint: 'Adjetivo い: troque o い por くない (negativo) ou かった (passado).',
    examples: [
      { id: 1019460, ja: 'これは高くないです。', furi: 'これは[高|たか]くないです。', kana: 'これ~は たかくない|です', pt: 'Isso não é caro.' },
      { id: 10901764, ja: 'きょうは寒くないです。', furi: 'きょうは[寒|さむ]くないです。', kana: 'きょう~は さむくない|です', pt: 'Não está frio hoje.' },
      { id: 11643291, ja: '美味しかったです。', furi: '[美味|おい]しかったです。', kana: 'おいしかった|です', pt: 'Estava delicioso.' },
      { id: 184159, ja: '楽しかったですか。', furi: '[楽|たの]しかったですか。', kana: 'たのしかった|です~か', pt: 'Você se divertiu?' },
    ],
  },
  {
    id: 'g13',
    title: 'Adjetivos な: negativo e passado',
    body: [
      'O adjetivo do tipo **な** não muda. Quem muda é o **です**, igual aos substantivos: __きれいです__ (é bonito), __きれいでした__ (era bonito), __きれいではありません__ (não é bonito).',
      'Cuidado: **きれい** termina em い, mas é do tipo な. O mesmo vale para **すき** (gostar), **ゆうめい** (famoso) e **しずか** (silencioso). Se não dá para trocar o い por くない, é adjetivo な.',
    ],
    pattern: '[adjetivo な] ではありません · [adjetivo な] でした',
    hint: 'Adjetivo な não muda: quem muda é o です (ではありません, でした).',
    examples: [
      { id: 1216866, ja: '勉強は好きではありません。', furi: '[勉強|べん|きょう]は[好|す]きではありません。', kana: 'べんきょう~は すき~では|ありません', pt: 'Não gosto de estudar.' },
      { id: 4002000, ja: 'サラダは好きではありません。', furi: 'サラダは[好|す]きではありません。', kana: 'サラダ~は すき~では|ありません', pt: 'Eu não gosto de salada.' },
      { id: 338057, ja: 'この町は昔きれいでした。', furi: 'この[町|まち]は[昔|むかし]きれいでした。', kana: 'この まち~は むかし きれい|でした', pt: 'Antigamente, esta cidade era linda.' },
      { id: 2128256, ja: 'その夜は大変静かでした。', furi: 'その[夜|よる]は[大変|たい|へん][静|しず]かでした。', kana: 'その よる~は たいへん しずか|でした', pt: 'A noite estava muito silenciosa.' },
    ],
  },
  {
    id: 'g14',
    title: 'Pedir com a forma て: 〜てください',
    body: [
      'A forma **て** do verbo (treine no **Conjugar**) mais **ください** é o pedido educado do dia a dia: __すわって ください__ = sente-se, por favor.',
      'Para pedir uma coisa, e não uma ação, o tópico 8 já mostrou __[coisa] を ください__.',
    ],
    pattern: '[verbo na forma て] ください',
    hint: 'Forma て + ください = pedido educado.',
    examples: [
      { id: 170848, ja: '座って下さい。', furi: '[座|すわ]って[下|くだ]さい。', kana: 'すわって|ください', pt: 'Sente-se, por favor.' },
      { id: 5748800, ja: '英語で話してください。', furi: '[英語|えい|ご]で[話|はな]してください。', kana: 'えいご~で はなして|ください', pt: 'Por favor, fale em inglês.' },
      { id: 1039551, ja: '助けてください。', furi: '[助|たす]けてください。', kana: 'たすけて|ください', pt: 'Me ajude, por favor!' },
      { id: 78718, ja: '来て下さい。', furi: '[来|き]て[下|くだ]さい。', kana: 'きて|ください', pt: 'Venha, por favor.' },
    ],
  },
  {
    id: 'g15',
    title: '〜ています: fazendo agora e estado',
    body: [
      'Forma **て** + **います** tem dois usos. O primeiro é a ação que está acontecendo: __たべています__ = estou comendo.',
      'O segundo é um estado que continua: __もっています__ (tenho), __しっています__ (sei, conheço), __くもっています__ (está nublado), __けっこんしています__ (sou casado).',
      'Atenção: o negativo de __しっています__ (sei) é __しりません__ (não sei), e não __しっていません__.',
    ],
    pattern: '[verbo na forma て] います',
    hint: 'Forma て + います = fazendo agora, ou um estado que continua.',
    examples: [
      { id: 11630865, ja: '何をしていますか？', furi: '[何|なに]をしていますか？', kana: 'なに~を して|います~か', pt: 'O que você está fazendo?' },
      { id: 11512358, ja: '知っていますか？', furi: '[知|し]っていますか？', kana: 'しって|います~か', pt: 'Você sabe?' },
      { id: 123257, ja: '曇っています。', furi: '[曇|くも]っています。', kana: 'くもって|います', pt: 'Está nublado.' },
      { id: 5955826, ja: '持っています。', furi: '[持|も]っています。', kana: 'もって|います', pt: 'Eu tenho um.' },
    ],
  },
  {
    id: 'g16',
    title: 'Pedir para não fazer: 〜ないでください',
    body: [
      'Para pedir que alguém **não** faça algo, use a forma **ない** do verbo + **で** + **ください**: __いかないで ください__ = por favor, não vá.',
    ],
    pattern: '[verbo na forma ない] で ください',
    hint: 'Forma ない + で + ください = por favor, não faça.',
    examples: [
      { id: 2006378, ja: '行かないでください。', furi: '[行|い]かないでください。', kana: 'いかないで|ください', pt: 'Por favor, não vá embora.' },
      { id: 2349145, ja: '心配しないでください。', furi: '[心配|しん|ぱい]しないでください。', kana: 'しんぱい しないで|ください', pt: 'Não te preocupes.' },
      { id: 123791, ja: '動かないでください。', furi: '[動|うご]かないでください。', kana: 'うごかないで|ください', pt: 'Não se mexa, por favor.' },
      { id: 5845217, ja: '音を立てないでください。', furi: '[音|おと]を[立|た]てないでください。', kana: 'おと~を たてないで|ください', pt: 'Não faça barulho.' },
    ],
  },
  {
    id: 'g17',
    title: 'Pedir permissão: 〜てもいいですか',
    body: [
      'Forma **て** + **も** + **いいですか** quer dizer "posso...?". Para dar permissão, responda __はい、いいですよ__. Uma recusa suave é __ちょっと…__ (um pouco difícil).',
    ],
    pattern: '[verbo na forma て] も いいですか',
    hint: 'Forma て + も + いいですか = posso...?',
    examples: [
      { id: 4147428, ja: '入ってもいいですか？', furi: '[入|はい]ってもいいですか？', kana: 'はいって~も|いい|です~か', pt: 'Posso entrar?' },
      { id: 2242416, ja: '食べてもいいですか？', furi: '[食|た]べてもいいですか？', kana: 'たべて~も|いい|です~か', pt: 'Posso comer?' },
      { id: 10899008, ja: '窓を開けてもいいですか？', furi: '[窓|まど]を[開|あ]けてもいいですか？', kana: 'まど~を あけて~も|いい|です~か', pt: 'Posso abrir a janela?' },
      { id: 2040852, ja: '座ってもいいですか。', furi: '[座|すわ]ってもいいですか。', kana: 'すわって~も|いい|です~か', pt: 'Posso sentar?' },
    ],
  },
  {
    id: 'g18',
    title: 'Proibir: 〜てはいけません',
    body: [
      'Forma **て** + **は** + **いけません** quer dizer "não pode" ou "não deve". É a proibição direta, de regra ou de aviso. Aqui o **は** lê-se "wa".',
    ],
    pattern: '[verbo na forma て] は いけません',
    hint: 'Forma て + は + いけません = não pode.',
    examples: [
      { id: 741581, ja: '食べてはいけません。', furi: '[食|た]べてはいけません。', kana: 'たべて~は|いけません', pt: 'Não coma.' },
      { id: 201956, ja: 'テレビを見てはいけません。', furi: 'テレビを[見|み]てはいけません。', kana: 'テレビ~を みて~は|いけません', pt: 'Não assista televisão.' },
      { id: 201775, ja: 'ドアを閉めてはいけません。', furi: 'ドアを[閉|し]めてはいけません。', kana: 'ドア~を しめて~は|いけません', pt: 'Não feche a porta!' },
      { id: 213581, ja: 'そこへ行ってはいけません。', furi: 'そこへ[行|い]ってはいけません。', kana: 'そこ~へ いって~は|いけません', pt: 'Não vá para lá.' },
    ],
  },
  {
    id: 'g19',
    title: 'Convidar: 〜ましょう e 〜ませんか',
    body: [
      'Troque o **ます** por **ましょう** para dizer "vamos...": __たべましょう__ (vamos comer).',
      'Troque por **ませんか** para convidar com mais delicadeza: __いきませんか__ (não quer ir?). A resposta mais comum é __いいですね__ (boa ideia).',
    ],
    pattern: '[verbo sem ます] ましょう · [verbo sem ます] ませんか',
    hint: 'ましょう = vamos; ませんか = não quer...? (convite).',
    examples: [
      { id: 10631584, ja: '戻りましょう。', furi: '[戻|もど]りましょう。', kana: 'もどりましょう', pt: 'Vamos voltar.' },
      { id: 442923, ja: '始めましょう。', furi: '[始|はじ]めましょう。', kana: 'はじめましょう', pt: 'Vamos começar.' },
      { id: 170842, ja: '座りませんか。', furi: '[座|すわ]りませんか。', kana: 'すわりません~か', pt: 'Você não quer se sentar?' },
      { id: 140285, ja: '走りませんか。', furi: '[走|はし]りませんか。', kana: 'はしりません~か', pt: 'Que tal corrida?' },
    ],
  },
  {
    id: 'g20',
    title: 'Querer uma coisa: 〜がほしいです',
    body: [
      'Para querer **uma coisa** use **が ほしい** (polido: __ほしいです__). Para querer **fazer** algo, o tópico 8 mostrou o __たい__.',
      '**ほしい** é um adjetivo do tipo い, então ele muda como os outros: __ほしくないです__ (não quero), __ほしかったです__ (eu queria).',
    ],
    pattern: '[coisa] が ほしいです',
    hint: 'Uma coisa que se quer vem com が + ほしい.',
    examples: [
      { id: 143813, ja: '水が欲しい。', furi: '[水|みず]が[欲|ほ]しい。', kana: 'みず~が ほしい', pt: 'Quero água.' },
      { id: 5272, ja: '飴がほしい。', furi: '[飴|あめ]がほしい。', kana: 'あめ~が ほしい', pt: 'Eu quero uma bala.' },
      { id: 3552884, ja: '何が欲しいの？', furi: '[何|なに]が[欲|ほ]しいの？', kana: 'なに~が ほしい~の', pt: 'O que você quer?' },
      { id: 11776723, ja: '彼女が欲しい。', furi: '[彼女|かの|じょ]が[欲|ほ]しい。', kana: 'かのじょ~が ほしい', pt: 'Eu quero uma namorada.' },
    ],
  },
  {
    id: 'g21',
    title: 'Comparar: より e のほうが',
    body: [
      'Para dizer "A é mais ... que B", o japonês põe **より** depois de B: __A は B より おおきいです__. A coisa com que se compara vem marcada com **より**, e o adjetivo não muda.',
      'Para apontar o lado que ganha, use **のほうが**: __こっちの ほうが やすいです__ = este aqui é mais barato.',
    ],
    pattern: '[A] は [B] より [adjetivo] · [A] のほうが [adjetivo]',
    hint: 'A は B より [adjetivo] = A é mais ... que B.',
    examples: [
      { id: 625254, ja: '中国は日本より大きいです。', furi: '[中国|ちゅう|ごく]は[日本|に|ほん]より[大|おお]きいです。', kana: 'ちゅうごく~は にほん~より おおきい|です', pt: 'A China é maior que o Japão.' },
      { id: 157401, ja: '私は君より背が高い。', furi: '[私|わたし]は[君|きみ]より[背|せ]が[高|たか]い。', kana: 'わたし~は きみ~より せ~が たかい', pt: 'Sou mais alto que você.' },
      { id: 179732, ja: '金は銀より重い。', furi: '[金|きん]は[銀|ぎん]より[重|おも]い。', kana: 'きん~は ぎん~より おもい', pt: 'O ouro é mais pesado do que a prata.' },
      { id: 12412206, ja: 'こっちの方が安いよ。', furi: 'こっちの[方|ほう]が[安|やす]いよ。', kana: 'こっち~の ほう~が やすい~よ', pt: 'Este aqui é mais barato.' },
    ],
  },
  {
    id: 'g22',
    title: 'O mais...: いちばん',
    body: [
      '**いちばん** (literalmente "número um") antes de um adjetivo quer dizer "o mais...": __いちばん つよい__ (o mais forte).',
      'Para escolher dentro de um grupo, use **の なかで**: __にほんりょうりの なかで なにが いちばん すきですか__ (entre as comidas japonesas, de qual você mais gosta?).',
    ],
    pattern: '[coisa] が いちばん [adjetivo]',
    hint: 'いちばん + adjetivo = o mais...',
    examples: [
      { id: 2626290, ja: 'トムが一番強い。', furi: 'トムが[一番|いち|ばん][強|つよ]い。', kana: 'トム~が いちばん つよい', pt: 'Tom é o mais forte.' },
      { id: 10625858, ja: '私が一番若いです。', furi: '[私|わたし]が[一番|いち|ばん][若|わか]いです。', kana: 'わたし~が いちばん わかい|です', pt: 'Sou o mais jovem.' },
      { id: 10366825, ja: '何曜日が一番好き？', furi: '[何|なん][曜日|よう|び]が[一番|いち|ばん][好|す]き？', kana: 'なんようび~が いちばん すき', pt: 'Qual é o seu dia da semana favorito?' },
      { id: 9644550, ja: 'どの教科が一番好き？', furi: 'どの[教科|きょう|か]が[一番|いち|ばん][好|す]き？', kana: 'どの きょうか~が いちばん すき', pt: 'De que matéria você gosta mais?' },
    ],
  },
  {
    id: 'g23',
    title: 'Gostar e ser bom em algo: が すき, が じょうず',
    body: [
      'Com **すき** (gostar), **きらい** (não gostar), **じょうず** (ser bom em) e **へた** (ser ruim em), a coisa de que se fala vem com **が**, e não com **を**: __ねこが すきです__.',
      'Para gostar muito, diga __だいすき__ (adoro). Todos são adjetivos do tipo な.',
    ],
    pattern: '[coisa] が すきです · [coisa] が じょうずです',
    hint: 'Com すき, きらい e じょうず, a coisa vem com が.',
    examples: [
      { id: 354378, ja: '猫が好きです。', furi: '[猫|ねこ]が[好|す]きです。', kana: 'ねこ~が すき|です', pt: 'Eu gosto de gatos.' },
      { id: 13254283, ja: '音楽が好きです。', furi: '[音楽|おん|がく]が[好|す]きです。', kana: 'おんがく~が すき|です', pt: 'Eu gosto de música.' },
      { id: 3347455, ja: '犬が好きですか？', furi: '[犬|いぬ]が[好|す]きですか？', kana: 'いぬ~が すき|です~か', pt: 'Você gosta de cães?' },
      { id: 10194978, ja: '勉強が好きです。', furi: '[勉強|べん|きょう]が[好|す]きです。', kana: 'べんきょう~が すき|です', pt: 'Eu gosto de estudar.' },
    ],
  },
  {
    id: 'g24',
    title: 'De... até...: から e まで',
    body: [
      '**から** quer dizer "a partir de" ou "vindo de", e vale para tempo e para lugar. **まで** quer dizer "até".',
      'Cuidado com **までに**: __ろくじまでに もどります__ é "voltarei **antes das** 6" (um prazo), enquanto __ろくじまで まちます__ é "esperarei **até** as 6" (uma duração).',
    ],
    pattern: '[início] から [fim] まで',
    hint: 'から = a partir de / vindo de. まで = até.',
    examples: [
      { id: 2672966, ja: '中国から来ました。', furi: '[中国|ちゅう|ごく]から[来|き]ました。', kana: 'ちゅうごく~から きました', pt: 'Eu vim da China.' },
      { id: 5323, ja: 'どこから来ましたか？', furi: 'どこから[来|き]ましたか？', kana: 'どこ~から きました~か', pt: 'De onde é você?' },
      { id: 11029605, ja: '授業は10時からです。', furi: '[授業|じゅ|ぎょう]は[10|じゅう][時|じ]からです。', kana: 'じゅぎょう~は じゅうじ~から|です', pt: 'A nossa aula começa às 10h.' },
      { id: 10967392, ja: '二時半まで待ちます。', furi: '[二|に][時半|じ|はん]まで[待|ま]ちます。', kana: 'にじはん~まで まちます', pt: 'Eu irei esperar até 2:30.' },
    ],
  },
  {
    id: 'g25',
    title: 'Dar o motivo: から',
    body: [
      '**から** também quer dizer "porque". Mas a ordem é a inversa da do português: o **motivo** vem primeiro e **から** vai logo depois dele, antes do resultado: __さむいから、まどを しめます__ = como está frio, fecho a janela.',
      'Depois de **です** fica __ですから__ (ou __だから__ entre amigos).',
    ],
    pattern: '[motivo] から、[resultado]',
    hint: 'O motivo vem primeiro, com から no fim dele.',
    examples: [
      { id: 9755700, ja: '寒いから、窓閉めてもいい？', furi: '[寒|さむ]いから、[窓|まど][閉|し]めてもいい？', kana: 'さむい~から まど しめて~も|いい', pt: 'Estou com frio. Posso fechar a janela?' },
      { id: 9199895, ja: '眠いから、寝るね。', furi: '[眠|ねむ]いから、[寝|ね]るね。', kana: 'ねむい~から ねる~ね', pt: 'Eu estou com sono, então estou indo para a cama.' },
      { id: 1700213, ja: '法律ですから。', furi: '[法律|ほう|りつ]ですから。', kana: 'ほうりつ|です~から', pt: 'É a lei.' },
    ],
  },
  {
    id: 'g26',
    title: 'Perguntar: なに, だれ, どこ, いつ, いくら',
    body: [
      'A palavra interrogativa fica **no lugar da resposta**, e a ordem da frase não muda. No fim, **か** transforma em pergunta.',
      {
        table: [
          ['#palavra', '#significa'],
          ['__なに / なん__', 'o quê'],
          ['__だれ__', 'quem'],
          ['__どこ__', 'onde'],
          ['__いつ__', 'quando'],
          ['__いくら__', 'quanto custa'],
          ['__いくつ__', 'quantos (e quantos anos)'],
          ['__なんじ__', 'que horas'],
          ['__どうして__', 'por quê'],
        ],
      },
      'Quando a pergunta é sobre quem faz a ação, use **が**: __だれが きましたか__ (quem veio?).',
    ],
    pattern: '[assunto] は [なに / だれ / どこ / いくら] ですか',
    hint: 'A palavra interrogativa fica no lugar da resposta.',
    examples: [
      { id: 187577, ja: '何を飲みますか。', furi: '[何|なに]を[飲|の]みますか。', kana: 'なに~を のみます~か', pt: 'O que você quer beber?' },
      { id: 347338, ja: '彼は誰ですか。', furi: '[彼|かれ]は[誰|だれ]ですか。', kana: 'かれ~は だれ|です~か', pt: 'Quem é ele?' },
      { id: 8532899, ja: '台所はどこ？', furi: '[台所|だい|どころ]はどこ？', kana: 'だいどころ~は どこ', pt: 'Onde fica a cozinha?' },
      { id: 432825, ja: 'これはいくらですか。', kana: 'これ~は いくら|です~か', pt: 'Quanto custa isto?' },
      { id: 2412106, ja: 'いま何時ですか？', furi: 'いま[何|なん][時|じ]ですか？', kana: 'いま なんじ|です~か', pt: 'Que horas são?' },
    ],
  },
  {
    id: 'g27',
    title: 'Já e ainda: もう e まだ',
    body: [
      '**もう** + verbo no passado quer dizer "já": __もう たべました__ (já comi). Para responder que não, diga __いいえ、まだです__ (ainda não).',
      '**まだ** + afirmativo quer dizer "ainda (continua)": __まだ さむいですか__ (ainda está frio?). **まだ** + negativo quer dizer "ainda não": __まだ きていません__.',
      'Cuidado: **もう** + negativo é "não... mais": __もう たべません__ (não como mais).',
    ],
    pattern: 'もう [verbo no passado] · まだ [verbo / adjetivo]',
    hint: 'もう = já (com passado). まだ = ainda.',
    examples: [
      { id: 13218484, ja: 'もう食べましたか？', furi: 'もう[食|た]べましたか？', kana: 'もう たべました~か', pt: 'Você já comeu?' },
      { id: 2969830, ja: 'もう食べました。', furi: 'もう[食|た]べました。', kana: 'もう たべました', pt: 'Já comi.' },
      { id: 2701348, ja: 'トムはまだ来てません。', furi: 'トムはまだ[来|き]てません。', kana: 'トム~は まだ きてません', pt: 'Tom ainda não chegou.' },
      { id: 8733259, ja: 'まだ寒い？', furi: 'まだ[寒|さむ]い？', kana: 'まだ さむい', pt: 'Você ainda está com frio?' },
    ],
  },
  {
    id: 'g28',
    title: 'Onde está: うえ, した, なか e outras posições',
    body: [
      'Para dizer onde algo está, diga primeiro a **referência**, ligue com **の**, escolha a posição e termine com **に**: __つくえの うえに あります__ (está em cima da mesa).',
      {
        table: [
          ['#posição', '#significa'],
          ['__うえ__', 'em cima'],
          ['__した__', 'embaixo'],
          ['__なか__', 'dentro'],
          ['__まえ__', 'na frente'],
          ['__うしろ__', 'atrás'],
          ['__よこ / となり__', 'ao lado'],
        ],
      },
      'Lembre do tópico 7: **あります** é para coisas e **います** para pessoas e animais. Nos exemplos aparecem **ある** e **いる**, as formas simples (sem educação) dos mesmos verbos.',
    ],
    pattern: '[referência] の [posição] に あります / います',
    hint: '[referência] の [posição] に あります / います.',
    examples: [
      { id: 183436, ja: '机の上に鍵がある。', furi: '[机|つくえ]の[上|うえ]に[鍵|かぎ]がある。', kana: 'つくえ~の うえ~に かぎ~が ある', pt: 'Tem uma chave na escrivaninha.' },
      { id: 149673, ja: '辞書が机の上にある。', furi: '[辞書|じ|しょ]が[机|つくえ]の[上|うえ]にある。', kana: 'じしょ~が つくえ~の うえ~に ある', pt: 'Tem um dicionário em cima da mesa.' },
      { id: 2139043, ja: '犬は家の中にいる。', furi: '[犬|いぬ]は[家|いえ]の[中|なか]にいる。', kana: 'いぬ~は いえ~の なか~に いる', pt: 'O cachorro está na casa.' },
      { id: 5390444, ja: '橋の上に犬がいる。', furi: '[橋|はし]の[上|うえ]に[犬|いぬ]がいる。', kana: 'はし~の うえ~に いぬ~が いる', pt: 'Há um cachorro na ponte.' },
    ],
  },
  {
    id: 'g29',
    title: 'Virar e querer ser: 〜になります, 〜になりたい',
    body: [
      '**に なります** quer dizer "tornar-se", "ficar": __ひまに なります__ (ficar livre). Com adjetivos do tipo **い**, troque o い por **く**: __さむく なります__ (vai ficar frio).',
      '**に なりたい** quer dizer "quero ser": __いしゃに なりたいです__ (quero ser médico).',
    ],
    pattern: '[coisa / adjetivo な] に なります · [adjetivo い] く なります',
    hint: 'に なります = virar. に なりたい = quero ser.',
    examples: [
      { id: 177906, ja: 'いつ暇になりますか？', furi: 'いつ[暇|ひま]になりますか？', kana: 'いつ ひま~に なります~か', pt: 'Quando você estará livre?' },
      { id: 9475751, ja: '政治家になりたい。', furi: '[政治|せい|じ][家|か]になりたい。', kana: 'せいじか~に なりたい', pt: 'Quero ser político.' },
      { id: 125811, ja: '鳥になりたいな。', furi: '[鳥|とり]になりたいな。', kana: 'とり~に なりたい~な', pt: 'Queria ser um pássaro.' },
      { id: 14007955, ja: '友達になりたいです。', furi: '[友達|とも|だち]になりたいです。', kana: 'ともだち~に なりたい|です', pt: 'Quero que sejamos amigos.' },
    ],
  },
  {
    id: 'g30',
    title: 'Saber e conseguir: が できます',
    body: [
      '**できます** quer dizer "consegue" ou "sabe fazer", e o que se sabe fazer vem com **が**: __スキーが できます__ (sei esquiar). O negativo é **できません**.',
      'Com um verbo no lugar do substantivo, junte o verbo no dicionário e __ことが できます__ (assunto que aparece mais tarde no N4). Por enquanto, pratique com substantivos.',
    ],
    pattern: '[coisa] が できます · [coisa] が できません',
    hint: 'O que se sabe fazer vem com が + できます.',
    examples: [
      { id: 215019, ja: 'スキーができます。', kana: 'スキー~が できます', pt: 'Eu sei esquiar.' },
      { id: 232933, ja: 'テニスができますか。', kana: 'テニス~が できます~か', pt: 'Você joga tênis?' },
      { id: 1799658, ja: '私にはできません。', furi: '[私|わたし]にはできません。', kana: 'わたし~に~は できません', pt: 'Não posso fazer isso.' },
      { id: 920509, ja: '私も説明できません。', furi: '[私|わたし]も[説明|せつ|めい]できません。', kana: 'わたし~も せつめい できません', pt: 'Eu também não consigo explicar.' },
    ],
  },
  {
    id: 'g31',
    title: 'Antes de fazer: 〜まえに',
    body: [
      'Para dizer **antes de** fazer algo, use o verbo no **dicionário** (a forma simples, como __ねる__, __いく__) + **まえに**: __ねる まえに__ = antes de dormir. O verbo que vem antes de まえに **não** fica em ます.',
      'A ação principal fica no fim da frase: __いく まえに でんわ します__ (ligo antes de ir).',
    ],
    pattern: '[verbo no dicionário] まえに [ação principal]',
    hint: 'Antes de: verbo no dicionário + まえに (nunca ます).',
    examples: [
      { id: 873959, ja: '彼は寝る前に本を読む。', furi: '[彼|かれ]は[寝|ね]る[前|まえ]に[本|ほん]を[読|よ]む。', kana: 'かれ~は ねる まえ~に ほん~を よむ', pt: 'Ele lê antes de ir para a cama.' },
      { id: 11065768, ja: '行く前に電話します。', furi: '[行|い]く[前|まえ]に[電話|でん|わ]します。', kana: 'いく まえ~に でんわ します', pt: 'Ligarei para ele antes de ir.' },
      { id: 13201627, ja: '来る前に電話をしてください。', furi: '[来|く]る[前|まえ]に[電話|でん|わ]をしてください。', kana: 'くる まえ~に でんわ~を して|ください', pt: 'Por favor, me ligue antes de vir.' },
    ],
  },
  {
    id: 'g32',
    title: 'Depois de fazer: 〜てから e あとで',
    body: [
      'Para dizer **depois de** fazer algo, use a forma **て** do verbo + **から**: __たべてから__ = depois de comer. A ação que vem depois fica no fim da frase.',
      'Com um substantivo, use **の あとで**: __しごとの あとで__ = depois do trabalho. E **あとで** sozinho quer dizer "mais tarde": __あとで でんわ します__.',
    ],
    pattern: '[verbo na forma て] から · [substantivo] の あとで · あとで',
    hint: 'Depois de: forma て + から, ou substantivo + の あとで.',
    examples: [
      { id: 10617667, ja: '食べてから寝たよ。', furi: '[食|た]べてから[寝|ね]たよ。', kana: 'たべてから ねた~よ', pt: 'Depois que nós comemos, fomos dormir.' },
      { id: 11017844, ja: '帰ってから勉強するよ。', furi: '[帰|かえ]ってから[勉強|べん|きょう]するよ。', kana: 'かえってから べんきょう する~よ', pt: 'Vou estudar depois que chegar em casa.' },
      { id: 174334, ja: '後で電話します。', furi: '[後|あと]で[電話|でん|わ]します。', kana: 'あとで でんわ します', pt: 'Te ligo de volta mais tarde.' },
      { id: 169135, ja: '仕事の後で、一杯どう？', furi: '[仕事|し|ごと]の[後|あと]で、[一杯|いっ|ぱい]どう？', kana: 'しごと~の あと~で いっぱい どう', pt: 'E se sairmos para beber após o trabalho?' },
    ],
  },
  {
    id: 'g33',
    title: 'Fazer duas coisas juntas: 〜ながら',
    body: [
      'Quando **a mesma pessoa** faz duas coisas ao mesmo tempo, tire o **ます** do verbo e ponha **ながら**: __たべながら__ = comendo, enquanto come.',
      'A ação principal fica no fim da frase, e a que vem com ながら é a de fundo: __たべながら はなす__ (falar comendo).',
    ],
    pattern: '[verbo sem ます] ながら [ação principal]',
    hint: 'Ao mesmo tempo: radical do verbo (sem ます) + ながら.',
    examples: [
      { id: 11009755, ja: '食べながら話しちゃダメだよ。', furi: '[食|た]べながら[話|はな]しちゃダメだよ。', kana: 'たべながら はなしちゃ ダメ だ~よ', pt: 'Não fale enquanto estiver comendo.' },
      { id: 82874, ja: '母は微笑みながら言いました。', furi: '[母|はは]は[微笑|ほほ|え]みながら[言|い]いました。', kana: 'はは~は ほほえみながら いいました', pt: 'A minha mãe disse isso com um sorriso.' },
      { id: 151284, ja: '私達は歩きながら歌を歌った。', furi: '[私|わたし][達|たち]は[歩|ある]きながら[歌|うた]を[歌|うた]った。', kana: 'わたしたち~は あるきながら うた~を うたった', pt: 'Cantávamos enquanto caminhávamos.' },
      { id: 88812, ja: '彼女は手紙を読みながら泣いた。', furi: '[彼女|かの|じょ]は[手紙|て|がみ]を[読|よ]みながら[泣|な]いた。', kana: 'かのじょ~は てがみ~を よみながら ないた', pt: 'Ela chorava enquanto lia a carta.' },
    ],
  },
  {
    id: 'g34',
    title: 'Ir fazer algo: 〜に いきます',
    body: [
      'Para dizer **ir fazer** algo, tire o **ます** do verbo e ponha **に** + **いきます**: __たべに いきます__ = vou comer. Com uma palavra de ação (compras, filme), é só **に**: __かいものに いきます__.',
      'Serve também com **きます** (vir) e **かえります** (voltar).',
    ],
    pattern: '[verbo sem ます] に いきます · [ação] に いきます',
    hint: 'Ir fazer: radical do verbo (sem ます) + に + いきます.',
    examples: [
      { id: 171179, ja: '今夜、寿司を食べに行きませんか。', furi: '[今夜|こん|や]、[寿司|す|し]を[食|た]べに[行|い]きませんか。', kana: 'こんや すし~を たべ~に いきません~か', pt: 'Você quer comer sushi hoje à noite?' },
      { id: 1299272, ja: '映画を見に行きませんか？', furi: '[映画|えい|が]を[見|み]に[行|い]きませんか？', kana: 'えいが~を み~に いきません~か', pt: 'Por que não vamos ver um filme?' },
      { id: 80265, ja: '明日買い物に行きます。', furi: '[明日|あした][買|か]い[物|もの]に[行|い]きます。', kana: 'あした かいもの~に いきます', pt: 'Amanhã vou fazer compras.' },
      { id: 158658, ja: '私はよく映画を見に行く。', furi: '[私|わたし]はよく[映画|えい|が]を[見|み]に[行|い]く。', kana: 'わたし~は よく えいが~を み~に いく', pt: 'Vou ao cinema com frequência.' },
    ],
  },
  {
    id: 'g35',
    title: 'Com que frequência: いつも, よく, ときどき, あまり, ぜんぜん',
    body: [
      {
        table: [
          ['#palavra', '#quer dizer', '#frase'],
          ['__いつも__', 'sempre', 'afirmativa'],
          ['__よく__', 'muitas vezes', 'afirmativa'],
          ['__ときどき__', 'às vezes', 'afirmativa'],
          ['__あまり__', 'pouco, raramente', 'negativa'],
          ['__ぜんぜん__', 'de jeito nenhum, nunca', 'negativa'],
        ],
      },
      '**あまり** e **ぜんぜん** pedem o final **negativo**: __あまり みえない__, __ぜんぜん わかりません__. O advérbio vem antes do verbo.',
    ],
    pattern: '[いつも / よく / ときどき] verbo · [あまり / ぜんぜん] verbo negativo',
    hint: 'いつも, よく, ときどき com afirmativa; あまり e ぜんぜん com negativa.',
    examples: [
      { id: 150453, ja: '時々ゴルフをします。', furi: '[時々|ときどき]ゴルフをします。', kana: 'ときどき ゴルフ~を します', pt: 'De vez em quando eu jogo golfe.' },
      { id: 8723018, ja: 'いつも忙しいの？', furi: 'いつも[忙|いそが]しいの？', kana: 'いつも いそがしい~の', pt: 'Você está sempre ocupado?' },
      { id: 5157, ja: 'あまり見えない。', furi: 'あまり[見|み]えない。', kana: 'あまり みえない', pt: 'Eu o vejo raramente.' },
      { id: 213984, ja: '全然疲れてません。', furi: '[全然|ぜん|ぜん][疲|つか]れてません。', kana: 'ぜんぜん つかれて|ません', pt: 'Não estou nem um pouco cansado.' },
    ],
  },
  {
    id: 'g36',
    title: 'Oferecer ajuda: 〜ましょうか',
    body: [
      'Além de convidar ("vamos"), **ましょうか** serve para **se oferecer**: tire o ます do verbo e ponha ましょうか. __てつだいましょうか__ = quer que eu ajude? Quem oferece é você; a outra pessoa responde sim ou não.',
      'Também pergunta "vamos?" quando o grupo decide junto: __いきましょうか__.',
    ],
    pattern: '[verbo sem ます] ましょうか',
    hint: 'Quer que eu...?: radical do verbo + ましょうか.',
    examples: [
      { id: 10671567, ja: '何か手伝いましょうか？', furi: '[何|なに]か[手伝|て|つだ]いましょうか？', kana: 'なに~か てつだいましょう~か', pt: 'Posso ajudar com alguma coisa?' },
      { id: 140345, ja: '窓を開けましょうか。', furi: '[窓|まど]を[開|あ]けましょうか。', kana: 'まど~を あけましょう~か', pt: 'Você quer que eu abra a janela?' },
      { id: 227047, ja: 'お手伝いしましょうか。', furi: 'お[手伝|て|つだ]いしましょうか。', kana: 'おてつだい しましょう~か', pt: 'Quer que eu te ajude?' },
      { id: 173392, ja: '行きましょうか。', furi: '[行|い]きましょうか。', kana: 'いきましょう~か', pt: 'Vamos?' },
    ],
  },
  {
    id: 'g37',
    title: 'Só e apenas: だけ',
    body: [
      '**だけ** quer dizer "só", "apenas", e vem logo depois da palavra: __ひとつだけ__ (só um), __これだけ__ (só isto).',
      'Pode vir antes de outra partícula: __それだけで__ (só com isso).',
    ],
    pattern: '[palavra] だけ',
    hint: 'だけ vai depois da palavra e quer dizer só.',
    examples: [
      { id: 3449190, ja: '願いは一つだけ。', furi: '[願|ねが]いは[一|ひと]つだけ。', kana: 'ねがい~は ひとつ だけ', pt: 'Só tenho um desejo.' },
      { id: 205799, ja: 'それだけで結構です。', furi: 'それだけで[結構|けっ|こう]です。', kana: 'それ だけ~で けっこう|です', pt: 'Isso é tudo.' },
      { id: 433715, ja: 'それだけです。', kana: 'それ だけ|です', pt: 'Isso é tudo.' },
    ],
  },
  {
    id: 'g38',
    title: 'Algo e alguém: なにか, だれか, どこか',
    body: [
      'Junte **か** a uma palavra de pergunta e ela vira "algum": __なにか__ (alguma coisa), __だれか__ (alguém), __どこか__ (em algum lugar), __いつか__ (algum dia).',
      'É diferente de perguntar "o quê?": __なにか のむ?__ quer dizer "toma alguma coisa?".',
    ],
    pattern: '[なに / だれ / どこ / いつ] か',
    hint: 'Palavra de pergunta + か = algum(a).',
    examples: [
      { id: 890127, ja: '何か飲む？', furi: '[何|なに]か[飲|の]む？', kana: 'なに~か のむ', pt: 'Quer beber algo?' },
      { id: 2552450, ja: '何か見える？', furi: '[何|なに]か[見|み]える？', kana: 'なに~か みえる', pt: 'Você consegue ver algo?' },
      { id: 137130, ja: '誰かいる？', furi: '[誰|だれ]かいる？', kana: 'だれ~か いる', pt: 'Tem alguém aí?' },
      { id: 11610218, ja: '誰か来る。', furi: '[誰|だれ]か[来|く]る。', kana: 'だれ~か くる', pt: 'Alguém está vindo.' },
    ],
  },
  {
    id: 'g39',
    title: 'Quem faz: a partícula が',
    body: [
      '**が** marca o **sujeito** quando ele é uma informação nova ou o foco da frase. Use **が** em três casos principais:',
      {
        table: [
          ['#caso', '#exemplo'],
          ['Palavra de pergunta é o sujeito', '__だれが__ きましたか (quem veio?)'],
          ['Existir: あります, います', '__ねこが__ います (há um gato)'],
          ['Dizer QUEM faz (e não outra pessoa)', '__わたしが__ いきます (EU vou)'],
        ],
      },
      'Já **は** apresenta o assunto sobre o qual você vai falar ("quanto a mim..."). A resposta de uma pergunta com **だれが** também leva **が**: __だれが きましたか?__ → __たなかさんが きました__.',
    ],
    pattern: '[sujeito] が [verbo] · だれが / なにが ...?',
    hint: 'が: sujeito novo, pergunta com だれ/なに e existência (あります, います).',
    examples: [
      { id: 7551823, ja: '誰が来ましたか？', furi: '[誰|だれ]が[来|き]ましたか？', kana: 'だれ~が きました~か', pt: 'Quem veio?' },
      { id: 1507527, ja: '私が行きます。', furi: '[私|わたし]が[行|い]きます。', kana: 'わたし~が いきます', pt: 'Eu vou.' },
      { id: 11003497, ja: '家の門の前に猫がいます。', furi: '[家|いえ]の[門|もん]の[前|まえ]に[猫|ねこ]がいます。', kana: 'いえ~の もん~の まえ~に ねこ~が います', pt: 'Há um gato na frente do portão.' },
      { id: 3553343, ja: '他に何がありますか。', furi: '[他|ほか]に[何|なに]がありますか。', kana: 'ほか~に なに~が あります~か', pt: 'O que mais você tem?' },
    ],
  },
  {
    id: 'g40',
    title: 'Forma simples: dicionário, ない e た',
    body: [
      'Até aqui os verbos apareceram na forma **educada** (ます). Entre amigos, em família e em textos, o japonês usa a forma **simples**, que é a que aparece no dicionário e nas frases de Tatoeba. São três formas:',
      {
        table: [
          ['#forma', '#educada', '#simples', '#como sai'],
          ['#presente', '__たべます__', '__たべる__', 'dicionário (a forma que você já viu em まえに)'],
          ['#negativa', '__たべません__', '__たべない__', 'a forma ない (veja Conjugar)'],
          ['#passado', '__たべました__', '__たべた__', 'a forma た (veja Conjugar)'],
        ],
      },
      'O sentido é o mesmo; muda o grau de formalidade. Com quem você não conhece, use ます. A forma simples vem também dentro de frases maiores: __いく まえに__ (antes de ir), __たべた あとで__ (depois de comer).',
      'O **です** não entra no verbo simples: __たべる__ já fecha a frase. Para substantivos e adjetivos な a forma simples de です é **だ**.',
    ],
    pattern: '[verbo] る / ない / た (sem ます)',
    hint: 'Simples: dicionário (る), ない (negativo) e た (passado), sem ます nem です.',
    examples: [
      { id: 468677, ja: '雪が降る。', furi: '[雪|ゆき]が[降|ふ]る。', kana: 'ゆき~が ふる', pt: 'Está nevando.' },
      { id: 670057, ja: '風が吹く。', furi: '[風|かぜ]が[吹|ふ]く。', kana: 'かぜ~が ふく', pt: 'O vento sopra.' },
      { id: 155138, ja: '私は知らない。', furi: '[私|わたし]は[知|し]らない。', kana: 'わたし~は しらない', pt: 'Não sei.' },
      { id: 110803, ja: '彼はまだ来ない。', furi: '[彼|かれ]はまだ[来|こ]ない。', kana: 'かれ~は まだ こない', pt: 'Ainda não veio.' },
      { id: 13563699, ja: '私は食べた。', furi: '[私|わたし]は[食|た]べた。', kana: 'わたし~は たべた', pt: 'Eu comi.' },
      { id: 102805, ja: '彼は走った。', furi: '[彼|かれ]は[走|はし]った。', kana: 'かれ~は はしった', pt: 'Ele correu.' },
    ],
  },
  {
    id: 'g41',
    title: 'Dar e receber: あげる, もらう, くれる',
    body: [
      'Há três verbos, e a escolha depende de **quem dá** e **quem recebe**:',
      {
        table: [
          ['#verbo', '#quer dizer', '#partículas'],
          ['__あげる__', 'dar (eu dou, ou alguém dá a outra pessoa)', 'quem recebe + __に__, o que se dá + __を__'],
          ['__もらう__', 'receber (eu recebo)', 'de quem + __に__ ou __から__, o que + __を__'],
          ['__くれる__', 'dar para mim (ou para o meu grupo)', 'quem dá + __が__ ou __は__, eu + __に__, o que + __を__'],
        ],
      },
      'Em português "dar" serve para tudo; em japonês, se a coisa vem **para você**, o verbo é **くれる**, e não あげる. Na forma educada: __あげます__, __もらいます__, __くれます__.',
    ],
    pattern: '[quem recebe] に [coisa] を あげる · [de quem] から [coisa] を もらう · [quem dá] は わたし に [coisa] を くれる',
    hint: 'Eu dou: あげる. Eu recebo: もらう. Alguém me dá: くれる.',
    examples: [
      { id: 152773, ja: '私は妹に辞書をあげた。', furi: '[私|わたし]は[妹|いもうと]に[辞書|じ|しょ]をあげた。', kana: 'わたし~は いもうと~に じしょ~を あげた', pt: 'Eu dei um dicionário à minha irmã.' },
      { id: 119074, ja: '彼に本をあげたの。', furi: '[彼|かれ]に[本|ほん]をあげたの。', kana: 'かれ~に ほん~を あげた~の', pt: 'Eu dei o livro a ele.' },
      { id: 95543, ja: '彼女から手紙をもらった。', furi: '[彼女|かの|じょ]から[手紙|て|がみ]をもらった。', kana: 'かのじょ~から てがみ~を もらった', pt: 'Recebi uma carta dela.' },
      { id: 10744345, ja: 'お父さんにもらったの。', furi: 'お[父|とう]さんにもらったの。', kana: 'おとうさん~に もらった~の', pt: 'Eu ganhei isso do meu pai.' },
      { id: 106065, ja: '彼は私に時計をくれた。', furi: '[彼|かれ]は[私|わたし]に[時計|と|けい]をくれた。', kana: 'かれ~は わたし~に とけい~を くれた', pt: 'Ele me deu um relógio.' },
    ],
  },
];
