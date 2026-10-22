import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Bold, Button, Card, ChipRow, PressableScale } from '@/components';
import { BUILD_EXERCISES } from '@/data/exercises';
import { GRAMMAR_TOPICS } from '@/data/grammar';
import { speakJapanese } from '@/features/speech/voiceStore';
import { hapticError, hapticSuccess } from '@/lib/haptics';
import { useProgressStore, useSettingsStore } from '@/store';
import { SPEECH_RATES } from '@/store/settingsStore';
import { fonts, radii, spacing, useTheme } from '@/theme';
import {
  addToken,
  ALL_TOPICS,
  checkRound,
  clearTokens,
  createRound,
  currentExercise,
  exercisesForTopic,
  nextExercise,
  removeToken,
  type BuildRound,
} from './build';

/** Só os tópicos que têm exercício entram no seletor. */
const TOPIC_OPTIONS = [
  { value: ALL_TOPICS, label: 'Todos' },
  ...GRAMMAR_TOPICS.map((t, i) => ({ topic: t, number: i + 1 }))
    .filter(({ topic }) => BUILD_EXERCISES.some((e) => e.topic === topic.id))
    .map(({ topic, number }) => ({ value: topic.id, label: String(number) })),
];

const topicTitle = (topicId: string): string => {
  if (topicId === ALL_TOPICS) return 'Todos os tópicos';
  const index = GRAMMAR_TOPICS.findIndex((t) => t.id === topicId);
  return `${index + 1}. ${GRAMMAR_TOPICS[index]?.title ?? ''}`;
};

interface BuildViewProps {
  topic: string;
  onTopicChange: (topic: string) => void;
}

/**
 * Monte em japonês: toque nos blocos, na ordem certa. Sobram blocos de propósito.
 * Quem usa deve passar `key={topic}`: trocar de tópico começa uma rodada nova.
 */
