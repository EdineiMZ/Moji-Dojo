import { lootItems, RARITIES, type Rarity } from './items';

/** Os baús: o do dia (abre uma vez por dia, ao abrir o app) e o da semana (a meta de dias foi batida). */
export type ChestKind = 'daily' | 'weekly';

export interface Loot {
  kind: ChestKind;
  rarity: Rarity;
  petals: number;
  /** Item exclusivo sorteado (null = só pétalas). */
  itemId: string | null;
}

/** O que a sorte precisa saber do aluno. */
export interface LootContext {
  owned: readonly string[];
  /** Baús do dia seguidos sem item (a "sorte acumulada" garante um item depois de alguns). */
  dryDaily: number;
  streak: number;
}

export type Rng = () => number;

/** Depois deste tanto de baús do dia sem item, o próximo traz um item raro ou melhor. */
export const PITY_DAILY = 6;

/** Pesos de cada raridade. A sequência de dias dá um empurrãozinho nos raros, e o baú da semana só tem raro ou melhor. */
export function weightsFor(kind: ChestKind, streak: number): Readonly<Record<Rarity, number>> {
  if (kind === 'weekly') return { common: 0, rare: 55, epic: 35, legendary: 10 };
  const s = Math.min(Math.max(streak, 0), 14);
  return { common: 62 - s * 0.45, rare: 26 + s * 0.3, epic: 9 + s * 0.12, legendary: 3 + s * 0.03 };
}

/** Sorteia uma raridade pelos pesos. */
export function pickRarity(weights: Readonly<Record<Rarity, number>>, rng: Rng): Rarity {
  const total = RARITIES.reduce((sum, r) => sum + weights[r], 0);
  let roll = rng() * total;
  for (const rarity of RARITIES) {
    roll -= weights[rarity];
    if (roll < 0) return rarity;
  }
  return 'common';
}

/** Faixa de pétalas de cada raridade (o baú da semana vale mais). */
const PETAL_RANGE: Readonly<Record<ChestKind, Readonly<Record<Rarity, readonly [number, number]>>>> = {
  daily: { common: [8, 14], rare: [16, 24], epic: [30, 45], legendary: [60, 80] },
  weekly: { common: [25, 35], rare: [35, 50], epic: [60, 90], legendary: [120, 160] },
};

/** Chance de vir um item exclusivo junto com as pétalas. */
const ITEM_CHANCE: Readonly<Record<ChestKind, Readonly<Record<Rarity, number>>>> = {
  daily: { common: 0, rare: 0.2, epic: 0.5, legendary: 1 },
  weekly: { common: 1, rare: 1, epic: 1, legendary: 1 },
};

const between = ([lo, hi]: readonly [number, number], rng: Rng): number => lo + Math.floor(rng() * (hi - lo + 1));

/** O item sorteado dentre os que o aluno ainda não tem, da raridade pedida ou, se acabaram, da mais próxima abaixo e depois acima. */
function pickItem(rarity: Rarity, owned: readonly string[], rng: Rng): { id: string; rarity: Rarity } | null {
  const index = RARITIES.indexOf(rarity);
  const order = [...RARITIES.slice(0, index + 1).reverse(), ...RARITIES.slice(index + 1)];
  for (const r of order) {
    const pool = lootItems(r).filter((item) => !owned.includes(item.id));
    if (pool.length > 0) return { id: pool[Math.floor(rng() * pool.length)]!.id, rarity: r };
  }
  return null;
}

/**
 * Sorteia o conteúdo de um baú. Sempre rende pétalas; com chance (ou garantido, no semanal, e depois de 6 baús do dia sem item)
 * vem um item exclusivo que o aluno ainda não tem. Quando o aluno já tem todos os exclusivos, as pétalas dobram.
 */
export function rollLoot(kind: ChestKind, context: LootContext, rng: Rng = Math.random): Loot {
  let rarity = pickRarity(weightsFor(kind, context.streak), rng);
  const forced = kind === 'daily' && context.dryDaily >= PITY_DAILY;
  if (forced && rarity === 'common') rarity = 'rare';

  const streakBonus = kind === 'daily' ? Math.floor(Math.min(Math.max(context.streak, 0), 10) / 2) : 0;
  let petals = between(PETAL_RANGE[kind][rarity], rng) + streakBonus;

  let itemId: string | null = null;
  if (forced || rng() < ITEM_CHANCE[kind][rarity]) {
    const found = pickItem(rarity, context.owned, rng);
    if (found) {
      itemId = found.id;
      rarity = found.rarity;
    } else {
      petals *= 2;
    }
  }
  return { kind, rarity, petals, itemId };
}
