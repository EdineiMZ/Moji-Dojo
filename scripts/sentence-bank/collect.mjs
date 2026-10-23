// Busca no Tatoeba (CC BY 2.0 FR) frases curtas com tradução em português e leitura, a partir das palavras do N5, e
// grava scripts/sentence-bank/candidates.json. Depois: `npm run build-sentences` filtra pelo vocabulário do app.
// Uso: node scripts/sentence-bank/collect.mjs [--per 8] [--max 22]
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { search, simplify } from '../grammar-n5/tatoeba.mjs';

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(name);
  return i < 0 ? fallback : Number(args[i + 1]);
};
const perWord = flag('--per', 8);
const maxLength = flag('--max', 22);

const n5 = readFileSync(new URL('../../src/content/n5.ts', import.meta.url), 'utf8');
const queries = [...new Set([...n5.matchAll(/jp: "([^"]+)"/g)].map((m) => m[1]))].filter((q) => !/[〜~()（）]/.test(q));

const out = new URL('./candidates.json', import.meta.url);
const bank = existsSync(out) ? JSON.parse(readFileSync(out, 'utf8')) : { done: [], sentences: {} };
const done = new Set(bank.done);
const save = () => writeFileSync(out, JSON.stringify(bank));

const CONCURRENCY = 4;
let finished = 0;
const pending = queries.filter((q) => !done.has(q));

async function worker() {
  for (let query = pending.shift(); query !== undefined; query = pending.shift()) {
    try {
      const json = await search(query, 1);
      const found = [];
      for (const r of json.results) {
        const hrkt = r.transcriptions.find((t) => t.script === 'Hrkt');
        const s = simplify(r);
        if (!s || !hrkt || [...r.text].length > maxLength || bank.sentences[s.id]) continue;
        found.push({ id: s.id, text: r.text, hrkt: hrkt.text, pt: s.pt[0] });
      }
      for (const s of found.slice(0, perWord)) bank.sentences[s.id] = s;
      done.add(query);
    } catch (error) {
      console.error(`falhou "${query}":`, error.message);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
    if (++finished % 25 === 0) {
      bank.done = [...done];
      save();
      console.log(`${done.size}/${queries.length} palavras, ${Object.keys(bank.sentences).length} frases`);
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker));
bank.done = [...done];
save();
console.log(`pronto: ${Object.keys(bank.sentences).length} frases de ${done.size} palavras`);
