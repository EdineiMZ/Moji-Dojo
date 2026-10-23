import { formatDay } from '@/features/streak/days';
import { countSkill } from './skills';
import { newlyEarned, type AchievementContext } from './achievements';
import { answerXp, lessonReward, roomToday, sessionReward, openBonus } from './economy';
import { findItem, ITEMS } from './items';
import {
  addPetals,
  bump,
  emptyDay,
  emptyWeek,
  grantItem,
  MAX_MISSES,
  pushToast,
  type JourneyState,
} from './journey';
import { levelOf, levelUpPetals, titleFor } from './levels';
import {
  ALL_MISSIONS_BONUS,
  challengeFor,
  CHALLENGE_XP,
  findMission,
  MISSION_PETALS,
  MISSION_XP,
  missionsFor,
  WEEKLY_DAYS_GOAL,
  WEEKLY_PETALS,
} from './missions';
import { weekKey } from './week';

/** O que as regras precisam saber do resto do app no momento do evento. */
export interface EventContext {
  now: Date;
  /** Dias seguidos de estudo (já contando o evento, se ele marcou o dia). */
  streak: number;
  /** Maior sequência já vista nos dias guardados. */
  bestStreak: number;
  /** Dias da semana (segunda a domingo) com estudo marcado. */
  weekDays: number;
  wordsLearned: number;
  topicsMastered: number;
  hiraDone: boolean;
  kataDone: boolean;
  phrasesCount: number;
  /** Dias entre o estudo anterior e hoje (só no primeiro evento do dia; 0 se estudou ontem ou hoje). */
  daysAway?: number;
}

/** De onde vem uma resposta (decide que missões e conquistas ela conta). */
export type Area =
  | 'kana'
  | 'vocab'
  | 'conj'
  | 'particle'
  | 'phrase'
  | 'drill'
  | 'dictation'
  | 'understand'
  | 'speak'
  | 'tone'
  | 'dialog'
  | 'translate';

const GRAMMAR_AREAS: readonly Area[] = ['drill', 'conj', 'particle'];

/** Ajusta os blocos do dia e da semana quando eles viraram. */
export function roll(state: JourneyState, now: Date): JourneyState {
  let next = state;
  const day = formatDay(now);
  if (next.today.day !== day) next = { ...next, today: emptyDay(day) };
  const key = weekKey(now);
  if (next.week.key !== key) next = { ...next, week: emptyWeek(key) };
  return next;
}

/** Soma experiência; ao subir de nível dá pétalas de presente e avisa. */
export function gainXp(state: JourneyState, amount: number): JourneyState {
  if (!(amount > 0)) return state;
  const before = levelOf(state.xp);
  let next: JourneyState = { ...state, xp: state.xp + Math.floor(amount) };
  const after = levelOf(next.xp);
  for (let level = before + 1; level <= after; level++) {
    const gift = levelUpPetals(level);
    next = addPetals(next, gift);
    next = pushToast(next, 'level', `Nível ${level}!`, `${titleFor(level)}. +${gift} pétalas de presente.`);
  }
  return next;
}

/** Pétalas de lição e revisão, limitadas pelo teto do dia. Devolve quanto realmente entrou. */
function earnCapped(state: JourneyState, amount: number): { state: JourneyState; given: number } {
  const given = Math.min(Math.floor(amount), roomToday(state.today.earned));
  if (given <= 0) return { state, given: 0 };
  return { state: addPetals({ ...state, today: { ...state.today, earned: state.today.earned + given } }, given), given };
}

const plural = (n: number, one: string, many: string): string => `${n} ${n === 1 ? one : many}`;

const countDay = (state: JourneyState, key: string, by = 1): JourneyState => ({
  ...state,
  today: { ...state.today, counts: bump(state.today.counts, key, by) },
});

// --- eventos ---

