import { StyleSheet, View } from 'react-native';
import { AppText, Bold, Card, ProgressBar } from '@/components';
import { useNow } from '@/hooks/useNow';
import { useProgressStore } from '@/store';
import { fonts, spacing, useTheme } from '@/theme';
import { ACHIEVEMENTS } from '../achievements';
import { achievementContext } from '../events';
import { ITEMS } from '../items';
import { buildContext } from '../track';

const formatDate = (at: number): string => {
  const d = new Date(at);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

/** Estante de conquistas: as ganhas (com a data), as que faltam (com o progresso) e as escondidas. */
export function AchievementsView() {
  const { colors } = useTheme();
  const now = useNow();
  const state = useProgressStore((s) => s);
  const ctx = achievementContext(state.journey, buildContext(state, state.days, now));
  const earned = state.journey.achievements;
  const total = ACHIEVEMENTS.length;
  const count = ACHIEVEMENTS.filter((a) => earned[a.id] !== undefined).length;

  const ordered = [...ACHIEVEMENTS].sort((a, b) => {
    const ea = earned[a.id];
    const eb = earned[b.id];
    if (ea !== undefined && eb !== undefined) return eb - ea;
    if (ea !== undefined) return -1;
    if (eb !== undefined) return 1;
    return 0;
  });

  return (
    <View style={styles.root}>
      <Card enterIndex={0}>
        <AppText variant="title">
          {count} de {total} conquistas
        </AppText>
        <ProgressBar value={count / total} />
        <AppText variant="caption" color="muted">
          Algumas dão um item exclusivo para o Mochi. As escondidas aparecem quando você as ganha.
        </AppText>
      </Card>

      {ordered.map((a, i) => {
        const at = earned[a.id];
        const done = at !== undefined;
        const item = ITEMS.find((it) => it.source.kind === 'achievement' && it.source.achievement === a.id);
        const [now, goal] = a.progress?.(ctx) ?? [done ? 1 : 0, 1];
        if (a.hidden && !done) {
          return (
            <Card key={a.id} enterIndex={Math.min(i, 6)} style={{ opacity: 0.6 }}>
              <AppText style={styles.name}>🔒 Conquista escondida</AppText>
              <AppText variant="caption" color="muted">
                Continue estudando e descubra.
              </AppText>
            </Card>
          );
        }
        return (
          <Card key={a.id} enterIndex={Math.min(i, 6)} style={done ? undefined : { opacity: 0.9 }}>
            <View style={styles.head}>
              <AppText style={styles.name}>
                {done ? '🏆 ' : ''}
                {a.title}
              </AppText>
              {done ? (
                <AppText variant="caption" color="ok">
                  {formatDate(at)}
                </AppText>
              ) : null}
            </View>
            <AppText color="muted">{a.text}</AppText>
            {!done && a.progress ? (
              <View style={styles.progress}>
                <ProgressBar value={goal > 0 ? now / goal : 0} height={8} />
                <AppText variant="caption" color="muted">
                  {now} de {goal}
                </AppText>
              </View>
            ) : null}
            <View style={[styles.reward, { borderColor: colors.line }]}>
              <AppText variant="caption" color="muted">
                Prêmio: <Bold>🌸 {a.petals}</Bold>
                {item ? (
                  <>
                    {' '}
                    e o item <Bold>{item.name}</Bold>
                  </>
                ) : null}
              </AppText>
            </View>
          </Card>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.md },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
  name: { fontFamily: fonts.bold, fontSize: 17, flexShrink: 1 },
  progress: { gap: spacing.xs },
  reward: { borderTopWidth: 1, paddingTop: spacing.sm },
});
