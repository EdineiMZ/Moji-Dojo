import { exportBackup } from '@/features/backup/backup';
import { EMPTY_TYPING } from '@/features/keyboard/typingStats';
import { emptyJourney } from '@/features/journey/journey';
import { createAiStore, mergePhrases, trimCache, type AiPhrase } from './aiStore';
import { AiError, askAi, callsLeft, type AiDeps } from './client';
import { buildHttpRequest, extractJson, parseErrorMessage, parseHttpReply } from './providers';
import { addUsage, dayKey, DEFAULT_AI, EMPTY_USAGE, sanitizeAi, sanitizeUsage, usageToday, withinLimit } from './settings';

const NOW = new Date(2026, 9, 26, 12).getTime();

describe('provedores', () => {
  const req = { system: 'sys', user: 'oi', maxTokens: 100 };

  it('monta a chamada do Gemini com a chave no cabeçalho, não na URL', () => {
    const http = buildHttpRequest('gemini', 'KEY123', 'gemini-3.5-flash-lite', req);
    expect(http.url).toBe('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent');
    expect(http.url).not.toContain('KEY123');
    expect(http.headers['x-goog-api-key']).toBe('KEY123');
    const body = JSON.parse(http.body);
    expect(body.generationConfig).toMatchObject({ responseMimeType: 'application/json', maxOutputTokens: 100 });
    expect(body.systemInstruction.parts[0].text).toBe('sys');
    expect(body.contents[0].parts[0].text).toBe('oi');
  });

  it('monta a chamada do Claude sem temperatura nem prefill', () => {
    const http = buildHttpRequest('claude', 'KEY123', 'claude-haiku-5-5', req);
    expect(http.url).toBe('https://api.anthropic.com/v1/messages');
    expect(http.headers).toMatchObject({ 'x-api-key': 'KEY123', 'anthropic-version': '2023-06-01' });
    const body = JSON.parse(http.body);
    expect(body).toMatchObject({ model: 'claude-haiku-5-5', max_tokens: 100, system: 'sys', output_config: { effort: 'low' } });
    expect(body.temperature).toBeUndefined();
    expect(body.messages).toEqual([{ role: 'user', content: 'oi' }]);
  });

  it('lê o texto e o uso das respostas dos dois provedores', () => {
    expect(parseHttpReply('gemini', { candidates: [{ content: { parts: [{ text: '{"a":' }, { text: '1}' }] } }], usageMetadata: { promptTokenCount: 5, candidatesTokenCount: 7 } })).toEqual({
      text: '{"a":1}',
      tokensIn: 5,
      tokensOut: 7,
    });
    expect(parseHttpReply('claude', { content: [{ type: 'thinking', thinking: '' }, { type: 'text', text: '{"a":1}' }], usage: { input_tokens: 3, output_tokens: 4 } })).toEqual({
      text: '{"a":1}',
      tokensIn: 3,
      tokensOut: 4,
    });
    expect(parseHttpReply('gemini', { candidates: [] })).toBeNull();
    expect(parseHttpReply('claude', { content: [{ type: 'thinking' }] })).toBeNull();
    expect(parseHttpReply('claude', 'x')).toBeNull();
  });

  it('extrai o JSON mesmo com cerca de código ou conversa em volta', () => {
    expect(extractJson('{"a":1}')).toEqual({ a: 1 });
    expect(extractJson('```json\n{"a":1}\n```')).toEqual({ a: 1 });
    expect(extractJson('Claro! Aqui está: {"a":[1,2]} Espero ajudar.')).toEqual({ a: [1, 2] });
    expect(extractJson('sem json')).toBeUndefined();
  });

  it('lê a mensagem de erro do provedor', () => {
    expect(parseErrorMessage({ error: { message: 'API key not valid' } })).toBe('API key not valid');
    expect(parseErrorMessage(null)).toBe('');
  });
});