/** O app foi aberto: bônus do dia (uma vez) e a volta depois de uma pausa. */
export function onOpen(state: JourneyState, ctx: EventContext): JourneyState {
  let next = roll(state, ctx.now);
  if (!next.today.opened) {
    next = { ...next, today: { ...next.today, opened: true } };
    const earned = earnCapped(next, openBonus(ctx.streak));
    next = earned.state;
    if (earned.given > 0) next = pushToast(next, 'petals', 'Baú do dia 🎁', `+${plural(earned.given, 'pétala', 'pétalas')} por abrir o app hoje.`);
    if ((ctx.daysAway ?? 0) >= 4) next = { ...next, welcome: ctx.daysAway ?? 0, counters: bump(next.counters, 'comebacks') };
  }
  return settle(next, ctx, false);
}

export interface AnswerEvent {
  ok: boolean;
  area: Area;
  /** Grupo do vocabulário da palavra (para o desafio da semana). */
  group?: string;
  /** A resposta é de um cartão de revisão espaçada (conta para o limite de revisões do dia). */
  review?: boolean;
  /** A resposta é de um cartão já maduro (caixa 4 ou mais, intervalo de 2 semanas ou mais): mede a retenção real. */
  mature?: boolean;
}

/** Uma resposta numa pergunta de qualquer área. */
export function onAnswer(state: JourneyState, ctx: EventContext, event: AnswerEvent): JourneyState {
  let next = roll(state, ctx.now);
  next = gainXp(next, answerXp(event.ok));
  next = { ...next, counters: bump(next.counters, 'answers') };
  next = countDay(next, 'answers');
  if (event.ok) next = { ...next, counters: bump(next.counters, 'correct') };
  if (event.review) next = countDay(next, 'reviews');
  next = { ...next, counters: countSkill(next.counters, event) };

  if (event.area === 'dictation' || event.area === 'understand') next = countDay(next, 'listen');
  if (event.area === 'dictation') next = { ...next, counters: bump(next.counters, 'dictations') };
  if (event.area === 'speak' && event.ok) {
    next = countDay(next, 'speak');
    next = { ...next, counters: bump(next.counters, 'speaks') };
  }
  if (event.area === 'vocab') {
    next = countDay(next, 'vocab');
    if (event.ok && event.group && event.group === challengeFor(ctx.now).group) {
      next = { ...next, week: { ...next.week, challenge: next.week.challenge + 1 } };
    }
  }
  if (GRAMMAR_AREAS.includes(event.area)) next = countDay(next, 'grammar');

  if (!next.today.goalDone && (next.today.counts.answers ?? 0) >= next.dailyGoal) {
    next = { ...next, today: { ...next.today, goalDone: true } };
    next = addPetals(next, 5);
    next = pushToast(next, 'petals', 'Meta do dia!', `${next.dailyGoal} respostas feitas hoje. +5 pétalas.`);
  }
  return settle(next, ctx, true);
}

export interface LessonEvent {
  lessonId: string;
  first: number;
  total: number;
  /** Para a pessoa que pulou a lição por um teste, a recompensa é a mesma. */
  skipped?: boolean;
}

/** Uma lição foi concluída (já aprovada). */
export function onLesson(state: JourneyState, ctx: EventContext, event: LessonEvent): JourneyState {
  let next = roll(state, ctx.now);
  const repeat = next.today.lessons.includes(event.lessonId);
  const reward = lessonReward(event.first, event.total, next.perfectRun, repeat);

  next = { ...next, today: { ...next.today, lessons: repeat ? next.today.lessons : [...next.today.lessons, event.lessonId] } };
  if (!repeat) {
    next = { ...next, perfectRun: reward.perfectRun, bestPerfectRun: Math.max(next.bestPerfectRun, reward.perfectRun) };
    next = { ...next, counters: bump(next.counters, 'lessons') };
    next = countDay(next, 'lessons');
    if (reward.perfect) {
      next = { ...next, counters: bump(next.counters, 'perfectLessons') };
      next = countDay(next, 'perfect');
    }
  }
  const earned = earnCapped(next, reward.petals);
  next = gainXp(earned.state, reward.xp);

  const parts = [`+${plural(earned.given, 'pétala', 'pétalas')}`];
  if (reward.perfect) parts.push(reward.perfectRun > 1 && !repeat ? `lição perfeita (${reward.perfectRun} seguidas)` : 'lição perfeita');
  if (repeat) parts.push('repetida vale metade');
  if (earned.given < reward.petals) parts.push('teto do dia');
  next = pushToast(next, 'petals', 'Lição concluída', parts.join(' · '));
  return settle(next, ctx, true);
}

