import { ALL_KANJI } from '@/content/kanji';
import { ALL_TRAVEL_PHRASES } from '@/content/travel';
import { findWord, VOCAB, type VocabWord } from '@/content';
import { ALL_ITEMS } from '@/features/catalog';
import { findLeeches } from '@/features/leeches/leeches';
import type { MyPhrases } from '@/features/myphrases/phrases';
import { shuffle, type Rng } from '@/features/quiz/quiz';
import type { SrsState } from '@/features/review/srs';
import { cardKey, learnedWordIds } from '@/features/vocab/cards';
import { kanaToRomaji } from '@/lib/romaji';

export type DeckId = 'words' | 'new-words' | 'leeches' | 'kana' | 'kanji' | 'travel' | 'mine';

export const DECKS: readonly { id: DeckId; label: string; hint: string }[] = [
  { id: 'words', label: 'Palavras que estudo', hint: 'As palavras que já entraram na sua revisão. Suas respostas contam para a revisão espaçada.' },
  { id: 'new-words', label: 'Palavras novas', hint: 'Palavras que você ainda não estuda. Marque as que quer aprender e elas entram na revisão.' },
  { id: 'leeches', label: 'Itens teimosos', hint: 'As palavras que você esquece sempre.' },
  { id: 'kana', label: 'Kana', hint: 'Hiragana e katakana, do caractere para o som.' },
  { id: 'kanji', label: 'Kanji', hint: 'Do kanji para o significado e as leituras.' },
  { id: 'travel', label: 'Frases de viagem', hint: 'Frases úteis para a viagem, com o romaji.' },
  { id: 'mine', label: 'Minhas frases', hint: 'As frases que você mesmo guardou.' },
];

/** Direção dos cartões de palavras e frases: do japonês para o português, o contrário, ou sorteando. */
export type Direction = 'jp-pt' | 'pt-jp' | 'mixed';

export const DIRECTIONS: readonly { value: Direction; label: string }[] = [
  { value: 'jp-pt', label: 'Japonês → português' },
  { value: 'pt-jp', label: 'Português → japonês' },
  { value: 'mixed', label: 'Misturado' },
];

/** Como a resposta é registrada no progresso (quando o cartão faz parte de uma revisão). */
export type Grade = { kind: 'vocab'; key: string } | { kind: 'kana'; char: string } | { kind: 'learn'; wordId: string };

export interface FlashCard {
  id: string;
  front: string;
  frontSub?: string;
  back: string;
  backSub?: string;
  /** O que a voz lê (em kana quando a escrita tem kanji). */
  say?: string;
  grade?: Grade;
}

export interface DeckSources {
  vocab: SrsState;
  srs: SrsState;
  conj: SrsState;
  particles: SrsState;
  myPhrases: MyPhrases;
}

/** Quantos cartões cabem numa rodada. */
export const ROUND_SIZES: readonly number[] = [10, 20, 40];

const pickDirection = (direction: Direction, rng: Rng): 'jp-pt' | 'pt-jp' => (direction === 'mixed' ? (rng() < 0.5 ? 'jp-pt' : 'pt-jp') : direction);

const hasKanji = (text: string): boolean => /[一-鿿]/.test(text);

/** Cartão de uma palavra do vocabulário. A chave de revisão só vale para quem já estuda a palavra. */
export function wordCard(word: VocabWord, dir: 'jp-pt' | 'pt-jp', studied: boolean): FlashCard {
  const reading = word.reading !== word.jp ? word.reading : undefined;
  const romaji = kanaToRomaji(word.reading);
  const grade: Grade = studied ? { kind: 'vocab', key: cardKey(word.id, dir === 'jp-pt' ? 'jm' : 'mj') } : { kind: 'learn', wordId: word.id };
  const backSub = [reading, romaji].filter(Boolean).join(' · ');
  const base = { id: `${word.id}|${dir}`, say: word.reading, grade };
  return dir === 'jp-pt' ? { ...base, front: word.jp, back: word.meaning, backSub } : { ...base, front: word.meaning, back: word.jp, backSub };
}

/** Cartão de uma frase (viagem ou sua): português de um lado, japonês do outro. */
function phraseCard(id: string, jp: string, pt: string, dir: 'jp-pt' | 'pt-jp', romaji?: string): FlashCard {
  const say = jp.replace(/ /g, '');
  const sub = romaji ?? (hasKanji(jp) ? undefined : kanaToRomaji(say));
  return dir === 'jp-pt'
    ? { id: `${id}|${dir}`, front: jp, back: pt, ...(sub ? { backSub: sub } : {}), say }
    : { id: `${id}|${dir}`, front: pt, back: jp, ...(sub ? { backSub: sub } : {}), say };
}

/** Quantos cartões o baralho tem agora (para mostrar na escolha). */
export function deckCount(id: DeckId, sources: DeckSources): number {
  return buildDeck(id, sources, { direction: 'jp-pt', size: Number.MAX_SAFE_INTEGER, rng: () => 0.5 }).length;
}

export interface BuildOptions {
  direction: Direction;
  size: number;
  rng?: Rng;
}

/** Monta uma rodada: cartões sorteados do baralho, até o tamanho pedido. */
export function buildDeck(id: DeckId, sources: DeckSources, { direction, size, rng = Math.random }: BuildOptions): FlashCard[] {
  const learned = learnedWordIds(sources.vocab);
  let cards: FlashCard[];
  switch (id) {
    case 'words':
      cards = VOCAB.filter((w) => learned.has(w.id)).map((w) => wordCard(w, pickDirection(direction, rng), true));
      break;
    case 'new-words':
      cards = VOCAB.filter((w) => !learned.has(w.id)).map((w) => wordCard(w, pickDirection(direction, rng), false));
      break;
    case 'leeches':
      cards = findLeeches(sources).flatMap((l) => {
        const word = l.area === 'vocab' && l.id ? findWord(l.id) : undefined;
        return word ? [wordCard(word, pickDirection(direction, rng), true)] : [];
      });
      break;
    case 'kana': {
      const items = ALL_ITEMS.filter((i) => i.script === 'hira' || i.script === 'kata');
      const studied = items.filter((i) => sources.srs[i.char] !== undefined);
      cards = (studied.length > 0 ? studied : items).map((i) => ({
        id: i.char,
        front: i.char,
        back: i.label,
        say: i.char,
        grade: { kind: 'kana' as const, char: i.char },
      }));
      break;
    }
    case 'kanji': {
      const studied = ALL_KANJI.filter((k) => sources.srs[k.char] !== undefined);
      cards = (studied.length > 0 ? studied : ALL_KANJI).map((k) => ({
        id: k.char,
        front: k.char,
        back: k.meaning,
        backSub: [k.on.length > 0 ? `音 ${k.on.join('、')}` : '', k.kun.length > 0 ? `訓 ${k.kun.join('、')}` : ''].filter(Boolean).join('   '),
        ...(k.kun[0] || k.on[0] ? { say: (k.kun[0] ?? k.on[0] ?? '').replace(/[.\-]/g, '') } : {}),
      }));
      break;
    }
    case 'travel':
      cards = ALL_TRAVEL_PHRASES.map((p) => phraseCard(`t:${p.jp}`, p.jp, p.pt, pickDirection(direction, rng), p.romaji));
      break;
    case 'mine':
      cards = Object.entries(sources.myPhrases).map(([phraseId, p]) => phraseCard(`m:${phraseId}`, p.jp, p.pt, pickDirection(direction, rng)));
      break;
  }
  return shuffle(cards, rng).slice(0, Math.max(0, size));
}
