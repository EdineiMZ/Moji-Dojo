import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card, Mascot } from '@/components';
import { findItem } from '@/features/catalog';
import { REVIEW_BATCH } from '@/features/home/summary';
import { resultMood } from '@/features/lessons/resultCopy';
import { buildReviewQuestions, type QuizResult } from '@/features/quiz/quiz';
import { QuizView } from '@/features/quiz/QuizView';
import { ResultCard } from '@/features/quiz/ResultCard';
import { feedbackComplete } from '@/lib/feedback';
import { useProgressStore, useSettingsStore } from '@/store';
import { spacing } from '@/theme';
import { pickExtraReviewChars, reviewIntro, reviewTitle, REVIEW_GOOD_PCT } from './session';
import { dueChars } from './srs';

const isKnown = (char: string): boolean => findItem(char) !== undefined;

export interface ReviewCelebration {
  petals: boolean;
  confetti: boolean;
}

interface ReviewSessionProps {
  /** Revisão extra: treina os mais fracos sem mexer no agendamento quando acerta de primeira. */
  extra: boolean;
  onExit: () => void;
  /** Pétalas (80% ou mais) e confete (100%) cobrem a tela toda, por isso ficam no pai. */
  onCelebrate: (celebration: ReviewCelebration) => void;
  /** Avisa quando o dedo começa/termina um traço (perguntas de desenho), para travar a rolagem. */
  onDrawingChange?: (drawing: boolean) => void;
  /** Avisa se há uma revisão em andamento (para a tela pedir confirmação ao sair). */
  onActiveChange?: (active: boolean) => void;
}

interface Outcome extends QuizResult {
  /** Revisões que ainda vencem agora (a sessão leva no máximo 30). */
  remaining: number;
}

/** Revisão espaçada: o quiz com os caracteres vencidos (ou os mais fracos) e a tela de resultado. */
export function ReviewSession({ extra, onExit, onCelebrate, onDrawingChange, onActiveChange }: ReviewSessionProps) {
  const [attempt, setAttempt] = useState(0);
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  const finish = (result: QuizResult) => {
    const { srs } = useProgressStore.getState();
    const remaining = extra ? 0 : dueChars(srs, Date.now(), isKnown).length;
    const pct = result.total ? Math.round((result.first / result.total) * 100) : 0;
    setOutcome({ ...result, remaining });
    if (pct >= REVIEW_GOOD_PCT) feedbackComplete(result.first === result.total);
    onCelebrate({ petals: pct >= REVIEW_GOOD_PCT, confetti: result.total > 0 && result.first === result.total });
  };

  const again = () => {
    setOutcome(null);
    onCelebrate({ petals: false, confetti: false });
    setAttempt((a) => a + 1);
  };

  if (!outcome) {
    return (
      <ReviewRun
        key={attempt}
        extra={extra}
        onExit={onExit}
        onDone={finish}
        onDrawingChange={onDrawingChange}
        onActiveChange={onActiveChange}
      />
    );
  }

  const pct = outcome.total ? Math.round((outcome.first / outcome.total) * 100) : 0;
  const good = pct >= REVIEW_GOOD_PCT;
  return (
    <ResultCard
      label={reviewTitle(extra)}
      heading="Revisão feita"
      pct={pct}
      firstTry={outcome.first}
      total={outcome.total}
      wrong={outcome.wrong}
      wrongLabel="Para ficar de olho:"
      passed={good}
      mood={resultMood(good, pct)}
    >
      <View style={styles.actions}>
        {outcome.remaining > 0 ? <Button label={`Revisar mais (${Math.min(outcome.remaining, REVIEW_BATCH)})`} onPress={again} /> : null}
        <Button label="Continuar" variant={outcome.remaining > 0 ? 'soft' : 'primary'} onPress={onExit} />
      </View>
    </ResultCard>
  );
}

interface ReviewRunProps {
  extra: boolean;
  onExit: () => void;
  onDone: (result: QuizResult) => void;
  onDrawingChange?: (drawing: boolean) => void;
  onActiveChange?: (active: boolean) => void;
}

function ReviewRun({ extra, onExit, onDone, onDrawingChange, onActiveChange }: ReviewRunProps) {
  const recordReviewAnswer = useProgressStore((s) => s.recordReviewAnswer);
  // Os caracteres e o sorteio dos tipos de pergunta são feitos uma vez, ao abrir:
  // responder (ou mudar o ajuste) não altera a sessão em andamento.
  const [writeEnabled] = useState(() => useSettingsStore.getState().writeInReview);
  const [questions] = useState(() => {
    const { srs } = useProgressStore.getState();
    const chars = extra
      ? pickExtraReviewChars(srs, isKnown)
      : dueChars(srs, Date.now(), isKnown).slice(0, REVIEW_BATCH);
    return buildReviewQuestions(chars, Math.random, { write: writeEnabled });
  });

  const hasQuestions = questions.length > 0;
  useEffect(() => {
    if (!hasQuestions) return undefined;
    onActiveChange?.(true);
    return () => onActiveChange?.(false);
  }, [hasQuestions, onActiveChange]);

  if (!hasQuestions) {
    return (
      <Card enterIndex={0} style={styles.empty}>
        <Mascot mood="happy" size={120} />
        <AppText variant="title" center>
          {extra ? 'Ainda não há o que revisar' : 'Nenhuma revisão pendente'}
        </AppText>
        <AppText center color="muted">
          {extra
            ? 'Conclua uma lição primeiro: os caracteres dela entram na revisão.'
            : 'Tudo em dia! Quando houver revisões vencidas, elas aparecem aqui.'}
        </AppText>
        <Button label="Voltar" onPress={onExit} />
      </Card>
    );
  }

  return (
    <View style={styles.run}>
      <AppText color="muted">{reviewIntro(extra, writeEnabled)}</AppText>
      <QuizView
        questions={questions}
        title={reviewTitle(extra)}
        onAnswer={(q, ok, firstTry) => recordReviewAnswer(q.item.char, ok, firstTry, extra)}
        onDone={onDone}
        onDrawingChange={onDrawingChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  run: { gap: spacing.lg },
  actions: { alignSelf: 'stretch', gap: spacing.sm },
  empty: { alignItems: 'center' },
});
