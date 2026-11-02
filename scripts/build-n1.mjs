// Gera src/content/n1.ts a partir da lista JLPT N1 (scripts/vocab-n1/n1.csv) e das traduções para o português
// (scripts/vocab-n1/pt-*.txt). Uso: node scripts/build-n1.mjs
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
const { applyFix, undoFix } = createRequire(import.meta.url)('./vocabFixes.cjs');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'scripts', 'vocab-n1');
const OUT = path.join(ROOT, 'src', 'content', 'n1.ts');

/** Códigos de grupo → assunto mostrado no app, com o prefixo "N1:" (como nos kanji). */
const GROUPS = {
  V: 'N1: Verbos',
  A: 'N1: Adjetivos',
  T: 'N1: Tempo e datas',
  P: 'N1: Pessoas',
  D: 'N1: Posição e direção',
  C: 'N1: Natureza e corpo',
  L: 'N1: Coisas e lugares',
  F: 'N1: Comida e bebida',
  R: 'N1: Roupas e compras',
  X: 'N1: Transporte e viagem',
  S: 'N1: Sociedade e trabalho',
  M: 'N1: Ideias e sentimentos',
  E: 'N1: Expressões e palavras de ligação',
};

/** Palavras que já estão no N5, N4, N3 ou na casa ficam fora: o N3 só traz o que é novo. */
// Escritas que já estão nas listas de baixo (já corrigidas).
const lowerJp = new Set(
  ['n5.ts', 'n4.ts', 'n3.ts', 'house.ts', 'n2.ts'].flatMap((f) => [...fs.readFileSync(path.join(ROOT, 'src', 'content', f), 'utf8').matchAll(/jp: "([^"]+)"/g)].map((m) => m[1])),
);
// Os números de linha das traduções contam com a escrita original da lista (ver undoFix em vocabFixes.cjs).
const known = new Set([...lowerJp].map(undoFix));

const { rows: allRows } = cleanRows(fs.readFileSync(path.join(DIR, 'n1.csv'), 'utf8'));
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
  const word = applyFix({ jp: r.jp, reading: fixReading(r.jp, r.reading), meaning: t.meaning, en: r.en, group: GROUPS[t.group] });
  // Depois da correção a palavra pode já estar numa lista de baixo (堅い no N4 e no N3): fica só a de baixo.
  if (lowerJp.has(word.jp)) continue;
  words.push(word);
}

const q = (s) => JSON.stringify(s);
const body = words.map((w) => `  { jp: ${q(w.jp)}, reading: ${q(w.reading)}, meaning: ${q(w.meaning)}, en: ${q(w.en)}, group: ${q(w.group)} },`).join('\n');

fs.writeFileSync(
  OUT,
  `// Gerado por scripts/build-n1.mjs a partir de scripts/vocab-n1/ (lista JLPT N1 + traduções). Não edite à mão.
// Fonte e licença: ver src/content/LICENSE.md. As traduções foram escritas por IA e ainda não foram revisadas por um falante.
import type { SourceWord } from './types';

/** Lista JLPT N1. \`meaning\` é a tradução; \`en\` é o original, em inglês. */
export const N1_WORDS: readonly SourceWord[] = [
${body}
];
`,
  'utf8',
);

const skipped = [...translations.values()].filter((t) => t.group === '-').length;
console.log(`${words.length} palavras em src/content/n1.ts (${skipped} linhas puladas).`);
