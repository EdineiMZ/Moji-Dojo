import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Bold, Button, Card, PressableScale } from '@/components';
import { speakJapanese } from '@/features/speech/voiceStore';
import { feedbackCorrect, feedbackWrong } from '@/lib/feedback';
import { useProgressStore, useSettingsStore } from '@/store';
import { SPEECH_RATES } from '@/store/settingsStore';
import { fonts, radii, spacing, useTheme } from '@/theme';
import {
  addToken,
  checkRound,
  clearTokens,
  createRound,
  currentExercise,
  exercisesForTopic,
  nextExercise,
  removeToken,
  type BuildRound,
} from './build';
import { diagnose, otherValid } from './diagnose';

interface BuildViewProps {
  topic: string;
}

/**
 * Monte em japonês: toque nos blocos, na ordem certa. Sobram blocos de propósito.
 * Quem usa deve passar `key={topic}`: trocar de tópico começa uma rodada nova.
 */
export function BuildView({ topic }: BuildViewProps) {
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
      feedbackCorrect();
      if (exercise) speakJapanese(exercise.answer.join(''), SPEECH_RATES[speed]);
    } else {
      feedbackWrong();
    }
  };

  if (round.finished) {
    const good = total > 0 && round.correct / total >= 0.8;
    return (
      <View style={styles.root}>
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

  if (!exercise) return null;

  const checked = round.checked;
  const built = round.chosen.map((t) => t.text);
  const changes = checked === 'bad' ? diagnose(exercise, built) : [];
  const alsoValid = otherValid(exercise, built);
  const lineColor = checked === 'ok' ? colors.ok : checked === 'bad' ? colors.bad : colors.line;

  return (
    <View style={styles.root}>
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
                haptic
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
                haptic
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
            {changes.map((line, i) => (
              <AppText key={i}>
                <Bold>O que mudou: </Bold>
                {line}
              </AppText>
            ))}
            {alsoValid.length > 0 ? (
              <AppText variant="caption" color="muted">
                {checked === 'ok' ? 'Também vale: ' : 'Outras ordens que valem: '}
                {alsoValid.join(' · ')}
              </AppText>
            ) : null}
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
