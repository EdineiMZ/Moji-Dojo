// Gera docs/revisao-vocabulario.md (a revisão do vocabulário). Uso: npm run audit-vocab
// A lógica fica em src/features/vocab/audit.ts (a mesma que o app usa para escolher alternativas); aqui só roda o teste que grava o arquivo.
const { spawnSync } = require('node:child_process');
const result = spawnSync('npx', ['jest', 'src/features/vocab/audit.test.ts'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, VOCAB_AUDIT_WRITE: '1' },
});
process.exit(result.status ?? 1);
