import { shuffle, type PairItem, type Question, type Rng } from '@/features/quiz/quiz';
import {
  COUNTERS,
  counterReading,
  dayReading,
  MAX_NUMBER,
  monthReading,
  numberReading,
  priceReading,
  timeReading,
  TWENTY_YEARS,
} from './readings';

export type CountCategory = 'number' | 'time' | 'date' | 'price' | 'counter';

export const CATEGORIES: readonly { value: CountCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Tudo' },
  { value: 'number', label: 'Números' },
  { value: 'time', label: 'Horas' },
  { value: 'date', label: 'Datas' },
  { value: 'price', label: 'Preços' },
  { value: 'counter', label: 'Contadores' },
];

/** Uma coisa para ler: como se escreve, como se lê, e as leituras ingênuas (erradas) mais comuns dela. */
export interface CountItem {
  category: CountCategory;
  written: string;
  reading: string;
  /** Leituras erradas plausíveis (a regra sem as exceções, os vizinhos). */
  wrong: readonly string[];
  /** Outras coisas parecidas, com a leitura delas (para o exercício de ouvir; só valem as que soam diferente). */
  near: readonly Near[];
}

export interface Near {
  written: string;
  reading: string;
}

const pick = <T,>(list: readonly T[], rng: Rng): T => list[Math.floor(rng() * list.length)] as T;
const between = (min: number, max: number, rng: Rng): number => min + Math.floor(rng() * (max - min + 1));
const unique = <T,>(list: readonly T[]): T[] => [...new Set(list)];
const inRange = (n: number, min: number, max: number): boolean => n >= min && n <= max;

/** Números sorteados por faixa, com mais peso nos que têm som que muda (300, 600, 800, 3000, 8000). */
function randomNumber(rng: Rng): number {
  const tier = rng();
  if (tier < 0.2) return between(1, 10, rng);
  if (tier < 0.45) return between(11, 99, rng);
  if (tier < 0.75) return between(1, 9, rng) * 100 + (rng() < 0.5 ? 0 : between(0, 99, rng));
  if (tier < 0.92) return between(1, 9, rng) * 1000 + (rng() < 0.5 ? 0 : between(0, 999, rng));
  return between(1, 9, rng) * 10_000 + (rng() < 0.5 ? 0 : between(0, 9999, rng));
}

function numberItem(n: number): CountItem {
  const neighbours = [n + 1, n - 1, n + 10, n - 10, n + 100, n - 100].filter((x) => inRange(x, 1, MAX_NUMBER));
  return {
    category: 'number',
    written: String(n),
    reading: numberReading(n),
    wrong: [numberReading(n, true), ...neighbours.map((x) => numberReading(x))],
    near: neighbours.map((x) => ({ written: String(x), reading: numberReading(x) })),
  };
}

function priceItem(yen: number): CountItem {
  const neighbours = [yen + 1, yen - 1, yen + 10, yen - 10, yen + 100].filter((x) => inRange(x, 1, MAX_NUMBER));
  return {
    category: 'price',
    written: `${yen}円`,
    reading: priceReading(yen),
    wrong: [priceReading(yen, true), ...neighbours.map((x) => priceReading(x))],
    near: neighbours.map((x) => ({ written: `${x}円`, reading: priceReading(x) })),
  };
}

const writtenTime = (h: number, m: number | 'han' | null): string => `${h}時${m === null ? '' : m === 'han' ? '半' : `${m}分`}`;

function timeItem(h: number, m: number | 'han' | null): CountItem {
  const hours = [h === 12 ? 1 : h + 1, h === 1 ? 12 : h - 1];
  const others: (number | 'han' | null)[] =
    m === null ? [5, 10, 'han'] : m === 'han' ? [null, 5, 15] : [m === 59 ? 1 : m + 1, m === 1 ? 59 : m - 1, null];
  const variants: [number, number | 'han' | null][] = [...hours.map((x): [number, number | 'han' | null] => [x, m]), ...others.map((x): [number, number | 'han' | null] => [h, x])];
  return {
    category: 'time',
    written: writtenTime(h, m),
    reading: timeReading(h, m),
    wrong: [timeReading(h, m, true), ...variants.map(([x, y]) => timeReading(x, y))],
    near: variants.map(([x, y]) => ({ written: writtenTime(x, y), reading: timeReading(x, y) })),
  };
}

type DateParts = { month: number | null; day: number | null };

const writtenDate = ({ month, day }: DateParts): string => `${month === null ? '' : `${month}月`}${day === null ? '' : `${day}日`}`;
const dateReading = ({ month, day }: DateParts, naive = false): string =>
  [month === null ? '' : monthReading(month, naive), day === null ? '' : dayReading(day, naive)].filter(Boolean).join(' ');

function dateItem(parts: DateParts): CountItem {
  const { month, day } = parts;
  const variants: DateParts[] = [];
  const wrapMonth = (m: number): number => ((m - 1 + 12) % 12) + 1;
  const wrapDay = (d: number): number => ((d - 1 + 31) % 31) + 1;
  if (month !== null) {
    variants.push({ month: wrapMonth(month + 1), day }, { month: wrapMonth(month - 1), day }, { month: wrapMonth(month + 2), day }, { month: wrapMonth(month - 3), day });
  }
  if (day !== null) {
    variants.push({ month, day: wrapDay(day + 1) }, { month, day: wrapDay(day - 1) }, { month, day: wrapDay(day + 2) }, { month, day: wrapDay(day - 3) });
  }
  return {
    category: 'date',
    written: writtenDate(parts),
    reading: dateReading(parts),
    wrong: [dateReading(parts, true), ...variants.map((v) => dateReading(v))],
    near: variants.map((v) => ({ written: writtenDate(v), reading: dateReading(v) })),
  };
}

