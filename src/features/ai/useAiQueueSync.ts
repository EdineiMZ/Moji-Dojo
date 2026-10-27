import { useEffect } from 'react';
import { AppState } from 'react-native';
import { useAiStore, useSettingsStore } from '@/store';
import { readKey } from './keyStore';
import { processQueue } from './jobs';

/** Espera depois de abrir o app antes de mexer na fila (o armazenamento e a rede acabaram de acordar). */
const START_DELAY_MS = 4000;

async function tryDrain(): Promise<void> {
  const { queue } = useAiStore.getState();
  const ai = useSettingsStore.getState().ai;
  if (queue.length === 0 || !ai.enabled) return;
  if ((await readKey(ai.provider)) === null) return;
  await processQueue();
}

/** Faz os pedidos guardados sem internet quando o app abre ou volta para a tela. Falhas passageiras deixam o pedido na fila. */
export function useAiQueueSync(): void {
  useEffect(() => {
    const timer = setTimeout(() => void tryDrain(), START_DELAY_MS);
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') void tryDrain();
    });
    return () => {
      clearTimeout(timer);
      sub.remove();
    };
  }, []);
}
