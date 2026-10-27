import { useState } from 'react';
import { AppText, Button, Card, ChipRow } from '@/components';
import { AiDisclaimer } from './AiParts';
import { AiError } from './client';
import { PHRASE_TOPICS } from './tasks';
import { runJob } from './jobs';
import { QueueOffer } from './QueueParts';
import type { JobSpec } from './queue';
import { useAiReady } from './useAi';

interface SceneGeneratorProps {
  /** Chamado com o id da cena criada, para a tela já abri-la. */
  onCreated: (id: string) => void;
}

/** "Criar cena com IA" dentro de Diálogos: uma cena nova de escolher a resposta, guardada para jogar sem internet. */
export function SceneGenerator({ onCreated }: SceneGeneratorProps) {
  const ready = useAiReady();
  const [topic, setTopic] = useState(PHRASE_TOPICS[0]?.value ?? 'travel');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [failure, setFailure] = useState<{ spec: JobSpec; error: unknown } | null>(null);

  if (!ready) return null;

  const create = async () => {
    const next: JobSpec = { kind: 'scene', topic };
    setBusy(true);
    setError('');
    setFailure(null);
    try {
      const result = await runJob(next);
      if (result.id) onCreated(result.id);
    } catch (e) {
      setError(e instanceof AiError ? e.message : 'Não consegui falar com a IA agora.');
      setFailure({ spec: next, error: e });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <AppText variant="title">✨ Cena nova com IA</AppText>
      <AppText color="muted">
        A IA monta uma cena nova no mesmo formato: alguém fala e você escolhe a resposta certa. As erradas explicam por que não servem. As cenas ficam guardadas para jogar sem internet.
      </AppText>
      <ChipRow options={PHRASE_TOPICS.map((t) => ({ value: t.value, label: t.label }))} value={topic} onChange={setTopic} />
      <Button label={busy ? 'Criando a cena...' : '✨ Criar uma cena'} onPress={create} disabled={busy} />
      {error ? (
        <AppText color="bad" accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : null}
      {failure ? <QueueOffer spec={failure.spec} error={failure.error} /> : null}
      <AiDisclaimer />
    </Card>
  );
}
