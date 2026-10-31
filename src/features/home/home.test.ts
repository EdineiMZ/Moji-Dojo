import { addPetals, emptyJourney, sanitizeJourney } from '../journey/journey';
import { FURNITURE_ART, ROOM_BACKGROUND } from './art';
import { buyFurniture, buyRoom, FURNITURE, findRoom, furnitureOf, ROOMS, sanitizeHome } from './home';

const rich = () => addPetals(emptyJourney(), 5000);

describe('Casa do Mochi', () => {
  it('tem cômodos de dentro e de fora, com móveis em cada um', () => {
    expect(ROOMS.length).toBeGreaterThanOrEqual(3);
    expect(ROOMS.some((r) => r.kind === 'inside')).toBe(true);
    expect(ROOMS.some((r) => r.kind === 'outside')).toBe(true);
    for (const room of ROOMS) expect(furnitureOf(room.id).length).toBeGreaterThanOrEqual(5);
  });

  it('ids únicos, móveis ligados a cômodos que existem e todos com desenho', () => {
    expect(new Set(ROOMS.map((r) => r.id)).size).toBe(ROOMS.length);
    expect(new Set(FURNITURE.map((f) => f.id)).size).toBe(FURNITURE.length);
    for (const f of FURNITURE) {
      expect(findRoom(f.room)).toBeDefined();
      expect(FURNITURE_ART[f.id]).toBeDefined();
      expect(f.price).toBeGreaterThan(0);
    }
    for (const r of ROOMS) expect(ROOM_BACKGROUND[r.id]).toBeDefined();
  });

  it('compra um cômodo descontando as pétalas e não deixa comprar duas vezes', () => {
    const bought = buyRoom(rich(), 'quarto');
    expect(bought.ok).toBe(true);
    expect(bought.state.petals).toBe(5000 - (findRoom('quarto')?.price ?? 0));
    expect(bought.state.home.rooms).toEqual(['quarto']);
    expect(buyRoom(bought.state, 'quarto')).toMatchObject({ ok: false, error: 'owned' });
  });

  it('recusa por falta de pétalas ou id desconhecido, sem mudar o estado', () => {
    const poor = emptyJourney();
    expect(buyRoom(poor, 'quarto')).toMatchObject({ ok: false, error: 'poor', state: poor });
    expect(buyRoom(poor, 'nada')).toMatchObject({ ok: false, error: 'unknown' });
    expect(buyFurniture(poor, 'nada')).toMatchObject({ ok: false, error: 'unknown' });
  });

  it('só vende o móvel depois do cômodo', () => {
    expect(buyFurniture(rich(), 'cama')).toMatchObject({ ok: false, error: 'no-room' });
    const room = buyRoom(rich(), 'quarto').state;
    const bed = buyFurniture(room, 'cama');
    expect(bed.ok).toBe(true);
    expect(bed.state.home.furniture).toEqual(['cama']);
    expect(buyFurniture(bed.state, 'cama')).toMatchObject({ ok: false, error: 'owned' });
    const short = { ...room, petals: 10 };
    expect(buyFurniture(short, 'tapete')).toMatchObject({ ok: false, error: 'poor' });
  });

  it('sanitizeHome descarta ids desconhecidos e móveis de cômodos que não são seus', () => {
    expect(sanitizeHome(null)).toEqual({ rooms: [], furniture: [] });
    expect(sanitizeHome({ rooms: ['quarto', 'quarto', 'x', 3], furniture: ['cama', 'mesa', 'y'] })).toEqual({ rooms: ['quarto'], furniture: ['cama'] });
  });

  it('a casa sobrevive ao backup e a um estado antigo sem casa', () => {
    const state = buyFurniture(buyRoom(rich(), 'jardim').state, 'arvore').state;
    expect(sanitizeJourney(JSON.parse(JSON.stringify(state))).home).toEqual({ rooms: ['jardim'], furniture: ['arvore'] });
    const { home: _home, ...old } = emptyJourney();
    expect(sanitizeJourney(old).home).toEqual({ rooms: [], furniture: [] });
  });
});
