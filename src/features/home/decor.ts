import type { JourneyState } from '../journey/journey';

/**
 * Fase 3 da Casa do Mochi: decoração de datas comemorativas (cada uma só se compra na época, como os cosméticos de datas, e
 * fica na casa para sempre) e clima (a hora do dia muda sozinha; chuva, neve, pétalas e vaga-lumes se compram uma vez).
 */

type MonthDay = readonly [number, number];

export interface Decor {
  id: string;
  name: string;
  /** O cômodo onde ela aparece (precisa ser seu para comprar). */
  room: string;
  /** A data comemorativa, para mostrar ao lado do nome. */
  occasion: string;
  from: MonthDay;
  to: MonthDay;
  price: number;
  description: string;
}

/** As janelas são as mesmas dos cosméticos de datas (src/features/journey/items.ts). */
export const DECOR: readonly Decor[] = [
  { id: 'guirlanda-natal', name: 'Guirlanda de Natal', room: 'sala', occasion: 'Natal', from: [12, 15], to: [12, 26], price: 220, description: 'Folhas, laço vermelho e bolinhas na parede da sala.' },
  { id: 'daruma', name: 'Daruma da sorte', room: 'escritorio', occasion: 'Ano-Novo', from: [12, 28], to: [1, 7], price: 240, description: 'Sobre os livros, com um olho só: o outro vem quando o desejo se realiza.' },
  { id: 'mascara-oni', name: 'Máscara de oni', room: 'quarto', occasion: 'Setsubun', from: [1, 25], to: [2, 5], price: 200, description: 'Na parede, para o azar ficar longe.' },
  { id: 'guirlanda-coracoes', name: 'Varal de corações', room: 'cozinha', occasion: 'Dia dos Namorados', from: [2, 7], to: [2, 14], price: 200, description: 'Corações pendurados no alto da cozinha.' },
  { id: 'hinadan', name: 'Hinadan', room: 'escritorio', occasion: 'Hinamatsuri', from: [2, 20], to: [3, 3], price: 260, description: 'Os degraus vermelhos das bonecas imperiais.' },
  { id: 'galho-sakura', name: 'Galho de sakura', room: 'jardim', occasion: 'Hanami', from: [3, 10], to: [4, 20], price: 240, description: 'Um galho florido para ver as flores.' },
  { id: 'koinobori', name: 'Koinobori', room: 'jardim', occasion: 'Dia das Crianças (Japão)', from: [4, 25], to: [5, 5], price: 260, description: 'Carpas coloridas que nadam no vento.' },
  { id: 'bandeirinhas', name: 'Bandeirinhas', room: 'varanda', occasion: 'Festa Junina', from: [6, 1], to: [6, 30], price: 200, description: 'O varal de bandeirinhas coloridas.' },
  { id: 'tanabata', name: 'Bambu de Tanabata', room: 'varanda', occasion: 'Tanabata', from: [6, 25], to: [7, 15], price: 240, description: 'Tiras de papel com desejos.' },
  { id: 'chochin-matsuri', name: 'Lanternas de festival', room: 'sala', occasion: 'Natsu-matsuri', from: [7, 15], to: [8, 20], price: 220, description: 'Uma fileira de lanternas de papel.' },
  { id: 'lua-tsukimi', name: 'Lua de Tsukimi', room: 'ofuro', occasion: 'Tsukimi', from: [9, 10], to: [10, 5], price: 260, description: 'A lua cheia na janela, com susuki.' },
  { id: 'abobora', name: 'Abóbora de Halloween', room: 'cozinha', occasion: 'Halloween', from: [10, 10], to: [11, 2], price: 200, description: 'Em cima da geladeira, de olho em você.' },
];

export const findDecor = (id: string): Decor | undefined => DECOR.find((d) => d.id === id);
export const decorOf = (roomId: string): Decor[] => DECOR.filter((d) => d.room === roomId);

/** O dia (mês, dia) está dentro de uma janela que pode virar o ano (28/12 a 7/1)? */
export function inWindow(from: MonthDay, to: MonthDay, month: number, day: number): boolean {
  const value = month * 100 + day;
  const start = from[0] * 100 + from[1];
  const end = to[0] * 100 + to[1];
  return start <= end ? value >= start && value <= end : value >= start || value <= end;
}

/** A decoração está à venda nesta data? */
export const decorAvailable = (decor: Decor, date: Date): boolean => inWindow(decor.from, decor.to, date.getMonth() + 1, date.getDate());

/** Em quantos dias a decoração abre (0 se já está à venda). */
export function daysUntilOpen(decor: Decor, date: Date): number {
  if (decorAvailable(decor, date)) return 0;
  const midnight = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const starts = [date.getFullYear(), date.getFullYear() + 1].map((year) => Math.round((midnight(new Date(year, decor.from[0] - 1, decor.from[1])) - midnight(date)) / 86_400_000));
  return Math.min(...starts.filter((days) => days > 0));
}

