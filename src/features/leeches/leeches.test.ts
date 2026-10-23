import { findLeeches } from './leeches';

const NOW = 1_000_000;
describe('itens teimosos', () => {
  it('lista só os que têm 4 esquecimentos e ainda estão nas caixas baixas, o pior primeiro', () => {
    const leeches = findLeeches({
      srs: { あ: { b: 1, due: NOW, l: 6 }, い: { b: 1, due: NOW, l: 2 }, う: { b: 4, due: NOW, l: 9 }, か: { b: 2, due: NOW, l: 4 } },
      vocab: {},
      conj: {},
      particles: { は: { b: 1, due: NOW, l: 5 } },
    });
    expect(leeches.map((l) => l.label.split(' ')[0])).toEqual(['あ', 'は', 'か']);
    expect(leeches[0]?.tip.length).toBeGreaterThan(20);
  });

  it('chaves que não existem mais são ignoradas', () => {
    expect(findLeeches({ srs: { 'ZZ': { b: 1, due: NOW, l: 9 } }, vocab: { 'nada|jm': { b: 1, due: NOW, l: 9 } }, conj: {}, particles: {} })).toEqual([]);
  });
});
