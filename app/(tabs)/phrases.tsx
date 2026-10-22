import { useState } from 'react';
import { AppText, Screen, SegmentedControl } from '@/components';
import { BuildView } from '@/features/phrases/BuildView';
import { ALL_TOPICS } from '@/features/phrases/build';
import { GrammarView } from '@/features/phrases/GrammarView';
import { TravelView } from '@/features/phrases/TravelView';
import { SpeedControl } from '@/features/speech/SpeedControl';
import { VoiceWarning } from '@/features/speech/VoiceWarning';

type PhrasesView = 'grammar' | 'build' | 'travel';

const VIEWS = [
  { value: 'grammar' as const, label: 'Gramática' },
  { value: 'build' as const, label: 'Montar' },
  { value: 'travel' as const, label: 'Viagem' },
];

export default function PhrasesScreen() {
  const [view, setView] = useState<PhrasesView>('grammar');
  const [topic, setTopic] = useState(ALL_TOPICS);

  return (
    <Screen>
      <AppText variant="headline">Frases</AppText>
      <VoiceWarning />
      <SpeedControl />
      <SegmentedControl options={VIEWS} value={view} onChange={setView} />
      {view === 'grammar' ? (
        <GrammarView
          onPractice={(id) => {
            setTopic(id);
            setView('build');
          }}
        />
      ) : null}
      {view === 'build' ? <BuildView key={topic} topic={topic} onTopicChange={setTopic} /> : null}
      {view === 'travel' ? <TravelView /> : null}
    </Screen>
  );
}
