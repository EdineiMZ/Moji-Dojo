import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText, BackLink, Screen } from '@/components';
import { PlacementView } from '@/features/placement/PlacementView';
import { spacing } from '@/theme';

export default function PlacementScreen() {
  const router = useRouter();
  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));
  return (
    <Screen>
      <View style={styles.header}>
        <BackLink label="← Voltar" onPress={goBack} />
        <AppText variant="headline">Nivelamento</AppText>
      </View>
      <PlacementView onExit={goBack} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.xs },
});
