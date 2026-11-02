import { useMemo } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText, Button, Card } from '@/components';
import { findLeeches } from '@/features/leeches/leeches';
import { useProgressStore } from '@/store';
import { spacing } from '@/theme';
import { brakeFor } from './brake';

/** Sugestão (sem bloquear) de revisar antes de uma lição nova, quando o acerto cai ou os teimosos crescem. */
export function BrakeNotice() {
  const router = useRouter();
  const history = useProgressStore((s) => s.history);
  const srs = useProgressStore((s) => s.srs);
  const vocab = useProgressStore((s) => s.vocab);
  const conj = useProgressStore((s) => s.conj);
  const particles = useProgressStore((s) => s.particles);
  const trend = useProgressStore((s) => s.leechTrend);
  const brake = useMemo(
    () => brakeFor(history, findLeeches({ srs, vocab, conj, particles }).length, new Date(), trend),
    [history, srs, vocab, conj, particles, trend],
  );
  if (!brake) return null;
  return (
    <Card>
      <AppText variant="title">Vá com calma</AppText>
      <AppText>{brake.message}</AppText>
      <View style={{ gap: spacing.sm }}>
        <Button label="Revisar agora" onPress={() => router.push('/review')} />
        <AppText variant="caption" color="muted">
          É só uma sugestão: você pode seguir com a lição quando quiser.
        </AppText>
      </View>
    </Card>
  );
}
