import { BUILD_EXERCISES } from '@/data/exercises';
import { GRAMMAR_TOPICS } from '@/data/grammar';
import type { BuildExercise, GrammarTopic } from '@/data/types';
import { BUILD_N3, GRAMMAR_N3 } from './grammarN3';
import { BUILD_N4, GRAMMAR_N4 } from './grammarN4';
import { BUILD_N5, GRAMMAR_N5 } from './grammarN5';

/**
 * Ajustes na ordem de estudo do N5 (auditoria de 2026-11-01): um tópico não pode usar o que só é ensinado depois. Os ids e o
 * conteúdo não mudam (o progresso é guardado pelo id), só a posição.
 * - g39 (が) vem logo depois dos 10 iniciais: o g7 já usa ねこが います e o g11 em diante usa が nos exemplos;
 * - g40 (forma simples) vem antes do g16 (〜ないでください), que parte da forma ない.
 */
const N5_ORDER: readonly { id: string; after: string }[] = [
  { id: 'g39', after: 'g10' },
  { id: 'g40', after: 'g15' },
];

/** Move cada tópico de `moves` para logo depois do tópico indicado. Id que não existe é ignorado. */
export function reorderTopics(list: readonly GrammarTopic[], moves: readonly { id: string; after: string }[]): GrammarTopic[] {
  const out = [...list];
  for (const { id, after } of moves) {
    const from = out.findIndex((t) => t.id === id);
    if (from < 0 || !out.some((t) => t.id === after)) continue;
    const [topic] = out.splice(from, 1);
    out.splice(out.findIndex((t) => t.id === after) + 1, 0, topic as GrammarTopic);
  }
  return out;
}

/** Todos os tópicos de gramática, na ordem de estudo: os 10 iniciais, os do N5, os do N4 e os do N3 (Tatoeba). */
export const ALL_GRAMMAR: readonly GrammarTopic[] = reorderTopics([...GRAMMAR_TOPICS, ...GRAMMAR_N5, ...GRAMMAR_N4, ...GRAMMAR_N3], N5_ORDER);

/** Todos os exercícios do Montar e das Lacunas: os iniciais e os feitos com as frases do Tatoeba. */
export const ALL_EXERCISES: readonly BuildExercise[] = [...BUILD_EXERCISES, ...BUILD_N5, ...BUILD_N4, ...BUILD_N3];
