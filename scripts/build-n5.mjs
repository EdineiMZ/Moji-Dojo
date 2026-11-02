// Gera src/content/n5.ts a partir da lista JLPT N5 (scripts/vocab-n5/n5.csv) e das traduções para o
// português (scripts/vocab-n5/pt-*.txt). Uso: npm run build-n5
//
// Cada linha das traduções é "linha-do-csv|grupo|significado". O japonês (palavra e leitura) sempre vem do
// CSV: as traduções só referenciam a linha, então nenhum texto japonês é digitado à mão. O grupo "-" pula
// a linha (não é uma palavra de verdade, ex.: um sufixo). O script falha se alguma palavra ficar sem
// tradução, se uma linha não existir ou se um código de grupo for desconhecido.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const { cleanRows, studyOrder } = createRequire(import.meta.url)('./n5Clean.cjs');
const { applyFix } = createRequire(import.meta.url)('./vocabFixes.cjs');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'scripts', 'vocab-n5');
const OUT = path.join(ROOT, 'src', 'content', 'n5.ts');

/** Códigos de grupo das traduções → assunto mostrado no app (os de kanji reaproveitam o mesmo nome). */
const GROUPS = {
  V: 'Verbos',
  A: 'Adjetivos',
  N: 'Números',
  T: 'Dias e tempo',
  P: 'Pessoas e escola',
  D: 'Posição e direção',
  C: 'Natureza e corpo',
  L: 'Coisas e lugares',
  F: 'Comida e bebida',
  R: 'Roupas e compras',
  X: 'Transporte e viagem',
  E: 'Expressões e palavras de ligação',
};

const { rows } = cleanRows(fs.readFileSync(path.join(DIR, 'n5.csv'), 'utf8'));
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

const words = studyOrder(rows)
  .filter((r) => translations.get(r.row).group !== '-')
  .map((r) => {
    const t = translations.get(r.row);
    return applyFix({ jp: r.jp, reading: r.reading, meaning: t.meaning, en: r.en, group: GROUPS[t.group], ...(r.lesson ? { lesson: r.lesson } : {}) });
  });

const q = (s) => JSON.stringify(s);
const body = words
  .map((w) => `  { jp: ${q(w.jp)}, reading: ${q(w.reading)}, meaning: ${q(w.meaning)}, en: ${q(w.en)}, group: ${q(w.group)}${w.lesson ? `, lesson: ${w.lesson}` : ''} },`)
  .join('\n');

fs.writeFileSync(
  OUT,
  `// Gerado por scripts/build-n5.mjs a partir de scripts/vocab-n5/ (lista JLPT N5 + traduções). Não edite à mão.
// Fonte e licença: ver src/content/LICENSE.md.
import type { SourceWord } from './types';

/** Lista JLPT N5, na ordem de estudo (lições do Genki primeiro). \`meaning\` é a tradução; \`en\` é o original. */
export const N5_WORDS: readonly SourceWord[] = [
${body}
];
`,
  'utf8',
);

const skipped = [...translations.values()].filter((t) => t.group === '-').length;
console.log(`${words.length} palavras em src/content/n5.ts (${skipped} linhas puladas).`);

const seen = new Map();
for (const w of words) seen.set(w.meaning, [...(seen.get(w.meaning) ?? []), w.jp]);
const dup = [...seen].filter(([, jps]) => jps.length > 1);
if (dup.length) console.log(`Significados repetidos (ambíguos nas perguntas): ${dup.map(([m, j]) => `${m} = ${j.join(', ')}`).join(' | ')}`);
