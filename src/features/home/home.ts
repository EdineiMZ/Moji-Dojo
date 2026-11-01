import type { JourneyState } from '../journey/journey';
import { findDecor, findWeather } from './decor';
import { goalStatus, type HomeProgress } from './goals';
import { findSkin, SKINNABLE, skinKey, skinPriceFor } from './skins';

/**
 * A Casa do Mochi: cômodos (de dentro e de fora) comprados com pétalas e, em cada cômodo, móveis também comprados com pétalas.
 * O estado é só duas listas de ids dentro da jornada; as regras são funções puras, como as do resto da jornada.
 */

export type RoomKind = 'inside' | 'outside';

export interface Room {
  id: string;
  name: string;
  kind: RoomKind;
  /** O emoji do cômodo, nos botões. */
  icon: string;
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
  { id: 'quarto', name: 'Quarto', kind: 'inside', icon: '🛏️', price: 250, description: 'Onde o Mochi dorme e sonha com palavras novas.' },
  { id: 'jardim', name: 'Jardim', kind: 'outside', icon: '🌳', price: 400, description: 'Um canto ao ar livre, com sol, flores e uma árvore.' },
  { id: 'escritorio', name: 'Escritório', kind: 'inside', icon: '📚', price: 600, description: 'O cantinho de estudo do Mochi, com mesa, livros e kanji.' },
  { id: 'varanda', name: 'Varanda', kind: 'outside', icon: '🎐', price: 700, description: 'Um deque com vento, chá e o sininho que toca sozinho.' },
  { id: 'sala', name: 'Sala', kind: 'inside', icon: '🛋️', price: 800, description: 'Sofá, kotatsu e a TV para ver anime sem legenda (quase).' },
  { id: 'cozinha', name: 'Cozinha', kind: 'inside', icon: '🍳', price: 1000, description: 'Onde o Mochi prepara o arroz e as frutas do dia.' },
  { id: 'ofuro', name: 'Ofurô', kind: 'inside', icon: '♨️', price: 1200, description: 'Um banho quente de madeira, com vapor e bambu.' },
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
  { id: 'grade', room: 'varanda', name: 'Grade branca', price: 100, description: 'A proteção da varanda, com a vista atrás.' },
  { id: 'furin', room: 'varanda', name: 'Sininho de vento', price: 90, description: 'Um furin de vidro com um papelzinho.' },
  { id: 'vasos', room: 'varanda', name: 'Vasos de plantas', price: 110, description: 'Dois vasos com flores e folhas.' },
  { id: 'mesinha-cha', room: 'varanda', name: 'Mesinha de chá', price: 180, description: 'Um bule e uma xícara para o fim da tarde.' },
  { id: 'lanterna-pedra', room: 'varanda', name: 'Lanterna de pedra', price: 150, description: 'Uma lanterna de pedra com a luzinha acesa.' },
  { id: 'sofa', room: 'sala', name: 'Sofá roxo', price: 260, description: 'Fofo e grande, cabe o Mochi e um amigo.' },
  { id: 'kotatsu', room: 'sala', name: 'Kotatsu', price: 220, description: 'A mesinha com cobertor, uma tangerina em cima.' },
  { id: 'tv', room: 'sala', name: 'Televisão', price: 240, description: 'Para ouvir japonês enquanto descansa.' },
  { id: 'almofadas', room: 'sala', name: 'Almofadas', price: 90, description: 'Duas almofadas de chão, uma rosa e uma azul.' },
  { id: 'relogio', room: 'sala', name: 'Relógio de parede', price: 120, description: 'Para lembrar a hora do estudo.' },
  { id: 'geladeira', room: 'cozinha', name: 'Geladeira', price: 260, description: 'Branca, com um bilhetinho rosa na porta.' },
  { id: 'fogao', room: 'cozinha', name: 'Fogão e panela', price: 220, description: 'Uma panela fumegando para o jantar.' },
  { id: 'prateleira-cozinha', room: 'cozinha', name: 'Prateleira de louças', price: 140, description: 'Pratos, tigelas e potes de temperos.' },
  { id: 'frutas', room: 'cozinha', name: 'Cesta de frutas', price: 90, description: 'Maçã, tangerina e kiwi.' },
  { id: 'banqueta', room: 'cozinha', name: 'Banqueta', price: 100, description: 'Para sentar enquanto o arroz cozinha.' },
  { id: 'banheira', room: 'ofuro', name: 'Banheira de madeira', price: 300, description: 'Uma banheira de cedro com água quentinha.' },
  { id: 'banquinho', room: 'ofuro', name: 'Banquinho e balde', price: 100, description: 'Para se lavar antes de entrar.' },
  { id: 'toalhas', room: 'ofuro', name: 'Toalhas', price: 90, description: 'Uma rosa e uma azul, penduradas.' },
  { id: 'bambu', room: 'ofuro', name: 'Bambuzal', price: 150, description: 'Três talos de bambu na parede.' },
  { id: 'patinho', room: 'ofuro', name: 'Patinho de borracha', price: 80, description: 'O melhor companheiro de banho.' },
];

