import { kanaToRomaji } from '@/lib/romaji';

/**
 * Frases-modelo ("fábrica de frases"): um molde com uma lacuna, que se completa com palavras que combinam. Dá para gerar muitas
 * frases úteis na viagem trocando só uma palavra. O molde é fixo e conferido; as palavras vêm de uma lista curta por molde, só com
 * o que faz sentido ali. Escritas por IA (frases de uso corrente): precisam de revisão por um falante (ver LICENSE.md).
 */

/** Uma palavra que preenche a lacuna. `the` é o nome com artigo ("o banheiro"), para as traduções que o pedem. */
export interface SlotWord {
  /** Em kana (a escrita que o app já usa nas frases de viagem). */
  jp: string;
  pt: string;
  the: string;
}

/** Peça fixa do molde: uma palavra ou uma partícula. */
export interface FixedPiece {
  jp: string;
  particle?: boolean;
}

export interface Frame {
  id: string;
  title: string;
  /** Para que serve o molde, em uma frase. */
  use: string;
  /** O que vem antes e depois da lacuna: `before` tem peças antes da lacuna; `after`, o resto da frase. */
  before?: readonly FixedPiece[];
  /** A partícula colada à palavra da lacuna (は, を, が...), se houver. */
  slotParticle?: string;
  after: readonly FixedPiece[];
  /** A tradução, com {pt} (a palavra sozinha) ou {the} (com artigo). */
  ptTemplate: string;
  /** O que a lacuna pede, para a tela ("o que você quer?"). */
  slotLabel: string;
  words: readonly SlotWord[];
}

const w = (jp: string, pt: string, the: string = pt): SlotWord => ({ jp, pt, the });

