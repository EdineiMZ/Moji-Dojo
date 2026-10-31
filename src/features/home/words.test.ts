import { findWord, VOCAB } from '@/content';
import { HOUSE_WORDS } from '@/content/house';
import { FURNITURE, ROOMS } from './home';
import { houseQuestion, houseWordOf, visitQuestions, wordsOf } from './words';

const seeded = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

describe('palavras da casa', () => {
  it('todo cômodo e todo móvel tem uma palavra, que existe no vocabulário do app', () => {
    for (const id of [...ROOMS.map((r) => r.id), ...FURNITURE.map((f) => f.id)]) {
      const word = houseWordOf(id);
      expect({ id, found: word !== undefined }).toEqual({ id, found: true });
      expect(word?.reading).toMatch(/^[ぁ-んァ-ヶー]+$/);
      expect(word?.meaning.length).toBeGreaterThan(2);
    }
  });

  it('as palavras novas da casa não repetem as listas do N5, do N4 e do N3', () => {
    expect(new Set(HOUSE_WORDS.map((w) => w.jp)).size).toBe(HOUSE_WORDS.length);
    for (const w of HOUSE_WORDS) {
      const found = findWord(w.jp);
      expect(found?.group).toBe('Casa do Mochi');
    }
    expect(VOCAB.filter((w) => w.group === 'Casa do Mochi')).toHaveLength(HOUSE_WORDS.length);
  });

  it('a pergunta tem a resposta certa entre alternativas diferentes', () => {
    const word = houseWordOf('mesa');
    expect(word).toBeDefined();
    if (!word) return;
    for (const dir of ['jm', 'mj'] as const) {
      const q = houseQuestion(word, dir, seeded(4), 3);
      expect(new Set(q.options).size).toBe(q.options.length);
      expect(q.options[q.answer]).toBe(dir === 'jm' ? word.meaning : word.jp);
      expect(q.options.length).toBe(4);
    }
  });

  it('a visita guiada sorteia palavras sem repetir, alternando as direções', () => {
    const owned = wordsOf(['mesa', 'cama', 'janela', 'tv', 'sofa', 'relogio']);
    const round = visitQuestions(owned, 5, seeded(9));
    expect(round).toHaveLength(5);
    expect(new Set(round.map((q) => q.word.id)).size).toBe(5);
    expect(round.map((q) => q.dir)).toEqual(['jm', 'mj', 'jm', 'mj', 'jm']);
    expect(visitQuestions(wordsOf(['mesa', 'cama']), 5)).toHaveLength(2);
  });
});
