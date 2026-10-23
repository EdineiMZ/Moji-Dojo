import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText, BackLink, Screen } from '@/components';
import { RescueSession } from '@/features/journey/ui/RescueSession';
import { spacing } from '@/theme';

/** Revisão para salvar a sequência de dias. */
export default function RescueScreen() {
  const router = useRouter();
  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));
  return (
    <Screen>
      <View style={styles.header}>
        <BackLink label="← Voltar" onPress={goBack} />
        <AppText variant="headline">Salvar a sequência</AppText>
      </View>
      <RescueSession onExit={goBack} />
    </Screen>
  );
}

const styles = StyleSheet.create({ header: { gap: spacing.sm } });
