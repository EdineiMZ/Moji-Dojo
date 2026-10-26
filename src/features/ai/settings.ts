import { PROVIDERS, PROVIDER_IDS, type AiProvider } from './providers';

/** Preferências da IA (a chave NÃO fica aqui: vai para o armazenamento seguro do aparelho e fora do backup). */
export interface AiSettings {
  /** Interruptor geral: desligado, nenhum recurso de IA aparece ou funciona. */
  enabled: boolean;
  provider: AiProvider;
  /** Modelo de cada provedor (campo livre, para acompanhar os nomes novos). */
  models: Readonly<Record<AiProvider, string>>;
  /** Pedidos à IA por dia (0 = sem limite). */
  dailyLimit: number;
}

export const LIMIT_OPTIONS: readonly number[] = [10, 30, 60, 0];

export const DEFAULT_AI: AiSettings = {
  enabled: true,
  provider: 'gemini',
  models: { gemini: PROVIDERS.gemini.defaultModel, claude: PROVIDERS.claude.defaultModel },
  dailyLimit: 30,
};

export const limitLabel = (n: number): string => (n === 0 ? 'Sem limite' : `${n} por dia`);

const MAX_MODEL_LENGTH = 80;

/** Lê o que veio do disco; o que não tem a forma certa volta ao padrão. */
export function sanitizeAi(raw: unknown): AiSettings {
  const r = typeof raw === 'object' && raw !== null ? (raw as Record<string, unknown>) : {};
  const provider = PROVIDER_IDS.find((p) => p === r.provider) ?? DEFAULT_AI.provider;
  const rawModels = typeof r.models === 'object' && r.models !== null ? (r.models as Record<string, unknown>) : {};
  const model = (id: AiProvider): string => {
    const value = rawModels[id];
    return typeof value === 'string' && /^[\w.:-]+$/.test(value.trim()) && value.trim().length <= MAX_MODEL_LENGTH ? value.trim() : PROVIDERS[id].defaultModel;
  };
  return {
    enabled: typeof r.enabled === 'boolean' ? r.enabled : DEFAULT_AI.enabled,
    provider,
    models: { gemini: model('gemini'), claude: model('claude') },
    dailyLimit: typeof r.dailyLimit === 'number' && LIMIT_OPTIONS.includes(r.dailyLimit) ? r.dailyLimit : DEFAULT_AI.dailyLimit,
  };
}

/** Uso do dia (só neste aparelho): quantos pedidos e tokens. */
export interface AiUsage {
  /** Dia no formato AAAA-MM-DD, no fuso do aparelho. */
  day: string;
  calls: number;
  tokensIn: number;
  tokensOut: number;
}

export const EMPTY_USAGE: AiUsage = { day: '', calls: 0, tokensIn: 0, tokensOut: 0 };

export const dayKey = (now: number): string => {
  const d = new Date(now);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const count = (v: unknown): number => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0);

export function sanitizeUsage(raw: unknown): AiUsage {
  const r = typeof raw === 'object' && raw !== null ? (raw as Record<string, unknown>) : {};
  return {
    day: typeof r.day === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(r.day) ? r.day : '',
    calls: count(r.calls),
    tokensIn: count(r.tokensIn),
    tokensOut: count(r.tokensOut),
  };
}

/** O uso de hoje (zerado se o registro é de outro dia). */
export const usageToday = (usage: AiUsage, now: number): AiUsage => (usage.day === dayKey(now) ? usage : { ...EMPTY_USAGE, day: dayKey(now) });

/** Soma um pedido ao uso do dia. */
export function addUsage(usage: AiUsage, now: number, tokensIn: number, tokensOut: number): AiUsage {
  const today = usageToday(usage, now);
  return { day: today.day, calls: today.calls + 1, tokensIn: today.tokensIn + count(tokensIn), tokensOut: today.tokensOut + count(tokensOut) };
}

/** Ainda cabe um pedido hoje? */
export const withinLimit = (settings: AiSettings, usage: AiUsage, now: number): boolean => settings.dailyLimit === 0 || usageToday(usage, now).calls < settings.dailyLimit;
