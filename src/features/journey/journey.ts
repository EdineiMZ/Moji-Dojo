import { buyable, findItem, priceOf, SLOTS, type Slot } from './items';

/**
 * A "jornada" do aluno: pétalas, itens do Mochi, conquistas, missões, metas e nível. É um estado só, guardado dentro do
 * progresso (e do backup). Todas as regras estão em funções puras que recebem o estado e devolvem o novo.
 */

export type ToastKind = 'achievement' | 'level' | 'item' | 'petals' | 'mission' | 'week' | 'streak';

/** Aviso para mostrar uma vez (conquista nova, nível, item ganho...). */
export interface Toast {
  id: string;
  kind: ToastKind;
  title: string;
  text: string;
}

export interface DayState {
  /** "AAAA-MM-DD" a que este bloco se refere; muda quando vira o dia. */
  day: string;
  /** Pétalas de lição e revisão ganhas hoje (conta para o teto diário). */
  earned: number;
  /** O bônus de abrir o app hoje já foi dado. */
  opened: boolean;
  /** Lições já concluídas hoje (a repetição vale metade). */
  lessons: string[];
  /** Contadores do dia, para as missões. */
  counts: Record<string, number>;
  /** Missões do dia já resgatadas (ids). */
  claimed: string[];
  /** A meta diária de respostas já foi comemorada hoje. */
  goalDone: boolean;
}

export interface WeekState {
  /** "AAAA-Www" a que este bloco se refere. */
  key: string;
  /** O baú da semana já foi aberto. */
  claimed: boolean;
  /** Acertos no desafio temático da semana. */
  challenge: number;
  challengeClaimed: boolean;
  /** O aviso de "baú pronto" já foi dado nesta semana. */
  notified: boolean;
}

/** Oferta de salvar a sequência: os dias perdidos e o tamanho da sequência que se perderia. */
export interface RescueOffer {
  /** O dia em que a oferta foi feita; ela vale só nesse dia. */
  day: string;
  missed: string[];
  broken: number;
}

export interface JourneyState {
  petals: number;
  /** Total de pétalas já ganhas na vida (o saldo cai ao comprar, este não). */
  petalsEarned: number;
  xp: number;
  owned: string[];
  equipped: Partial<Record<Slot, string>>;
  /** Veste sozinho o item de temporada que o aluno tem, enquanto a época dura. */
  seasonalAuto: boolean;
  /** Conquistas ganhas: id → momento. */
  achievements: Record<string, number>;
  /** Contadores de vida (respostas certas, ditados, gravações...). */
  counters: Record<string, number>;
  perfectRun: number;
  bestPerfectRun: number;
  bestStreak: number;
  today: DayState;
  week: WeekState;
  weeksWon: number;
  /** Erros recentes (itens para a revisão de resgate), do mais antigo ao mais novo. */
  misses: string[];
  /** Quando foi o último resgate de sequência. */
  lastRescueAt: number | null;
  /** Oferta de resgate aberta (null se não há). */
  rescue: RescueOffer | null;
  /** Dias da semana (0 = domingo) em que não estudar não quebra a sequência. */
  restWeekdays: number[];
  /** Quantas respostas por dia o aluno quer fazer. */
  dailyGoal: number;
  toasts: Toast[];
}

export const MAX_TOASTS = 20;
export const MAX_MISSES = 80;
export const DAILY_GOALS: readonly number[] = [5, 10, 20, 40];
export const DEFAULT_DAILY_GOAL = 10;

export const emptyDay = (day = ''): DayState => ({ day, earned: 0, opened: false, lessons: [], counts: {}, claimed: [], goalDone: false });
export const emptyWeek = (key = ''): WeekState => ({ key, claimed: false, challenge: 0, challengeClaimed: false, notified: false });

export const emptyJourney = (): JourneyState => ({
  petals: 0,
  petalsEarned: 0,
  xp: 0,
  owned: [],
  equipped: {},
  seasonalAuto: true,
  achievements: {},
  counters: {},
  perfectRun: 0,
  bestPerfectRun: 0,
  bestStreak: 0,
  today: emptyDay(),
  week: emptyWeek(),
  weeksWon: 0,
  misses: [],
  lastRescueAt: null,
  rescue: null,
  restWeekdays: [],
  dailyGoal: DEFAULT_DAILY_GOAL,
  toasts: [],
});

