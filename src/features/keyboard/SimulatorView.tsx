import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Bold, Button, Card, PressableScale } from '@/components';
import { FLICK_KEYS, SIMULATOR_WORDS } from '@/data/keyboard';
import { feedbackCorrect } from '@/lib/feedback';
import { useProgressStore } from '@/store';
import { fonts, radii, spacing, useTheme } from '@/theme';
import { applyMod, howTo, simulatorProgress } from './flick';
import { FlickKeyButton } from './FlickKeyButton';

/** O teclado de flick real tem 3 colunas x 4 linhas: あ か さ / た な は / ま や ら / 小゛゜ わ 、。?! */
const COLUMNS = 3;

/** Simulador do teclado de flick: digite a palavra com as 12 teclas, com dica de qual tecla e direção usar. */
export function SimulatorView() {
  const { colors } = useTheme();
  const markStudied = useProgressStore((s) => s.markStudied);
  const [wordIndex, setWordIndex] = useState(0);
  const [buffer, setBuffer] = useState('');
  const [hint, setHint] = useState(true);
  // Largura real da área do teclado: medida na tela, em vez de estimada pelas margens (que já errou a conta).
  const [boardWidth, setBoardWidth] = useState(0);

  const word = SIMULATOR_WORDS[wordIndex % SIMULATOR_WORDS.length];
  const target = word?.word ?? '';
  const progress = simulatorProgress(buffer, target);
  const plan = progress.next ? howTo(progress.next) : null;
  const typed = [...buffer];

  const keySize = Math.floor(boardWidth / COLUMNS);

  const update = (next: string) => {
    setBuffer(next);
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

      <View style={[styles.status, progress.done && { backgroundColor: colors.okSoft }]}>
        <AppText variant="caption" color={progress.done ? 'ok' : 'muted'}>
          {status || ' '}
        </AppText>
      </View>

      <View onLayout={(e) => setBoardWidth(e.nativeEvent.layout.width)}>
        {keySize > 0 ? (
          <>
            {/* Largura de exatamente 3 teclas: a grade nunca quebra em outro número de colunas. */}
            <View style={[styles.keys, { width: keySize * COLUMNS }]}>
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
            <View style={[styles.actions, { width: keySize * COLUMNS }]}>
              <PressableScale
                accessibilityRole="button"
                accessibilityLabel="Apagar"
                onPress={() => setBuffer([...buffer].slice(0, -1).join(''))}
                style={[styles.actionKey, { backgroundColor: colors.lilacSoft, borderColor: colors.line }]}
              >
                <AppText style={{ fontFamily: fonts.bold, fontSize: 22 }}>⌫</AppText>
              </PressableScale>
              <PressableScale
                accessibilityRole="button"
                onPress={() => setBuffer('')}
                style={[styles.actionKey, { backgroundColor: colors.lilacSoft, borderColor: colors.line }]}
              >
                <AppText style={{ fontFamily: fonts.bold }}>Limpar</AppText>
              </PressableScale>
            </View>
          </>
        ) : null}
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
  keys: { alignSelf: 'center', flexDirection: 'row', flexWrap: 'wrap' },
  actions: { alignSelf: 'center', flexDirection: 'row', gap: spacing.sm, paddingHorizontal: 3, marginTop: spacing.sm },
  actionKey: { flex: 1, minHeight: 48, borderRadius: radii.md, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
});
