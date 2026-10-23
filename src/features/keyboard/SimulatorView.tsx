import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Bold, Button, Card, PressableScale } from '@/components';
import { SIMULATOR_WORDS } from '@/data/keyboard';
import { feedbackCorrect } from '@/lib/feedback';
import { useProgressStore } from '@/store';
import { fonts, radii, spacing, useTheme } from '@/theme';
import { howTo, simulatorProgress } from './flick';
import { FlickPad } from './FlickPad';

/** Simulador do teclado de flick: digite a palavra com as 12 teclas, com dica de qual tecla e direção usar. */
export function SimulatorView() {
  const { colors } = useTheme();
  const markStudied = useProgressStore((s) => s.markStudied);
  const [wordIndex, setWordIndex] = useState(0);
  const [buffer, setBuffer] = useState('');
  const [hint, setHint] = useState(true);

  const word = SIMULATOR_WORDS[wordIndex % SIMULATOR_WORDS.length];
  const target = word?.word ?? '';
  const progress = simulatorProgress(buffer, target);
  const plan = progress.next ? howTo(progress.next) : null;
  const typed = [...buffer];

  const onType = (next: string) => {
    if (next === target && buffer !== target) {
      markStudied();
      feedbackCorrect();
    }
  };
  const nextWord = () => {
    setWordIndex((i) => (i + 1) % SIMULATOR_WORDS.length);
    setBuffer('');
  };

  const status = progress.done
    ? 'Isso! Palavra completa.'
    : progress.correct < typed.length
      ? 'Tem uma letra errada. Use ⌫ para apagar.'
      : hint && plan
        ? plan.text
        : '';

  return (
    <Card enterIndex={0}>
      <View style={styles.counter}>
        <AppText variant="caption" color="muted">
          Palavra {(wordIndex % SIMULATOR_WORDS.length) + 1} de {SIMULATOR_WORDS.length}
        </AppText>
        <PressableScale accessibilityRole="checkbox" accessibilityState={{ checked: hint }} onPress={() => setHint((h) => !h)} hitSlop={8}>
          <AppText variant="caption" color="muted">
            {hint ? '☑' : '☐'} mostrar dica
          </AppText>
        </PressableScale>
      </View>

      <AppText variant="caption" color="muted">
        DIGITE
      </AppText>
      <AppText>
        <Bold>{target}</Bold> {word?.meaning}
      </AppText>

      <View style={[styles.display, { backgroundColor: colors.background, borderColor: colors.line }]}>
        {typed.length === 0 ? (
          <AppText color="muted">Use o teclado abaixo</AppText>
        ) : (
          <AppText style={styles.typed}>
            <AppText style={styles.typed} color="ok">
              {typed.slice(0, progress.correct).join('')}
            </AppText>
            <AppText style={styles.typed} color="bad">
              {typed.slice(progress.correct).join('')}
            </AppText>
          </AppText>
        )}
      </View>

      <View accessibilityLiveRegion="polite" style={[styles.status, progress.done && { backgroundColor: colors.okSoft }]}>
        <AppText variant="caption" color={progress.done ? 'ok' : 'muted'}>
          {status || ' '}
        </AppText>
      </View>

      <FlickPad value={buffer} onChange={setBuffer} onType={onType} hintedKey={hint ? (plan?.key ?? null) : null} />

      {progress.done ? <Button label="Próxima palavra" onPress={nextWord} /> : <Button label="Pular" variant="ghost" onPress={nextWord} />}
      <AppText variant="caption" color="muted">
        Segure a tecla e arraste para a direção da letra que quer.
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  counter: { flexDirection: 'row', justifyContent: 'space-between' },
  display: {
    minHeight: 64,
    borderWidth: 1.5,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  typed: { fontFamily: fonts.bold, fontSize: 28, lineHeight: 36 },
  status: { minHeight: 24, borderRadius: radii.md, paddingHorizontal: spacing.sm, justifyContent: 'center' },
});
