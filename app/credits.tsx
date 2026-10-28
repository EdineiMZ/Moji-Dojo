import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText, BackLink, Screen } from '@/components';
import { CreditsView } from '@/features/credits/CreditsView';
import { spacing } from '@/theme';

/** Ajustes → Créditos e licenças: quem fez cada parte do conteúdo e os avisos de licença de terceiros. */
export default function CreditsScreen() {
  const router = useRouter();
  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <Screen>
      <View style={styles.header}>
        <BackLink label="← Voltar" onPress={goBack} />
        <AppText variant="headline">Créditos e licenças</AppText>
      </View>
      <CreditsView />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.xs },
});
