import { formatDay } from '@/features/streak/days';
import { weekIndex } from './week';

export type Difficulty = 'easy' | 'medium' | 'hard';

/** Missões do dia: 3 sorteadas (uma fácil, uma média e uma difícil; sempre as mesmas para o mesmo dia) entre as abaixo. */
export interface Mission {
  id: string;
  title: string;
  /** Contador do dia que mede o progresso (ver `DayState.counts`). */
  counter: string;
  goal: number;
  difficulty: Difficulty;
}

const m = (id: string, difficulty: Difficulty, title: string, counter: string, goal: number): Mission => ({ id, title, counter, goal, difficulty });

export const MISSIONS: readonly Mission[] = [
  // fáceis: coisas que qualquer dia de estudo faz
  m('answers-20', 'easy', 'Responda 20 perguntas', 'answers', 20),
  m('lesson', 'easy', 'Conclua uma lição', 'lessons', 1),
  m('words', 'easy', 'Aprenda 5 palavras novas', 'newWords', 5),
  m('vocab', 'easy', 'Revise 15 cartões de vocabulário', 'vocab', 15),
  m('phrase', 'easy', 'Escreva uma frase sua', 'phrases', 1),
  m('explore', 'easy', 'Folheie 20 frases em Frases → Explorar', 'explored', 20),
  m('time-10', 'easy', 'Estude por 10 minutos', 'seconds', 600),
  // médias: pedem um pouco de foco ou de variedade
  m('session', 'medium', 'Faça uma revisão do dia', 'sessions', 1),
  m('listen', 'medium', 'Treine o ouvido: 5 respostas em ditado ou compreensão', 'listen', 5),
  m('speak', 'medium', 'Diga 3 frases em voz alta', 'speaks', 3),
  m('grammar', 'medium', 'Resolva 10 exercícios de gramática', 'grammar', 10),
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
  m('grammar-20', 'hard', 'Resolva 20 exercícios de gramática', 'grammar', 20),
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

/** Passo de cada dificuldade pela lista: primo com o tamanho dela, então dois dias seguidos nunca caem na mesma missão. */
const STEPS: Readonly<Record<Difficulty, number>> = { easy: 3, medium: 3, hard: 5 };

/**
 * As missões de um dia: 3 (fácil, média e difícil), sempre as mesmas para o mesmo dia. Cada dificuldade anda pela sua lista
 * em passos de 3 ou 5 a partir de um ponto de partida próprio, então ninguém repete a missão de ontem e todas aparecem.
 */
export function missionsFor(day: string): Mission[] {
  return DIFFICULTIES.map((difficulty) => {
    const pool = MISSIONS.filter((x) => x.difficulty === difficulty);
    return pool[(hash(difficulty) + dayNumber(day) * STEPS[difficulty]) % pool.length] as Mission;
  });
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
