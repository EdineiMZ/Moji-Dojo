import { useState } from 'react';
import { AppText, ChipRow, Screen, SwapView } from '@/components';
import { ComprehensionView } from '@/features/listen/ComprehensionView';
import { DictationView } from '@/features/listen/DictationView';
import { EarView } from '@/features/listen/EarView';
import { RepeatView } from '@/features/listen/RepeatView';
import { SoundsView } from '@/features/listen/SoundsView';
import { SpeedControl } from '@/features/speech/SpeedControl';
import { VoiceWarning } from '@/features/speech/VoiceWarning';

type ListenView = 'sounds' | 'ear' | 'dictation' | 'understand' | 'repeat';

const VIEWS = [
  { value: 'sounds' as const, label: 'Sons' },
  { value: 'ear' as const, label: 'Ouvido' },
  { value: 'dictation' as const, label: 'Ditado' },
  { value: 'understand' as const, label: 'Compreensão' },
  { value: 'repeat' as const, label: 'Repetir' },
];

export default function ListenScreen() {
  const [view, setView] = useState<ListenView>('sounds');

  return (
    <Screen>
      <AppText variant="headline">Ouvir</AppText>
      <VoiceWarning />
      <SpeedControl />
      <ChipRow options={VIEWS} value={view} onChange={setView} />
      <SwapView viewKey={view}>
        {view === 'sounds' ? <SoundsView /> : null}
        {view === 'ear' ? <EarView /> : null}
        {view === 'dictation' ? <DictationView /> : null}
        {view === 'understand' ? <ComprehensionView /> : null}
        {view === 'repeat' ? <RepeatView /> : null}
      </SwapView>
    </Screen>
  );
}
