import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText, Bold, Button, Card } from '@/components';
import { SCRIPT_NAMES } from '@/features/catalog';
import { formatReviewTime } from '@/features/review/format';
import { fonts, radii, spacing, useTheme } from '@/theme';
import { REVIEW_BATCH, type TodaySummary } from './summary';

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

interface TodayCardProps {
  summary: TodaySummary;
  now: number;
}

/** "Estudar hoje": o que fazer agora, os dias seguidos e quando vence a próxima revisão. */
export function TodayCard({ summary, now }: TodayCardProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const { dueCount, learnedCount, streak, nextLesson, upcoming } = summary;

  const heading = dueCount
    ? `${plural(dueCount, 'revisão esperando', 'revisões esperando')} você`
    : learnedCount
      ? 'Nenhuma revisão pendente'
      : 'Comece pela primeira lição';

  const body = dueCount
    ? 'Primeiro as revisões: são caracteres que você já aprendeu e está na hora de relembrar. Depois, se der tempo, uma lição nova.'
    : nextLesson
      ? `Próximo passo: lição ${nextLesson.index + 1} de ${SCRIPT_NAMES[nextLesson.script]}, ${nextLesson.lesson.title}.`
      : 'Você terminou todas as trilhas. Mantenha as revisões em dia.';

  return (
    <Card tone="pink" enterIndex={0}>
      <View style={styles.top}>
        <View style={styles.flex}>
          <AppText variant="caption" color="muted">
            ESTUDAR HOJE
          </AppText>
          <AppText variant="title">{heading}</AppText>
        </View>
        <View style={[styles.streak, { backgroundColor: colors.surface }]}>
          <AppText style={styles.streakNumber} color="primary">
            {streak}
          </AppText>
          <AppText variant="caption" color="muted">
            {streak === 1 ? 'dia seguido' : 'dias seguidos'}
          </AppText>
        </View>
      </View>

      <AppText color="muted">{body}</AppText>

      {upcoming ? (
        <View style={[styles.notice, { backgroundColor: colors.skySoft }]}>
          <AppText variant="caption">
            <Bold>{dueCount ? 'Depois dessas, a próxima revisão: ' : 'Próxima revisão: '}</Bold>
            {formatReviewTime(upcoming.at, now)} · {plural(upcoming.count, 'caractere', 'caracteres')}
          </AppText>
        </View>
      ) : null}

      <View style={styles.actions}>
        {dueCount ? (
          <Button label={`Revisar agora (${Math.min(dueCount, REVIEW_BATCH)})`} onPress={() => router.push('/review')} />
        ) : null}
        {nextLesson ? (
          <Button
            label={`${dueCount ? 'Depois: ' : ''}Lição ${nextLesson.index + 1}: ${nextLesson.lesson.title}`}
            variant={dueCount ? 'soft' : 'primary'}
            onPress={() => router.push({ pathname: '/lesson/[id]', params: { id: nextLesson.lesson.id } })}
          />
        ) : null}
        {!dueCount && learnedCount ? (
          <Button
            label="Revisão extra"
            variant="ghost"
            onPress={() => router.push({ pathname: '/review', params: { extra: '1' } })}
          />
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  top: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  streak: { alignItems: 'center', paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radii.md },
  streakNumber: { fontFamily: fonts.bold, fontSize: 28, lineHeight: 32 },
  notice: { borderRadius: radii.md, paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  actions: { gap: spacing.sm },
});
