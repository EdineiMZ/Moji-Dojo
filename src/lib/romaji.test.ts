import { VOCAB } from '@/content';
import { kanaToRomaji } from './romaji';

// Roda em Node, mas o projeto só carrega os tipos do Jest: declaramos só o que usamos.
const script = require('../../scripts/grammar-n5/romaji.cjs') as typeof import('../../scripts/grammar-n5/romaji');

describe('romaji dentro do app', () => {
  it.each([
    ['こんにちは', 'konnichiha'],
    ['がっこう', 'gakkō'],
    ['コーヒー', 'kōhī'],
    ['ラーメン', 'rāmen'],
    ['きょう', 'kyō'],
    ['しんぶん', 'shinbun'],
    ['ほんや', "hon'ya"],
    ['ざっし', 'zasshi'],
    ['マッチ', 'matchi'],
    ['ホテル', 'hoteru'],
  ])('%s → %s', (kana, expected) => {
    expect(kanaToRomaji(kana)).toBe(expected);
  });

  it('は, へ e を viram wa, e e o quando são partículas', () => {
    expect(kanaToRomaji('は', { particle: true })).toBe('wa');
    expect(kanaToRomaji('へ', { particle: true })).toBe('e');
    expect(kanaToRomaji('を', { particle: true })).toBe('o');
    expect(kanaToRomaji('は')).toBe('ha');
  });

  it('dá sempre o mesmo resultado que a versão dos scripts, em todas as palavras do vocabulário', () => {
    for (const word of VOCAB) {
      expect({ word: word.reading, romaji: kanaToRomaji(word.reading) }).toEqual({ word: word.reading, romaji: script.kanaToRomaji(word.reading) });
    }
  });
});
