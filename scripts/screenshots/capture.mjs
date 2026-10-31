// Capturas de tela do app pelo adb (emulador ou aparelho com o Moji Dojo instalado), uma por tela, por deep link.
//
// Uso:  node scripts/screenshots/capture.mjs [--out docs/screenshots/auto] [--font 1.5] [--serial emulator-5554] [--wait 2500]
//   --out     pasta de saída (padrão: docs/screenshots/auto)
//   --font    escala da fonte do sistema durante as capturas (ex.: 1.5 ou 2); volta ao valor anterior no fim
//   --serial  qual aparelho usar, quando há mais de um no `adb devices`
//   --wait    espera, em ms, entre abrir a tela e capturar (padrão 2500)
//
// O app precisa já ter passado da introdução. Para o emulador, gere o APK com gerar-apk-emulador.bat.
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

const { SCREENS, adbArgs } = createRequire(import.meta.url)('./screens.cjs');

const PACKAGE = 'com.edi.mojidojo';
function parseArgs(argv) {
  const args = { out: 'docs/screenshots/auto', font: null, serial: null, wait: 2500 };
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i]?.replace(/^--/, '');
    if (!(key in args) || argv[i + 1] === undefined) throw new Error(`Argumento desconhecido ou sem valor: ${argv[i]}`);
    args[key] = key === 'wait' ? Number(argv[i + 1]) : argv[i + 1];
  }
  return args;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const adb = (rest, options = {}) => execFileSync('adb', adbArgs(args.serial, rest), { encoding: options.binary ? null : 'utf8', maxBuffer: 64 * 1024 * 1024 });

  const devices = execFileSync('adb', ['devices'], { encoding: 'utf8' }).split('\n').slice(1).filter((l) => l.trim().endsWith('device'));
  if (devices.length === 0) throw new Error('Nenhum aparelho no `adb devices`. Abra o emulador ou conecte o celular.');
  if (devices.length > 1 && !args.serial) throw new Error('Há mais de um aparelho: use --serial <nome> (veja `adb devices`).');

  mkdirSync(args.out, { recursive: true });
  const previousFont = args.font ? adb(['shell', 'settings', 'get', 'system', 'font_scale']).trim() : null;
  if (args.font) adb(['shell', 'settings', 'put', 'system', 'font_scale', args.font]);

  try {
    const suffix = args.font ? `-fonte${args.font}` : '';
    for (const [name, route] of Object.entries(SCREENS)) {
      adb(['shell', 'am', 'start', '-a', 'android.intent.action.VIEW', '-d', `mojidojo://${route}`, PACKAGE]);
      await sleep(args.wait);
      const png = adb(['exec-out', 'screencap', '-p'], { binary: true });
      writeFileSync(join(args.out, `${name}${suffix}.png`), png);
      console.log(`ok  ${name}${suffix}.png`);
    }
  } finally {
    if (previousFont !== null) adb(['shell', 'settings', 'put', 'system', 'font_scale', previousFont === 'null' ? '1.0' : previousFont]);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
