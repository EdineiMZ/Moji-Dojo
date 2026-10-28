// Gera os avisos de licença de terceiros que o app mostra em Ajustes → Créditos e licenças:
//   src/content/openSource.ts       pacotes JS que entram no bundle, bibliotecas Android e componentes nativos, com o texto de cada licença
//   src/content/openSourceOnnx.ts   avisos de terceiros que acompanham o ONNX Runtime do VOICEVOX (em trechos)
//
//   node scripts/licenses/build.mjs [--bundled <json>] [--gradle <txt>]
//
// Sem opções, o script exporta o bundle (npx expo export, com mapa de fontes) para saber quais pacotes entram de verdade, e roda
// `gradlew :app:dependencies` para saber as bibliotecas Android (precisa do projeto android/, gerado por `expo prebuild`).
// Os textos fixos (SPDX, VOICEVOX, ONNX Runtime, dicionário do Open JTalk) ficam em scripts/licenses/texts/.
import { execFileSync, execSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const textsDir = join(root, 'scripts', 'licenses', 'texts');
const args = process.argv.slice(2);
const option = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const pkgJson = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

const read = (file) => readFileSync(join(textsDir, file), 'utf8').trim();

// ---------- 1. pacotes JS que entram no bundle ----------
function bundledPackages() {
  const given = option('--bundled');
  if (given) return JSON.parse(readFileSync(given, 'utf8'));
  const out = mkdtempSync(join(tmpdir(), 'moji-export-'));
  console.log('[licenses] exportando o bundle para ler o mapa de fontes...');
  execSync(`npx expo export --platform android --source-maps --output-dir "${out}"`, { cwd: root, stdio: 'ignore' });
  const dir = join(out, '_expo', 'static', 'js', 'android');
  const map = JSON.parse(readFileSync(join(dir, readdirSync(dir).find((f) => f.endsWith('.map'))), 'utf8'));
  const names = new Set();
  for (const source of map.sources) {
    const i = source.lastIndexOf('node_modules/');
    if (i < 0) continue;
    const parts = source.slice(i + 13).split('/');
    names.add(parts[0].startsWith('@') ? `${parts[0]}/${parts[1]}` : parts[0]);
  }
  return [...names];
}

function findPackageJson(name, from = root) {
  let dir = from;
  for (;;) {
    const file = join(dir, 'node_modules', name, 'package.json');
    if (existsSync(file)) return file;
    const up = dirname(dir);
    if (up === dir) return null;
    dir = up;
  }
}

const SPDX_TEXT = { MIT: 'MIT.txt', 'Apache-2.0': 'Apache-2.0.txt', 'EPL-2.0': 'EPL-2.0.txt', 'BSD-2-Clause': 'BSD-2-Clause.txt', 'BSD-3-Clause': 'BSD-3-Clause.txt' };

function licenseOf(pkg) {
  let license = pkg.license;
  if (license && typeof license === 'object') license = license.type;
  if (!license && Array.isArray(pkg.licenses)) license = pkg.licenses.map((l) => l.type).join(' OR ');
  return String(license ?? 'desconhecida').replace(/^\((.*)\)$/, '$1');
}

function licenseFile(dir) {
  const files = readdirSync(dir).filter((f) => /^(licen[cs]e|copying|unlicense)(\.(md|txt|markdown))?$/i.test(f));
  return files.length > 0 ? readFileSync(join(dir, files[0]), 'utf8').trim() : null;
}

// ---------- 2. bibliotecas Android (Gradle) ----------
function gradleLibs() {
  let text;
  const given = option('--gradle');
  if (given) text = readFileSync(given, 'utf8').replace(/\u0000/g, '');
  else {
    const gradlew = join(root, 'android', process.platform === 'win32' ? 'gradlew.bat' : 'gradlew');
    if (!existsSync(gradlew)) {
      console.warn('[licenses] AVISO: projeto android/ ausente; as bibliotecas Android ficam de fora (rode expo prebuild).');
      return [];
    }
    text = execFileSync(gradlew, [':app:dependencies', '--configuration', 'releaseRuntimeClasspath', '-PreactNativeArchitectures=arm64-v8a'], { cwd: join(root, 'android'), encoding: 'utf8', shell: process.platform === 'win32', maxBuffer: 64 * 1024 * 1024 });
  }
  const section = text.split(/^releaseRuntimeClasspath/m)[1] ?? text;
  const found = new Map();
  for (const m of section.matchAll(/[+\\]--- ([\w.-]+):([\w.-]+):([^\s]+?)(?: -> ([\w.-]+))?(?: \(\*\)| \(c\)| \(n\))?\s*$/gm)) {
    const [, group, artifact, declared, resolved] = m;
    found.set(`${group}:${artifact}`, { group, artifact, version: resolved || declared.replace(/[[\]]/g, '').split(',')[0] });
  }
  return [...found.values()];
}

const GRADLE_CACHE = join(homedir(), '.gradle', 'caches', 'modules-2', 'files-2.1');
function pomLicense({ group, artifact, version }) {
  const dir = join(GRADLE_CACHE, group, artifact, version);
  if (!existsSync(dir)) return null;
  for (const hash of readdirSync(dir)) {
    const file = join(dir, hash, `${artifact}-${version}.pom`);
    if (existsSync(file)) return readFileSync(file, 'utf8').match(/<licenses>[\s\S]*?<name>([^<]+)<\/name>/)?.[1].trim() ?? null;
  }
  return null;
}

/** O nome que o POM declara → a licença conhecida (o texto vem de scripts/licenses/texts/). */
function androidFamily(name) {
  if (!name) return null;
  if (/apache|^apache-?2/i.test(name)) return 'Apache-2.0';
  if (/^(the )?mit/i.test(name)) return 'MIT';
  if (/simplified bsd/i.test(name)) return 'BSD-2-Clause';
  if (/bsd/i.test(name)) return 'BSD-3-Clause';
  if (/epl 2/i.test(name)) return 'EPL-2.0';
  if (/android software development kit/i.test(name)) return 'Android Software Development Kit License';
  if (/ml kit/i.test(name)) return 'ML Kit Terms of Service';
  return name;
}

// Os que o POM deixa sem licença: conferidos à mão nos projetos de origem.
const MANUAL = {
  'com.google.guava:guava': 'Apache-2.0',
  'com.google.guava:failureaccess': 'Apache-2.0',
  'com.google.guava:listenablefuture': 'Apache-2.0',
  'commons-codec:commons-codec': 'Apache-2.0',
  'commons-io:commons-io': 'Apache-2.0',
  'org.brotli:dec': 'MIT',
};

// ---------- montagem ----------
const texts = [];
const textIndex = new Map();
const intern = (text) => {
  if (!textIndex.has(text)) { textIndex.set(text, texts.length); texts.push(text); }
  return textIndex.get(text);
};
const items = [];

const direct = Object.keys(pkgJson.dependencies);
const names = [...new Set([...bundledPackages(), ...direct])].sort();
let noFile = 0;
for (const name of names) {
  const file = findPackageJson(name);
  if (!file) continue;
  const pkg = JSON.parse(readFileSync(file, 'utf8'));
  const license = licenseOf(pkg);
  let text = licenseFile(dirname(file));
  if (!text) {
    const spdx = SPDX_TEXT[license];
    text = spdx ? read(spdx) : null;
  }
  if (!text) noFile++;
  items.push({ name: pkg.name, version: pkg.version, license, kind: 'js', text: text ? intern(text) : null });
}

const family = new Map();
let unknown = 0;
for (const lib of gradleLibs()) {
  // Os módulos do Expo e do React Native vêm do node_modules (já listados acima) e os do VOICEVOX estão na seção nativa.
  if (/^(expo\.modules|host\.exp\.exponent|com\.facebook\.react|jp\.hiroshiba)/.test(lib.group)) continue;
  const key = `${lib.group}:${lib.artifact}`;
  const lic = androidFamily(MANUAL[key] ?? pomLicense(lib));
  if (!lic) { unknown++; console.warn('[licenses] sem licença:', key); }
  const spdx = SPDX_TEXT[lic];
  if (spdx && !family.has(lic)) family.set(lic, intern(read(spdx)));
  const meta = lic === 'MIT' && lib.group.startsWith('com.facebook') ? items.find((i) => i.name === 'react-native')?.text : null;
  items.push({ name: key, version: lib.version, license: lic ?? 'desconhecida', kind: 'android', text: meta ?? (spdx ? family.get(lic) : null) });
}

// Componentes nativos que o app leva dentro do APK.
items.push(
  { name: 'VOICEVOX CORE', version: '0.17.1', license: 'MIT', kind: 'native', text: intern(read('voicevox-core-LICENSE.txt')), url: 'https://github.com/VOICEVOX/voicevox_core' },
  { name: 'ONNX Runtime (build do VOICEVOX)', version: '', license: 'MIT', kind: 'native', text: intern(read('onnxruntime-LICENSE.txt')), url: 'https://github.com/microsoft/onnxruntime' },
  { name: 'Dicionário do Open JTalk (NAIST)', version: '1.11', license: 'BSD-3-Clause', kind: 'native', text: intern(read('open-jtalk-dic-COPYING.txt')), url: 'https://open-jtalk.sourceforge.net' },
  { name: 'Google ML Kit (reconhecimento de texto)', version: '', license: 'ML Kit Terms of Service', kind: 'native', text: null, url: 'https://developers.google.com/ml-kit/terms' },
);

const order = { native: 0, js: 1, android: 2 };
items.sort((a, b) => order[a.kind] - order[b.kind] || a.name.localeCompare(b.name));

const q = (v) => JSON.stringify(v);
const rows = items.map((i) => `  { name: ${q(i.name)}, version: ${q(i.version)}, license: ${q(i.license)}, kind: '${i.kind}', text: ${i.text ?? 'null'}${i.url ? `, url: ${q(i.url)}` : ''} },`).join('\n');
writeFileSync(
  join(root, 'src', 'content', 'openSource.ts'),
  `// Gerado por scripts/licenses/build.mjs (não edite à mão): licenças dos componentes de terceiros que o app distribui.
// Os termos do Google ML Kit e do Android SDK não são texto de licença livre e ficam como link (text: null).

export interface OpenSourceItem {
  name: string;
  version: string;
  license: string;
  /** js: pacote que entra no bundle; android: biblioteca Java/Kotlin do APK; native: componente nativo embutido. */
  kind: 'js' | 'android' | 'native';
  /** Índice em NOTICE_TEXTS, ou null quando a licença é só um link. */
  text: number | null;
  url?: string;
}

export const NOTICE_TEXTS: readonly string[] = ${q(texts)};

export const OPEN_SOURCE: readonly OpenSourceItem[] = [
${rows}
];
`,
);

// Avisos que acompanham o ONNX Runtime do VOICEVOX, em trechos (a tela os mostra aos poucos).
const notices = read('onnxruntime-third-party-notices.txt');
const chunks = [];
let current = '';
for (const block of notices.split(/\n{2,}/)) {
  if (current.length + block.length > 3500 && current) { chunks.push(current.trim()); current = ''; }
  current += `${block}\n\n`;
}
if (current.trim()) chunks.push(current.trim());
writeFileSync(
  join(root, 'src', 'content', 'openSourceOnnx.ts'),
  `// Gerado por scripts/licenses/build.mjs (não edite à mão): avisos de terceiros que acompanham o ONNX Runtime do VOICEVOX.\n\nexport const ONNX_NOTICES: readonly string[] = ${q(chunks)};\n`,
);

const by = (k) => items.filter((i) => i.kind === k).length;
console.log(`[licenses] ${items.length} componentes (js ${by('js')}, android ${by('android')}, nativos ${by('native')}); ${texts.length} textos; ${chunks.length} trechos do ONNX; sem arquivo de licença: ${noFile}; sem licença: ${unknown}`);
