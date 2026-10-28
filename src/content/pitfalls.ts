/**
 * "Erros comuns de quem fala português": notas curtas, escritas para este app (não vêm de nenhuma fonte externa).
 * Ainda não foram revisadas por um falante de japonês (ver LICENSE.md, "Antes de publicar").
 */

export interface Pitfall {
  title: string;
  text: string;
}

/** Os erros que valem para a gramática toda. */
export const GENERAL_PITFALLS: readonly Pitfall[] = [
  {
    title: 'O verbo vai no fim',
    text: 'Em português o verbo fica no meio (eu como lámen). Em japonês ele fecha a frase: わたしは ラーメンを たべます. Se você ouvir a frase até o fim, o verbo sempre vem por último.',
  },
  {
    title: 'O "eu" some quando é óbvio',
    text: 'Traduzir "eu" em toda frase soa estranho. コーヒーを のみます já quer dizer "(eu) bebo café". O japonês deixa de fora quem fala e quem ouve quando o contexto deixa claro.',
  },
  {
    title: 'Não existem "o", "a", "um", "uma"',
    text: 'ほん pode ser "livro", "o livro" ou "um livro". Quem decide é o contexto. Por isso é um erro tentar encontrar um "artigo" para は, を ou が: eles não são artigos.',
  },
  {
    title: 'A palavra não mostra plural nem gênero',
    text: 'ほん é "livro" ou "livros". Quando a quantidade importa, o japonês usa número + contador (ほんを さんさつ). Os adjetivos também não concordam: たかい serve para "caro" e "caros", "cara" e "caras".',
  },
  {
    title: 'を não é "o"',
    text: 'Escrito を, lê-se "o" por coincidência de som, mas é a partícula que marca o que recebe a ação. Não tem nada a ver com o artigo "o" do português. O mesmo vale para は (lê-se "wa") e へ (lê-se "e").',
  },
  {
    title: 'Presente e futuro são a mesma forma',
    text: 'たべます quer dizer "como" e também "vou comer". A palavra de tempo (あした, まいにち) é que esclarece. Não existe um futuro separado como o do português.',
  },
  {
    title: 'Uma só palavra para "ser" e "estar"',
    text: 'です cobre "ser" e "estar" para qualidades e identidade. Para dizer onde algo está, usa-se あります (coisas) ou います (pessoas e animais). E "ter" no sentido de existir ou possuir também sai desses verbos.',
  },
  {
    title: 'Pergunta é só pôr か no fim',
    text: 'A ordem da frase não muda e a entonação nem precisa subir. すしですか é "é sushi?". A palavra interrogativa (なに, どこ, だれ) fica no mesmo lugar da resposta, não vai para o início.',
  },
  {
    title: 'Sim e não em pergunta negativa',
    text: 'Se perguntam "você não vai?", はい quer dizer "isso mesmo, não vou" e いいえ quer dizer "pelo contrário, vou". Em português o "sim" pode soar como o contrário. Responda com o verbo inteiro para evitar confusão: いきません.',
  },
  {
    title: 'Uma preposição do português vira várias partículas',
    text: '"Em" pode ser に (onde algo está, destino, hora) ou で (onde a ação acontece). "De" pode ser の (posse), から (origem) ou で (meio: de trem). Ao traduzir, pergunte primeiro o que a preposição faz na frase.',
  },
];