export const FRAMES: readonly Frame[] = [
  {
    id: 'kudasai',
    title: '[coisa] を ください',
    use: 'Pedir algo: no restaurante, na loja, no conbini.',
    slotParticle: 'を',
    after: [{ jp: 'ください' }],
    ptTemplate: '{pt}, por favor',
    slotLabel: 'O que você quer?',
    words: [w('みず', 'Água'), w('おちゃ', 'Chá'), w('ビール', 'Cerveja'), w('コーヒー', 'Café'), w('メニュー', 'O cardápio'), w('ふくろ', 'Uma sacola'), w('レシート', 'O recibo'), w('おはし', 'Hashi (pauzinhos)'), w('タオル', 'Uma toalha'), w('ちず', 'Um mapa')],
  },
  {
    id: 'doko',
    title: '[lugar] は どこ ですか',
    use: 'Perguntar onde fica algo.',
    slotParticle: 'は',
    after: [{ jp: 'どこ' }, { jp: 'ですか' }],
    ptTemplate: 'Onde fica {the}?',
    slotLabel: 'O que você procura?',
    words: [w('トイレ', 'banheiro', 'o banheiro'), w('えき', 'estação', 'a estação'), w('ホテル', 'hotel', 'o hotel'), w('びょういん', 'hospital', 'o hospital'), w('やっきょく', 'farmácia', 'a farmácia'), w('ぎんこう', 'banco', 'o banco'), w('コンビニ', 'conbini', 'o conbini'), w('いりぐち', 'entrada', 'a entrada'), w('でぐち', 'saída', 'a saída'), w('バスてい', 'ponto de ônibus', 'o ponto de ônibus'), w('くうこう', 'aeroporto', 'o aeroporto'), w('エーティーエム', 'caixa eletrônico', 'o caixa eletrônico')],
  },
  {
    id: 'ikura',
    title: '[coisa] は いくら ですか',
    use: 'Perguntar o preço.',
    slotParticle: 'は',
    after: [{ jp: 'いくら' }, { jp: 'ですか' }],
    ptTemplate: 'Quanto custa {the}?',
    slotLabel: 'O que você quer saber o preço?',
    words: [w('これ', 'isto', 'isto'), w('あれ', 'aquilo', 'aquilo'), w('それ', 'isso', 'isso'), w('ビール', 'cerveja', 'a cerveja'), w('おみやげ', 'lembrança', 'a lembrança'), w('きっぷ', 'bilhete', 'o bilhete'), w('にゅうじょうりょう', 'entrada', 'a entrada'), w('ランチ', 'almoço', 'o almoço')],
  },
  {
    id: 'ikitai',
    title: '[lugar] に いきたい です',
    use: 'Dizer para onde você quer ir.',
    slotParticle: 'に',
    after: [{ jp: 'いきたい' }, { jp: 'です' }],
    ptTemplate: 'Quero ir {the}',
    slotLabel: 'Aonde você quer ir?',
    words: [w('えき', 'estação', 'à estação'), w('ホテル', 'hotel', 'ao hotel'), w('びょういん', 'hospital', 'ao hospital'), w('くうこう', 'aeroporto', 'ao aeroporto'), w('とうきょう', 'Tóquio', 'a Tóquio'), w('しんじゅく', 'Shinjuku', 'a Shinjuku'), w('きょうと', 'Quioto', 'a Quioto'), w('ぎんこう', 'banco', 'ao banco'), w('トイレ', 'banheiro', 'ao banheiro')],
  },
  {
    id: 'made',
    title: '[lugar] まで いくら ですか',
    use: 'Perguntar o preço do trajeto (táxi, trem).',
    slotParticle: 'まで',
    after: [{ jp: 'いくら' }, { jp: 'ですか' }],
    ptTemplate: 'Quanto custa até {pt}?',
    slotLabel: 'Até onde?',
    words: [w('とうきょう', 'Tóquio'), w('しんじゅく', 'Shinjuku'), w('しぶや', 'Shibuya'), w('きょうと', 'Quioto'), w('くうこう', 'o aeroporto'), w('ホテル', 'o hotel'), w('えき', 'a estação')],
  },
  {
    id: 'arimasu',
    title: '[coisa] は ありますか',
    use: 'Perguntar se tem algo.',
    slotParticle: 'は',
    after: [{ jp: 'ありますか' }],
    ptTemplate: 'Tem {pt}?',
    slotLabel: 'O que você procura?',
    words: [w('くすり', 'remédio'), w('ちず', 'mapa'), w('ワイファイ', 'Wi-Fi'), w('えいごの メニュー', 'cardápio em inglês'), w('ほかの いろ', 'outra cor'), w('おおきい の', 'um maior'), w('ちいさい の', 'um menor'), w('やすい の', 'um mais barato'), w('トイレ', 'banheiro')],
  },
  {
    id: 'arerugi',
    title: '[comida] の アレルギーが あります',
    use: 'Avisar sobre uma alergia alimentar: importante para quem viaja.',
    before: [],
    slotParticle: 'の',
    after: [{ jp: 'アレルギー', particle: false }, { jp: 'が', particle: true }, { jp: 'あります' }],
    ptTemplate: 'Tenho alergia a {pt}',
    slotLabel: 'Alergia a quê?',
    words: [w('えび', 'camarão'), w('かに', 'caranguejo'), w('たまご', 'ovo'), w('ぎゅうにゅう', 'leite'), w('そば', 'soba (macarrão de trigo-sarraceno)'), w('ピーナッツ', 'amendoim'), w('こむぎ', 'trigo'), w('さかな', 'peixe')],
  },
  {
    id: 'tabemasen',
    title: '[comida] が たべられません',
    use: 'Dizer o que você não consegue ou não pode comer.',
    slotParticle: 'が',
    after: [{ jp: 'たべられません' }],
    ptTemplate: 'Não posso comer {pt}',
    slotLabel: 'O que você não come?',
    words: [w('さかな', 'peixe'), w('ぶたにく', 'carne de porco'), w('ぎゅうにく', 'carne de vaca'), w('えび', 'camarão'), w('たまご', 'ovo'), w('にく', 'carne')],
  },
  {
    id: 'suki',
    title: '[coisa] が すき です',
    use: 'Dizer do que você gosta: ótimo para puxar conversa.',
    slotParticle: 'が',
    after: [{ jp: 'すき' }, { jp: 'です' }],
    ptTemplate: 'Eu gosto {the}',
    slotLabel: 'Do que você gosta?',
    words: [w('にほん', 'Japão', 'do Japão'), w('ラーメン', 'lámen', 'de lámen'), w('すし', 'sushi', 'de sushi'), w('コーヒー', 'café', 'de café'), w('えいが', 'filmes', 'de filmes'), w('おんがく', 'música', 'de música'), w('りょこう', 'viajar', 'de viajar'), w('さかな', 'peixe', 'de peixe')],
  },
  {
    id: 'ne',
    title: '[adjetivo] ですね',
    use: 'Puxar conversa comentando algo: o tempo, a comida, os preços.',
    after: [{ jp: 'ですね' }],
    ptTemplate: 'Está {pt}, né?',
    slotLabel: 'Como está?',
    words: [w('あつい', 'quente (calor)'), w('さむい', 'frio'), w('おいしい', 'gostoso'), w('すごい', 'incrível'), w('たかい', 'caro'), w('やすい', 'barato'), w('おおきい', 'grande'), w('きれい', 'bonito')],
  },
  {
    id: 'kara-kimashita',
    title: '[país] から きました',
    use: 'Dizer de onde você veio.',
    slotParticle: 'から',
    after: [{ jp: 'きました' }],
    ptTemplate: 'Eu vim {the}',
    slotLabel: 'De que país?',
    words: [w('ブラジル', 'Brasil', 'do Brasil'), w('ポルトガル', 'Portugal', 'de Portugal'), w('アメリカ', 'Estados Unidos', 'dos Estados Unidos'), w('カナダ', 'Canadá', 'do Canadá'), w('フランス', 'França', 'da França'), w('スペイン', 'Espanha', 'da Espanha'), w('ドイツ', 'Alemanha', 'da Alemanha'), w('イギリス', 'Inglaterra', 'da Inglaterra')],
  },
  {
    id: 'harau',
    title: '[meio] で はらえますか',
    use: 'Perguntar se dá para pagar de um jeito.',
    slotParticle: 'で',
    after: [{ jp: 'はらえます' }, { jp: 'か', particle: true }],
    ptTemplate: 'Posso pagar com {pt}?',
    slotLabel: 'Pagar com o quê?',
    words: [w('カード', 'cartão'), w('クレジットカード', 'cartão de crédito'), w('げんきん', 'dinheiro vivo'), w('アイシーカード', 'cartão IC'), w('スマホ', 'o celular'), w('デビットカード', 'cartão de débito')],
  },
  {
    id: 'te-kudasai',
    title: '[verbo na forma て] ください',
    use: 'Pedir uma ação, com educação.',
    after: [{ jp: 'ください' }],
    ptTemplate: '{pt}, por favor',
    slotLabel: 'O que você pede?',
    words: [
      w('まって', 'Espere'),
      w('みせて', 'Mostre-me'),
      w('おしえて', 'Me ensine'),
      w('たすけて', 'Me ajude'),
      w('よんで', 'Chame'),
      w('とめて', 'Pare'),
      w('かいて', 'Escreva'),
      w('いって', 'Diga'),
      w('ちょっと まって', 'Espere um pouco'),
      w('ゆっくり はなして', 'Fale devagar'),
      w('もう いちど いって', 'Diga mais uma vez'),
      w('ここに かいて', 'Escreva aqui'),
      w('これを みせて', 'Mostre-me isto'),
      w('みちを おしえて', 'Me ensine o caminho'),
      w('えいごで はなして', 'Fale em inglês'),
      w('しゃしんを とって', 'Tire uma foto'),
    ],
  },
  {
    id: 'hitotsu',
    title: '[coisa] を ひとつ ください',
    use: 'Pedir uma unidade de algo: no restaurante, no conbini.',
    slotParticle: 'を',
    after: [{ jp: 'ひとつ' }, { jp: 'ください' }],
    ptTemplate: 'Uma unidade de {pt}, por favor',
    slotLabel: 'O que você quer?',
    words: [w('ビール', 'cerveja'), w('コーヒー', 'café'), w('おちゃ', 'chá'), w('ラーメン', 'lámen'), w('おにぎり', 'onigiri'), w('ケーキ', 'bolo'), w('サンドイッチ', 'sanduíche'), w('これ', 'isto')],
  },
  {
    id: 'mou-hitotsu',
    title: '[coisa] を もう ひとつ ください',
    use: 'Pedir mais um: outra bebida, outra porção.',
    slotParticle: 'を',
    after: [{ jp: 'もう' }, { jp: 'ひとつ' }, { jp: 'ください' }],
    ptTemplate: 'Mais um(a) {pt}, por favor',
    slotLabel: 'O que você quer de novo?',
    words: [w('ビール', 'cerveja'), w('コーヒー', 'café'), w('おちゃ', 'chá'), w('みず', 'copo de água'), w('ごはん', 'arroz'), w('おはし', 'par de hashi'), w('おしぼり', 'toalhinha úmida'), w('これ', 'isto')],
  },
  {
    id: 'te-mo-ii',
    title: '[verbo na forma て] も いいですか',
    use: 'Pedir permissão: fotos, sentar, tocar, usar algo.',
    slotParticle: 'も',
    after: [{ jp: 'いい' }, { jp: 'ですか' }],
    ptTemplate: 'Posso {pt}?',
    slotLabel: 'O que você quer fazer?',
    words: [
      w('しゃしんを とって', 'tirar uma foto'),
      w('ここに すわって', 'sentar aqui'),
      w('ここで たべて', 'comer aqui'),
      w('ここで まって', 'esperar aqui'),
      w('これを さわって', 'tocar nisto'),
      w('まどを あけて', 'abrir a janela'),
      w('でんわを つかって', 'usar o telefone'),
      w('かばんを おいて', 'deixar a bolsa'),
    ],
  },
  {
    id: 'tai',
    title: '[verbo] たい です',
    use: 'Dizer o que você quer fazer (forma たい).',
    after: [{ jp: 'です' }],
    ptTemplate: 'Eu quero {pt}',
    slotLabel: 'O que você quer fazer?',
    words: [w('たべたい', 'comer'), w('のみたい', 'beber'), w('かいたい', 'comprar'), w('みたい', 'ver'), w('ねたい', 'dormir'), w('やすみたい', 'descansar'), w('かえりたい', 'voltar para casa'), w('あいたい', 'encontrar')],
  },
  {
    id: 'naide',
    title: '[verbo na forma ない] で ください',
    use: 'Pedir para não fazer algo, como nos avisos (não toque, não fume).',
    after: [{ jp: 'ください' }],
    ptTemplate: 'Por favor, {pt}',
    slotLabel: 'O que não fazer?',
    words: [
      w('さわらないで', 'não toque'),
      w('はいらないで', 'não entre'),
      w('すわらないで', 'não se sente'),
      w('たばこを すわないで', 'não fume'),
      w('しゃしんを とらないで', 'não tire fotos'),
      w('はしらないで', 'não corra'),
      w('おさないで', 'não empurre'),
      w('わすれないで', 'não esqueça'),
    ],
  },
  {
    id: 'hora-ni',
    title: '[hora] に あいましょう',
    use: 'Combinar um horário de encontro.',
    slotParticle: 'に',
    after: [{ jp: 'あいましょう' }],
    ptTemplate: 'Vamos nos encontrar {pt}',
    slotLabel: 'A que horas?',
    words: [w('いちじ', 'à 1 hora'), w('にじ', 'às 2 horas'), w('さんじ', 'às 3 horas'), w('よじ', 'às 4 horas'), w('ごじ', 'às 5 horas'), w('ろくじ', 'às 6 horas'), w('しちじ', 'às 7 horas'), w('はちじ', 'às 8 horas'), w('くじ', 'às 9 horas'), w('ごじはん', 'às 5 e meia')],
  },
  {
    id: 'checkin',
    title: 'チェックインは [hora] から です',
    use: 'Perguntar ou confirmar o horário do check-in no hotel.',
    before: [{ jp: 'チェックイン' }, { jp: 'は', particle: true }],
    slotParticle: 'から',
    after: [{ jp: 'です' }],
    ptTemplate: 'O check-in é a partir {pt}',
    slotLabel: 'A partir de que horas?',
    words: [w('にじ', 'das 2 horas'), w('さんじ', 'das 3 horas'), w('よじ', 'das 4 horas'), w('ごじ', 'das 5 horas'), w('ろくじ', 'das 6 horas'), w('ごご さんじ', 'das 3 da tarde')],
  },
  {
    id: 'checkout',
    title: 'チェックアウトは [hora] まで です',
    use: 'Perguntar ou confirmar o horário do check-out no hotel.',
    before: [{ jp: 'チェックアウト' }, { jp: 'は', particle: true }],
    slotParticle: 'まで',
    after: [{ jp: 'です' }],
    ptTemplate: 'O check-out é até {pt}',
    slotLabel: 'Até que horas?',
    words: [w('くじ', 'às 9 horas'), w('じゅうじ', 'às 10 horas'), w('じゅういちじ', 'às 11 horas'), w('じゅうにじ', 'às 12 horas'), w('じゅうじはん', 'às 10 e meia'), w('ごぜん じゅうじ', 'às 10 da manhã')],
  },
  {
    id: 'quando-iku',
    title: '[quando] いきます',
    use: 'Dizer quando você vai a algum lugar.',
    after: [{ jp: 'いきます' }],
    ptTemplate: 'Eu vou {pt}',
    slotLabel: 'Quando?',
    words: [w('きょう', 'hoje'), w('あした', 'amanhã'), w('あさって', 'depois de amanhã'), w('らいしゅう', 'na semana que vem'), w('らいげつ', 'no mês que vem'), w('らいねん', 'no ano que vem')],
  },
  {
    id: 'tsuki-ni',
    title: '[mês] に にほんへ いきます',
    use: 'Dizer em que mês você viaja ao Japão.',
    slotParticle: 'に',
    after: [{ jp: 'にほん' }, { jp: 'へ', particle: true }, { jp: 'いきます' }],
    ptTemplate: 'Eu vou ao Japão em {pt}',
    slotLabel: 'Em que mês?',
    words: [w('いちがつ', 'janeiro'), w('にがつ', 'fevereiro'), w('さんがつ', 'março'), w('しがつ', 'abril'), w('ごがつ', 'maio'), w('ろくがつ', 'junho'), w('しちがつ', 'julho'), w('はちがつ', 'agosto'), w('くがつ', 'setembro'), w('じゅうがつ', 'outubro'), w('じゅういちがつ', 'novembro'), w('じゅうにがつ', 'dezembro')],
  },
  {
    id: 'yasumi',
    title: '[dia da semana] は やすみ ですか',
    use: 'Perguntar se a loja ou atração fecha em certo dia.',
    slotParticle: 'は',
    after: [{ jp: 'やすみ' }, { jp: 'ですか' }],
    ptTemplate: 'Fecha {the}?',
    slotLabel: 'Que dia?',
    words: [w('げつようび', 'segunda-feira', 'na segunda-feira'), w('かようび', 'terça-feira', 'na terça-feira'), w('すいようび', 'quarta-feira', 'na quarta-feira'), w('もくようび', 'quinta-feira', 'na quinta-feira'), w('きんようび', 'sexta-feira', 'na sexta-feira'), w('どようび', 'sábado', 'no sábado'), w('にちようび', 'domingo', 'no domingo')],
  },
];

