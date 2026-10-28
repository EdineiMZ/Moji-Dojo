import { BUILD_EXERCISES } from '@/data/exercises';
import { GRAMMAR_TOPICS } from '@/data/grammar';
import type { BuildExercise, GrammarTopic } from '@/data/types';
import { BUILD_N4, GRAMMAR_N4 } from './grammarN4';
import { BUILD_N5, GRAMMAR_N5 } from './grammarN5';

/** Todos os tópicos de gramática, na ordem de estudo: os 10 iniciais, os do N5 e os do N4 (Tatoeba). */
export const ALL_GRAMMAR: readonly GrammarTopic[] = [...GRAMMAR_TOPICS, ...GRAMMAR_N5, ...GRAMMAR_N4];

/** Todos os exercícios do Montar e das Lacunas: os iniciais e os feitos com as frases do Tatoeba. */
export const ALL_EXERCISES: readonly BuildExercise[] = [...BUILD_EXERCISES, ...BUILD_N5, ...BUILD_N4];
