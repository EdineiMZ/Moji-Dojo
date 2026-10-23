import { PITCH } from '@/content/pitch';
import { findWord } from '@/content';
import { accentOf, buildPitchQuestion, buildPitchRound, marked, moras, PITCH_WORDS, pitchKind, pitchPairs, pitchPattern } from './pitch';

describe('moras', () => {
  it('kana pequeno gruda no anterior; っ, ん e ー contam', () => {
    expect(moras('がっこう')).toEqual(['が', 'っ', 'こ', 'う']);
    expect(moras('きょう')).toEqual(['きょ', 'う']);
    expect(moras('ラーメン')).toEqual(['ラ', 'ー', 'メ', 'ン']);
    expect(moras('しゃしん')).toEqual(['しゃ', 'し', 'ん']);
  });
});

describe('padrão do tom', () => {
  it.each([
    [3, 0, [false, true, true]],
    [3, 1, [true, false, false]],
    [3, 2, [false, true, false]],
    [3, 3, [false, true, true]],
  ])('%i moras, acento %i', (count, accent, expected) => {
    expect(pitchPattern(count, accent)).toEqual(expected);
  });

  it('o tipo do acento', () => {
    expect(pitchKind(4, 0)).toBe('heiban');
    expect(pitchKind(4, 1)).toBe('atamadaka');
    expect(pitchKind(4, 2)).toBe('nakadaka');
    expect(pitchKind(4, 4)).toBe('odaka');
  });

  it('a marca de queda fica depois da última mora alta', () => {
    expect(marked('いもうと', 4)).toBe('いもうと＼');
    expect(marked('いま', 1)).toBe('い＼ま');
    expect(marked('がっこう', 0)).toBe('がっこう→');
  });
});

describe('dados de acento', () => {
  it('palavras conhecidas batem com o que se sabe: 箸 cai na primeira, 橋 na segunda, 学校 é plano', () => {
    expect(accentOf({ jp: '箸', reading: 'はし' })).toBe(1);
    expect(accentOf({ jp: '橋', reading: 'はし' })).toBe(2);
    expect(accentOf({ jp: '学校', reading: 'がっこう' })).toBe(0);
    expect(accentOf({ jp: '雨', reading: 'あめ' })).toBe(1);
  });

  it('toda chave existe no vocabulário, com acento dentro do tamanho da palavra', () => {
    for (const [key, accents] of Object.entries(PITCH)) {
      const [jp, reading] = key.split('|') as [string, string];
      const word = findWord(jp);
      expect({ key, exists: word !== undefined }).toEqual({ key, exists: true });
      expect(word?.reading).toBe(reading);
      for (const a of accents) expect(a).toBeLessThanOrEqual(moras(reading).length);
    }
  });

  it('há centenas de palavras e pelo menos um par que só o tom separa', () => {
    expect(PITCH_WORDS.length).toBeGreaterThan(300);
    const pairs = pitchPairs();
    expect(pairs.length).toBeGreaterThan(0);
    for (const [a, b] of pairs) {
      expect(a.word.reading).toBe(b.word.reading);
      expect(a.accent).not.toBe(b.accent);
    }
  });
});

describe('quiz do tom', () => {
  it('a resposta certa está entre as alternativas, sem repetir, e cada alternativa é a mesma leitura', () => {
    for (const entry of PITCH_WORDS.slice(0, 80)) {
      const q = buildPitchQuestion(entry, () => 0.3);
      const chars = q.options.map((o) => o.char);
      expect(chars).toContain(q.item.char);
      expect(new Set(chars).size).toBe(chars.length);
      expect(chars.length).toBeGreaterThanOrEqual(3);
      for (const c of chars) expect(c.replace(/[＼→]/g, '')).toBe(entry.word.reading);
    }
  });

  it('a rodada tem o número pedido de perguntas', () => {
    expect(buildPitchRound(8)).toHaveLength(8);
  });
});
