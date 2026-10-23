import { formatDay } from '@/features/streak/days';
import { weekIndex } from './week';

/** Missões do dia: 3 sorteadas (sempre as mesmas para o mesmo dia) entre as abaixo. */
export interface Mission {
  id: string;
  title: string;
  /** Contador do dia que mede o progresso (ver `DayState.counts`). */
  counter: string;
  goal: number;
}

export const MISSIONS: readonly Mission[] = [
  { id: 'answers-20', title: 'Responda 20 perguntas', counter: 'answers', goal: 20 },
  { id: 'session', title: 'Faça uma revisão do dia', counter: 'sessions', goal: 1 },
  { id: 'lesson', title: 'Conclua uma lição', counter: 'lessons', goal: 1 },
  { id: 'listen', title: 'Treine o ouvido: 5 respostas em ditado ou compreensão', counter: 'listen', goal: 5 },
  { id: 'phrase', title: 'Escreva uma frase sua', counter: 'phrases', goal: 1 },
  { id: 'speak', title: 'Diga 3 frases em voz alta', counter: 'speaks', goal: 3 },
  { id: 'words', title: 'Aprenda 5 palavras novas', counter: 'newWords', goal: 5 },
  { id: 'grammar', title: 'Resolva 10 exercícios de gramática', counter: 'grammar', goal: 10 },
  { id: 'perfect', title: 'Faça uma lição ou revisão perfeita', counter: 'perfect', goal: 1 },
  { id: 'vocab', title: 'Revise 15 cartões de vocabulário', counter: 'vocab', goal: 15 },
];

export const MISSION_PETALS = 10;
export const MISSION_XP = 15;
/** Bônus por resgatar as 3 missões do dia. */
export const ALL_MISSIONS_BONUS = 20;
export const MISSIONS_PER_DAY = 3;

export const findMission = (id: string): Mission | undefined => MISSIONS.find((m) => m.id === id);

/** Número repetível a partir do texto (o dia), sem aleatoriedade. */
function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** As missões de um dia: 3 diferentes, sempre as mesmas para o mesmo dia. */
export function missionsFor(day: string): Mission[] {
  const pool = [...MISSIONS];
  const picked: Mission[] = [];
  let seed = hash(day);
  while (picked.length < MISSIONS_PER_DAY && pool.length > 0) {
    const at = seed % pool.length;
    picked.push(...pool.splice(at, 1));
    seed = hash(`${seed}:${day}`);
  }
  return picked;
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
export const CHALLENGE_PETALS = 40;
export const CHALLENGE_XP = 30;

export const challengeFor = (date: Date): Challenge => ({
  group: CHALLENGE_GROUPS[weekIndex(date) % CHALLENGE_GROUPS.length] ?? 'Verbos',
  goal: CHALLENGE_GOAL,
  petals: CHALLENGE_PETALS,
});

// --- meta semanal ---

/** Dias de estudo na semana para abrir o baú. */
export const WEEKLY_DAYS_GOAL = 4;
export const WEEKLY_PETALS = 40;
