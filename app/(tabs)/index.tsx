import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Mascot, Screen } from '@/components';
import { ProgressCard } from '@/features/home/ProgressCard';
import { buildTodaySummary, scriptProgress } from '@/features/home/summary';
import { TodayCard } from '@/features/home/TodayCard';
import { useNow } from '@/hooks/useNow';
import { useProgressStore } from '@/store';
import { spacing } from '@/theme';

export default function HomeScreen() {
  const now = useNow();
  const srs = useProgressStore((s) => s.srs);
  const lessons = useProgressStore((s) => s.lessons);
  const days = useProgressStore((s) => s.days);

  const summary = useMemo(() => buildTodaySummary({ srs, lessons, days }, now), [srs, lessons, days, now]);
  const progress = useMemo(() => scriptProgress(srs), [srs]);

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.flex}>
          <AppText variant="caption" color="muted">
            こんにちは
          </AppText>
          <AppText variant="headline">Nihongo Dojo</AppText>
        </View>
        <Mascot mood={summary.dueCount ? 'neutral' : 'happy'} size={96} />
      </View>
      <TodayCard summary={summary} now={now} />
      <ProgressCard progress={progress} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
});
