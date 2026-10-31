import type { JourneyState } from '../journey/journey';

/**
 * A Casa do Mochi: cômodos (de dentro e de fora) comprados com pétalas e, em cada cômodo, móveis também comprados com pétalas.
 * O estado é só duas listas de ids dentro da jornada; as regras são funções puras, como as do resto da jornada.
 */

export type RoomKind = 'inside' | 'outside';

export interface Room {
  id: string;
  name: string;
  kind: RoomKind;
  price: number;
  description: string;
}

export interface Furniture {
  id: string;
  room: string;
  name: string;
  price: number;
  description: string;
}

export const ROOMS: readonly Room[] = [
  { id: 'quarto', name: 'Quarto', kind: 'inside', price: 250, description: 'Onde o Mochi dorme e sonha com palavras novas.' },
  { id: 'jardim', name: 'Jardim', kind: 'outside', price: 400, description: 'Um canto ao ar livre, com sol, flores e uma árvore.' },
  { id: 'escritorio', name: 'Escritório', kind: 'inside', price: 600, description: 'O cantinho de estudo do Mochi, com mesa, livros e kanji.' },
];

export const FURNITURE: readonly Furniture[] = [
  { id: 'cama', room: 'quarto', name: 'Caminha', price: 150, description: 'Uma caminha macia com travesseiro rosa.' },
  { id: 'tapete', room: 'quarto', name: 'Tapete redondo', price: 90, description: 'Um tapete bem fofo para as patinhas.' },
  { id: 'abajur', room: 'quarto', name: 'Abajur', price: 120, description: 'Luz quentinha para a hora de dormir.' },
  { id: 'estante-quarto', room: 'quarto', name: 'Estante de parede', price: 180, description: 'Livros e uma plantinha na parede.' },
  { id: 'janela', room: 'quarto', name: 'Janela com cortina', price: 110, description: 'Deixa o céu entrar no quarto.' },
  { id: 'cerca', room: 'jardim', name: 'Cerquinha', price: 100, description: 'Uma cerca de madeira ao fundo do jardim.' },
  { id: 'canteiro', room: 'jardim', name: 'Canteiro de flores', price: 120, description: 'Flores coloridas para as pétalas virarem jardim.' },
  { id: 'arvore', room: 'jardim', name: 'Árvore frondosa', price: 200, description: 'Uma sombra boa para um cochilo.' },
  { id: 'lago', room: 'jardim', name: 'Laguinho', price: 260, description: 'Um lago pequeno com um brilho na água.' },
  { id: 'banco', room: 'jardim', name: 'Banco de madeira', price: 140, description: 'Um banco para olhar as flores.' },
  { id: 'mesa', room: 'escritorio', name: 'Mesa de estudo', price: 180, description: 'Uma mesa com caderno e caneca.' },
  { id: 'quadro', room: 'escritorio', name: 'Quadro de kanji', price: 120, description: 'Um quadro com o kanji 山 (montanha).' },
  { id: 'livros', room: 'escritorio', name: 'Pilha de livros', price: 100, description: 'Livros de japonês empilhados.' },
  { id: 'lanterna', room: 'escritorio', name: 'Lanterna de papel', price: 130, description: 'Pendurada no teto, com luz suave.' },
  { id: 'planta', room: 'escritorio', name: 'Planta no vaso', price: 90, description: 'Um pouco de verde para estudar melhor.' },
];

export const findRoom = (id: string): Room | undefined => ROOMS.find((r) => r.id === id);
export const findFurniture = (id: string): Furniture | undefined => FURNITURE.find((f) => f.id === id);
export const furnitureOf = (roomId: string): Furniture[] => FURNITURE.filter((f) => f.room === roomId);

export interface HomeState {
  /** Ids dos cômodos comprados. */
  rooms: string[];
  /** Ids dos móveis comprados (cada um dentro do cômodo dele). */
  furniture: string[];
}

export const emptyHome = (): HomeState => ({ rooms: [], furniture: [] });

/** Lê o estado vindo do disco ou de um backup: ids desconhecidos saem, e um móvel só vale se o cômodo dele foi comprado. */
export function sanitizeHome(raw: unknown): HomeState {
  if (typeof raw !== 'object' || raw === null) return emptyHome();
  const read = (v: unknown): string[] => (Array.isArray(v) ? [...new Set(v.filter((x): x is string => typeof x === 'string'))] : []);
  const data = raw as Record<string, unknown>;
  const rooms = read(data.rooms).filter((id) => findRoom(id) !== undefined);
  const furniture = read(data.furniture).filter((id) => {
    const piece = findFurniture(id);
    return piece !== undefined && rooms.includes(piece.room);
  });
  return { rooms, furniture };
}

export type HomeBuyError = 'unknown' | 'owned' | 'no-room' | 'poor';

export type HomeBuyResult = { ok: true; state: JourneyState } | { ok: false; error: HomeBuyError; state: JourneyState };

export const HOME_BUY_MESSAGES: Readonly<Record<HomeBuyError, string>> = {
  unknown: 'Isso não existe mais.',
  owned: 'Você já tem isso.',
  'no-room': 'Compre o cômodo antes dos móveis dele.',
  poor: 'Faltam pétalas para comprar isso.',
};

/** Compra um cômodo com pétalas. */
export function buyRoom(state: JourneyState, roomId: string): HomeBuyResult {
  const room = findRoom(roomId);
  if (!room) return { ok: false, error: 'unknown', state };
  if (state.home.rooms.includes(roomId)) return { ok: false, error: 'owned', state };
  if (state.petals < room.price) return { ok: false, error: 'poor', state };
  return { ok: true, state: { ...state, petals: state.petals - room.price, home: { ...state.home, rooms: [...state.home.rooms, roomId] } } };
}

/** Compra um móvel com pétalas; o cômodo dele precisa ser seu. */
export function buyFurniture(state: JourneyState, furnitureId: string): HomeBuyResult {
  const piece = findFurniture(furnitureId);
  if (!piece) return { ok: false, error: 'unknown', state };
  if (state.home.furniture.includes(furnitureId)) return { ok: false, error: 'owned', state };
  if (!state.home.rooms.includes(piece.room)) return { ok: false, error: 'no-room', state };
  if (state.petals < piece.price) return { ok: false, error: 'poor', state };
  return { ok: true, state: { ...state, petals: state.petals - piece.price, home: { ...state.home, furniture: [...state.home.furniture, furnitureId] } } };
}
