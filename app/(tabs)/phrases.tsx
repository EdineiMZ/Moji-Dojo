import { useState } from 'react';
import { AppText, ChipRow, Screen, SwapView } from '@/components';
import { AiStudioView } from '@/features/ai/AiStudioView';
import { BankView } from '@/features/bank/BankView';
import { ClozeView } from '@/features/cloze/ClozeView';
import { DialogView } from '@/features/dialogs/DialogView';
import { FlashcardsView } from '@/features/flashcards/FlashcardsView';
import { ScanView } from '@/features/scan/ScanView';
import { CountingView } from '@/features/counting/CountingView';
import { ConjugationView } from '@/features/conjugation/ConjugationView';
import { BuildHub } from '@/features/phrases/BuildHub';
import { ALL_TOPICS } from '@/features/phrases/build';
import { GrammarView } from '@/features/phrases/GrammarView';
import { TravelView } from '@/features/phrases/TravelView';
import { FramesView } from '@/features/frames/FramesView';
import { SentencesView } from '@/features/sentences/SentencesView';
import { StructureView } from '@/features/structure/StructureView';
import { ReadView } from '@/features/reading/ReadView';
import { LoanwordsView } from '@/features/katakana/LoanwordsView';
import { MyPhrasesView } from '@/features/myphrases/MyPhrasesView';
import { TranslateView } from '@/features/translate/TranslateView';
import { VocabView } from '@/features/vocab/VocabView';
import { SpeedControl } from '@/features/speech/SpeedControl';
import { VoiceWarning } from '@/features/speech/VoiceWarning';
import { useSettingsStore } from '@/store';

type PhrasesView = 'vocab' | 'cards' | 'scan' | 'grammar' | 'conjugate' | 'cloze' | 'count' | 'translate' | 'bank' | 'dialog' | 'mine' | 'build' | 'travel' | 'kata' | 'read' | 'structure' | 'frames' | 'explore' | 'ai';

type Section = 'words' | 'grammar' | 'sentences';

/** As 13 seções em três grupos: cabem em duas fileiras curtas em vez de uma fileira longa de chips. */
const SECTIONS: readonly { value: Section; label: string; hint: string; views: readonly { value: PhrasesView; label: string }[] }[] = [
  {
    value: 'words',
    label: 'Palavras',
    hint: 'Vocabulário, leitura e câmera',
    views: [
      { value: 'vocab', label: 'Palavras' },
      { value: 'cards', label: 'Cartões' },
      { value: 'kata', label: 'Katakana' },
      { value: 'read', label: 'Leitura' },
      { value: 'scan', label: '📷 Câmera' },
    ],
  },
  {
    value: 'grammar',
    label: 'Gramática',
    hint: 'Como as frases se montam',
    views: [
      { value: 'structure', label: 'Estrutura' },
      { value: 'grammar', label: 'Gramática' },
      { value: 'conjugate', label: 'Conjugar' },
      { value: 'cloze', label: 'Lacunas' },
      { value: 'count', label: 'Contar' },
    ],
  },
  {
    value: 'sentences',
    label: 'Frases',
    hint: 'Montar, traduzir e conversar',
    views: [
      { value: 'frames', label: 'Modelos' },
      { value: 'translate', label: 'Traduzir' },
      { value: 'build', label: 'Montar' },
      { value: 'bank', label: 'Banco' },
      { value: 'dialog', label: 'Diálogos' },
      { value: 'travel', label: 'Viagem' },
      { value: 'explore', label: 'Explorar' },
      { value: 'mine', label: 'Minhas frases' },
      { value: 'ai', label: '✨ IA' },
    ],
  },
];

const sectionOf = (view: PhrasesView): Section => SECTIONS.find((s) => s.views.some((v) => v.value === view))?.value ?? 'words';

export default function PhrasesScreen() {
  const [view, setView] = useState<PhrasesView>('vocab');
  const [topic, setTopic] = useState(ALL_TOPICS);
  const aiEnabled = useSettingsStore((s) => s.ai.enabled);
  const sections = SECTIONS.map((g) => ({ ...g, views: aiEnabled ? g.views : g.views.filter((v) => v.value !== 'ai') }));

  return (
    <Screen>
      <AppText variant="headline">Frases</AppText>
      <VoiceWarning />
      <SpeedControl />
      <ChipRow
        options={SECTIONS.map((g) => ({ value: g.value, label: g.label }))}
        value={sectionOf(view)}
        onChange={(section) => setView(sections.find((g) => g.value === section)?.views[0]?.value ?? 'vocab')}
      />
      <AppText variant="caption" color="muted">
        {SECTIONS.find((g) => g.value === sectionOf(view))?.hint}
      </AppText>
      <ChipRow wrap options={sections.find((g) => g.value === sectionOf(view))?.views ?? []} value={view} onChange={setView} />
      <SwapView viewKey={view}>
        {view === 'vocab' ? <VocabView /> : null}
        {view === 'cards' ? <FlashcardsView /> : null}
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
        {view === 'read' ? <ReadView /> : null}
        {view === 'scan' ? <ScanView /> : null}
        {view === 'structure' ? <StructureView /> : null}
        {view === 'frames' ? <FramesView /> : null}
        {view === 'translate' ? <TranslateView /> : null}
        {view === 'bank' ? <BankView /> : null}
        {view === 'dialog' ? <DialogView /> : null}
        {view === 'explore' ? <SentencesView /> : null}
        {view === 'mine' ? <MyPhrasesView /> : null}
        {view === 'ai' ? <AiStudioView /> : null}
        {view === 'build' ? <BuildHub topic={topic} onTopicChange={setTopic} /> : null}
        {view === 'travel' ? <TravelView /> : null}
      </SwapView>
    </Screen>
  );
}
