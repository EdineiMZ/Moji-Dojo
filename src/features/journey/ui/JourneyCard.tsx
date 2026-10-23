import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText, Bold, Button, Card, Mascot, ProgressBar } from '@/components';
import { formatDay } from '@/features/streak/days';
import { useNow } from '@/hooks/useNow';
import { plural } from '@/lib/plural';
import { useProgressStore } from '@/store';
import { spacing } from '@/theme';
import { roll, weekChestReady } from '../events';
import { missionsFor, WEEKLY_DAYS_GOAL } from '../missions';
import { buildContext } from '../track';

/**
 * O que a jornada põe na tela inicial: a oferta de salvar a sequência, as boas-vindas de quem volta de uma pausa e o
 * resumo do dia (meta, missões, semana).
 */
export function JourneyCard() {
  const router = useRouter();
  const now = useNow();
  const state = useProgressStore((s) => s);
  const declineRescue = useProgressStore((s) => s.declineRescue);
  const claim = useProgressStore((s) => s.claimWeekChest);
  const updateJourney = useProgressStore((s) => s.updateJourney);
  const date = new Date(now);
  const journey = roll(state.journey, date);
  const ctx = buildContext(state, state.days, now);
  const missions = missionsFor(formatDay(date));
  const claimed = missions.filter((m) => journey.today.claimed.includes(m.id)).length;
  const answers = journey.today.counts.answers ?? 0;
  const offer = journey.rescue && journey.rescue.day === formatDay(date) ? journey.rescue : null;
  const chest = weekChestReady(journey, ctx);

  return (
    <>
      {offer ? (
        <Card tone="lilac" enterIndex={0}>
          <View style={styles.row}>
            <View style={styles.flex}>
              <AppText variant="title">Sua sequência de {offer.broken} dias está em risco</AppText>
              <AppText>
                Faltaram {plural(offer.missed.length, 'dia', 'dias')}. Faça uma revisão de 25 perguntas com o que você errou há
                pouco e, com 70% de acertos, a sequência continua.
              </AppText>
            </View>
            <Mascot mood="sad" size={72} />
          </View>
          <Button label="Salvar a sequência" onPress={() => router.push('/rescue')} />
          <Button label="Deixar recomeçar" variant="ghost" onPress={declineRescue} />
        </Card>
      ) : null}

      {journey.welcome > 0 ? (
        <Card tone="pink" enterIndex={0}>
          <View style={styles.row}>
            <View style={styles.flex}>
              <AppText variant="title">Bem-vindo de volta!</AppText>
              <AppText>
                Faz {plural(journey.welcome, 'dia', 'dias')} que você não estudava. Sem pressa: comece por uma revisão leve, de
                10 itens, e o resto volta aos poucos.
              </AppText>
            </View>
            <Mascot mood="happy" size={72} />
          </View>
          <Button label="Revisão leve (10)" onPress={() => router.push({ pathname: '/review', params: { light: '1' } })} />
          <Button label="Dispensar" variant="ghost" onPress={() => updateJourney((j) => ({ ...j, welcome: 0 }))} />
        </Card>
      ) : null}

      <Card enterIndex={1}>
        <View style={styles.row}>
          <AppText variant="title" style={styles.flex}>
            Seu dia
          </AppText>
          <AppText>🌸 {journey.petals}</AppText>
        </View>
        <AppText variant="caption" color="muted">
          Meta: {Math.min(answers, journey.dailyGoal)} de {journey.dailyGoal} respostas{journey.today.goalDone ? ' ✓' : ''}
        </AppText>
        <ProgressBar value={Math.min(answers / journey.dailyGoal, 1)} height={8} />
        <AppText>
          Missões: <Bold>{claimed}</Bold> de {missions.length} · Semana: <Bold>{ctx.weekDays}</Bold> de {WEEKLY_DAYS_GOAL} dias
        </AppText>
        {chest ? <Button label="🎁 Abrir o baú da semana" onPress={() => claim()} /> : null}
        <Button label="Ver metas e conquistas" variant="soft" onPress={() => router.push({ pathname: '/mochi', params: { tab: 'goals' } })} />
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: spacing.xs },
});
