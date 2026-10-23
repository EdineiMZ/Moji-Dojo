import { VOCAB } from '@/content';
import { cardKey } from '@/features/vocab/cards';
import { buildMixedRound, mixedKind } from './mixed';

const NOW = 1_000_000_000;
const due = { b: 1, due: NOW - 1 };

describe('revisão mista', () => {
  const kanaKeys = ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く'];
  const words = VOCAB.slice(0, 8).map((w) => cardKey(w.id, 'jm'));
  const pile = {
    srs: Object.fromEntries(kanaKeys.map((k) => [k, due])),
    vocab: Object.fromEntries(words.map((k) => [k, due])),
    conj: {},
  };

  it('intercala os tipos em vez de juntar em blocos', () => {
    const round = buildMixedRound(pile, NOW, () => 0.5, 10);
    expect(round).toHaveLength(10);
    const kinds = round.map((q) => mixedKind(q).kind);
    expect(new Set(kinds)).toEqual(new Set(['kana', 'vocab']));
    // nunca três do mesmo tipo seguidos enquanto os dois tipos ainda têm perguntas
    for (let i = 2; i < 10; i++) expect(kinds[i] === kinds[i - 1] && kinds[i] === kinds[i - 2]).toBe(false);
  });

  it('completa com o que sobra quando um tipo acaba', () => {
    const only = buildMixedRound({ srs: pile.srs, vocab: {}, conj: {} }, NOW, () => 0.5, 6);
    expect(only).toHaveLength(6);
    expect(only.every((q) => mixedKind(q).kind === 'kana')).toBe(true);
  });

  it('nada vencido, nada de perguntas', () => {
    expect(buildMixedRound({ srs: {}, vocab: {}, conj: {} }, NOW)).toEqual([]);
  });
});
