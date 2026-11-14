import { CHECK_INTERVAL_MS, DEFAULT_UPDATES, isCheckDue, sanitizeUpdates } from './settings';
import { checkForUpdate, isNewer, LATEST_RELEASE_API, parseRelease, parseVersion, type UpdateDeps } from './release';

const BASE = 'https://github.com/EdineiMZ/Moji-Dojo';
const release = (extra: Record<string, unknown> = {}) => ({
  tag_name: 'v2.46.0',
  html_url: `${BASE}/releases/tag/v2.46.0`,
  body: 'Notas',
  draft: false,
  prerelease: false,
  assets: [
    { name: 'MojiDojo-2.46.0-32bits.apk', browser_download_url: `${BASE}/releases/download/v2.46.0/MojiDojo-2.46.0-32bits.apk` },
    { name: 'MojiDojo-2.46.0.apk', browser_download_url: `${BASE}/releases/download/v2.46.0/MojiDojo-2.46.0.apk` },
  ],
  ...extra,
});
const reply = (status: number, body?: unknown): UpdateDeps => ({ fetch: async () => ({ ok: status >= 200 && status < 300, status, json: async () => body }) });

describe('versões', () => {
  it('lê tags com e sem v e ignora sufixos', () => {
    expect(parseVersion('v2.46.0')).toEqual([2, 46, 0]);
    expect(parseVersion('2.9')).toEqual([2, 9, 0]);
    expect(parseVersion('v3.0.1-beta.2')).toEqual([3, 0, 1]);
    expect(parseVersion('latest')).toBeNull();
    expect(parseVersion(undefined)).toBeNull();
  });
  it('compara número a número, não como texto', () => {
    expect(isNewer('2.46.0', '2.45.0')).toBe(true);
    expect(isNewer('2.10.0', '2.9.9')).toBe(true);
    expect(isNewer('2.45.0', '2.45.0')).toBe(false);
    expect(isNewer('2.44.9', '2.45.0')).toBe(false);
    expect(isNewer('3.0.0', '2.99.99')).toBe(true);
    expect(isNewer('lixo', '2.45.0')).toBe(false);
  });
});

describe('parseRelease', () => {
  it('pega o APK principal e não o de 32 bits', () => {
    const r = parseRelease(release());
    expect(r?.version).toBe('2.46.0');
    expect(r?.apkUrl).toBe(`${BASE}/releases/download/v2.46.0/MojiDojo-2.46.0.apk`);
    expect(r?.pageUrl).toBe(`${BASE}/releases/tag/v2.46.0`);
  });
  it('descarta rascunho, pré-lançamento e formato estranho', () => {
    expect(parseRelease(release({ draft: true }))).toBeNull();
    expect(parseRelease(release({ prerelease: true }))).toBeNull();
    expect(parseRelease(release({ tag_name: 'nightly' }))).toBeNull();
    expect(parseRelease(null)).toBeNull();
    expect(parseRelease('x')).toBeNull();
  });
  it('não abre endereço de fora do repositório', () => {
    const r = parseRelease(
      release({ html_url: 'https://evil.example/x', assets: [{ name: 'a.apk', browser_download_url: 'https://evil.example/a.apk' }] }),
    );
    expect(r?.pageUrl).toBe(`${BASE}/releases/latest`);
    expect(r?.apkUrl).toBeNull();
  });
  it('corta notas enormes', () => {
    expect(parseRelease(release({ body: 'a'.repeat(5000) }))?.notes.length).toBe(600);
  });
});

describe('checkForUpdate', () => {
  it('avisa quando a release é mais nova', async () => {
    const r = await checkForUpdate('2.45.0', reply(200, release()));
    expect(r.status).toBe('newer');
  });
  it('diz "atual" quando a versão é a mesma ou mais nova', async () => {
    expect((await checkForUpdate('2.46.0', reply(200, release()))).status).toBe('current');
    expect((await checkForUpdate('2.47.0', reply(200, release()))).status).toBe('current');
  });
  it('trata 404 como "sem release", não como erro', async () => {
    expect((await checkForUpdate('2.45.0', reply(404))).status).toBe('none');
  });
  it('trata 500, corpo inválido e falha de rede como erro', async () => {
    expect((await checkForUpdate('2.45.0', reply(500))).status).toBe('error');
    expect((await checkForUpdate('2.45.0', reply(200, { tag_name: 'x' }))).status).toBe('error');
    expect((await checkForUpdate('2.45.0', { fetch: async () => Promise.reject(new Error('offline')) })).status).toBe('error');
  });
  it('pergunta só o endereço oficial, sem enviar dados da pessoa', async () => {
    const calls: { url: string; init?: unknown }[] = [];
    await checkForUpdate('2.45.0', { fetch: async (url, init) => (calls.push({ url, init }), { ok: false, status: 404, json: async () => null }) });
    expect(calls).toHaveLength(1);
    expect(calls[0]?.url).toBe(LATEST_RELEASE_API);
    expect(JSON.stringify(calls[0]?.init)).not.toMatch(/2\.45\.0|body|Authorization/i);
  });
});

describe('configuração da checagem', () => {
  it('vem ligada e nunca consultou', () => {
    expect(DEFAULT_UPDATES).toEqual({ autoCheck: true, lastCheckAt: 0, dismissed: null });
    expect(isCheckDue(DEFAULT_UPDATES, 1000)).toBe(true);
  });
  it('espera um dia entre consultas e aceita o relógio voltando', () => {
    const s = { ...DEFAULT_UPDATES, lastCheckAt: 1_000_000 };
    expect(isCheckDue(s, 1_000_000 + CHECK_INTERVAL_MS - 1)).toBe(false);
    expect(isCheckDue(s, 1_000_000 + CHECK_INTERVAL_MS)).toBe(true);
    expect(isCheckDue(s, 500)).toBe(true);
  });
  it('desligada, nunca consulta sozinha', () => {
    expect(isCheckDue({ ...DEFAULT_UPDATES, autoCheck: false }, Date.now())).toBe(false);
  });
  it('limpa lixo vindo do disco', () => {
    expect(sanitizeUpdates({ autoCheck: 'sim', lastCheckAt: -4, dismissed: 7 })).toEqual(DEFAULT_UPDATES);
    expect(sanitizeUpdates(undefined)).toEqual(DEFAULT_UPDATES);
    expect(sanitizeUpdates({ autoCheck: false, lastCheckAt: 5, dismissed: '2.46.0' })).toEqual({ autoCheck: false, lastCheckAt: 5, dismissed: '2.46.0' });
  });
});
