import { annotate, meaningOf, romajiOf } from './annotate';

describe('romaji dos trechos em japonês', () => {
  it('lê kana com as partículas ligadas no fim da palavra', () => {
    expect(romajiOf('かれは わすれっぽい')).toBe('kare wa wasureppoi');
    expect(romajiOf('あめに なる らしい')).toBe('ameni naru rashii');
    expect(romajiOf('〜らしい')).toBe('rashii');
    expect(romajiOf('は')).toBe('wa');
  });

  it('lê kanji que o app ensina, e não inventa a leitura do que não conhece', () => {
    expect(romajiOf('学校')).toBe('gakkō');
    expect(romajiOf('魑魅魍魎')).toBeUndefined();
  });

  it('dá o significado só quando o trecho é uma palavra do vocabulário', () => {
    expect(meaningOf('学校')).toBeTruthy();
    expect(meaningOf('あめに なる らしい')).toBeUndefined();
  });
});

describe('texto de explicação com japonês', () => {
  it('separa o português do japonês, sem perder nenhuma letra', () => {
    const text = 'Use わすれ + っぽい (esquece fácil) para dizer 学校.';
    const pieces = annotate(text);
    expect(pieces.map((p) => p.text).join('')).toBe(text);
    expect(pieces.filter((p) => p.kind === 'jp').map((p) => p.text)).toEqual(['わすれ', 'っぽい', '学校']);
  });

  it('um texto só em português não ganha nada', () => {
    expect(annotate('Nada de japonês aqui.')).toEqual([{ kind: 'text', text: 'Nada de japonês aqui.' }]);
  });
});
