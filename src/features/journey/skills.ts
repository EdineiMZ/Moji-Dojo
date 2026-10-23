import type { AnswerEvent, Area } from './events';
import { bump } from './journey';

/** Caixa a partir da qual um cartão é "maduro" (revisão só depois de 14 dias ou mais): acertar nele é retenção de verdade. */
export const MATURE_BOX = 4;

export type Skill = 'kana' | 'vocab' | 'grammar' | 'listening' | 'speaking' | 'sentences';

export const SKILL_LABELS: Readonly<Record<Skill, string>> = {
  kana: 'Kana e kanji',
  vocab: 'Vocabulário',
  grammar: 'Gramática',
  listening: 'Escuta',
  speaking: 'Fala e tom',
  sentences: 'Frases',
};

export const SKILL_ORDER: readonly Skill[] = ['kana', 'vocab', 'grammar', 'listening', 'speaking', 'sentences'];

const SKILL_OF: Readonly<Record<Area, Skill>> = {
  kana: 'kana',
  vocab: 'vocab',
  conj: 'grammar',
  particle: 'grammar',
  drill: 'grammar',
  dictation: 'listening',
  understand: 'listening',
  speak: 'speaking',
  tone: 'speaking',
  phrase: 'sentences',
  dialog: 'sentences',
  translate: 'sentences',
};

export const skillOf = (area: Area): Skill => SKILL_OF[area];

/** Soma uma resposta nos contadores da habilidade (`sk.<habilidade>.n` e `.ok`) e, se o cartão é maduro, nos da retenção. */
export function countSkill(counters: Readonly<Record<string, number>>, event: Pick<AnswerEvent, 'area' | 'ok' | 'mature'>): Record<string, number> {
  const skill = skillOf(event.area);
  let next = bump(counters, `sk.${skill}.n`);
  if (event.ok) next = bump(next, `sk.${skill}.ok`);
  if (event.mature) {
    next = bump(next, 'matureAnswers');
    if (event.ok) next = bump(next, 'matureCorrect');
  }
  return next;
}

export interface SkillStat {
  skill: Skill;
  label: string;
  total: number;
  /** Porcentagem de acertos; null sem respostas. */
  pct: number | null;
}

export function skillStats(counters: Readonly<Record<string, number>>): SkillStat[] {
  return SKILL_ORDER.map((skill) => {
    const total = counters[`sk.${skill}.n`] ?? 0;
    const ok = counters[`sk.${skill}.ok`] ?? 0;
    return { skill, label: SKILL_LABELS[skill], total, pct: total > 0 ? Math.round((ok / total) * 100) : null };
  });
}

export interface Retention {
  answers: number;
  /** % de acertos em cartões maduros; null com menos de 10 respostas (pouco para dizer algo). */
  pct: number | null;
}

export const MIN_RETENTION_ANSWERS = 10;

export function retention(counters: Readonly<Record<string, number>>): Retention {
  const answers = counters.matureAnswers ?? 0;
  const correct = counters.matureCorrect ?? 0;
  return { answers, pct: answers >= MIN_RETENTION_ANSWERS ? Math.round((correct / answers) * 100) : null };
}
