import { formatDay } from '@/features/streak/days';
import { weekIndex } from './week';
import type { Skill } from './skills';

export type Difficulty = 'easy' | 'medium' | 'hard';

/** Missões do dia: 3 sorteadas (uma fácil, uma média e uma difícil; sempre as mesmas para o mesmo dia) entre as abaixo. */
export interface Mission {
  id: string;
  title: string;
  /** Contador do dia que mede o progresso (ver `DayState.counts`). Na missão em cadeia, é o número de passos já cumpridos. */
  counter: string;
  goal: number;
  difficulty: Difficulty;
  /** A habilidade que a missão treina: quem está fraca nela puxa a missão para o dia (ver `missionsFor`). */
  skill?: Skill;
  /** Missão de horário: só conta as respostas feitas na janela da manhã ou da noite. */
  window?: 'morning' | 'evening';
  /** Missão em cadeia: cada passo só conta depois do anterior ter sido cumprido. */
  chain?: readonly ChainStep[];
}

/** Um passo de uma missão em cadeia: um contador do dia e a meta dele. */
export interface ChainStep {
  counter: string;
  goal: number;
  /** O que fazer neste passo, em frase curta ("conclua uma lição"). */
  text: string;
}

/** A manhã vai até este horário (exclusive); a noite começa neste (inclusive). */
export const MORNING_END = 12;
export const EVENING_START = 18;

const m = (id: string, difficulty: Difficulty, title: string, counter: string, goal: number, extra: Partial<Pick<Mission, 'skill' | 'window' | 'chain'>> = {}): Mission => ({ id, title, counter, goal, difficulty, ...extra });

/** A missão em cadeia: o contador é `chain:<id>` e a meta é o número de passos. */
const chainMission = (id: string, difficulty: Difficulty, title: string, steps: readonly ChainStep[]): Mission => m(id, difficulty, title, `chain:${id}`, steps.length, { chain: steps });

export const MISSIONS: readonly Mission[] = [
  // fáceis: coisas que qualquer dia de estudo faz
  m('answers-20', 'easy', 'Responda 20 perguntas', 'answers', 20),
  m('lesson', 'easy', 'Conclua uma lição', 'lessons', 1, { skill: 'kana' }),
  m('words', 'easy', 'Aprenda 5 palavras novas', 'newWords', 5, { skill: 'vocab' }),
  m('vocab', 'easy', 'Revise 15 cartões de vocabulário', 'vocab', 15, { skill: 'vocab' }),
  m('phrase', 'easy', 'Escreva uma frase sua', 'phrases', 1, { skill: 'sentences' }),
  m('explore', 'easy', 'Folheie 20 frases em Frases → Explorar', 'explored', 20, { skill: 'sentences' }),
  m('morning-10', 'easy', 'De manhã (até as 12h), responda 10 perguntas', 'answersMorning', 10, { window: 'morning' }),
  m('evening-10', 'easy', 'À noite (a partir das 18h), responda 10 perguntas', 'answersEvening', 10, { window: 'evening' }),
  m('time-10', 'easy', 'Estude por 10 minutos', 'seconds', 600),
  // médias: pedem um pouco de foco ou de variedade
  m('session', 'medium', 'Faça uma revisão do dia', 'sessions', 1),
  m('listen', 'medium', 'Treine o ouvido: 5 respostas em ditado ou compreensão', 'listen', 5, { skill: 'listening' }),
  m('speak', 'medium', 'Diga 3 frases em voz alta', 'speaks', 3, { skill: 'speaking' }),
  m('grammar', 'medium', 'Resolva 10 exercícios de gramática', 'grammar', 10, { skill: 'grammar' }),
  chainMission('chain-ears', 'medium', 'Em cadeia: ouvido, vocabulário e gramática', [
    { counter: 'listen', goal: 5, text: 'faça 5 respostas de ouvido (ditado ou compreensão)' },
    { counter: 'vocab', goal: 10, text: 'revise 10 cartões de vocabulário' },
    { counter: 'grammar', goal: 5, text: 'resolva 5 exercícios de gramática' },
  ]),
  m('areas-3', 'medium', 'Treine 3 áreas diferentes (kana, palavras, gramática, ouvido...)', 'areas', 3),
  m('run-8', 'medium', 'Acerte 8 perguntas seguidas', 'bestRun', 8),
  m('rescue-3', 'medium', 'Acerte 3 itens que você tinha errado', 'rescued', 3),
  m('time-20', 'medium', 'Estude por 20 minutos', 'seconds', 1200),
  // difíceis: desempenho, ritmo ou constância
  m('session-90', 'hard', 'Faça uma revisão (10 perguntas ou mais) com 90% ou mais de acerto', 'sessions90', 1),
  m('fast-session', 'hard', 'Termine uma revisão em até 5 minutos, com 80% ou mais de acerto', 'fastSessions', 1),
  m('perfect', 'hard', 'Faça uma lição ou revisão perfeita', 'perfect', 1),
  m('run-15', 'hard', 'Acerte 15 perguntas seguidas', 'bestRun', 15),
  m('accuracy-30', 'hard', 'Responda 30 perguntas com 85% ou mais de acerto no dia', 'acc85', 1),
  m('areas-5', 'hard', 'Treine 5 áreas diferentes no mesmo dia', 'areas', 5),
  m('grammar-20', 'hard', 'Resolva 20 exercícios de gramática', 'grammar', 20, { skill: 'grammar' }),
  chainMission('chain-day', 'hard', 'Em cadeia: lição, revisão e frase', [
    { counter: 'lessons', goal: 1, text: 'conclua uma lição' },
    { counter: 'sessions', goal: 1, text: 'faça uma revisão do dia' },
    { counter: 'phrases', goal: 1, text: 'escreva uma frase sua' },
  ]),
  m('time-30', 'hard', 'Estude por 30 minutos', 'seconds', 1800),
];

