import { buyable, ITEMS, SLOTS, type Item } from './items';

type Window = Extract<Item['source'], { kind: 'season' }>;

const seasonal = ITEMS.filter((i): i is Item & { source: Window } => i.source.kind === 'season');

/** Agrupa os itens de temporada pela janela de datas (cada data comemorativa tem a sua). */
const byWindow = new Map<string, (Item & { source: Window })[]>();
for (const item of seasonal) {
  const key = `${item.source.from.join('/')}-${item.source.to.join('/')}`;
  byWindow.set(key, [...(byWindow.get(key) ?? []), item]);
}

describe('cosméticos de datas comemorativas', () => {
  it('há pelo menos 10 datas, cada uma com um item de cada um dos 6 espaços', () => {
    expect(byWindow.size).toBeGreaterThanOrEqual(10);
    for (const [key, items] of byWindow) {
      expect({ key, slots: items.map((i) => i.slot).sort() }).toEqual({ key, slots: [...SLOTS].sort() });
    }
  });

  it('só se compra dentro da janela da data (e o mês seguinte já não vale)', () => {
    for (const items of byWindow.values()) {
      const { from, to } = items[0]!.source;
      // O 1º dia e o último dia da janela valem; um dia antes e um dia depois, não.
      const year = 2027;
      const first = new Date(year, from[0] - 1, from[1]);
      const last = new Date(to[0] < from[0] ? year + 1 : year, to[0] - 1, to[1]);
      const before = new Date(first.getTime() - 24 * 3600 * 1000);
      const after = new Date(last.getTime() + 24 * 3600 * 1000);
      for (const item of items) {
        expect(buyable(item, first)).toBe(true);
        expect(buyable(item, last)).toBe(true);
        // Dias fora da janela só valem se outra janela da mesma peça cobrir o dia (não há: cada id tem uma janela só).
        expect(buyable(item, before)).toBe(false);
        expect(buyable(item, after)).toBe(false);
      }
    }
  });

  it('preços ficam na faixa da loja e a pele é épica', () => {
    for (const item of seasonal) {
      expect(item.source.price).toBeGreaterThanOrEqual(150);
      expect(item.source.price).toBeLessThanOrEqual(1000);
      if (item.slot === 'skin') expect(item.rarity).toBe('epic');
    }
  });

  it('nenhum item de temporada se repete entre as datas', () => {
    expect(new Set(seasonal.map((i) => i.id)).size).toBe(seasonal.length);
    expect(seasonal.length).toBeGreaterThanOrEqual(60);
  });
});
