import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card, PetalRain } from '@/components';
import { ALL_GRAMMAR } from '@/content/grammar';
import { resultMood } from '@/features/lessons/resultCopy';
import type { Question, QuizResult } from '@/features/quiz/quiz';
import { QuizView } from '@/features/quiz/QuizView';
import { ResultCard } from '@/features/quiz/ResultCard';
import { feedbackComplete } from '@/lib/feedback';
import { useProgressStore } from '@/store';
import { spacing } from '@/theme';
import { buildTopicTest, passedTest } from './buildTest';

interface TopicTestProps {
  topicId: string;
  onExit: () => void;
}

/**
 * Mini-teste de um tópico, sem a explicação à vista. Acertar 80% de primeira marca o tópico como dominado
 * (e guarda isso no progresso). Errar mostra o que revisar; dá para tentar de novo.
 */
export function TopicTest({ topicId, onExit }: TopicTestProps) {
  const recordDrill = useProgressStore((s) => s.recordDrill);
  const masterTopic = useProgressStore((s) => s.masterTopic);
  const alreadyMastered = useProgressStore((s) => s.mastered[topicId] !== undefined);
  const topic = ALL_GRAMMAR.find((t) => t.id === topicId);
  const number = ALL_GRAMMAR.findIndex((t) => t.id === topicId) + 1;
  const [attempt, setAttempt] = useState(0);
  const [questions, setQuestions] = useState<Question[]>(() => buildTopicTest(topicId));
  const [result, setResult] = useState<(QuizResult & { passed: boolean; missed: readonly string[] }) | null>(null);
  // Frases erradas de primeira, na ordem em que apareceram.
  const missed = useRef<string[]>([]);

  if (!topic || questions.length === 0) {
    return (
      <Card enterIndex={0}>
        <AppText variant="title">Sem mini-teste</AppText>
        <AppText color="muted">Este tópico ainda não tem perguntas suficientes.</AppText>
        <Button label="Voltar" onPress={onExit} />
      </Card>
    );
  }

  if (result) {
    const pct = result.total ? Math.round((result.first / result.total) * 100) : 0;
    return (
      <>
        <ResultCard
          label={`Mini-teste · tópico ${number}`}
          heading={result.passed ? (alreadyMastered ? 'Tópico dominado' : 'Tópico dominado!') : 'Quase lá'}
          pct={pct}
          firstTry={result.first}
          total={result.total}
          wrong={result.missed}
          wrongLabel="Para rever:"
          wrongText={(line) => line}
          passed={result.passed}
          mood={resultMood(result.passed, pct)}
        >
          <AppText center color="muted">
            {result.passed
              ? 'Você acertou sem consultar a explicação. O tópico fica marcado como dominado.'
              : 'Para dominar, acerte pelo menos 80% de primeira. Releia o tópico e tente de novo.'}
          </AppText>
          <View style={styles.actions}>
            {!result.passed ? (
              <Button
                label="Tentar de novo"
                onPress={() => {
                  missed.current = [];
                  setQuestions(buildTopicTest(topicId));
                  setResult(null);
                  setAttempt((a) => a + 1);
                }}
              />
            ) : null}
            <Button label="Voltar ao tópico" variant={result.passed ? 'primary' : 'soft'} onPress={onExit} />
          </View>
        </ResultCard>
        {result.passed ? <PetalRain /> : null}
      </>
    );
  }

  return (
    <QuizView
      key={attempt}
      questions={questions}
      title={`Mini-teste · ${number}. ${topic.title}`}
      onAnswer={(question, correct, firstTry) => {
        recordDrill(correct);
        if (!correct && firstTry && question.item.script === 'pair' && question.item.explain) missed.current.push(question.item.explain);
      }}
      onDone={(done) => {
        const passed = passedTest(done.first, done.total);
        if (passed) {
          masterTopic(topicId);
          feedbackComplete(done.first === done.total);
        }
        setResult({ ...done, passed, missed: [...missed.current] });
      }}
    />
  );
}

const styles = StyleSheet.create({
  actions: { alignSelf: 'stretch', gap: spacing.sm },
});
