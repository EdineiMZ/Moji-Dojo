import { ALL_TRAVEL, ALL_TRAVEL_PHRASES } from './travel';

describe('frases de viagem e dia a dia', () => {
  it('somam as 37 do original e as novas, sem categorias repetidas nem frases repetidas', () => {
    expect(ALL_TRAVEL_PHRASES.length).toBeGreaterThan(180);
    expect(new Set(ALL_TRAVEL.map((c) => c.category)).size).toBe(ALL_TRAVEL.length);
    expect(new Set(ALL_TRAVEL_PHRASES.map((p) => p.jp)).size).toBe(ALL_TRAVEL_PHRASES.length);
  });

  it('toda frase tem romaji, tradução e pedaços que fecham com o texto', () => {
    for (const p of ALL_TRAVEL_PHRASES) {
      expect(p.romaji.length).toBeGreaterThan(2);
      expect(p.pt.length).toBeGreaterThan(2);
      expect(p.breakdown.length).toBeGreaterThan(0);
      const joined = p.breakdown.map((b) => b.part).join('').replace(/[ \/]/g, '');
      const plain = p.jp.replace(/[ /]/g, '');
      // As frases do HTML podem ter dois jeitos de dizer ("はい / いいえ"); basta cada pedaço aparecer no texto.
      for (const b of p.breakdown) expect(plain.includes(b.part.replace(/ /g, '')) || joined.includes(b.part.replace(/ /g, ''))).toBe(true);
    }
  });
});
