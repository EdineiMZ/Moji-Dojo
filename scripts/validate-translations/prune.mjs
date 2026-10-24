// Tira de assets/sentences.db as frases que a validação (run.py) apontou como traduções que não batem com o japonês.
// Uso: node scripts/validate-translations/prune.mjs <saida-do-run.json> [--margin 0.8]
//   Sai a frase de nota de margem (LaBSE) abaixo do limite, ou que o NLLB traduziu de um jeito muito diferente (sim_nllb < 0.3).
//   Grava os números das frases tiradas em scripts/validate-translations/removed-ids.json.
import { readFileSync, writeFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';

const [file, ...rest] = process.argv.slice(2);
const margin = rest.includes('--margin') ? Number(rest[rest.indexOf('--margin') + 1]) : 0.8;
const rows = JSON.parse(readFileSync(file, 'utf8'));
const bad = rows.filter((r) => (r.margin !== null && r.margin < margin) || (r.sim_nllb !== undefined && r.sim_nllb < 0.3)).map((r) => r.id);

const db = new DatabaseSync(new URL('../../assets/sentences.db', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
db.exec('BEGIN');
const drop = db.prepare('DELETE FROM sentences WHERE id = ?');
const dropWords = db.prepare('DELETE FROM words WHERE sid = ?');
for (const id of bad) {
  drop.run(id);
  dropWords.run(id);
}
db.exec('COMMIT');
db.exec('VACUUM');
const left = db.prepare('SELECT COUNT(*) AS n FROM sentences').get().n;
db.close();
writeFileSync(new URL('./removed-ids.json', import.meta.url), JSON.stringify(bad.sort((a, b) => a - b)));
console.log(`${bad.length} frases tiradas, ${left} no banco`);
