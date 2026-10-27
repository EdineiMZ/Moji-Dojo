// Gera src/features/speech/voicevoxCatalog.ts: as vozes que o app oferece para baixar.
// Fontes oficiais:
//  - repositório VOICEVOX/voicevox_vvm: a tabela arquivo (.vvm) → personagem → estilo e o tamanho em bytes de cada arquivo
//    (só as vozes de fala; as de canto, s0.vvm, e n0.vvm ficam de fora);
//  - voicevox.hiroshiba.jp/product/<slug>/: a página de cada personagem, de onde vêm o endereço (slug, que também dá o nome
//    romanizado), a descrição da voz em japonês e o link dos termos de uso do personagem.
//   node scripts/voicevox/catalog.mjs [versão-da-release]      (padrão: a mais nova)
import { writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const output = join(root, 'src', 'features', 'speech', 'voicevoxCatalog.ts');
const repo = 'VOICEVOX/voicevox_vvm';
const site = 'https://voicevox.hiroshiba.jp';

async function getJson(url) {
  const response = await fetch(url, { headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'moji-dojo-catalog' } });
  if (!response.ok) throw new Error(`Falha ao ler ${url}: ${response.status}`);
  return response.json();
}

async function getText(url) {
  const response = await fetch(url, { headers: { 'User-Agent': 'moji-dojo-catalog' } });
  if (!response.ok) throw new Error(`Falha ao ler ${url}: ${response.status}`);
  return response.text();
}

const wanted = process.argv[2];
const releases = await getJson(`https://api.github.com/repos/${repo}/releases`);
const release = wanted ? releases.find((r) => r.tag_name === wanted) : releases[0];
if (!release) throw new Error(`Release ${wanted ?? '(mais nova)'} não encontrada.`);

// --- arquivos, personagens e estilos (tabela do README oficial) ---
const readme = await getText(`https://raw.githubusercontent.com/${repo}/main/README.md`);
const talk = readme.split(/^## ソング/m)[0] ?? '';
const packs = new Map();
for (const line of talk.split('\n')) {
  const cells = line.split('|').map((c) => c.trim());
  const [, file, speaker, style, id] = cells;
  if (!file || !/^\d+\.vvm$/.test(file) || !/^\d+$/.test(id ?? '')) continue;
  const pack = packs.get(file) ?? { file, voices: [] };
  let voice = pack.voices.find((v) => v.speaker === speaker);
  if (!voice) pack.voices.push((voice = { speaker, styles: [] }));
  voice.styles.push([Number(id), style]);
  packs.set(file, pack);
}

const sizes = new Map(release.assets.map((a) => [a.name, a.size]));
const list = [...packs.values()].sort((a, b) => parseInt(a.file) - parseInt(b.file));
for (const pack of list) {
  const bytes = sizes.get(pack.file);
  if (!bytes) throw new Error(`${pack.file} não está na release ${release.tag_name}.`);
  pack.bytes = bytes;
}

// --- páginas dos personagens no site oficial ---
const home = await getText(`${site}/`);
const slugs = [...new Set([...home.matchAll(/href="\/product\/([a-z_0-9]+)\/?"/g)].map((m) => m[1]))];
const bySite = new Map();
for (const slug of slugs) {
  const html = (await getText(`${site}/product/${slug}/`)).replace(/&quot;/g, '"').replace(/&amp;/g, '&');
  const meta = (html.match(/<meta name="description" content="([^"]+)"/) ?? [])[1] ?? '';
  const parsed = meta.match(/「(.+?)」の(.+?)で誰でも/);
  const termsUrl = (html.match(/"policyUrl":\[0,"([^"]+)"/) ?? [])[1];
  if (!parsed || !termsUrl) throw new Error(`Não consegui ler a página de ${slug}.`);
  bySite.set(parsed[1], { name: parsed[1], slug, voiceJa: parsed[2], termsUrl });
}

const speakerNames = [...new Set(list.flatMap((p) => p.voices.map((v) => v.speaker)))];
const missing = speakerNames.filter((n) => !bySite.has(n));
if (missing.length > 0) throw new Error(`Sem página no site oficial: ${missing.join(', ')}`);
const speakers = speakerNames.map((n) => bySite.get(n));

const q = (s) => JSON.stringify(s);
const packRows = list
  .map((p) => `  { file: '${p.file}', bytes: ${p.bytes}, voices: [${p.voices.map((v) => `{ speaker: ${q(v.speaker)}, styles: [${v.styles.map(([id, name]) => `[${id}, ${q(name)}]`).join(', ')}] }`).join(', ')}] },`)
  .join('\n');
const speakerRows = speakers.map((s) => `  { name: ${q(s.name)}, slug: '${s.slug}', voiceJa: ${q(s.voiceJa)}, termsUrl: ${q(s.termsUrl)} },`).join('\n');

writeFileSync(
  output,
  `// Gerado por scripts/voicevox/catalog.mjs (não edite à mão): as vozes do VOICEVOX para baixar.
// Fontes: https://github.com/${repo}/releases/tag/${release.tag_name} e as páginas de personagem de ${site}/product/.

/** Um personagem, como o site oficial o apresenta. */
export interface VoiceSpeaker {
  /** Nome em japonês, igual ao que o motor devolve. */
  name: string;
  /** Endereço no site oficial (/product/<slug>/); o nome romanizado sai dele. */
  slug: string;
  /** Descrição da voz, em japonês, como no site (vazia ou só "声" quando o site ainda não tem). */
  voiceJa: string;
  /** Termos de uso do personagem, do site oficial. */
  termsUrl: string;
}

export interface VoicePack {
  /** Nome do arquivo na release, por exemplo "0.vvm". */
  file: string;
  /** Tamanho exato, conferido depois do download. */
  bytes: number;
  /** Os personagens do arquivo e os estilos de cada um ([id, nome em japonês]). */
  voices: readonly { speaker: string; styles: readonly (readonly [number, string])[] }[];
}

export const VOICE_PACKS_RELEASE = '${release.tag_name}';

export const VOICE_PACKS: readonly VoicePack[] = [
${packRows}
];

export const VOICE_SPEAKERS: readonly VoiceSpeaker[] = [
${speakerRows}
];
`,
);
const styleNames = [...new Set(list.flatMap((p) => p.voices.flatMap((v) => v.styles.map(([, n]) => n))))];
console.log(`[voicevox] ${list.length} arquivos, ${speakers.length} personagens, ${styleNames.length} nomes de estilo (release ${release.tag_name}) → ${output}`);
writeFileSync(join(process.env.TEMP ?? '.', 'vv-style-names.json'), JSON.stringify(styleNames));
