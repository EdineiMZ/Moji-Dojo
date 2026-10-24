import { newWords, PAGE_SIZE, randomSentences, romajiOf, searchKeys, searchSentences, toExample, type SentenceDb, type SentenceRow } from './query';

interface Statement {
  run(...params: (string | number)[]): unknown;
  all(...params: (string | number)[]): unknown[];
}
// O sqlite embutido do Node serve de banco em memória para os testes (o app usa o expo-sqlite).
const { DatabaseSync } = require('node:sqlite') as {
  DatabaseSync: new (path: string) => { exec(sql: string): void; prepare(sql: string): Statement };
};

function memoryDb(): SentenceDb {
  const db = new DatabaseSync(':memory:');
  db.exec(`
    CREATE TABLE sentences (id INTEGER PRIMARY KEY, jp TEXT, furi TEXT, kana TEXT, pt TEXT, len INTEGER, unknown TEXT);
    CREATE TABLE words (key TEXT, sid INTEGER, PRIMARY KEY (key, sid)) WITHOUT ROWID;
  `);
  const sentence = db.prepare('INSERT INTO sentences VALUES (?, ?, ?, ?, ?, ?, ?)');
  const word = db.prepare('INSERT INTO words VALUES (?, ?)');
  sentence.run(1, '私は猫を飼っています。', '[私|わたし]は[猫|ねこ]を[飼|か]っています。', 'わたし は ねこ を かっています', 'Eu tenho um gato.', 11, '[]');
  sentence.run(2, 'ねこがすきです。', 'ねこがすきです。', 'ねこ が すきです', '100% de amor por gatos.', 8, '["好き"]');
  sentence.run(3, '犬が走る。', '[犬|いぬ]が[走|はし]る。', 'いぬ が はしる', 'O cachorro corre.', 5, '[]');
  for (const [key, sid] of [['猫', 1], ['ねこ', 1], ['ねこ', 2], ['犬', 3], ['いぬ', 3]] as const) word.run(key, sid);
  return { getAllAsync: async <T,>(sql: string, params: (string | number)[]) => db.prepare(sql).all(...params) as T[] };
}

describe('busca de frases', () => {
  it('acha pela palavra com kanji ou pela leitura, das mais curtas para as mais longas', async () => {
    const db = memoryDb();
    expect((await searchSentences(db, 'jp', '猫')).map((r) => r.id)).toEqual([1]);
    expect((await searchSentences(db, 'jp', 'ねこ')).map((r) => r.id)).toEqual([2, 1]);
  });

  it('aceita katakana digitado no lugar do hiragana e ignora espaços e pontuação', async () => {
    const db = memoryDb();
    expect(searchKeys(' ネコ。')).toEqual(['ネコ', 'ねこ']);
    expect((await searchSentences(db, 'jp', 'ネコ')).map((r) => r.id)).toEqual([2, 1]);
  });

  it('não devolve nada para busca vazia, nem para um português de uma letra', async () => {
    const db = memoryDb();
    expect(await searchSentences(db, 'jp', '  ')).toEqual([]);
    expect(await searchSentences(db, 'pt', 'g')).toEqual([]);
  });

  it('busca em português sem tratar % e _ como curingas', async () => {
    const db = memoryDb();
    expect((await searchSentences(db, 'pt', 'gato')).map((r) => r.id)).toEqual([2, 1]);
    expect((await searchSentences(db, 'pt', 'cachorro')).map((r) => r.id)).toEqual([3]);
    expect((await searchSentences(db, 'pt', '100%')).map((r) => r.id)).toEqual([2]);
    expect(await searchSentences(db, 'pt', '%%')).toEqual([]);
  });

  it('pagina de PAGE_SIZE em PAGE_SIZE', async () => {
    const db = memoryDb();
    expect(PAGE_SIZE).toBe(20);
    expect(await searchSentences(db, 'jp', '猫', 1)).toEqual([]);
  });

  it('sorteia só frases sem palavra nova', async () => {
    const rows = await randomSentences(memoryDb());
    expect(rows.map((r) => r.id).sort()).toEqual([1, 3]);
  });
});

describe('frase do banco para a tela', () => {
  const row: SentenceRow = {
    id: 1,
    jp: '私は猫を飼っています。',
    furi: '[私|わたし]は[猫|ねこ]を[飼|か]っています。',
    kana: 'わたし は ねこ を かっています',
    pt: 'Eu tenho um gato.',
    unknown: '[]',
  };

  it('monta o furigana, o romaji (は e を como partículas) e o texto que a voz lê', () => {
    const example = toExample(row);
    expect(example.ruby?.[0]).toEqual({ text: '私', reading: 'わたし' });
    expect(example.romaji).toBe('watashi wa neko o katteimasu');
    expect(example.say).toBe('わたしはねこをかっています');
  });

  it('frase só em kana não ganha furigana', () => {
    expect(toExample({ ...row, jp: 'ねこがすきです。', furi: 'ねこがすきです。' }).ruby).toBeUndefined();
  });

  it('lê as palavras novas e aguenta um valor estragado', () => {
    expect(newWords({ ...row, unknown: '["好き"]' })).toEqual(['好き']);
    expect(newWords({ ...row, unknown: 'não é json' })).toEqual([]);
    expect(romajiOf('を')).toBe('o');
  });
});
