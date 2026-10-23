import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BackLink, AppText, Button, Card, Screen } from '@/components';
import { BackupCard } from '@/features/backup/BackupCard';
import { ExportCard } from '@/features/backup/ExportCard';
import { AboutCard } from '@/features/progress/AboutCard';
import { DisplaySettingsCard } from '@/features/progress/DisplaySettingsCard';
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
      <Card enterIndex={0}>
        <AppText variant="title">Meu Mochi</AppText>
        <AppText color="muted">Vista o Mochi com os itens que você ganhou e compre novos com pétalas.</AppText>
        <Button label="Abrir o armário e a loja" onPress={() => router.push('/mochi')} />
      </Card>
      <VoiceStatusCard />
      <ReviewSettingsCard />
      <DisplaySettingsCard />
      <FeedbackSettingsCard />
      <ExportCard />
      <BackupCard />
      <ResetCard />
      <AboutCard />
    </Screen>
  );
}

const styles = StyleSheet.create({ header: { gap: spacing.sm } });