/** A próxima decoração a abrir (ou a que já está aberta, com 0 dias): para avisar "volta em N dias". */
export function nextDecor(date: Date): { decor: Decor; days: number } {
  const midnight = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  let best: { decor: Decor; days: number } | null = null;
  for (const decor of DECOR) {
    for (const year of [date.getFullYear(), date.getFullYear() + 1]) {
      const start = new Date(year, decor.from[0] - 1, decor.from[1]);
      const days = Math.round((midnight(start) - midnight(date)) / 86_400_000);
      const open = decorAvailable(decor, date);
      const gap = open ? 0 : days;
      if (gap >= 0 && (best === null || gap < best.days)) best = { decor, days: gap };
    }
  }
  return best as { decor: Decor; days: number };
}

export type DecorBuyError = 'unknown' | 'owned' | 'no-room' | 'poor' | 'out-of-season';

export type DecorBuyResult = { ok: true; state: JourneyState } | { ok: false; error: DecorBuyError; state: JourneyState };

export const DECOR_BUY_MESSAGES: Readonly<Record<DecorBuyError, string>> = {
  unknown: 'Isso não existe mais.',
  owned: 'Você já tem isso.',
  'no-room': 'Compre o cômodo antes da decoração dele.',
  poor: 'Faltam pétalas para comprar isso.',
  'out-of-season': 'Esta decoração só está à venda na época da data.',
};

/** Compra uma decoração de data: só na época, com o cômodo comprado e pétalas. */
export function buyDecor(state: JourneyState, decorId: string, date: Date): DecorBuyResult {
  const decor = findDecor(decorId);
  if (!decor) return { ok: false, error: 'unknown', state };
  if (state.home.decor.includes(decorId)) return { ok: false, error: 'owned', state };
  if (!state.home.rooms.includes(decor.room)) return { ok: false, error: 'no-room', state };
  if (!decorAvailable(decor, date)) return { ok: false, error: 'out-of-season', state };
  if (state.petals < decor.price) return { ok: false, error: 'poor', state };
  return { ok: true, state: { ...state, petals: state.petals - decor.price, home: { ...state.home, decor: [...state.home.decor, decorId] } } };
}

// --- clima ---

export interface Weather {
  id: string;
  name: string;
  emoji: string;
  price: number;
  description: string;
}

export const WEATHERS: readonly Weather[] = [
  { id: 'chuva', name: 'Chuva', emoji: '🌧️', price: 120, description: 'Gotas finas caindo sobre a casa.' },
  { id: 'neve', name: 'Neve', emoji: '❄️', price: 180, description: 'Flocos que parecem não terminar.' },
  { id: 'petalas', name: 'Pétalas', emoji: '🌸', price: 150, description: 'Pétalas de sakura levadas pelo vento.' },
  { id: 'vagalumes', name: 'Vaga-lumes', emoji: '✨', price: 150, description: 'Luzinhas que piscam, melhores à noite.' },
];

export const findWeather = (id: string): Weather | undefined => WEATHERS.find((w) => w.id === id);

export type WeatherBuyError = 'unknown' | 'owned' | 'poor';

export type WeatherBuyResult = { ok: true; state: JourneyState } | { ok: false; error: WeatherBuyError; state: JourneyState };

/** Compra um clima (e já o liga). */
export function buyWeather(state: JourneyState, weatherId: string): WeatherBuyResult {
  const weather = findWeather(weatherId);
  if (!weather) return { ok: false, error: 'unknown', state };
  if (state.home.weathers.includes(weatherId)) return { ok: false, error: 'owned', state };
  if (state.petals < weather.price) return { ok: false, error: 'poor', state };
  return { ok: true, state: { ...state, petals: state.petals - weather.price, home: { ...state.home, weathers: [...state.home.weathers, weatherId], weather: weatherId } } };
}

/** Liga um clima que a pessoa tem (ou null para voltar ao automático: só a hora do dia). */
export function setWeather(state: JourneyState, weatherId: string | null): JourneyState {
  if (weatherId !== null && !state.home.weathers.includes(weatherId)) return state;
  return { ...state, home: { ...state.home, weather: weatherId } };
}

// --- hora do dia ---

export type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night';

export const TIME_LABELS: Readonly<Record<TimeOfDay, string>> = { dawn: 'amanhecer', day: 'dia', dusk: 'entardecer', night: 'noite' };

/** A hora do relógio do celular vira a luz da casa: amanhecer (5h às 7h), dia, entardecer (17h às 19h) e noite. */
export function timeOfDay(date: Date): TimeOfDay {
  const hour = date.getHours();
  if (hour >= 5 && hour < 7) return 'dawn';
  if (hour >= 7 && hour < 17) return 'day';
  if (hour >= 17 && hour < 19) return 'dusk';
  return 'night';
}
