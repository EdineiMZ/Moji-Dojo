import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { AppText, Button, Card, Mascot, ProgressBar, SPRING, useMotionEnabled, type MascotMood } from '@/components';
import { hapticError, hapticSuccess } from '@/lib/haptics';
import { radii, spacing, useTheme } from '@/theme';
import { autoAdvanceMs, buildFeedback, type Feedback } from './explain';
import { OptionButton, type OptionState } from './OptionButton';
import {
  advance,
  answerQuestion,
  isFinished,
  quizResult,
  startQuiz,
  type Question,
  type QuizResult,
  type QuizState,
} from './quiz';

interface QuizViewProps {
  questions: readonly Question[];
  title: string;
  /** Chamado a cada resposta; `firstTry` é falso nas perguntas repetidas depois de um erro. */
  onAnswer?: (question: Question, correct: boolean, firstTry: boolean) => void;
  onDone: (result: QuizResult) => void;
}

interface Answered {
  chosen: string;
  correct: boolean;
  feedback: Feedback;
}

/**
 * Quiz de alternativas. Acerto avança sozinho; erro mostra a resposta, a dica de memorização
 * e espera o toque em "Continuar". Perguntas erradas voltam mais tarde (ver quiz.ts).
 */
export function QuizView({ questions, title, onAnswer, onDone }: QuizViewProps) {
  const { colors } = useTheme();
  const motion = useMotionEnabled();
  const [quiz, setQuiz] = useState<QuizState>(() => startQuiz(questions));
  const [answered, setAnswered] = useState<Answered | null>(null);
  const [mood, setMood] = useState<MascotMood>('neutral');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shake = useSharedValue(0);
  const pop = useSharedValue(1);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const cardMotion = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }, { scale: pop.value }],
  }));

  const current = quiz.current;
  if (!current) return null;

  const proceed = (state: QuizState) => {
    const next = advance(state);
    setAnswered(null);
    setMood('neutral');
    if (isFinished(next)) {
      onDone(quizResult(next));
    } else {
      setQuiz(next);
    }
  };

  const pick = (char: string) => {
    if (answered) return;
    const outcome = answerQuestion(quiz, char);
    const feedback = buildFeedback(current.item, outcome.correct);
    setQuiz(outcome.state);
    setAnswered({ chosen: char, correct: outcome.correct, feedback });
    setMood(outcome.correct ? 'happy' : 'sad');
    onAnswer?.(current, outcome.correct, outcome.firstTry);

    if (outcome.correct) {
      hapticSuccess();
      if (motion) pop.value = withSequence(withSpring(1.06, SPRING), withSpring(1, SPRING));
      timer.current = setTimeout(() => proceed(outcome.state), autoAdvanceMs(current.item));
    } else {
      hapticError();
      if (motion) {
        shake.value = withSequence(
          withTiming(-10, { duration: 60 }),
          withTiming(10, { duration: 60 }),
          withTiming(-6, { duration: 60 }),
          withTiming(0, { duration: 60 }),
        );
      }
    }
  };

  const toChar = current.direction === 'r2k';
  const stateOf = (char: string): OptionState => {
    if (!answered) return 'idle';
    if (char === current.item.char) return 'right';
    return char === answered.chosen ? 'wrong' : 'dim';
  };

  return (
    <View style={styles.root}>
      <View style={styles.top}>
        <View style={styles.flex}>
          <AppText variant="caption" color="muted">
            {title}
            {current.retry ? ' · repetindo uma que você errou' : ''}
          </AppText>
          <ProgressBar value={quiz.total ? quiz.done / quiz.total : 0} style={styles.bar} />
          <AppText variant="caption" color="muted">
            {quiz.done} de {quiz.total}
          </AppText>
        </View>
        <Mascot mood={mood} size={84} />
      </View>

      <Animated.View style={cardMotion}>
        <Card
          style={[
            styles.prompt,
            answered && { borderColor: answered.correct ? colors.ok : colors.bad, borderWidth: 2 },
          ]}
        >
          {toChar ? (
            <AppText variant="headline" center>
              {current.item.label}
            </AppText>
          ) : (
            <AppText variant="glyph" center style={styles.promptGlyph}>
              {current.item.char}
            </AppText>
          )}
        </Card>
      </Animated.View>

      <View style={styles.options}>
        {current.options.map((opt, i) => (
          <OptionButton
            key={`${current.item.char}-${opt.char}`}
            index={i}
            label={toChar ? opt.char : opt.label}
            glyph={toChar}
            state={stateOf(opt.char)}
            onPress={() => pick(opt.char)}
          />
        ))}
      </View>

      {answered ? (
        <View
          accessibilityLiveRegion="polite"
          style={[styles.feedback, { backgroundColor: answered.correct ? colors.okSoft : colors.badSoft }]}
        >
          <AppText color={answered.correct ? 'ok' : 'bad'}>{answered.feedback.text}</AppText>
          {answered.feedback.hint ? (
            <AppText variant="caption" color="muted">
              Para lembrar: {answered.feedback.hint}
            </AppText>
          ) : null}
        </View>
      ) : null}

      {answered && !answered.correct ? <Button label="Continuar" onPress={() => proceed(quiz)} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.lg },
  flex: { flex: 1 },
  top: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  bar: { marginVertical: spacing.xs },
  prompt: { alignItems: 'center', justifyContent: 'center', minHeight: 150 },
  promptGlyph: { fontSize: 96, lineHeight: 112 },
  options: { gap: spacing.sm },
  feedback: { borderRadius: radii.md, padding: spacing.md, gap: spacing.xs },
});
