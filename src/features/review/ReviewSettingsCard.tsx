import { StyleSheet, Switch, View } from 'react-native';
import { AppText, Card } from '@/components';
import { useSettingsStore } from '@/store';
import { spacing, useTheme } from '@/theme';

/** Ajustes: liga ou desliga o modo "write" (desenhar o símbolo) nas revisões. */
export function ReviewSettingsCard() {
  const { colors } = useTheme();
  const writeInReview = useSettingsStore((s) => s.writeInReview);
  const setWriteInReview = useSettingsStore((s) => s.setWriteInReview);

  return (
    <Card enterIndex={1}>
      <AppText variant="title">Revisões</AppText>
      <View style={styles.row}>
        <View style={styles.flex}>
          <AppText>Escrever nas revisões</AppText>
          <AppText variant="caption" color="muted">
            Em cerca de 1 de cada 5 perguntas dos caracteres que têm traços, você vê o significado e o som e desenha o
            símbolo com o dedo. Acertar vale 70% de semelhança ou mais. Desligue se preferir revisões mais rápidas.
          </AppText>
        </View>
        <Switch
          value={writeInReview}
          onValueChange={setWriteInReview}
          accessibilityLabel="Escrever nas revisões"
          trackColor={{ false: colors.line, true: colors.primary }}
          thumbColor={colors.surface}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
});
