import { useState } from 'react';
import { AppText, Screen, SegmentedControl, SoonCard } from '@/components';
import { SoundsView } from '@/features/listen/SoundsView';
import { SpeedControl } from '@/features/speech/SpeedControl';
import { VoiceWarning } from '@/features/speech/VoiceWarning';

type ListenView = 'sounds' | 'ear' | 'repeat';

const VIEWS = [
  { value: 'sounds' as const, label: 'Sons' },
  { value: 'ear' as const, label: 'Ouvido' },
  { value: 'repeat' as const, label: 'Repetir' },
];

export default function ListenScreen() {
  const [view, setView] = useState<ListenView>('sounds');

  return (
    <Screen>
      <AppText variant="headline">Ouvir</AppText>
      <VoiceWarning />
      <SpeedControl />
      <SegmentedControl options={VIEWS} value={view} onChange={setView} />
      {view === 'sounds' ? <SoundsView /> : <SoonCard text="Esta parte chega em breve." />}
    </Screen>
  );
}
