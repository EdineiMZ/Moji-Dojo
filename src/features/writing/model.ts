import { STROKES } from '@/data/strokes';
import type { StrokeData } from '@/data/types';
import { isSingleChar } from '@/features/catalog';

/** O caractere tem modelo de traços para escrever? (as combinações, como きゃ, não têm) */
export const isWritable = (char: string): boolean => isSingleChar(char) && STROKES[char] !== undefined;

export function strokeModel(char: string): StrokeData | undefined {
  return isSingleChar(char) ? STROKES[char] : undefined;
}
