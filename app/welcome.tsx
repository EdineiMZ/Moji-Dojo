import { useRouter } from 'expo-router';
import { Screen } from '@/components';
import { OnboardingView } from '@/features/onboarding/OnboardingView';

/** Primeira abertura (e a primeira depois desta atualização): nome, apresentação, meta, folga e lembretes. */
export default function WelcomeScreen() {
  const router = useRouter();
  return (
    <Screen>
      <OnboardingView onFinish={() => router.replace('/')} />
    </Screen>
  );
}