/** Uma frase pronta: a lacuna preenchida. */
export interface FilledFrame {
  jp: string;
  romaji: string;
  pt: string;
  /** As peças em ordem, cada uma com sua partícula, para mostrar em blocos. */
  pieces: { text: string; kind: 'word' | 'particle' | 'aux' }[];
}

const AUX = new Set(['です', 'ですか', 'ください']);

/** Romaji de uma peça: a pergunta (か) e o ね que fecham a frase se escrevem à parte ("arimasu ka", "desu ne"). */
const romajiOfWord = (jp: string): string => {
  const ending = /(す)([かね])$/.exec(jp);
  if (jp.length > 1 && ending) return `${romajiOfWord(jp.slice(0, -1))} ${ending[2] === 'か' ? 'ka' : 'ne'}`;
  return jp
    .split(' ')
    .map(partRomaji)
    .join(' ');
};

const ATTACHED_PARTICLES: ReadonlySet<string> = new Set(['は', 'へ', 'を']);

/** Romaji de um pedaço sem espaços; は, へ e を colados no fim (しゃしんを) são partículas e se leem wa, e, o. */
function partRomaji(part: string): string {
  const last = part.at(-1) ?? '';
  if (part.length > 1 && ATTACHED_PARTICLES.has(last)) return `${kanaToRomaji(part.slice(0, -1))} ${kanaToRomaji(last, { particle: true })}`;
  return kanaToRomaji(part);
}

