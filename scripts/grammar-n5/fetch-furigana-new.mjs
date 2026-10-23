// Como fetch-furigana.mjs, mas só para os exemplos que ainda não têm `furi` (não refaz os que já têm).
// Uso: node scripts/grammar-n5/fetch-furigana-new.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { TOPICS } from './topics.mjs';
import { search } from './tatoeba.mjs';

const path = new URL('./topics.mjs', import.meta.url);
let source = readFileSync(path, 'utf8');
let added = 0;
for (const example of TOPICS.flatMap((t) => t.examples)) {
  if (example.furi || !/[一-鿿]/.test(example.ja)) continue;
  const json = await search(example.ja, 1);
  const found = json.results.find((r) => r.id === example.id);
  const hrkt = found?.transcriptions.find((t) => t.script === 'Hrkt');
  if (!hrkt) throw new Error(`sem furigana para ${example.id}`);
  const marker = `{ id: ${example.id}, ja: '${example.ja}',`;
  if (!source.includes(marker)) throw new Error(`não achei ${marker}`);
  source = source.replace(marker, `${marker} furi: '${hrkt.text.replace(/'/g, "\'")}',`);
  added++;
  await new Promise((r) => setTimeout(r, 400));
}
writeFileSync(path, source);
console.log(`${added} exemplos com furigana`);
