import { LESSONS } from '@/data/lessons';
import { STROKES } from '@/data/strokes';
import type { Lesson, Script } from '@/data/types';
import { isSingleChar, SCRIPT_ORDER } from '@/features/catalog';

export type LessonStatus = 'done' | 'open' | 'lock';
export type CompletedLessons = Readonly<Record<string, true>>;

/** Acertos na primeira tentativa para passar numa lição. */
export const PASS_RATIO = 0.8;
/** O teste do "Já sei" é mais exigente. */
export const SKIP_PASS_RATIO = 0.9;

export const requiredRatio = (skipped: boolean): number => (skipped ? SKIP_PASS_RATIO : PASS_RATIO);

export function lessonPassed(firstTry: number, total: number, skipped: boolean): boolean {
  return total > 0 && firstTry / total >= requiredRatio(skipped);
}

/** Bloqueio progressivo: a lição abre quando a anterior foi concluída. */
export function lessonStatus(script: Script, index: number, completed: CompletedLessons): LessonStatus {
  const list = LESSONS[script];
  const lesson = list[index];
  if (!lesson) return 'lock';
  if (completed[lesson.id]) return 'done';
  const previous = list[index - 1];
  return index === 0 || (previous && completed[previous.id]) ? 'open' : 'lock';
}

/** Índice da primeira lição não concluída, ou -1 se a trilha acabou. */
export const nextLessonIndex = (script: Script, completed: CompletedLessons): number =>
  LESSONS[script].findIndex((l) => !completed[l.id]);

export interface NextLesson {
  script: Script;
  index: number;
  lesson: Lesson;
}

/** Próxima lição a estudar, seguindo a ordem hiragana → katakana → kanji. `null` se tudo foi concluído. */
export function nextLessonOverall(completed: CompletedLessons): NextLesson | null {
  for (const script of SCRIPT_ORDER) {
    const index = nextLessonIndex(script, completed);
    const lesson = LESSONS[script][index];
    if (lesson) return { script, index, lesson };
  }
  return null;
}

export function trailProgress(script: Script, completed: CompletedLessons): { done: number; total: number } {
  const list = LESSONS[script];
  return { done: list.filter((l) => completed[l.id]).length, total: list.length };
}

/** A lição tem algum caractere com traços para escrever? (passo "Escrever") */
export const lessonHasWriting = (lesson: Lesson): boolean =>
  lesson.items.some((c) => isSingleChar(c) && STROKES[c] !== undefined);

export function findLesson(lessonId: string): { script: Script; index: number; lesson: Lesson } | undefined {
  for (const script of Object.keys(LESSONS) as Script[]) {
    const list = LESSONS[script];
    const index = list.findIndex((l) => l.id === lessonId);
    const lesson = list[index];
    if (lesson) return { script, index, lesson };
  }
  return undefined;
}
