import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card, Mascot, PetalRain } from '@/components';
import { findWord } from '@/content';
import { resultMood } from '@/features/lessons/resultCopy';
import type { Question, QuizResult } from '@/features/quiz/quiz';
import { QuizView } from '@/features/quiz/QuizView';
import { ResultCard } from '@/features/quiz/ResultCard';
import { REVIEW_GOOD_PCT } from '@/features/review/session';
import { feedbackComplete } from '@/lib/feedback';
import { useProgressStore } from '@/store';
import { spacing } from '@/theme';
import { dueCards, VOCAB_REVIEW_BATCH } from './cards';
import { buildVocabQuestions, questionCardKey } from './questions';

interface VocabReviewProps {
  /** Cartões a praticar. Sem isto, usa os vencidos. */
  keys?: readonly string[];
  /** Título acima do quiz. */
  title?: string;
  onExit: () => void;
}

interface Outcome extends QuizResult {
  /** Cartões que ainda vencem agora. */
  remaining: number;
}

/** "ねこ gato" para a lista de palavras erradas. */
const describeWord = (id: string): string => {
  const word = findWord(id);
  return word ? `${word.jp} ${word.meaning}` : id;
};

/** Perguntas da sessão: os cartões dados ou, sem eles, os vencidos (até o limite por revisão). */
function buildQuestions(keys: readonly string[] | undefined): Question[] {
  const { vocab } = useProgressStore.getState();
  const chosen = keys ?? dueCards(vocab, Date.now());
  return buildVocabQuestions(chosen.slice(0, VOCAB_REVIEW_BATCH));
}

/** Revisão do vocabulário: o quiz com os cartões e o resultado. Cada resposta reagenda o cartão. */
export function VocabReview({ keys, title = 'Revisão de vocabulário', onExit }: VocabReviewProps) {
  const recordVocabAnswer = useProgressStore((s) => s.recordVocabAnswer);
  const [attempt, setAttempt] = useState(0);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  // As perguntas são sorteadas ao abrir (e de novo em "Revisar mais"): responder não muda a sessão em andamento.
  const [questions, setQuestions] = useState(() => buildQuestions(keys));

  if (outcome) {
    const pct = outcome.total ? Math.round((outcome.first / outcome.total) * 100) : 0;
    const good = pct >= REVIEW_GOOD_PCT;
    return (
      <>
        <ResultCard
          label={title}
          heading="Revisão feita"
          pct={pct}
          firstTry={outcome.first}
          total={outcome.total}
          wrong={outcome.wrong}
          wrongLabel="Para ficar de olho:"
          wrongText={describeWord}
          passed={good}
          mood={resultMood(good, pct)}
        >
          <View style={styles.actions}>
            {outcome.remaining > 0 ? (
              <Button
                label={`Revisar mais (${Math.min(outcome.remaining, VOCAB_REVIEW_BATCH)})`}
                onPress={() => {
                  setQuestions(buildQuestions(undefined));
                  setOutcome(null);
                  setAttempt((a) => a + 1);
                }}
              />
            ) : null}
            <Button label="Continuar" variant={outcome.remaining > 0 ? 'soft' : 'primary'} onPress={onExit} />
          </View>
        </ResultCard>
        {good ? <PetalRain /> : null}
      </>
    );
  }

  if (questions.length === 0) {
    return (
      <Card enterIndex={0} style={styles.empty}>
        <Mascot mood="happy" size={120} />
        <AppText variant="title" center>
          Nenhuma revisão de vocabulário pendente
        </AppText>
        <AppText center color="muted">
          Tudo em dia! Aprenda palavras novas ou volte quando houver cartões vencidos.
        </AppText>
        <Button label="Voltar" onPress={onExit} />
      </Card>
    );
  }

  return (
    <QuizView
      key={attempt}
      questions={questions}
      title={title}
      onAnswer={(question, correct, firstTry) => recordVocabAnswer(questionCardKey(question), correct, firstTry)}
      onDone={(result) => {
        const { vocab } = useProgressStore.getState();
        const pct = result.total ? Math.round((result.first / result.total) * 100) : 0;
        if (pct >= REVIEW_GOOD_PCT) feedbackComplete(result.first === result.total);
        setOutcome({ ...result, remaining: dueCards(vocab, Date.now()).length });
      }}
    />
  );
}

const styles = StyleSheet.create({
  actions: { alignSelf: 'stretch', gap: spacing.sm },
  empty: { alignItems: 'center' },
});
