// Acrescenta kanji além dos 102 iniciais: o último do N5 (魚) e os 181 do N4 (lista antiga do JLPT, campo `jlpt` 3 do
// KANJIDIC2). Gera src/content/kanjiExtra.ts (leituras, significados, categorias e lições) e src/data/strokes/extra.json
// (ordem dos traços, do KanjiVG). Uso: npm run build-kanji [-- caminho do kanjidic2.xml.gz]
//
// Fontes: KANJIDIC2 (EDRDG, CC BY-SA 4.0) para as leituras; KanjiVG (CC BY-SA 3.0) para os traços; os significados em português
// e as categorias estão em scripts/kanji/pt.json (escritos para este app, a revisar por um falante).
import { readFileSync, writeFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';

const KANJIDIC = 'http://www.edrdg.org/kanjidic/kanjidic2.xml.gz';
const KANJIVG = 'https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/';

const arg = process.argv[2];
const buffer = arg ? readFileSync(arg) : Buffer.from(await (await fetch(KANJIDIC)).arrayBuffer());
const xml = gunzipSync(buffer).toString('utf8');

const existingSource = readFileSync(new URL('../../src/data/kanji.ts', import.meta.url), 'utf8');
const existing = new Set([...existingSource.matchAll(/char: "(.)"/g)].map((m) => m[1]));
const lessonsSource = readFileSync(new URL('../../src/data/lessons.ts', import.meta.url), 'utf8');
const kanjiLessons = (lessonsSource.match(/kanji: \[([\s\S]*?)\n  \],/)?.[1] ?? '').match(/id: "kanji:L\d+"/g) ?? [];

const { categories, pt } = JSON.parse(readFileSync(new URL('./pt.json', import.meta.url), 'utf8'));

// --- KANJIDIC2: leituras e nível antigo do JLPT
const info = new Map();
for (const block of xml.split('<character>').slice(1)) {
  const literal = /<literal>(.)<\/literal>/u.exec(block)?.[1];
  if (!literal) continue;
  const jlpt = /<jlpt>(\d)<\/jlpt>/.exec(block)?.[1];
  const readings = (type) => [...block.matchAll(new RegExp(`<reading r_type="${type}">([^<]+)<`, 'g'))].map((m) => m[1]);
  info.set(literal, { jlpt: jlpt ? Number(jlpt) : 0, on: readings('ja_on'), kun: readings('ja_kun') });
}

const targets = [...info.entries()].filter(([c, v]) => (v.jlpt === 3 || c === '魚') && !existing.has(c)).map(([c]) => c);

// --- conferências: todo alvo tem significado e categoria, e cada categoria só tem alvos
const inCategories = categories.flatMap((c) => [...c.chars]);
const problems = [];
for (const c of targets) if (!pt[c]) problems.push(`sem significado: ${c}`);
for (const c of targets) if (!inCategories.includes(c)) problems.push(`sem categoria: ${c}`);
for (const c of inCategories) if (!targets.includes(c)) problems.push(`categoria com kanji que não entra: ${c}`);
const dup = inCategories.filter((c, i) => inCategories.indexOf(c) !== i);
for (const c of new Set(dup)) problems.push(`em mais de uma categoria: ${c}`);
if (problems.length > 0) {
  console.error(problems.join('\n'));
  process.exit(1);
}

/** "ひと.つ" → "ひと(つ)"; tira o "-" dos prefixos e sufixos. */
const kunOf = (kun) => kun.replace(/^-|-$/g, '').replace(/\.(.+)$/, '($1)');
const unique = (list) => [...new Set(list)];

// --- KanjiVG: traços e posição dos números
async function strokesOf(char) {
  const hex = char.codePointAt(0).toString(16).padStart(5, '0');
  const res = await fetch(`${KANJIVG}${hex}.svg`);
  if (!res.ok) throw new Error(`${res.status} KanjiVG ${char}`);
  const svg = await res.text();
  const p = [...svg.matchAll(/<path id="kvg:[0-9a-f]+-s\d+"[^>]* d="([^"]+)"/g)].map((m) => m[1]);
  const n = [...svg.matchAll(/<text transform="matrix\(1 0 0 1 ([\d.]+) ([\d.]+)\)">\d+<\/text>/g)].map((m) => [Number(m[1]), Number(m[2])]);
  if (p.length === 0 || p.length !== n.length) throw new Error(`traços inconsistentes em ${char}: ${p.length} caminhos, ${n.length} números`);
  return { p, n };
}

const strokes = {};
let next = 0;
async function worker() {
  for (let i = next++; i < targets.length; i = next++) {
    const char = targets[i];
    strokes[char] = await strokesOf(char);
  }
}
await Promise.all(Array.from({ length: 4 }, worker));

// --- saída
const ordered = categories.flatMap((cat) => [...cat.chars].map((char) => ({ char, category: cat.id })));
const kanji = ordered.map(({ char, category }) => {
  const k = info.get(char);
  return { char, meaning: pt[char], on: unique(k.on).slice(0, 3), kun: unique(k.kun.map(kunOf)).slice(0, 3), category };
});

// Lições novas, de até 6 kanji, continuando a numeração das lições iniciais.
const lessons = [];
let number = kanjiLessons.length;
for (const cat of categories) {
  const chars = [...cat.chars];
  const parts = Math.ceil(chars.length / 6);
  const size = Math.ceil(chars.length / parts);
  for (let i = 0; i < parts; i++) {
    lessons.push({ id: `kanji:L${number++}`, title: `${cat.label.replace('N4: ', '')}${parts > 1 ? ` ${i + 1}` : ''}`, items: chars.slice(i * size, (i + 1) * size) });
  }
}

const literal = (value) => JSON.stringify(value, null, 2);
writeFileSync(
  new URL('../../src/content/kanjiExtra.ts', import.meta.url),
  `// Gerado por \`npm run build-kanji\` (scripts/kanji). Não edite à mão.
// Leituras: KANJIDIC2 (EDRDG, CC BY-SA 4.0). Significados em português e categorias: escritos para este app (a revisar).
// Traços: ver src/data/strokes (KanjiVG, CC BY-SA 3.0). Ver src/content/LICENSE.md.
import type { Kanji, KanjiCategory, Lesson } from '@/data/types';

/** O último kanji do N5 e os do N4 que não estavam nos 102 iniciais. */
export const KANJI_EXTRA: readonly Kanji[] = ${literal(kanji)};

export const KANJI_EXTRA_CATEGORIES: readonly KanjiCategory[] = ${literal(categories.map(({ id, label, chars }) => ({ id, label, chars })))};

export const KANJI_EXTRA_LESSONS: readonly Lesson[] = ${literal(lessons)};
`,
);
writeFileSync(new URL('../../src/data/strokes/extra.json', import.meta.url), JSON.stringify(strokes));
console.log(`${kanji.length} kanji novos, ${lessons.length} lições novas`);
