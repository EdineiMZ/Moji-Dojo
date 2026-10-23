import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, ChipRow } from '@/components';
import { ALL_EXERCISES, ALL_GRAMMAR } from '@/content/grammar';
import { spacing } from '@/theme';
import { ALL_TOPICS } from './build';
import { ALL_TRAVEL_TOPIC, TRAVEL_TOPIC, travelTopics } from './travelBuild';
import { BuildView } from './BuildView';
import { JudgeView } from './JudgeView';

type Mode = 'build' | 'judge';

const MODES = [
  { value: 'build' as const, label: 'Montar' },
  { value: 'judge' as const, label: 'Qual está certa?' },
];

/** Só os tópicos que têm exercício entram no seletor. */
const TOPIC_OPTIONS = [
  { value: ALL_TOPICS, label: 'Todos' },
  ...ALL_GRAMMAR.map((t, i) => ({ topic: t, number: i + 1 }))
    .filter(({ topic }) => ALL_EXERCISES.some((e) => e.topic === topic.id))
    .map(({ topic, number }) => ({ value: topic.id, label: String(number) })),
];

const TRAVEL_OPTIONS = [{ value: ALL_TRAVEL_TOPIC, label: 'Todas' }, ...travelTopics()];

const topicTitle = (topicId: string): string => {
  if (topicId === ALL_TOPICS) return 'Todos os tópicos';
  if (topicId === ALL_TRAVEL_TOPIC) return 'Todas as frases de viagem e dia a dia';
  if (topicId.startsWith(TRAVEL_TOPIC)) return `Frases de viagem: ${topicId.slice(TRAVEL_TOPIC.length)}`;
  const index = ALL_GRAMMAR.findIndex((t) => t.id === topicId);
  return `${index + 1}. ${ALL_GRAMMAR[index]?.title ?? ''}`;
};

interface BuildHubProps {
  topic: string;
  onTopicChange: (topic: string) => void;
}

/** Montar e "Qual está certa?" com o mesmo seletor de tópico. Trocar de tópico ou de modo começa uma rodada nova. */
export function BuildHub({ topic, onTopicChange }: BuildHubProps) {
  const [mode, setMode] = useState<Mode>('build');
  return (
    <View style={styles.root}>
      <ChipRow options={MODES} value={mode} onChange={setMode} />
      <View style={styles.picker}>
        <AppText variant="caption" color="muted">
          TÓPICO
        </AppText>
        <ChipRow options={TOPIC_OPTIONS} value={topic} onChange={onTopicChange} />
        <AppText variant="caption" color="muted">
          OU FRASES DE VIAGEM E DIA A DIA
        </AppText>
        <ChipRow options={TRAVEL_OPTIONS} value={topic} onChange={onTopicChange} />
        <AppText variant="caption" color="muted">
          {topicTitle(topic)}
        </AppText>
      </View>
      {mode === 'build' ? <BuildView key={`build-${topic}`} topic={topic} /> : <JudgeView key={`judge-${topic}`} topic={topic} />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.md },
  picker: { gap: spacing.xs },
});
