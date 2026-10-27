import type { StoryLength } from './tasksMore';
import type { ExamLevel, ExamSection } from './tasksPractice';

/** Um pedido de geração que dá para repetir depois (só dados simples, para ficar guardado no aparelho). */
export type JobSpec =
  | { kind: 'phrases'; topic: string }
  | { kind: 'story'; topic: string; length: StoryLength }
  | { kind: 'scene'; topic: string }
  | { kind: 'exam'; level: ExamLevel; section: ExamSection; count: number };

export interface QueuedJob {
  id: string;
  at: number;
  spec: JobSpec;
}

export const MAX_QUEUE = 8;

/** Dois pedidos iguais não precisam ficar na fila duas vezes. */
export const sameSpec = (a: JobSpec, b: JobSpec): boolean => JSON.stringify(a) === JSON.stringify(b);

