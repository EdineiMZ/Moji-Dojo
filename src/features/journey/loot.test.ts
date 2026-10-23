import { ITEMS, lootItems } from './items';
import { PITY_DAILY, pickRarity, rollLoot, weightsFor } from './loot';

/** Um gerador que repete uma sequência de valores (para o sorteio ser previsível). */
const seq = (...values: number[]) => {
  let i = 0;
  return () => values[i++ % values.length] ?? 0;
};

describe('baús', () => {
  it('o baú do dia é, na maioria, comum, e o da semana nunca é comum', () => {
    const daily = weightsFor('daily', 0);
    expect(daily.common).toBeGreaterThan(daily.rare);
    expect(weightsFor('weekly', 0).common).toBe(0);
  });

  it('a sequência de dias empurra um pouco a sorte para os raros', () => {
    expect(weightsFor('daily', 14).rare).toBeGreaterThan(weightsFor('daily', 0).rare);
    expect(weightsFor('daily', 14).common).toBeLessThan(weightsFor('daily', 0).common);
    expect(weightsFor('daily', 99)).toEqual(weightsFor('daily', 14));
  });

  it('o sorteio respeita os pesos nas pontas', () => {
    const w = weightsFor('daily', 0);
    expect(pickRarity(w, () => 0)).toBe('common');
    expect(pickRarity(w, () => 0.9999)).toBe('legendary');
  });

  it('o baú comum rende só pétalas dentro da faixa, mais o bônus da sequência', () => {
    const loot = rollLoot('daily', { owned: [], dryDaily: 0, streak: 0 }, seq(0, 0));
    expect(loot).toMatchObject({ kind: 'daily', rarity: 'common', itemId: null });
    expect(loot.petals).toBeGreaterThanOrEqual(8);
    expect(loot.petals).toBeLessThanOrEqual(14);
    const withStreak = rollLoot('daily', { owned: [], dryDaily: 0, streak: 10 }, seq(0, 0));
    expect(withStreak.petals).toBe(loot.petals + 5);
  });

  it('o baú da semana sempre traz um item que a pessoa ainda não tem', () => {
    for (let n = 0; n < 40; n++) {
      const rng = seq(Math.random(), Math.random(), Math.random(), Math.random());
      const loot = rollLoot('weekly', { owned: [], dryDaily: 0, streak: 3 }, rng);
      expect(loot.itemId).not.toBeNull();
      expect(ITEMS.find((i) => i.id === loot.itemId)?.source.kind).toBe('loot');
    }
  });

  it('sem sorte por 6 baús do dia seguidos, o próximo traz um item raro ou melhor', () => {
    const loot = rollLoot('daily', { owned: [], dryDaily: PITY_DAILY, streak: 0 }, seq(0, 0, 0));
    expect(loot.itemId).not.toBeNull();
    expect(loot.rarity).not.toBe('common');
  });

  it('nunca repete um item que a pessoa já tem, e quando tem todos as pétalas dobram', () => {
    const all = lootItems().map((i) => i.id);
    const loot = rollLoot('weekly', { owned: all, dryDaily: 0, streak: 0 }, seq(0.5, 0.5, 0.5));
    expect(loot.itemId).toBeNull();
    const single = rollLoot('weekly', { owned: all.filter((id) => id !== all[0]), dryDaily: 0, streak: 0 }, seq(0.1, 0.1, 0.1));
    expect(single.itemId).toBe(all[0]);
  });

  it('há itens exclusivos suficientes e de todas as raridades', () => {
    expect(lootItems('rare').length).toBeGreaterThanOrEqual(5);
    expect(lootItems('epic').length).toBeGreaterThanOrEqual(5);
    expect(lootItems('legendary').length).toBeGreaterThanOrEqual(4);
  });
});
