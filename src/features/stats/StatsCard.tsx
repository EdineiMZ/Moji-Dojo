import { StyleSheet, View } from 'react-native';
import { AppText, Card, CountUp } from '@/components';
import { plural } from '@/lib/plural';
import { fonts, radii, spacing, useTheme } from '@/theme';
import type { StripDay } from './metrics';

const WEEKDAY_LETTERS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'] as const;

interface StatsCardProps {
  /** Dias seguidos até hoje. */
  streak: number;
  bestStreak: number;
  studiedDays: number;
  /** Porcentagem de acertos; null se nunca respondeu. */
  accuracy: number | null;
  /** Os últimos dias, com os estudados marcados. */
  strip: readonly StripDay[];
}

/** `value` null mostra um traço (ex.: precisão sem nenhuma resposta ainda). */
function Tile({ value, suffix, label }: { value: number | null; suffix?: string; label: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.tile, { backgroundColor: colors.background, borderColor: colors.field }]}>
      {value === null ? (
        <AppText style={styles.tileValue}>—</AppText>
      ) : (
        <CountUp value={value} {...(suffix ? { suffix } : {})} style={styles.tileValue} />
      )}
      <AppText variant="caption" color="muted">
        {label}
      </AppText>
    </View>
  );
}

/** Números-chave do estudo e uma faixa dos últimos dias (estudou ou não). */
export function StatsCard({ streak, bestStreak, studiedDays, accuracy, strip }: StatsCardProps) {
  const { colors } = useTheme();
  const activeCount = strip.filter((d) => d.active).length;

  return (
    <Card enterIndex={1}>
      <AppText variant="title">Sua constância</AppText>
      <View style={styles.tiles}>
        <Tile value={streak} label={streak === 1 ? 'dia seguido' : 'dias seguidos'} />
        <Tile value={bestStreak} label="melhor sequência" />
        <Tile value={studiedDays} label={studiedDays === 1 ? 'dia estudado' : 'dias estudados'} />
        <Tile value={accuracy} suffix="%" label="de acertos" />
      </View>

      <View
        accessible
        accessibilityLabel={`Últimos ${strip.length} dias: ${plural(activeCount, 'dia estudado', 'dias estudados')}.`}
        style={styles.strip}
      >
        {strip.map((d) => (
          <View key={d.day} style={styles.stripDay}>
            <View
              style={[
                styles.stripBox,
                {
                  backgroundColor: d.active ? colors.chart : colors.line,
                  borderColor: d.isToday ? colors.ink : 'transparent',
                },
              ]}
            />
            <AppText variant="caption" color={d.isToday ? 'ink' : 'muted'} style={styles.stripLetter}>
              {WEEKDAY_LETTERS[d.weekday] ?? ''}
            </AppText>
          </View>
        ))}
      </View>
      <AppText variant="caption" color="muted">
        Últimos {strip.length} dias: {plural(activeCount, 'dia estudado', 'dias estudados')}.
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  tiles: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tile: {
    flexGrow: 1,
    flexBasis: '45%',
    borderWidth: 1,
    borderRadius: radii.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  tileValue: { fontFamily: fonts.bold, fontSize: 28, lineHeight: 34 },
  strip: { flexDirection: 'row', justifyContent: 'space-between' },
  stripDay: { alignItems: 'center', gap: 2, flex: 1 },
  stripBox: { width: 16, height: 16, borderRadius: 5, borderWidth: 2 },
  stripLetter: { fontSize: 12, lineHeight: 16 },
});
