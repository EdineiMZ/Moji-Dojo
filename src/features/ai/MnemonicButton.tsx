import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Bold, Button } from '@/components';
import { useProgressStore } from '@/store';
import { radii, spacing, useTheme } from '@/theme';
import { AiDisclaimer } from './AiParts';
import { AiError } from './client';
import { makeMnemonic, type Mnemonic } from './tasksMore';
import { useAiReady } from './useAi';

interface MnemonicButtonProps {
  area: string;
  label: string;
  /** Nas palavras, dá para guardar a dica como a nota de memória da palavra. */
  wordId?: string;
}

/** "Dica de memória com IA" para um item teimoso. Some quando a IA não está pronta. */
export function MnemonicButton({ area, label, wordId }: MnemonicButtonProps) {
  const { colors } = useTheme();
  const ready = useAiReady();
  const setWordNote = useProgressStore((s) => s.setWordNote);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Mnemonic | null>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  if (!ready) return null;

  const run = async () => {
    setBusy(true);
    setError('');
    setSaved(false);
    try {
      setResult(await makeMnemonic(area, label));
    } catch (e) {
      setResult(null);
      setError(e instanceof AiError ? e.message : 'Não consegui falar com a IA agora.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.root}>
      <Button label={busy ? 'Criando...' : result ? '✨ Outra dica' : '✨ Dica de memória (IA)'} variant="ghost" onPress={run} disabled={busy} />
      {error ? (
        <AppText color="bad" accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : null}
      {result ? (
        <View style={[styles.result, { backgroundColor: colors.skySoft }]} accessibilityLiveRegion="polite">
          <AppText>{result.mnemonic}</AppText>
          {result.practice ? (
            <AppText>
              <Bold>Treino:</Bold> {result.practice}
            </AppText>
          ) : null}
          {wordId ? (
            <Button
              label={saved ? 'Guardada na palavra ✓' : 'Usar como minha dica'}
              variant="soft"
              disabled={saved}
              onPress={() => setSaved(setWordNote(wordId, result.mnemonic.slice(0, 200)))}
            />
          ) : null}
          <AiDisclaimer />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.xs },
  result: { borderRadius: radii.md, padding: spacing.md, gap: spacing.sm },
});
