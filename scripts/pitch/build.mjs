// Gera src/content/pitch.ts: o acento (queda de tom) das palavras do vocabulário N5, N4 e N3, a partir do Kanjium.
// Fonte: https://github.com/mifunetoshiro/kanjium (data/source_files/raw/accents.txt), licença CC BY-SA 4.0.
// Uso: npm run build-pitch   (precisa de internet; o arquivo gerado é versionado, o app não usa a rede)
import { readFileSync, writeFileSync } from 'node:fs';

const SOURCE = 'https://raw.githubusercontent.com/mifunetoshiro/kanjium/master/data/source_files/raw/accents.txt';

const levelLists = ['n5', 'n4', 'n3', 'house', 'n2'].map((name) => readFileSync(new URL(`../../src/content/${name}.ts`, import.meta.url), 'utf8')).join('\n');
const words = [...levelLists.matchAll(/jp: "([^"]+)", reading: "([^"]+)"/g)].map((m) => ({ jp: m[1], reading: m[2] }));
// Também as palavras de exemplo dos kanji (日本語, 東京...), que entram no vocabulário vindas de src/data/examples.ts.
const examples = readFileSync(new URL('../../src/data/examples.ts', import.meta.url), 'utf8');
words.push(...[...examples.matchAll(/word: "([^"]+)", reading: "([^"]+)"/g)].map((m) => ({ jp: m[1], reading: m[2] })));
// No vocabulário do app a palavra é única (vale a primeira: os exemplos dos kanji, depois N5, N4 e N3), então só a primeira leitura de cada escrita tem acento.
const firstOf = new Map();
for (const w of [...words.slice(-[...examples.matchAll(/word: "([^"]+)", reading: "([^"]+)"/g)].length), ...words]) if (!firstOf.has(w.jp)) firstOf.set(w.jp, w.reading);
words.splice(0, words.length, ...words.filter((w) => firstOf.get(w.jp) === w.reading));

const res = await fetch(SOURCE);
if (!res.ok) throw new Error(`${res.status} ${SOURCE}`);
const lines = (await res.text()).split('\n');

// word \t leitura \t acentos ("0,2": mais de um). Chave: palavra|leitura.
const table = new Map();
for (const line of lines) {
  const [word, reading, accents] = line.split('\t');
  if (!word || !reading || !accents) continue;
  const numbers = accents
    .trim()
    .split(',')
    .map(Number)
    .filter((n) => Number.isInteger(n) && n >= 0);
  // A fonte repete o número em algumas palavras ("3,3"): guarda cada acento uma vez, na ordem em que aparece.
  numbers.splice(0, numbers.length, ...new Set(numbers));
  if (numbers.length > 0 && !table.has(`${word}|${reading}`)) table.set(`${word}|${reading}`, numbers);
}

const out = {};
for (const { jp, reading } of words) {
  const found = table.get(`${jp}|${reading}`);
  if (found) out[`${jp}|${reading}`] = found;
}

const body = Object.entries(out)
  .map(([key, accents]) => `  ${JSON.stringify(key)}: [${accents.join(', ')}],`)
  .join('\n');

writeFileSync(
  new URL('../../src/content/pitch.ts', import.meta.url),
  `// Gerado por \`npm run build-pitch\` (scripts/pitch/build.mjs). Não edite à mão.
// Fonte: Kanjium (https://github.com/mifunetoshiro/kanjium), licença CC BY-SA 4.0; ver src/content/LICENSE.md.

/**
 * Acento de cada palavra do vocabulário, pela chave "escrita|leitura". O número é a posição da última mora alta:
 * 0 = sem queda (heiban), 1 = cai logo depois da primeira mora, n = cai depois da n-ésima. Mais de um número = a palavra
 * tem mais de um acento em uso (o primeiro é o principal).
 */
export const PITCH: Readonly<Record<string, readonly number[]>> = {
${body}
};
`,
);
console.log(`${Object.keys(out).length} de ${words.length} palavras com acento`);
