import { findLeeches, type LeechArea } from '@/features/leeches/leeches';
import type { SrsState } from '@/features/review/srs';
import type { ActivityHistory } from '@/features/stats/metrics';
import { streakDays } from '@/features/streak/days';
import { learnedWordIds } from '@/features/vocab/cards';
import { weekKey } from '@/features/journey/week';
import { retention, skillStats } from '@/features/journey/skills';
import { weekSummary, type PeriodSummary } from '@/features/journey/summary';
import { HONESTY, isRecord, TEACHER, text } from './tasks';
import { ask } from './useAi';

export interface CoachInput {
  history: ActivityHistory;
  days: readonly string[];
  counters: Readonly<Record<string, number>>;
  restWeekdays: readonly number[];
  srs: SrsState;
  vocab: SrsState;
  conj: SrsState;
  particles: SrsState;
}

export interface CoachWeek {
  studiedDays: number;
  elapsedDays: number;
  answers: number;
  accuracy: number;
  learned: number;
}

export interface CoachStats {
  /** Chave da semana ("AAAA-MM-DD" da segunda-feira): o plano vale para ela. */
  weekKey: string;
  thisWeek: CoachWeek;
  lastWeek: CoachWeek;
  streak: number;
  wordsLearned: number;
  /** Retenção em cartões antigos (%), ou null sem respostas suficientes. */
  retention: number | null;
  skills: readonly { label: string; pct: number | null; total: number }[];
  /** Quantos itens teimosos há em cada área (só a contagem: nenhum conteúdo sai do aparelho). */
  leeches: Readonly<Record<LeechArea, number>>;
}

const pick = ({ studiedDays, elapsedDays, answers, accuracy, learned }: PeriodSummary): CoachWeek => ({ studiedDays, elapsedDays, answers, accuracy, learned });

/** As estatísticas agregadas da semana, calculadas no aparelho. É só isto que a IA recebe. */
export function buildCoachStats(input: CoachInput, now: Date): CoachStats {
  const leeches: Record<LeechArea, number> = { kana: 0, kanji: 0, vocab: 0, conj: 0, particle: 0 };
  for (const l of findLeeches({ srs: input.srs, vocab: input.vocab, conj: input.conj, particles: input.particles })) leeches[l.area]++;
  return {
    weekKey: weekKey(now),
    thisWeek: pick(weekSummary(input.history, input.days, now)),
    lastWeek: pick(weekSummary(input.history, input.days, now, 1)),
    streak: streakDays(input.days, now, input.restWeekdays),
    wordsLearned: learnedWordIds(input.vocab).size,
    retention: retention(input.counters).pct,
    skills: skillStats(input.counters).map((s) => ({ label: s.label, pct: s.pct, total: s.total })),
    leeches,
  };
}

/** Há dados para o coach dizer algo? (Sem nenhuma resposta, não vale gastar um pedido.) */
export const hasCoachData = (stats: CoachStats): boolean => stats.thisWeek.answers + stats.lastWeek.answers > 0 || stats.wordsLearned > 0;

/** As estatísticas como texto para a IA: números e rótulos, nenhum conteúdo pessoal. */
export function statsText(stats: CoachStats): string {
  const week = (w: CoachWeek): string => `${w.studiedDays} de ${w.elapsedDays} dias estudados, ${w.answers} respostas, ${w.accuracy}% de acertos, ${w.learned} caracteres novos`;
  const skills = stats.skills.map((s) => `${s.label}: ${s.pct === null ? 'sem respostas' : `${s.pct}% de ${s.total}`}`).join('; ');
  const { kana, vocab, conj, particle } = stats.leeches;
  return [
    `Esta semana: ${week(stats.thisWeek)}.`,
    `Semana passada: ${week(stats.lastWeek)}.`,
    `Sequência atual: ${stats.streak} dias. Palavras de vocabulário aprendidas: ${stats.wordsLearned}.`,
    `Retenção em cartões antigos: ${stats.retention === null ? 'ainda sem dados suficientes' : `${stats.retention}%`}.`,
    `Acertos por habilidade: ${skills}.`,
    `Itens teimosos (esquecidos várias vezes): kana ${kana}, palavras ${vocab}, verbos ${conj}, partículas ${particle}.`,
  ].join('\n');
}

export interface CoachPlan {
  summary: string;
  focus: string;
  steps: readonly string[];
  praise: string;
}

export function parseCoach(json: unknown): CoachPlan | null {
  if (!isRecord(json)) return null;
  const summary = text(json.summary, 500);
  const focus = text(json.focus, 300);
  const steps = (Array.isArray(json.steps) ? json.steps : []).map((s) => text(s, 220)).filter((s) => s !== '').slice(0, 4);
  if (!summary || !focus || steps.length === 0) return null;
  return { summary, focus, steps, praise: text(json.praise, 250) };
}

const COACH_SYSTEM = `${TEACHER}
Você é o coach de estudos do aluno. Recebe só estatísticas da semana (números, sem conteúdo pessoal) e devolve um plano curto para a próxima semana. ${HONESTY}
REGRAS: use apenas os números recebidos, sem inventar dados; se houver pouco dado, diga isso e proponha um começo leve; compare com a semana passada; foque em UMA prioridade; passos pequenos e concretos, que cabem em 10 a 15 minutos por dia, usando recursos do app (revisão, Itens teimosos, Gramática, Ouvir, Falar, Simulador de teclado, Diálogos); tom de incentivo sem exagero.
Responda SOMENTE com JSON: {"summary": string, "focus": string, "steps": [string, string, string], "praise": string}
- summary: 2 ou 3 frases sobre como foi a semana. focus: a prioridade, em uma frase. steps: 3 passos. praise: um elogio sincero e específico (ou "").`;

/** Pede o plano da semana. O pedido é igual para as mesmas estatísticas, então fica em cache. */
export function getCoachPlan(stats: CoachStats) {
  const summary = statsText(stats);
  return ask({
    system: COACH_SYSTEM,
    user: summary,
    maxTokens: 900,
    parse: parseCoach,
    cacheKey: `coach:${stats.weekKey}:${summary}`,
  });
}
