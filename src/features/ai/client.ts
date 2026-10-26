import { buildHttpRequest, extractJson, parseErrorMessage, parseHttpReply, PROVIDERS, type AiProvider } from './providers';
import { usageToday, withinLimit, type AiSettings, type AiUsage } from './settings';

export type AiErrorCode = 'disabled' | 'no-key' | 'limit' | 'offline' | 'timeout' | 'auth' | 'rate' | 'server' | 'bad-response';

/** O que mostrar à pessoa em cada falha (em português, sem jargão). */
export const AI_ERROR_MESSAGES: Readonly<Record<AiErrorCode, string>> = {
  disabled: 'A IA está desligada em Ajustes → IA.',
  'no-key': 'Cadastre uma chave de API em Ajustes → IA para usar este recurso.',
  limit: 'Você chegou ao limite de pedidos à IA de hoje. Ajuste o limite em Ajustes → IA.',
  offline: 'Sem conexão com a internet. O resto do app continua funcionando offline.',
  timeout: 'A IA demorou demais para responder. Tente de novo.',
  auth: 'A chave de API foi recusada. Confira a chave e o provedor em Ajustes → IA.',
  rate: 'O provedor pediu para esperar um pouco (muitos pedidos ou cota acabou). Tente mais tarde.',
  server: 'O provedor da IA está com problema agora. Tente de novo em instantes.',
  'bad-response': 'A IA respondeu em um formato que o app não entendeu. Tente de novo.',
};

export class AiError extends Error {
  constructor(
    readonly code: AiErrorCode,
    detail = '',
  ) {
    super(detail ? `${AI_ERROR_MESSAGES[code]} (${detail})` : AI_ERROR_MESSAGES[code]);
    this.name = 'AiError';
  }
}

/** Tudo de fora de que o cliente precisa; nos testes é trocado por versões falsas. */
export interface AiDeps {
  fetch: (url: string, init: { method: 'POST'; headers: Record<string, string>; body: string; signal: AbortSignal }) => Promise<{ status: number; json: () => Promise<unknown> }>;
  getKey: (provider: AiProvider) => Promise<string | null>;
  settings: () => AiSettings;
  usage: () => AiUsage;
  recordUsage: (tokensIn: number, tokensOut: number) => void;
  getCache: (key: string) => unknown;
  putCache: (key: string, value: unknown) => void;
  now: () => number;
  timeoutMs: number;
}

export interface AskOptions<T> {
  /** Instruções fixas e o pedido desta vez. */
  system: string;
  user: string;
  maxTokens: number;
  /** Valida o JSON da resposta e devolve o resultado, ou null se não serve. */
  parse: (json: unknown) => T | null;
  /** Se informado, a resposta fica guardada e um pedido igual não gasta a IA de novo. */
  cacheKey?: string;
}

export const DEFAULT_TIMEOUT_MS = 60_000;

/** Pede à IA uma resposta em JSON e a valida. Qualquer falha vira um `AiError` com mensagem pronta. */
export async function askAi<T>(options: AskOptions<T>, deps: AiDeps): Promise<T> {
  const settings = deps.settings();
  if (!settings.enabled) throw new AiError('disabled');
  const provider = settings.provider;
  const key = await deps.getKey(provider);
  if (!key) throw new AiError('no-key');

  const cacheId = options.cacheKey ? `${provider}:${settings.models[provider]}:${options.cacheKey}` : null;
  if (cacheId) {
    const hit = deps.getCache(cacheId);
    if (hit !== undefined) {
      const parsed = options.parse(hit);
      if (parsed !== null) return parsed;
    }
  }

  const now = deps.now();
  if (!withinLimit(settings, deps.usage(), now)) throw new AiError('limit');

  const request = buildHttpRequest(provider, key, settings.models[provider] || PROVIDERS[provider].defaultModel, {
    system: options.system,
    user: options.user,
    maxTokens: options.maxTokens,
  });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), deps.timeoutMs);
  let status: number;
  let body: unknown;
  try {
    const response = await deps.fetch(request.url, { method: 'POST', headers: request.headers, body: request.body, signal: controller.signal });
    status = response.status;
    body = await response.json().catch(() => null);
  } catch (error) {
    throw new AiError(error instanceof Error && error.name === 'AbortError' ? 'timeout' : 'offline');
  } finally {
    clearTimeout(timer);
  }

  if (status < 200 || status >= 300) {
    const detail = parseErrorMessage(body);
    if (status === 401 || status === 403) throw new AiError('auth');
    // O Gemini responde 400 (e não 401) para chave inválida.
    if (status === 400 && /api key|api_key|credential/i.test(detail)) throw new AiError('auth');
    if (status === 429) throw new AiError('rate');
    throw new AiError('server', `${status}${detail ? `: ${detail}` : ''}`);
  }

  const reply = parseHttpReply(provider, body);
  if (!reply) throw new AiError('bad-response');
  // O pedido foi feito e custou tokens, mesmo que a resposta não sirva.
  deps.recordUsage(reply.tokensIn, reply.tokensOut);
  const json = extractJson(reply.text);
  const result = json === undefined ? null : options.parse(json);
  if (result === null) throw new AiError('bad-response');
  if (cacheId) deps.putCache(cacheId, json);
  return result;
}

/** Quantos pedidos ainda cabem hoje (Infinity se sem limite). */
export function callsLeft(settings: AiSettings, usage: AiUsage, now: number): number {
  return settings.dailyLimit === 0 ? Infinity : Math.max(0, settings.dailyLimit - usageToday(usage, now).calls);
}
