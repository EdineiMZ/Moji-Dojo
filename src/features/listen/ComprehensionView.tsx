import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card, Mascot, PetalRain } from '@/components';
import { resultMood } from '@/features/lessons/resultCopy';
import type { Question, QuizResult } from '@/features/quiz/quiz';
import { QuizView } from '@/features/quiz/QuizView';
import { ResultCard } from '@/features/quiz/ResultCard';
import { REVIEW_GOOD_PCT } from '@/features/review/session';
import { feedbackComplete } from '@/lib/feedback';
import { useProgressStore } from '@/store';
import { spacing } from '@/theme';
import { buildListenRound, DICTATION_ROUND } from './dictation';

/**
 * Compreensão: a frase toca sem texto e você escolhe o que ela quer dizer. A velocidade (normal ou lenta) é a do
 * controle no topo da tela. Errar mostra a frase escrita, o romaji e a tradução.
 */
export function ComprehensionView() {
  const recordDrill = useProgressStore((s) => s.recordDrill);
  const [session, setSession] = useState<{ questions: Question[]; attempt: number } | null>(null);
  const [result, setResult] = useState<(QuizResult & { missed: readonly string[] }) | null>(null);
  const missed = useRef<string[]>([]);

  const start = () => {
    missed.current = [];
    setResult(null);
    setSession((s) => ({ questions: buildListenRound(), attempt: (s?.attempt ?? 0) + 1 }));
  };

  if (result) {
    const pct = result.total ? Math.round((result.first / result.total) * 100) : 0;
    const good = pct >= REVIEW_GOOD_PCT;
    return (
      <>
        <ResultCard
          label="Compreensão"
          heading="Rodada feita"
          pct={pct}
          firstTry={result.first}
          total={result.total}
          wrong={result.missed}
          wrongLabel="Para ouvir de novo:"
          wrongText={(line) => line}
          passed={good}
          mood={resultMood(good, pct)}
        >
          <View style={styles.actions}>
            <Button label="Outra rodada" onPress={start} />
            <Button
              label="Voltar"
              variant="soft"
              onPress={() => {
                setResult(null);
                setSession(null);
              }}
            />
          </View>
        </ResultCard>
        {good ? <PetalRain /> : null}
      </>
    );
  }

  if (session) {
    return (
      <QuizView
        key={session.attempt}
        questions={session.questions}
        title="Compreensão"
        onAnswer={(question, correct, firstTry) => {
          recordDrill(correct);
          if (!correct && firstTry && question.item.script === 'pair' && question.item.explain && !missed.current.includes(question.item.explain)) {
            missed.current.push(question.item.explain);
          }
        }}
        onDone={(done) => {
          const pct = done.total ? Math.round((done.first / done.total) * 100) : 0;
          if (pct >= REVIEW_GOOD_PCT) feedbackComplete(done.first === done.total);
          setResult({ ...done, missed: [...missed.current] });
        }}
      />
    );
  }

  return (
    <Card enterIndex={0}>
      <View style={styles.head}>
        <View style={styles.flex}>
          <AppText variant="title">Compreensão</AppText>
          <AppText color="muted">Ouça a frase e escolha o que ela quer dizer.</AppText>
        </View>
        <Mascot mood="neutral" size={72} />
      </View>
      <Button label={`Começar (${DICTATION_ROUND} frases)`} onPress={start} />
      <AppText variant="caption" color="muted">
        Não há texto na tela: só o som. Use o controle de velocidade lá em cima para ouvir mais devagar. Toque em ouvir de novo
        quantas vezes precisar.
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: spacing.xs },
  actions: { alignSelf: 'stretch', gap: spacing.sm },
});
