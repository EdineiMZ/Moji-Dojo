// Uma vez só: busca no Tatoeba a leitura com furigana ([来|き]て...) de cada exemplo e escreve no topics.mjs
// (campo `furi`). Depois disso o build não precisa de internet. Uso: node scripts/grammar-n5/fetch-furigana.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { TOPICS } from './topics.mjs';
import { search } from './tatoeba.mjs';

const path = new URL('./topics.mjs', import.meta.url);
let source = readFileSync(path, 'utf8');
let added = 0;

for (const example of TOPICS.flatMap((t) => t.examples)) {
  if (!/[一-鿿]/.test(example.ja)) continue; // sem kanji não há furigana
  const json = await search(example.ja, 1);
  const found = json.results.find((r) => r.id === example.id);
  const hrkt = found?.transcriptions.find((t) => t.script === 'Hrkt');
  if (!hrkt) throw new Error(`sem furigana para ${example.id}`);
  const marker = `{ id: ${example.id}, ja: '${example.ja}',`;
  if (!source.includes(marker)) throw new Error(`não achei ${marker}`);
  if (source.includes(`${marker} furi:`)) continue;
  source = source.replace(marker, `${marker} furi: '${hrkt.text.replace(/'/g, "\'")}',`);
  added++;
}
writeFileSync(path, source);
console.log(`${added} exemplos com furigana`);
