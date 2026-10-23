// Baixa do Lingua Libre (Wikimedia Commons) uma gravação por palavra do vocabulário N5 e guarda os metadados (falante,
// licença, página). Retoma de onde parou. Uso: node scripts/audio/collect.mjs
// Depois: node scripts/audio/convert.mjs (comprime em mp3 e gera src/content/wordAudio.ts).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const UA = 'MojiDojo/1.0 (app pessoal de estudo de japones; coleta unica de audios do Lingua Libre)';
const API = 'https://commons.wikimedia.org/w/api.php';

const n5 = readFileSync(new URL('../../src/content/n5.ts', import.meta.url), 'utf8');
const words = [...new Map([...n5.matchAll(/jp: "([^"]+)", reading: "([^"]+)"/g)].map((m) => [m[1], { jp: m[1], reading: m[2] }])).values()].filter(
  (w) => !/[〜~()（）]/.test(w.jp),
);

const rawDir = new URL('./raw/', import.meta.url);
mkdirSync(rawDir, { recursive: true });
const metaPath = new URL('./meta.json', import.meta.url);
const meta = existsSync(metaPath) ? JSON.parse(readFileSync(metaPath, 'utf8')) : {};
const save = () => writeFileSync(metaPath, JSON.stringify(meta, null, 1));

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function api(params) {
  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await fetch(`${API}?${new URLSearchParams({ format: 'json', ...params })}`, { headers: { 'User-Agent': UA } });
    const text = await res.text();
    if (text.startsWith('{')) return JSON.parse(text);
    await sleep(5000 * (attempt + 1));
  }
  throw new Error('API indisponível');
}

/** Baixa um arquivo respeitando o limite do servidor: com 429, espera o tempo pedido (ou 30 s) e tenta de novo. */
async function download(url) {
  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (res.ok) return res;
    if (res.status !== 429) throw new Error(`${res.status} ${url}`);
    const wait = Number(res.headers.get('retry-after')) || 30;
    console.log(`429: esperando ${wait} s`);
    await sleep(wait * 1000 * (attempt + 1));
  }
  throw new Error(`429 persistente ${url}`);
}

/** Procura arquivos do Lingua Libre para a palavra, em japonês. */
async function find(word) {
  const found = await api({ action: 'query', list: 'search', srsearch: `LL-Q5287 (jpn) ${word.jp}`, srnamespace: '6', srlimit: '20' });
  const titles = found.query.search.map((s) => s.title).filter((t) => t.startsWith('File:LL-Q5287 (jpn)-') && t.endsWith(`-${word.jp}.wav`));
  if (titles.length === 0) return null;
  const info = await api({ action: 'query', titles: titles[0], prop: 'imageinfo', iiprop: 'url|extmetadata|user' });
  const page = Object.values(info.query.pages)[0];
  const ii = page?.imageinfo?.[0];
  if (!ii) return null;
  const ext = ii.extmetadata ?? {};
  return {
    title: titles[0],
    url: ii.url,
    speaker: titles[0].replace('File:LL-Q5287 (jpn)-', '').replace(`-${word.jp}.wav`, ''),
    license: ext.LicenseShortName?.value ?? '',
    licenseUrl: ext.LicenseUrl?.value ?? '',
    page: `https://commons.wikimedia.org/wiki/${encodeURIComponent(titles[0].replace(/ /g, '_'))}`,
  };
}

let done = 0;
for (const word of words) {
  if (meta[word.jp] !== undefined) continue;
  try {
    const hit = await find(word);
    if (!hit) {
      meta[word.jp] = null;
    } else if (!/CC0|CC BY/i.test(hit.license)) {
      // Só entram licenças que permitem o uso com crédito (CC BY, CC BY-SA) ou sem restrição (CC0).
      meta[word.jp] = null;
    } else {
      const res = await download(hit.url);
      const file = `${Object.keys(meta).filter((k) => meta[k]).length}.wav`;
      writeFileSync(new URL(file, rawDir), Buffer.from(await res.arrayBuffer()));
      meta[word.jp] = { ...hit, file };
    }
  } catch (error) {
    console.error(`falhou "${word.jp}":`, error.message);
    await sleep(4000);
    continue;
  }
  if (++done % 20 === 0) {
    save();
    console.log(`${Object.keys(meta).length}/${words.length} palavras, ${Object.values(meta).filter(Boolean).length} com áudio`);
  }
  await sleep(4000);
}
save();
console.log(`pronto: ${Object.values(meta).filter(Boolean).length} de ${words.length} palavras com áudio`);
