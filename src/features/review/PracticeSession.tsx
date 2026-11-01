import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card, PetalRain } from '@/components';
import { resultMood } from '@/features/lessons/resultCopy';
import type { Question, QuizResult } from '@/features/quiz/quiz';
import { QuizView } from '@/features/quiz/QuizView';
import { ResultCard } from '@/features/quiz/ResultCard';
import { feedbackComplete } from '@/lib/feedback';
import { useProgressStore } from '@/store';
import { spacing } from '@/theme';
import { buildConfusedQuestions, confusedPairs } from './confusions';
import { buildReadQuestions, knownKana } from './readWords';
import { REVIEW_GOOD_PCT } from './session';

export type PracticeKind = 'confusions' | 'words';

const COPY: Record<PracticeKind, { title: string; empty: string }> = {
  confusions: {
    title: 'Pares confusos',
    empty: 'Ainda não há pares confusos. Eles aparecem aqui quando você trocar um kana por outro nos exercícios.',
  },
  words: {
    title: 'Ler palavras',
    empty: 'Ainda não há palavras para ler. Elas aparecem depois que você aprender mais algumas linhas de kana.',
  },
};

function buildQuestions(kind: PracticeKind): Question[] {
  const { confusions, srs, lessons } = useProgressStore.getState();
  if (kind === 'confusions') return buildConfusedQuestions(confusedPairs(confusions), Math.random, 2).slice(0, 12);
  return buildReadQuestions(knownKana(Object.keys(srs), lessons));
}

/**
 * Treinos extras montados com o que a pessoa já fez: os pares que ela confunde e palavras que ela já sabe ler.
 * Não mexem no agendamento (cada resposta só entra no histórico do dia), então não inflam nem punem a revisão.
 */
export function PracticeSession({ kind, onExit }: { kind: PracticeKind; onExit: () => void }) {
  const recordDrill = useProgressStore((s) => s.recordDrill);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [questions, setQuestions] = useState(() => buildQuestions(kind));
  const copy = COPY[kind];

  if (questions.length === 0) {
    return (
      <Card>
        <AppText variant="title">{copy.title}</AppText>
        <AppText color="muted">{copy.empty}</AppText>
        <Button label="Voltar" onPress={onExit} />
      </Card>
    );
  }

  if (result) {
    const pct = result.total ? Math.round((result.first / result.total) * 100) : 0;
    const good = pct >= REVIEW_GOOD_PCT;
    return (
      <>
        <ResultCard
          label={copy.title}
          heading="Treino feito"
          pct={pct}
          firstTry={result.first}
          total={result.total}
          wrong={result.wrong}
          wrongLabel="Para ficar de olho:"
          passed={good}
          mood={resultMood(good, pct)}
        >
          <View style={styles.actions}>
            <Button
              label="Outra rodada"
              onPress={() => {
                setQuestions(buildQuestions(kind));
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
    <View style={styles.run}>
      <QuizView
        key={attempt}
        questions={questions}
        title={copy.title}
        onAnswer={(_question, correct, firstTry) => {
          if (firstTry) recordDrill(correct, 'kana');
        }}
        onDone={(r) => {
          feedbackComplete(r.total > 0 && r.first === r.total);
          setResult(r);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  run: { gap: spacing.lg },
  actions: { alignSelf: 'stretch', gap: spacing.sm },
});
