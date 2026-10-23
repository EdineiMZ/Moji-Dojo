/**
 * Leitura de números, horas, datas, preços e contadores em kana, por regra e por tabela (nada digitado por item).
 * As formas "ingênuas" (`naive`) aplicam a regra sem as exceções: são os erros que o aluno mais comete e servem
 * de respostas erradas nos exercícios.
 */

const ONES = ['', 'いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう'] as const;

const TENS = (digit: number): string => (digit === 0 ? '' : digit === 1 ? 'じゅう' : `${ONES[digit]}じゅう`);

/** Centenas e milhares com som que muda (さんびゃく, ろっぴゃく, はっぴゃく, さんぜん, はっせん). */
function hundreds(digit: number, naive: boolean): string {
  if (digit === 0) return '';
  if (digit === 1) return 'ひゃく';
  if (!naive && digit === 3) return 'さんびゃく';
  if (!naive && digit === 6) return 'ろっぴゃく';
  if (!naive && digit === 8) return 'はっぴゃく';
  return `${ONES[digit]}ひゃく`;
}

function thousands(digit: number, naive: boolean): string {
  if (digit === 0) return '';
  if (digit === 1) return 'せん';
  if (!naive && digit === 3) return 'さんぜん';
  if (!naive && digit === 8) return 'はっせん';
  return `${ONES[digit]}せん`;
}

export const MAX_NUMBER = 99_999;

/** Número de 1 a 99.999 em kana: 358 → さんびゃくごじゅうはち. */
export function numberReading(n: number, naive = false): string {
  if (!Number.isInteger(n) || n < 1 || n > MAX_NUMBER) throw new Error(`número fora de 1 a ${MAX_NUMBER}: ${n}`);
  const man = Math.floor(n / 10_000);
  const rest = n % 10_000;
  const below =
    thousands(Math.floor(rest / 1000), naive) +
    hundreds(Math.floor(rest / 100) % 10, naive) +
    TENS(Math.floor(rest / 10) % 10) +
    ONES[rest % 10];
  return (man > 0 ? `${ONES[man]}まん` : '') + below;
}

// ---------- Horas ----------

const HOURS = ['', 'いち', 'に', 'さん', 'よ', 'ご', 'ろく', 'しち', 'はち', 'く', 'じゅう', 'じゅういち', 'じゅうに'] as const;

/** 1 a 12 horas: よじ, しちじ e くじ são as exceções. */
export function hourReading(h: number, naive = false): string {
  if (!Number.isInteger(h) || h < 1 || h > 12) throw new Error(`hora fora de 1 a 12: ${h}`);
  if (naive) return `${numberReading(h)}じ`;
  return `${HOURS[h]}じ`;
}

/** Final dos minutos pelo último dígito (ふん ou ぷん). */
const MINUTE_UNITS = ['', 'いっぷん', 'にふん', 'さんぷん', 'よんぷん', 'ごふん', 'ろっぷん', 'ななふん', 'はっぷん', 'きゅうふん'] as const;

/** 1 a 59 minutos: じゅっぷん, さんぷん, ろっぷん... Ingênuo = sempre ふん. */
export function minuteReading(m: number, naive = false): string {
  if (!Number.isInteger(m) || m < 1 || m > 59) throw new Error(`minuto fora de 1 a 59: ${m}`);
  if (naive) return `${numberReading(m)}ふん`;
  const tens = Math.floor(m / 10);
  const unit = m % 10;
  if (unit === 0) return `${tens === 1 ? '' : ONES[tens]}じゅっぷん`;
  return TENS(tens) + MINUTE_UNITS[unit];
}

/** Hora cheia, hora e minutos, ou hora e meia: 7 → しちじ, (7, 15) → しちじじゅうごふん, (3, 'han') → さんじはん. */
export function timeReading(h: number, m: number | 'han' | null, naive = false): string {
  const hour = hourReading(h, naive);
  if (m === null) return hour;
  if (m === 'han') return `${hour}はん`;
  return hour + minuteReading(m, naive);
}

// ---------- Datas ----------

const MONTHS = ['', 'いちがつ', 'にがつ', 'さんがつ', 'しがつ', 'ごがつ', 'ろくがつ', 'しちがつ', 'はちがつ', 'くがつ', 'じゅうがつ', 'じゅういちがつ', 'じゅうにがつ'] as const;

/** 1 a 12 meses: しがつ, しちがつ e くがつ. Ingênuo = よん, なな, きゅう. */
export function monthReading(month: number, naive = false): string {
  if (!Number.isInteger(month) || month < 1 || month > 12) throw new Error(`mês fora de 1 a 12: ${month}`);
  return naive ? `${numberReading(month)}がつ` : (MONTHS[month] as string);
}

/** Dias que têm leitura própria (as do calendário antigo). */
const SPECIAL_DAYS: Readonly<Record<number, string>> = {
  1: 'ついたち',
  2: 'ふつか',
  3: 'みっか',
  4: 'よっか',
  5: 'いつか',
  6: 'むいか',
  7: 'なのか',
  8: 'ようか',
  9: 'ここのか',
  10: 'とおか',
  14: 'じゅうよっか',
  20: 'はつか',
  24: 'にじゅうよっか',
};

