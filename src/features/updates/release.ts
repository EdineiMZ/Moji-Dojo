/** Repositório público de onde saem as versões do app. */
export const REPO = 'EdineiMZ/Moji-Dojo';
export const LATEST_RELEASE_API = `https://api.github.com/repos/${REPO}/releases/latest`;
export const RELEASES_PAGE = `https://github.com/${REPO}/releases/latest`;

/** Só abrimos endereços do próprio repositório: o texto da release vem da rede e não é confiável. */
const TRUSTED_PREFIX = `https://github.com/${REPO}/`;
const FETCH_TIMEOUT_MS = 8000;

export interface ReleaseInfo {
  /** Versão sem o "v" (ex.: "2.46.0"). */
  version: string;
  /** Página da release no GitHub. */
  pageUrl: string;
  /** Link direto do APK, se a release tem um. */
  apkUrl: string | null;
  /** Notas da versão (texto simples, cortado). */
  notes: string;
}

export type UpdateResult =
  | { status: 'newer'; release: ReleaseInfo }
  /** A versão instalada é a mais nova (ou mais nova que a publicada). */
  | { status: 'current' }
  /** Ainda não há release publicada (a API responde 404). Não é erro. */
  | { status: 'none' }
  | { status: 'error' };

/** "v2.46.0" → [2, 46, 0]. Aceita "2.46" e ignora sufixos como "-beta". Devolve null se não parecer uma versão. */
export function parseVersion(text: unknown): [number, number, number] | null {
  if (typeof text !== 'string') return null;
  const match = /^v?(\d{1,4})\.(\d{1,4})(?:\.(\d{1,4}))?(?:[-+].*)?$/.exec(text.trim());
  if (!match) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3] ?? 0)];
}

/** A versão `remote` é estritamente mais nova que `local`? Texto inválido nunca conta como mais novo. */
export function isNewer(remote: string, local: string): boolean {
  const r = parseVersion(remote);
  const l = parseVersion(local);
  if (!r || !l) return false;
  if (r[0] !== l[0]) return r[0] > l[0];
  if (r[1] !== l[1]) return r[1] > l[1];
  return r[2] > l[2];
}

const isTrusted = (url: unknown): url is string => typeof url === 'string' && url.startsWith(TRUSTED_PREFIX);

/** Lê a resposta de `/releases/latest`. Devolve null para rascunho, pré-lançamento ou formato inesperado. */
export function parseRelease(json: unknown): ReleaseInfo | null {
  if (typeof json !== 'object' || json === null) return null;
  const data = json as Record<string, unknown>;
  if (data.draft === true || data.prerelease === true) return null;
  const parsed = parseVersion(data.tag_name);
  if (!parsed) return null;
  const pageUrl = isTrusted(data.html_url) ? data.html_url : RELEASES_PAGE;
  const assets = Array.isArray(data.assets) ? data.assets : [];
  // O APK principal é o arm64 (MojiDojo-<versão>.apk); o de 32 bits tem "32bits" no nome.
  const apks = assets
    .filter((a): a is Record<string, unknown> => typeof a === 'object' && a !== null)
    .filter((a) => typeof a.name === 'string' && /\.apk$/i.test(a.name) && isTrusted(a.browser_download_url));
  const main = apks.find((a) => !/32bits/i.test(String(a.name))) ?? apks[0];
  const notes = typeof data.body === 'string' ? data.body.trim().slice(0, 600) : '';
  return { version: parsed.join('.'), pageUrl, apkUrl: main ? String(main.browser_download_url) : null, notes };
}

export interface UpdateDeps {
  fetch: (url: string, init?: { headers?: Record<string, string>; signal?: AbortSignal }) => Promise<{ ok: boolean; status: number; json: () => Promise<unknown> }>;
}

/**
 * Pergunta ao GitHub qual é a última release. Não envia nada da pessoa (nem a versão instalada): é um GET anônimo.
 * Qualquer falha de rede vira `error`; a ausência de release (404) vira `none`.
 */
export async function checkForUpdate(current: string, deps: UpdateDeps = { fetch: (url, init) => fetch(url, init) }): Promise<UpdateResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await deps.fetch(LATEST_RELEASE_API, { headers: { Accept: 'application/vnd.github+json' }, signal: controller.signal });
    if (response.status === 404) return { status: 'none' };
    if (!response.ok) return { status: 'error' };
    const release = parseRelease(await response.json());
    if (!release) return { status: 'error' };
    return isNewer(release.version, current) ? { status: 'newer', release } : { status: 'current' };
  } catch {
    return { status: 'error' };
  } finally {
    clearTimeout(timer);
  }
}
