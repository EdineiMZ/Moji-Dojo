import { VOCAB, findWord } from '@/content';
import { pronunciationText } from '@/features/catalog';
import { explainItem } from '@/features/quiz/explain';
import { DAY_MS } from '@/features/review/srs';
import {
  cardDirs,
  cardKey,
  cardKeysFor,
  dueCards,
  isKanaOnly,
  learnedWordIds,
  newWords,
  parseCardKey,
  vocabCounts,
} from './cards';
import { buildVocabOptions, buildVocabQuestions, questionCardKey, toQuizItem } from './questions';

/** Sorteio repetível: sequência fixa de números em [0, 1). */
const seeded = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

const kanaWord = VOCAB.find((w) => isKanaOnly(w)) as (typeof VOCAB)[number];
const kanjiWord = VOCAB.find((w) => !isKanaOnly(w)) as (typeof VOCAB)[number];
const NOW = 1_800_000_000_000;

describe('cartões', () => {
  it('palavra só de kana tem 3 cartões (com áudio); com kanji, 3 (com a leitura)', () => {
    expect(cardDirs(kanaWord)).toEqual(['jm', 'mj', 'au']);
    expect(cardDirs(kanjiWord)).toEqual(['jm', 'mj', 'rd']);
    expect(cardKeysFor(kanjiWord)).toEqual([`${kanjiWord.id}|jm`, `${kanjiWord.id}|mj`, `${kanjiWord.id}|rd`]);
  });

  it('a chave vai e volta; chave inválida, palavra desconhecida ou direção que não vale dão null', () => {
    expect(parseCardKey(cardKey(kanaWord.id, 'au'))).toEqual({ word: kanaWord, dir: 'au' });
    expect(parseCardKey('sem separador')).toBeNull();
    expect(parseCardKey('|jm')).toBeNull();
    expect(parseCardKey('palavra que não existe|jm')).toBeNull();
    expect(parseCardKey(`${kanjiWord.id}|au`)).toBeNull(); // áudio não vale para palavra com kanji
    expect(parseCardKey(`${kanaWord.id}|xx`)).toBeNull();
  });
});

describe('progresso do vocabulário', () => {
  const vocab = Object.fromEntries(cardKeysFor(kanaWord).map((k) => [k, { b: 1, due: NOW - 1 }]));

  it('conta palavras aprendidas (não cartões) e o que vence', () => {
    expect(learnedWordIds(vocab)).toEqual(new Set([kanaWord.id]));
    expect(vocabCounts(vocab, NOW)).toEqual({ learned: 1, total: VOCAB.length, due: 3 });
    expect(vocabCounts({}, NOW)).toEqual({ learned: 0, total: VOCAB.length, due: 0 });
  });

  it('ignora chaves que não existem mais', () => {
    const withStale = { ...vocab, 'palavra antiga|jm': { b: 3, due: NOW - 1 } };
    expect(learnedWordIds(withStale).size).toBe(1);
    expect(dueCards(withStale, NOW)).toHaveLength(3);
  });

  it('os mais atrasados vêm primeiro e os futuros não aparecem', () => {
    const k = cardKeysFor(kanaWord);
    const mixed = { [k[0] as string]: { b: 1, due: NOW - 2 * DAY_MS }, [k[1] as string]: { b: 1, due: NOW - DAY_MS }, [k[2] as string]: { b: 1, due: NOW + DAY_MS } };
    expect(dueCards(mixed, NOW)).toEqual([k[0], k[1]]);
  });

  it('newWords tira as já aprendidas, mantém a ordem e filtra por grupo', () => {
    const rest = newWords(vocab);
    expect(rest).toHaveLength(VOCAB.length - 1);
    expect(rest.find((w) => w.id === kanaWord.id)).toBeUndefined();
    expect(rest[0]?.id).toBe(VOCAB[1]?.id);
    const group = kanjiWord.group;
    expect(newWords({}, group).every((w) => w.group === group)).toBe(true);
    expect(newWords({}, 'grupo que não existe')).toEqual([]);
  });
});

