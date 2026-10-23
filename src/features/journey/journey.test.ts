import { buyable, findItem, howToGet, inSeason, ITEMS, priceOf } from './items';
import { addPetals, buyItem, dismissToast, emptyJourney, equipItem, grantItem, outfit, pushToast, sanitizeJourney, unequipSlot } from './journey';

describe('catálogo de itens', () => {
  it('tem ids únicos e o tamanho prometido: 50+ na loja, 30+ de recompensa e 20+ só nos baús', () => {
    expect(new Set(ITEMS.map((i) => i.id)).size).toBe(ITEMS.length);
    const shopKinds = ITEMS.filter((i) => i.source.kind === 'shop');
    const rewards = ITEMS.filter((i) => i.source.kind === 'achievement' || i.source.kind === 'weekly');
    expect(shopKinds.length).toBeGreaterThanOrEqual(50);
    expect(rewards.length).toBeGreaterThanOrEqual(30);
    expect(ITEMS.filter((i) => i.source.kind === 'loot').length).toBeGreaterThanOrEqual(20);
    expect(ITEMS.filter((i) => i.source.kind === 'season').length).toBeGreaterThanOrEqual(5);
  });

  it('há itens de todas as raridades, e os lendários só saem de baú ou de conquista difícil', () => {
    for (const rarity of ['common', 'rare', 'epic', 'legendary'] as const) expect(ITEMS.some((i) => i.rarity === rarity)).toBe(true);
    for (const item of ITEMS.filter((i) => i.rarity === 'legendary')) expect(['loot', 'achievement']).toContain(item.source.kind);
    expect(ITEMS.filter((i) => i.source.kind === 'shop').every((i) => i.rarity !== 'legendary')).toBe(true);
  });

  it('itens comprados custam caro: o mais barato 150 pétalas e nenhum passa de 1000', () => {
    const prices = ITEMS.map(priceOf).filter((p): p is number => p !== null);
    expect(Math.min(...prices)).toBeGreaterThanOrEqual(150);
    expect(Math.max(...prices)).toBeLessThanOrEqual(1000);
  });

  it('todo item tem nome, descrição e preço positivo quando se compra', () => {
    for (const item of ITEMS) {
      expect(item.name.length).toBeGreaterThan(2);
      expect(item.description.length).toBeGreaterThan(5);
      const price = priceOf(item);
      if (price !== null) expect(price).toBeGreaterThan(0);
      expect(howToGet(item).length).toBeGreaterThan(5);
    }
  });

  it('temporada: a janela vale por dentro e atravessa o fim do ano', () => {
    expect(inSeason([12, 1], [1, 6], 12, 25)).toBe(true);
    expect(inSeason([12, 1], [1, 6], 1, 3)).toBe(true);
    expect(inSeason([12, 1], [1, 6], 6, 15)).toBe(false);
    expect(inSeason([3, 10], [4, 20], 4, 20)).toBe(true);
    expect(inSeason([3, 10], [4, 20], 4, 21)).toBe(false);
  });

  it('itens de conquista nunca estão à venda; os de loja sempre; os de temporada só na época', () => {
    const reward = findItem('coroa-dourada');
    const shop = findItem('boina');
    const season = findItem('chapeu-natal');
    if (!reward || !shop || !season) throw new Error('itens não encontrados');
    expect(buyable(reward, new Date(2026, 5, 1))).toBe(false);
    expect(buyable(shop, new Date(2026, 5, 1))).toBe(true);
    expect(buyable(season, new Date(2026, 11, 20))).toBe(true);
    expect(buyable(season, new Date(2026, 5, 1))).toBe(false);
  });
});

