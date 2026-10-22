/** As três escritas estudadas. */
export type Script = 'hira' | 'kata' | 'kanji';

/** Subconjunto de kana: básico, dakuten/handakuten, combinações (yoon) e sons estrangeiros. */
export type KanaGroup = 'base' | 'daku' | 'yoon' | 'ext';

export interface KanaChar {
  char: string;
  romaji: string;
  script: 'hira' | 'kata';
  group: KanaGroup;
  /** Linha da tabela, ex.: "hira:b:k" (linha K básica) ou "kata:yoon". */
  row: string;
}

export interface KanjiCategory {
  id: string;
  label: string;
  chars: string;
}

export interface Kanji {
  char: string;
  /** Significado em português. */
  meaning: string;
  /** Leituras on'yomi (katakana). Vazio = sem leitura. */
  on: readonly string[];
  /** Leituras kun'yomi (hiragana). Vazio = sem leitura. */
  kun: readonly string[];
  /** Id de KanjiCategory. */
  category: string;
}

export interface KanaExample {
  word: string;
  romaji: string;
  meaning: string;
}

export interface KanjiExample {
  word: string;
  /** Leitura em hiragana. */
  reading: string;
  meaning: string;
}

export interface Lesson {
  /** Mesmo id do protótipo HTML (ex.: "hira:L0"); o backup depende dele. */
  id: string;
  title: string;
  /** Caracteres da lição, na ordem de estudo. */
  items: readonly string[];
  /** Lição de revisão: vai direto ao teste. */
  review?: boolean;
}

export interface StrokeData {
  /** Caminhos SVG (viewBox 0 0 109 109), na ordem em que se desenha. */
  p: readonly string[];
  /** Posição [x, y] do número de cada traço. */
  n: readonly (readonly [number, number])[];
}
