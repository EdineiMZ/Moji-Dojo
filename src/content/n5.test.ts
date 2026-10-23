import { N5_WORDS } from './n5';
import { findWord, VOCAB } from './index';

const GROUPS = new Set([
  'Verbos',
  'Adjetivos',
  'Números',
  'Dias e tempo',
  'Pessoas e escola',
  'Posição e direção',
  'Natureza e corpo',
  'Coisas e lugares',
  'Comida e bebida',
  'Roupas e compras',
  'Transporte e viagem',
  'Expressões e palavras de ligação',
]);

describe('lista JLPT N5 (gerada)', () => {
  it('tem centenas de palavras, todas distintas', () => {
    expect(N5_WORDS.length).toBeGreaterThan(650);
    expect(new Set(N5_WORDS.map((w) => w.jp)).size).toBe(N5_WORDS.length);
  });

  it('toda palavra tem tradução, original em inglês e um assunto conhecido', () => {
    for (const w of N5_WORDS) {
      expect(w.meaning.trim()).not.toBe('');
      expect(w.en.trim()).not.toBe('');
      expect(GROUPS.has(w.group)).toBe(true);
    }
  });

  it('a tradução não é o inglês copiado (tirando nomes iguais nos dois idiomas)', () => {
    const copied = N5_WORDS.filter((w) => w.meaning.toLowerCase() === w.en.toLowerCase());
    expect(copied.length).toBeLessThan(10);
  });

  it('a ordem de estudo começa pelas lições do Genki, em ordem crescente', () => {
    const lessons = N5_WORDS.map((w) => w.lesson ?? 99);
    expect(lessons).toEqual([...lessons].sort((a, b) => a - b));
    expect(N5_WORDS[0]?.lesson).toBeDefined();
  });
});

describe('vocabulário completo (HTML + N5)', () => {
  it('as palavras do HTML vêm antes e valem quando a palavra se repete', () => {
    const water = findWord('水');
    expect(water?.meaning).toBe('água'); // a do HTML, não a da lista N5
    expect(VOCAB[0]?.kind).toBe('hira'); // começa pelos exemplos de hiragana do HTML
  });

  it('os assuntos de verbos e adjetivos juntam as palavras do HTML e da lista', () => {
    const verbs = VOCAB.filter((w) => w.group === 'Verbos');
    expect(verbs.length).toBeGreaterThan(100);
    expect(verbs.some((w) => w.kind === 'kanji')).toBe(true);
  });
});
