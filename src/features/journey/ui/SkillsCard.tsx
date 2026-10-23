import { View } from 'react-native';
import { AppText, Card, ProgressBar } from '@/components';
import { useProgressStore } from '@/store';
import { spacing } from '@/theme';
import { MIN_RETENTION_ANSWERS, retention, skillStats } from '../skills';

/** Acertos por habilidade e a retenção real (acertos em cartões que só voltam depois de 2 semanas ou mais). */
export function SkillsCard() {
  const counters = useProgressStore((s) => s.journey.counters);
  const stats = skillStats(counters);
  const kept = retention(counters);
  return (
    <Card>
      <AppText variant="title">Por habilidade</AppText>
      <AppText color="muted">Porcentagem de acertos em cada tipo de exercício, desde que esta contagem começou (versão 1.10).</AppText>
      <View style={{ gap: spacing.sm }}>
        {stats.map((s) => (
          <View key={s.skill} style={{ gap: spacing.xs }}>
            <AppText>
              {s.label}: {s.pct === null ? 'ainda sem respostas' : `${s.pct}% de ${s.total} respostas`}
            </AppText>
            <ProgressBar value={(s.pct ?? 0) / 100} />
          </View>
        ))}
      </View>
      <AppText variant="title">Retenção</AppText>
      <AppText color="muted">
        {kept.pct === null
          ? `Mede quanto você ainda lembra do que estudou há semanas. Aparece depois de ${MIN_RETENTION_ANSWERS} respostas em cartões antigos (${kept.answers} até agora).`
          : `Você acertou ${kept.pct}% dos cartões que voltaram depois de 2 semanas ou mais (${kept.answers} respostas).`}
      </AppText>
    </Card>
  );
}
