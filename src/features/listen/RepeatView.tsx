import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Bold, Card, ChipRow } from '@/components';
import { ALL_TRAVEL as TRAVEL_CATEGORIES } from '@/content/travel';
import { PhraseCard } from '@/features/phrases/PhraseCard';
import { useProgressStore } from '@/store';
import { spacing } from '@/theme';

const CATEGORY_OPTIONS = TRAVEL_CATEGORIES.map((c) => ({ value: c.category, label: c.category }));

/**
 * Shadowing: ouvir uma frase, repetir em voz alta imitando ritmo e tom, e marcar como saiu.
 * O app não escuta a pessoa, então a avaliação é dela mesma.
 */
export function RepeatView() {
  const [category, setCategory] = useState(TRAVEL_CATEGORIES[0]?.category ?? '');
  const shadow = useProgressStore((s) => s.shadow);
  const rateShadow = useProgressStore((s) => s.rateShadow);
  const current = TRAVEL_CATEGORIES.find((c) => c.category === category) ?? TRAVEL_CATEGORIES[0];

  return (
    <View style={styles.root}>
      <Card enterIndex={0}>
        <AppText variant="title">Como fazer (shadowing)</AppText>
        <AppText>
          1. Toque em <Bold>Ouvir</Bold> ou em <Bold>Devagar</Bold>.
        </AppText>
        <AppText>2. Repita em voz alta logo em seguida, imitando o ritmo e o tom, como um eco.</AppText>
        <AppText>3. Marque como saiu. O app não escuta você, então a avaliação é sua: seja honesto.</AppText>
      </Card>

      <ChipRow options={CATEGORY_OPTIONS} value={category} onChange={setCategory} />

      {/* A chave refaz a entrada dos cartões ao trocar de categoria. */}
      <View key={category} style={styles.list}>
        {current?.phrases.map((phrase, i) => (
          <PhraseCard
            key={phrase.jp}
            phrase={phrase}
            enterIndex={Math.min(i, 6)}
            rating={{ value: shadow[phrase.jp], onChange: (r) => rateShadow(phrase.jp, r) }}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.md },
  list: { gap: spacing.md },
});