export const DIFFICULTY_LABELS: Readonly<Record<Difficulty, string>> = { easy: 'Fácil', medium: 'Média', hard: 'Difícil' };

/** Pétalas e XP de cada missão, pela dificuldade. */
export const MISSION_REWARDS: Readonly<Record<Difficulty, { petals: number; xp: number }>> = {
  easy: { petals: 4, xp: 10 },
  medium: { petals: 6, xp: 15 },
  hard: { petals: 9, xp: 25 },
};
export const rewardOf = (mission: Pick<Mission, 'difficulty'>): { petals: number; xp: number } => MISSION_REWARDS[mission.difficulty];

/** A pétala da missão média (a de referência dos textos antigos). */
export const MISSION_PETALS = MISSION_REWARDS.medium.petals;
/** Bônus por resgatar as 3 missões do dia. */
export const ALL_MISSIONS_BONUS = 12;
export const MISSIONS_PER_DAY = 3;
const DIFFICULTIES: readonly Difficulty[] = ['easy', 'medium', 'hard'];

export const findMission = (id: string): Mission | undefined => MISSIONS.find((x) => x.id === id);

/** Número repetível a partir do texto, sem aleatoriedade. */
function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Número do dia ("2026-10-21") desde 1970. */
function dayNumber(day: string): number {
  const [y = 1970, mo = 1, d = 1] = day.split('-').map(Number);
  return Math.floor(Date.UTC(y, mo - 1, d) / 86_400_000);
}

/** Máximo divisor comum, para achar um passo que percorra a lista inteira. */
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/** O passo preferido, ou o próximo, que seja primo com o tamanho da lista: assim ninguém cai duas vezes seguidas na mesma missão. */
function coprimeStep(preferred: number, size: number): number {
  if (size <= 1) return 1;
  let step = preferred;
  while (gcd(step, size) !== 1) step++;
  return step;
}

/** Passo de cada dificuldade pela lista (o ponto de partida da busca por um passo primo com o tamanho dela). */
const STEPS: Readonly<Record<Difficulty, number>> = { easy: 3, medium: 3, hard: 5 };

export interface MissionOptions {
  /** As habilidades mais fracas (a mais fraca primeiro): as missões que as treinam têm preferência. */
  weak?: readonly Skill[];
  /** A hora em que o dia começou: a missão da manhã não entra se a manhã já passou. */
  hour?: number;
}

/**
 * As missões de um dia: 3 (fácil, média e difícil), sempre as mesmas para o mesmo dia e as mesmas opções. Cada dificuldade anda pela
 * sua lista em passos primos com o tamanho dela a partir de um ponto de partida próprio, então ninguém repete a missão de ontem
 * e todas aparecem. Com `weak`, a lista fica só com as missões das habilidades fracas (se houver alguma naquela dificuldade).
 */
