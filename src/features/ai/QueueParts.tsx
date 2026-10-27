import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card } from '@/components';
import { useAiStore } from '@/store';
import { spacing } from '@/theme';
import { canQueue, jobLabel, processQueue } from './jobs';
import type { JobSpec } from './queue';
import { useAiReady } from './useAi';

interface QueueOfferProps {
  /** O pedido que acabou de falhar. */
  spec: JobSpec;
  /** O erro dele: a oferta só aparece quando falhou por falta de internet. */
  error: unknown;
}

/** Depois de uma falha por falta de internet: "Guardar o pedido" para a IA fazer quando a conexão voltar. */
export function QueueOffer({ spec, error }: QueueOfferProps) {
  const enqueue = useAiStore((s) => s.enqueue);
  const [state, setState] = useState<'idle' | 'saved' | 'full'>('idle');
  if (!canQueue(error)) return null;
  if (state === 'saved') {
    return (
      <AppText color="ok" accessibilityLiveRegion="polite">
        Pedido guardado. O app faz sozinho quando tiver internet, ou toque em Fazer agora na fila.
      </AppText>
    );
  }
  return (
    <View style={styles.offer}>
      <Button
        label="Guardar o pedido para quando tiver internet"
        variant="soft"
        onPress={() => setState(enqueue(spec) ? 'saved' : 'full')}
      />
      {state === 'full' ? (
        <AppText color="bad" accessibilityLiveRegion="polite">
          A fila está cheia. Faça os pedidos guardados antes de guardar outro.
        </AppText>
      ) : null}
    </View>
  );
}

/** A fila de pedidos guardados: o que está esperando, "Fazer agora" e "Tirar da fila". Some quando está vazia. */
export function QueueBar() {
  const ready = useAiReady();
  const queue = useAiStore((s) => s.queue);
  const dequeue = useAiStore((s) => s.dequeue);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  if (queue.length === 0 && !message) return null;

  const run = async () => {
    setBusy(true);
    setMessage('');
    try {
      const { done, failed, left } = await processQueue();
      const parts = [
        done > 0 ? `${done} pedido${done === 1 ? '' : 's'} feito${done === 1 ? '' : 's'}` : '',
        failed > 0 ? `${failed} não deu certo e saiu da fila` : '',
        left > 0 ? `${left} continua${left === 1 ? '' : 'm'} na fila (sem internet, limite do dia ou IA indisponível)` : '',
      ].filter(Boolean);
      setMessage(parts.length > 0 ? `${parts.join('. ')}.` : 'Nada a fazer.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <AppText variant="title">Fila de pedidos</AppText>
      {queue.length > 0 ? (
        <>
          <AppText color="muted">Pedidos guardados porque estava sem internet. O app tenta de novo sozinho quando você abre ou volta para ele.</AppText>
          {queue.map((job) => (
            <View key={job.id} style={styles.row}>
              <AppText style={styles.flex}>{jobLabel(job.spec)}</AppText>
              <AppText variant="caption" color="primary" accessibilityRole="button" onPress={() => dequeue(job.id)}>
                Tirar
              </AppText>
            </View>
          ))}
          {ready ? <Button label={busy ? 'Fazendo...' : 'Fazer agora'} onPress={run} disabled={busy} /> : <AppText color="muted">Ligue a IA e cadastre a chave em Ajustes para fazer os pedidos.</AppText>}
        </>
      ) : null}
      {message ? (
        <AppText accessibilityLiveRegion="polite">{message}</AppText>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  offer: { gap: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1 },
});
