// Confere o japonês escrito por IA contra o Tatoeba (frases de falantes nativos, CC BY 2.0 FR): para cada frase, busca no Tatoeba
// e compara a leitura em kana com a das frases achadas. Resultado em três faixas: atestada (igual), parecida e sem par.
// Uso: npm run verify-japanese  (precisa de internet; guarda o cache em scripts/verify-japanese/cache.json)
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readingOf, search } from '../grammar-n5/tatoeba.mjs';

const here = new URL('.', import.meta.url);
const dumpPath = join(tmpdir(), 'moji-phrases.json');
const jest = spawnSync('npx', ['jest', 'scripts/verify-japanese'], { stdio: 'inherit', shell: true, env: { ...process.env, VERIFY_JA_OUT: dumpPath } });
if (jest.status !== 0) process.exit(jest.status ?? 1);

const rows = JSON.parse(readFileSync(dumpPath, 'utf8'));
const cachePath = new URL('./cache.json', here);
const cache = existsSync(cachePath) ? JSON.parse(readFileSync(cachePath, 'utf8')) : {};

const PUNCT = /[\s。、！？!?.,「」『』…・〜~，．　]/g;
const toHira = (s) => s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
const norm = (s) => toHira(s.replace(PUNCT, ''));

function distance(a, b) {
  const m = [...a].length;
  const n = [...b].length;
  const A = [...a];
  const B = [...b];
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (A[i - 1] === B[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}
const similarity = (a, b) => (a === b ? 1 : 1 - distance(a, b) / Math.max([...a].length, [...b].length));

/** Frases de uma palavra só ou com símbolos (preços, horários) não têm o que conferir no Tatoeba. */
const skippable = (jp) => /[0-9０-９+＋〜:：]/.test(jp) || [...norm(jp)].length < 3;

const unique = [...new Map(rows.map((r) => [r.jp, r])).values()];
let done = 0;
for (const row of unique) {
  const key = norm(row.jp);
  if (cache[key] || skippable(row.jp)) continue;
  try {
    const json = await search(key, 1);
    const hits = json.results
      .map((r) => {
        const hrkt = r.transcriptions.find((t) => t.script === 'Hrkt');
        const reading = norm(hrkt ? readingOf(hrkt.text) : r.text);
        return { id: r.id, text: r.text, reading, score: similarity(key, reading), license: r.license };
      })
      .filter((h) => h.license === 'CC BY 2.0 FR')
      .sort((a, b) => b.score - a.score);
    cache[key] = hits[0] ? { id: hits[0].id, text: hits[0].text, score: Math.round(hits[0].score * 100) / 100, total: json.results.length } : { total: json.results.length };
  } catch (error) {
    console.error(`falhou "${row.jp}":`, error.message);
    await new Promise((r) => setTimeout(r, 3000));
  }
  if (++done % 25 === 0) {
    writeFileSync(cachePath, JSON.stringify(cache));
    console.log(`${done} consultas`);
  }
  await new Promise((r) => setTimeout(r, 350));
}
writeFileSync(cachePath, JSON.stringify(cache));

// Faixas: atestada (leitura igual ou quase), parecida (bem próxima) e sem par.
const tierOf = (row) => {
  if (skippable(row.jp)) return 'nao-confere';
  const hit = cache[norm(row.jp)];
  if (!hit?.id) return 'sem-par';
  return hit.score >= 0.92 ? 'atestada' : hit.score >= 0.75 ? 'parecida' : 'sem-par';
};
const report = unique.map((row) => ({ ...row, tier: tierOf(row), match: cache[norm(row.jp)] ?? null }));
writeFileSync(new URL('./report.json', here), JSON.stringify(report, null, 1));
const counts = {};
for (const r of report) counts[`${r.src}:${r.tier}`] = (counts[`${r.src}:${r.tier}`] ?? 0) + 1;
console.log(counts);
