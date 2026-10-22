import { AppText, Screen } from '@/components';
import { BackupCard } from '@/features/backup/BackupCard';
import { AboutCard } from '@/features/progress/AboutCard';
import { ResetCard } from '@/features/progress/ResetCard';
import { VoiceStatusCard } from '@/features/speech/VoiceStatusCard';

export default function SettingsScreen() {
  return (
    <Screen>
      <AppText variant="headline">Ajustes</AppText>
      <VoiceStatusCard />
      <BackupCard />
      <ResetCard />
      <AboutCard />
    </Screen>
  );
}
