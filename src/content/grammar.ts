import { BUILD_EXERCISES } from '@/data/exercises';
import { GRAMMAR_TOPICS } from '@/data/grammar';
import type { BuildExercise, GrammarTopic } from '@/data/types';
import { BUILD_N5, GRAMMAR_N5 } from './grammarN5';

/** Todos os tópicos de gramática, na ordem de estudo: os 10 da especificação (HTML) e os do N5 (Tatoeba). */
export const ALL_GRAMMAR: readonly GrammarTopic[] = [...GRAMMAR_TOPICS, ...GRAMMAR_N5];

/** Todos os exercícios do Montar e das Lacunas: os do protótipo e os feitos com as frases do Tatoeba. */
export const ALL_EXERCISES: readonly BuildExercise[] = [...BUILD_EXERCISES, ...BUILD_N5];
