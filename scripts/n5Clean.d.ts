export interface CleanRow {
  row: number;
  jp: string;
  reading: string;
  en: string;
  lesson: number | null;
}
export function parseCsv(text: string): string[][];
export function firstForm(text: string): string;
export function cleanRows(csv: string): { rows: CleanRow[]; skipped: { row: number; jp: string; reason: string }[] };
export function studyOrder(rows: CleanRow[]): CleanRow[];
