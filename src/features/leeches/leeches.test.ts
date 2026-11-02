import { VOCAB } from '@/content';
import { brakeFor } from '@/features/review/brake';
import { cardKey } from '@/features/vocab/cards';
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

  it('uma palavra com os 3 cartões teimosos conta uma vez só, com o pior número de esquecimentos', () => {
    const word = VOCAB.find((w) => w.reading === w.jp) as (typeof VOCAB)[number];
    const vocab = {
      [cardKey(word.id, 'jm')]: { b: 1, due: NOW, l: 4 },
      [cardKey(word.id, 'mj')]: { b: 1, due: NOW, l: 7 },
      [cardKey(word.id, 'au')]: { b: 2, due: NOW, l: 5 },
    };
    const leeches = findLeeches({ srs: {}, vocab, conj: {}, particles: {} });
    expect(leeches).toHaveLength(1);
    expect(leeches[0]).toMatchObject({ area: 'vocab', id: word.id, lapses: 7 });
    expect(leeches[0]?.label).toBe(`${word.jp} · ${word.meaning}`);
  });

  it('só os cartões teimosos contam: o outro cartão da mesma palavra, firme, não esconde nem soma', () => {
    const word = VOCAB.find((w) => w.reading === w.jp) as (typeof VOCAB)[number];
    const vocab = { [cardKey(word.id, 'jm')]: { b: 5, due: NOW, l: 9 }, [cardKey(word.id, 'mj')]: { b: 1, due: NOW, l: 4 } };
    expect(findLeeches({ srs: {}, vocab, conj: {}, particles: {} }).map((l) => l.lapses)).toEqual([4]);
  });

  it('kanji teimoso aparece como kanji (dica de traços), não como kana', () => {
    const leeches = findLeeches({ srs: { 日: { b: 1, due: NOW, l: 5 }, あ: { b: 1, due: NOW, l: 5 } }, vocab: {}, conj: {}, particles: {} });
    expect(leeches.find((l) => l.label.startsWith('日'))?.area).toBe('kanji');
    expect(leeches.find((l) => l.label.startsWith('あ'))?.area).toBe('kana');
    expect(leeches.find((l) => l.area === 'kanji')?.tip).toContain('ordem dos traços');
  });

  it('o freio não dispara com duas palavras difíceis (6 cartões), mas dispara com 6 palavras', () => {
    const words = VOCAB.filter((w) => w.reading === w.jp).slice(0, 6);
    const cards = (list: typeof words) =>
      Object.fromEntries(list.flatMap((w) => (['jm', 'mj', 'au'] as const).map((d) => [cardKey(w.id, d), { b: 1, due: NOW, l: 5 }])));
    const count = (list: typeof words) => findLeeches({ srs: {}, vocab: cards(list), conj: {}, particles: {} }).length;
    expect(count(words.slice(0, 2))).toBe(2);
    expect(brakeFor({}, count(words.slice(0, 2)), new Date(NOW))).toBeNull();
    expect(count(words)).toBe(6);
    expect(brakeFor({}, count(words), new Date(NOW))?.reason).toBe('leeches');
  });
});