describe('comprar e vestir', () => {
  const rich = addPetals(emptyJourney(), 1000);
  const june = new Date(2026, 5, 1);

  it('compra desconta as pétalas e o item novo já é vestido se o espaço está vazio', () => {
    const result = buyItem(rich, 'boina', june);
    expect(result.ok).toBe(true);
    expect(result.state.petals).toBe(750);
    expect(result.state.owned).toEqual(['boina']);
    expect(result.state.equipped.head).toBe('boina');
    expect(result.state.counters.purchases).toBe(1);
  });

  it('o segundo item do mesmo espaço fica no armário sem trocar o que está vestido', () => {
    const first = buyItem(rich, 'boina', june).state;
    const second = buyItem(first, 'gorro-la', june).state;
    expect(second.equipped.head).toBe('boina');
    expect(equipItem(second, 'gorro-la').equipped.head).toBe('gorro-la');
  });

  it.each([
    ['nao-existe', 'unknown'],
    ['coroa-dourada', 'not-for-sale'],
    ['chapeu-natal', 'out-of-season'],
  ])('recusa %s (%s) sem mexer no saldo', (id, error) => {
    const result = buyItem(rich, id, june);
    expect(result).toMatchObject({ ok: false, error });
    expect(result.state.petals).toBe(1000);
  });

  it('recusa quem já tem e quem não tem pétalas', () => {
    const bought = buyItem(rich, 'boina', june).state;
    expect(buyItem(bought, 'boina', june)).toMatchObject({ ok: false, error: 'owned' });
    expect(buyItem(emptyJourney(), 'boina', june)).toMatchObject({ ok: false, error: 'poor' });
  });

  it('só veste o que tem, e tira o item de um espaço', () => {
    expect(equipItem(rich, 'boina')).toBe(rich);
    const worn = buyItem(rich, 'boina', june).state;
    expect(unequipSlot(worn, 'head').equipped).toEqual({});
    expect(unequipSlot(worn, 'face')).toBe(worn);
  });

  it('dar um item de recompensa avisa uma vez e não repete', () => {
    const given = grantItem(emptyJourney(), 'coroa-dourada');
    expect(given.owned).toEqual(['coroa-dourada']);
    expect(given.toasts).toHaveLength(1);
    expect(grantItem(given, 'coroa-dourada')).toBe(given);
  });

  it('a roupa de época só aparece na época, se o aluno tem o item e o espaço está livre', () => {
    const owned = grantItem(emptyJourney(), 'chapeu-natal', false);
    const christmas = new Date(2026, 11, 20);
    expect(outfit({ ...owned, equipped: {} }, christmas).head).toBe('chapeu-natal');
    expect(outfit({ ...owned, equipped: {} }, june).head).toBeUndefined();
    expect(outfit({ ...owned, equipped: { head: 'boina' } }, christmas).head).toBe('boina');
    expect(outfit({ ...owned, equipped: {}, seasonalAuto: false }, christmas).head).toBeUndefined();
  });
});

describe('pétalas e avisos', () => {
  it('somar não aceita zero nem negativo, e guarda o total ganho', () => {
    const state = addPetals(addPetals(emptyJourney(), 30), 12.9);
    expect(state.petals).toBe(42);
    expect(state.petalsEarned).toBe(42);
    expect(addPetals(state, 0)).toBe(state);
    expect(addPetals(state, -5)).toBe(state);
  });

  it('os avisos têm limite e podem ser fechados', () => {
    let state = emptyJourney();
    for (let i = 0; i < 30; i++) state = pushToast(state, 'petals', `t${i}`, 'x');
    expect(state.toasts).toHaveLength(20);
    const first = state.toasts[0];
    if (!first) throw new Error('sem aviso');
    expect(dismissToast(state, first.id).toasts).toHaveLength(19);
  });
});

describe('leitura segura', () => {
  it('lixo vira o estado vazio; campos ausentes ganham o padrão', () => {
    expect(sanitizeJourney(null)).toEqual(emptyJourney());
    expect(sanitizeJourney('x')).toEqual(emptyJourney());
    expect(sanitizeJourney({ petals: 5 }).petals).toBe(5);
    expect(sanitizeJourney({ petals: 5 }).dailyGoal).toBe(10);
  });

  it('descarta item desconhecido, item vestido que não é do aluno ou do espaço errado', () => {
    const state = sanitizeJourney({
      owned: ['boina', 'item-fantasma', 'boina'],
      equipped: { head: 'boina', face: 'boina', neck: 'sininho', back: 'item-fantasma' },
    });
    expect(state.owned).toEqual(['boina']);
    expect(state.equipped).toEqual({ head: 'boina' });
  });

  it('números inválidos viram zero, meta diária fora da lista volta ao padrão e dias de descanso são filtrados', () => {
    const state = sanitizeJourney({ petals: -3, xp: 'muito', dailyGoal: 7, restWeekdays: [0, 6, 9, 'x', 6], counters: { a: 2, b: -1, c: 'x' } });
    expect(state.petals).toBe(0);
    expect(state.xp).toBe(0);
    expect(state.dailyGoal).toBe(10);
    expect(state.restWeekdays).toEqual([0, 6]);
    expect(state.counters).toEqual({ a: 2 });
  });

  it('um estado válido atravessa o JSON sem mudar', () => {
    const state = buyItem(addPetals(emptyJourney(), 500), 'boina', new Date(2026, 5, 1));
    if (!state.ok) throw new Error('compra falhou');
    expect(sanitizeJourney(JSON.parse(JSON.stringify(state.state)))).toEqual(state.state);
  });
});
