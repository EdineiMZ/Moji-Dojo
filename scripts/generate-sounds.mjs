// Gera os efeitos sonoros em assets/sfx/*.wav. Uso: npm run generate-sounds
// Os sons são sintetizados por scripts/sfxSynth.cjs (originais, sem terceiros); os arquivos
// gerados ficam versionados e um teste confere que eles batem com o que o gerador produz.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const { SOUND_NAMES, soundWav } = createRequire(import.meta.url)('./sfxSynth.cjs');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'assets', 'sfx');
fs.mkdirSync(OUT, { recursive: true });

let total = 0;
for (const name of SOUND_NAMES) {
  const wav = soundWav(name);
  fs.writeFileSync(path.join(OUT, `${name}.wav`), wav);
  total += wav.length;
  console.log(`  assets/sfx/${name}.wav  ${(wav.length / 1024).toFixed(1)} KB`);
}
console.log(`\nOK: ${SOUND_NAMES.length} sons, ${(total / 1024).toFixed(0)} KB no total.`);