export const findRoom = (id: string): Room | undefined => ROOMS.find((r) => r.id === id);
export const findFurniture = (id: string): Furniture | undefined => FURNITURE.find((f) => f.id === id);
export const furnitureOf = (roomId: string): Furniture[] => FURNITURE.filter((f) => f.room === roomId);

export interface HomeState {
  /** Ids dos cômodos comprados. */
  rooms: string[];
  /** Ids dos móveis comprados (cada um dentro do cômodo dele). */
  furniture: string[];
  /** Skins compradas, como "móvel:skin". */
  skins: string[];
  /** A skin que cada móvel está usando (sem entrada = o desenho original). */
  skin: Record<string, string>;
  /** Decorações de datas compradas. */
  decor: string[];
  /** Climas comprados. */
  weathers: string[];
  /** O clima ligado (null = automático: só a hora do dia). */
  weather: string | null;
}

export const emptyHome = (): HomeState => ({ rooms: [], furniture: [], skins: [], skin: {}, decor: [], weathers: [], weather: null });

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
  const skins = read(data.skins).filter((key) => {
    const [pieceId = '', skinId = ''] = key.split(':');
    return furniture.includes(pieceId) && SKINNABLE.has(pieceId) && findSkin(skinId) !== undefined;
  });
  const on = typeof data.skin === 'object' && data.skin !== null && !Array.isArray(data.skin) ? (data.skin as Record<string, unknown>) : {};
  const skin: Record<string, string> = {};
  for (const [pieceId, skinId] of Object.entries(on)) if (typeof skinId === 'string' && skins.includes(skinKey(pieceId, skinId))) skin[pieceId] = skinId;
  const decor = read(data.decor).filter((id) => {
    const piece = findDecor(id);
    return piece !== undefined && rooms.includes(piece.room);
  });
  const weathers = read(data.weathers).filter((id) => findWeather(id) !== undefined);
  const weather = typeof data.weather === 'string' && weathers.includes(data.weather) ? data.weather : null;
  return { rooms, furniture, skins, skin, decor, weathers, weather };
}

export type HomeBuyError = 'unknown' | 'owned' | 'no-room' | 'poor' | 'goal' | 'no-piece';

export type HomeBuyResult = { ok: true; state: JourneyState } | { ok: false; error: HomeBuyError; state: JourneyState };

export const HOME_BUY_MESSAGES: Readonly<Record<HomeBuyError, string>> = {
  unknown: 'Isso não existe mais.',
  owned: 'Você já tem isso.',
  'no-room': 'Compre o cômodo antes dos móveis dele.',
  poor: 'Faltam pétalas para comprar isso.',
  goal: 'Cumpra a meta de estudo deste cômodo antes de comprar.',
  'no-piece': 'Compre o móvel antes da skin dele.',
};

/** Compra um cômodo com pétalas. Se ele tem meta de estudo e o progresso é dado, a meta precisa estar cumprida. */
export function buyRoom(state: JourneyState, roomId: string, progress?: HomeProgress): HomeBuyResult {
  const room = findRoom(roomId);
  if (!room) return { ok: false, error: 'unknown', state };
  if (state.home.rooms.includes(roomId)) return { ok: false, error: 'owned', state };
  if (progress) {
    const status = goalStatus(roomId, progress);
    if (status && !status.met) return { ok: false, error: 'goal', state };
  }
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

/** Compra a skin de um móvel que já é seu e já a coloca nele. */
export function buySkin(state: JourneyState, furnitureId: string, skinId: string): HomeBuyResult {
  const piece = findFurniture(furnitureId);
  if (!piece || !SKINNABLE.has(furnitureId) || !findSkin(skinId)) return { ok: false, error: 'unknown', state };
  if (!state.home.furniture.includes(furnitureId)) return { ok: false, error: 'no-piece', state };
  if (state.home.skins.includes(skinKey(furnitureId, skinId))) return { ok: false, error: 'owned', state };
  const price = skinPriceFor(piece.price);
  if (state.petals < price) return { ok: false, error: 'poor', state };
  return {
    ok: true,
    state: {
      ...state,
      petals: state.petals - price,
      home: { ...state.home, skins: [...state.home.skins, skinKey(furnitureId, skinId)], skin: { ...state.home.skin, [furnitureId]: skinId } },
    },
  };
}

/** Troca a skin em uso (null = o desenho original); só vale para o que a pessoa tem. */
export function equipSkin(state: JourneyState, furnitureId: string, skinId: string | null): JourneyState {
  if (skinId === null) {
    const { [furnitureId]: _gone, ...rest } = state.home.skin;
    return { ...state, home: { ...state.home, skin: rest } };
  }
  if (!state.home.skins.includes(skinKey(furnitureId, skinId))) return state;
  return { ...state, home: { ...state.home, skin: { ...state.home.skin, [furnitureId]: skinId } } };
}
