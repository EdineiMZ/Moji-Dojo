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
    examples: [
      { id: 9740661, ja: '私は猫ではありません。', kana: 'わたし~は ねこ~では|ありません', pt: 'Eu não sou um gato.' },
      { id: 1193930, ja: '私は医者ではありません。', kana: 'わたし~は いしゃ~では|ありません', pt: 'Eu não sou doutor.' },
      { id: 12055984, ja: 'ミスでした。', kana: 'ミス|でした', pt: 'Foi um erro.' },
      { id: 10081492, ja: '空腹ではありませんでした。', kana: 'くうふく~では|ありません|でした', pt: 'Eu não estava com fome.' },
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
    examples: [
      { id: 1019460, ja: 'これは高くないです。', kana: 'これ~は たかくない|です', pt: 'Isso não é caro.' },
      { id: 10901764, ja: 'きょうは寒くないです。', kana: 'きょう~は さむくない|です', pt: 'Não está frio hoje.' },
      { id: 11643291, ja: '美味しかったです。', kana: 'おいしかった|です', pt: 'Estava delicioso.' },
      { id: 184159, ja: '楽しかったですか。', kana: 'たのしかった|です~か', pt: 'Você se divertiu?' },
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
    examples: [
      { id: 1216866, ja: '勉強は好きではありません。', kana: 'べんきょう~は すき~では|ありません', pt: 'Não gosto de estudar.' },
      { id: 4002000, ja: 'サラダは好きではありません。', kana: 'サラダ~は すき~では|ありません', pt: 'Eu não gosto de salada.' },
      { id: 338057, ja: 'この町は昔きれいでした。', kana: 'この まち~は むかし きれい|でした', pt: 'Antigamente, esta cidade era linda.' },
      { id: 2128256, ja: 'その夜は大変静かでした。', kana: 'その よる~は たいへん しずか|でした', pt: 'A noite estava muito silenciosa.' },
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
    examples: [
      { id: 170848, ja: '座って下さい。', kana: 'すわって|ください', pt: 'Sente-se, por favor.' },
      { id: 5748800, ja: '英語で話してください。', kana: 'えいご~で はなして|ください', pt: 'Por favor, fale em inglês.' },
      { id: 1039551, ja: '助けてください。', kana: 'たすけて|ください', pt: 'Me ajude, por favor!' },
      { id: 78718, ja: '来て下さい。', kana: 'きて|ください', pt: 'Venha, por favor.' },
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
    examples: [
      { id: 11630865, ja: '何をしていますか？', kana: 'なに~を して|います~か', pt: 'O que você está fazendo?' },
      { id: 11512358, ja: '知っていますか？', kana: 'しって|います~か', pt: 'Você sabe?' },
      { id: 123257, ja: '曇っています。', kana: 'くもって|います', pt: 'Está nublado.' },
      { id: 5955826, ja: '持っています。', kana: 'もって|います', pt: 'Eu tenho um.' },
    ],
  },
  {
    id: 'g16',
    title: 'Pedir para não fazer: 〜ないでください',
    body: [
      'Para pedir que alguém **não** faça algo, use a forma **ない** do verbo + **で** + **ください**: __いかないで ください__ = por favor, não vá.',
    ],
    pattern: '[verbo na forma ない] で ください',
    examples: [
      { id: 2006378, ja: '行かないでください。', kana: 'いかないで|ください', pt: 'Por favor, não vá embora.' },
      { id: 2349145, ja: '心配しないでください。', kana: 'しんぱい しないで|ください', pt: 'Não te preocupes.' },
      { id: 123791, ja: '動かないでください。', kana: 'うごかないで|ください', pt: 'Não se mexa, por favor.' },
      { id: 5845217, ja: '音を立てないでください。', kana: 'おと~を たてないで|ください', pt: 'Não faça barulho.' },
    ],
  },
  {
    id: 'g17',
    title: 'Pedir permissão: 〜てもいいですか',
    body: [
      'Forma **て** + **も** + **いいですか** quer dizer "posso...?". Para dar permissão, responda __はい、いいですよ__. Uma recusa suave é __ちょっと…__ (um pouco difícil).',
    ],
    pattern: '[verbo na forma て] も いいですか',
    examples: [
      { id: 4147428, ja: '入ってもいいですか？', kana: 'はいって~も|いい|です~か', pt: 'Posso entrar?' },
      { id: 2242416, ja: '食べてもいいですか？', kana: 'たべて~も|いい|です~か', pt: 'Posso comer?' },
      { id: 10899008, ja: '窓を開けてもいいですか？', kana: 'まど~を あけて~も|いい|です~か', pt: 'Posso abrir a janela?' },
      { id: 2040852, ja: '座ってもいいですか。', kana: 'すわって~も|いい|です~か', pt: 'Posso sentar?' },
    ],
  },
  {
    id: 'g18',
    title: 'Proibir: 〜てはいけません',
    body: [
      'Forma **て** + **は** + **いけません** quer dizer "não pode" ou "não deve". É a proibição direta, de regra ou de aviso. Aqui o **は** lê-se "wa".',
    ],
    pattern: '[verbo na forma て] は いけません',
    examples: [
      { id: 741581, ja: '食べてはいけません。', kana: 'たべて~は|いけません', pt: 'Não coma.' },
      { id: 201956, ja: 'テレビを見てはいけません。', kana: 'テレビ~を みて~は|いけません', pt: 'Não assista televisão.' },
      { id: 201775, ja: 'ドアを閉めてはいけません。', kana: 'ドア~を しめて~は|いけません', pt: 'Não feche a porta!' },
      { id: 213581, ja: 'そこへ行ってはいけません。', kana: 'そこ~へ いって~は|いけません', pt: 'Não vá para lá.' },
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
    examples: [
      { id: 10631584, ja: '戻りましょう。', kana: 'もどりましょう', pt: 'Vamos voltar.' },
      { id: 442923, ja: '始めましょう。', kana: 'はじめましょう', pt: 'Vamos começar.' },
      { id: 170842, ja: '座りませんか。', kana: 'すわりません~か', pt: 'Você não quer se sentar?' },
      { id: 140285, ja: '走りませんか。', kana: 'はしりません~か', pt: 'Que tal corrida?' },
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
    examples: [
      { id: 143813, ja: '水が欲しい。', kana: 'みず~が ほしい', pt: 'Quero água.' },
      { id: 5272, ja: '飴がほしい。', kana: 'あめ~が ほしい', pt: 'Eu quero uma bala.' },
      { id: 3552884, ja: '何が欲しいの？', kana: 'なに~が ほしい~の', pt: 'O que você quer?' },
      { id: 11776723, ja: '彼女が欲しい。', kana: 'かのじょ~が ほしい', pt: 'Eu quero uma namorada.' },
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
    examples: [
      { id: 625254, ja: '中国は日本より大きいです。', kana: 'ちゅうごく~は にほん~より おおきい|です', pt: 'A China é maior que o Japão.' },
      { id: 157401, ja: '私は君より背が高い。', kana: 'わたし~は きみ~より せ~が たかい', pt: 'Sou mais alto que você.' },
      { id: 179732, ja: '金は銀より重い。', kana: 'きん~は ぎん~より おもい', pt: 'O ouro é mais pesado do que a prata.' },
      { id: 12412206, ja: 'こっちの方が安いよ。', kana: 'こっち~の ほう~が やすい~よ', pt: 'Este aqui é mais barato.' },
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
    examples: [
      { id: 2626290, ja: 'トムが一番強い。', kana: 'トム~が いちばん つよい', pt: 'Tom é o mais forte.' },
      { id: 10625858, ja: '私が一番若いです。', kana: 'わたし~が いちばん わかい|です', pt: 'Sou o mais jovem.' },
      { id: 10366825, ja: '何曜日が一番好き？', kana: 'なんようび~が いちばん すき', pt: 'Qual é o seu dia da semana favorito?' },
      { id: 9644550, ja: 'どの教科が一番好き？', kana: 'どの きょうか~が いちばん すき', pt: 'De que matéria você gosta mais?' },
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
    examples: [
      { id: 354378, ja: '猫が好きです。', kana: 'ねこ~が すき|です', pt: 'Eu gosto de gatos.' },
      { id: 13254283, ja: '音楽が好きです。', kana: 'おんがく~が すき|です', pt: 'Eu gosto de música.' },
      { id: 3347455, ja: '犬が好きですか？', kana: 'いぬ~が すき|です~か', pt: 'Você gosta de cães?' },
      { id: 10194978, ja: '勉強が好きです。', kana: 'べんきょう~が すき|です', pt: 'Eu gosto de estudar.' },
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
    examples: [
      { id: 2672966, ja: '中国から来ました。', kana: 'ちゅうごく~から きました', pt: 'Eu vim da China.' },
      { id: 5323, ja: 'どこから来ましたか？', kana: 'どこ~から きました~か', pt: 'De onde é você?' },
      { id: 11029605, ja: '授業は10時からです。', kana: 'じゅぎょう~は じゅうじ~から|です', pt: 'A nossa aula começa às 10h.' },
      { id: 10967392, ja: '二時半まで待ちます。', kana: 'にじはん~まで まちます', pt: 'Eu irei esperar até 2:30.' },
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
    examples: [
      { id: 9755700, ja: '寒いから、窓閉めてもいい？', kana: 'さむい~から まど しめて~も|いい', pt: 'Estou com frio. Posso fechar a janela?' },
      { id: 9199895, ja: '眠いから、寝るね。', kana: 'ねむい~から ねる~ね', pt: 'Eu estou com sono, então estou indo para a cama.' },
      { id: 1700213, ja: '法律ですから。', kana: 'ほうりつ|です~から', pt: 'É a lei.' },
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
    examples: [
      { id: 187577, ja: '何を飲みますか。', kana: 'なに~を のみます~か', pt: 'O que você quer beber?' },
      { id: 347338, ja: '彼は誰ですか。', kana: 'かれ~は だれ|です~か', pt: 'Quem é ele?' },
      { id: 8532899, ja: '台所はどこ？', kana: 'だいどころ~は どこ', pt: 'Onde fica a cozinha?' },
      { id: 432825, ja: 'これはいくらですか。', kana: 'これ~は いくら|です~か', pt: 'Quanto custa isto?' },
      { id: 2412106, ja: 'いま何時ですか？', kana: 'いま なんじ|です~か', pt: 'Que horas são?' },
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
    examples: [
      { id: 13218484, ja: 'もう食べましたか？', kana: 'もう たべました~か', pt: 'Você já comeu?' },
      { id: 2969830, ja: 'もう食べました。', kana: 'もう たべました', pt: 'Já comi.' },
      { id: 2701348, ja: 'トムはまだ来てません。', kana: 'トム~は まだ きてません', pt: 'Tom ainda não chegou.' },
      { id: 8733259, ja: 'まだ寒い？', kana: 'まだ さむい', pt: 'Você ainda está com frio?' },
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
    examples: [
      { id: 183436, ja: '机の上に鍵がある。', kana: 'つくえ~の うえ~に かぎ~が ある', pt: 'Tem uma chave na escrivaninha.' },
      { id: 149673, ja: '辞書が机の上にある。', kana: 'じしょ~が つくえ~の うえ~に ある', pt: 'Tem um dicionário em cima da mesa.' },
      { id: 2139043, ja: '犬は家の中にいる。', kana: 'いぬ~は いえ~の なか~に いる', pt: 'O cachorro está na casa.' },
      { id: 5390444, ja: '橋の上に犬がいる。', kana: 'はし~の うえ~に いぬ~が いる', pt: 'Há um cachorro na ponte.' },
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
    examples: [
      { id: 177906, ja: 'いつ暇になりますか？', kana: 'いつ ひま~に なります~か', pt: 'Quando você estará livre?' },
      { id: 9475751, ja: '政治家になりたい。', kana: 'せいじか~に なりたい', pt: 'Quero ser político.' },
      { id: 125811, ja: '鳥になりたいな。', kana: 'とり~に なりたい~な', pt: 'Queria ser um pássaro.' },
      { id: 14007955, ja: '友達になりたいです。', kana: 'ともだち~に なりたい|です', pt: 'Quero que sejamos amigos.' },
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
    examples: [
      { id: 215019, ja: 'スキーができます。', kana: 'スキー~が できます', pt: 'Eu sei esquiar.' },
      { id: 232933, ja: 'テニスができますか。', kana: 'テニス~が できます~か', pt: 'Você joga tênis?' },
      { id: 1799658, ja: '私にはできません。', kana: 'わたし~に~は できません', pt: 'Não posso fazer isso.' },
      { id: 920509, ja: '私も説明できません。', kana: 'わたし~も せつめい できません', pt: 'Eu também não consigo explicar.' },
    ],
  },
];
