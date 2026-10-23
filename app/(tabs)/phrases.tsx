import { useState } from 'react';
import { AppText, Screen, SegmentedControl, SwapView } from '@/components';
import { ConjugationView } from '@/features/conjugation/ConjugationView';
import { BuildView } from '@/features/phrases/BuildView';
import { ALL_TOPICS } from '@/features/phrases/build';
import { GrammarView } from '@/features/phrases/GrammarView';
import { TravelView } from '@/features/phrases/TravelView';
import { VocabView } from '@/features/vocab/VocabView';
import { SpeedControl } from '@/features/speech/SpeedControl';
import { VoiceWarning } from '@/features/speech/VoiceWarning';

type PhrasesView = 'vocab' | 'grammar' | 'conjugate' | 'build' | 'travel';

const VIEWS = [
  { value: 'vocab' as const, label: 'Palavras' },
  { value: 'grammar' as const, label: 'Gramática' },
  { value: 'conjugate' as const, label: 'Conjugar' },
  { value: 'build' as const, label: 'Montar' },
  { value: 'travel' as const, label: 'Viagem' },
];

export default function PhrasesScreen() {
  const [view, setView] = useState<PhrasesView>('vocab');
  const [topic, setTopic] = useState(ALL_TOPICS);

  return (
    <Screen>
      <AppText variant="headline">Frases</AppText>
      <VoiceWarning />
      <SpeedControl />
      <SegmentedControl options={VIEWS} value={view} onChange={setView} />
      <SwapView viewKey={view}>
        {view === 'vocab' ? <VocabView /> : null}
        {view === 'grammar' ? (
          <GrammarView
            onPractice={(id) => {
              setTopic(id);
              setView('build');
            }}
          />
        ) : null}
        {view === 'conjugate' ? <ConjugationView /> : null}
        {view === 'build' ? <BuildView key={topic} topic={topic} onTopicChange={setTopic} /> : null}
        {view === 'travel' ? <TravelView /> : null}
      </SwapView>
    </Screen>
  );
}
