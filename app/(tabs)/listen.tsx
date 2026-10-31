import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, ChipRow, Screen, SwapView } from '@/components';
import { ChartView } from '@/features/chart/ChartView';
import { ComprehensionView } from '@/features/listen/ComprehensionView';
import { DictationView } from '@/features/listen/DictationView';
import { TomView } from '@/features/pitch/TomView';
import { SpeakView } from '@/features/speak/SpeakView';
import { EarView } from '@/features/listen/EarView';
import { RepeatView } from '@/features/listen/RepeatView';
import { SoundsView } from '@/features/listen/SoundsView';
import { SpeedPill } from '@/features/speech/SpeedControl';
import { VoiceWarning } from '@/features/speech/VoiceWarning';

type ListenView = 'sounds' | 'chart' | 'ear' | 'dictation' | 'understand' | 'tone' | 'speak' | 'repeat';

const VIEWS = [
  { value: 'sounds' as const, label: 'Sons' },
  { value: 'chart' as const, label: 'Tabela' },
  { value: 'ear' as const, label: 'Ouvido' },
  { value: 'dictation' as const, label: 'Ditado' },
  { value: 'understand' as const, label: 'Compreensão' },
  { value: 'tone' as const, label: 'Tom' },
  { value: 'speak' as const, label: 'Falar' },
  { value: 'repeat' as const, label: 'Repetir' },
];

export default function ListenScreen() {
  const [view, setView] = useState<ListenView>('sounds');

  return (
    <Screen>
      <View style={styles.title}>
        <AppText variant="headline">Ouvir</AppText>
        <SpeedPill />
      </View>
      <VoiceWarning />
      <ChipRow options={VIEWS} value={view} onChange={setView} />
      <SwapView viewKey={view}>
        {view === 'sounds' ? <SoundsView /> : null}
        {view === 'chart' ? <ChartView /> : null}
        {view === 'ear' ? <EarView /> : null}
        {view === 'dictation' ? <DictationView /> : null}
        {view === 'understand' ? <ComprehensionView /> : null}
        {view === 'tone' ? <TomView /> : null}
        {view === 'speak' ? <SpeakView /> : null}
        {view === 'repeat' ? <RepeatView /> : null}
      </SwapView>
    </Screen>
  );
}

const styles = StyleSheet.create({ title: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 } });
