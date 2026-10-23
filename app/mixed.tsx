import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText, BackLink, Screen } from '@/components';
import { MixedReview } from '@/features/review/MixedReview';
import { spacing } from '@/theme';

export default function MixedScreen() {
  const router = useRouter();
  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));
  return (
    <Screen>
      <View style={styles.header}>
        <BackLink label="← Voltar" onPress={goBack} />
        <AppText variant="caption" color="muted">
          ESTUDAR HOJE
        </AppText>
        <AppText variant="headline">Revisão mista</AppText>
      </View>
      <MixedReview onExit={goBack} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.xs },
});