describe('configurações e uso', () => {
  it('lê configurações ruins sem quebrar e mantém o padrão', () => {
    expect(sanitizeAi(undefined)).toEqual(DEFAULT_AI);
    const clean = sanitizeAi({ enabled: 'sim', provider: 'gpt', models: { gemini: 'bad model!', claude: 'claude-sonnet-5-5' }, dailyLimit: 7 });
    expect(clean).toEqual({ ...DEFAULT_AI, models: { ...DEFAULT_AI.models, claude: 'claude-sonnet-5-5' } });
    expect(sanitizeAi({ provider: 'claude', dailyLimit: 0 })).toMatchObject({ provider: 'claude', dailyLimit: 0 });
  });

  it('conta o uso por dia e respeita o limite', () => {
    let usage = addUsage(EMPTY_USAGE, NOW, 10, 20);
    usage = addUsage(usage, NOW, 5, 5);
    expect(usage).toEqual({ day: dayKey(NOW), calls: 2, tokensIn: 15, tokensOut: 25 });
    expect(usageToday(usage, NOW + 24 * 3600 * 1000).calls).toBe(0);
    expect(withinLimit({ ...DEFAULT_AI, dailyLimit: 2 }, usage, NOW)).toBe(false);
    expect(withinLimit({ ...DEFAULT_AI, dailyLimit: 0 }, usage, NOW)).toBe(true);
    expect(callsLeft({ ...DEFAULT_AI, dailyLimit: 10 }, usage, NOW)).toBe(8);
    expect(sanitizeUsage({ day: 'x', calls: -1 })).toEqual(EMPTY_USAGE);
  });
});

