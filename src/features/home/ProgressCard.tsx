import { StyleSheet, View } from 'react-native';
import { AppText, Card, ProgressBar } from '@/components';
import type { Script } from '@/data/types';
import { SCRIPT_NAMES, SCRIPT_ORDER } from '@/features/catalog';
import { spacing, useTheme } from '@/theme';
import type { ScriptProgress } from './summary';

const BAR_COLORS = ['primary', 'lilac', 'sky'] as const;

/** Quantos caracteres de cada escrita já entraram na revisão e quantos estão firmes. */
export function ProgressCard({ progress }: { progress: Record<Script, ScriptProgress> }) {
  const { colors } = useTheme();
  return (
    <Card enterIndex={1}>
      <AppText variant="title">Seu progresso</AppText>
      {SCRIPT_ORDER.map((script, i) => {
        const p = progress[script];
        return (
          <View key={script} style={styles.row}>
            <View style={styles.label}>
              <AppText>{SCRIPT_NAMES[script]}</AppText>
              <AppText variant="caption" color="muted">
                {p.learned} de {p.total} · {p.firm} firmes
              </AppText>
            </View>
            <ProgressBar value={p.total ? p.learned / p.total : 0} color={colors[BAR_COLORS[i] ?? 'primary']} />
          </View>
        );
      })}
      <AppText variant="caption" color="muted">
        Firme = acertou em revisões seguidas, na caixa 3 ou mais.
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { gap: spacing.xs },
  label: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
});