/** Os erros típicos de cada tópico (pelo id). Nem todo tópico tem. */
export const TOPIC_PITFALLS: Readonly<Record<string, readonly string[]>> = {
  g1: [
    'は não é artigo nem "é": marca o assunto, e quem diz "é/sou" é o です.',
    'です não muda com a pessoa nem com o número: serve para "sou", "é" e "são".',
  ],
  g2: ['O verbo vai por último, depois do objeto: ラーメンを たべます, e não たべます ラーメンを.'],
  g3: ['ます não indica quem faz a ação: たべます pode ser "como", "come" ou "comem". Quem faz vem do contexto.'],
  g4: [
    'Lugar onde a ação acontece é で; destino é に. "Como no restaurante" é レストランで, mas "vou ao restaurante" é レストランに.',
    'Para o meio de transporte, o で também serve: でんしゃで (de trem).',
  ],
  g5: ['A ordem é invertida em relação ao português: "livro de mim" é わたしの ほん (dono primeiro).'],
  g6: ['それ é o que está perto de VOCÊ (quem ouve), não um "isso" qualquer. Se está longe dos dois, é あれ.'],
  g7: [
    'Pessoas e animais usam います; coisas usam あります. Plantas e objetos que se movem (um carro) usam あります.',
    'Dizer "tenho um irmão" sai com います: あにが います. Para coisas, あります.',
  ],
  g8: ['たい só vale para o que o próprio falante quer. Para dizer o que outra pessoa quer, o japonês muda a forma (assunto mais adiante).'],
  g9: [
    'O adjetivo não concorda com gênero nem número: たかい serve para "caro" e "caros".',
    'Adjetivo い vai direto no substantivo (たかい くるま). Adjetivo な precisa do な (きれいな まち).',
  ],
  g10: ['と liga substantivos ("sushi e lámen"). Para ligar duas ações, não use と: use a forma て do verbo (treine no Conjugar).'],
  g11: ['Não junte ません com です: "não sou" é ではありません (ou じゃないです), nunca です + ません.'],
  g12: ['いい (bom) é uma exceção: o negativo é よくないです e o passado é よかったです, nunca いくないです.'],
  g13: ['きれい, すき e ゆうめい terminam em い, mas são adjetivos な. Não existe きれくない: use きれいではありません.'],
  g14: ['O pedido é verbo na forma て + ください, e não verbo em ます + ください. たべて ください, e não たべます ください.'],
  g15: [
    'ています nem sempre é gerúndio ("estou fazendo"): em しっています, もっています e けっこんしています ele expressa um estado.',
    'O contrário de しっています (sei) é しりません (não sei).',
  ],
  g16: ['Não esqueça o で: いかないで ください. Sem ele a frase fica incompleta.'],
  g17: ['いいですか vira "posso?" por causa do も depois do て. Cuidado: responder só いいです pode soar como "não, obrigado". Diga はい、いいですよ.'],
  g18: ['てはいけません é uma proibição forte (regra, aviso). Para um pedido educado de "não faça", prefira ないで ください.'],
  g19: ['ませんか parece uma pergunta negativa, mas é um convite gentil: "não quer...?". A resposta é いいですね (boa ideia) ou ええ、ぜひ.'],
  g20: ['ほしい serve para o que VOCÊ quer ter e leva が. Para uma ação ("quero comer"), use たい, não ほしい.'],
  g21: ['A coisa com que se compara vem antes de より: A は B より [adjetivo]. O adjetivo não muda para "mais".'],
  g22: ['いちばん vem direto antes do adjetivo, sem "o" nem "mais": いちばん たかい.'],
  g23: ['Com すき, きらい, じょうず e へた a coisa leva が, e não を: ねこが すきです. すき é um adjetivo な: すきな ひと.'],
  g24: [
    'Para um horário exato use に (さんじに). Para início e fim use から e まで. Para um prazo ("antes de") use までに.',
  ],
  g25: ['O motivo vem ANTES de から. Em português o "porque" vem antes do motivo; no japonês, から vem depois.'],
  g26: ['A palavra interrogativa não vai para o início da frase: fica no lugar da resposta. Para quem faz a ação, use が (だれが).'],
  g27: [
    'もう + passado quer dizer "já" (もう たべました). Mas もう + negativo quer dizer "não mais" (もう たべません).',
    '"Ainda não" é まだ + negativo (まだ たべていません), e "ainda (continua)" é まだ + afirmativo.',
  ],
  g28: ['A ordem é inversa à do português: "em cima da mesa" é つくえの うえ (a mesa primeiro).'],
  g29: [
    'Adjetivo い vira く + なる (さむく なる). Substantivo e adjetivo な usam に (ひまに なる).',
    'A pessoa que "quer ser algo" usa になりたい, e não をなりたい.',
  ],
  g30: ['O que se sabe fazer leva が: スキーが できます. Com を a frase soa estranha.'],
  g31: [
    'O verbo antes de まえに fica no dicionário (ねる まえに), e não em ます (ねます まえに). Em português o verbo tem um só tempo ("antes de dormir"), mas em japonês o tempo vem no fim da frase.',
    'Com substantivo, lembre do の: しょくじの まえに.',
  ],
  g32: [
    'て + から precisa da forma て certa (たべてから, かえってから). A ação principal vem depois e leva o tempo da frase.',
    'あとで sozinho é "mais tarde"; depois de um substantivo é のあとで (しごとの あとで).',
  ],
  g33: [
    'ながら só vale quando é a mesma pessoa que faz as duas coisas. Para pessoas diferentes se usa outra construção.',
    'O verbo antes de ながら perde o ます (たべます → たべながら), e a ação principal fica no fim.',
  ],
  g34: [
    'O verbo antes de に perde o ます (たべます → たべに). Não use a forma de dicionário aqui (たべるに está errado).',
    'Com palavras de ação (かいもの, べんきょう) é só に, sem verbo.',
  ],
  g35: [
    'あまり e ぜんぜん pedem o final negativo. Dizer "ぜんぜん いい" no sentido de "nada mal" existe na fala solta, mas na escola se ensina com o negativo.',
    'O advérbio vem antes do verbo, não no fim da frase como o "sempre" do português às vezes.',
  ],
  g36: [
    'ましょうか oferece algo que VOCÊ faz. Para pedir que o outro faça, use ください ou てもらえますか.',
    'Fica ambíguo se é oferta ou convite: o contexto decide (てつだいましょうか é oferta; いきましょうか costuma ser "vamos?").',
  ],
  g37: [
    'だけ vem depois da palavra e antes de partículas como は e で (これだけは, それだけで). Em português o "só" vem antes.',
  ],
  g38: [
    'なに + か (なにか) é "alguma coisa"; なに sozinho é "o quê?". Em perguntas simples, a entonação sobe nos dois casos, então o contexto ajuda.',
    'Em frases negativas se usa も (なにも ない), e não か.',
  ],
  g39: [
    'は e が não são "o sujeito" e "o assunto" como em português: は apresenta o assunto, が aponta quem faz ou o que é novo. A pergunta com だれ ou なに leva が, e a resposta também.',
    'Com あります e います, o que existe leva が (ねこが います), e o lugar leva に.',
  ],
  g40: [
    'A forma simples não é "a fácil": ela soa íntima. Com quem você não conhece, com professores e com clientes, use ます.',
    'Verbo simples não leva です (たべるです está errado). Só adjetivos い aceitam です (たかいです), e é um caso à parte.',
    'Ao fazer ない e た, confira o grupo do verbo (たべない, mas のまない): treine em Conjugar.',
  ],
  g41: [
    'Quando a coisa vem para você, o verbo é くれる, não あげる: "ele me deu" é かれは わたしに くれた.',
    'Com もらう, quem deu leva に (ou から); com あげる, quem recebe leva に.',
    'O "eu" costuma ficar oculto: てがみを もらった já quer dizer "EU recebi uma carta".',
  ],
  g42: [
    'Antes de と vai a forma simples, não a ます: くると おもいます, e não "きますと おもいます".',
    'Com substantivo ou adjetivo な, use だ: きれいだと おもいます. "きれいですと" está errado.',
    'Para "acho que não vem", o japonês nega o verbo de dentro: こないと おもいます, mais natural do que "くると おもいません".',
  ],
  g43: [
    'でしょう não é o futuro do português ("será"): é um palpite. O futuro se diz com a forma ます (あした ふります).',
    'Com か vira uma pergunta educada ("será que...?") e não afirma nada.',
    'Não use para o que você mesmo decidiu: para planos use つもりです ou ます.',
  ],
  g44: [
    'つもり pede o verbo na forma de dicionário, não em ます: いく つもりです. "いきます つもりです" está errado.',
    'Para "pretendo não ir", o ない fica no verbo: いかない つもりです.',
    'É um plano seu. Para algo marcado e certo, o natural é a forma ます (あした いきます).',
  ],
  g45: [
    'Há um "não" dentro (なければ), mas o sentido é "tenho que": é uma dupla negação, como "se eu não for, não dá".',
    'Para "não preciso", é outro padrão: なくても いいです (próximo tópicos de permissão e dispensa).',
    'O verbo parte da forma ない sem o い final: いかない → いかなければ.',
  ],
  g46: [
    'O verbo vai na forma た (e não em ます): いった ほうが いいです. "いきます ほうが" está errado.',
    'Para "é melhor não", use a forma ない: いかない ほうが いいです.',
    'É conselho, não ordem. Com quem está acima de você, prefira explicar o motivo.',
  ],
  g47: [
    'Não confunda: いかなくても いいです = não precisa ir; いっても いいです = pode ir.',
    'Parta da forma ない e troque o い final por くても: いかない → いかなくても.',
    'Quer dizer "dispensado", não "proibido". Para proibir é outra construção (〜ては いけません).',
  ],
  g48: [
    'すぎます vem colado à raiz: のみすぎます, ちいさすぎます. Não precisa de "muito" a mais.',
    'Quase sempre indica um exagero ruim. Para elogiar ("muito bom"), use とても.',
    'Com adjetivo な, tira-se o な: しずかすぎます.',
  ],
  g49: [
    'Aqui やすい não é "barato" (安い): vem colado a um verbo sem ます. つかいやすい = fácil de usar.',
    'Tire o ます antes de juntar: つかいます → つかい + やすい.',
    'Os dois conjugam como adjetivos い: つかいやすかった, つかいにくくない.',
  ],
  g50: [
    'O verbo vai na forma た: いった ことが あります. Com ます, essa construção não existe.',
    'あります aqui não é "há" no sentido de existência: é "existe a experiência de ter feito".',
    'Para "nunca fiz", mantenha o ことが: した ことが ありません.',
  ],
  g51: [
    'Depois do número não vai partícula: ほんを さんさつ かいました (e não "さんさつを").',
    'O contador depende da coisa: folha (まい), livro (さつ), bicho pequeno (ひき), pessoa (にん). Na dúvida, ひとつ, ふたつ servem para a maioria das coisas.',
    'Pessoas têm exceção: ひとり e ふたり (nunca いちにん). A partir de três é さんにん.',
  ],
  'n4-1': [
    'かもしれません é só possibilidade, sem força: se você tem um motivo para esperar algo, o certo é はず.',
    'Com substantivo e adjetivo な não vai だ antes: あめかもしれません (e não あめだかもしれません).',
  ],
  'n4-2': [
    'ことにします é decisão sua. Se a decisão veio de fora (uma regra, um acordo), é ことになります: "ficou decidido".',
    'Para decidir não fazer, o verbo vai em ない antes: いかない ことに しました (e não いく ことに しません).',
  ],
  'n4-3': [
    'てしまいます não é só "terminar": muitas vezes traz o sentimento de pena ou de algo sem querer. わすれてしまった é "esqueci, que pena".',
    'Na conversa, ねてしまった vira ねちゃった, e のんでしまった vira のんじゃった.',
  ],
  'n4-4': [
    'ておきます não é "deixar" no sentido de abandonar: é fazer antes ou manter como está, de propósito.',
    'Na conversa, ておく vira とく: かんがえとく.',
  ],
  'n4-5': [
    'はずです não é "é certo, eu garanto": é "pelo que sei, deveria ser". Se o fato contrariar, o falante se surpreende.',
    'Com substantivo, vai の: せんせいの はずです. Com adjetivo な, vai な: しずかな はずです.',
  ],
  'n4-6': [
    'A passiva em japonês costuma mostrar que a ação incomodou quem a sofreu (a "passiva do prejuízo"), mesmo quando o português não usaria passiva.',
    'Quem faz a ação vem com に: せんせいに しかられた. Não use で nem から para isso.',
  ],
  'n4-7': [
    'A forma ば vale para condição geral ou desejo; para algo que aconteceu uma vez, prefira たら.',
    'Com substantivo e adjetivo な, a forma é なら, e não なれば.',
  ],
  'n4-8': [
    'A causativa tem dois sentidos: forçar ("fazer alguém fazer") e permitir ("deixar fazer"). Quem decide é o contexto; com させてください é sempre um pedido de permissão.',
    'Nos verbos do grupo 1 que terminam em う, a sílaba vira わ, e não あ: かう → かわせる.',
  ],
  'n4-9': [
    'Com adjetivo い, a forma é かったら (たかかったら), e não たかいたら.',
    'Para algo que acontece sempre, como um fato da natureza, prefira と; たら serve para condição e para "quando" num caso só.',
  ],
  'n4-10': [
    'Depois de と não vêm pedido, convite nem vontade (nada de "por favor" ou "vamos"): nesses casos use たら ou ば.',
    'Aqui o と vem depois de um verbo ou adjetivo na forma simples. Não é o と de "e" nem o de "com", que vêm depois de um substantivo.',
  ],
  'n4-11': [
    'ようになる mostra uma mudança que já aconteceu ("passei a"). Não confunda com ことになる, que diz que algo "ficou decidido", e não que alguém passou a conseguir.',
    'Para "deixar de", use a forma ない: およげなく なった.',
  ],
  'n4-12': [
    'No sentido de objetivo, os dois verbos têm o mesmo sujeito. Se forem diferentes, o japonês usa outra construção (ように).',
    'Antes de ために o verbo fica na forma do dicionário (とるために), e não na forma ます.',
  ],
  'n4-13': [
    'Com substantivo e adjetivo な, vem な antes de のに: ひまなのに, e não ひまだのに.',
    'Depois de のに não se usa pedido nem ordem: ele mostra surpresa ou queixa de quem fala.',
  ],
  'n4-14': [
    'Com adjetivo い, a forma é くても (たかくても), e não たかいても.',
    'Com substantivo e adjetivo な, a forma é でも (あめでも), e não a forma て.',
  ],
};
