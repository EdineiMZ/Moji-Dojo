import { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { AppText, Bold, Button, Card, PressableScale } from '@/components';
import { FLICK_KEYS, SIMULATOR_WORDS } from '@/data/keyboard';
import { useProgressStore } from '@/store';
import { fonts, radii, spacing, useTheme } from '@/theme';
import { applyMod, howTo, simulatorProgress } from './flick';
import { FlickKeyButton } from './FlickKeyButton';

const COLUMNS = 3;
const SIDE_COLUMN = 1; // coluna das teclas ⌫ e Limpar

/** Simulador do teclado de flick: digite a palavra com as 12 teclas, com dica de qual tecla e direção usar. */
export function SimulatorView() {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const markStudied = useProgressStore((s) => s.markStudied);
  const [wordIndex, setWordIndex] = useState(0);
  const [buffer, setBuffer] = useState('');
  const [hint, setHint] = useState(true);

  const word = SIMULATOR_WORDS[wordIndex % SIMULATOR_WORDS.length];
  const target = word?.word ?? '';
  const progress = simulatorProgress(buffer, target);
  const plan = progress.next ? howTo(progress.next) : null;
  const typed = [...buffer];

  // Largura útil do teclado: tela menos margens da tela e do cartão, dividida em 4 colunas.
  const keySize = Math.floor((width - spacing.lg * 4) / (COLUMNS + SIDE_COLUMN));

  const update = (next: string) => {
    setBuffer(next);
    if (next === target && buffer !== target) markStudied();
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

      <View style={[styles.status, progress.done && { backgroundColor: colors.okSoft }]}>
        <AppText variant="caption" color={progress.done ? 'ok' : 'muted'}>
          {status || ' '}
        </AppText>
      </View>

      <View style={styles.keyboard}>
        <View style={styles.keys}>
          {FLICK_KEYS.map((keyData) => (
            <FlickKeyButton
              key={keyData.label}
              keyData={keyData}
              size={keySize}
              hinted={hint && plan?.key === keyData.label}
              onInput={(char) => update(buffer + char)}
              onMod={() => update(applyMod(buffer))}
            />
          ))}
        </View>
        <View style={styles.side}>
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel="Apagar"
            onPress={() => setBuffer([...buffer].slice(0, -1).join(''))}
            style={[styles.sideKey, { backgroundColor: colors.lilacSoft, borderColor: colors.line }]}
          >
            <AppText style={{ fontFamily: fonts.bold, fontSize: 22 }}>⌫</AppText>
          </PressableScale>
          <PressableScale
            accessibilityRole="button"
            onPress={() => setBuffer('')}
            style={[styles.sideKey, { backgroundColor: colors.lilacSoft, borderColor: colors.line }]}
          >
            <AppText style={{ fontFamily: fonts.bold }}>Limpar</AppText>
          </PressableScale>
        </View>
      </View>

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
  keyboard: { flexDirection: 'row', alignItems: 'stretch' },
  keys: { flex: COLUMNS, flexDirection: 'row', flexWrap: 'wrap' },
  side: { flex: SIDE_COLUMN, padding: 3, gap: 6 },
  sideKey: { flex: 1, borderRadius: radii.md, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
});
