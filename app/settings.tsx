import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BackLink, AppText, Screen } from '@/components';
import { BackupCard } from '@/features/backup/BackupCard';
import { AboutCard } from '@/features/progress/AboutCard';
import { FeedbackSettingsCard } from '@/features/progress/FeedbackSettingsCard';
import { ResetCard } from '@/features/progress/ResetCard';
import { ReviewSettingsCard } from '@/features/review/ReviewSettingsCard';
import { VoiceStatusCard } from '@/features/speech/VoiceStatusCard';
import { spacing } from '@/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <Screen>
      <View style={styles.header}>
        <BackLink label="← Voltar" onPress={goBack} />
        <AppText variant="headline">Ajustes</AppText>
      </View>
      <VoiceStatusCard />
      <ReviewSettingsCard />
      <FeedbackSettingsCard />
      <BackupCard />
      <ResetCard />
      <AboutCard />
    </Screen>
  );
}

const styles = StyleSheet.create({ header: { gap: spacing.sm } });
