import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppText, BackLink, Screen } from '@/components';
import { PracticeSession, type PracticeKind } from '@/features/review/PracticeSession';
import { spacing } from '@/theme';

/** Treinos extras: pares confusos (montados com os seus erros) e leitura de palavras com os kana já aprendidos. */
export default function PracticeScreen() {
  const router = useRouter();
  const { kind } = useLocalSearchParams<{ kind?: string }>();
  const practice: PracticeKind = kind === 'words' ? 'words' : 'confusions';
  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));
  return (
    <Screen>
      <View style={styles.header}>
        <BackLink label="← Voltar" onPress={goBack} />
        <AppText variant="caption" color="muted">
          TREINO EXTRA
        </AppText>
        <AppText variant="headline">{practice === 'words' ? 'Ler palavras' : 'Pares confusos'}</AppText>
      </View>
      <PracticeSession key={practice} kind={practice} onExit={goBack} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.xs },
});
