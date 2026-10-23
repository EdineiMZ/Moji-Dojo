import { GRAMMAR_TOPICS } from '@/data/grammar';
import type { GrammarTopic } from '@/data/types';
import { GRAMMAR_N5 } from './grammarN5';

/** Todos os tópicos de gramática, na ordem de estudo: os 10 da especificação (HTML) e os do N5 (Tatoeba). */
export const ALL_GRAMMAR: readonly GrammarTopic[] = [...GRAMMAR_TOPICS, ...GRAMMAR_N5];
