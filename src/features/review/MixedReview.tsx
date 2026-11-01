import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card, PetalRain } from '@/components';
import { resultMood } from '@/features/lessons/resultCopy';
import type { QuizResult } from '@/features/quiz/quiz';
import { QuizView } from '@/features/quiz/QuizView';
import { ResultCard } from '@/features/quiz/ResultCard';
import { feedbackComplete } from '@/lib/feedback';
import { useProgressStore } from '@/store';
import { spacing } from '@/theme';
import { buildMixedRound, mixedKind } from './mixed';
import { REVIEW_GOOD_PCT } from './session';

/** Revisão mista: kana, palavras e verbos vencidos, intercalados numa sessão só. Cada resposta reagenda o cartão dela. */
export function MixedReview({ onExit }: { onExit: () => void }) {
  const recordReviewAnswer = useProgressStore((s) => s.recordReviewAnswer);
  const recordVocabAnswer = useProgressStore((s) => s.recordVocabAnswer);
  const recordConjAnswer = useProgressStore((s) => s.recordConjAnswer);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [questions, setQuestions] = useState(() => {
    const { srs, vocab, conj } = useProgressStore.getState();
    return buildMixedRound({ srs, vocab, conj }, Date.now());
  });

  if (questions.length === 0) {
    return (
      <Card>
        <AppText variant="title">Nada vencido</AppText>
        <AppText color="muted">Não há kana, palavras nem verbos para revisar agora.</AppText>
        <Button label="Voltar" onPress={onExit} />
      </Card>
    );
  }

  if (result) {
    const pct = result.total ? Math.round((result.first / result.total) * 100) : 0;
    const good = pct >= REVIEW_GOOD_PCT;
    return (
      <>
        <ResultCard label="Revisão mista" heading="Revisão feita" pct={pct} firstTry={result.first} total={result.total} wrong={result.wrong} wrongLabel="Para ficar de olho:" passed={good} mood={resultMood(good, pct)}>
          <View style={styles.actions}>
            <Button
              label="Outra rodada"
              onPress={() => {
                const { srs, vocab, conj } = useProgressStore.getState();
                setQuestions(buildMixedRound({ srs, vocab, conj }, Date.now()));
                setResult(null);
                setAttempt((a) => a + 1);
              }}
            />
            <Button label="Continuar" variant="soft" onPress={onExit} />
          </View>
        </ResultCard>
        {good ? <PetalRain /> : null}
      </>
    );
  }

  return (
    <QuizView
      key={attempt}
      questions={questions}
      title="Revisão mista"
      onAnswer={(question, correct, firstTry, hinted) => {
        const { kind, key } = mixedKind(question);
        if (kind === 'kana') recordReviewAnswer(key, correct, firstTry, false, undefined, question.direction === 'write', hinted);
        else if (kind === 'vocab') recordVocabAnswer(key, correct, firstTry);
        else recordConjAnswer(key, correct, firstTry);
      }}
      onDone={(done) => {
        const pct = done.total ? Math.round((done.first / done.total) * 100) : 0;
        if (pct >= REVIEW_GOOD_PCT) feedbackComplete(done.first === done.total);
        setResult(done);
      }}
    />
  );
}

const styles = StyleSheet.create({
  actions: { alignSelf: 'stretch', gap: spacing.sm },
});
