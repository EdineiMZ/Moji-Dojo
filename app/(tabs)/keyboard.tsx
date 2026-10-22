import { useState } from 'react';
import { AppText, Screen, SegmentedControl } from '@/components';
import { ChallengeView } from '@/features/keyboard/ChallengeView';
import { GuideView } from '@/features/keyboard/GuideView';
import { SimulatorView } from '@/features/keyboard/SimulatorView';

type KeyboardView = 'guide' | 'simulator' | 'challenge';

const VIEWS = [
  { value: 'guide' as const, label: 'Guia' },
  { value: 'simulator' as const, label: 'Simulador' },
  { value: 'challenge' as const, label: 'Desafio' },
];

export default function KeyboardScreen() {
  const [view, setView] = useState<KeyboardView>('guide');

  return (
    <Screen>
      <AppText variant="headline">Teclado</AppText>
      <SegmentedControl options={VIEWS} value={view} onChange={setView} />
      {view === 'guide' ? <GuideView onPractice={() => setView('simulator')} /> : null}
      {view === 'simulator' ? <SimulatorView /> : null}
      {view === 'challenge' ? <ChallengeView /> : null}
    </Screen>
  );
}
