export function kanaToRomaji(kana: string, options?: { particle?: boolean }): string;
export function parseAnnotation(annotated: string): { jp: string; romaji: string };
export function plainKana(annotated: string): string;
export function stripPunctuation(text: string): string;
