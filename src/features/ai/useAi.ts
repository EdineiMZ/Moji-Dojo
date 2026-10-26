import { useEffect } from 'react';
import { useAiStore, useSettingsStore } from '@/store';
import { askAi, DEFAULT_TIMEOUT_MS, type AiDeps, type AskOptions } from './client';
import { readKey, useAiKeys } from './keyStore';

/** As ligações reais do cliente de IA: rede, armazenamento seguro, preferências e cache do app. */
export const productionDeps: AiDeps = {
  fetch: (url, init) => fetch(url, init),
  getKey: readKey,
  settings: () => useSettingsStore.getState().ai,
  usage: () => useSettingsStore.getState().aiUsage,
  recordUsage: (tokensIn, tokensOut) => useSettingsStore.getState().recordAiUsage(tokensIn, tokensOut),
  getCache: (key) => useAiStore.getState().cache[key]?.value,
  putCache: (key, value) => useAiStore.getState().putCache(key, value),
  now: () => Date.now(),
  timeoutMs: DEFAULT_TIMEOUT_MS,
};

/** Faz um pedido à IA com as ligações reais. Lança `AiError` com mensagem pronta para mostrar. */
export const ask = <T>(options: AskOptions<T>): Promise<T> => askAi(options, productionDeps);

/**
 * A IA está pronta para usar? (ligada em Ajustes e com chave do provedor escolhido). Não checa a internet: sem conexão
 * o pedido falha com uma mensagem clara, e o resto do app não depende disso.
 */
export function useAiReady(): boolean {
  const enabled = useSettingsStore((s) => s.ai.enabled);
  const provider = useSettingsStore((s) => s.ai.provider);
  const loaded = useAiKeys((s) => s.loaded);
  const hasKey = useAiKeys((s) => s.has[provider]);
  const refresh = useAiKeys((s) => s.refresh);
  useEffect(() => {
    if (!loaded) void refresh();
  }, [loaded, refresh]);
  return enabled && hasKey;
}
