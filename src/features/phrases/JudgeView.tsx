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
import { buildJudgeRound, JUDGE_ROUND } from './judge';

interface JudgeViewProps {
  topic: string;
}

/**
 * "Qual está certa?": várias frases parecidas, só uma correta. Cada erro tem um tipo (partícula trocada, ordem,
 * final da frase) e, ao escolher uma errada, o app diz o que ela mudou no sentido.
 */
export function JudgeView({ topic }: JudgeViewProps) {
  const recordDrill = useProgressStore((s) => s.recordDrill);
  const [session, setSession] = useState<{ questions: Question[]; attempt: number } | null>(null);
  const [result, setResult] = useState<(QuizResult & { missed: readonly string[] }) | null>(null);
  const missed = useRef<string[]>([]);

  const start = () => {
    missed.current = [];
    setResult(null);
    setSession((s) => ({ questions: buildJudgeRound(topic), attempt: (s?.attempt ?? 0) + 1 }));
  };

  if (result) {
    const pct = result.total ? Math.round((result.first / result.total) * 100) : 0;
    const good = pct >= REVIEW_GOOD_PCT;
    return (
      <>
        <ResultCard
          label="Qual está certa?"
          heading="Rodada feita"
          pct={pct}
          firstTry={result.first}
          total={result.total}
          wrong={result.missed}
          wrongLabel="Para ficar de olho:"
          wrongText={(sentence) => sentence}
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
        title="Qual está certa?"
        onAnswer={(question, correct, firstTry) => {
          recordDrill(correct);
          if (!correct && firstTry && question.item.script === 'pair' && question.item.explain) {
            if (!missed.current.includes(question.item.explain)) missed.current.push(question.item.explain);
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
          <AppText variant="title">Qual está certa?</AppText>
          <AppText color="muted">Escolha a frase correta entre parecidas.</AppText>
        </View>
        <Mascot mood="neutral" size={72} />
      </View>
      <Button label={`Começar (${JUDGE_ROUND} frases)`} onPress={start} />
      <AppText variant="caption" color="muted">
        Você lê o sentido em português e escolhe, entre frases quase iguais, a que diz isso. As erradas trocam uma
        partícula, mudam a ordem ou trocam o final do verbo, e ao errar o app explica o que isso muda.
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: spacing.xs },
  actions: { alignSelf: 'stretch', gap: spacing.sm },
});
