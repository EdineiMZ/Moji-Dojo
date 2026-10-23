// Gera src/content/wordClass.ts: a classe gramatical (substantivo, verbo, adjetivo, advérbio...) de cada palavra do vocabulário,
// a partir do JMdict (EDRDG, CC BY-SA 4.0). Uso: node scripts/pos/build.mjs [caminho do JMdict_e.gz]
// Sem argumento, baixa de http://ftp.edrdg.org/pub/Nihongo/JMdict_e.gz.
import { readFileSync, writeFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';

const SOURCE = 'http://ftp.edrdg.org/pub/Nihongo/JMdict_e.gz';
const arg = process.argv[2];
const buffer = arg ? readFileSync(arg) : Buffer.from(await (await fetch(SOURCE)).arrayBuffer());
const xml = gunzipSync(buffer).toString('utf8');

// A lista de palavras vem de scripts/pos/words.json (gerada por words.test.ts a partir do vocabulário do app).
const words = JSON.parse(readFileSync(new URL('./words.json', import.meta.url), 'utf8'));
const tokens = (text) => new Set((text.toLowerCase().match(/[a-z]{3,}/g) ?? []).filter((t) => !['the', 'and', 'for', 'with', 'one'].includes(t)));
const wantedEn = new Map(words.map((w) => [`${w.jp}|${w.reading}`, tokens(w.en)]));

/** O significado em inglês do JMdict tem alguma palavra em comum com o da lista? (Separa homógrafos: ここ "aqui" e ここ "nove".) */
const glossMatches = (entry, key) => {
  const mine = wantedEn.get(key);
  if (!mine || mine.size === 0) return true;
  const gloss = tokens([...entry.matchAll(/<gloss[^>]*>([^<]*)<\/gloss>/g)].map((m) => m[1]).join(' '));
  for (const t of mine) if (gloss.has(t)) return true;
  return false;
};
const wanted = new Map(words.map((w) => [`${w.jp}|${w.reading}`, w]));

/** Tag de classe do JMdict → rótulo em português. A primeira que combinar vale. */
const LABELS = [
  [/^v1/, 'verbo'],
  [/^v5/, 'verbo'],
  [/^vs/, 'verbo'],
  [/^vk/, 'verbo'],
  [/^vi|^vt/, 'verbo'],
  [/^adj-i/, 'adjetivo い'],
  [/^adj-na/, 'adjetivo な'],
  [/^adj-no|^adj-f|^adj-t/, 'adjetivo'],
  [/^adv/, 'advérbio'],
  [/^conj/, 'conjunção'],
  [/^int/, 'interjeição'],
  [/^prt/, 'partícula'],
  [/^ctr/, 'contador'],
  [/^num/, 'numeral'],
  [/^pn/, 'pronome'],
  [/^pref/, 'prefixo'],
  [/^suf/, 'sufixo'],
  [/^exp/, 'expressão'],
  [/^aux/, 'auxiliar'],
  [/^n$|^n-/, 'substantivo'],
];

const labelOf = (pos) => {
  for (const [pattern, label] of LABELS) if (pattern.test(pos)) return label;
  return null;
};

/** Quanto o JMdict considera a entrada comum (marcas de prioridade): entradas comuns vencem as raras com a mesma leitura. */
const commonness = (entry) => {
  let score = 0;
  for (const m of entry.matchAll(/<(?:ke|re)_pri>([^<]+)<\/(?:ke|re)_pri>/g)) {
    const tag = m[1];
    if (/1$/.test(tag) && /^(ichi|news|spec|gai)/.test(tag)) score += 10;
    else if (/2$/.test(tag)) score += 4;
    const nf = /^nf(\d+)$/.exec(tag);
    if (nf) score += Math.max(0, 25 - Number(nf[1]));
  }
  return score;
};

const posOf = (entry) => {
  const senses = [...entry.matchAll(/<sense>([\s\S]*?)<\/sense>/g)].map((m) => m[1]);
  const pos = [];
  for (const sense of senses.slice(0, 3)) for (const m of sense.matchAll(/<pos>&([^;]+);<\/pos>/g)) pos.push(m[1]);
  const labels = [...new Set(pos.map(labelOf).filter(Boolean))];
  // "adjetivo" genérico (adj-no, adj-f) só fica se for o único; no máximo dois papéis, na ordem dos sentidos.
  const trimmed = labels.length > 1 ? labels.filter((l) => l !== 'adjetivo') : labels;
  return trimmed.slice(0, 2);
};

// Para cada palavra da lista, a entrada mais comum do JMdict que tem a mesma escrita e leitura (ou, para palavras só em
// kana, a mesma leitura). Primeiro exige que o significado em inglês combine; o que ficar sem entrada é refeito sem essa
// exigência (a lista e o JMdict nem sempre usam as mesmas palavras: "I, myself" e "I; me").
const entries = xml.split('<entry>').slice(1);
const parsed = entries.map((entry) => ({
  entry,
  kebs: [...entry.matchAll(/<keb>([^<]+)<\/keb>/g)].map((m) => m[1]),
  rebs: [...entry.matchAll(/<reb>([^<]+)<\/reb>/g)].map((m) => m[1]),
  labels: posOf(entry),
  score: commonness(entry),
}));

function match(strict, already) {
  const best = new Map();
  for (const { entry, kebs, rebs, labels, score } of parsed) {
    if (labels.length === 0) continue;
    for (const reb of rebs) {
      for (const keb of kebs.length ? kebs : [reb]) {
        // Palavra escrita só em kana na lista: vale qualquer entrada com a mesma leitura (o JMdict costuma ter a escrita
        // com kanji "usually written in kana", como 此れ para これ).
        const keys = [`${keb}|${reb}`];
        if (wanted.has(`${reb}|${reb}`)) keys.push(`${reb}|${reb}`);
        for (const key of keys) {
          if (!wanted.has(key) || already[key]) continue;
          if (strict && !glossMatches(entry, key)) continue;
          const current = best.get(key);
          if (!current || score > current.score) best.set(key, { score, labels });
        }
      }
    }
  }
  return best;
}

const result = {};
for (const [key, value] of match(true, result)) result[key] = value.labels;
for (const [key, value] of match(false, result)) result[key] = value.labels;

const body = Object.entries(result)
  .map(([key, labels]) => `  ${JSON.stringify(key)}: ${JSON.stringify(labels)},`)
  .join('\n');
writeFileSync(
  new URL('../../src/content/wordClass.ts', import.meta.url),
  `// Gerado por \`npm run build-pos\` (scripts/pos/build.mjs). Não edite à mão.
// Fonte: JMdict (EDRDG, https://www.edrdg.org/jmdict/j_jmdict.html), licença CC BY-SA 4.0; ver src/content/LICENSE.md.

/** Classe gramatical de cada palavra, pela chave "escrita|leitura". Mais de uma = a palavra serve em mais de um papel. */
export const WORD_CLASS: Readonly<Record<string, readonly string[]>> = {
${body}
};
`,
);
console.log(`${Object.keys(result).length} de ${words.length} palavras com classe`);
