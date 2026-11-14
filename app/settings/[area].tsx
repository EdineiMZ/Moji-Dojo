import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppText, BackLink, Screen } from '@/components';
import { AiSettingsCard } from '@/features/ai/AiSettingsCard';
import { BackupCard } from '@/features/backup/BackupCard';
import { ExportCard } from '@/features/backup/ExportCard';
import { SettingsBackupCard } from '@/features/backup/SettingsBackupCard';
import { ProfileCard } from '@/features/profile/ProfileCard';
import { DisplaySettingsCard } from '@/features/progress/DisplaySettingsCard';
import { FeedbackSettingsCard } from '@/features/progress/FeedbackSettingsCard';
import { ThemeSettingsCard } from '@/features/progress/ThemeSettingsCard';
import { ResetCard } from '@/features/progress/ResetCard';
import { RemindersCard } from '@/features/reminders/RemindersCard';
import { ReviewSettingsCard } from '@/features/review/ReviewSettingsCard';
import { AREAS, isArea, type SettingsArea } from '@/features/settings/areas';
import { SpeedControl } from '@/features/speech/SpeedControl';
import { UpdateCard } from '@/features/updates/UpdateCard';
import { VoiceDiagnosticsCard } from '@/features/speech/VoiceDiagnosticsCard';
import { VoiceStatusCard } from '@/features/speech/VoiceStatusCard';
import { WidgetCard } from '@/features/widget/WidgetCard';
import { VoicevoxCard } from '@/features/speech/VoicevoxCard';
import { spacing } from '@/theme';

function Content({ area }: { area: SettingsArea }) {
  switch (area) {
    case 'profile':
      return <ProfileCard />;
    case 'appearance':
      return <ThemeSettingsCard />;
    case 'reminders':
      return (
        <>
          <RemindersCard />
          <WidgetCard />
        </>
      );
    case 'voice':
      return (
        <>
          <SpeedControl />
          <VoiceStatusCard />
          <VoicevoxCard />
        </>
      );
    case 'study':
      return (
        <>
          <ReviewSettingsCard />
          <DisplaySettingsCard />
        </>
      );
    case 'sounds':
      return <FeedbackSettingsCard />;
    case 'ai':
      return <AiSettingsCard />;
    case 'data':
      return (
        <>
          <ExportCard />
          <BackupCard />
          <SettingsBackupCard />
          <ResetCard />
        </>
      );
    case 'advanced':
      return (
        <>
          <UpdateCard />
          <VoiceDiagnosticsCard />
        </>
      );
  }
}

/** Uma área dos Ajustes, numa tela própria. */
export default function SettingsAreaScreen() {
  const router = useRouter();
  const { area } = useLocalSearchParams<{ area: string }>();
  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/settings'));
  const info = AREAS.find((a) => a.id === area);

  return (
    <Screen>
      <View style={styles.header}>
        <BackLink label="← Ajustes" onPress={goBack} />
        <AppText variant="headline">{info ? `${info.icon} ${info.title}` : 'Ajustes'}</AppText>
      </View>
      {isArea(area) ? <Content area={area} /> : <AppText color="muted">Essa área não existe.</AppText>}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.xs },
});