/** Monta a frase: palavra da lacuna + partícula colada, depois as peças do molde. */
export function fillFrame(frame: Frame, word: SlotWord): FilledFrame {
  const pieces: FilledFrame['pieces'] = [
    ...(frame.before ?? []).map((p) => ({ text: p.jp, kind: p.particle ? ('particle' as const) : ('word' as const) })),
    { text: word.jp, kind: 'word' },
    ...(frame.slotParticle ? [{ text: frame.slotParticle, kind: 'particle' as const }] : []),
    ...frame.after.map((p) => ({ text: p.jp, kind: p.particle ? ('particle' as const) : AUX.has(p.jp) ? ('aux' as const) : ('word' as const) })),
  ];

  // O texto: palavra e partícula coladas; um espaço entre os blocos.
  const blocks: string[] = [];
  const romaji: string[] = [];
  for (const piece of pieces) {
    if (piece.kind === 'particle' && blocks.length > 0) {
      blocks[blocks.length - 1] += piece.text;
      romaji[romaji.length - 1] += ` ${kanaToRomaji(piece.text, { particle: true })}`;
    } else {
      blocks.push(piece.text);
      romaji.push(romajiOfWord(piece.text));
    }
  }
  return {
    jp: blocks.join(' '),
    romaji: romaji.join(' ').replace(/\s+/g, ' ').trim(),
    pt: frame.ptTemplate.replace('{pt}', word.pt).replace('{the}', word.the),
    pieces,
  };
}
