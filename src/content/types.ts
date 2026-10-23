/** De onde a palavra vem na trilha: tem a ver com a escrita em que ela aparece. */
export type VocabKind = 'hira' | 'kata' | 'kanji' | 'misc';

export interface VocabWord {
  /** Identificador estável: a própria palavra em japonês (é a chave nos cartões de revisão e no backup). */
  id: string;
  /** Como se escreve. */
  jp: string;
  /** Leitura em kana. Nas palavras só de kana é igual a `jp`. */
  reading: string;
  /** Romaji, quando a fonte traz. */
  romaji?: string;
  /** Significado em português. */
  meaning: string;
  kind: VocabKind;
  /** Tema/grupo para escolher o que estudar (ex.: "Números", "Katakana"). */
  group: string;
  /** Kanji usados na palavra, na ordem em que aparecem. */
  kanji: readonly string[];
}

export interface VocabGroup {
  id: string;
  label: string;
}

/** Palavra vinda de uma lista externa (ex.: JLPT N5), antes de virar `VocabWord`. */
export interface SourceWord {
  jp: string;
  reading: string;
  /** Significado em português (tradução). */
  meaning: string;
  /** Significado original, em inglês, para conferir a tradução. */
  en: string;
  /** Assunto (mesmos nomes dos grupos dos kanji quando é o mesmo tema). */
  group: string;
  /** Lição do Genki (livro-texto) em que a palavra aparece, quando se sabe. */
  lesson?: number;
}