export interface SessionEvent {
  first: number;
  total: number;
}

/** A revisão do dia (ou outra sessão longa) foi concluída. */
export function onSession(state: JourneyState, ctx: EventContext, event: SessionEvent): JourneyState {
  let next = roll(state, ctx.now);
  const reward = sessionReward(event.first, event.total);
  next = { ...next, counters: bump(next.counters, 'sessions') };
  next = countDay(next, 'sessions');
  if (reward.perfect) next = countDay(next, 'perfect');
  const earned = earnCapped(next, reward.petals);
  next = gainXp(earned.state, reward.xp);
  if (earned.given > 0) next = pushToast(next, 'petals', 'Revisão concluída', `+${plural(earned.given, 'pétala', 'pétalas')}${reward.perfect ? ' · revisão perfeita' : ''}`);
  return settle(next, ctx, true);
}

/** Palavras novas aprendidas (conta para missões). */
export const onNewWords = (state: JourneyState, ctx: EventContext, count: number): JourneyState =>
  settle(countDay(roll(state, ctx.now), 'newWords', count), ctx, true);

/** Uma frase própria foi escrita. */
export const onPhrase = (state: JourneyState, ctx: EventContext): JourneyState => settle(countDay(roll(state, ctx.now), 'phrases'), ctx, true);

/** Uma gravação da própria voz foi feita. */
export const onRecording = (state: JourneyState, ctx: EventContext): JourneyState =>
  settle({ ...roll(state, ctx.now), counters: bump(state.counters, 'recordings') }, ctx, true);

/** Uma cena de diálogo foi concluída. */
export function onDialogDone(state: JourneyState, ctx: EventContext, perfect: boolean): JourneyState {
  const next = roll(state, ctx.now);
  return settle(perfect ? { ...next, counters: bump(next.counters, 'dialogsPerfect') } : next, ctx, true);
}

/** Uma resposta errada entra na lista de erros recentes (para a revisão de resgate). */
export function recordMiss(state: JourneyState, ref: string): JourneyState {
  const misses = [...state.misses.filter((m) => m !== ref), ref].slice(-MAX_MISSES);
  return { ...state, misses };
}

/** Um erro corrigido sai da lista. */
export const clearMiss = (state: JourneyState, ref: string): JourneyState =>
  state.misses.includes(ref) ? { ...state, misses: state.misses.filter((m) => m !== ref) } : state;

// --- recompensas que o aluno resgata ---

/** O baú da semana está pronto para abrir? */
export const weekChestReady = (state: JourneyState, ctx: Pick<EventContext, 'weekDays'>): boolean =>
  ctx.weekDays >= WEEKLY_DAYS_GOAL && !state.week.claimed;

/** Escolhe o item do baú: primeiro o laço da semana; depois, em semanas alternadas, um item barato da loja que falta. */
function chestItem(state: JourneyState, wonSoFar: number): string | null {
  if (!state.owned.includes('laco-semana')) return 'laco-semana';
  if (wonSoFar % 2 !== 0) return null;
  const cheap = ITEMS.find((i) => i.source.kind === 'shop' && i.source.price <= 150 && !state.owned.includes(i.id));
  return cheap?.id ?? null;
}

/** Abre o baú da semana: pétalas e, às vezes, um item. */
export function claimWeekChest(state: JourneyState, ctx: EventContext): JourneyState {
  let next = roll(state, ctx.now);
  if (!weekChestReady(next, ctx)) return next;
  const won = next.weeksWon + 1;
  next = { ...next, week: { ...next.week, claimed: true }, weeksWon: won };
  next = addPetals(next, WEEKLY_PETALS);
  const itemId = chestItem(next, won);
  let text = `+${WEEKLY_PETALS} pétalas.`;
  if (itemId) {
    next = grantItem(next, itemId, false);
    text += ` E um item novo: ${findItem(itemId)?.name ?? itemId}.`;
  }
  next = gainXp(next, 40);
  next = pushToast(next, 'week', 'Baú da semana!', text);
  return settle(next, ctx, false);
}

// --- fechamento de cada evento ---

