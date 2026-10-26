import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BackLink, AppText, Button, Card, Collapsible, Screen } from '@/components';
import { AiSettingsCard } from '@/features/ai/AiSettingsCard';
import { BackupCard } from '@/features/backup/BackupCard';
import { ExportCard } from '@/features/backup/ExportCard';
import { ProfileCard } from '@/features/profile/ProfileCard';
import { RemindersCard } from '@/features/reminders/RemindersCard';
import { AboutCard } from '@/features/progress/AboutCard';
import { DisplaySettingsCard } from '@/features/progress/DisplaySettingsCard';
import { FeedbackSettingsCard } from '@/features/progress/FeedbackSettingsCard';
import { ResetCard } from '@/features/progress/ResetCard';
import { ReviewSettingsCard } from '@/features/review/ReviewSettingsCard';
import { VoiceStatusCard } from '@/features/speech/VoiceStatusCard';
import { spacing } from '@/theme';

/**
 * Ajustes em poucas partes: o que quase todo mundo mexe (perfil, lembretes) fica à vista; o resto, em seções que abrem com um toque.
 */
export default function SettingsScreen() {
  const router = useRouter();
  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <Screen>
      <View style={styles.header}>
        <BackLink label="← Voltar" onPress={goBack} />
        <AppText variant="headline">Ajustes</AppText>
      </View>
      <ProfileCard />
      <RemindersCard />
      <Card enterIndex={2}>
        <AppText variant="title">Meu Mochi</AppText>
        <AppText color="muted">Vista o Mochi com os itens que você ganhou e compre novos com pétalas.</AppText>
        <Button label="Abrir o armário e a loja" onPress={() => router.push('/mochi')} />
      </Card>

      <Collapsible title="Estudo e exibição" hint="Voz japonesa, revisão, romaji e furigana">
        <VoiceStatusCard />
        <ReviewSettingsCard />
        <DisplaySettingsCard />
      </Collapsible>
      <Collapsible title="Inteligência artificial" hint="Opcional: chave de API do Gemini ou do Claude">
        <AiSettingsCard />
      </Collapsible>
      <Collapsible title="Sons e vibração" hint="Efeitos sonoros, vibração e gravações de falantes nativos">
        <FeedbackSettingsCard />
      </Collapsible>
      <Collapsible title="Seus dados" hint="Exportar, fazer backup e zerar o progresso">
        <ExportCard />
        <BackupCard />
        <ResetCard />
      </Collapsible>
      <AboutCard />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.xs },
});
