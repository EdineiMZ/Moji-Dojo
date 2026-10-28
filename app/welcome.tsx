import { useRouter } from 'expo-router';
import { Screen } from '@/components';
import { buildTodaySummary } from '@/features/home/summary';
import { OnboardingView } from '@/features/onboarding/OnboardingView';
import { useProgressStore } from '@/store';

/**
 * Primeira abertura (e a primeira depois desta atualização): nome, apresentação, meta, folga e lembretes. Quem ainda não
 * estudou nada cai direto na primeira lição, em vez de numa tela cheia de opções.
 */
export default function WelcomeScreen() {
  const router = useRouter();
  const finish = () => {
    const { srs, lessons, days } = useProgressStore.getState();
    const { learnedCount, nextLesson } = buildTodaySummary({ srs, lessons, days }, Date.now());
    router.replace('/');
    if (learnedCount === 0 && nextLesson) router.push({ pathname: '/lesson/[id]', params: { id: nextLesson.lesson.id } });
  };
  return (
    <Screen>
      <OnboardingView onFinish={finish} />
    </Screen>
  );
}
