// Uso: npm run build-frequency -- <caminho do jpn_sentences.tsv do Tatoeba>
import { spawnSync } from 'node:child_process';

const file = process.argv[2];
if (!file) {
  console.error('Passe o caminho do jpn_sentences.tsv (https://downloads.tatoeba.org/exports/per_language/jpn/jpn_sentences.tsv.bz2).');
  process.exit(1);
}
const result = spawnSync('npx', ['jest', 'scripts/frequency'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, BUILD_FREQ: '1', FREQ_SENTENCES: file },
});
process.exit(result.status ?? 1);
