import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card, Mascot, ProgressBar, Screen, type MascotMood } from '@/components';
import { spacing } from '@/theme';

const MOODS: { mood: MascotMood; label: string }[] = [
  { mood: 'neutral', label: 'Neutro' },
  { mood: 'happy', label: 'Feliz' },
  { mood: 'sad', label: 'Triste' },
  { mood: 'cheer', label: 'Festa' },
];

/** Tela provisória da etapa 4: galeria dos componentes. A etapa 5 a troca pela tela Início. */
export default function Gallery() {
  const [mood, setMood] = useState<MascotMood>('neutral');
  const [progress, setProgress] = useState(0.4);

  return (
    <Screen>
      <AppText variant="headline">Galeria</AppText>

      <Card enterIndex={0} tone="pink" style={styles.center}>
        <Mascot mood={mood} size={170} />
        <AppText variant="caption" color="muted">
          Toque num humor e veja o Mochi reagir
        </AppText>
        <View style={styles.row}>
          {MOODS.map((m) => (
            <Button
              key={m.mood}
              label={m.label}
              variant={mood === m.mood ? 'primary' : 'soft'}
              onPress={() => setMood(m.mood)}
              style={styles.small}
            />
          ))}
        </View>
      </Card>

      <Card enterIndex={1}>
        <AppText variant="title">Barra de progresso</AppText>
        <ProgressBar value={progress} height={14} />
        <AppText variant="caption" color="muted">
          {Math.round(progress * 100)}%
        </AppText>
        <View style={styles.row}>
          <Button label="− 20%" variant="ghost" onPress={() => setProgress((p) => Math.max(0, p - 0.2))} style={styles.small} />
          <Button label="+ 20%" onPress={() => setProgress((p) => Math.min(1, p + 0.2))} style={styles.small} />
        </View>
      </Card>

      <Card enterIndex={2} tone="lilac">
        <AppText variant="title">Cartões que entram com mola</AppText>
        <AppText>
          Cada cartão entra um pouco depois do anterior. Os botões afundam ao tocar. Com "reduzir movimento" ligado no
          sistema, tudo isso fica parado.
        </AppText>
      </Card>

      <Card enterIndex={3} tone="sky" style={styles.center}>
        <AppText variant="glyph" color="primary">
          桜
        </AppText>
        <AppText variant="caption" color="muted">
          M PLUS Rounded 1c
        </AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center' },
  small: { paddingHorizontal: spacing.lg, minHeight: 42 },
});
