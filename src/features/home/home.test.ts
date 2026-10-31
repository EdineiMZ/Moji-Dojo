import { addPetals, emptyJourney, sanitizeJourney } from '../journey/journey';
import { FURNITURE_ART, ROOM_BACKGROUND } from './art';
import { goalLabel, goalStatus, homeProgressOf, ROOM_GOALS } from './goals';
import { buyFurniture, buyRoom, buySkin, equipSkin, FURNITURE, findFurniture, findRoom, furnitureOf, ROOMS, sanitizeHome } from './home';
import { recolor, shiftHex, SKINNABLE, skinKey, skinPriceFor } from './skins';

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
    expect(sanitizeHome(null)).toEqual({ rooms: [], furniture: [], skins: [], skin: {} });
    expect(sanitizeHome({ rooms: ['quarto', 'quarto', 'x', 3], furniture: ['cama', 'mesa', 'y'] })).toEqual({ rooms: ['quarto'], furniture: ['cama'], skins: [], skin: {} });
  });

  it('a casa sobrevive ao backup e a um estado antigo sem casa', () => {
    const state = buyFurniture(buyRoom(rich(), 'jardim').state, 'arvore').state;
    expect(sanitizeJourney(JSON.parse(JSON.stringify(state))).home).toEqual({ rooms: ['jardim'], furniture: ['arvore'], skins: [], skin: {} });
    const { home: _home, ...old } = emptyJourney();
    expect(sanitizeJourney(old).home).toEqual({ rooms: [], furniture: [], skins: [], skin: {} });
  });

  it('o cômodo com meta só é vendido com a meta cumprida', () => {
    const none = { words: 0, topics: 0, streak: 0, days: 0 };
    expect(buyRoom(rich(), 'escritorio', none)).toMatchObject({ ok: false, error: 'goal' });
    expect(buyRoom(rich(), 'escritorio', { ...none, words: 20 }).ok).toBe(true);
    // Quarto e Jardim não têm meta; sem o progresso (como nos testes e no backup) a meta não vale.
    expect(buyRoom(rich(), 'quarto', none).ok).toBe(true);
    expect(buyRoom(rich(), 'jardim', none).ok).toBe(true);
    expect(buyRoom(rich(), 'escritorio').ok).toBe(true);
    for (const id of Object.keys(ROOM_GOALS)) expect(findRoom(id)).toBeDefined();
  });

  it('as metas medem palavras, tópicos dominados, sequência e dias de estudo', () => {
    const day = (d: number) => `2026-10-${String(d).padStart(2, '0')}`;
    const progress = homeProgressOf({ vocab: { 'ベッド|jm': { b: 1, due: 0 } }, mastered: { 'n3-1': 1, 'n3-2': 2 }, days: [day(28), day(29), day(30)] }, new Date(2026, 9, 30));
    expect(progress).toEqual({ words: 1, topics: 2, streak: 3, days: 3 });
    expect(goalStatus('sala', progress)).toMatchObject({ have: 1, met: false });
    expect(goalStatus('quarto', progress)).toBeNull();
    expect(goalLabel({ kind: 'words', goal: 20 })).toBe('Ter 20 palavras aprendidas');
  });

  it('a skin só se compra para um móvel que é seu, custa pétalas e já fica no móvel', () => {
    expect(SKINNABLE.has('cama')).toBe(true);
    expect(buySkin(rich(), 'cama', 'oceano')).toMatchObject({ ok: false, error: 'no-piece' });
    expect(buySkin(rich(), 'arvore', 'oceano')).toMatchObject({ ok: false, error: 'unknown' });
    const bed = buyFurniture(buyRoom(rich(), 'quarto').state, 'cama').state;
    const price = skinPriceFor(findFurniture('cama')?.price ?? 0);
    const bought = buySkin(bed, 'cama', 'oceano');
    expect(bought.ok).toBe(true);
    expect(bought.state.petals).toBe(bed.petals - price);
    expect(bought.state.home.skin).toEqual({ cama: 'oceano' });
    expect(buySkin(bought.state, 'cama', 'oceano')).toMatchObject({ ok: false, error: 'owned' });
    expect(buySkin({ ...bed, petals: 5 }, 'cama', 'matcha')).toMatchObject({ ok: false, error: 'poor' });
    // Voltar ao original e trocar de novo não custa nada.
    const plain = equipSkin(bought.state, 'cama', null);
    expect(plain.home.skin).toEqual({});
    expect(equipSkin(plain, 'cama', 'oceano').home.skin).toEqual({ cama: 'oceano' });
    expect(equipSkin(plain, 'cama', 'matcha')).toBe(plain);
    expect(plain.petals).toBe(bought.state.petals);
  });

  it('a skin sobrevive ao backup e some se o móvel não é mais seu', () => {
    const bed = buyFurniture(buyRoom(rich(), 'quarto').state, 'cama').state;
    const state = buySkin(bed, 'cama', 'lavanda').state;
    expect(sanitizeJourney(JSON.parse(JSON.stringify(state))).home).toMatchObject({ skins: [skinKey('cama', 'lavanda')], skin: { cama: 'lavanda' } });
    expect(sanitizeHome({ rooms: ['quarto'], furniture: [], skins: ['cama:lavanda'], skin: { cama: 'lavanda' } })).toEqual({ rooms: ['quarto'], furniture: [], skins: [], skin: {} });
    expect(sanitizeHome({ rooms: ['quarto'], furniture: ['cama'], skins: ['cama:xxx', 'arvore:oceano'], skin: { cama: 'xxx' } }).skins).toEqual([]);
  });

  it('girar o tom muda as cores com tom e deixa branco, cinza e traços escuros', () => {
    expect(shiftHex('#FFFFFF', 180)).toBe('#FFFFFF');
    expect(shiftHex('#8FA0A8', 180)).toBe('#8FA0A8');
    expect(shiftHex('#4A3B5C', 180)).toBe('#4A3B5C');
    expect(shiftHex('#FF0000', 120)).toBe('#00FF00');
    expect(shiftHex('#B98A5E', 0)).toBe('#B98A5E');
    expect(shiftHex('#B98A5E', 180)).not.toBe('#B98A5E');
    expect(shiftHex('transparent', 90)).toBe('transparent');
  });

  it('todo móvel com skin tem desenho, e a skin troca só as cores', () => {
    for (const id of SKINNABLE) {
      expect(findFurniture(id)).toBeDefined();
      expect(recolor(FURNITURE_ART[id], 180)).toBeDefined();
    }
    expect(recolor(FURNITURE_ART.cama, 0)).toBe(FURNITURE_ART.cama);
    expect(JSON.stringify(recolor(FURNITURE_ART.cama, 180))).not.toBe(JSON.stringify(FURNITURE_ART.cama));
  });
});
