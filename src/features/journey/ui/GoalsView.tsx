import { StyleSheet, View } from 'react-native';
import { AppText, Bold, Button, Card, ChipRow, PressableScale, ProgressBar } from '@/components';
import { useNow } from '@/hooks/useNow';
import { useProgressStore } from '@/store';
import { fonts, radii, spacing, useTheme } from '@/theme';
import { DAILY_GOALS } from '../journey';
import { ALL_MISSIONS_BONUS, challengeFor, MISSION_PETALS, missionsFor, WEEKLY_DAYS_GOAL, WEEKLY_PETALS } from '../missions';
import { formatDay } from '@/features/streak/days';
import { buildContext } from '../track';
import { roll, weekChestReady } from '../events';
import { weekDays } from '../week';

const WEEKDAYS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'] as const;

/** Metas: meta diária, missões do dia, meta e baú da semana, desafio temático e dias de descanso. */
export function GoalsView() {
  const { colors } = useTheme();
  const now = useNow();
  const state = useProgressStore((s) => s);
  const claim = useProgressStore((s) => s.claimWeekChest);
  const updateJourney = useProgressStore((s) => s.updateJourney);
  const date = new Date(now);
  // O dia e a semana de hoje: se o aluno ainda não fez nada hoje, os contadores guardados são de outro dia e valem zero.
  const journey = roll(state.journey, date);
  const ctx = buildContext(state, state.days, now);
  const counts = journey.today.counts;
  const answers = counts.answers ?? 0;
  const missions = missionsFor(formatDay(date));
  const challenge = challengeFor(date);
  const strip = weekDays(state.days, date);
  const chestReady = weekChestReady(journey, ctx);

  return (
    <View style={styles.root}>
      <Card enterIndex={0}>
        <AppText variant="title">Meta do dia</AppText>
        <AppText color="muted">
          Quantas respostas você quer dar por dia? Bater a meta rende 🌸 5.
        </AppText>
        <ChipRow
          options={DAILY_GOALS.map((n) => ({ value: String(n), label: `${n} respostas` }))}
          value={String(journey.dailyGoal)}
          onChange={(v) => updateJourney((j) => ({ ...j, dailyGoal: Number(v) }))}
        />
        <ProgressBar value={Math.min(answers / journey.dailyGoal, 1)} />
        <AppText variant="caption" color="muted">
          {Math.min(answers, journey.dailyGoal)} de {journey.dailyGoal} hoje{journey.today.goalDone ? ' ✓' : ''}
        </AppText>
      </Card>

      <Card enterIndex={1}>
        <AppText variant="title">Missões de hoje</AppText>
        {missions.map((m) => {
          const got = Math.min(counts[m.counter] ?? 0, m.goal);
          const claimed = journey.today.claimed.includes(m.id);
          return (
            <View key={m.id} style={styles.mission}>
              <AppText>
                {claimed ? '✅ ' : ''}
                {m.title}
              </AppText>
              <ProgressBar value={m.goal > 0 ? got / m.goal : 0} height={8} />
              <AppText variant="caption" color="muted">
                {got} de {m.goal}
                {claimed ? ` · +${MISSION_PETALS} 🌸` : ''}
              </AppText>
            </View>
          );
        })}
        <AppText variant="caption" color="muted">
          Cada missão rende 🌸 {MISSION_PETALS}; as três juntas dão mais 🌸 {ALL_MISSIONS_BONUS}. Elas se resgatam sozinhas.
        </AppText>
      </Card>

      <Card enterIndex={2}>
        <AppText variant="title">Meta da semana</AppText>
        <AppText color="muted">
          Estude em {WEEKLY_DAYS_GOAL} dias da semana (segunda a domingo) para abrir o baú: 🌸 {WEEKLY_PETALS} e, em semanas
          alternadas, um item.
        </AppText>
        <View style={styles.strip}>
          {strip.map((d) => (
            <View
              key={d.day}
              style={[
                styles.dot,
                {
                  backgroundColor: d.studied ? colors.primary : colors.surface,
                  borderColor: d.studied ? colors.primary : colors.line,
                  opacity: d.future ? 0.5 : 1,
                },
              ]}
            >
              <AppText variant="caption" color={d.studied ? 'onPrimary' : 'muted'}>
                {d.label}
              </AppText>
            </View>
          ))}
        </View>
        <AppText variant="caption" color="muted">
          {ctx.weekDays} de {WEEKLY_DAYS_GOAL} dias · semanas cumpridas: {journey.weeksWon}
        </AppText>
        {journey.week.claimed ? (
          <AppText color="ok">Baú desta semana já aberto ✓</AppText>
        ) : chestReady ? (
          <Button label="🎁 Abrir o baú da semana" onPress={() => claim()} />
        ) : null}
      </Card>

      <Card enterIndex={3}>
        <AppText variant="title">Desafio da semana</AppText>
        <AppText>
          Tema: <Bold>{challenge.group}</Bold>
        </AppText>
        <AppText color="muted">
          Acerte {challenge.goal} perguntas de vocabulário desse grupo (aba Frases → Palavras). Prêmio: 🌸 {challenge.petals}.
        </AppText>
        <ProgressBar value={Math.min(journey.week.challenge / challenge.goal, 1)} />
        <AppText variant="caption" color="muted">
          {Math.min(journey.week.challenge, challenge.goal)} de {challenge.goal}
          {journey.week.challengeClaimed ? ' ✓' : ''}
        </AppText>
      </Card>

      <Card enterIndex={4}>
        <AppText variant="title">Dias de descanso</AppText>
        <AppText color="muted">
          Em um dia de descanso, não estudar não quebra a sua sequência (e ele também não conta como dia estudado). Bom para
          quem tem uma folga fixa.
        </AppText>
        <View style={styles.strip}>
          {WEEKDAYS.map((label, index) => {
            const on = journey.restWeekdays.includes(index);
            return (
              <PressableScale
                key={label}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                accessibilityLabel={`${label}: ${on ? 'dia de descanso' : 'dia normal'}`}
                onPress={() =>
                  updateJourney((j) => ({
                    ...j,
                    restWeekdays: (j.restWeekdays.includes(index) ? j.restWeekdays.filter((d) => d !== index) : [...j.restWeekdays, index]).sort(),
                  }))
                }
                style={[styles.rest, { backgroundColor: on ? colors.primary : colors.surface, borderColor: on ? colors.primary : colors.line }]}
              >
                <AppText style={{ fontFamily: fonts.bold }} color={on ? 'onPrimary' : 'ink'}>
                  {label}
                </AppText>
              </PressableScale>
            );
          })}
        </View>
        {journey.restWeekdays.length >= 6 ? (
          <AppText variant="caption" color="muted">
            Com 6 ou 7 dias de descanso a regra deixa de valer, para a sequência não ficar sem sentido.
          </AppText>
        ) : null}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.md },
  mission: { gap: spacing.xs },
  strip: { flexDirection: 'row', gap: spacing.xs },
  dot: { flex: 1, minHeight: 44, borderRadius: radii.md, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  rest: { flex: 1, minHeight: 48, borderRadius: radii.md, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
});
