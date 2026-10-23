// Passo 1: lista as palavras do app (Jest). Passo 2: busca a classe de cada uma no JMdict. Uso: npm run build-pos [-- JMdict_e.gz]
import { spawnSync } from 'node:child_process';

const jest = spawnSync('npx', ['jest', 'scripts/pos'], { stdio: 'inherit', shell: true, env: { ...process.env, BUILD_POS: '1' } });
if (jest.status !== 0) process.exit(jest.status ?? 1);
const build = spawnSync('node', ['scripts/pos/build.mjs', ...process.argv.slice(2)], { stdio: 'inherit', shell: true });
process.exit(build.status ?? 1);
