import {
  COUNTERS,
  counterReading,
  dayReading,
  hourReading,
  minuteReading,
  monthReading,
  numberReading,
  priceReading,
  timeReading,
} from './readings';
import { buildCountQuestion, buildCountRound, randomItem, type CountCategory, type CountMode } from './questions';

describe('numberReading', () => {
  it.each([
    [1, 'いち'], [4, 'よん'], [7, 'なな'], [10, 'じゅう'], [11, 'じゅういち'], [20, 'にじゅう'], [74, 'ななじゅうよん'],
    [100, 'ひゃく'], [300, 'さんびゃく'], [600, 'ろっぴゃく'], [800, 'はっぴゃく'], [358, 'さんびゃくごじゅうはち'],
    [1000, 'せん'], [3000, 'さんぜん'], [8000, 'はっせん'], [8888, 'はっせんはっぴゃくはちじゅうはち'],
    [10000, 'いちまん'], [12345, 'いちまんにせんさんびゃくよんじゅうご'], [99999, 'きゅうまんきゅうせんきゅうひゃくきゅうじゅうきゅう'],
  ])('%i → %s', (n, reading) => {
    expect(numberReading(n)).toBe(reading);
  });

  it('a forma ingênua não aplica as exceções', () => {
    expect(numberReading(300, true)).toBe('さんひゃく');
    expect(numberReading(8000, true)).toBe('はちせん');
  });

  it('recusa o que está fora da faixa', () => {
    expect(() => numberReading(0)).toThrow();
    expect(() => numberReading(100_000)).toThrow();
    expect(() => numberReading(1.5)).toThrow();
  });
});

describe('horas', () => {
  it.each([[1, 'いちじ'], [4, 'よじ'], [7, 'しちじ'], [9, 'くじ'], [10, 'じゅうじ'], [12, 'じゅうにじ']])('%i時 → %s', (h, r) => {
    expect(hourReading(h)).toBe(r);
  });

  it.each([
    [1, 'いっぷん'], [2, 'にふん'], [3, 'さんぷん'], [4, 'よんぷん'], [5, 'ごふん'], [6, 'ろっぷん'], [7, 'ななふん'],
    [8, 'はっぷん'], [9, 'きゅうふん'], [10, 'じゅっぷん'], [11, 'じゅういっぷん'], [15, 'じゅうごふん'], [20, 'にじゅっぷん'],
    [30, 'さんじゅっぷん'], [45, 'よんじゅうごふん'], [54, 'ごじゅうよんぷん'], [59, 'ごじゅうきゅうふん'],
  ])('%i分 → %s', (m, r) => {
    expect(minuteReading(m)).toBe(r);
  });

  it('hora cheia, com minutos e meia', () => {
    expect(timeReading(7, null)).toBe('しちじ');
    expect(timeReading(7, 15)).toBe('しちじじゅうごふん');
    expect(timeReading(3, 'han')).toBe('さんじはん');
  });
});

describe('datas', () => {
  it.each([[1, 'いちがつ'], [4, 'しがつ'], [7, 'しちがつ'], [9, 'くがつ'], [10, 'じゅうがつ'], [12, 'じゅうにがつ']])('%i月 → %s', (m, r) => {
    expect(monthReading(m)).toBe(r);
  });

  it.each([
    [1, 'ついたち'], [2, 'ふつか'], [3, 'みっか'], [4, 'よっか'], [5, 'いつか'], [6, 'むいか'], [7, 'なのか'], [8, 'ようか'],
    [9, 'ここのか'], [10, 'とおか'], [11, 'じゅういちにち'], [14, 'じゅうよっか'], [17, 'じゅうしちにち'], [19, 'じゅうくにち'],
    [20, 'はつか'], [21, 'にじゅういちにち'], [24, 'にじゅうよっか'], [27, 'にじゅうしちにち'], [30, 'さんじゅうにち'],
    [31, 'さんじゅういちにち'],
  ])('%i日 → %s', (d, r) => {
    expect(dayReading(d)).toBe(r);
  });
});

