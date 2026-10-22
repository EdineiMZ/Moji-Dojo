import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppText, Confetti, PetalRain, Screen } from '@/components';
import { ReviewSession, type ReviewCelebration } from '@/features/review/ReviewSession';
import { reviewTitle } from '@/features/review/session';
import { spacing } from '@/theme';

export default function ReviewScreen() {
  const router = useRouter();
  const { extra } = useLocalSearchParams<{ extra?: string }>();
  const isExtra = extra === '1';
  const [drawing, setDrawing] = useState(false);
  const [celebration, setCelebration] = useState<ReviewCelebration>({ petals: false, confetti: false });

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <View style={styles.root}>
      <Screen scrollEnabled={!drawing}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" onPress={goBack} hitSlop={8}>
            <AppText color="primary">← Voltar</AppText>
          </Pressable>
          <AppText variant="caption" color="muted">
            ESTUDAR HOJE
          </AppText>
          <AppText variant="headline">{reviewTitle(isExtra)}</AppText>
        </View>
        {/* A chave reinicia a sessão se a tela for reaberta no outro modo. */}
        <ReviewSession
          key={String(isExtra)}
          extra={isExtra}
          onExit={goBack}
          onCelebrate={setCelebration}
          onDrawingChange={setDrawing}
        />
      </Screen>
      {/* Fora da rolagem, para cobrir a tela inteira. */}
      {celebration.petals ? <PetalRain /> : null}
      {celebration.confetti ? <Confetti /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { gap: spacing.sm },
});