export function missionsFor(day: string, options: MissionOptions = {}): Mission[] {
  return DIFFICULTIES.map((difficulty) => {
    let pool = MISSIONS.filter((x) => x.difficulty === difficulty && !(x.window === 'morning' && options.hour !== undefined && options.hour >= MORNING_END));
    const weak = options.weak ?? [];
    const focused = pool.filter((x) => x.skill !== undefined && weak.includes(x.skill));
    if (focused.length > 0) pool = focused;
    return pool[(hash(difficulty) + dayNumber(day) * coprimeStep(STEPS[difficulty], pool.length)) % pool.length] as Mission;
  });
}

/** As missões de hoje: as que ficaram guardadas no começo do dia (ver `roll`) ou, sem elas, as do sorteio sem opções. */
export function todaysMissions(today: { day: string; missions?: readonly string[] }): Mission[] {
  const stored = (today.missions ?? []).map(findMission).filter((x): x is Mission => x !== undefined);
  return stored.length === MISSIONS_PER_DAY ? stored : missionsFor(today.day);
}

/**
 * Atualiza as missões em cadeia a partir dos contadores do dia. O passo atual só conta o que foi feito depois de o anterior estar
 * cumprido: ao cumprir um passo, guarda-se o valor do contador do próximo (`chainBase:<id>`). Devolve os mesmos contadores se nada mudou.
 */
export function advanceChains(counts: Readonly<Record<string, number>>, missions: readonly Mission[]): Record<string, number> {
  let out: Record<string, number> = { ...counts };
  let changed = false;
  for (const mission of missions) {
    const steps = mission.chain;
    if (!steps) continue;
    let done = out[mission.counter] ?? 0;
    const baseKey = `chainBase:${mission.id}`;
    while (done < steps.length) {
      const step = steps[done] as ChainStep;
      if ((out[step.counter] ?? 0) - (out[baseKey] ?? 0) < step.goal) break;
      done++;
      const next = steps[done];
      out = { ...out, [mission.counter]: done, [baseKey]: next ? (out[next.counter] ?? 0) : (out[baseKey] ?? 0) };
      changed = true;
    }
  }
  return changed ? out : (counts as Record<string, number>);
}

/** Em que passo está uma missão em cadeia: o texto do passo atual e quanto dele já foi feito. */
export function chainStatus(counts: Readonly<Record<string, number>>, mission: Mission): { step: number; total: number; text: string; have: number; goal: number } | null {
  const steps = mission.chain;
  if (!steps) return null;
  const done = Math.min(counts[mission.counter] ?? 0, steps.length);
  const current = steps[Math.min(done, steps.length - 1)] as ChainStep;
  const have = done >= steps.length ? current.goal : Math.max(0, (counts[current.counter] ?? 0) - (counts[`chainBase:${mission.id}`] ?? 0));
  return { step: Math.min(done + 1, steps.length), total: steps.length, text: current.text, have: Math.min(have, current.goal), goal: current.goal };
}

export const missionsForDate = (date: Date): Mission[] => missionsFor(formatDay(date));

// --- desafio da semana ---

export interface Challenge {
  /** O grupo de vocabulário que vale na semana. */
  group: string;
  goal: number;
  petals: number;
}

/** Os grupos de vocabulário que se revezam como tema da semana. */
export const CHALLENGE_GROUPS: readonly string[] = [
  'Comida e bebida',
  'Verbos',
  'Pessoas e escola',
  'Dias e tempo',
  'Coisas e lugares',
  'Adjetivos',
  'Natureza e corpo',
  'Roupas e compras',
  'Transporte e viagem',
  'Posição e direção',
  'Números',
  'Expressões e palavras de ligação',
];

export const CHALLENGE_GOAL = 30;
export const CHALLENGE_PETALS = 25;
export const CHALLENGE_XP = 30;

export const challengeFor = (date: Date): Challenge => ({
  group: CHALLENGE_GROUPS[weekIndex(date) % CHALLENGE_GROUPS.length] ?? 'Verbos',
  goal: CHALLENGE_GOAL,
  petals: CHALLENGE_PETALS,
});

// --- meta semanal ---

/** Dias de estudo na semana para abrir o baú. */
export const WEEKLY_DAYS_GOAL = 4;
/** Pétalas do baú da semana: agora vêm do sorteio (src/features/journey/loot.ts); este número só aparece no texto. */
export const WEEKLY_PETALS = 40;