describe('preços', () => {
  it.each([
    [1, 'いちえん'], [4, 'よえん'], [7, 'ななえん'], [14, 'じゅうよえん'], [24, 'にじゅうよえん'], [40, 'よんじゅうえん'],
    [104, 'ひゃくよえん'], [400, 'よんひゃくえん'], [840, 'はっぴゃくよんじゅうえん'], [3000, 'さんぜんえん'],
    [10000, 'いちまんえん'],
  ])('%i円 → %s', (yen, r) => {
    expect(priceReading(yen)).toBe(r);
  });
});

describe('contadores', () => {
  it('cada contador tem as dez leituras', () => {
    for (const c of COUNTERS) {
      expect(c.readings).toHaveLength(11);
      expect(c.readings.slice(1).every((r) => r.length > 0)).toBe(true);
      expect(new Set(c.readings.slice(1)).size).toBe(10);
    }
  });

  const find = (id: string) => COUNTERS.find((c) => c.id === id) as (typeof COUNTERS)[number];

  it.each([
    ['nin', 1, 'ひとり'], ['nin', 2, 'ふたり'], ['nin', 4, 'よにん'], ['nin', 7, 'ななにん'],
    ['hon', 1, 'いっぽん'], ['hon', 3, 'さんぼん'], ['hon', 6, 'ろっぽん'], ['hon', 10, 'じゅっぽん'],
    ['hiki', 3, 'さんびき'], ['satsu', 1, 'いっさつ'], ['ko', 6, 'ろっこ'], ['sai', 8, 'はっさい'],
    ['kai-floor', 3, 'さんがい'], ['kai-times', 3, 'さんかい'], ['tsu', 3, 'みっつ'], ['tsu', 10, 'とお'],
    ['mai', 5, 'ごまい'], ['dai', 2, 'にだい'],
  ])('%s %i → %s', (id, n, r) => {
    expect(counterReading(find(id), n)).toBe(r);
  });

  it('a forma ingênua usa o som simples', () => {
    expect(counterReading(find('hon'), 3, true)).toBe('さんほん');
    expect(counterReading(find('nin'), 1, true)).toBe('いちにん');
  });
});

describe('perguntas', () => {
  const categories: CountCategory[] = ['number', 'time', 'date', 'price', 'counter'];
  const modes: CountMode[] = ['read', 'listen'];

  it.each(categories.flatMap((c) => modes.map((m) => [c, m] as const)))('%s / %s: 4 alternativas, uma certa', (category, mode) => {
    for (let i = 0; i < 300; i++) {
      const item = randomItem(category);
      const q = buildCountQuestion(item, mode);
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options.map((o) => o.char)).size).toBe(4);
      expect(q.options.filter((o) => o.char === q.item.char)).toHaveLength(1);
      if (mode === 'read') {
        // As leituras mostradas são todas diferentes (nenhuma errada soa igual à certa).
        expect(new Set(q.options.map((o) => o.label)).size).toBe(4);
      }
    }
  });

  it('em "ouvir", nenhuma alternativa soa igual à certa', () => {
    for (let i = 0; i < 300; i++) {
      const item = randomItem('counter');
      if (item.written === '20歳') continue; // a leitura própria (はたち) não vem da tabela
      const q = buildCountQuestion(item, 'listen');
      expect(q.options).toHaveLength(4);
      const reading = (written: string) => {
        const counter = COUNTERS.find((c) => written.endsWith(c.written));
        return counter ? counterReading(counter, Number.parseInt(written, 10)) : item.reading;
      };
      const sounds = q.options.map((o) => (o.char === item.written ? item.reading : reading(o.char)));
      expect(new Set(sounds).size).toBe(4);
    }
  });

  it('a rodada tem 10 itens diferentes, em qualquer categoria', () => {
    for (const category of ['all', ...categories] as const) {
      for (const mode of modes) {
        const round = buildCountRound(category, mode);
        expect(round).toHaveLength(10);
        expect(new Set(round.map((q) => q.item.char)).size).toBe(10);
      }
    }
  });

  it('a pergunta explica com a escrita e a leitura', () => {
    const q = buildCountQuestion(randomItem('counter', () => 0.5), 'read');
    expect(q.item.script === 'pair' && q.item.explain).toContain(' = ');
  });
});
