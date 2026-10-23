import { useMemo } from 'react';
import { View } from 'react-native';
import { AppText, Card } from '@/components';
import { useProgressStore } from '@/store';
import { spacing } from '@/theme';
import { findLeeches } from './leeches';

const MAX_SHOWN = 5;

/** "Teimosos": o que você esquece sempre, com outra abordagem para cada tipo. Só aparece quando há algum. */
export function LeechCard() {
  const srs = useProgressStore((s) => s.srs);
  const vocab = useProgressStore((s) => s.vocab);
  const conj = useProgressStore((s) => s.conj);
  const particles = useProgressStore((s) => s.particles);
  const leeches = useMemo(() => findLeeches({ srs, vocab, conj, particles }), [srs, vocab, conj, particles]);
  if (leeches.length === 0) return null;
  const shown = leeches.slice(0, MAX_SHOWN);
  return (
    <Card>
      <AppText variant="title">Itens teimosos</AppText>
      <AppText color="muted">
        Estes você esquece sempre. Repetir do mesmo jeito não está funcionando: tente outra abordagem. Eles voltam mais cedo na revisão até firmarem.
      </AppText>
      <View style={{ gap: spacing.sm }}>
        {shown.map((l) => (
          <View key={`${l.area}-${l.label}`}>
            <AppText>
              {l.label} <AppText color="muted">· esquecido {l.lapses}×</AppText>
            </AppText>
            <AppText variant="caption" color="muted">
              {l.tip}
            </AppText>
          </View>
        ))}
      </View>
      {leeches.length > MAX_SHOWN ? (
        <AppText variant="caption" color="muted">
          E mais {leeches.length - MAX_SHOWN}.
        </AppText>
      ) : null}
    </Card>
  );
}
