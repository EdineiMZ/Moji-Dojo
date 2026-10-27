// Gera src/features/speech/voicevoxCatalog.ts: a lista de arquivos de voz (.vvm) que o app oferece para baixar.
// Fonte: README.md e a release do repositório oficial VOICEVOX/voicevox_vvm (a tabela arquivo → personagem → estilo e o
// tamanho em bytes de cada arquivo). Só entram as vozes de fala; as de canto (s0.vvm) e n0.vvm ficam de fora.
//   node scripts/voicevox/catalog.mjs [versão-da-release]      (padrão: a mais nova)
import { writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const output = join(root, 'src', 'features', 'speech', 'voicevoxCatalog.ts');
const repo = 'VOICEVOX/voicevox_vvm';

async function getJson(url) {
  const response = await fetch(url, { headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'moji-dojo-catalog' } });
  if (!response.ok) throw new Error(`Falha ao ler ${url}: ${response.status}`);
  return response.json();
}

const wanted = process.argv[2];
const releases = await getJson(`https://api.github.com/repos/${repo}/releases`);
const release = wanted ? releases.find((r) => r.tag_name === wanted) : releases[0];
if (!release) throw new Error(`Release ${wanted ?? '(mais nova)'} não encontrada.`);

const readme = await (await fetch(`https://raw.githubusercontent.com/${repo}/main/README.md`)).text();
const talk = readme.split(/^## ソング/m)[0] ?? '';
const packs = new Map();
for (const line of talk.split('\n')) {
  const cells = line.split('|').map((c) => c.trim());
  const [, file, speaker, , id] = cells;
  if (!file || !/^\d+\.vvm$/.test(file) || !/^\d+$/.test(id ?? '')) continue;
  const pack = packs.get(file) ?? { file, speakers: [], styles: [] };
  if (!pack.speakers.includes(speaker)) pack.speakers.push(speaker);
  pack.styles.push(Number(id));
  packs.set(file, pack);
}

const sizes = new Map(release.assets.map((a) => [a.name, a.size]));
const list = [...packs.values()].sort((a, b) => parseInt(a.file) - parseInt(b.file));
for (const pack of list) {
  const bytes = sizes.get(pack.file);
  if (!bytes) throw new Error(`${pack.file} não está na release ${release.tag_name}.`);
  pack.bytes = bytes;
}

const rows = list
  .map((p) => `  { file: '${p.file}', bytes: ${p.bytes}, speakers: ${JSON.stringify(p.speakers)}, styles: [${p.styles.join(', ')}] },`)
  .join('\n');

writeFileSync(
  output,
  `// Gerado por scripts/voicevox/catalog.mjs (não edite à mão): arquivos de voz do VOICEVOX para baixar.
// Fonte: https://github.com/${repo}/releases/tag/${release.tag_name}

export interface VoicePack {
  /** Nome do arquivo na release, por exemplo "0.vvm". */
  file: string;
  /** Tamanho exato, conferido depois do download. */
  bytes: number;
  /** Personagens que têm algum estilo neste arquivo. */
  speakers: readonly string[];
  /** Ids dos estilos (personagem + tom) que o arquivo traz. */
  styles: readonly number[];
}

export const VOICE_PACKS_RELEASE = '${release.tag_name}';

export const VOICE_PACKS: readonly VoicePack[] = [
${rows}
];
`,
);
console.log(`[voicevox] ${list.length} arquivos de voz (release ${release.tag_name}) → ${output}`);
