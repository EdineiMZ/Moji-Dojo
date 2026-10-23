import { useMemo } from 'react';
import { View } from 'react-native';
import { AppText, Card, ProgressBar } from '@/components';
import { useProgressStore } from '@/store';
import { spacing } from '@/theme';
import { levelPaths } from '../milestones';

/** O caminho N5 → N4: quanto de cada marco já está firme (caixa 3 ou mais na revisão). */
export function LevelPathCard() {
  const srs = useProgressStore((s) => s.srs);
  const vocab = useProgressStore((s) => s.vocab);
  const paths = useMemo(() => levelPaths(srs, vocab), [srs, vocab]);
  return (
    <Card>
      <AppText variant="title">Caminho por nível</AppText>
      <AppText color="muted">Do N5 ao N4, em marcos que você enxerga. Conta o que já está firme na revisão.</AppText>
      {paths.map((path) => (
        <View key={path.level} style={{ gap: spacing.sm }}>
          <AppText variant="caption" color="muted">
            {path.title.toUpperCase()}
          </AppText>
          {path.milestones.map((m) => (
            <View key={m.id} style={{ gap: spacing.xs }}>
              <AppText>
                {m.label}: {m.have} de {m.goal}
              </AppText>
              <ProgressBar value={m.goal ? m.have / m.goal : 0} />
            </View>
          ))}
        </View>
      ))}
    </Card>
  );
}