// --- leitura segura (backup e armazenamento) ---

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const isCount = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0;
const count = (v: unknown, fallback = 0): number => (isCount(v) ? Math.floor(v) : fallback);
const strings = (v: unknown, max: number): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string').slice(-max) : []);

function numberMap(v: unknown): Record<string, number> {
  const out: Record<string, number> = {};
  if (!isRecord(v)) return out;
  for (const [key, value] of Object.entries(v)) if (isCount(value)) out[key] = Math.floor(value);
  return out;
}

/**
 * Reconstrói o estado a partir de algo vindo do disco ou de um backup: o que não tem a forma certa vira o padrão, e itens
 * que o app não conhece são descartados. Nunca lança.
 */
export function sanitizeJourney(raw: unknown): JourneyState {
  const base = emptyJourney();
  if (!isRecord(raw)) return base;

  const owned = [...new Set(strings(raw.owned, 200))].filter((id) => findItem(id) !== undefined);

  const equipped: Partial<Record<Slot, string>> = {};
  if (isRecord(raw.equipped)) {
    for (const slot of SLOTS) {
      const id = raw.equipped[slot];
      const item = typeof id === 'string' ? findItem(id) : undefined;
      if (item && item.slot === slot && owned.includes(item.id)) equipped[slot] = item.id;
    }
  }

  const today = isRecord(raw.today) ? raw.today : {};
  const week = isRecord(raw.week) ? raw.week : {};
  const toasts = Array.isArray(raw.toasts)
    ? raw.toasts.filter(
        (t): t is Toast => isRecord(t) && typeof t.id === 'string' && typeof t.kind === 'string' && typeof t.title === 'string' && typeof t.text === 'string',
      )
    : [];
  const goal = count(raw.dailyGoal, DEFAULT_DAILY_GOAL);

  return {
    petals: count(raw.petals),
    petalsEarned: count(raw.petalsEarned),
    xp: count(raw.xp),
    owned,
    equipped,
    seasonalAuto: raw.seasonalAuto !== false,
    achievements: numberMap(raw.achievements),
    counters: numberMap(raw.counters),
    perfectRun: count(raw.perfectRun),
    bestPerfectRun: count(raw.bestPerfectRun),
    bestStreak: count(raw.bestStreak),
    today: {
      day: typeof today.day === 'string' ? today.day : '',
      earned: count(today.earned),
      opened: today.opened === true,
      lessons: strings(today.lessons, 200),
      counts: numberMap(today.counts),
      claimed: strings(today.claimed, 20),
      goalDone: today.goalDone === true,
    },
    week: {
      key: typeof week.key === 'string' ? week.key : '',
      claimed: week.claimed === true,
      challenge: count(week.challenge),
      challengeClaimed: week.challengeClaimed === true,
      notified: week.notified === true,
    },
    weeksWon: count(raw.weeksWon),
    misses: strings(raw.misses, MAX_MISSES),
    lastRescueAt: isCount(raw.lastRescueAt) ? raw.lastRescueAt : null,
    rescue: sanitizeRescue(raw.rescue),
    restWeekdays: [...new Set(Array.isArray(raw.restWeekdays) ? raw.restWeekdays.filter((d): d is number => Number.isInteger(d) && d >= 0 && d <= 6) : [])].sort(),
    dailyGoal: DAILY_GOALS.includes(goal) ? goal : DEFAULT_DAILY_GOAL,
    toasts: toasts.slice(-MAX_TOASTS),
  };
}

function sanitizeRescue(raw: unknown): RescueOffer | null {
  if (!isRecord(raw) || typeof raw.day !== 'string') return null;
  const missed = strings(raw.missed, 3);
  if (missed.length === 0 || !isCount(raw.broken)) return null;
  return { day: raw.day, missed, broken: Math.floor(raw.broken) };
}

// --- avisos ---

let toastSeq = 0;

