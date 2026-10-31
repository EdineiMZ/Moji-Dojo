import { useMemo } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText, Button, Card, ProgressBar } from '@/components';
import { useProgressStore } from '@/store';
import { spacing } from '@/theme';
import { levelPaths } from '../milestones';

/** O caminho N5 → N4 → N3: quanto de cada marco já está firme (caixa 3 ou mais na revisão). */
export function LevelPathCard() {
  const router = useRouter();
  const srs = useProgressStore((s) => s.srs);
  const vocab = useProgressStore((s) => s.vocab);
  const conj = useProgressStore((s) => s.conj);
  const mastered = useProgressStore((s) => s.mastered);
  const reads = useProgressStore((s) => s.reads);
  const paths = useMemo(() => levelPaths(srs, vocab, conj, mastered, reads), [srs, vocab, conj, mastered, reads]);
  return (
    <Card>
      <AppText variant="title">Caminho por nível</AppText>
      <AppText color="muted">Do N5 ao N3, em marcos que você enxerga. Conta o que já está firme na revisão.</AppText>
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
      <Button label="Fazer o teste de nivelamento" variant="soft" onPress={() => router.push('/placement')} />
    </Card>
  );
}
