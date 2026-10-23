import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText, Mascot, Screen, PressableScale } from '@/components';
import { JourneyCard } from '@/features/journey/ui/JourneyCard';
import { useMochiMood } from '@/features/journey/useMochiMood';
import { PetalsBadge } from '@/features/journey/ui/PetalsBadge';
import { DailyPlanCard } from '@/features/home/DailyPlanCard';
import { ProgressCard } from '@/features/home/ProgressCard';
import { buildTodaySummary, scriptProgress } from '@/features/home/summary';
import { TodayCard } from '@/features/home/TodayCard';
import { LeechCard } from '@/features/leeches/LeechCard';
import { EvolutionCard } from '@/features/stats/EvolutionCard';
import { accuracy, activityStrip, bestStreak, dailyAnswers, evolution } from '@/features/stats/metrics';
import { StatsCard } from '@/features/stats/StatsCard';
import { useNow } from '@/hooks/useNow';
import { useProgressStore, useSettingsStore } from '@/store';
import { spacing } from '@/theme';

export default function HomeScreen() {
  const router = useRouter();
  const now = useNow();
  const srs = useProgressStore((s) => s.srs);
  const lessons = useProgressStore((s) => s.lessons);
  const days = useProgressStore((s) => s.days);
  const stats = useProgressStore((s) => s.stats);
  const history = useProgressStore((s) => s.history);
  const felt = useMochiMood();
  const username = useSettingsStore((s) => s.profile.username);

  const summary = useMemo(() => buildTodaySummary({ srs, lessons, days }, now), [srs, lessons, days, now]);
  const progress = useMemo(() => scriptProgress(srs), [srs]);
  const metrics = useMemo(() => {
    const today = new Date(now);
    return {
      best: Math.max(bestStreak(days), summary.streak),
      accuracy: accuracy(stats),
      strip: activityStrip(days, today),
      evolution: evolution(history, summary.learnedCount, today),
      answers: dailyAnswers(history, today),
    };
  }, [days, stats, history, now, summary.streak, summary.learnedCount]);

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.flex}>
          <AppText variant="headline">{username ? `Olá, ${username}!` : 'Moji Dojo'}</AppText>
          <AppText variant="caption" color="muted">
            {username ? 'もじどうじょう · Moji Dojo' : 'もじどうじょう'}
          </AppText>
          <View style={styles.badge}>
            <PetalsBadge onPress={() => router.push('/mochi')} />
          </View>
        </View>
        <PressableScale accessibilityRole="button" accessibilityLabel="Meu Mochi" onPress={() => router.push('/mochi')}>
          <Mascot mood={felt.mood} size={96} interactive />
        </PressableScale>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Ajustes"
          onPress={() => router.push('/settings')}
          hitSlop={8}
          style={styles.gear}
        >
          <AppText>⚙️</AppText>
        </PressableScale>
      </View>
      <TodayCard summary={summary} now={now} />
      <DailyPlanCard dueKana={summary.dueCount} now={now} />
      <JourneyCard />
      <StatsCard
        streak={summary.streak}
        bestStreak={metrics.best}
        studiedDays={days.length}
        accuracy={metrics.accuracy}
        strip={metrics.strip}
      />
      <LeechCard />
      <EvolutionCard evolution={metrics.evolution} answers={metrics.answers} />
      <ProgressCard progress={progress} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start', marginTop: spacing.xs },
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  gear: { alignSelf: 'flex-start', padding: spacing.xs },
});