export function achievementContext(state: JourneyState, ctx: EventContext): AchievementContext {
  return {
    streak: ctx.streak,
    bestStreak: Math.max(state.bestStreak, ctx.bestStreak, ctx.streak),
    wordsLearned: ctx.wordsLearned,
    topicsMastered: ctx.topicsMastered,
    hiraDone: ctx.hiraDone,
    kataDone: ctx.kataDone,
    phrasesCount: ctx.phrasesCount,
    level: levelOf(state.xp),
    itemsOwned: state.owned.length,
    weeksWon: state.weeksWon,
    bestPerfectRun: state.bestPerfectRun,
    hour: ctx.now.getHours(),
    counters: state.counters,
  };
}

/**
 * Depois de qualquer evento: resgata as missões prontas, fecha o desafio da semana, avisa que o baú está pronto e entrega
 * as conquistas novas (com pétalas e item). Repete enquanto houver conquista nova, porque uma pode destravar outra
 * (um item novo conta para "guarda-roupa").
 */
export function settle(state: JourneyState, ctx: EventContext, studied: boolean): JourneyState {
  let next = { ...state, bestStreak: Math.max(state.bestStreak, ctx.bestStreak, ctx.streak) };

  if (studied) {
    const hour = ctx.now.getHours();
    if (hour < 7 && !next.counters.earlyBird) next = { ...next, counters: bump(next.counters, 'earlyBird') };
    if (hour < 4 && !next.counters.nightOwl) next = { ...next, counters: bump(next.counters, 'nightOwl') };
  }

  // Missões do dia, resgatadas sozinhas quando a meta é atingida.
  const missions = missionsFor(next.today.day || formatDay(ctx.now));
  for (const mission of missions) {
    if (next.today.claimed.includes(mission.id)) continue;
    if ((next.today.counts[mission.counter] ?? 0) < mission.goal) continue;
    next = { ...next, today: { ...next.today, claimed: [...next.today.claimed, mission.id] } };
    next = addPetals(next, MISSION_PETALS);
    next = gainXp(next, MISSION_XP);
    next = pushToast(next, 'mission', 'Missão cumprida', `${findMission(mission.id)?.title ?? mission.title}. +${MISSION_PETALS} pétalas.`);
    if (missions.every((m) => next.today.claimed.includes(m.id))) {
      next = addPetals(next, ALL_MISSIONS_BONUS);
      next = pushToast(next, 'mission', 'Todas as missões!', `Bônus de +${ALL_MISSIONS_BONUS} pétalas.`);
    }
  }

  // Desafio temático da semana.
  const challenge = challengeFor(ctx.now);
  if (!next.week.challengeClaimed && next.week.challenge >= challenge.goal) {
    next = { ...next, week: { ...next.week, challengeClaimed: true }, counters: bump(next.counters, 'challenges') };
    next = addPetals(next, challenge.petals);
    next = gainXp(next, CHALLENGE_XP);
    next = pushToast(next, 'week', 'Desafio da semana cumprido', `${challenge.group}: +${challenge.petals} pétalas.`);
  }

  // Baú da semana pronto (avisa uma vez).
  if (weekChestReady(next, ctx) && !next.week.notified) {
    next = { ...next, week: { ...next.week, notified: true } };
    next = pushToast(next, 'week', 'Meta da semana batida!', 'O baú da semana está pronto para abrir.');
  }

  // Conquistas.
  for (let round = 0; round < 5; round++) {
    const fresh = newlyEarned(achievementContext(next, ctx), next.achievements);
    if (fresh.length === 0) break;
    for (const achievement of fresh) {
      next = { ...next, achievements: { ...next.achievements, [achievement.id]: ctx.now.getTime() } };
      next = addPetals(next, achievement.petals);
      next = gainXp(next, 25);
      const reward = ITEMS.find((i) => i.source.kind === 'achievement' && i.source.achievement === achievement.id);
      if (reward) next = grantItem(next, reward.id, false);
      next = pushToast(
        next,
        'achievement',
        achievement.title,
        `${achievement.text} +${achievement.petals} pétalas${reward ? ` e o item ${reward.name}` : ''}.`,
      );
    }
  }
  return next;
}
