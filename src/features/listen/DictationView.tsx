import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card, ChipRow, Mascot } from '@/components';
import { TypingSession, type TypingTarget } from '@/features/translate/TypingSession';
import { useProgressStore } from '@/store';
import { spacing } from '@/theme';
import { buildDictation, DICTATION_ROUND, type DictationKind } from './dictation';

const KINDS = [
  { value: 'words' as const, label: 'Palavras' },
  { value: 'phrases' as const, label: 'Frases' },
];

const DESCRIPTIONS: Readonly<Record<DictationKind, string>> = {
  words: 'Você ouve uma palavra que já viu e escreve em kana. A conferência aceita também a escrita com kanji.',
  phrases: 'Você ouve uma frase inteira e escreve o que entendeu. Espaços e pontuação não contam.',
};

/**
 * Ditado: ouve (a voz toca sozinha, com um botão para ouvir devagar), escreve em kana ou kanji, e a conferência mostra a
 * diferença letra por letra. O sentido em português só aparece depois de conferir.
 */
export function DictationView() {
  const vocab = useProgressStore((s) => s.vocab);
  const recordDrill = useProgressStore((s) => s.recordDrill);
  const [kind, setKind] = useState<DictationKind>('words');
  const [session, setSession] = useState<{ items: TypingTarget[]; kind: DictationKind; attempt: number } | null>(null);

  const start = (k: DictationKind) =>
    setSession((s) => ({ items: buildDictation(k, vocab), kind: k, attempt: (s?.attempt ?? 0) + 1 }));

  if (session) {
    return (
      <TypingSession
        key={session.attempt}
        items={session.items}
        title={session.kind === 'words' ? 'Ditado de palavras' : 'Ditado de frases'}
        onResult={(_item, ok) => recordDrill(ok, 'dictation')}
        onExit={() => setSession(null)}
        again={{ label: 'Outro ditado', onPress: () => start(session.kind) }}
      />
    );
  }

  return (
    <Card enterIndex={0}>
      <View style={styles.head}>
        <View style={styles.flex}>
          <AppText variant="title">Ditado</AppText>
          <AppText color="muted">Ouça e escreva o que ouviu.</AppText>
        </View>
        <Mascot mood="neutral" size={72} />
      </View>
      <AppText variant="caption" color="muted">
        O QUE OUVIR
      </AppText>
      <ChipRow options={KINDS} value={kind} onChange={setKind} />
      <AppText>{DESCRIPTIONS[kind]}</AppText>
      <Button label={`Começar (${DICTATION_ROUND})`} onPress={() => start(kind)} />
      <AppText variant="caption" color="muted">
        Dica: use o botão Devagar quando a frase passar rápido demais. Errar mostra o que sobrou ou faltou na sua escrita.
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: spacing.xs },
});
