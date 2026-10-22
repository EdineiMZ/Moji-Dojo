import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components';
import { fonts, radii, spacing, useTheme } from '@/theme';
import { strokeLabel, type StrokeVerdict, type WritingScore } from './score';

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** Resultado da conferência: nota, veredito e um "chip" por traço do modelo. */
export function ScoreResult({ score }: { score: WritingScore }) {
  const { colors } = useTheme();
  const chipColor = (v: StrokeVerdict) =>
    v === 'ok' ? { bg: colors.okSoft, fg: 'ok' as const } : v === 'rev' || v === 'order'
      ? { bg: colors.primarySoft, fg: 'warn' as const }
      : { bg: colors.badSoft, fg: 'bad' as const };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <AppText style={styles.pct} color={score.level === 'ok' ? 'ok' : score.level === 'warn' ? 'warn' : 'bad'}>
          {score.pct}%
        </AppText>
        <AppText style={styles.verdict}>{score.verdict}</AppText>
      </View>
      <AppText variant="caption" color="muted">
        Você fez {plural(score.drawnCount, 'traço', 'traços')}, o caractere tem {score.expectedCount}.
        {score.drawnCount > score.expectedCount ? ' Sobrou traço.' : ''}
      </AppText>
      <View style={styles.chips}>
        {score.strokes.map((verdict, i) => {
          const look = chipColor(verdict);
          return (
            <View key={i} style={[styles.chip, { backgroundColor: look.bg }]}>
              <AppText variant="caption" color={look.fg} style={{ fontFamily: fonts.bold }}>
                {strokeLabel(verdict, i)}
              </AppText>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.sm },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  pct: { fontFamily: fonts.bold, fontSize: 40, lineHeight: 46 },
  verdict: { flex: 1 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  chip: { borderRadius: radii.pill, paddingVertical: 3, paddingHorizontal: spacing.sm },
});
