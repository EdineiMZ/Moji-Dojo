// Converte as gravações coletadas (scripts/audio/raw/*.wav) em mp3 pequeno e gera src/content/wordAudio.ts.
// Uso: node scripts/audio/convert.mjs
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const meta = JSON.parse(readFileSync(join(here, 'meta.json'), 'utf8'));
const outDir = join(root, 'assets', 'audio', 'words');
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const entries = Object.entries(meta).filter(([, m]) => m && m.file).sort(([a], [b]) => a.localeCompare(b, 'ja'));
const lines = [];
let n = 0;
for (const [word, m] of entries) {
  const src = join(here, 'raw', m.file);
  if (!existsSync(src)) continue;
  n += 1;
  const name = `w${String(n).padStart(3, '0')}.mp3`;
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', src, '-ac', '1', '-ar', '22050', '-b:a', '40k', join(outDir, name)]);
  const speaker = JSON.stringify(m.speaker);
  lines.push(
    `  ${JSON.stringify(word)}: { file: require('../../assets/audio/words/${name}') as number, speaker: ${speaker}, license: ${JSON.stringify(m.license)}, page: ${JSON.stringify(m.page)} },`,
  );
}

const header = `// GERADO por scripts/audio/convert.mjs: não edite à mão.
// Gravações de falantes nativos do Lingua Libre (Wikimedia Commons), com licença CC0, CC BY ou CC BY-SA.
// Veja os créditos em Ajustes → Sobre e em src/content/LICENSE.md.

export interface WordRecording {
  /** Arquivo mp3 (resultado do require). */
  file: number;
  speaker: string;
  license: string;
  /** Página da gravação no Wikimedia Commons. */
  page: string;
}

export const WORD_RECORDINGS: Readonly<Record<string, WordRecording>> = {
`;
writeFileSync(join(root, 'src', 'content', 'wordAudio.ts'), `${header}${lines.join('\n')}\n};\n`);
console.log(`${n} gravações convertidas`);
