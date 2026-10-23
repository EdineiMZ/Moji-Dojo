import type { BuildExercise } from '@/data/types';
import { shuffle, type Question, type Rng } from '@/features/quiz/quiz';
import { dueChars, type SrsState } from '@/features/review/srs';
import { allBlanks, buildClozeQuestion, PARTICLES, type ClozeBlank } from './cloze';

/** Cada partícula é um cartão de revisão: a chave é a própria partícula. */
export const PARTICLE_CARDS: readonly string[] = [...PARTICLES];

export const isParticleCard = (key: string): boolean => PARTICLES.has(key);

/** Quantas perguntas tem uma revisão de partículas. */
export const PARTICLE_REVIEW_BATCH = 10;

/** Partículas que valem agora: as nunca vistas (sempre vencidas) e as vencidas, da mais atrasada à menos. */
export function dueParticles(state: SrsState, now: number): string[] {
  const fresh = PARTICLE_CARDS.filter((p) => !state[p]);
  return [...dueChars(state, now, isParticleCard), ...fresh];
}

export interface ParticleCounts {
  started: number;
  total: number;
  due: number;
}

export function particleCounts(state: SrsState, now: number): ParticleCounts {
  return {
    started: PARTICLE_CARDS.filter((p) => state[p]).length,
    total: PARTICLE_CARDS.length,
    due: dueParticles(state, now).length,
  };
}

/** Uma lacuna em que a resposta é `particle`, de uma frase sorteada (frases diferentes a cada vez). */
export function blankFor(particle: string, rng: Rng = Math.random, blanks: readonly ClozeBlank[] = allBlanks()): ClozeBlank | undefined {
  const options = blanks.filter((b) => b.kind === 'particle' && b.exercise.answer[b.index] === particle);
  return shuffle(options, rng)[0];
}

/** Perguntas da revisão: uma lacuna por partícula pedida (as sem frase são ignoradas). */
export function buildParticleReview(particles: readonly string[], rng: Rng = Math.random): Question[] {
  const seen = new Set<BuildExercise>();
  const questions: Question[] = [];
  for (const particle of particles) {
    const blank = blankFor(particle, rng);
    if (!blank || seen.has(blank.exercise)) continue;
    seen.add(blank.exercise);
    questions.push(buildClozeQuestion(blank, rng));
  }
  return shuffle(questions, rng);
}