/** Item de contador: "3本" → さんぼん. O 20 anos (はたち) é o único com leitura fora da tabela. */
function counterItem(counterIndex: number, n: number): CountItem {
  const counter = COUNTERS[counterIndex] as (typeof COUNTERS)[number];
  const written = `${n}${counter.written}`;
  const neighbours = [n === 10 ? 9 : n + 1, n === 1 ? 2 : n - 1];
  const sameNumber = COUNTERS.filter((c) => c !== counter);
  const reading = counterReading(counter, n);
  return {
    category: 'counter',
    written,
    reading,
    wrong: [
      counterReading(counter, n, true),
      ...neighbours.map((x) => counterReading(counter, x)),
      ...sameNumber.map((c) => counterReading(c, n)),
    ],
    near: [
      ...neighbours.map((x) => ({ written: `${x}${counter.written}`, reading: counterReading(counter, x) })),
      ...sameNumber.map((c) => ({ written: `${n}${c.written}`, reading: counterReading(c, n) })),
    ],
  };
}

const twentyYears = (): CountItem => ({
  category: 'counter',
  written: TWENTY_YEARS.written,
  reading: TWENTY_YEARS.reading,
  wrong: ['にじゅうさい', 'にじっさい', 'にじゅっさい'],
  near: [
    { written: '19歳', reading: 'じゅうきゅうさい' },
    { written: '21歳', reading: 'にじゅういっさい' },
    { written: '10歳', reading: 'じゅっさい' },
  ],
});

export function randomItem(category: CountCategory, rng: Rng = Math.random): CountItem {
  switch (category) {
    case 'number':
      return numberItem(randomNumber(rng));
    case 'price':
      return priceItem(Math.max(1, randomNumber(rng)));
    case 'time': {
      const h = between(1, 12, rng);
      const kind = rng();
      return timeItem(h, kind < 0.3 ? null : kind < 0.4 ? 'han' : between(1, 59, rng));
    }
    case 'date': {
      const kind = rng();
      return dateItem(
        kind < 0.3 ? { month: between(1, 12, rng), day: null } : kind < 0.65 ? { month: null, day: between(1, 31, rng) } : { month: between(1, 12, rng), day: between(1, 31, rng) },
      );
    }
    case 'counter':
      return rng() < 0.04 ? twentyYears() : counterItem(Math.floor(rng() * COUNTERS.length), between(1, 10, rng));
  }
}

export type CountMode = 'read' | 'listen';

const toItem = (char: string, label: string, extra: Partial<PairItem> = {}): PairItem => ({ char, label, script: 'pair', ...extra });

/**
 * Pergunta de um item. Ler: mostra a escrita e as alternativas são leituras em kana (a certa leva a escrita como
 * `char`, as erradas a própria leitura). Ouvir: toca a leitura e as alternativas são escritas parecidas.
 */
export function buildCountQuestion(item: CountItem, mode: CountMode, rng: Rng = Math.random): Question {
  const explain = `${item.written} = ${item.reading}`;
  if (mode === 'listen') {
    // Só entram alternativas que soam diferente da certa (階 e 回 se leem igual em 1 a 10).
    const sounds = new Set([item.reading]);
    const near: string[] = [];
    for (const n of shuffle(item.near, rng)) {
      if (sounds.has(n.reading) || n.written === item.written) continue;
      sounds.add(n.reading);
      near.push(n.written);
    }
    const options = shuffle([item.written, ...near.slice(0, 3)], rng);
    return {
      item: toItem(item.written, item.written, { reading: item.reading, explain }),
      direction: 'audio',
      options: options.map((w) => toItem(w, w)),
      retry: false,
    };
  }
  const wrong = shuffle(unique(item.wrong).filter((r) => r !== item.reading), rng).slice(0, 3);
  const options = shuffle(
    [toItem(item.written, item.reading, { explain }), ...wrong.map((r) => toItem(r, r))],
    rng,
  );
  return { item: toItem(item.written, item.written, { reading: item.reading, explain }), direction: 'k2r', options, retry: false };
}

export const COUNT_ROUND = 10;

/** Uma rodada de itens diferentes da categoria (ou de todas), sem repetir a escrita. */
export function buildCountRound(
  category: CountCategory | 'all',
  mode: CountMode,
  rng: Rng = Math.random,
  count: number = COUNT_ROUND,
): Question[] {
  const categories: CountCategory[] = ['number', 'time', 'date', 'price', 'counter'];
  const seen = new Set<string>();
  const questions: Question[] = [];
  for (let guard = 0; questions.length < count && guard < count * 30; guard++) {
    const item = randomItem(category === 'all' ? pick(categories, rng) : category, rng);
    if (seen.has(item.written)) continue;
    if (mode === 'listen' && new Set(item.near.map((n) => n.reading).filter((r) => r !== item.reading)).size < 3) continue;
    seen.add(item.written);
    questions.push(buildCountQuestion(item, mode, rng));
  }
  return questions;
}
