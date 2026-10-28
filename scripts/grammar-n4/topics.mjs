// Tópicos de gramática N4 (n4-1 a n4-7: primeira leva; n4-8 a n4-14: segunda leva).
//
// As explicações são texto próprio, em português, ainda sem revisão por um falante. Os exemplos são frases reais do Tatoeba
// (CC BY 2.0 FR), escolhidas pelo id; `ja` é o texto original, `furi` a transcrição do Tatoeba, `pt` uma das traduções do
// Tatoeba e `kana` a mesma frase só em kana (mesma marcação dos tópicos do N5; ver scripts/grammar-n5/topics.mjs).
// Conferência: node scripts/grammar-n5/verify.mjs n4

export const TOPICS = [
  {
    id: 'n4-1',
    title: 'Talvez: 〜かもしれません',
    body: [
      'Para dizer que algo **é possível**, mas não é certo, coloque **かもしれません** (na conversa, **かもしれない**) depois da forma simples da frase. Quer dizer "pode ser que", "talvez".',
      {
        table: [
          ['#o que vem antes', '#exemplo'],
          ['#verbo (forma simples)', '__ふる__ → __ふるかもしれません__'],
          ['#adjetivo い', '__たかい__ → __たかいかもしれません__'],
          ['#adjetivo な ou substantivo (sem だ)', '__あめ__ → __あめかもしれません__'],
        ],
      },
      'É uma chance pequena ou média. Se você tem um bom motivo para esperar algo, use **はず** (veja o tópico sobre ele).',
    ],
    pattern: '[forma simples] かもしれません · [substantivo] かもしれません',
    hint: 'Possibilidade: forma simples + かもしれません.',
    examples: [
      { id: 2684823, ja: '明日は雨かもしれない。', furi: '[明日|あした]は[雨|あめ]かもしれない。', kana: 'あした~は あめ かもしれない', pt: 'Talvez chova amanhã.' },
      { id: 189732, ja: '雨が降るかもしれない。', furi: '[雨|あめ]が[降|ふ]るかもしれない。', kana: 'あめ~が ふる かもしれない', pt: 'Pode chover.' },
      { id: 204854, ja: 'それは本当かもしれない。', furi: 'それは[本当|ほん|とう]かもしれない。', kana: 'それ~は ほんとう かもしれない', pt: 'Pode ser verdade.' },
      { id: 92933, ja: '彼女は来るかもしれない。', furi: '[彼女|かの|じょ]は[来|く]るかもしれない。', kana: 'かのじょ~は くる かもしれない', pt: 'Pode ser que ela venha.' },
    ],
  },
  {
    id: 'n4-2',
    title: 'Decidir: 〜ことにしました',
    body: [
      'Para dizer o que **você decidiu**, use o verbo na forma do dicionário (ou na forma **ない**) e **ことにしました**. Na conversa, **ことにした**.',
      {
        table: [
          ['#', '#afirmativo', '#negativo'],
          ['#decidi', '__まつことにしました__', '__またないことにしました__'],
          ['#decido (agora)', '__まつことにします__', '__またないことにします__'],
        ],
      },
      'Quando a decisão não é sua (uma regra, uma combinação), usa-se **ことになりました**: "ficou decidido que".',
    ],
    pattern: '[verbo: dicionário ou ない] ことにしました',
    hint: 'Decidi fazer: dicionário + ことにしました.',
    examples: [
      { id: 8935237, ja: '待つことにしたよ。', furi: '[待|ま]つことにしたよ。', kana: 'まつ ことにした~よ', pt: 'Eu decidi esperar.' },
      { id: 11831405, ja: '売ることにしたんだ。', furi: '[売|う]ることにしたんだ。', kana: 'うる ことにした|んだ', pt: 'Decidi vendê-lo.' },
      { id: 11852556, ja: '行かないことにしたよ。', furi: '[行|い]かないことにしたよ。', kana: 'いかない ことにした~よ', pt: 'Eu decidi não ir.' },
      { id: 2490824, ja: '仮眠をとることにした。', furi: '[仮眠|か|みん]をとることにした。', kana: 'かみん~を とる ことにした', pt: 'Eu decidi dar uma cochilada.' },
    ],
  },
  {
    id: 'n4-3',
    title: 'Acabar fazendo: 〜てしまいます',
    body: [
      'Com **てしまいます** (passado: **てしまいました**) você diz que algo **acabou acontecendo**, geralmente sem querer ou com pena. Também pode indicar que a ação foi **concluída por completo**.',
      {
        table: [
          ['#forma て', '#com しまう'],
          ['#ねて', '__ねてしまいました__ (acabei dormindo)'],
          ['#わすれて', '__わすれてしまいました__ (esqueci, que pena)'],
        ],
      },
      'Na conversa, **てしまった** costuma virar **ちゃった** (e **でしまった** vira **じゃった**): __ねちゃった__.',
    ],
    pattern: '[verbo forma て] しまいました',
    hint: 'Sem querer ou por completo: forma て + しまいました.',
    examples: [
      { id: 10333259, ja: '寝てしまった。', furi: '[寝|ね]てしまった。', kana: 'ねて しまった', pt: 'Eu adormeci.' },
      { id: 3552079, ja: '捕まってしまった。', furi: '[捕|つか]まってしまった。', kana: 'つかまって しまった', pt: 'Fui capturado.' },
      { id: 11878738, ja: '鏡が割れてしまった。', furi: '[鏡|かがみ]が[割|わ]れてしまった。', kana: 'かがみ~が われて しまった', pt: 'Meu espelho quebrou.' },
      { id: 3480582, ja: '道に迷ってしまった。', furi: '[道|みち]に[迷|まよ]ってしまった。', kana: 'みち~に まよって しまった', pt: 'Estou perdido.' },
    ],
  },
  {
    id: 'n4-4',
    title: 'Deixar feito: 〜ておきます',
    body: [
      'Com **ておきます** você faz algo **de antemão**, para ficar pronto, ou **deixa algo como está**. A forma て do verbo vem antes de **おきます**.',
      {
        table: [
          ['#forma て', '#com おく'],
          ['#かんがえて', '__かんがえておきます__ (vou pensar antes)'],
          ['#あけて', '__あけておきます__ (deixo aberto)'],
        ],
      },
      'Na conversa, **ておく** vira **とく**: __かんがえとく__. Com **べき** (dever), **しっておくべき** quer dizer "convém saber".',
    ],
    pattern: '[verbo forma て] おきます',
    hint: 'De antemão ou deixar como está: forma て + おきます.',
    examples: [
      { id: 173469, ja: '考えておくよ。', furi: '[考|かんが]えておくよ。', kana: 'かんがえて おく~よ', pt: 'Pensarei sobre isso.' },
      { id: 10712752, ja: '魚は生かしておくよ。', furi: '[魚|さかな]は[生|い]かしておくよ。', kana: 'さかな~は いかして おく~よ', pt: 'Vou deixar os peixes vivos.' },
      { id: 79947, ja: '目を開けておくのよ。', furi: '[目|め]を[開|あ]けておくのよ。', kana: 'め~を あけて おく|のよ', pt: 'Mantenha seus olhos abertos.' },
      { id: 1452344, ja: '知っておくべきだよ。', furi: '[知|し]っておくべきだよ。', kana: 'しって おくべき|だよ', pt: 'Você deveria saber isso.' },
    ],
  },
  {
    id: 'n4-5',
    title: 'Deve ser: 〜はずです',
    body: [
      '**はずです** diz que, pelo que você sabe, algo **deve ser assim** ou **era para ser assim**. É mais firme do que **かもしれません**: você tem um motivo.',
      {
        table: [
          ['#o que vem antes', '#exemplo'],
          ['#verbo ou adjetivo い (forma simples)', '__ついている__ → __ついているはずです__'],
          ['#adjetivo な', '__しずか__ → __しずかなはずです__'],
          ['#substantivo', '__せんせい__ → __せんせいのはずです__'],
        ],
      },
      'No passado, o verbo vem no passado: __いったはずです__ ("eu tinha dito", com um tom de reclamação).',
    ],
    pattern: '[forma simples] はずです',
    hint: 'Expectativa com motivo: forma simples + はずです.',
    examples: [
      { id: 110575, ja: '彼はもう着いてるはずだ。', furi: '[彼|かれ]はもう[着|つ]いてるはずだ。', kana: 'かれ~は もう ついてる はず|だ', pt: 'Ele já deveria ter chegado.' },
      { id: 10197580, ja: '全てうまくいくはずだよ。', furi: '[全|すべ]てうまくいくはずだよ。', kana: 'すべて うまく いく はず|だよ', pt: 'Eu aposto que tudo vai dar certo.' },
      { id: 2048906, ja: '寝るように言ったはずだけど。', furi: '[寝|ね]るように[言|い]ったはずだけど。', kana: 'ねる ように いった はず|だけど', pt: 'Pensei que eu tinha mandado você ir dormir.' },
    ],
  },
  {
    id: 'n4-6',
    title: 'A forma passiva: 〜られる',
    body: [
      'Na **forma passiva**, quem sofre a ação vira o assunto, e quem a faz vem com **に**: __せんせいに ほめられた__ ("fui elogiado pelo professor"). Muitas vezes mostra que a ação **incomodou** a pessoa.',
      {
        table: [
          ['#tipo do verbo', '#como fica', '#exemplo'],
          ['#grupo 1 (terminam em う, く, ぐ, す, る...)', 'troca a última sílaba pela do あ + れる', '__しかる__ → __しかられる__'],
          ['#grupo 2 (る depois de い ou え)', 'tira る, põe られる', '__ほめる__ → __ほめられる__'],
          ['#する e くる', 'irregulares', '__する__ → __される__ · __くる__ → __こられる__'],
        ],
      },
      'O passado de **しかられる** é **しかられた**, e o educado é **しかられました**.',
    ],
    pattern: '[quem sofre] は [quem faz] に [verbo passivo]',
    hint: 'Passiva: quem faz vem com に e o verbo termina em れる ou られる.',
    examples: [
      { id: 10592243, ja: '先生に褒められたの？', furi: '[先生|せん|せい]に[褒|ほ]められたの？', kana: 'せんせい~に ほめられた~の', pt: 'Você foi elogiado pelo professor?' },
      { id: 115483, ja: '彼は車にはねられた。', furi: '[彼|かれ]は[車|くるま]にはねられた。', kana: 'かれ~は くるま~に はねられた', pt: 'Ele foi atropelado pelo carro.' },
      { id: 10682600, ja: '母さんに叱られたんだ。', furi: '[母|かあ]さんに[叱|しか]られたんだ。', kana: 'かあさん~に しかられた|んだ', pt: 'Minha mãe me repreendeu.' },
    ],
  },
  {
    id: 'n4-7',
    title: 'Se... : a forma 〜ば',
    body: [
      'A forma **ば** diz "**se**" ou "bastando que": __みれば わかる__ ("se você olhar, vai entender"). Também se usa para desejar o impossível, com **なあ**: __わかければなあ__ ("queria ser jovem").',
      {
        table: [
          ['#tipo', '#como fica', '#exemplo'],
          ['#verbo grupo 1', 'última sílaba → a do え + ば', '__およぐ__ → __およげば__'],
          ['#verbo grupo 2', 'tira る, põe れば', '__みる__ → __みれば__'],
          ['#adjetivo い', 'tira い, põe ければ', '__わかい__ → __わかければ__'],
          ['#substantivo e な', 'usa なら (ou であれば)', '__あめなら__'],
        ],
      },
      'Com verbos, **あれば** ("se houver") é o **ば** de **ある**.',
    ],
    pattern: '[verbo ou adjetivo na forma ば]、 ... · ...ばなあ (desejo)',
    hint: 'Condição: forma ば. Desejo impossível: ばなあ.',
    examples: [
      { id: 12135719, ja: '見ればわかるさ。', furi: '[見|み]ればわかるさ。', kana: 'みれば わかる~さ', pt: 'Você vai saber quando vir.' },
      { id: 1202184, ja: '車があればなあ。', furi: '[車|くるま]があればなあ。', kana: 'くるま~が あれば~なあ', pt: 'Queria ter um carro.' },
      { id: 189249, ja: '泳げればなあ。', furi: '[泳|およ]げればなあ。', kana: 'およげれば~なあ', pt: 'Queria saber nadar.' },
      { id: 148767, ja: '若ければなあ。', furi: '[若|わか]ければなあ。', kana: 'わかければ~なあ', pt: 'Eu queria ser mais jovem.' },
    ],
  },
  {
    id: 'n4-8',
    title: 'Fazer ou deixar fazer: a forma 〜させる',
    body: [
      'A **forma causativa** diz que alguém **faz** ou **deixa** outra pessoa fazer algo. Quem recebe a ordem ou a permissão vem marcado com **に** (ou **を**): __わたしは かれに ゆかを そうじさせた__ ("eu o fiz varrer o chão").',
      {
        table: [
          ['#tipo do verbo', '#como fica', '#exemplo'],
          ['#grupo 1 (terminam em う, く, ぐ, す, つ, ぬ, ぶ, む, る)', 'troca a última sílaba pela do あ + せる (う vira わ)', '__いく__ → __いかせる__ · __かう__ → __かわせる__'],
          ['#grupo 2 (る depois de い ou え)', 'tira る, põe させる', '__たべる__ → __たべさせる__'],
          ['#する e くる', 'irregulares', '__する__ → __させる__ · __くる__ → __こさせる__'],
        ],
      },
      'Com **てください**, vira pedido de permissão: __やらせて ください__ ("deixe-me fazer"). Com verbos de sentimento, indica **provocar** esse sentimento: __いらいらさせる__ ("irritar").',
    ],
    pattern: '[quem manda] は [quem faz] に [verbo causativo] · [verbo causativo て] ください',
    hint: 'Fazer ou deixar alguém fazer: verbo + させる (grupo 1: あ + せる).',
    examples: [
      { id: 154105, ja: '私は彼に床を掃除させた。', furi: '[私|わたし]は[彼|かれ]に[床|ゆか]を[掃除|そう|じ]させた。', kana: 'わたし~は かれ~に ゆか~を そうじ させた', pt: 'Eu o fiz varrer o chão.' },
      { id: 3506608, ja: '私にやらせてください。', furi: '[私|わたし]にやらせてください。', kana: 'わたし~に やらせて|ください', pt: 'Deixe-me fazer isso.' },
      { id: 5692169, ja: '寝させてよ。', furi: '[寝|ね]させてよ。', kana: 'ねさせて~よ', pt: 'Deixe-me dormir.' },
      { id: 136179, ja: '君は僕をいらいらさせる。', furi: '[君|きみ]は[僕|ぼく]をいらいらさせる。', kana: 'きみ~は ぼく~を いらいら させる', pt: 'Você me irrita!' },
    ],
  },
  {
    id: 'n4-9',
    title: 'Se ou quando: 〜たら',
    body: [
      'Com **たら** você diz "**se**" ou "**quando**" algo acontecer, e o que vem depois depende disso. Forma: a forma **た** do verbo ou do adjetivo + **ら**. Com substantivo ou adjetivo **な**, usa-se **だったら**.',
      {
        table: [
          ['#o que vem antes', '#como fica', '#exemplo'],
          ['#verbo', 'forma た + ら', '__ふる__ → __ふったら__'],
          ['#adjetivo い', 'tira い, põe かったら', '__たかい__ → __たかかったら__'],
          ['#substantivo e な', 'põe だったら', '__あめ__ → __あめだったら__'],
        ],
      },
      'Depois de **たら** cabe quase tudo: vontade, pedido e também sugestão (__くるま かったら?__ "que tal comprar um carro?"). Para fatos que acontecem sempre em sequência, veja o **と**, no próximo tópico.',
    ],
    pattern: '[forma た] ら、... · [substantivo] だったら、...',
    hint: 'Se ou quando: forma た + ら.',
    examples: [
      { id: 80357, ja: '明日雨が降ったら、家にいます。', furi: '[明日|あした][雨|あめ]が[降|ふ]ったら、[家|いえ]にいます。', kana: 'あした あめ~が ふったら いえ~に います', pt: 'Se chover amanhã, ficarei em casa.' },
      { id: 12003646, ja: '子どもができたら、分かるさ。', furi: '[子|こ]どもができたら、[分|わ]かるさ。', kana: 'こども~が できたら わかる~さ', pt: 'Quando você tiver filhos, vai entender.' },
      { id: 10230338, ja: '僕だったら、断るな。', furi: '[僕|ぼく]だったら、[断|ことわ]るな。', kana: 'ぼく だったら ことわる~な', pt: 'Eu diria não se eu fosse você.' },
      { id: 11706769, ja: '車買ったら？', furi: '[車|くるま][買|か]ったら？', kana: 'くるま かったら', pt: 'Por que você não compra um carro?' },
    ],
  },
  {
    id: 'n4-10',
    title: 'Quando... acontece...: 〜と',
    body: [
      'O **と** liga duas coisas em que a segunda **acontece naturalmente** depois da primeira: fatos da natureza, hábitos, resultados e descobertas. Vem depois da forma **simples** (dicionário ou ない): __はるが くると、はなが さきます__ ("quando a primavera chega, as flores desabrocham").',
      {
        table: [
          ['#o que vem antes', '#exemplo'],
          ['#verbo', '__みる__ → __みると__'],
          ['#adjetivo い', '__たかい__ → __たかいと__'],
          ['#substantivo e な', '__ひま__ → __ひまだと__'],
        ],
      },
      'Atenção: depois de **と** não se usa vontade, pedido nem convite. Para isso, use **たら** (ou **ば**). No passado, **と** conta uma descoberta ou uma reação: __キスすると、かのじょは あかくなった__.',
    ],
    pattern: '[forma simples] と、...',
    hint: 'Resultado natural: forma simples + と (sem pedido nem vontade depois).',
    examples: [
      { id: 6391927, ja: '春が来ると、木の花が咲きます。', furi: '[春|はる]が[来|く]ると、[木|き]の[花|はな]が[咲|さ]きます。', kana: 'はる~が くると き~の はな~が さきます', pt: 'Quando a primavera chegar, as flores nas árvores vão florescer.' },
      { id: 204266, ja: 'そんなに食べると、病気になるよ。', furi: 'そんなに[食|た]べると、[病気|びょう|き]になるよ。', kana: 'そんなに たべると びょうき~に なる~よ', pt: 'Se você comer muito, ficará doente.' },
      { id: 10380252, ja: 'よく見ると、虫がいるよ。', furi: 'よく[見|み]ると、[虫|むし]がいるよ。', kana: 'よく みると むし~が いる~よ', pt: 'Se olhar cuidadosamente, irá encontrar alguns insetos.' },
      { id: 10179138, ja: 'キスすると、彼女は赤くなった。', furi: 'キスすると、[彼女|かの|じょ]は[赤|あか]くなった。', kana: 'キス すると かのじょ~は あかく なった', pt: 'Ela ficou vermelha quando a beijei.' },
    ],
  },
  {
    id: 'n4-11',
    title: 'Passar a poder fazer: 〜ようになる',
    body: [
      'Com **ようになる** você diz que algo **passou a acontecer**: uma habilidade nova, um hábito, uma mudança. O verbo fica na forma do dicionário (muitas vezes na forma **potencial**): __およげる ように なった__ ("aprendi a nadar").',
      {
        table: [
          ['#sentido', '#exemplo'],
          ['#passou a', '__およげるように なった__'],
          ['#quero passar a', '__およげるように なりたい__'],
          ['#deixou de', '__およげなく なった__ (já não consigo nadar)'],
        ],
      },
      'Repare no **に**: **ようになる** é "tornar-se de um jeito". Para o contrário, "deixar de", usa-se o **ない** + **なる**, como na última linha.',
    ],
    pattern: '[verbo: dicionário] ように なる · [verbo: ない → なく] なる',
    hint: 'Passar a: dicionário + ように なった (aprendi a, passei a).',
    examples: [
      { id: 109752, ja: '彼は泳げるようになった。', furi: '[彼|かれ]は[泳|およ]げるようになった。', kana: 'かれ~は およげる ように なった', pt: 'Ele aprendeu a nadar.' },
      { id: 153577, ja: '私は彼を知るようになった。', furi: '[私|わたし]は[彼|かれ]を[知|し]るようになった。', kana: 'わたし~は かれ~を しる ように なった', pt: 'Eu vim conhecê-lo.' },
      { id: 10711650, ja: '泳げるようになりたいんだ。', furi: '[泳|およ]げるようになりたいんだ。', kana: 'およげる ように なりたい|んだ', pt: 'Eu quero aprender a nadar.' },
    ],
  },
  {
    id: 'n4-12',
    title: 'Para e por causa de: 〜ために',
    body: [
      'Com **ために** você diz **para quê** (o objetivo) ou **para quem** se faz algo. Com verbo, usa-se a forma do dicionário e os dois verbos têm o **mesmo sujeito**: __べんきょうする ために がっこうへ いく__ ("vou à escola para estudar").',
      {
        table: [
          ['#o que vem antes', '#sentido', '#exemplo'],
          ['#verbo (dicionário)', 'objetivo ("para")', '__とる ために__ (para tirar)'],
          ['#substantivo + の', 'em benefício de ("para")', '__かのじょの ために__ (para ela)'],
          ['#substantivo + の', 'causa ("por causa de")', '__ゆきの ために__ (por causa da neve)'],
        ],
      },
      'Com substantivo + **の**, quem decide se é benefício ou causa é o resto da frase: algo que você faz por alguém ("para") ou algo que aconteceu ("por causa de", um tom mais formal).',
    ],
    pattern: '[verbo: dicionário] ために · [substantivo] の ために',
    hint: 'Objetivo: dicionário + ために. Para quem ou por causa de: substantivo + のために.',
    examples: [
      { id: 12957260, ja: '彼女のために買ったんだ。', furi: '[彼女|かの|じょ]のために[買|か]ったんだ。', kana: 'かのじょ~の ために かった|んだ', pt: 'Eu comprei isto para a minha namorada.' },
      { id: 151482, ja: '私達は写真を撮るために公園へ行きました。', furi: '[私|わたし][達|たち]は[写真|しゃ|しん]を[撮|と]るために[公園|こう|えん]へ[行|い]きました。', kana: 'わたしたち~は しゃしん~を とる ために こうえん~へ いきました', pt: 'Fomos ao parque para tirar fotos.' },
      { id: 165152, ja: '私たちは勉強するために学校へ行く。', furi: '[私|わたし]たちは[勉強|べん|きょう]するために[学校|がっ|こう]へ[行|い]く。', kana: 'わたしたち~は べんきょう する ために がっこう~へ いく', pt: 'Vamos para a escola estudar.' },
      { id: 77478, ja: '列車は雪のために遅れた。', furi: '[列車|れっ|しゃ]は[雪|ゆき]のために[遅|おく]れた。', kana: 'れっしゃ~は ゆき~の ために おくれた', pt: 'O trem estava atrasado devido à neve.' },
    ],
  },
  {
    id: 'n4-13',
    title: 'Mas, embora: 〜のに',
    body: [
      'O **のに** liga duas ideias quando o resultado é **o contrário do esperado**, com tom de surpresa, queixa ou pena: "embora", "apesar de". Vem depois da forma **simples**; com substantivo e adjetivo **な**, usa-se **なのに**.',
      {
        table: [
          ['#o que vem antes', '#exemplo'],
          ['#verbo', '__かった__ → __かったのに__'],
          ['#adjetivo い', '__いそがしい__ → __いそがしいのに__'],
          ['#substantivo e な', '__ひま__ → __ひまなのに__'],
        ],
      },
      'No fim da frase, **のに** expressa **pena** ou **desejo irreal**: __…ばいいのに__ ("quem dera que..."). Ao contrário de **けど** e **が**, que só contrastam, o **のに** mostra a emoção de quem fala.',
    ],
    pattern: '[forma simples] のに、... · [substantivo/な] なのに、... · ...ばいいのに',
    hint: 'Contrário do esperado: forma simples + のに (e ばいいのに para um desejo).',
    examples: [
      { id: 12508745, ja: '友達だと思ってたのに！', furi: '[友達|とも|だち]だと[思|おも]ってたのに！', kana: 'ともだち だ~と おもってた|のに', pt: 'Eu pensei que fôssemos amigos.' },
      { id: 165927, ja: '急ぐ必要はなかったのに。', furi: '[急|いそ]ぐ[必要|ひつ|よう]はなかったのに。', kana: 'いそぐ ひつよう~は なかった|のに', pt: 'Não precisávamos ter corrido.' },
      { id: 11746278, ja: '新しい靴、買ったばっかりなのに。', furi: '[新|あたら]しい[靴|くつ]、[買|か]ったばっかりなのに。', kana: 'あたらしい くつ かった ばっかり なのに', pt: 'Acabei de comprar um novo par de sapatos.' },
      { id: 228053, ja: 'うんとお金があればいいのに。', furi: 'うんとお[金|かね]があればいいのに。', kana: 'うんと おかね~が あれば いい|のに', pt: 'Queria ter muito dinheiro.' },
    ],
  },
  {
    id: 'n4-14',
    title: 'Mesmo que: 〜ても',
    body: [
      'Com **ても** você diz "**mesmo que**", "**ainda que**": o que vem depois **não muda** por causa da condição. Forma: **て** + **も** (verbo), **くても** (adjetivo い) e **でも** (substantivo e adjetivo **な**).',
      {
        table: [
          ['#o que vem antes', '#como fica', '#exemplo'],
          ['#verbo', 'forma て + も', '__おこる__ → __おこっても__'],
          ['#adjetivo い', 'tira い, põe くても', '__おそい__ → __おそくても__'],
          ['#substantivo e な', 'põe でも', '__あめ__ → __あめでも__'],
        ],
      },
      'Com **いくら** ou **なにが**, vira "não importa quanto" e "aconteça o que acontecer". Na forma negativa, **なくても** quer dizer "mesmo sem".',
    ],
    pattern: '[forma て] も · [adjetivo い: くても] · [substantivo/な] でも',
    hint: 'Mesmo que: forma て + も (adjetivo い: くても; substantivo: でも).',
    examples: [
      { id: 188016, ja: '何が起こっても、私は驚きません。', furi: '[何|なに]が[起|お]こっても、[私|わたし]は[驚|おどろ]きません。', kana: 'なに~が おこっても わたし~は おどろきません', pt: 'Não importa o que aconteça, não ficarei surpreso.' },
      { id: 6015, ja: 'いくら考えても、わかりません。', furi: 'いくら[考|かんが]えても、わかりません。', kana: 'いくら かんがえても わかりません', pt: 'Não importa o quanto eu pense sobre isso, não consigo entendê-lo.' },
      { id: 126755, ja: '遅くても来ないよりまし。', furi: '[遅|おそ]くても[来|こ]ないよりまし。', kana: 'おそくても こない より まし', pt: 'Antes tarde do que nunca.' },
      { id: 2656835, ja: '水がなくても生きられる。', furi: '[水|みず]がなくても[生|い]きられる。', kana: 'みず~が なくても いきられる', pt: 'Eu posso viver sem água.' },
    ],
  },
];
