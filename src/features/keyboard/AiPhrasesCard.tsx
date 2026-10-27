import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText, Bold, Button, Card, ChipRow } from '@/components';
import { AiDisclaimer } from '@/features/ai/AiParts';
import { AiError } from '@/features/ai/client';
import { runJob } from '@/features/ai/jobs';
import { QueueOffer } from '@/features/ai/QueueParts';
import type { JobSpec } from '@/features/ai/queue';
import { PHRASE_COUNT, PHRASE_TOPICS } from '@/features/ai/tasks';
import { useAiReady } from '@/features/ai/useAi';
import { useAiStore, useProgressStore } from '@/store';
import { PROBLEM_MESSAGES } from '@/features/myphrases/phrases';
import { spacing } from '@/theme';

/**
 * Pede à IA frases novas para digitar, sobre um tema. As frases voltam em hiragana, validadas para o teclado de flick, e
 * ficam guardadas no aparelho (dá para treinar depois, sem internet). O app avisa quando a frase tem palavra fora do vocabulário.
 */
export function AiPhrasesCard() {
  const router = useRouter();
  const ready = useAiReady();
  const saved = useAiStore((s) => s.phrases);
  const removePhrase = useAiStore((s) => s.removePhrase);
  const addMyPhrase = useProgressStore((s) => s.addMyPhrase);
  const [topic, setTopic] = useState(PHRASE_TOPICS[0]?.value ?? 'travel');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [failure, setFailure] = useState<{ spec: JobSpec; error: unknown } | null>(null);

  const generate = async () => {
    const next: JobSpec = { kind: 'phrases', topic };
    setBusy(true);
    setMessage(null);
    setFailure(null);
    try {
      setMessage({ text: (await runJob(next)).text, ok: true });
    } catch (error) {
      setMessage({ text: error instanceof AiError ? error.message : 'Não consegui falar com a IA agora.', ok: false });
      setFailure({ spec: next, error });
    } finally {
      setBusy(false);
    }
  };

  if (!ready) {
    return (
      <Card enterIndex={0}>
        <AppText variant="title">Frases com IA</AppText>
        <AppText color="muted">
          Com a sua chave de API, a IA cria frases sobre o tema que você escolher e usa as palavras que você já sabe. Cadastre a chave em Ajustes. Sem ela, o resto do simulador funciona normalmente.
        </AppText>
        <Button label="Abrir Ajustes" variant="soft" onPress={() => router.push('/settings')} />
      </Card>
    );
  }

  return (
    <Card enterIndex={0}>
      <AppText variant="title">Frases com IA</AppText>
      <AppText color="muted">Escolha um tema e peça {PHRASE_COUNT} frases novas para digitar. Elas ficam guardadas para treinar sem internet.</AppText>
      <ChipRow options={PHRASE_TOPICS.map((t) => ({ value: t.value, label: t.label }))} value={topic} onChange={setTopic} />
      <Button label={busy ? 'Criando frases...' : '✨ Criar frases'} onPress={generate} disabled={busy} />
      {message ? (
        <AppText color={message.ok ? 'ok' : 'bad'} accessibilityLiveRegion="polite">
          {message.text}
        </AppText>
      ) : null}
      {failure ? <QueueOffer spec={failure.spec} error={failure.error} /> : null}
      <AiDisclaimer />
      {saved.length > 0 ? (
        <View style={{ gap: spacing.xs }}>
          <AppText variant="caption" color="muted">
            GUARDADAS ({saved.length})
          </AppText>
          {saved.slice(0, 5).map((p) => (
            <View key={p.id} style={{ gap: 2 }}>
              <AppText>
                <Bold>{p.jp}</Bold> {p.pt}
              </AppText>
              {p.unknown.length > 0 ? (
                <AppText variant="caption" color="muted">
                  Palavra fora do seu vocabulário: {p.unknown.join(', ')}
                </AppText>
              ) : null}
              <View style={{ flexDirection: 'row', gap: spacing.md }}>
                <AppText
                  variant="caption"
                  color="primary"
                  accessibilityRole="button"
                  onPress={() => {
                    const result = addMyPhrase(p.jp, p.pt);
                    setMessage('error' in result ? { text: PROBLEM_MESSAGES[result.error], ok: false } : { text: 'Salva em Minhas frases.', ok: true });
                  }}
                >
                  Salvar em Minhas frases
                </AppText>
                <AppText variant="caption" color="bad" onPress={() => removePhrase(p.id)} accessibilityRole="button">
                  Remover
                </AppText>
              </View>
            </View>
          ))}
          {saved.length > 5 ? (
            <AppText variant="caption" color="muted">
              e mais {saved.length - 5}
            </AppText>
          ) : null}
        </View>
      ) : null}
    </Card>
  );
}
