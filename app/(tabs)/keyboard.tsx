import { useState } from 'react';
import { AppText, ChipRow, Screen, SwapView } from '@/components';
import { ChallengeView } from '@/features/keyboard/ChallengeView';
import { GuideView } from '@/features/keyboard/GuideView';
import { SpeedView } from '@/features/speed/SpeedView';
import { SimulatorView } from '@/features/keyboard/SimulatorView';

type KeyboardView = 'guide' | 'simulator' | 'challenge' | 'speed';

const VIEWS = [
  { value: 'guide' as const, label: 'Guia' },
  { value: 'simulator' as const, label: 'Simulador' },
  { value: 'challenge' as const, label: 'Desafio' },
  { value: 'speed' as const, label: 'Velocidade' },
];

export default function KeyboardScreen() {
  const [view, setView] = useState<KeyboardView>('guide');

  return (
    <Screen>
      <AppText variant="headline">Teclado</AppText>
      <ChipRow options={VIEWS} value={view} onChange={setView} />
      <SwapView viewKey={view}>
        {view === 'guide' ? <GuideView onPractice={() => setView('simulator')} /> : null}
        {view === 'simulator' ? <SimulatorView /> : null}
        {view === 'challenge' ? <ChallengeView /> : null}
        {view === 'speed' ? <SpeedView /> : null}
      </SwapView>
    </Screen>
  );
}
