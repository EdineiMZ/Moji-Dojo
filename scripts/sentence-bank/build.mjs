// Gera src/content/sentenceBank.ts: roda o gerador (um teste do Jest, que usa o léxico do app) com a variável certa.
import { spawnSync } from 'node:child_process';

const result = spawnSync('npx', ['jest', 'scripts/sentence-bank', '--silent=false'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, BUILD_BANK: '1' },
});
process.exit(result.status ?? 1);
