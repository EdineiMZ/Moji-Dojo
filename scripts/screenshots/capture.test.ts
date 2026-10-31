// Este teste roda em Node, mas o projeto só carrega os tipos do Jest: declaramos só o que usamos.
declare const __dirname: string;
const { existsSync, readdirSync } = require('node:fs') as { existsSync(path: string): boolean; readdirSync(path: string): string[] };
const { join } = require('node:path') as { join(...parts: string[]): string };

import { adbArgs, SCREENS } from './screens.cjs';

describe('script de capturas do emulador', () => {
  it('cada rota tem uma tela em app/ (o grupo (tabs) não aparece na URL)', () => {
    
    const root = join(__dirname, '..', '..', 'app');
    const has = (route: string) => {
      if (route === '/') return existsSync(join(root, '(tabs)', 'index.tsx'));
      const name = route.slice(1);
      return existsSync(join(root, '(tabs)', `${name}.tsx`)) || existsSync(join(root, `${name}.tsx`)) || readdirSync(root).includes(name);
    };
    for (const route of Object.values(SCREENS)) expect({ route, found: has(route) }).toEqual({ route, found: true });
  });

  it('o adb escolhe o aparelho só quando há --serial', () => {
    
    expect(adbArgs(null, ['devices'])).toEqual(['devices']);
    expect(adbArgs('emulator-5554', ['shell', 'ls'])).toEqual(['-s', 'emulator-5554', 'shell', 'ls']);
  });
});
