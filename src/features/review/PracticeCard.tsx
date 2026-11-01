import { useMemo } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText, Button, Card } from '@/components';
import { useProgressStore } from '@/store';
import { spacing } from '@/theme';
import { confusedPairs } from './confusions';
import { knownKana, MIN_KNOWN_FOR_WORDS, readableWords } from './readWords';

/** Atalhos dos treinos extras. Cada um só aparece quando há o que treinar. */
export function PracticeCard() {
  const router = useRouter();
  const confusions = useProgressStore((s) => s.confusions);
  const srs = useProgressStore((s) => s.srs);
  const pairs = useMemo(() => confusedPairs(confusions), [confusions]);
  const words = useMemo(() => {
    const known = knownKana(Object.keys(srs));
    return known.size >= MIN_KNOWN_FOR_WORDS ? readableWords(known).length : 0;
  }, [srs]);
  if (pairs.length === 0 && words < 4) return null;
  return (
    <Card>
      <AppText variant="title">Treinos extras</AppText>
      <View style={{ gap: spacing.sm }}>
        {pairs.length > 0 ? (
          <>
            <AppText color="muted">
              Você costuma trocar {pairs.slice(0, 3).map((p) => `${p.a} e ${p.b}`).join(', ')}
              {pairs.length > 3 ? ' e outros' : ''}. Treine só esses pares, lado a lado.
            </AppText>
            <Button label={`Pares confusos (${pairs.length})`} variant="soft" onPress={() => router.push({ pathname: '/practice', params: { kind: 'confusions' } })} />
          </>
        ) : null}
        {words >= 4 ? (
          <>
            <AppText color="muted">Leia palavras de verdade, feitas só com os kana que você já aprendeu.</AppText>
            <Button label="Ler palavras" variant="soft" onPress={() => router.push({ pathname: '/practice', params: { kind: 'words' } })} />
          </>
        ) : null}
      </View>
    </Card>
  );
}
