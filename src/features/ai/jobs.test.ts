import { createAiStore, type AiStore } from './aiStore';
import { AiError } from './client';
import { buildHttpRequest, parseHttpReply } from './providers';
import { canQueue, drainQueue, isTransient, jobLabel } from './jobs';
import { MAX_QUEUE, type JobSpec, type QueuedJob } from './queue';

const memory = () => {
  const data = new Map<string, string>();
  return { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => void data.set(k, v), removeItem: (k: string) => void data.delete(k) };
};

const job = (id: string, at: number, spec: JobSpec = { kind: 'scene', topic: 'travel' }): QueuedJob => ({ id, at, spec });

describe('provedor OpenAI', () => {
  it('monta o Chat Completions com a chave no cabeçalho e o modo JSON', () => {
    const http = buildHttpRequest('openai', 'KEY123', 'gpt-4.1-mini', { system: 'sys JSON', user: 'oi', maxTokens: 100 });
    expect(http.url).toBe('https://api.openai.com/v1/chat/completions');
    expect(http.url).not.toContain('KEY123');
    expect(http.headers.authorization).toBe('Bearer KEY123');
    const body = JSON.parse(http.body);
    expect(body).toMatchObject({ model: 'gpt-4.1-mini', response_format: { type: 'json_object' }, max_completion_tokens: 100 });
    expect(body.messages).toEqual([
      { role: 'system', content: 'sys JSON' },
      { role: 'user', content: 'oi' },
    ]);
  });

  it('lê o texto e o uso, e recusa respostas sem texto', () => {
    expect(parseHttpReply('openai', { choices: [{ message: { content: '{"a":1}' } }], usage: { prompt_tokens: 3, completion_tokens: 4 } })).toEqual({
      text: '{"a":1}',
      tokensIn: 3,
      tokensOut: 4,
    });
    expect(parseHttpReply('openai', { choices: [] })).toBeNull();
    expect(parseHttpReply('openai', { choices: [{ message: { content: null } }] })).toBeNull();
  });
});

describe('fila de pedidos', () => {
  let store: AiStore;
  beforeEach(() => {
    store = createAiStore(memory());
  });

  it('guarda o pedido, não repete o igual e respeita o limite', () => {
    const { enqueue } = store.getState();
    expect(enqueue({ kind: 'phrases', topic: 'food' }, 1)).toBe(true);
    expect(enqueue({ kind: 'phrases', topic: 'food' }, 2)).toBe(true);
    expect(store.getState().queue).toHaveLength(1);
    for (let i = 0; i < MAX_QUEUE + 3; i++) store.getState().enqueue({ kind: 'exam', level: 'N5', section: 'grammar', count: 5 + i }, 10 + i);
    expect(store.getState().queue).toHaveLength(MAX_QUEUE);
    expect(store.getState().enqueue({ kind: 'scene', topic: 'daily' }, 99)).toBe(false);
  });

  it('tira da fila um pedido e esvazia tudo em clearAll', () => {
    store.getState().enqueue({ kind: 'scene', topic: 'travel' }, 1);
    const [first] = store.getState().queue;
    store.getState().dequeue(first?.id ?? '');
    expect(store.getState().queue).toEqual([]);
    store.getState().enqueue({ kind: 'scene', topic: 'travel' }, 1);
    store.getState().clearAll();
    expect(store.getState().queue).toEqual([]);
  });
});

describe('drainQueue', () => {
  it('faz do mais antigo ao mais novo e tira da fila o que deu certo', async () => {
    const order: string[] = [];
    const removed: string[] = [];
    const summary = await drainQueue(
      [job('b', 2, { kind: 'scene', topic: 'daily' }), job('a', 1, { kind: 'scene', topic: 'travel' })],
      async (spec) => void order.push(spec.kind === 'scene' ? spec.topic : ''),
      (id) => void removed.push(id),
    );
    expect(order).toEqual(['travel', 'daily']);
    expect(removed).toEqual(['a', 'b']);
    expect(summary).toEqual({ done: 2, failed: 0, left: 0 });
  });

  it('para na primeira falha passageira e deixa o resto na fila', async () => {
    const removed: string[] = [];
    let calls = 0;
    const summary = await drainQueue(
      [job('a', 1), job('b', 2), job('c', 3)],
      async () => {
        calls++;
        if (calls === 2) throw new AiError('offline');
      },
      (id) => void removed.push(id),
    );
    expect(removed).toEqual(['a']);
    expect(calls).toBe(2);
    expect(summary).toEqual({ done: 1, failed: 0, left: 2 });
  });

  it('descarta só o pedido que não vai se resolver sozinho (resposta inválida) e segue', async () => {
    const removed: string[] = [];
    let calls = 0;
    const summary = await drainQueue(
      [job('a', 1), job('b', 2)],
      async () => {
        calls++;
        if (calls === 1) throw new AiError('bad-response');
      },
      (id) => void removed.push(id),
    );
    expect(removed).toEqual(['a', 'b']);
    expect(summary).toEqual({ done: 1, failed: 1, left: 0 });
  });
});

describe('erros e rótulos', () => {
  it('só oferece guardar o pedido quando faltou internet', () => {
    expect(canQueue(new AiError('offline'))).toBe(true);
    expect(canQueue(new AiError('timeout'))).toBe(true);
    expect(canQueue(new AiError('auth'))).toBe(false);
    expect(canQueue(new Error('x'))).toBe(false);
  });

  it('trata limite, rede e servidor como passageiros, e chave recusada como definitivo', () => {
    for (const code of ['offline', 'timeout', 'server', 'rate', 'limit', 'disabled', 'no-key'] as const) expect(isTransient(new AiError(code))).toBe(true);
    expect(isTransient(new AiError('auth'))).toBe(false);
    expect(isTransient(new AiError('bad-response'))).toBe(false);
  });

  it('descreve cada tipo de pedido', () => {
    expect(jobLabel({ kind: 'phrases', topic: 'food' })).toBe('Frases para digitar: Comida');
    expect(jobLabel({ kind: 'story', topic: 'travel', length: 'short' })).toBe('Texto de leitura: Viagem');
    expect(jobLabel({ kind: 'scene', topic: 'daily' })).toBe('Cena de diálogo: Dia a dia');
    expect(jobLabel({ kind: 'exam', level: 'N4', section: 'reading', count: 10 })).toBe('Simulado N4: Leitura (10)');
  });
});
