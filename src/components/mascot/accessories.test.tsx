import renderer from 'react-test-renderer';
import { ITEMS, SLOTS } from '@/features/journey/items';
import { hasArt, TINTS } from './accessories';
import { MochiArt, MOODS, type MochiOutfit } from './MochiArt';

describe('arte dos acessórios', () => {
  it('todo item do catálogo tem desenho (ou, se é uma cor, uma paleta)', () => {
    const missing = ITEMS.filter((item) =>
      item.slot === 'tint' ? TINTS[item.id] === undefined : !hasArt(item.slot, item.id),
    ).map((item) => item.id);
    expect(missing).toEqual([]);
  });

  it('não há desenho nem cor sem item no catálogo', () => {
    const ids = new Set(ITEMS.map((i) => i.id));
    for (const id of Object.keys(TINTS)) expect(ids.has(id)).toBe(true);
  });

  it('o Mochi renderiza com cada item vestido, em todos os humores, sem quebrar', () => {
    for (const item of ITEMS) {
      for (const mood of MOODS) {
        const outfit: MochiOutfit = { [item.slot]: item.id };
        let tree!: renderer.ReactTestRenderer;
        renderer.act(() => {
          tree = renderer.create(<MochiArt mood={mood} size={160} outfit={outfit} />);
        });
        expect(tree.toJSON()).not.toBeNull();
        renderer.act(() => tree.unmount());
      }
    }
  });

  it('com todos os espaços vestidos ao mesmo tempo também renderiza, e um id desconhecido é ignorado', () => {
    const outfit: MochiOutfit = { head: 'coroa-dourada', face: 'oculos-sabio', neck: 'capa-heroi', back: 'fundo-fuji', tint: 'cor-ouro' };
    let tree!: renderer.ReactTestRenderer;
    renderer.act(() => {
      tree = renderer.create(<MochiArt mood="happy" size={200} outfit={outfit} />);
    });
    expect(tree.toJSON()).not.toBeNull();
    renderer.act(() => {
      tree.update(<MochiArt mood="happy" size={200} outfit={{ head: 'item-fantasma', tint: 'cor-fantasma' }} />);
    });
    expect(tree.toJSON()).not.toBeNull();
  });

  it('cada espaço do catálogo tem pelo menos 4 itens', () => {
    for (const slot of SLOTS) expect(ITEMS.filter((i) => i.slot === slot).length).toBeGreaterThanOrEqual(4);
  });
});
