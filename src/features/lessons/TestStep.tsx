import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button } from '@/components';
import { LESSONS } from '@/data/lessons';
import type { Lesson, Script } from '@/data/types';
import { buildLessonQuestions, type QuizResult } from '@/features/quiz/quiz';
import { QuizView } from '@/features/quiz/QuizView';
import { ResultCard } from '@/features/quiz/ResultCard';
import { feedbackComplete } from '@/lib/feedback';
import { useProgressStore } from '@/store';
import { spacing } from '@/theme';
import { lessonResultCopy, resultMood, testIntro } from './resultCopy';
import { lessonPassed, nextLessonIndex } from './trail';

interface TestStepProps {
  script: Script;
  lesson: Lesson;
  /** Teste feito pelo "Já sei": exige 90%. */
  skipped: boolean;
  /** Volta ao passo Conhecer (só para lições que têm esse passo). */
  onReview: () => void;
  onNext: (lessonId: string) => void;
  onExit: () => void;
  /** Pede ao pai as pétalas (passou) e o confete (100%); precisam cobrir a tela toda, fora da rolagem. */
  onCelebrate: (celebration: Celebration) => void;
  /** Avisa se há um teste em andamento (para a tela pedir confirmação ao sair). */
  onActiveChange?: (active: boolean) => void;
}

export interface Celebration {
  petals: boolean;
  confetti: boolean;
}

export const NO_CELEBRATION: Celebration = { petals: false, confetti: false };

interface Outcome extends QuizResult {
  passed: boolean;
  /** Próxima lição ainda não concluída desta trilha, se houver. */
  next: Lesson | null;
}

/** Passo 3: o teste da lição e a tela de resultado. Passar conclui a lição e põe os caracteres na revisão. */
export function TestStep({ script, lesson, skipped, onReview, onNext, onExit, onCelebrate, onActiveChange }: TestStepProps) {
  const [attempt, setAttempt] = useState(0);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const recordAnswer = useProgressStore((s) => s.recordAnswer);
  const completeLesson = useProgressStore((s) => s.completeLesson);

  const finish = (result: QuizResult) => {
    const passed = lessonPassed(result.first, result.total, skipped);
    let next: Lesson | null = null;
    if (passed) {
      completeLesson(lesson.id, lesson.items, skipped);
      feedbackComplete(result.first === result.total);
      const nextIndex = nextLessonIndex(script, useProgressStore.getState().lessons);
      next = LESSONS[script][nextIndex] ?? null;
    }
    setOutcome({ ...result, passed, next });
    onCelebrate({ petals: passed, confetti: passed && result.first === result.total });
  };

  const retry = () => {
    setOutcome(null);
    onCelebrate(NO_CELEBRATION);
    setAttempt((a) => a + 1);
  };

  if (!outcome) {
    return (
      <View style={styles.root}>
        <AppText color="muted">{testIntro(skipped)}</AppText>
        {/* A chave refaz as perguntas a cada nova tentativa. */}
        <TestAttempt
          key={attempt}
          lesson={lesson}
          title={skipped ? 'Teste para pular' : 'Teste da lição'}
          onAnswer={(char, ok) => recordAnswer(char, ok)}
          onDone={finish}
          onActiveChange={onActiveChange}
        />
      </View>
    );
  }

  const pct = outcome.total ? Math.round((outcome.first / outcome.total) * 100) : 0;
  const copy = lessonResultCopy(outcome.passed, skipped);
  return (
    <ResultCard
      label={lesson.title}
      heading={copy.heading}
      pct={pct}
      firstTry={outcome.first}
      total={outcome.total}
      wrong={outcome.wrong}
      passed={outcome.passed}
      mood={resultMood(outcome.passed, pct)}
    >
      <AppText center>{copy.body}</AppText>
      <View style={styles.actions}>
        {outcome.passed ? (
          outcome.next ? (
            <Button label={`Próxima: ${outcome.next.title}`} onPress={() => onNext(outcome.next!.id)} />
          ) : null
        ) : (
          <>
            <Button label="Testar de novo" onPress={retry} />
            {lesson.review || skipped ? null : <Button label="Rever os caracteres" variant="soft" onPress={onReview} />}
          </>
        )}
        <Button label="Voltar à trilha" variant="ghost" onPress={onExit} />
      </View>
    </ResultCard>
  );
}

interface TestAttemptProps {
  lesson: Lesson;
  title: string;
  onAnswer: (char: string, ok: boolean) => void;
  onDone: (result: QuizResult) => void;
  onActiveChange?: (active: boolean) => void;
}

function TestAttempt({ lesson, title, onAnswer, onDone, onActiveChange }: TestAttemptProps) {
  const [questions] = useState(() => buildLessonQuestions(lesson.items, lesson.review === true));

  // Enquanto as perguntas estão na tela há um teste em andamento; ao ir para o resultado, não mais.
  useEffect(() => {
    onActiveChange?.(true);
    return () => onActiveChange?.(false);
  }, [onActiveChange]);

  return (
    <QuizView
      questions={questions}
      title={title}
      onAnswer={(q, ok) => onAnswer(q.item.char, ok)}
      onDone={onDone}
    />
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.lg },
  actions: { alignSelf: 'stretch', gap: spacing.sm },
});
