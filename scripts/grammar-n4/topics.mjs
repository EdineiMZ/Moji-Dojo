// Tópicos de gramática N4 (primeira leva).
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
];
