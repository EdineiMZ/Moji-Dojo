import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText, Bold, Button, Card, ChipRow } from '@/components';
import { findWord } from '@/content';
import { AiDisclaimer } from '@/features/ai/AiParts';
import { AiError } from '@/features/ai/client';
import { generatePhrases, PHRASE_COUNT, PHRASE_TOPICS } from '@/features/ai/tasks';
import { useAiReady } from '@/features/ai/useAi';
import { learnedWordIds } from '@/features/vocab/cards';
import { useAiStore, useProgressStore } from '@/store';
import { PROBLEM_MESSAGES } from '@/features/myphrases/phrases';
import { spacing } from '@/theme';
import { typeable } from './practice';

/**
 * Pede à IA frases novas para digitar, sobre um tema. As frases voltam em hiragana, validadas para o teclado de flick, e
 * ficam guardadas no aparelho (dá para treinar depois, sem internet). O app avisa quando a frase tem palavra fora do vocabulário.
 */
export function AiPhrasesCard() {
  const router = useRouter();
  const ready = useAiReady();
  const vocab = useProgressStore((s) => s.vocab);
  const saved = useAiStore((s) => s.phrases);
  const addPhrases = useAiStore((s) => s.addPhrases);
  const removePhrase = useAiStore((s) => s.removePhrase);
  const addMyPhrase = useProgressStore((s) => s.addMyPhrase);
  const [topic, setTopic] = useState(PHRASE_TOPICS[0]?.value ?? 'travel');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  const generate = async () => {
    const chosen = PHRASE_TOPICS.find((t) => t.value === topic) ?? PHRASE_TOPICS[0];
    if (!chosen) return;
    setBusy(true);
    setMessage(null);
    try {
      const known = [...learnedWordIds(vocab)].flatMap((id) => {
        const reading = findWord(id)?.reading;
        return reading && typeable(reading) ? [reading] : [];
      });
      const now = Date.now();
      const phrases = await generatePhrases({ topic: chosen, known, seed: now });
      addPhrases(phrases.map((p, i) => ({ id: `ai${now.toString(36)}${i}`, jp: p.jp, pt: p.pt, topic: chosen.label, at: now, unknown: p.unknown })));
      setMessage({ text: `${phrases.length} frase${phrases.length === 1 ? '' : 's'} nova${phrases.length === 1 ? '' : 's'}. Já estão no treino abaixo.`, ok: true });
    } catch (error) {
      setMessage({ text: error instanceof AiError ? error.message : 'Não consegui falar com a IA agora.', ok: false });
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
