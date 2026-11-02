export interface WordFix {
  jp?: string;
  reading?: string;
  meaning?: string;
}
export const FIXES: Readonly<Record<string, WordFix>>;
export const RENAMED_WORDS: Readonly<Record<string, string>>;
export function applyFix<T extends { jp: string; reading: string }>(word: T): T;
export function undoFix(jp: string): string;
