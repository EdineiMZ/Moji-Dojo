// Versão do app. Uso (ou pelos scripts npm "version:*"):
//   node scripts/version.mjs show              mostra a versão atual e o versionCode
//   node scripts/version.mjs bump <tipo>       aumenta a versão: patch | minor | major
//   node scripts/version.mjs sync              copia a versão do app.json para o versionCode, package.json e package-lock.json
//   node scripts/version.mjs apk-name          nome do APK (usado pelo gerar-apk.bat), ex.: MojiDojo-1.1.0.apk
// "bump" atualiza app.json (versão e android.versionCode), package.json e package-lock.json e abre uma
// entrada nova no CHANGELOG.md, que precisa ser escrita (o teste falha enquanto ela estiver provisória).
// A política de quando aumentar está em scripts/versioning.cjs.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const { apkName, bumpVersion, addChangelogEntry, versionCode } = createRequire(import.meta.url)('./versioning.cjs');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = (name) => path.join(ROOT, name);

const readJson = (name) => JSON.parse(fs.readFileSync(file(name), 'utf8'));
const writeJson = (name, value) => fs.writeFileSync(file(name), `${JSON.stringify(value, null, 2)}\n`, 'utf8');

const app = readJson('app.json');
const current = app.expo.version;

/** Grava a versão em app.json (com o versionCode), package.json e package-lock.json. */
function writeVersion(version) {
  app.expo.version = version;
  app.expo.android = { ...app.expo.android, versionCode: versionCode(version) };
  writeJson('app.json', app);

  const pkg = readJson('package.json');
  pkg.version = version;
  writeJson('package.json', pkg);

  const lock = readJson('package-lock.json');
  lock.version = version;
  if (lock.packages?.['']) lock.packages[''].version = version;
  writeJson('package-lock.json', lock);
}

const [command, arg] = process.argv.slice(2);

if (command === 'apk-name') {
  console.log(apkName(current));
} else if (!command || command === 'show') {
  console.log(`Moji Dojo ${current} (versionCode ${versionCode(current)})`);
} else if (command === 'sync') {
  writeVersion(current);
  console.log(`Versão ${current} aplicada (versionCode ${versionCode(current)}).`);
} else if (command === 'bump') {
  const next = bumpVersion(current, arg);

  writeVersion(next);

  const changelog = fs.readFileSync(file('CHANGELOG.md'), 'utf8');
  const today = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(file('CHANGELOG.md'), addChangelogEntry(changelog, next, today), 'utf8');

  console.log(`${current} → ${next} (versionCode ${versionCode(next)})`);
  console.log('Agora descreva o que mudou na entrada nova do CHANGELOG.md.');
} else {
  console.error('Uso: node scripts/version.mjs show | sync | apk-name | bump <patch|minor|major>');
  process.exit(1);
}
