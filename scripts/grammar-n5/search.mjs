// Procura frases curtas no Tatoeba com tradução em português, para escolher os exemplos dos tópicos.
// Uso: node scripts/grammar-n5/search.mjs "てください" "下さい" [--max 14] [--pages 2]
import { search, simplify } from './tatoeba.mjs';

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(name);
  if (i < 0) return fallback;
  const [, value] = args.splice(i, 2);
  return Number(value);
};
const max = flag('--max', 14);
const pages = flag('--pages', 2);

for (const query of args) {
  console.log(`\n=== ${query}`);
  const seen = new Set();
  for (let page = 1; page <= pages; page++) {
    const json = await search(query, page);
    for (const r of json.results) {
      const s = simplify(r);
      if (!s || seen.has(s.id) || [...s.reading].length > max) continue;
      seen.add(s.id);
      console.log(`${s.id}\t${s.text}\t${s.reading}\t${s.pt.slice(0, 2).join(' / ')}`);
    }
  }
}
