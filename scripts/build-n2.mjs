// Gera src/content/n2.ts a partir da lista JLPT N2 (scripts/vocab-n2/n2.csv) e das traduções para o português
// (scripts/vocab-n2/pt-*.txt). Uso: node scripts/build-n2.mjs
//
// Mesmo método do N5 (scripts/build-n5.mjs): cada linha das traduções é "linha-do-csv|grupo|significado". O japonês (palavra e
// leitura) sempre vem do CSV, então nenhum texto japonês é digitado à mão. O grupo "-" pula a linha (sufixo, erro da lista...).
// O script falha se alguma palavra ficar sem tradução, se uma linha não existir ou se um código de grupo for desconhecido.
// As traduções foram escritas por IA e ainda não foram revisadas por um falante.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const { cleanRows } = createRequire(import.meta.url)('./n5Clean.cjs');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'scripts', 'vocab-n2');
const OUT = path.join(ROOT, 'src', 'content', 'n2.ts');

/** Códigos de grupo → assunto mostrado no app, com o prefixo "N2:" (como nos kanji). */
const GROUPS = {
  V: 'N2: Verbos',
  A: 'N2: Adjetivos',
  T: 'N2: Tempo e datas',
  P: 'N2: Pessoas',
  D: 'N2: Posição e direção',
  C: 'N2: Natureza e corpo',
  L: 'N2: Coisas e lugares',
  F: 'N2: Comida e bebida',
  R: 'N2: Roupas e compras',
  X: 'N2: Transporte e viagem',
  S: 'N2: Sociedade e trabalho',
  M: 'N2: Ideias e sentimentos',
  E: 'N2: Expressões e palavras de ligação',
};

/** Palavras que já estão no N5, N4, N3 ou na casa ficam fora: o N3 só traz o que é novo. */
const known = new Set(
  ['n5.ts', 'n4.ts', 'n3.ts', 'house.ts'].flatMap((f) => [...fs.readFileSync(path.join(ROOT, 'src', 'content', f), 'utf8').matchAll(/jp: "([^"]+)"/g)].map((m) => m[1])),
);
const { rows: allRows } = cleanRows(fs.readFileSync(path.join(DIR, 'n2.csv'), 'utf8'));
const rows = allRows.filter((r) => !known.has(r.jp));
const byRow = new Map(rows.map((r) => [r.row, r]));

const translations = new Map();
const problems = [];
for (const file of fs.readdirSync(DIR).filter((f) => /^pt-\d+\.txt$/.test(f)).sort()) {
  fs.readFileSync(path.join(DIR, file), 'utf8')
    .split(/\r?\n/)
    .forEach((line, i) => {
      if (!line.trim()) return;
      const [rowText, group = '', ...rest] = line.split('|');
      const meaning = rest.join('|').trim();
      const row = Number(rowText);
      const where = `${file}:${i + 1}`;
      if (!byRow.has(row)) return problems.push(`${where}: a linha ${rowText} não existe na lista limpa`);
      if (translations.has(row)) return problems.push(`${where}: linha ${row} traduzida duas vezes`);
      if (group !== '-' && !GROUPS[group]) return problems.push(`${where}: grupo desconhecido "${group}"`);
      if (group !== '-' && !meaning) return problems.push(`${where}: linha ${row} sem significado`);
      translations.set(row, { group, meaning });
    });
}
for (const r of rows) if (!translations.has(r.row)) problems.push(`sem tradução: linha ${r.row} (${r.jp}, ${r.en})`);

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

/** A lista escreve "運動, うんどう" com a leitura já terminando em する; a palavra do app é só o substantivo. */
const fixReading = (jp, reading) => (reading.length > 2 && reading.endsWith('する') && !jp.endsWith('する') ? reading.slice(0, -2) : reading);

const seenJp = new Set();
const words = [];
for (const r of rows) {
  const t = translations.get(r.row);
  if (t.group === '-') continue;
  if (seenJp.has(r.jp)) continue;
  seenJp.add(r.jp);
  words.push({ jp: r.jp, reading: fixReading(r.jp, r.reading), meaning: t.meaning, en: r.en, group: GROUPS[t.group] });
}

const q = (s) => JSON.stringify(s);
const body = words.map((w) => `  { jp: ${q(w.jp)}, reading: ${q(w.reading)}, meaning: ${q(w.meaning)}, en: ${q(w.en)}, group: ${q(w.group)} },`).join('\n');

fs.writeFileSync(
  OUT,
  `// Gerado por scripts/build-n2.mjs a partir de scripts/vocab-n2/ (lista JLPT N2 + traduções). Não edite à mão.
// Fonte e licença: ver src/content/LICENSE.md. As traduções foram escritas por IA e ainda não foram revisadas por um falante.
import type { SourceWord } from './types';

/** Lista JLPT N2. \`meaning\` é a tradução; \`en\` é o original, em inglês. */
export const N2_WORDS: readonly SourceWord[] = [
${body}
];
`,
  'utf8',
);

const skipped = [...translations.values()].filter((t) => t.group === '-').length;
console.log(`${words.length} palavras em src/content/n2.ts (${skipped} linhas puladas).`);
