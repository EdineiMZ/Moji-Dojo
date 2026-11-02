// Gera src/data/lookalikesKanji.ts: os kanji que se parecem com cada kanji do app, calculados a partir dos traços do KanjiVG
// (nenhuma lista escrita à mão). Roda o gerador (um teste do Jest, que carrega os dados do app) com a variável certa.
// Uso: npm run build-kanji-lookalikes
import { spawnSync } from 'node:child_process';

const result = spawnSync('npx', ['jest', 'scripts/kanji-lookalikes', '--silent=false'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, BUILD_KANJI_LOOKALIKES: '1' },
});
process.exit(result.status ?? 1);
