import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText, Card, PressableScale, ProgressBar } from '@/components';
import { dueCards as conjDue } from '@/features/conjugation/cards';
import { dueCards as vocabDue } from '@/features/vocab/cards';
import { minutesLeft, minutesOf } from '@/features/profile/studyTimer';
import { useProgressStore, useSettingsStore } from '@/store';
import { fonts, radii, spacing, useTheme } from '@/theme';
import { dailyPlan } from './dailyPlan';

/** A sessão do dia em quatro passos (revisar, algo novo, ouvir, uma frase), marcados pelo que já foi feito hoje. */
export function DailyPlanCard({ dueKana, now, embedded = false }: { dueKana: number; now: number; embedded?: boolean }) {
  const router = useRouter();
  const { colors } = useTheme();
  const counts = useProgressStore((s) => s.journey.today.counts);
  const goalMinutes = useSettingsStore((s) => s.profile.goalMinutes);
  const seconds = counts.seconds ?? 0;
  const vocab = useProgressStore((s) => s.vocab);
  const conj = useProgressStore((s) => s.conj);
  const particles = useProgressStore((s) => s.particles);

  const dueOther = useMemo(
    () => vocabDue(vocab, now).length + conjDue(conj, now).length + Object.values(particles).filter((p) => p.due <= now).length,
    [vocab, conj, particles, now],
  );
  // Dentro do cartão "Estudar hoje", que já tem o botão de revisar o kana, esse passo não se repete.
  const steps = dailyPlan({ counts, dueKana, dueOther }).filter((st) => !(embedded && st.id === 'review' && dueKana > 0 && dueOther === 0));
  // O passo sem nada a fazer (ex.: nenhuma revisão vencida) não entra na conta de passos.
  const counted = steps.filter((s) => !s.idle);
  const done = counted.filter((s) => s.done).length;

  const body = (
    <>
      {embedded ? (
        <AppText variant="caption" color="muted">
          SESSÃO DE HOJE
        </AppText>
      ) : (
        <AppText variant="title">Sessão de hoje</AppText>
      )}
      {goalMinutes > 0 ? (
        <View style={styles.goal}>
          <ProgressBar value={Math.min(1, seconds / (goalMinutes * 60))} />
          <AppText variant="caption" color="muted">
            {minutesLeft(goalMinutes, seconds) === 0 ? `Meta de ${goalMinutes} min batida!` : `${minutesOf(seconds)} de ${goalMinutes} min · faltam ${minutesLeft(goalMinutes, seconds)}`}
          </AppText>
        </View>
      ) : null}
      <AppText color="muted">
        {done === counted.length ? 'Sessão completa. O resto do dia é bônus.' : `${done} de ${counted.length} passos · uns 15 a 20 minutos`}
      </AppText>
      <View style={styles.list}>
        {steps.map((step) => (
          <PressableScale
            key={step.id}
            accessibilityRole="button"
            accessibilityLabel={`${step.title}. ${step.idle ? step.hint : step.done ? 'Feito' : step.hint}`}
            onPress={() => router.push(step.route)}
            style={[styles.step, { borderColor: step.done && !step.idle ? colors.ok : colors.line, backgroundColor: step.done && !step.idle ? colors.okSoft : colors.surface }]}
          >
            <AppText color={step.idle ? 'muted' : 'ink'} style={{ fontFamily: fonts.bold }}>
              {step.idle ? '–' : step.done ? '✓' : String(counted.indexOf(step) + 1)}
            </AppText>
            <View style={styles.flex}>
              <AppText color={step.idle ? 'muted' : 'ink'}>{step.title}</AppText>
              <AppText variant="caption" color={step.done && !step.idle ? 'ok' : 'muted'}>
                {step.idle ? step.hint : step.done ? 'feito' : step.hint}
              </AppText>
            </View>
          </PressableScale>
        ))}
      </View>
    </>
  );

  return embedded ? <View style={styles.embedded}>{body}</View> : <Card>{body}</Card>;
}

const styles = StyleSheet.create({
  embedded: { gap: spacing.md },
  list: { gap: spacing.xs },
  goal: { gap: spacing.xs },
  flex: { flex: 1 },
  step: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderWidth: 1.5, borderRadius: radii.md, paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
});
