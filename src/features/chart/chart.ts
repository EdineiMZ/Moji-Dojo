import { KANA } from '@/data/kana';

export type Script = 'hira' | 'kata';
/** `base`: as 46 letras da tabela; `daku`: com ten-ten (゛) e maru (゜), mais o ヴ do katakana. */
export type ChartSet = 'base' | 'daku';

export interface ChartCell {
  char: string;
  romaji: string;
}

/** Em que colunas (a i u e o) cada linha incompleta cai: や ゆ よ, わ を e ん. */
const SLOTS: Readonly<Record<string, readonly number[]>> = { y: [0, 2, 4], w: [0, 4], 'n·': [0] };

const inSet = (script: Script, set: ChartSet) => KANA.filter((k) => k.script === script && (set === 'base' ? k.group === 'base' : k.group === 'daku' || k.group === 'ext') && [...k.char].length === 1);

/** As letras de um conjunto, na ordem da tabela. */
export const chartChars = (script: Script, set: ChartSet): string[] => inSet(script, set).map((k) => k.char);

/** A tabela em linhas de 5 colunas (a i u e o); `null` é um vazio, como entre や e ゆ. */
export function chartRows(script: Script, set: ChartSet): (ChartCell | null)[][] {
  const kana = inSet(script, set);
  if (set === 'daku') {
    const rows: (ChartCell | null)[][] = [];
    for (let i = 0; i < kana.length; i += 5) rows.push(Array.from({ length: 5 }, (_, c) => kana[i + c] ?? null).map((k) => (k ? { char: k.char, romaji: k.romaji } : null)));
    return rows;
  }
  const byRow = new Map<string, typeof kana>();
  for (const k of kana) byRow.set(k.row, [...(byRow.get(k.row) ?? []), k]);
  return [...byRow.entries()].map(([row, list]) => {
    const slots = SLOTS[row.slice(row.lastIndexOf(':') + 1)] ?? [0, 1, 2, 3, 4];
    return Array.from({ length: 5 }, (_, col) => {
      const k = list[slots.indexOf(col)];
      return slots.includes(col) && k ? { char: k.char, romaji: k.romaji } : null;
    });
  });
}
