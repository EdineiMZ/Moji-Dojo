import { StyleSheet, Switch, View } from 'react-native';
import { AppText, Card, LearnMore, SegmentedControl } from '@/components';
import { RETENTION_OPTIONS } from './retention';
import { useSettingsStore } from '@/store';
import { spacing, useTheme } from '@/theme';

/** Ajustes: liga ou desliga o modo "write" (desenhar o símbolo) nas revisões. */
export function ReviewSettingsCard() {
  const { colors } = useTheme();
  const writeInReview = useSettingsStore((s) => s.writeInReview);
  const setWriteInReview = useSettingsStore((s) => s.setWriteInReview);
  const retention = useSettingsStore((s) => s.retention);
  const setRetention = useSettingsStore((s) => s.setRetention);

  return (
    <Card enterIndex={1}>
      <AppText variant="title">Revisões</AppText>
      <View style={styles.row}>
        <View style={styles.flex}>
          <AppText>Escrever nas revisões</AppText>
          <AppText variant="caption" color="muted">
            Desenhe o símbolo com o dedo em parte das perguntas.
          </AppText>
          <LearnMore>
            <AppText variant="caption" color="muted">
              Em cerca de 1 de cada 5 perguntas dos caracteres que têm traços, você vê o significado e o som e desenha o símbolo. Acertar vale 70% de semelhança ou mais. Desligue se preferir revisões mais rápidas.
            </AppText>
          </LearnMore>
        </View>
        <Switch
          value={writeInReview}
          onValueChange={setWriteInReview}
          accessibilityLabel="Escrever nas revisões"
          trackColor={{ false: colors.line, true: colors.primary }}
          thumbColor={colors.surface}
        />
      </View>
      <View style={styles.group}>
        <AppText>Retenção desejada</AppText>
        <SegmentedControl<string> options={RETENTION_OPTIONS.map((v) => ({ value: String(v), label: `${Math.round(v * 100)}%` }))} value={String(retention)} onChange={(v) => setRetention(Number(v))} />
        <AppText variant="caption" color="muted">
          A chance de lembrar em que o cartão volta. Mais alta: mais revisões e menos esquecimento. Mais baixa: menos revisões. Vale para as próximas respostas; os cartões já agendados mantêm a data.
        </AppText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  group: { gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
});
