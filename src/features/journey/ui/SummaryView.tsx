import { useState } from 'react';
import { Share, StyleSheet, View } from 'react-native';
import { AppText, Bold, Button, Card, ChipRow } from '@/components';
import { useNow } from '@/hooks/useNow';
import { streakDays } from '@/features/streak/days';
import { bestStreak } from '@/features/stats/metrics';
import { useProgressStore } from '@/store';
import { spacing } from '@/theme';
import { levelOf, titleFor } from '../levels';
import { mochiComment, monthName, monthSummary, shareText, weekSummary, type PeriodSummary } from '../summary';
import { CalendarView } from './CalendarView';
import { SkillsCard } from './SkillsCard';

type Period = 'week' | 'last-week' | 'month' | 'last-month';

const PERIODS = [
  { value: 'week' as const, label: 'Esta semana' },
  { value: 'last-week' as const, label: 'Semana passada' },
  { value: 'month' as const, label: 'Este mês' },
  { value: 'last-month' as const, label: 'Mês passado' },
];

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <AppText style={styles.statValue}>{value}</AppText>
      <AppText variant="caption" color="muted">
        {label}
      </AppText>
    </View>
  );
}

/** Sequência, calendário, resumo da semana e do mês (a retrospectiva) e o botão de compartilhar. */
export function SummaryView() {
  const now = useNow();
  const date = new Date(now);
  const days = useProgressStore((s) => s.days);
  const history = useProgressStore((s) => s.history);
  const journey = useProgressStore((s) => s.journey);
  const [period, setPeriod] = useState<Period>('week');
  const [notice, setNotice] = useState<string | null>(null);

  const streak = streakDays(days, date, journey.restWeekdays);
  const best = Math.max(journey.bestStreak, bestStreak(days), streak);
  const summary: PeriodSummary =
    period === 'week'
      ? weekSummary(history, days, date)
      : period === 'last-week'
        ? weekSummary(history, days, date, 1)
        : period === 'month'
          ? monthSummary(history, days, date)
          : monthSummary(history, days, date, 1);
  const title =
    period === 'week'
      ? 'minha semana'
      : period === 'last-week'
        ? 'minha semana passada'
        : period === 'month'
          ? `meu ${monthName(date)}`
          : `meu ${monthName(date, 1)}`;
  const level = levelOf(journey.xp);

  const share = () => {
    const message = shareText({ title, summary, streak, level, levelTitle: titleFor(level), petals: journey.petals });
    // Fechar a folha de compartilhar sem escolher nada não é erro.
    Share.share({ message }).catch(() => setNotice('Não foi possível abrir o compartilhamento.'));
  };

  return (
    <View style={styles.root}>
      <Card enterIndex={0}>
        <AppText variant="title">Sequência</AppText>
        <View style={styles.stats}>
          <Stat label={streak === 1 ? 'dia seguido' : 'dias seguidos'} value={`🔥 ${streak}`} />
          <Stat label="recorde" value={`🏅 ${best}`} />
        </View>
        {journey.restWeekdays.length > 0 ? (
          <AppText variant="caption" color="muted">
            Seus dias de descanso não quebram a sequência (ajuste em Metas).
          </AppText>
        ) : null}
      </Card>

      <CalendarView days={days} rest={journey.restWeekdays} now={date} />

      <ChipRow wrap options={PERIODS} value={period} onChange={setPeriod} />
      <Card enterIndex={1}>
        <AppText variant="title">Retrospectiva</AppText>
        <View style={styles.stats}>
          <Stat label="dias de estudo" value={`${summary.studiedDays}/${summary.elapsedDays}`} />
          <Stat label="respostas" value={String(summary.answers)} />
          <Stat label="acertos" value={`${summary.accuracy}%`} />
        </View>
        {summary.learned > 0 ? (
          <AppText>
            <Bold>{summary.learned}</Bold> caracteres novos na revisão.
          </AppText>
        ) : null}
        {summary.bestDay ? (
          <AppText color="muted">
            Seu melhor dia foi {summary.bestDay.day.split('-').reverse().slice(0, 2).join('/')}, com {summary.bestDay.answers} respostas.
          </AppText>
        ) : null}
        <AppText>{mochiComment(summary)}</AppText>
        <Button label="Compartilhar este resumo" variant="soft" onPress={share} />
        {notice ? (
          <AppText color="bad" accessibilityLiveRegion="polite">
            {notice}
          </AppText>
        ) : null}
        <AppText variant="caption" color="muted">
          O texto compartilhado só tem números (dias, respostas, nível). Nada de nome nem de conteúdo seu.
        </AppText>
      </Card>
      <SkillsCard />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.md },
  stats: { flexDirection: 'row', gap: spacing.md },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 24, lineHeight: 32 },
});
