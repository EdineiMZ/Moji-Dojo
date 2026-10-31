import { findWord, type VocabWord } from '@/content';
import type { Rng } from '@/features/quiz/quiz';
import { shuffle } from '@/features/quiz/quiz';
import { FURNITURE, ROOMS } from './home';

/**
 * O método de estudo da Casa do Mochi: cada cômodo e cada móvel é uma palavra de japonês. Para colocar o móvel na casa, a
 * pessoa aprende a palavra (ouve, lê e escolhe o significado); ela entra nas revisões; e a visita guiada refaz as palavras da
 * casa. A tabela diz qual palavra do vocabulário é a de cada peça.
 */
export const HOUSE_WORD_ID: Readonly<Record<string, string>> = {
  // cômodos
  quarto: '寝室',
  jardim: '庭',
  escritorio: '書斎',
  varanda: 'ベランダ',
  sala: '居間',
  cozinha: '台所',
  ofuro: 'お風呂',
  // quarto
  cama: 'ベッド',
  tapete: '絨毯',
  abajur: 'ランプ',
  'estante-quarto': '棚',
  janela: '窓',
  // jardim
  cerca: '柵',
  canteiro: '花壇',
  arvore: '木',
  lago: '池',
  banco: 'ベンチ',
  // escritório
  mesa: '机',
  quadro: '絵',
  livros: '本',
  lanterna: '提灯',
  planta: '植物',
  // varanda
  grade: '手すり',
  furin: '風鈴',
  vasos: '植木鉢',
  'mesinha-cha': 'お茶',
  'lanterna-pedra': '灯籠',
  // sala
  sofa: 'ソファー',
  kotatsu: 'こたつ',
  tv: 'テレビ',
  almofadas: '座布団',
  relogio: '時計',
  // cozinha
  geladeira: '冷蔵庫',
  fogao: '鍋',
  'prateleira-cozinha': '皿',
  frutas: '果物',
  banqueta: '椅子',
  // ofurô
  banheira: '浴槽',
  banquinho: '桶',
  toalhas: 'タオル',
  bambu: '竹',
  patinho: 'アヒル',
};

/** A palavra de um cômodo ou de um móvel. */
export const houseWordOf = (id: string): VocabWord | undefined => {
  const wordId = HOUSE_WORD_ID[id];
  return wordId === undefined ? undefined : findWord(wordId);
};

/** Ids (de cômodo ou móvel) de uma lista de ids comprados que têm palavra. */
export const wordsOf = (ids: readonly string[]): VocabWord[] => ids.flatMap((id) => houseWordOf(id) ?? []);

/** As palavras de todas as peças da casa, para sortear alternativas erradas. */
const ALL_HOUSE_WORDS = (): VocabWord[] => [...ROOMS.map((r) => r.id), ...FURNITURE.map((f) => f.id)].flatMap((id) => houseWordOf(id) ?? []);

/** Uma pergunta de múltipla escolha: `options` são os significados, e `answer` é a posição do certo. */
export interface HouseQuestion {
  word: VocabWord;
  /** 'jm': vê o japonês e escolhe o significado; 'mj': vê o significado e escolhe o japonês. */
  dir: 'jm' | 'mj';
  options: readonly string[];
  answer: number;
}

/** Monta a pergunta de uma palavra com três alternativas erradas tiradas de outras palavras da casa. */
export function houseQuestion(word: VocabWord, dir: 'jm' | 'mj', rng: Rng = Math.random, wrongCount = 2): HouseQuestion {
  const label = (w: VocabWord): string => (dir === 'jm' ? w.meaning : w.jp);
  const right = label(word);
  const others = [...new Set(ALL_HOUSE_WORDS().filter((w) => w.id !== word.id).map(label))].filter((l) => l !== right);
  const wrong = shuffle(others, rng).slice(0, wrongCount);
  const options = shuffle([right, ...wrong], rng);
  return { word, dir, options, answer: options.indexOf(right) };
}

/** As perguntas de uma visita guiada: até `count` palavras da casa, sem repetir, metade lendo e metade a partir do significado. */
export function visitQuestions(owned: readonly VocabWord[], count: number, rng: Rng = Math.random): HouseQuestion[] {
  return shuffle(owned, rng)
    .slice(0, count)
    .map((word, i) => houseQuestion(word, i % 2 === 0 ? 'jm' : 'mj', rng, 3));
}
