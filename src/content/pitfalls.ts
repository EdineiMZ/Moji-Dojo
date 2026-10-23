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
};
