// Tópicos de gramática N4 (n4-1 a n4-7: primeira leva; n4-8 a n4-14: segunda leva; n4-15 a n4-23: terceira leva).
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
  {
    id: 'n4-15',
    title: 'Ao mesmo tempo: 〜ながら',
    body: [
      'Com **ながら** você diz que duas ações acontecem **ao mesmo tempo**, feitas pela **mesma pessoa**. Tire o **ます** do verbo (a base) e ponha **ながら**. A ação principal fica no fim da frase; a de **ながら** é a que a acompanha.',
      {
        table: [
          ['#verbo', '#base', '#com ながら'],
          ['#のむ', '__のみ__', '__のみながら__'],
          ['#たべる', '__たべ__', '__たべながら__'],
          ['#する', '__し__', '__しながら__'],
        ],
      },
      'Serve para ações que duram um tempo (andar, ouvir, comer, ler). Se as duas ações são de pessoas diferentes, **ながら** não funciona.',
    ],
    pattern: '[verbo: base sem ます] ながら、...',
    hint: 'Duas ações juntas: base do verbo + ながら.',
    examples: [
      { id: 142246, ja: '赤ちゃんは泣きながら眠ってしまった。', furi: '[赤|あか]ちゃんは[泣|な]きながら[眠|ねむ]ってしまった。', kana: 'あかちゃん~は なきながら ねむって しまった', pt: 'O bebê chorou até dormir.' },
      { id: 404561, ja: '私は食事をしながら本を読みました。', furi: '[私|わたし]は[食事|しょく|じ]をしながら[本|ほん]を[読|よ]みました。', kana: 'わたし~は しょくじ~を しながら ほん~を よみました', pt: 'Eu li um livro enquanto comi.' },
      { id: 90960, ja: '彼女はいつも音楽を聴きながら勉強する。', furi: '[彼女|かの|じょ]はいつも[音楽|おん|がく]を[聴|き]きながら[勉強|べん|きょう]する。', kana: 'かのじょ~は いつも おんがく~を ききながら べんきょうする', pt: 'Ela sempre estuda ouvindo música.' },
      { id: 84989, ja: '夫は新聞を読みながら、朝ごはんを食べる。', furi: '[夫|おっと]は[新聞|しん|ぶん]を[読|よ]みながら、[朝|あさ]ごはんを[食|た]べる。', kana: 'おっと~は しんぶん~を よみながら あさごはん~を たべる', pt: 'Meu marido toma café da manhã enquanto lê o jornal.' },
    ],
  },
  {
    id: 'n4-16',
    title: 'Demais: 〜すぎる',
    body: [
      'Com **すぎる** você diz que algo é **demais**, passou do ponto. Verbo: base (sem **ます**) + **すぎる**. Adjetivo い: tira o **い**. Adjetivo な: tira o **な**. O resultado conjuga como verbo: **すぎた**, **すぎない**, **すぎます**.',
      {
        table: [
          ['#o que vem antes', '#como fica', '#exemplo'],
          ['#verbo', 'base + すぎる', '__たべる__ → __たべすぎる__'],
          ['#adjetivo い', 'tira い, põe すぎる', '__たかい__ → __たかすぎる__'],
          ['#adjetivo な', 'tira な, põe すぎる', '__しずか__ → __しずかすぎる__'],
        ],
      },
      'O adjetivo **いい** vira **よすぎる**. Quase sempre é algo ruim por excesso ("caro demais", "bebi demais"). Também se escreve **過ぎる**, como em **たべすぎ** ("exagero ao comer").',
    ],
    pattern: '[verbo: base] すぎる · [adjetivo い sem い] すぎる · [adjetivo な sem な] すぎる',
    hint: 'Excesso: base do verbo ou adjetivo sem い + すぎる.',
    examples: [
      { id: 3073523, ja: '高すぎる！', furi: '[高|たか]すぎる！', kana: 'たかすぎる', pt: 'É muito caro!' },
      { id: 12593254, ja: '水が冷たすぎる。', furi: '[水|みず]が[冷|つめ]たすぎる。', kana: 'みず~が つめたすぎる', pt: 'A água está muito fria.' },
      { id: 169868, ja: '昨日食べすぎた。', furi: '[昨日|きのう][食|た]べすぎた。', kana: 'きのう たべすぎた', pt: 'Eu comi muito ontem.' },
      { id: 177029, ja: '働きすぎですよ。', furi: '[働|はたら]きすぎですよ。', kana: 'はたらきすぎ|です~よ', pt: 'Você está trabalhando demais.' },
    ],
  },
  {
    id: 'n4-17',
    title: 'Parece que: 〜そうです (aparência)',
    body: [
      'Com **そう** você diz como algo **parece** pelo que vê ou sente agora ("tem cara de", "parece que vai"). Verbo: base (sem **ます**) + **そう**. Adjetivo い: tira o **い**. Adjetivo な: tira o **な**.',
      {
        table: [
          ['#o que vem antes', '#como fica', '#exemplo'],
          ['#verbo', 'base + そう', '__ふる__ → __ふりそう__'],
          ['#adjetivo い', 'tira い, põe そう', '__おいしい__ → __おいしそう__'],
          ['#adjetivo な', 'tira な, põe そう', '__げんき__ → __げんきそう__'],
        ],
      },
      'Exceções: **いい** vira **よさそう** e **ない** vira **なさそう**. Para dizer que **não parece** que vai acontecer, use **そうにない**: __きそうにない__.',
      'Depois de **そう** pode vir **だ** ou **です**, **な** + substantivo (__たのしそうな しごと__) ou **に** + verbo (__たのしそうに__ わらう). Não confunda com o **そうだ** de "ouvi dizer", que é o próximo tópico.',
    ],
    pattern: '[verbo: base] そうだ · [adjetivo い sem い] そうだ · [adjetivo な sem な] そうだ',
    hint: 'Aparência: base ou adjetivo sem い/な + そう.',
    examples: [
      { id: 201190, ja: 'どうも雨になりそうです。', furi: 'どうも[雨|あめ]になりそうです。', kana: 'どうも あめ~に なりそう|です', pt: 'Acho que vai chover.' },
      { id: 7959060, ja: 'このパンおいしそう。', kana: 'この パン おいしそう', pt: 'Este pão parece gostoso.' },
      { id: 107639, ja: '彼は元気そうだ。', furi: '[彼|かれ]は[元気|げん|き]そうだ。', kana: 'かれ~は げんきそう|だ', pt: 'Ele parece bem.' },
      { id: 86361, ja: '彼女は来そうにない。', furi: '[彼女|かの|じょ]は[来|き]そうにない。', kana: 'かのじょ~は きそう~に ない', pt: 'Não é provável que ela venha.' },
    ],
  },
  {
    id: 'n4-18',
    title: 'Ouvi dizer: 〜そうです (informação de outro)',
    body: [
      'Com **そうだ** (formal **そうです**) depois da **forma simples** você conta algo que **ouviu dizer**: "dizem que", "ouvi que". Não é a sua opinião: é informação de segunda mão.',
      {
        table: [
          ['#o que vem antes', '#como fica', '#exemplo'],
          ['#verbo', 'forma simples + そうだ', '__ふる__ → __ふるそうだ__'],
          ['#adjetivo い', 'forma simples + そうだ', '__たかい__ → __たかいそうだ__'],
          ['#substantivo e adjetivo な', '+ だ + そうだ', '__びょうき__ → __びょうきだそうだ__'],
        ],
      },
      'Compare: **ふりそうだ** (base + そう) é "parece que vai chover", pelo que se vê; **ふるそうだ** (forma simples + そう) é "dizem que vai chover". Na conversa, quem ouviu pode acrescentar **ね** para confirmar: __そうですね__.',
    ],
    pattern: '[forma simples] そうだ · [substantivo/な] だそうだ',
    hint: 'Ouvi dizer: forma simples + そうだ.',
    examples: [
      { id: 189727, ja: '雨が降るそうだ。', furi: '[雨|あめ]が[降|ふ]るそうだ。', kana: 'あめ~が ふる そう|だ', pt: 'Dizem que vai chover.' },
      { id: 99656, ja: '彼は名医だそうだ。', furi: '[彼|かれ]は[名医|めい|い]だそうだ。', kana: 'かれ~は めいい だ そう|だ', pt: 'Dizem que ele é um bom médico.' },
      { id: 232414, ja: 'あなたはピアノをやるそうですね。', kana: 'あなた~は ピアノ~を やる そう|です~ね', pt: 'Ouvi dizer que você toca piano.' },
      { id: 217027, ja: 'ご病気だったそうですね。', furi: 'ご[病気|びょう|き]だったそうですね。', kana: 'ごびょうき だった そう|です~ね', pt: 'Eu ouvi que você tem estado doente.' },
    ],
  },
  {
    id: 'n4-19',
    title: 'Parece ser: 〜ようだ e 〜みたい',
    body: [
      '**ようだ** (formal **ようです**) diz que algo **parece** ser assim, com base no que a pessoa observou ou deduziu. Vem depois da forma simples; depois de substantivo leva **の**, e depois de adjetivo な leva **な**.',
      {
        table: [
          ['#o que vem antes', '#como fica', '#exemplo'],
          ['#verbo e adjetivo い', 'forma simples + ようだ', '__つかれている__ → __つかれているようだ__'],
          ['#substantivo', '+ の + ようだ', '__びょうき__ → __びょうきのようだ__'],
          ['#adjetivo な', '+ な + ようだ', '__しずか__ → __しずかなようだ__'],
        ],
      },
      '**みたい** diz o mesmo na conversa, e depois de substantivo ou de adjetivo な não leva **の** nem **な**: __ゆきみたい__. Os dois também comparam: "como", "igual a".',
    ],
    pattern: '[forma simples] ようだ · [substantivo] の ようだ · [substantivo] みたい',
    hint: 'Parece: forma simples + ようだ (substantivo: のようだ; conversa: みたい).',
    examples: [
      { id: 78415, ja: '嵐はやんだようだ。', furi: '[嵐|あらし]はやんだようだ。', kana: 'あらし~は やんだ よう|だ', pt: 'Parece que a tempestade acalmou.' },
      { id: 100750, ja: '彼は疲れているようだ。', furi: '[彼|かれ]は[疲|つか]れているようだ。', kana: 'かれ~は つかれている よう|だ', pt: 'Ele parece cansado.' },
      { id: 100545, ja: '彼は病気のようだ。', furi: '[彼|かれ]は[病気|びょう|き]のようだ。', kana: 'かれ~は びょうき~の よう|だ', pt: 'Ele parece doente.' },
      { id: 628655, ja: '雪みたい。', furi: '[雪|ゆき]みたい。', kana: 'ゆき みたい', pt: 'Parece neve.' },
    ],
  },
  {
    id: 'n4-20',
    title: 'Dar e receber: あげる, くれる, もらう',
    body: [
      'Três verbos de dar e receber, e a diferença é **quem dá** e **quem recebe**. **あげる**: eu (ou alguém do meu lado) dou a outra pessoa. **くれる**: outra pessoa me dá (ou dá a alguém do meu lado). **もらう**: eu recebo de alguém; quem dá vem com **に** ou **から**.',
      {
        table: [
          ['#verbo', '#quem dá', '#quem recebe'],
          ['#あげる', 'eu / meu lado', 'outra pessoa'],
          ['#くれる', 'outra pessoa', 'eu / meu lado'],
          ['#もらう', 'outra pessoa (に/から)', 'eu / meu lado'],
        ],
      },
      'Depois da forma **て**, os mesmos verbos falam de **favores**: **てあげる** (faço por você), **てくれる** (fazem por mim) e **てもらう** (consigo que façam por mim). Com alguém de posição mais alta, **てあげる** soa como se você estivesse fazendo uma gentileza; é melhor oferecer a ajuda de outro jeito.',
    ],
    pattern: '[quem dá] は [quem recebe] に [coisa] を あげる · [forma て] あげる / くれる / もらう',
    hint: 'Dar e receber: あげる (eu dou), くれる (me dão), もらう (eu recebo); com forma て, um favor.',
    examples: [
      { id: 1062147, ja: 'この本、君にあげるよ。', furi: 'この[本|ほん]、[君|きみ]にあげるよ。', kana: 'この ほん きみ~に あげる~よ', pt: 'Eu te darei esse livro.' },
      { id: 196536, ja: 'ボーナスをもらった。', furi: 'ボーナスをもらった。', kana: 'ボーナス~を もらった', pt: 'Ganhei um bônus.' },
      { id: 9037336, ja: '父が本を買ってくれた。', furi: '[父|ちち]が[本|ほん]を[買|か]ってくれた。', kana: 'ちち~が ほん~を かって くれた', pt: 'Meu pai me comprou um livro.' },
      { id: 175189, ja: '見せてあげる。', furi: '[見|み]せてあげる。', kana: 'みせて あげる', pt: 'Vou te mostrar.' },
      { id: 84108, ja: '部屋を掃除してもらった。', furi: '[部屋|へ|や]を[掃除|そう|じ]してもらった。', kana: 'へや~を そうじして もらった', pt: 'Mandei limpar meu quarto.' },
    ],
  },
  {
    id: 'n4-21',
    title: 'Experimentar: 〜てみる',
    body: [
      'Com **てみる** você diz que vai **experimentar** algo para ver como é: forma **て** + **みる**. No passado, **てみた** ("experimentei"). Para convidar ou pedir, **てみましょう** e **てみて**; para dizer que quer, **てみたい**.',
      {
        table: [
          ['#como fica', '#quer dizer'],
          ['__やってみる__', 'vou experimentar fazer'],
          ['__やってみた__', 'experimentei'],
          ['__やってみたい__', 'quero experimentar'],
          ['__やってみましょう__', 'vamos experimentar'],
        ],
      },
      'É "experimentar para ver", sem a ideia de esforço difícil. O verbo **みる** aqui costuma se escrever em hiragana.',
    ],
    pattern: '[forma て] みる · みた · みたい · みましょう',
    hint: 'Experimentar: forma て + みる.',
    examples: [
      { id: 3480369, ja: 'やってみた。', kana: 'やって みた', pt: 'Tentei.' },
      { id: 175172, ja: '見てみましょう。', furi: '[見|み]てみましょう。', kana: 'みて みましょう', pt: 'Vamos dar uma olhada.' },
      { id: 8098712, ja: '明日聞いてみます。', furi: '[明日|あした][聞|き]いてみます。', kana: 'あした きいて みます', pt: 'Vou perguntar a ele amanhã.' },
      { id: 2063347, ja: 'やってみたい？', kana: 'やって みたい', pt: 'Quer prová-lo?' },
    ],
  },
  {
    id: 'n4-22',
    title: 'Não faça: 〜ないで',
    body: [
      'A forma **ない** + **で** serve para pedir que alguém **não faça** algo: **ないで** (informal), **ないでください** (educado) e **ないでくれ** (direto). Também liga duas ações dizendo "**sem** fazer a primeira", como em **ないでおく** ("deixar sem fazer").',
      {
        table: [
          ['#verbo', '#pedido de não fazer'],
          ['#いく', '__いかないで__'],
          ['#しんぱいする', '__しんぱいしないで__'],
          ['#さわぐ', '__さわがないでください__'],
        ],
      },
      'Para a negação que fecha a frase ("não vou", "não fiz"), use **ない** ou **ません**; o **で** é o que liga com o que vem depois.',
    ],
    pattern: '[verbo: forma ない] で · [verbo: forma ない] でください',
    hint: 'Pedido de não fazer: forma ない + で (ou でください).',
    examples: [
      { id: 2006376, ja: '行かないで。', furi: '[行|い]かないで。', kana: 'いかないで', pt: 'Não vá.' },
      { id: 1680729, ja: 'ここで騒がないで下さい。', furi: 'ここで[騒|さわ]がないで[下|くだ]さい。', kana: 'ここ~で さわがないで|ください', pt: 'Por favor, não faça barulhos aqui.' },
      { id: 4734, ja: '心配しないで。', furi: '[心配|しん|ぱい]しないで。', kana: 'しんぱい しないで', pt: 'Não se preocupe.' },
      { id: 12377003, ja: 'ドアの鍵は掛けないでおいてね。', furi: 'ドアの[鍵|かぎ]は[掛|か]けないでおいてね。', kana: 'ドア~の かぎ~は かけないで おいて~ね', pt: 'Deixe a porta destrancada.' },
    ],
  },
  {
    id: 'n4-23',
    title: 'Acho que: 〜と思う',
    body: [
      'Com **と思う** (**とおもう**; formal **と思います**) você dá a **sua opinião**: "acho que". Antes do **と** vai a **forma simples** da frase; substantivo e adjetivo な levam **だ**.',
      {
        table: [
          ['#o que vem antes', '#exemplo'],
          ['#verbo', '__くる__ → __くると おもう__'],
          ['#negativo', '__こない__ → __こないと おもう__'],
          ['#substantivo e adjetivo な', '__しょうじき__ → __しょうじきだと おもう__'],
        ],
      },
      'Em japonês a negação fica **dentro** do que se acha: "acho que ele não vem" é __こないと おもう__. Com a forma de vontade (**よう**), vira "estou pensando em": __ねようと おもう__.',
    ],
    pattern: '[forma simples] と思う · [substantivo/な] だと思う · [forma よう] と思う',
    hint: 'Opinião: forma simples + と思う.',
    examples: [
      { id: 99142, ja: '彼は来ると思う。', furi: '[彼|かれ]は[来|く]ると[思|おも]う。', kana: 'かれ~は くる~と おもう', pt: 'Eu acho que ele virá.' },
      { id: 99154, ja: '彼は来ないと思う。', furi: '[彼|かれ]は[来|こ]ないと[思|おも]う。', kana: 'かれ~は こない~と おもう', pt: 'Eu acho que ele não vem.' },
      { id: 103299, ja: '彼は正直だと思う。', furi: '[彼|かれ]は[正直|しょう|じき]だと[思|おも]う。', kana: 'かれ~は しょうじき だ~と おもう', pt: 'Eu acho ele honesto.' },
      { id: 5049, ja: '寝ようと思う。', furi: '[寝|ね]ようと[思|おも]う。', kana: 'ねよう~と おもう', pt: 'Acho que eu vou dormir.' },
    ],
  },
  {
    id: 'n4-24',
    title: 'Transformar em substantivo: 〜のが e 〜のは',
    body: [
      'Com **の** depois de um verbo na **forma simples**, a ação vira uma "coisa": __はしる__ ("correr") → __はしるの__ ("o ato de correr"). Assim o verbo pode ser usado com **が** ou **は**, como em "gosto de correr" ou "nadar é divertido".',
      {
        table: [
          ['#padrão', '#exemplo'],
          ['verbo + のが + gosto, habilidade, medo', '__はしるのが すき__ (gosto de correr)'],
          ['verbo + のは + opinião', '__およぐのは おもしろい__ (nadar é divertido)'],
        ],
      },
      'Com palavras como **すき**, **じょうず**, **へた**, **こわい** e **はやい**, a coisa de que se gosta, em que se é bom ou que se teme leva **が**. Com **は**, a frase fala do "ato" como tema e dá uma opinião sobre ele.',
    ],
    pattern: '[verbo simples] のが すき / じょうず / こわい · [verbo simples] のは [opinião]',
    hint: 'Verbo na forma simples + の vira "o ato de...".',
    examples: [
      { id: 155346, ja: '私は走るのが好きだ。', furi: '[私|わたし]は[走|はし]るのが[好|す]きだ。', kana: 'わたし~は はしるの~が すきだ', pt: 'Eu gosto de correr.' },
      { id: 109201, ja: '彼は歌うのが上手だ。', furi: '[彼|かれ]は[歌|うた]うのが[上手|じょう|ず]だ。', kana: 'かれ~は うたうの~が じょうずだ', pt: 'Ele canta bem.' },
      { id: 157118, ja: '私は行くのが怖い。', furi: '[私|わたし]は[行|い]くのが[怖|こわ]い。', kana: 'わたし~は いくの~が こわい', pt: 'Estou com medo de ir.' },
      { id: 185126, ja: '海で泳ぐのは面白い。', furi: '[海|うみ]で[泳|およ]ぐのは[面白|おも|しろ]い。', kana: 'うみ~で およぐの~は おもしろい', pt: 'É divertido nadar no mar.' },
    ],
  },
  {
    id: 'n4-25',
    title: 'Chamado e "dizem que": 〜という',
    body: [
      'O verbo **いう** ("dizer") depois de **と** forma **という**. Ele liga um nome ou uma frase ao que vem depois: "chamado...", "(a notícia) de que...", "o fato de que...".',
      {
        table: [
          ['#uso', '#exemplo'],
          ['nome: なんという + substantivo', '__なんという とり__ (um pássaro de que nome?)'],
          ['conteúdo: frase simples + という + substantivo', '__ふゆに なるという はなし__ (a história de que vem o inverno)'],
          ['fato: frase simples + ということ', '__かつということ__ (o fato de vencer)'],
        ],
      },
      'Para perguntar o nome de algo, use **なんという** + o substantivo (escreve-se 何という): __なんという とり__ é "como se chama esse pássaro?". Já **ということ** funciona como a **の** do tópico anterior, mas para falar de um fato ou de uma ideia inteira.',
    ],
    pattern: 'なんという [substantivo] · [forma simples] という [substantivo] · [forma simples] ということ',
    hint: 'という liga um nome ou uma frase ao substantivo seguinte.',
    examples: [
      { id: 229721, ja: 'あれは何という鳥ですか。', furi: 'あれは[何|なん]という[鳥|とり]ですか。', kana: 'あれ~は なん という とり|です~か', pt: 'Que pássaro é esse?' },
      { id: 224327, ja: 'ここは何という通りですか。', furi: 'ここは[何|なん]という[通|とお]りですか。', kana: 'ここ~は なん という とおり|です~か', pt: 'Qual é o nome desta rua, por favor?' },
      { id: 174979, ja: '厳しい冬になるという話です。', furi: '[厳|きび]しい[冬|ふゆ]になるという[話|はなし]です。', kana: 'きびしい ふゆ~に なる という はなし|です', pt: 'Eles disseram que vamos ter um inverno duro.' },
      { id: 191447, ja: '悪が勝つということもあります。', furi: '[悪|あく]が[勝|か]つということもあります。', kana: 'あく~が かつ ということ~も あります', pt: 'O mal às vezes vence.' },
    ],
  },
  {
    id: 'n4-26',
    title: 'Ser obrigado a fazer: 〜させられる',
    body: [
      'Juntando a forma **させる** ("fazer alguém fazer") com a **passiva** (**られる**), nasce **させられる**: "ser obrigado a fazer", quase sempre contra a vontade. Quem foi obrigado vira o sujeito da frase.',
      {
        table: [
          ['#verbo', '#forma'],
          ['grupo 1 (godan)', '__いく → いかされる__ · __まつ → またされる__'],
          ['grupo 2 (ichidan)', '__たべる → たべさせられる__'],
          ['する', '__する → させられる__'],
        ],
      },
      'Nos verbos do grupo 1, a forma curta **〜される** (__いかされる__) é a mais usada. A frase também aparece com **する**, para um sentimento que é "provocado" em você: __ハラハラさせられた__ ("fiquei com o coração na mão").',
    ],
    pattern: '[grupo 2: たべさせられる] · [grupo 1: いかされる] · [する: させられる]',
    hint: 'Causativa + passiva: "ser obrigado a".',
    examples: [
      { id: 113243, ja: '彼はそこに行かされた。', furi: '[彼|かれ]はそこに[行|い]かされた。', kana: 'かれ~は そこ~に いかされた', pt: 'Ele foi feito para ir lá.' },
      { id: 113270, ja: '彼はそうさせられました。', furi: '[彼|かれ]はそうさせられました。', kana: 'かれ~は そう させられました', pt: 'Obrigaram-no a fazer assim.' },
      { id: 235365, ja: '３０分近く待たされた。', furi: '[３０|さんじゅっ][分|ぷん][近|ちか]く[待|ま]たされた。', kana: 'さんじゅっぷん ちかく またされた', pt: 'Fizeram-me esperar cerca de 30 minutos.' },
      { id: 175179, ja: '見ていてハラハラさせられた。', furi: '[見|み]ていてハラハラさせられた。', kana: 'みていて ハラハラ させられた', pt: 'Fiquei nervoso só de assistir a ele.' },
    ],
  },
  {
    id: 'n4-27',
    title: 'Falar com respeito: お〜になります e verbos especiais',
    body: [
      'O japonês tem uma linguagem de **respeito** (**けいご**) para clientes, professores e pessoas mais velhas. Ela tem dois lados: o **honorífico**, que eleva a ação da **outra pessoa**, e o **humilde**, que rebaixa a **sua própria** ação.',
      {
        table: [
          ['#tipo', '#como é'],
          ['honorífico (ação do outro)', '__お + verbo sem ます + になります__: __のむ → おのみに なります__'],
          ['honorífico, verbos especiais', '__いる → いらっしゃいます__ · __たべる → めしあがります__ · __いう → おっしゃいます__'],
          ['humilde (sua ação)', '__いう → もうします__ · __みる → はいけんします__ · __する → いたします__'],
        ],
      },
      'Nunca use o honorífico para você mesmo: "eu me chamo..." é __もうします__, e "o senhor se chama..." é __おっしゃいます__. Em lojas, o cumprimento é __いらっしゃいませ__ ("bem-vindo"). Estas formas são fixas: vale decorar as principais.',
    ],
    pattern: 'お [verbo sem ます] になります · いらっしゃる / めしあがる / おっしゃる · もうす / はいけんする / いたす',
    hint: 'Honorífico eleva o outro; humilde rebaixa você.',
    examples: [
      { id: 187628, ja: '何をお飲みになりますか。', furi: '[何|なに]をお[飲|の]みになりますか。', kana: 'なに~を おのみ に なります~か', pt: 'O que você quer beber?' },
      { id: 187552, ja: '何を召し上がりますか。', furi: '[何|なに]を[召|め]し[上|あ]がりますか。', kana: 'なに~を めしあがります~か', pt: 'O que você gostaria de comer?' },
      { id: 226613, ja: 'お母さんはいらっしゃいますか。', furi: 'お[母|かあ]さんはいらっしゃいますか。', kana: 'おかあさん~は いらっしゃいます~か', pt: 'Sua mãe está em casa?' },
      { id: 342132, ja: 'アンドレアと申します。', furi: 'アンドレアと[申|もう]します。', kana: 'アンドレア~と もうします', pt: 'Eu me chamo Andréa.' },
      { id: 142084, ja: '切符を拝見いたします。', furi: '[切符|きっ|ぷ]を[拝見|はい|けん]いたします。', kana: 'きっぷ~を はいけん いたします', pt: 'Bilhete, por favor.' },
    ],
  },
];
