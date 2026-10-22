// Gerado por scripts/extract-data.mjs a partir de "Nihongo Dojo.html". Não edite à mão.
import type { FlickKey, TypingChallenge, TypingWord } from './types';

/** Teclas do teclado de flick (a tecla com label "mod" é a de 小゛゜). chars = [toque, esquerda, cima, direita, baixo]. */
export const FLICK_KEYS: readonly FlickKey[] = [
  {"label":"あ","chars":"あいうえお"},
  {"label":"か","chars":"かきくけこ"},
  {"label":"さ","chars":"さしすせそ"},
  {"label":"た","chars":"たちつてと"},
  {"label":"な","chars":"なにぬねの"},
  {"label":"は","chars":"はひふへほ"},
  {"label":"ま","chars":"まみむめも"},
  {"label":"や","chars":"や「ゆ」よ"},
  {"label":"ら","chars":"らりるれろ"},
  {"label":"mod","chars":"小゛゜"},
  {"label":"わ","chars":"わをんー〜"},
  {"label":"、","chars":"、。？！…"},
];

/** Cada item é uma sequência de variações de um kana; a tecla 小゛゜ avança para a próxima. */
export const DAKUTEN_CYCLES: readonly string[] = ["かが","きぎ","くぐ","けげ","こご","さざ","しじ","すず","せぜ","そぞ","ただ","ちぢ","つっづ","てで","とど","はばぱ","ひびぴ","ふぶぷ","へべぺ","ほぼぽ","あぁ","いぃ","うぅ","えぇ","おぉ","やゃ","ゆゅ","よょ","わゎ"];

/** Nome de cada direção, na mesma ordem de FlickKey.chars. */
export const DIRECTION_NAMES: readonly string[] = ["toque e solte","deslize para a esquerda ←","deslize para cima ↑","deslize para a direita →","deslize para baixo ↓"];

/** Palavras do simulador de teclado. */
export const SIMULATOR_WORDS: readonly TypingWord[] = [
  {"word":"ねこ","meaning":"gato"},
  {"word":"いぬ","meaning":"cachorro"},
  {"word":"すし","meaning":"sushi"},
  {"word":"さくら","meaning":"cerejeira"},
  {"word":"みず","meaning":"água"},
  {"word":"ありがとう","meaning":"obrigado"},
  {"word":"おはよう","meaning":"bom dia"},
  {"word":"ひらがな","meaning":"hiragana"},
  {"word":"きって","meaning":"selo"},
  {"word":"でんしゃ","meaning":"trem"},
  {"word":"がっこう","meaning":"escola"},
  {"word":"らーめん","meaning":"lámen (no teclado real, depois você converte para ラーメン)"},
  {"word":"こんにちは","meaning":"olá"},
  {"word":"ぎゅうにゅう","meaning":"leite"},
];

/** Desafios para digitar com o teclado de verdade do celular. */
export const TYPING_CHALLENGES: readonly TypingChallenge[] = [
  {"word":"ねこ","meaning":"gato","hint":"Só hiragana."},
  {"word":"ありがとう","meaning":"obrigado","hint":"Lembre do う no final."},
  {"word":"すみません","meaning":"com licença","hint":""},
  {"word":"きって","meaning":"selo","hint":"O っ pequeno: digite つ e toque em 小゛゜. No PC: kitte."},
  {"word":"ラーメン","meaning":"lámen","hint":"Digite らーめん e escolha ラーメン nas sugestões. No PC, F7 converte para katakana."},
  {"word":"コーヒー","meaning":"café","hint":"Digite こーひー e escolha a versão em katakana."},
  {"word":"日本","meaning":"Japão","hint":"Digite にほん e escolha 日本 nas sugestões."},
  {"word":"東京","meaning":"Tóquio","hint":"Digite とうきょう e escolha 東京."},
  {"word":"わたしはブラジルじんです","meaning":"eu sou brasileiro","hint":"A frase inteira. Pode usar espaços, eles são ignorados."},
];
