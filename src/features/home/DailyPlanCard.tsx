import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText, Card, PressableScale } from '@/components';
import { dueCards as conjDue } from '@/features/conjugation/cards';
import { dueCards as vocabDue } from '@/features/vocab/cards';
import { useProgressStore } from '@/store';
import { fonts, radii, spacing, useTheme } from '@/theme';
import { dailyPlan } from './dailyPlan';

/** A sessão do dia em quatro passos (revisar, algo novo, ouvir, uma frase), marcados pelo que já foi feito hoje. */
export function DailyPlanCard({ dueKana, now }: { dueKana: number; now: number }) {
  const router = useRouter();
  const { colors } = useTheme();
  const counts = useProgressStore((s) => s.journey.today.counts);
  const vocab = useProgressStore((s) => s.vocab);
  const conj = useProgressStore((s) => s.conj);
  const particles = useProgressStore((s) => s.particles);

  const dueOther = useMemo(
    () => vocabDue(vocab, now).length + conjDue(conj, now).length + Object.values(particles).filter((p) => p.due <= now).length,
    [vocab, conj, particles, now],
  );
  const steps = dailyPlan({ counts, dueKana, dueOther });
  const done = steps.filter((s) => s.done).length;

  return (
    <Card>
      <AppText variant="title">Sessão de hoje</AppText>
      <AppText color="muted">
        {done === steps.length ? 'Sessão completa. O resto do dia é bônus.' : `${done} de ${steps.length} passos · uns 15 a 20 minutos`}
      </AppText>
      <View style={styles.list}>
        {steps.map((step, i) => (
          <PressableScale
            key={step.id}
            accessibilityRole="button"
            accessibilityLabel={`${step.title}. ${step.done ? 'Feito' : step.hint}`}
            onPress={() => router.push(step.route)}
            style={[styles.step, { borderColor: step.done ? colors.ok : colors.line, backgroundColor: step.done ? colors.okSoft : colors.surface }]}
          >
            <AppText style={{ fontFamily: fonts.bold }}>{step.done ? '✓' : String(i + 1)}</AppText>
            <View style={styles.flex}>
              <AppText>{step.title}</AppText>
              <AppText variant="caption" color={step.done ? 'ok' : 'muted'}>
                {step.done ? 'feito' : step.hint}
              </AppText>
            </View>
          </PressableScale>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.xs },
  flex: { flex: 1 },
  step: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderWidth: 1.5, borderRadius: radii.md, paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
});
