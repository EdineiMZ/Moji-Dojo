import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText, Bold, Button, Card, Mascot, ProgressBar } from '@/components';
import { formatDay } from '@/features/streak/days';
import { useNow } from '@/hooks/useNow';
import { plural } from '@/lib/plural';
import { requestPermission } from '@/features/reminders/scheduler';
import { useProgressStore, useSettingsStore } from '@/store';
import { spacing } from '@/theme';
import { roll, weekChestReady } from '../events';
import { todaysMissions, WEEKLY_DAYS_GOAL } from '../missions';
import { buildContext } from '../track';
import { useChestUi } from '../chestUi';

/**
 * O que a jornada põe na tela inicial: a oferta de salvar a sequência, as boas-vindas de quem volta de uma pausa e o
 * resumo do dia (meta, missões, semana).
 */
export function JourneyCard() {
  const router = useRouter();
  const now = useNow();
  const state = useProgressStore((s) => s);
  const declineRescue = useProgressStore((s) => s.declineRescue);
  const requestChest = useChestUi((s) => s.request);
  const dailyChest = useProgressStore((s) => s.journey.today.chest === 'ready');
  const updateJourney = useProgressStore((s) => s.updateJourney);
  const reminders = useSettingsStore((s) => s.reminders);
  const setReminders = useSettingsStore((s) => s.setReminders);
  const date = new Date(now);
  const journey = roll(state.journey, date);
  const ctx = buildContext(state, state.days, now);
  const missions = todaysMissions(journey.today);
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
              <AppText variant="title">Sua sequência de {offer.broken} dias foi interrompida</AppText>
              <AppText>
                Você pulou {plural(offer.missed.length, 'dia', 'dias')}. Faça uma revisão de 25 perguntas com o que você errou há
                pouco e, com 70% de acertos, os {offer.broken} dias voltam a valer. Sem isso, a contagem recomeça do 1.
              </AppText>
            </View>
            <Mascot mood="sad" size={72} />
          </View>
          <Button label="Salvar a sequência" variant="soft" onPress={() => router.push('/rescue')} />
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
          <Button label="Revisão leve (10)" variant="soft" onPress={() => router.push({ pathname: '/review', params: { light: '1' } })} />
          <Button label="Dispensar" variant="ghost" onPress={() => updateJourney((j) => ({ ...j, welcome: 0 }))} />
        </Card>
      ) : null}

      {!reminders.asked && state.days.length >= 2 ? (
        <Card enterIndex={1}>
          <AppText variant="title">Quer um lembrete diário?</AppText>
          <AppText>
            O Mochi avisa no horário que você escolher, sem pressão. Dá para mudar o horário ou desligar em Ajustes.
          </AppText>
          <Button
            label="Ativar lembretes"
            variant="soft"
            onPress={() =>
              void requestPermission().then((granted) => setReminders({ enabled: granted, asked: true }))
            }
          />
          <Button label="Agora não" variant="ghost" onPress={() => setReminders({ asked: true })} />
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
          Missões: <Bold>{claimed}</Bold> de {missions.length} · Esta semana (seg. a dom.): <Bold>{ctx.weekDays}</Bold> de {WEEKLY_DAYS_GOAL} dias de estudo
        </AppText>
        {chest ? <Button label="🎁 Abrir o baú da semana" variant="soft" onPress={() => requestChest('weekly')} /> : null}
        {dailyChest ? <Button label="🎁 Abrir o baú do dia" variant="soft" onPress={() => requestChest('daily')} /> : null}
        <Button label="Ver metas e conquistas" variant="ghost" onPress={() => router.push({ pathname: '/mochi', params: { tab: 'goals' } })} />
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: spacing.xs },
});
