import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  AppText,
  Button,
  Card,
  Mascot,
  ProgressBar,
  ReduceMotion,
  SPRING,
  SwapView,
  useMotionEnabled,
  type MascotMood,
} from '@/components';
import { pronunciationText } from '@/features/catalog';
import { speakJapanese } from '@/features/speech/voiceStore';
import { isPassing, type WritingScore } from '@/features/writing/score';
import { useSettingsStore } from '@/store';
import { SPEECH_RATES } from '@/store/settingsStore';
import { feedbackCorrect, feedbackWrong } from '@/lib/feedback';
import { radii, spacing, useTheme } from '@/theme';
import { autoAdvanceMs, buildFeedback, type Feedback } from './explain';
import { OptionButton, type OptionState } from './OptionButton';
import {
  advance,
  answerQuestion,
  isFinished,
  isStudyItem,
  quizResult,
  resolveQuestion,
  startQuiz,
  type AnswerOutcome,
  type Question,
  type QuizResult,
  type QuizState,
} from './quiz';
import { WriteQuestion } from './WriteQuestion';

/** Depois de acertar um desenho há mais o que olhar (o modelo e os traços), então espera mais. */
const WRITE_ADVANCE_MS = 2200;

interface QuizViewProps {
  questions: readonly Question[];
  title: string;
  /** Chamado a cada resposta; `firstTry` é falso nas perguntas repetidas depois de um erro. */
  onAnswer?: (question: Question, correct: boolean, firstTry: boolean) => void;
  onDone: (result: QuizResult) => void;
  /** Avisa quando o dedo começa/termina um traço, para a tela travar a rolagem. */
  onDrawingChange?: (drawing: boolean) => void;
}

interface Answered {
  /** Alternativa escolhida; vazio nas perguntas de desenho. */
  chosen: string;
  correct: boolean;
  feedback: Feedback;
  /** Nota do desenho (só nas perguntas write). */
  score?: WritingScore;
}

/**
 * Quiz com dois tipos de pergunta: alternativas (k2r, r2k) e desenho (write).
 * Acerto avança sozinho; erro mostra a resposta, a dica de memorização e espera o toque
 * em "Continuar". Perguntas erradas voltam mais tarde (ver quiz.ts).
 */
export function QuizView({ questions, title, onAnswer, onDone, onDrawingChange }: QuizViewProps) {
  const { colors } = useTheme();
  const motion = useMotionEnabled();
  const [quiz, setQuiz] = useState<QuizState>(() => startQuiz(questions));
  const [answered, setAnswered] = useState<Answered | null>(null);
  const [mood, setMood] = useState<MascotMood>('neutral');
  /** Muda a cada pergunta mostrada: reinicia o quadro de desenho, mesmo na repetição do mesmo item. */
  const [step, setStep] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speed = useSettingsStore((s) => s.speechSpeed);
  const shake = useSharedValue(0);
  const pop = useSharedValue(1);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  // Pergunta de áudio: toca o som assim que ela aparece (e de novo a cada repetição).
  useEffect(() => {
    const q = quiz.current;
    if (q?.direction === 'audio') speakJapanese(pronunciationText(q.item), SPEECH_RATES[speed]);
    // Só quando a pergunta muda (step): mudar a velocidade no meio não deve tocar de novo.
  }, [step]);

  const cardMotion = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }, { scale: pop.value }],
  }));

  const current = quiz.current;
  if (!current) return null;
  const isWrite = current.direction === 'write';
  const isAudio = current.direction === 'audio';

  const proceed = (state: QuizState) => {
    const next = advance(state);
    setAnswered(null);
    setMood('neutral');
    if (isFinished(next)) {
      onDone(quizResult(next));
    } else {
      setStep((s) => s + 1);
      setQuiz(next);
    }
  };

  /** Parte comum a qualquer resposta: estado, feedback, vibração, animação e avanço automático. */
  const settle = (outcome: AnswerOutcome, chosen: string, score?: WritingScore) => {
    setQuiz(outcome.state);
    setAnswered({ chosen, correct: outcome.correct, feedback: buildFeedback(current.item, outcome.correct), ...(score ? { score } : {}) });
    setMood(outcome.correct ? 'happy' : 'sad');
    onAnswer?.(current, outcome.correct, outcome.firstTry);

    if (outcome.correct) {
      feedbackCorrect();
      if (motion) pop.value = withSequence(withSpring(1.06, SPRING), withSpring(1, SPRING));
      // No ouvido o usuário pode querer ouvir de novo antes de seguir: só avança no toque.
      if (!isAudio) {
        timer.current = setTimeout(() => proceed(outcome.state), isWrite ? WRITE_ADVANCE_MS : autoAdvanceMs(current.item));
      }
    } else {
      feedbackWrong();
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

  const pick = (char: string) => {
    if (answered) return;
    settle(answerQuestion(quiz, char), char);
  };

  /** Desenho conferido: a nota decide (70% ou mais); ordem e direção dos traços são só feedback. */
  const submitWriting = (score: WritingScore) => {
    if (answered) return;
    settle(resolveQuestion(quiz, isPassing(score)), '', score);
  };

  const toChar = current.direction === 'r2k' || isAudio;
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

      <SwapView viewKey={step} kind="slide" style={styles.root}>
        {isWrite && isStudyItem(current.item) ? (
          <Animated.View style={cardMotion}>
            <WriteQuestion
              key={step}
              item={current.item}
              score={answered?.score ?? null}
              onCheck={submitWriting}
              onDrawingChange={onDrawingChange}
            />
          </Animated.View>
        ) : (
          <>
            <Animated.View style={cardMotion}>
              <Card
                style={[
                  styles.prompt,
                  answered && { borderColor: answered.correct ? colors.ok : colors.bad, borderWidth: 2 },
                ]}
              >
                {isAudio ? (
                  <Button
                    label="🔊 Ouvir de novo"
                    onPress={() => speakJapanese(pronunciationText(current.item), SPEECH_RATES[speed])}
                  />
                ) : toChar ? (
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
          </>
        )}
      </SwapView>

      {answered ? (
        <Animated.View
          accessibilityLiveRegion="polite"
          entering={FadeInDown.duration(240).reduceMotion(ReduceMotion.System)}
          style={[styles.feedback, { backgroundColor: answered.correct ? colors.okSoft : colors.badSoft }]}
        >
          <AppText color={answered.correct ? 'ok' : 'bad'}>{answered.feedback.text}</AppText>
          {answered.feedback.hint ? (
            <AppText variant="caption" color="muted">
              Para lembrar: {answered.feedback.hint}
            </AppText>
          ) : null}
        </Animated.View>
      ) : null}

      {answered && (!answered.correct || isWrite || isAudio) ? <Button label="Continuar" onPress={() => proceed(quiz)} /> : null}
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