/** Dia do mês de 1 a 31: ついたち, ふつか... はつか; os outros são número + にち (17 e 27: しちにち, 19 e 29: くにち). */
export function dayReading(day: number, naive = false): string {
  if (!Number.isInteger(day) || day < 1 || day > 31) throw new Error(`dia fora de 1 a 31: ${day}`);
  if (naive) return `${numberReading(day)}にち`;
  const special = SPECIAL_DAYS[day];
  if (special) return special;
  const unit = day % 10;
  const tens = Math.floor(day / 10);
  const unitReading = unit === 7 ? 'しち' : unit === 9 ? 'く' : ONES[unit];
  return `${TENS(tens)}${unitReading}にち`;
}

// ---------- Preços ----------

/** Preço em ienes: o 4 final vira よ (よえん, じゅうよえん), o resto é o número + えん. */
export function priceReading(yen: number, naive = false): string {
  const base = numberReading(yen, naive);
  if (!naive && yen % 10 === 4) return `${base.slice(0, -2)}よえん`;
  return `${base}えん`;
}

// ---------- Contadores ----------

export interface Counter {
  id: string;
  /** O sufixo escrito: 本, 人... */
  written: string;
  /** Para que serve, em português. */
  use: string;
  /** Leituras de 1 a 10 (o índice 0 não é usado). */
  readings: readonly string[];
  /** Sufixo sem mudança de som, para a forma ingênua (本 → ほん). */
  plain: string;
}

const row = (...readings: string[]): readonly string[] => ['', ...readings];

export const COUNTERS: readonly Counter[] = [
  {
    id: 'tsu',
    written: 'つ',
    use: 'contagem geral de coisas, até 10',
    plain: 'つ',
    readings: row('ひとつ', 'ふたつ', 'みっつ', 'よっつ', 'いつつ', 'むっつ', 'ななつ', 'やっつ', 'ここのつ', 'とお'),
  },
  {
    id: 'nin',
    written: '人',
    use: 'pessoas',
    plain: 'にん',
    readings: row('ひとり', 'ふたり', 'さんにん', 'よにん', 'ごにん', 'ろくにん', 'ななにん', 'はちにん', 'きゅうにん', 'じゅうにん'),
  },
  {
    id: 'hon',
    written: '本',
    use: 'coisas compridas (lápis, garrafas, árvores)',
    plain: 'ほん',
    readings: row('いっぽん', 'にほん', 'さんぼん', 'よんほん', 'ごほん', 'ろっぽん', 'ななほん', 'はっぽん', 'きゅうほん', 'じゅっぽん'),
  },
  {
    id: 'mai',
    written: '枚',
    use: 'coisas finas e planas (papel, camisa, prato)',
    plain: 'まい',
    readings: row('いちまい', 'にまい', 'さんまい', 'よんまい', 'ごまい', 'ろくまい', 'ななまい', 'はちまい', 'きゅうまい', 'じゅうまい'),
  },
  {
    id: 'satsu',
    written: '冊',
    use: 'livros e cadernos',
    plain: 'さつ',
    readings: row('いっさつ', 'にさつ', 'さんさつ', 'よんさつ', 'ごさつ', 'ろくさつ', 'ななさつ', 'はっさつ', 'きゅうさつ', 'じゅっさつ'),
  },
  {
    id: 'dai',
    written: '台',
    use: 'máquinas e veículos (carro, computador)',
    plain: 'だい',
    readings: row('いちだい', 'にだい', 'さんだい', 'よんだい', 'ごだい', 'ろくだい', 'ななだい', 'はちだい', 'きゅうだい', 'じゅうだい'),
  },
  {
    id: 'hiki',
    written: '匹',
    use: 'animais pequenos (gato, cachorro, peixe)',
    plain: 'ひき',
    readings: row('いっぴき', 'にひき', 'さんびき', 'よんひき', 'ごひき', 'ろっぴき', 'ななひき', 'はっぴき', 'きゅうひき', 'じゅっぴき'),
  },
  {
    id: 'ko',
    written: '個',
    use: 'coisas pequenas e redondas (maçã, bala)',
    plain: 'こ',
    readings: row('いっこ', 'にこ', 'さんこ', 'よんこ', 'ごこ', 'ろっこ', 'ななこ', 'はっこ', 'きゅうこ', 'じゅっこ'),
  },
  {
    id: 'sai',
    written: '歳',
    use: 'idade, em anos',
    plain: 'さい',
    readings: row('いっさい', 'にさい', 'さんさい', 'よんさい', 'ごさい', 'ろくさい', 'ななさい', 'はっさい', 'きゅうさい', 'じゅっさい'),
  },
  {
    id: 'kai-floor',
    written: '階',
    use: 'andares de um prédio',
    plain: 'かい',
    readings: row('いっかい', 'にかい', 'さんがい', 'よんかい', 'ごかい', 'ろっかい', 'ななかい', 'はっかい', 'きゅうかい', 'じゅっかい'),
  },
  {
    id: 'kai-times',
    written: '回',
    use: 'vezes',
    plain: 'かい',
    readings: row('いっかい', 'にかい', 'さんかい', 'よんかい', 'ごかい', 'ろっかい', 'ななかい', 'はっかい', 'きゅうかい', 'じゅっかい'),
  },
];

/** Leitura de "n + contador" (1 a 10). Ingênuo = número + sufixo sem mudar o som (さんほん). */
export function counterReading(counter: Counter, n: number, naive = false): string {
  if (!Number.isInteger(n) || n < 1 || n > 10) throw new Error(`contagem fora de 1 a 10: ${n}`);
  if (naive) return counter.id === 'tsu' ? (counter.readings[n] as string) : `${numberReading(n)}${counter.plain}`;
  return counter.readings[n] as string;
}

/** 20 anos tem leitura própria. */
export const TWENTY_YEARS = { written: '20歳', reading: 'はたち' } as const;
