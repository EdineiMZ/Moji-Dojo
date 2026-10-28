import { findWord } from '@/content';
import { typeable } from '@/features/keyboard/practice';
import { learnedWordIds } from '@/features/vocab/cards';
import { useAiStore, useProgressStore } from '@/store';
import { AiError, type AiErrorCode } from './client';
import { generatePhrases, PHRASE_TOPICS } from './tasks';
import { generateStory } from './tasksMore';
import { generateExam, generateScene, EXAM_SECTIONS } from './tasksPractice';
import type { JobSpec, QueuedJob } from './queue';

const topicOf = (value: string) => PHRASE_TOPICS.find((t) => t.value === value) ?? PHRASE_TOPICS[0];

/** Descrição curta do pedido, para a lista da fila. */
export function jobLabel(spec: JobSpec): string {
  switch (spec.kind) {
    case 'phrases':
      return `Frases para digitar: ${topicOf(spec.topic)?.label ?? spec.topic}`;
    case 'story':
      return `Texto de leitura: ${topicOf(spec.topic)?.label ?? spec.topic}`;
    case 'scene':
      return `Cena de diálogo: ${topicOf(spec.topic)?.label ?? spec.topic}`;
    case 'exam':
      return `Simulado ${spec.level}: ${EXAM_SECTIONS.find((s) => s.value === spec.section)?.label ?? spec.section} (${spec.count})`;
  }
}

export interface JobResult {
  /** Mensagem pronta para mostrar. */
  text: string;
  /** Id do que foi criado (cena, texto ou simulado), para a tela abrir na hora. */
  id?: string;
}

/** Palavras que o aluno já aprendeu, na forma que cada tarefa usa. */
function knownWords(pick: 'reading-typeable' | 'written'): string[] {
  const vocab = useProgressStore.getState().vocab;
  return [...learnedWordIds(vocab)].flatMap((id) => {
    const word = findWord(id);
    if (!word) return [];
    if (pick === 'written') return [word.jp];
    return word.reading && typeable(word.reading) ? [word.reading] : [];
  });
}

/** Faz o pedido à IA e guarda o resultado no aparelho. Lança `AiError` se a IA falhar. */
export async function runJob(spec: JobSpec, now: number = Date.now()): Promise<JobResult> {
  const ai = useAiStore.getState();
  const topic = spec.kind === 'exam' ? undefined : topicOf(spec.topic);
  switch (spec.kind) {
    case 'phrases': {
      if (!topic) throw new AiError('bad-response');
      const phrases = await generatePhrases({ topic, known: knownWords('reading-typeable'), seed: now });
      ai.addPhrases(phrases.map((p, i) => ({ id: `ai${now.toString(36)}${i}`, jp: p.jp, pt: p.pt, topic: topic.label, at: now, unknown: p.unknown })));
      return { text: `${phrases.length} frase${phrases.length === 1 ? '' : 's'} nova${phrases.length === 1 ? '' : 's'}. Já estão no treino abaixo.` };
    }
    case 'story': {
      if (!topic) throw new AiError('bad-response');
      const story = await generateStory({ topic, length: spec.length, known: knownWords('written'), seed: now });
      const id = `s${now.toString(36)}`;
      ai.addStory({ id, at: now, topic: topic.label, title: story.title, sentences: story.sentences });
      return { text: `Texto novo: ${story.title}.`, id };
    }
    case 'scene': {
      if (!topic) throw new AiError('bad-response');
      const scene = await generateScene({ topic, known: knownWords('written'), seed: now });
      const id = `ia${now.toString(36)}`;
      ai.addScene({ id, title: scene.title, place: topic.label, intro: scene.intro, turns: scene.turns });
      return { text: `Cena nova: ${scene.title}.`, id };
    }
    case 'exam': {
      const questions = await generateExam({ level: spec.level, section: spec.section, count: spec.count, seed: now });
      const id = `x${now.toString(36)}`;
      ai.addExam({ id, at: now, level: spec.level, section: spec.section, questions, best: null });
      return { text: `Simulado novo com ${questions.length} questões.`, id };
    }
  }
}

/** Falhas que passam sozinhas: o pedido continua na fila para a próxima vez. */
const TRANSIENT: ReadonlySet<AiErrorCode> = new Set(['offline', 'timeout', 'server', 'rate', 'limit', 'disabled', 'no-key', 'no-server']);

export const isTransient = (error: unknown): boolean => error instanceof AiError && TRANSIENT.has(error.code);

/** A pessoa pode guardar o pedido para depois? (sem internet ou demora.) */
export const canQueue = (error: unknown): boolean => error instanceof AiError && (error.code === 'offline' || error.code === 'timeout');

export interface DrainSummary {
  done: number;
  failed: number;
  /** Pedidos que continuam na fila. */
  left: number;
}

/**
 * Faz os pedidos da fila, do mais antigo ao mais novo. Quando um falha por algo passageiro (sem internet, limite do dia),
 * para e deixa o resto na fila; quando falha por algo que não vai se resolver sozinho, descarta só aquele.
 */
export async function drainQueue(
  jobs: readonly QueuedJob[],
  run: (spec: JobSpec) => Promise<unknown>,
  remove: (id: string) => void,
): Promise<DrainSummary> {
  let done = 0;
  let failed = 0;
  let left = jobs.length;
  for (const job of [...jobs].sort((a, b) => a.at - b.at)) {
    try {
      await run(job.spec);
      remove(job.id);
      done++;
      left--;
    } catch (error) {
      if (isTransient(error)) break;
      remove(job.id);
      failed++;
      left--;
    }
  }
  return { done, failed, left };
}

let draining = false;

/** Faz a fila guardada no aparelho (uma de cada vez: chamadas em paralelo não repetem pedidos). */
export async function processQueue(): Promise<DrainSummary> {
  const state = useAiStore.getState();
  if (draining || state.queue.length === 0) return { done: 0, failed: 0, left: state.queue.length };
  draining = true;
  try {
    return await drainQueue(state.queue, (spec) => runJob(spec), (id) => useAiStore.getState().dequeue(id));
  } finally {
    draining = false;
  }
}
