/**
 * Extras de palavras que precisam de mais do que "japonês = significado": como aparecem na tela (sufixos escrevem-se
 * "〜にくい", não "にくい") e um exemplo de uso com tradução. Fica fora de n1.ts a n5.ts porque eles são gerados.
 *
 * Os exemplos são frases do Tatoeba (https://tatoeba.org), licença CC BY 2.0 FR, com o número da frase para conferir.
 * Nenhuma frase foi escrita por IA. As leituras em kana marcadas "à mão" foram escritas a partir do texto e precisam de revisão.
 */

export interface WordExample {
  /** A frase como está no Tatoeba. */
  jp: string;
  /** Leitura em kana, para quem ainda não lê o kanji. */
  reading: string;
  /** Tradução em português (também do Tatoeba). */
  pt: string;
  /** Número da frase no Tatoeba. */
  tatoeba: number;
}

export interface WordExtra {
  /** Como a palavra aparece na tela, quando difere do `jp` (ex.: "〜にくい"). */
  display?: string;
  example?: WordExample;
}

export const WORD_EXTRAS: Readonly<Record<string, WordExtra>> = {
  にくい: {
    display: '〜にくい',
    example: { jp: 'イメージしにくい。', reading: 'イメージしにくい。', pt: 'É difícil imaginar.', tatoeba: 11995722 },
  },
  やすい: {
    display: '〜やすい',
    example: { jp: 'この機械は扱いやすい。', reading: 'このきかいはあつかいやすい。', pt: 'Esta máquina é fácil de manejar.', tatoeba: 222474 },
  },
  難い: { display: '〜がたい' },
  がち: {
    display: '〜がち',
    example: {
      jp: '歴史を無視する人はとかくあやまちを繰り返しがちだ。',
      reading: 'れきしをむしするひとはとかくあやまちをくりかえしがちだ。', // leitura escrita à mão
      pt: 'As pessoas que ignoram a História tendem a repeti-la.',
      tatoeba: 6855715,
    },
  },
  だらけ: {
    display: '〜だらけ',
    example: { jp: '彼は泥だらけだった。', reading: 'かれはどろだらけだった。', pt: 'Ele estava coberto de lama.', tatoeba: 101972 },
  },
  ぽい: {
    display: '〜っぽい',
    example: { jp: '体が熱っぽいんだ。', reading: 'からだがねつっぽいんだ。', pt: 'Estou com febre.', tatoeba: 138015 }, // leitura escrita à mão
  },
  みたい: {
    display: '〜みたい',
    example: { jp: '警官みたいですね。', reading: 'けいかんみたいですね。', pt: 'Você parece um policial.', tatoeba: 3385029 },
  },
  まみれ: {
    display: '〜まみれ',
    example: { jp: '机は埃まみれだ。', reading: 'つくえはほこりまみれだ。', pt: 'Há uma camada de pó sobre a mesa.', tatoeba: 10735611 },
  },
  ずつ: {
    display: '〜ずつ',
    example: { jp: '彼は少しずつよくなっています。', reading: 'かれはすこしずつよくなっています。', pt: 'Ele está melhorando aos poucos.', tatoeba: 104121 }, // leitura escrita à mão
  },
  ごと: {
    display: '〜ごと',
    example: {
      jp: '丸ごと馬一匹を食べられるくらい腹が減っている。',
      reading: 'まるごとうまいっぴきをたべられるくらいはらがへっている。', // leitura escrita à mão
      pt: 'Estou com tanta fome que poderia comer um cavalo.',
      tatoeba: 495098,
    },
  },
  はず: {
    example: { jp: '正午までにはそこに着くはずだ。', reading: 'しょうごまでにはそこにつくはずだ。', pt: 'Devemos estar lá pelo meio-dia.', tatoeba: 142944 },
  },
};
