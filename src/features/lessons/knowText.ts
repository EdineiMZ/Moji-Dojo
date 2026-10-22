import { getItem, isSingleChar, type StudyItem } from '@/features/catalog';

/** Explica uma combinação (ex.: きゃ): o kana grande + o pequeno viram uma sílaba só. */
export function comboExplanation(item: StudyItem): string {
  const [first = '', ...rest] = [...item.char];
  const base = getItem(first);
  return `${first} (${base.label}) + ${rest.join('')} pequeno = ${item.label}. O kana pequeno se junta ao anterior e os dois viram uma sílaba só.`;
}

/** Combinações e sons estrangeiros têm mais de um caractere e não têm traços próprios. */
export const isCombo = (item: StudyItem): boolean => !isSingleChar(item.char);

/** Leituras para mostrar na tela; lista vazia vira "—". */
export const formatReadings = (readings: readonly string[] | undefined): string =>
  readings && readings.length ? readings.join(', ') : '—';
