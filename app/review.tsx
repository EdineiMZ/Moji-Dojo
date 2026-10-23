import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BackLink, AppText, Confetti, PetalRain, Screen } from '@/components';
import { ReviewSession, type ReviewCelebration } from '@/features/review/ReviewSession';
import { reviewTitle } from '@/features/review/session';
import { useConfirmExit } from '@/hooks/useConfirmExit';
import { spacing } from '@/theme';

export default function ReviewScreen() {
  const router = useRouter();
  const { extra, light, all } = useLocalSearchParams<{ extra?: string; light?: string; all?: string }>();
  const isAll = all === '1';
  const isLight = light === '1';
  const isExtra = extra === '1';
  const [drawing, setDrawing] = useState(false);
  const [active, setActive] = useState(false);
  const [celebration, setCelebration] = useState<ReviewCelebration>({ petals: false, confetti: false });

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));
  useConfirmExit(
    active,
    'Sair da revisão?',
    'Suas respostas até aqui ficam salvas, mas você vai encerrar esta revisão.',
  );

  return (
    <View style={styles.root}>
      <Screen scrollEnabled={!drawing}>
        <View style={styles.header}>
          <BackLink label="← Voltar" onPress={goBack} />
          <AppText variant="caption" color="muted">
            ESTUDAR HOJE
          </AppText>
          <AppText variant="headline">{reviewTitle(isExtra)}</AppText>
        </View>
        {/* A chave reinicia a sessão se a tela for reaberta no outro modo. */}
        <ReviewSession
          key={`${isExtra}-${isLight}-${isAll}`}
          extra={isExtra}
          light={isLight}
          unlimited={isAll}
          onExit={goBack}
          onCelebrate={setCelebration}
          onDrawingChange={setDrawing}
          onActiveChange={setActive}
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
