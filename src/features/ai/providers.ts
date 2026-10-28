/** Provedores de IA que o aluno pode usar com a própria chave. */
export type AiProvider = 'gemini' | 'claude' | 'openai' | 'custom';

export interface ProviderInfo {
  id: AiProvider;
  label: string;
  /** Modelo padrão: barato e rápido, de sobra para frases curtas. */
  defaultModel: string;
  /** Sugestões de modelo (o campo é livre: os nomes mudam com o tempo). */
  models: readonly string[];
  /** Onde criar a chave. */
  keyUrl: string;
}

export const PROVIDERS: Readonly<Record<AiProvider, ProviderInfo>> = {
  gemini: {
    id: 'gemini',
    label: 'Gemini (Google)',
    defaultModel: 'gemini-3.5-flash-lite',
    models: ['gemini-3.5-flash-lite', 'gemini-3.8-flash'],
    keyUrl: 'https://aistudio.google.com/apikey',
  },
  claude: {
    id: 'claude',
    label: 'Claude (Anthropic)',
    defaultModel: 'claude-haiku-5-5',
    models: ['claude-haiku-5-5', 'claude-sonnet-5-5'],
    keyUrl: 'https://platform.anthropic.com/settings/keys',
  },
  openai: {
    id: 'openai',
    label: 'GPT (OpenAI)',
    defaultModel: 'gpt-4.1-mini',
    models: ['gpt-4.1-mini', 'gpt-4.1'],
    keyUrl: 'https://platform.openai.com/api-keys',
  },
  custom: {
    id: 'custom',
    label: 'Servidor próprio (compatível com OpenAI)',
    defaultModel: 'local',
    models: [],
    keyUrl: '',
  },
};

export const PROVIDER_IDS: readonly AiProvider[] = ['gemini', 'claude', 'openai', 'custom'];

/**
 * O endereço de um servidor próprio (Ollama, LM Studio, llama.cpp...) vira a URL de "chat/completions": aceita o endereço
 * base ("http://192.168.0.10:11434/v1") ou já completo, com ou sem barra no fim.
 */
export function chatCompletionsUrl(base: string): string {
  const clean = base.trim().replace(/\/+$/, '');
  return /\/chat\/completions$/.test(clean) ? clean : `${clean}/chat/completions`;
}

export interface AiRequest {
  /** Instruções fixas (quem a IA é e o formato da resposta). */
  system: string;
  /** O pedido desta vez. */
  user: string;
  /** Teto de tokens da resposta. */
  maxTokens: number;
}

export interface HttpRequest {
  url: string;
  headers: Record<string, string>;
  body: string;
}

/** Monta a chamada HTTP de cada provedor. A resposta sempre deve ser um JSON em texto. */
export function buildHttpRequest(provider: AiProvider, key: string, model: string, request: AiRequest, baseUrl = ''): HttpRequest {
  if (provider === 'custom') {
    return {
      url: chatCompletionsUrl(baseUrl),
      // Servidor local costuma dispensar chave: o cabeçalho de autorização só vai se houver uma.
      headers: { 'content-type': 'application/json', ...(key ? { authorization: `Bearer ${key}` } : {}) },
      body: JSON.stringify({
        model,
        response_format: { type: 'json_object' },
        // "max_tokens" é o nome que todos os servidores compatíveis entendem.
        max_tokens: request.maxTokens,
        messages: [
          { role: 'system', content: request.system },
          { role: 'user', content: request.user },
        ],
      }),
    };
  }
  if (provider === 'gemini') {
    return {
      url: `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: request.system }] },
        contents: [{ role: 'user', parts: [{ text: request.user }] }],
        generationConfig: { responseMimeType: 'application/json', maxOutputTokens: request.maxTokens },
      }),
    };
  }
  if (provider === 'openai') {
    return {
      url: 'https://api.openai.com/v1/chat/completions',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        // O modo JSON da OpenAI exige a palavra JSON nas mensagens: as instruções do app sempre a trazem.
        response_format: { type: 'json_object' },
        max_completion_tokens: request.maxTokens,
        messages: [
          { role: 'system', content: request.system },
          { role: 'user', content: request.user },
        ],
      }),
    };
  }
  return {
    url: 'https://api.anthropic.com/v1/messages',
    headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model,
      max_tokens: request.maxTokens,
      system: request.system,
      // Sem "thinking" longo: são tarefas curtas e o esforço baixo gasta menos.
      output_config: { effort: 'low' },
      messages: [{ role: 'user', content: request.user }],
    }),
  };
}

export interface AiReply {
  text: string;
  tokensIn: number;
  tokensOut: number;
}

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const num = (v: unknown): number => (typeof v === 'number' && Number.isFinite(v) ? v : 0);

/** Lê o texto e o uso de tokens da resposta de cada provedor; null se a resposta não tem a forma esperada. */
export function parseHttpReply(provider: AiProvider, json: unknown): AiReply | null {
  if (!isRecord(json)) return null;
  if (provider === 'gemini') {
    const candidates = Array.isArray(json.candidates) ? json.candidates : [];
    const first = candidates[0];
    const parts = isRecord(first) && isRecord(first.content) && Array.isArray(first.content.parts) ? first.content.parts : [];
    const text = parts.map((p) => (isRecord(p) && typeof p.text === 'string' ? p.text : '')).join('');
    if (!text) return null;
    const usage = isRecord(json.usageMetadata) ? json.usageMetadata : {};
    return { text, tokensIn: num(usage.promptTokenCount), tokensOut: num(usage.candidatesTokenCount) };
  }
  if (provider === 'openai' || provider === 'custom') {
    const choices = Array.isArray(json.choices) ? json.choices : [];
    const first = choices[0];
    const content = isRecord(first) && isRecord(first.message) ? first.message.content : undefined;
    if (typeof content !== 'string' || !content) return null;
    const usage = isRecord(json.usage) ? json.usage : {};
    return { text: content, tokensIn: num(usage.prompt_tokens), tokensOut: num(usage.completion_tokens) };
  }
  const blocks = Array.isArray(json.content) ? json.content : [];
  // Blocos de pensamento vêm junto: só o texto interessa.
  const text = blocks.map((b) => (isRecord(b) && b.type === 'text' && typeof b.text === 'string' ? b.text : '')).join('');
  if (!text) return null;
  const usage = isRecord(json.usage) ? json.usage : {};
  return { text, tokensIn: num(usage.input_tokens), tokensOut: num(usage.output_tokens) };
}

/** A mensagem de erro que o provedor mandou, se houver (para mostrar quando algo falha). */
export function parseErrorMessage(json: unknown): string {
  if (!isRecord(json)) return '';
  const error = json.error;
  if (isRecord(error) && typeof error.message === 'string') return error.message.slice(0, 200);
  return '';
}

/**
 * Extrai o JSON de um texto que pode vir dentro de ``` ou com conversa em volta (alguns modelos fazem isso mesmo
 * quando pedimos só o JSON). Devolve undefined se não achar um JSON válido.
 */
export function extractJson(text: string): unknown {
  const trimmed = text.trim();
  const candidates = [trimmed];
  const fenced = /```(?:json)?\s*([\s\S]*?)```/i.exec(trimmed);
  if (fenced?.[1]) candidates.push(fenced[1].trim());
  const open = trimmed.search(/[{[]/);
  const close = Math.max(trimmed.lastIndexOf('}'), trimmed.lastIndexOf(']'));
  if (open >= 0 && close > open) candidates.push(trimmed.slice(open, close + 1));
  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate) as unknown;
    } catch {
      // tenta o próximo formato
    }
  }
  return undefined;
}