export function BuildView({ topic, onTopicChange }: BuildViewProps) {
  const { colors } = useTheme();
  const speed = useSettingsStore((s) => s.speechSpeed);
  const markStudied = useProgressStore((s) => s.markStudied);
  const [round, setRound] = useState<BuildRound>(() => createRound(exercisesForTopic(topic)));
  const [notice, setNotice] = useState<string | null>(null);

  const exercise = currentExercise(round);
  const total = round.list.length;

  const check = () => {
    if (round.chosen.length === 0) {
      setNotice('Escolha os blocos primeiro.');
      return;
    }
    setNotice(null);
    const next = checkRound(round);
    setRound(next);
    markStudied();
    if (next.checked === 'ok') {
      hapticSuccess();
      if (exercise) speakJapanese(exercise.answer.join(''), SPEECH_RATES[speed]);
    } else {
      hapticError();
    }
  };

  const picker = (
    <View style={styles.picker}>
      <AppText variant="caption" color="muted">
        TÓPICO
      </AppText>
      <ChipRow options={TOPIC_OPTIONS} value={topic} onChange={onTopicChange} />
      <AppText variant="caption" color="muted">
        {topicTitle(topic)}
      </AppText>
    </View>
  );

  if (round.finished) {
    const good = total > 0 && round.correct / total >= 0.8;
    return (
      <View style={styles.root}>
        {picker}
        <Card enterIndex={0} style={styles.center}>
          <AppText variant="headline" center>
            Rodada terminada
          </AppText>
          <AppText style={styles.score} color={good ? 'ok' : round.correct / Math.max(total, 1) >= 0.6 ? 'warn' : 'bad'}>
            {round.correct} de {total}
          </AppText>
          <AppText color="muted" center>
            frases certas. Errou alguma? Abra o tópico na aba Gramática e leia de novo os exemplos.
          </AppText>
          <Button
            label="Outra rodada"
            onPress={() => {
              setRound(createRound(exercisesForTopic(topic)));
              setNotice(null);
            }}
          />
        </Card>
      </View>
    );
  }

  if (!exercise) return <View style={styles.root}>{picker}</View>;

  const checked = round.checked;
  const lineColor = checked === 'ok' ? colors.ok : checked === 'bad' ? colors.bad : colors.line;

  return (
    <View style={styles.root}>
      {picker}
      <Card enterIndex={0}>
        <View style={styles.counter}>
          <AppText variant="caption" color="muted">
            Frase {round.index + 1} de {total}
          </AppText>
          <AppText variant="caption" color="muted">
            Acertos <Bold>{round.correct}/{round.attempted}</Bold>
          </AppText>
        </View>
        <AppText variant="caption" color="muted">
          MONTE EM JAPONÊS
        </AppText>
        <AppText variant="title">{exercise.pt}</AppText>

        <View style={[styles.line, { borderColor: lineColor, backgroundColor: colors.background }]}>
          {round.chosen.length === 0 ? (
            <AppText color="muted">Toque nos blocos abaixo, na ordem certa</AppText>
          ) : (
            round.chosen.map((token, i) => (
              <PressableScale
                key={token.id}
                accessibilityRole="button"
                accessibilityLabel={`Remover ${token.text}`}
                disabled={checked !== null}
                onPress={() => setRound(removeToken(round, i))}
                style={[styles.token, { backgroundColor: colors.primarySoft, borderColor: colors.primary }]}
              >
                <AppText style={styles.tokenText}>{token.text}</AppText>
              </PressableScale>
            ))
          )}
        </View>

        <View style={styles.pool}>
          {round.pool.map((token) => {
            const used = round.chosen.some((c) => c.id === token.id);
            return (
              <PressableScale
                key={token.id}
                accessibilityRole="button"
                accessibilityState={{ disabled: used || checked !== null }}
                disabled={used || checked !== null}
                onPress={() => setRound(addToken(round, token.id))}
                style={[
                  styles.token,
                  { backgroundColor: colors.surface, borderColor: colors.line, opacity: used || checked ? 0.4 : 1 },
                ]}
              >
                <AppText style={styles.tokenText}>{token.text}</AppText>
              </PressableScale>
            );
          })}
        </View>

        {checked ? (
          <View style={[styles.feedback, { backgroundColor: checked === 'ok' ? colors.okSoft : colors.badSoft }]}>
            <AppText color={checked === 'ok' ? 'ok' : 'bad'}>
              <Bold>{checked === 'ok' ? 'Certo! ' : 'Não é bem assim. A frase certa é '}</Bold>
              {exercise.answer.join(' ')}
            </AppText>
            <AppText variant="caption" color="muted">
              {exercise.romaji}
            </AppText>
            <AppText variant="caption">{exercise.hint}</AppText>
          </View>
        ) : null}

        {notice ? (
          <AppText color="bad" center>
            {notice}
          </AppText>
        ) : null}

        <View style={styles.actions}>
          {!checked ? (
            <>
              <Button label="Conferir" onPress={check} />
              <Button label="Limpar" variant="ghost" onPress={() => setRound(clearTokens(round))} />
            </>
          ) : (
            <>
              <Button
                label={round.index < total - 1 ? 'Próxima' : 'Ver resultado'}
                onPress={() => {
                  setNotice(null);
                  setRound(nextExercise(round));
                }}
              />
              <Button
                label="🔊 Ouvir a frase"
                variant="soft"
                onPress={() => speakJapanese(exercise.answer.join(''), SPEECH_RATES[speed])}
              />
            </>
          )}
        </View>
        <AppText variant="caption" color="muted">
          Sobram blocos de propósito: nem todos entram na frase.
        </AppText>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.md },
  picker: { gap: spacing.xs },
  center: { alignItems: 'center' },
  score: { fontFamily: fonts.bold, fontSize: 48, lineHeight: 56 },
  counter: { flexDirection: 'row', justifyContent: 'space-between' },
  line: {
    minHeight: 64,
    borderWidth: 2,
    borderRadius: radii.md,
    padding: spacing.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    alignItems: 'center',
  },
  pool: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  token: { borderWidth: 1.5, borderRadius: radii.md, paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  tokenText: { fontFamily: fonts.bold, fontSize: 18 },
  feedback: { borderRadius: radii.md, padding: spacing.md, gap: spacing.xs },
  actions: { gap: spacing.sm },
});
