// Prepara o VOICEVOX CORE para o app Android (uso pessoal). Uso:
//   node scripts/voicevox/setup.mjs libs      → só o AAR do VOICEVOX CORE (sem perguntas; o gerar-apk.bat chama sozinho)
//   node scripts/voicevox/setup.mjs assets    → ONNX Runtime e dicionário pelo downloader OFICIAL, que mostra os termos
//                                               de uso e pergunta se você aceita (responda no terminal)
//
// As vozes (.vvm) NÃO entram no APK: a pessoa baixa as que quiser dentro do app (Ajustes → Voz de anime), direto da
// release oficial. O catálogo delas é gerado por `npm run voicevox:catalog`.
// Nada disso vai para o git (ver .gitignore): são binários grandes e têm termos de uso próprios.
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync, createWriteStream } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const VERSION = '0.17.1';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const moduleDir = join(root, 'modules', 'voicevox', 'android');
const vendor = join(root, 'vendor', 'voicevox');
const release = `https://github.com/VOICEVOX/voicevox_core/releases/download/${VERSION}`;

const args = process.argv.slice(2);
const command = args.find((a) => !a.startsWith('--')) ?? 'all';

function log(message) {
  console.log(`[voicevox] ${message}`);
}

async function download(url, target) {
  mkdirSync(dirname(target), { recursive: true });
  const response = await fetch(url, { redirect: 'follow' });
  if (!response.ok || !response.body) throw new Error(`Falha ao baixar ${url}: ${response.status}`);
  await pipeline(Readable.fromWeb(response.body), createWriteStream(target));
}

function run(file, fileArgs, options = {}) {
  const result = spawnSync(file, fileArgs, { stdio: 'inherit', ...options });
  if (result.status !== 0) throw new Error(`${file} terminou com erro (${result.status ?? result.error?.message}).`);
}

/** O AAR do VOICEVOX CORE, num repositório Maven local que o Gradle do módulo enxerga. */
async function libs() {
  const mavenDir = join(moduleDir, 'maven');
  const marker = join(mavenDir, 'jp', 'hiroshiba', 'voicevoxcore', 'voicevoxcore-android', VERSION, `voicevoxcore-android-${VERSION}.aar`);
  if (existsSync(marker)) {
    log('AAR do VOICEVOX CORE já está no lugar.');
    return;
  }
  const zip = join(vendor, `java_packages-${VERSION}.zip`);
  log(`Baixando java_packages.zip (${VERSION})...`);
  await download(`${release}/java_packages.zip`, zip);
  mkdirSync(mavenDir, { recursive: true });
  if (process.platform === 'win32') {
    run('powershell', ['-NoProfile', '-Command', `Expand-Archive -LiteralPath '${zip}' -DestinationPath '${mavenDir}' -Force`]);
  } else {
    run('unzip', ['-o', '-q', zip, '-d', mavenDir]);
  }
  if (!existsSync(marker)) throw new Error('O pacote baixado não trouxe o AAR esperado.');
  log('AAR instalado em modules/voicevox/android/maven.');
}

function downloaderName() {
  const arch = process.arch === 'arm64' ? 'arm64' : 'x64';
  if (process.platform === 'win32') return 'download-windows-x64.exe';
  if (process.platform === 'darwin') return `download-osx-${arch}`;
  return `download-linux-${arch}`;
}

function listFiles(dir, predicate) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...listFiles(full, predicate));
    else if (predicate(full)) out.push(full);
  }
  return out;
}

function copyInto(files, destination) {
  mkdirSync(destination, { recursive: true });
  for (const file of files) copyFileSync(file, join(destination, file.split(/[\\/]/).pop()));
}

/** ONNX Runtime e dicionário pelo downloader oficial, que pede o aceite dos termos. */
function assets() {
  const downloader = join(vendor, downloaderName());
  const files = join(vendor, 'files');
  return (async () => {
    if (!existsSync(downloader)) {
      log('Baixando o downloader oficial do VOICEVOX...');
      await download(`${release}/${downloaderName()}`, downloader);
      if (process.platform !== 'win32') run('chmod', ['+x', downloader]);
    }
    rmSync(files, { recursive: true, force: true });
    log('Leia os termos que vão aparecer e responda y para aceitar.');
    run(downloader, ['--only', 'onnxruntime', 'dict', '--os', 'android', '--cpu-arch', 'arm64', '-o', files]);

    const assetsDir = join(moduleDir, 'src', 'main', 'assets', 'voicevox');
    rmSync(assetsDir, { recursive: true, force: true });
    const dictSys = listFiles(join(files, 'dict'), (f) => f.endsWith('sys.dic'));
    if (dictSys.length === 0) throw new Error('O dicionário do Open JTalk não veio no download.');
    const dictRoot = dirname(dictSys[0]);
    copyInto(listFiles(dictRoot, () => true), join(assetsDir, 'dict', 'open_jtalk_dic'));

    const jni = join(moduleDir, 'src', 'main', 'jniLibs', 'arm64-v8a');
    rmSync(jni, { recursive: true, force: true });
    const so = listFiles(join(files, 'onnxruntime'), (f) => /\.so(\.\d+)*$/.test(f) && !f.includes('.dSYM'));
    if (so.length === 0) throw new Error('A biblioteca ONNX Runtime para Android não veio no download.');
    copyInto(so, jni);

    // Os termos do downloader ficam junto, para consulta.
    writeFileSync(join(assetsDir, 'LEIA-ME.txt'), `VOICEVOX CORE ${VERSION}. Motor e dicionário; as vozes são baixadas dentro do app.\nCréditos: "VOICEVOX:<nome do personagem>". Termos: https://voicevox.hiroshiba.jp/term/\n`);
    log(`Pronto: dicionário e ${so.length} biblioteca(s) ONNX. Gere o APK de novo (gerar-apk.bat).`);
  })();
}

try {
  if (command === 'libs' || command === 'all') await libs();
  if (command === 'assets' || command === 'all') await assets();
  if (!['libs', 'assets', 'all'].includes(command)) throw new Error(`Comando desconhecido: ${command}`);
} catch (error) {
  console.error(`[voicevox] ERRO: ${error.message}`);
  process.exit(1);
}