describe('askAi', () => {
  const parseOk = (json: unknown) => (typeof json === 'object' && json !== null && 'v' in json ? (json as { v: number }).v : null);

  const make = (overrides: Partial<AiDeps> = {}) => {
    const cache = new Map<string, unknown>();
    const usage = { tokensIn: 0, tokensOut: 0, calls: 0 };
    const fetchMock = jest.fn(async () => ({
      status: 200,
      json: async () => ({ candidates: [{ content: { parts: [{ text: '{"v": 42}' }] } }], usageMetadata: { promptTokenCount: 4, candidatesTokenCount: 6 } }),
    }));
    const deps: AiDeps = {
      fetch: fetchMock,
      getKey: async () => 'KEY',
      settings: () => DEFAULT_AI,
      usage: () => ({ ...EMPTY_USAGE, day: dayKey(NOW), calls: usage.calls }),
      recordUsage: (i, o) => {
        usage.calls++;
        usage.tokensIn += i;
        usage.tokensOut += o;
      },
      getCache: (k) => cache.get(k),
      putCache: (k, v) => void cache.set(k, v),
      now: () => NOW,
      timeoutMs: 1000,
      ...overrides,
    };
    return { deps, usage, fetchMock, cache };
  };
  const options = { system: 's', user: 'u', maxTokens: 10, parse: parseOk };

  it('devolve o resultado validado e conta o uso', async () => {
    const { deps, usage } = make();
    await expect(askAi(options, deps)).resolves.toBe(42);
    expect(usage).toEqual({ calls: 1, tokensIn: 4, tokensOut: 6 });
  });

  it('um pedido repetido vem do cache e não gasta a IA', async () => {
    const { deps, fetchMock, usage } = make();
    const cached = { ...options, cacheKey: 'k1' };
    await askAi(cached, deps);
    await askAi(cached, deps);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(usage.calls).toBe(1);
  });

  const code = async (p: Promise<unknown>) => (await p.then(() => null, (e: unknown) => (e instanceof AiError ? e.code : 'other')));

  it('recusa sem chave, desligada ou acima do limite, antes de chamar a rede', async () => {
    const noKey = make({ getKey: async () => null });
    expect(await code(askAi(options, noKey.deps))).toBe('no-key');
    const off = make({ settings: () => ({ ...DEFAULT_AI, enabled: false }) });
    expect(await code(askAi(options, off.deps))).toBe('disabled');
    const full = make({ usage: () => ({ ...EMPTY_USAGE, day: dayKey(NOW), calls: 30 }) });
    expect(await code(askAi(options, full.deps))).toBe('limit');
    expect(noKey.fetchMock).not.toHaveBeenCalled();
    expect(full.fetchMock).not.toHaveBeenCalled();
  });

  it('traduz as falhas de rede e de HTTP em códigos claros', async () => {
    const status = (s: number, body: unknown = {}) => make({ fetch: async () => ({ status: s, json: async () => body }) }).deps;
    expect(await code(askAi(options, status(401)))).toBe('auth');
    expect(await code(askAi(options, status(400, { error: { message: 'API key not valid. Please pass a valid API key.' } })))).toBe('auth');
    expect(await code(askAi(options, status(400, { error: { message: 'bad schema' } })))).toBe('server');
    expect(await code(askAi(options, status(429)))).toBe('rate');
    expect(await code(askAi(options, status(503)))).toBe('server');
    const offline = make({ fetch: async () => { throw new TypeError('Network request failed'); } }).deps;
    expect(await code(askAi(options, offline))).toBe('offline');
    const abort = make({ fetch: async () => { throw Object.assign(new Error('x'), { name: 'AbortError' }); } }).deps;
    expect(await code(askAi(options, abort))).toBe('timeout');
  });

  it('resposta fora do formato vira bad-response, mas o uso conta', async () => {
    const { deps, usage } = make({ fetch: async () => ({ status: 200, json: async () => ({ candidates: [{ content: { parts: [{ text: 'olá, sem json' }] } }], usageMetadata: { promptTokenCount: 1, candidatesTokenCount: 1 } }) }) });
    expect(await code(askAi(options, deps))).toBe('bad-response');
    expect(usage.calls).toBe(1);
  });

  it('usa o provedor e o modelo escolhidos', async () => {
    const { deps, fetchMock } = make({
      settings: () => ({ ...DEFAULT_AI, provider: 'claude' }),
      fetch: jest.fn(async () => ({ status: 200, json: async () => ({ content: [{ type: 'text', text: '{"v": 7}' }], usage: { input_tokens: 1, output_tokens: 1 } }) })),
    });
    await expect(askAi(options, deps)).resolves.toBe(7);
    expect((deps.fetch as jest.Mock).mock.calls[0][0]).toBe('https://api.anthropic.com/v1/messages');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('aiStore', () => {
  const phrase = (jp: string, at: number): AiPhrase => ({ id: jp, jp, pt: 'x', topic: 't', at, unknown: [] });
  const memory = () => {
    const data = new Map<string, string>();
    return { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => void data.set(k, v), removeItem: (k: string) => void data.delete(k) };
  };

  it('o cache guarda só as respostas mais novas', () => {
    const cache = Object.fromEntries(Array.from({ length: 5 }, (_, i) => [`k${i}`, { at: i, value: i }]));
    expect(Object.keys(trimCache(cache, 3)).sort()).toEqual(['k2', 'k3', 'k4']);
  });

  it('as frases novas vão na frente, sem repetir', () => {
    const merged = mergePhrases([phrase('a', 1), phrase('b', 1)], [phrase('b', 2), phrase('c', 2)], 3);
    expect(merged.map((p) => p.jp)).toEqual(['b', 'c', 'a']);
  });

  it('guarda e restaura frases e cache; apagar limpa tudo', () => {
    const storage = memory();
    const store = createAiStore(storage);
    store.getState().putCache('k', { v: 1 }, 5);
    store.getState().addPhrases([phrase('ねこ', 1)]);
    const again = createAiStore(storage).getState();
    expect(again.cache.k).toEqual({ at: 5, value: { v: 1 } });
    expect(again.phrases).toHaveLength(1);
    store.getState().removePhrase('ねこ');
    expect(store.getState().phrases).toHaveLength(0);
    store.getState().clearAll();
    expect(store.getState().cache).toEqual({});
  });
});

describe('a chave de API fica fora do backup', () => {
  it('o código de backup não leva configurações de IA nem chave', () => {
    const code = exportBackup({
      srs: {},
      lessons: {},
      stats: {},
      days: [],
      history: {},
      shadow: {},
      challenges: {},
      vocab: {},
      conj: {},
      particles: {},
      wordNotes: {},
      journey: emptyJourney(),
      mastered: {},
      myPhrases: {},
      typing: EMPTY_TYPING,
    });
    const text = atob(code.slice('MDJ1:'.length));
    expect(text).not.toMatch(/"ai"|apiKey|moji_ai_key|aiUsage/);
  });
});
