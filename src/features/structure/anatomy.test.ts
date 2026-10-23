import { ALL_TRAVEL_PHRASES } from '@/content/travel';
import { anatomize, anatomizePhrase, piecesFromParts, piecesFromText } from './anatomy';

const fromParts = (...parts: string[]) => anatomize(piecesFromParts(parts))?.map((b) => `${b.text}:${b.role}`);

describe('anatomia da frase', () => {
  it('pedido: objeto + verbo no fim', () => {
    expect(fromParts('これ', 'を', 'ください')).toEqual(['これを:object', 'ください:predicate']);
    expect(fromParts('これ', 'を', 'みせて', 'ください')).toEqual(['これを:object', 'みせてください:predicate']);
  });

  it('pergunta: tema + o que se pergunta, com か no fim', () => {
    expect(fromParts('えき', 'は', 'どこ', 'ですか')).toEqual(['えきは:topic', 'どこですか:predicate']);
    expect(fromParts('えき', 'は', 'どこ', 'です', 'か')).toEqual(['えきは:topic', 'どこですか:predicate']);
  });

  it('lugar, alvo e detalhe sem partícula', () => {
    expect(fromParts('ここ', 'で', 'たべます')).toEqual(['ここで:place', 'たべます:predicate']);
    expect(fromParts('ゆっくり', 'おねがいします')).toEqual(['ゆっくり:detail', 'おねがいします:predicate']);
    expect(fromParts('みち', 'に', 'まよいました')).toEqual(['みちに:target', 'まよいました:predicate']);
  });

  it('o の de "aquele que" (おおきい のは) fica na palavra, e o papel vem da partícula seguinte', () => {
    expect(fromParts('もっと', 'おおきい', 'の', 'は', 'ありますか')).toEqual(['もっと:detail', 'おおきいのは:topic', 'ありますか:predicate']);
  });

  it('o の de posse liga dois nomes', () => {
    expect(fromParts('わたし', 'の', 'なまえ', 'は', 'ジョアン', 'です')).toEqual(['わたしの:possessor', 'なまえは:topic', 'ジョアンです:predicate']);
  });

  it('saudação que termina em partícula (こんばんは) não é desmontada', () => {
    expect(anatomize(piecesFromParts(['こんばん', 'は']))).toBeNull();
  });

  it('a partir do texto: usa o léxico e devolve null fora dele', () => {
    expect(anatomize(piecesFromText('これを ください'))?.map((b) => b.role)).toEqual(['object', 'predicate']);
    expect(anatomize(piecesFromText('ぬるぽがっ'))).toBeNull();
  });

  it('toda frase de viagem com uma versão só tem blocos e termina no fim da frase', () => {
    let count = 0;
    for (const phrase of ALL_TRAVEL_PHRASES) {
      const blocks = anatomizePhrase(phrase);
      if (!blocks) continue;
      count++;
      expect(blocks.at(-1)?.role).toBe('predicate');
      expect(blocks.map((b) => b.text).join('')).toBe(phrase.jp.replace(/ /g, '').replace(/こんばんは/, 'こんばんは'));
    }
    expect(count).toBeGreaterThan(170);
  });
});
