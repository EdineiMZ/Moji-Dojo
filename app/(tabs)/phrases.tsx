import { useState } from 'react';
import { AppText, ChipRow, Screen, SwapView } from '@/components';
import { BankView } from '@/features/bank/BankView';
import { ClozeView } from '@/features/cloze/ClozeView';
import { DialogView } from '@/features/dialogs/DialogView';
import { CountingView } from '@/features/counting/CountingView';
import { ConjugationView } from '@/features/conjugation/ConjugationView';
import { BuildHub } from '@/features/phrases/BuildHub';
import { ALL_TOPICS } from '@/features/phrases/build';
import { GrammarView } from '@/features/phrases/GrammarView';
import { TravelView } from '@/features/phrases/TravelView';
import { LoanwordsView } from '@/features/katakana/LoanwordsView';
import { MyPhrasesView } from '@/features/myphrases/MyPhrasesView';
import { TranslateView } from '@/features/translate/TranslateView';
import { VocabView } from '@/features/vocab/VocabView';
import { SpeedControl } from '@/features/speech/SpeedControl';
import { VoiceWarning } from '@/features/speech/VoiceWarning';

type PhrasesView = 'vocab' | 'grammar' | 'conjugate' | 'cloze' | 'count' | 'translate' | 'bank' | 'dialog' | 'mine' | 'build' | 'travel' | 'kata';

const VIEWS = [
  { value: 'vocab' as const, label: 'Palavras' },
  { value: 'grammar' as const, label: 'Gramática' },
  { value: 'conjugate' as const, label: 'Conjugar' },
  { value: 'cloze' as const, label: 'Lacunas' },
  { value: 'count' as const, label: 'Contar' },
  { value: 'translate' as const, label: 'Traduzir' },
  { value: 'bank' as const, label: 'Banco' },
  { value: 'dialog' as const, label: 'Diálogos' },
  { value: 'mine' as const, label: 'Minhas frases' },
  { value: 'build' as const, label: 'Montar' },
  { value: 'travel' as const, label: 'Viagem' },
  { value: 'kata' as const, label: 'Katakana' },
];

export default function PhrasesScreen() {
  const [view, setView] = useState<PhrasesView>('vocab');
  const [topic, setTopic] = useState(ALL_TOPICS);

  return (
    <Screen>
      <AppText variant="headline">Frases</AppText>
      <VoiceWarning />
      <SpeedControl />
      {/* Muitas seções não cabem lado a lado em um celular: os chips rolam na horizontal. */}
      <ChipRow options={VIEWS} value={view} onChange={setView} />
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
        {view === 'cloze' ? <ClozeView /> : null}
        {view === 'count' ? <CountingView /> : null}
        {view === 'kata' ? <LoanwordsView /> : null}
        {view === 'translate' ? <TranslateView /> : null}
        {view === 'bank' ? <BankView /> : null}
        {view === 'dialog' ? <DialogView /> : null}
        {view === 'mine' ? <MyPhrasesView /> : null}
        {view === 'build' ? <BuildHub topic={topic} onTopicChange={setTopic} /> : null}
        {view === 'travel' ? <TravelView /> : null}
      </SwapView>
    </Screen>
  );
}
