// Confere o banco de frases que vai dentro do app (assets/sentences.db), gerado por scripts/example-sentences/build.mjs.
const { DatabaseSync } = require('node:sqlite') as {
  DatabaseSync: new (path: string, options: { readOnly: boolean }) => { prepare(sql: string): { get(...p: unknown[]): Record<string, number>; all(...p: unknown[]): Record<string, string>[] } };
};
const db = new DatabaseSync(`${process.cwd()}/assets/sentences.db`, { readOnly: true });

describe('assets/sentences.db', () => {
  it('tem dezenas de milhares de frases, todas com tradução, leitura e índice de palavras', () => {
    expect(db.prepare('SELECT COUNT(*) AS n FROM sentences').get().n).toBeGreaterThan(20000);
    expect(db.prepare("SELECT COUNT(*) AS n FROM sentences WHERE pt = '' OR kana = '' OR furi = '' OR jp = ''").get().n).toBe(0);
    expect(db.prepare('SELECT COUNT(*) AS n FROM sentences WHERE id NOT IN (SELECT sid FROM words)').get().n).toBe(0);
  });

  it('não traz números nem letras latinas (o tokenizador lê cada dígito separado)', () => {
    expect(db.prepare("SELECT COUNT(*) AS n FROM sentences WHERE jp GLOB '*[0-9A-Za-z０-９]*'").get().n).toBe(0);
  });

  it('encontra palavras comuns pelo kanji e pela leitura', () => {
    for (const key of ['食べる', 'たべる', '学校', 'がっこう']) {
      expect(db.prepare('SELECT COUNT(*) AS n FROM words WHERE key = ?').get(key).n).toBeGreaterThan(10);
    }
  });

  it('o furigana reconstrói a frase original', () => {
    for (const row of db.prepare('SELECT jp, furi FROM sentences ORDER BY random() LIMIT 300').all()) {
      expect(String(row.furi).replace(/\[([^|\]]+)\|[^\]]+\]/g, '$1')).toBe(row.jp);
    }
  });
});
