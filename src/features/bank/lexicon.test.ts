import { getLexicon, segment, spacedReading, wordsUsed } from './lexicon';

const read = (text: string): string | null => {
  const tokens = segment(text);
  return tokens ? spacedReading(tokens) : null;
};

describe('segment', () => {
  it('corta a frase em palavras, partículas e finais, e lê em kana com espaços', () => {
    expect(read('私は学生です。')).toBe('わたしは がくせいです');
    expect(read('りんごを食べます')).toBe('りんごを たべます');
    expect(read('学校に行きました')).toBe('がっこうに いきました');
  });

  it('formas conjugadas de verbos e adjetivos entram no léxico', () => {
    expect(read('食べたくない')).toBe('たべたくない');
    expect(read('高くなかった')).toBe('たかくなかった');
    expect(read('見ています')).toBe('みています');
    expect(read('本を読んで')).toBe('ほんを よんで');
  });

  it('devolve null quando algum pedaço não está no léxico', () => {
    expect(segment('彼は弁護士です')).toBeNull();
    expect(segment('abc')).toBeNull();
  });

  it('pontuação não entra na leitura nem nas palavras', () => {
    const tokens = segment('「ありがとう。」');
    expect(tokens).not.toBeNull();
    expect(spacedReading(tokens ?? [])).toBe('ありがとう');
    expect(wordsUsed(tokens ?? [])).toEqual([]);
  });

  it('wordsUsed lista os ids do vocabulário, sem repetir', () => {
    const tokens = segment('学生は学生です') ?? [];
    expect(wordsUsed(tokens)).toEqual(['学生']);
  });

  it('o léxico tem uma entrada por forma, sem surfaces vazias', () => {
    const lex = getLexicon();
    expect(lex.size).toBeGreaterThan(2000);
    expect(lex.has('')).toBe(false);
  });
});
