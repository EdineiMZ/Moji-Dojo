// Este teste roda em Node, mas o projeto só carrega os tipos do Jest: declaramos só o que usamos.
declare const __dirname: string;
const fs = require('node:fs') as { readFileSync(file: string, encoding: 'utf8'): string };
const path = require('node:path') as { resolve(...parts: string[]): string; join(...parts: string[]): string };
const v = require('./versioning.cjs') as typeof import('./versioning');

const ROOT = path.resolve(__dirname, '..');
const read = (name: string) => fs.readFileSync(path.join(ROOT, name), 'utf8');
const json = (name: string) => JSON.parse(read(name)) as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

describe('regras de versão', () => {
  it('aumenta a versão por tipo e zera o que vem depois', () => {
    expect(v.bumpVersion('1.2.3', 'patch')).toBe('1.2.4');
    expect(v.bumpVersion('1.2.3', 'minor')).toBe('1.3.0');
    expect(v.bumpVersion('1.2.3', 'major')).toBe('2.0.0');
  });

  it('recusa versão e tipo inválidos', () => {
    expect(() => v.parseVersion('1.2')).toThrow();
    expect(() => v.parseVersion('v1.2.3')).toThrow();
    expect(() => v.bumpVersion('1.2.3', 'grande')).toThrow();
  });

  it('o versionCode cresce a cada versão (senão o Android recusa a atualização)', () => {
    const sequence = ['1.0.0', '1.0.1', '1.0.9', '1.1.0', '1.9.9', '2.0.0'];
    const codes = sequence.map(v.versionCode);
    expect(codes).toEqual([...codes].sort((a, b) => a - b));
    expect(new Set(codes).size).toBe(codes.length);
    expect(v.versionCode('1.1.0')).toBe(10100);
    expect(() => v.versionCode('1.100.0')).toThrow();
  });

  it('o APK se chama nome + versão', () => {
    expect(v.apkName('1.1.0')).toBe('MojiDojo-1.1.0.apk');
  });

  it('o changelog precisa ter a entrada da versão, escrita', () => {
    const base = '# Changelog\n\n## [1.1.0] - 2026-10-22\n\n- algo\n\n## [1.0.0] - 2026-10-01\n\n- antes\n';
    expect(v.changelogProblems(base, '1.1.0')).toEqual([]);
    expect(v.changelogProblems(base, '1.2.0')).toHaveLength(1); // versão nova sem entrada
    expect(v.changelogProblems('# Changelog\n', '1.0.0')).toHaveLength(1);
    const withPlaceholder = v.addChangelogEntry(base, '1.2.0', '2026-11-01');
    expect(withPlaceholder.indexOf('## [1.2.0]')).toBeLessThan(withPlaceholder.indexOf('## [1.1.0]'));
    expect(v.changelogProblems(withPlaceholder, '1.2.0')).toHaveLength(1); // entrada ainda provisória
    expect(v.changelogProblems(withPlaceholder, '1.1.0')).toHaveLength(1); // e a 1.1.0 deixou de ser a mais recente
  });
});

describe('versão do projeto (falha se algo ficar fora de sincronia)', () => {
  const version = json('app.json').expo.version as string;

  it('package.json e package-lock.json usam a mesma versão do app.json', () => {
    expect(json('package.json').version).toBe(version);
    const lock = json('package-lock.json');
    expect(lock.version).toBe(version);
    expect(lock.packages[''].version).toBe(version);
  });

  it('o android.versionCode bate com a versão (rode "npm run version:sync")', () => {
    expect(json('app.json').expo.android.versionCode).toBe(v.versionCode(version));
  });

  it('o CHANGELOG.md tem a entrada desta versão como a mais recente, já escrita', () => {
    expect(v.changelogProblems(read('CHANGELOG.md'), version)).toEqual([]);
  });
});
