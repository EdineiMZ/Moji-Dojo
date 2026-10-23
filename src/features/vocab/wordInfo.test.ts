import { findWord, VOCAB } from '@/content';
import { createProgressStore } from '@/store/progressStore';
import { examplesFor, wordClass, wordsWithExamples } from './wordInfo';

const word = (id: string) => {
  const w = findWord(id);
  if (!w) throw new Error(`palavra ${id} não existe`);
  return w;
};

const memoryStorage = () => {
  const data = new Map<string, string>();
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  };
};

describe('classe da palavra', () => {
  it('verbos mostram o grupo de conjugação; adjetivos, o tipo', () => {
    expect(wordClass(word('食べる'))).toBe('verbo · grupo 2');
    expect(wordClass(word('飲む'))).toBe('verbo · grupo 1');
    expect(wordClass(word('高い'))).toBe('adjetivo い');
    expect(wordClass(word('静か'))).toBe('adjetivo な');
  });

  it('as outras classes vêm do JMdict: substantivo, pronome, advérbio, numeral', () => {
    expect(wordClass(word('学校'))).toBe('substantivo');
    expect(wordClass(word('私'))).toBe('pronome');
    expect(wordClass(word('ここ'))).toBe('pronome');
    expect(wordClass(word('三'))).toBe('numeral');
    expect(wordClass(word('いつも'))).toContain('advérbio');
  });

  it('quase todas as palavras têm classe, e nenhuma classe vazia', () => {
    const withClass = VOCAB.filter((w) => wordClass(w) !== null);
    expect(withClass.length / VOCAB.length).toBeGreaterThan(0.85);
    for (const w of withClass) expect((wordClass(w) ?? '').length).toBeGreaterThan(3);
  });
});

describe('frases de exemplo', () => {
  it('há exemplos para centenas de palavras, curtos primeiro, e cada frase usa a palavra', () => {
    expect(wordsWithExamples()).toBeGreaterThan(200);
    const withExamples = VOCAB.filter((w) => examplesFor(w.id, 2).length > 0);
    expect(withExamples.length).toBeGreaterThan(200);
    for (const w of withExamples.slice(0, 50)) {
      const list = examplesFor(w.id, 5);
      expect(list.every((s) => s.uses.includes(w.id))).toBe(true);
      expect(list.map((s) => s.kana.length)).toEqual([...list.map((s) => s.kana.length)].sort((a, b) => a - b));
    }
    expect(examplesFor('palavra-que-nao-existe')).toEqual([]);
  });
});

describe('dica de memória', () => {
  it('guarda, troca e apaga; recusa palavra inexistente ou texto longo', () => {
    const store = createProgressStore(memoryStorage());
    expect(store.getState().setWordNote('学校', '  学 = estudar  ')).toBe(true);
    expect(store.getState().wordNotes['学校']).toBe('学 = estudar');
    store.getState().setWordNote('学校', 'outra dica');
    expect(store.getState().wordNotes['学校']).toBe('outra dica');
    expect(store.getState().setWordNote('nao-existe', 'x')).toBe(false);
    expect(store.getState().setWordNote('学校', 'x'.repeat(201))).toBe(false);
    expect(store.getState().wordNotes['学校']).toBe('outra dica');
    store.getState().setWordNote('学校', '   ');
    expect(store.getState().wordNotes).toEqual({});
  });

  it('o reset apaga as dicas', () => {
    const store = createProgressStore(memoryStorage());
    store.getState().setWordNote('学校', 'dica');
    store.getState().resetProgress();
    expect(store.getState().wordNotes).toEqual({});
  });
});