/** Acrescenta um aviso (os mais antigos saem quando passa do limite). */
export function pushToast(state: JourneyState, kind: ToastKind, title: string, text: string): JourneyState {
  toastSeq += 1;
  const toast: Toast = { id: `${Date.now().toString(36)}-${toastSeq}`, kind, title, text };
  return { ...state, toasts: [...state.toasts, toast].slice(-MAX_TOASTS) };
}

export const dismissToast = (state: JourneyState, id: string): JourneyState => ({ ...state, toasts: state.toasts.filter((t) => t.id !== id) });

// --- pétalas e itens ---

/** Soma pétalas ao saldo e ao total ganho. Valor zero ou negativo não faz nada. */
export function addPetals(state: JourneyState, amount: number): JourneyState {
  if (!(amount > 0)) return state;
  const whole = Math.floor(amount);
  return { ...state, petals: state.petals + whole, petalsEarned: state.petalsEarned + whole };
}

/** Dá o item ao aluno (sem cobrar). Se já tinha, não muda. Escolhe se ele também é vestido quando o espaço está vazio. */
export function grantItem(state: JourneyState, itemId: string, announce = true): JourneyState {
  const item = findItem(itemId);
  if (!item || state.owned.includes(itemId)) return state;
  const next: JourneyState = {
    ...state,
    owned: [...state.owned, itemId],
    equipped: state.equipped[item.slot] ? state.equipped : { ...state.equipped, [item.slot]: itemId },
  };
  return announce ? pushToast(next, 'item', 'Item novo!', `${item.name} já está no seu armário.`) : next;
}

export type BuyError = 'unknown' | 'owned' | 'not-for-sale' | 'out-of-season' | 'poor';

export type BuyResult = { ok: true; state: JourneyState } | { ok: false; error: BuyError; state: JourneyState };

export const BUY_MESSAGES: Readonly<Record<BuyError, string>> = {
  unknown: 'Esse item não existe mais.',
  owned: 'Você já tem esse item.',
  'not-for-sale': 'Esse item não se compra: ele é uma recompensa.',
  'out-of-season': 'Esse item só aparece na loja na sua época.',
  poor: 'Faltam pétalas para comprar esse item.',
};

/** Compra um item com pétalas. O item novo já fica vestido se o espaço dele estava vazio. */
export function buyItem(state: JourneyState, itemId: string, date: Date): BuyResult {
  const item = findItem(itemId);
  if (!item) return { ok: false, error: 'unknown', state };
  if (state.owned.includes(itemId)) return { ok: false, error: 'owned', state };
  const price = priceOf(item);
  if (price === null) return { ok: false, error: 'not-for-sale', state };
  if (!buyable(item, date)) return { ok: false, error: 'out-of-season', state };
  if (state.petals < price) return { ok: false, error: 'poor', state };
  const paid: JourneyState = { ...state, petals: state.petals - price };
  return { ok: true, state: grantItem({ ...paid, counters: bump(paid.counters, 'purchases') }, itemId, false) };
}

/** Veste um item que o aluno tem (troca o que estava no espaço). */
export function equipItem(state: JourneyState, itemId: string): JourneyState {
  const item = findItem(itemId);
  if (!item || !state.owned.includes(itemId)) return state;
  return { ...state, equipped: { ...state.equipped, [item.slot]: itemId } };
}

/** Tira o que está vestido num espaço. */
export function unequipSlot(state: JourneyState, slot: Slot): JourneyState {
  if (!state.equipped[slot]) return state;
  const equipped = { ...state.equipped };
  delete equipped[slot];
  return { ...state, equipped };
}

export const bump = (counters: Readonly<Record<string, number>>, key: string, by = 1): Record<string, number> => ({
  ...counters,
  [key]: (counters[key] ?? 0) + by,
});

/**
 * O que o Mochi veste agora: o que o aluno equipou e, com a opção ligada, um item de temporada que ele tem e que está
 * na época, no lugar de um espaço vazio.
 */
export function outfit(state: JourneyState, date: Date): Partial<Record<Slot, string>> {
  const worn = { ...state.equipped };
  if (!state.seasonalAuto) return worn;
  for (const id of state.owned) {
    const item = findItem(id);
    if (item?.source.kind === 'season' && buyable(item, date) && !worn[item.slot]) worn[item.slot] = id;
  }
  return worn;
}
