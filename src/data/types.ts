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
  /** Id estável (ex.: "hira:L0"); o backup depende dele. */
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

// ---------- Texto formatado ----------

/** Trecho de texto; `ja` marca japonês (para usar a fonte e a leitura certas). */
export interface RichRun {
  text: string;
  bold?: true;
  ja?: true;
}

export interface RichParagraph {
  kind: 'p';
  runs: readonly RichRun[];
}

export interface RichTableCell {
  text: string;
  header?: true;
  ja?: true;
}

export interface RichTable {
  kind: 'table';
  rows: readonly (readonly RichTableCell[])[];
}

export type RichBlock = RichParagraph | RichTable;

// ---------- Frases, sons e viagem ----------

/** Um trecho de uma frase com kanji: o texto e, se tiver kanji, a leitura em kana (furigana). */
export interface RubySegment {
  text: string;
  reading?: string;
}

export interface PhraseExample {
  jp: string;
  /** A mesma frase escrita com kanji e a leitura de cada trecho; só nos exemplos que têm kanji. */
  ruby?: readonly RubySegment[];
  romaji: string;
  /** Tradução em português. */
  pt: string;
  /** Texto a falar, quando difere do japonês mostrado (ex.: "はし (箸)" → "箸"). */
  say?: string;
}

export interface GrammarTopic {
  id: string;
  title: string;
  body: readonly RichBlock[];
  /** Esquema da frase, ex.: "[assunto] は [informação] です". */
  pattern?: string;
  examples: readonly PhraseExample[];
}

/** Exercício "Montar": ordenar blocos para formar a frase. */
export interface BuildExercise {
  /** Id do tópico de gramática. */
  topic: string;
  pt: string;
  /** A resposta, bloco a bloco. */
  answer: readonly string[];
  /** Blocos a mais, de propósito. */
  extra: readonly string[];
  /** Outras ordens aceitas. */
  alternatives?: readonly (readonly string[])[];
  romaji: string;
  hint: string;
}

export interface SoundTopic {
  title: string;
  body: readonly RichBlock[];
  examples: readonly PhraseExample[];
}

/** Duas palavras que só diferem pela duração do som (treino de ouvido). */
export interface MinimalPair {
  first: PhraseExample;
  second: PhraseExample;
}

export interface PhrasePart {
  part: string;
  meaning: string;
}

export interface TravelPhrase {
  jp: string;
  romaji: string;
  pt: string;
  /** "Palavra por palavra". */
  breakdown: readonly PhrasePart[];
}

export interface TravelCategory {
  category: string;
  phrases: readonly TravelPhrase[];
}

// ---------- Teclado ----------

/** Tecla do teclado de flick: `chars` = [toque, esquerda, cima, direita, baixo]. A tecla "mod" é a de 小゛゜. */
export interface FlickKey {
  label: string;
  chars: string;
}

export interface TypingWord {
  word: string;
  meaning: string;
}

export interface TypingChallenge extends TypingWord {
  hint: string;
}