describe('perguntas', () => {
  it('a palavra vira um item de quiz; a leitura só entra quando é diferente do texto', () => {
    expect(toQuizItem(kanaWord)).toEqual({ char: kanaWord.jp, label: kanaWord.meaning, script: 'pair' });
    expect(toQuizItem(kanjiWord)).toEqual({ char: kanjiWord.jp, label: kanjiWord.meaning, script: 'pair', reading: kanjiWord.reading });
  });

  it('a voz lê a leitura (kanji) e a explicação mostra texto, leitura e significado', () => {
    const item = toQuizItem(kanjiWord);
    expect(pronunciationText(item)).toBe(kanjiWord.reading);
    expect(explainItem(item)).toBe(`${kanjiWord.jp} (${kanjiWord.reading}) = ${kanjiWord.meaning}`);
    expect(explainItem(toQuizItem(kanaWord))).toBe(`${kanaWord.jp} = ${kanaWord.meaning}`);
    expect(pronunciationText(toQuizItem(kanaWord))).toBe(kanaWord.jp);
  });

  it('4 alternativas, a certa entre elas, sem repetir palavra nem significado', () => {
    for (let i = 1; i <= 60; i++) {
      const word = VOCAB[(i * 7) % VOCAB.length] as (typeof VOCAB)[number];
      const options = buildVocabOptions(word, seeded(i));
      expect(options).toHaveLength(4);
      expect(options.map((o) => o.char)).toContain(word.jp);
      expect(new Set(options.map((o) => o.char)).size).toBe(4);
      expect(new Set(options.map((o) => o.label)).size).toBe(4);
    }
  });

  it('prefere distratores do mesmo grupo', () => {
    const word = VOCAB.find((w) => w.group === 'Números') as (typeof VOCAB)[number];
    const options = buildVocabOptions(word, seeded(3));
    const groupSize = VOCAB.filter((w) => w.group === word.group).length;
    const same = options.filter((o) => findWord(o.char)?.group === word.group).length;
    expect(same).toBe(Math.min(4, groupSize));
  });

  it('a direção do cartão vira a direção do quiz e dá para voltar à chave', () => {
    const keys = [cardKey(kanaWord.id, 'jm'), cardKey(kanaWord.id, 'mj'), cardKey(kanaWord.id, 'au')];
    const questions = buildVocabQuestions(keys, seeded(5));
    expect(questions.map((q) => q.direction).sort()).toEqual(['audio', 'k2r', 'r2k']);
    expect(questions.map(questionCardKey).sort()).toEqual([...keys].sort());
    expect(questions.every((q) => !q.retry && q.options.length === 4)).toBe(true);
  });

  it('chaves inválidas são ignoradas; sem chaves, sem perguntas', () => {
    expect(buildVocabQuestions(['x|jm', cardKey(kanjiWord.id, 'jm')], seeded(1))).toHaveLength(1);
    expect(buildVocabQuestions([])).toEqual([]);
  });

  it('cartões da mesma palavra não ficam colados quando dá para separar', () => {
    const words = VOCAB.slice(0, 6);
    const keys = words.flatMap(cardKeysFor);
    for (let seed = 1; seed <= 40; seed++) {
      const order = buildVocabQuestions(keys, seeded(seed)).map((q) => q.item.char);
      for (let i = 1; i < order.length; i++) expect(order[i]).not.toBe(order[i - 1]);
    }
  });
});

describe('pergunta de leitura', () => {
  it('mostra a palavra com kanji e quatro leituras diferentes, com a certa entre elas', () => {
    const words = VOCAB.filter((w) => w.reading !== w.jp).slice(0, 60);
    for (const word of words) {
      const [q] = buildVocabQuestions([`${word.id}|rd`], () => 0.4);
      if (!q) throw new Error('sem pergunta');
      expect(q.direction).toBe('k2r');
      expect(q.item.char).toBe(word.jp);
      expect(q.item.label).toBe(word.reading);
      const readings = q.options.map((o) => o.label);
      expect(readings).toContain(word.reading);
      expect(new Set(readings).size).toBe(readings.length);
      expect(q.options.map((o) => o.char)).toContain(word.jp);
      expect(questionCardKey(q)).toBe(`${word.id}|rd`);
    }
  });

  it('a pergunta de significado do mesmo cartão continua com a chave jm', () => {
    const word = VOCAB.find((w) => w.reading !== w.jp);
    if (!word) throw new Error('sem palavra');
    const [q] = buildVocabQuestions([`${word.id}|jm`]);
    expect(q ? questionCardKey(q) : '').toBe(`${word.id}|jm`);
  });
});
