import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, ChipRow } from '@/components';
import { TRAVEL_CATEGORIES } from '@/data/travel';
import { spacing } from '@/theme';
import { PhraseCard } from './PhraseCard';

const CATEGORY_OPTIONS = TRAVEL_CATEGORIES.map((c) => ({ value: c.category, label: c.category }));

/** Frases prontas para a viagem, por categoria, com áudio e “Palavra por palavra”. */
export function TravelView() {
  const [category, setCategory] = useState(TRAVEL_CATEGORIES[0]?.category ?? '');
  const current = TRAVEL_CATEGORIES.find((c) => c.category === category) ?? TRAVEL_CATEGORIES[0];

  return (
    <View style={styles.root}>
      <AppText color="muted">
        Frases prontas para a viagem. Toque em “Palavra por palavra” para entender cada pedaço. Para treinar a fala, use a
        aba Ouvir, em Repetir.
      </AppText>
      <ChipRow options={CATEGORY_OPTIONS} value={category} onChange={setCategory} />
      {/* A chave refaz a entrada dos cartões ao trocar de categoria. */}
      <View key={category} style={styles.list}>
        {current?.phrases.map((phrase, i) => (
          <PhraseCard key={phrase.jp} phrase={phrase} breakdown enterIndex={Math.min(i, 6)} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.md },
  list: { gap: spacing.md },
});
