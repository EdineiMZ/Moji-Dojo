import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppText, Card, Confetti, Mascot, PetalRain, Screen } from '@/components';
import { SCRIPT_NAMES } from '@/features/catalog';
import { KnowStep } from '@/features/lessons/KnowStep';
import { StepsBar, type LessonStep } from '@/features/lessons/StepsBar';
import { NO_CELEBRATION, TestStep, type Celebration } from '@/features/lessons/TestStep';
import { findLesson, lessonHasWriting, type NextLesson } from '@/features/lessons/trail';
import { WriteStep } from '@/features/lessons/WriteStep';
import { VoiceWarning } from '@/features/speech/VoiceWarning';
import { spacing } from '@/theme';

export default function LessonScreen() {
  const { id, mode } = useLocalSearchParams<{ id: string; mode?: string }>();
  const found = useMemo(() => (id ? findLesson(id) : undefined), [id]);

  if (!found) {
    return (
      <Screen>
        <Card style={styles.center}>
          <Mascot mood="sad" size={110} />
          <AppText center>Não encontrei essa lição.</AppText>
        </Card>
      </Screen>
    );
  }
  // A chave reinicia o fluxo ao abrir outra lição ou outro modo.
  return <LessonFlow key={`${id}:${mode}`} lesson={found} skip={mode === 'skip'} />;
}

interface LessonFlowProps {
  lesson: NextLesson;
  /** Veio do "Já sei": faz só o teste. */
  skip: boolean;
}

function LessonFlow({ lesson: { script, index, lesson }, skip }: LessonFlowProps) {
  const router = useRouter();
  const testOnly = skip || lesson.review === true;
  const hasWriting = lessonHasWriting(lesson);
  const steps: LessonStep[] = hasWriting ? ['know', 'write', 'test'] : ['know', 'test'];

  const [step, setStep] = useState<LessonStep>(testOnly ? 'test' : 'know');
  const [pos, setPos] = useState(0);
  const [celebration, setCelebration] = useState<Celebration>(NO_CELEBRATION);

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <View style={styles.root}>
      <Screen>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" onPress={goBack} hitSlop={8}>
            <AppText color="primary">← Voltar à trilha</AppText>
          </Pressable>
          <AppText variant="caption" color="muted">
            {SCRIPT_NAMES[script].toUpperCase()} · LIÇÃO {index + 1}
          </AppText>
          <AppText variant="headline">{lesson.title}</AppText>
          {testOnly ? null : <StepsBar steps={steps} current={step} />}
        </View>
  
        {step === 'know' ? (
          <>
            <VoiceWarning />
            <KnowStep
              items={lesson.items}
              pos={pos}
              onPosChange={setPos}
              finishLabel={hasWriting ? 'Ir para a escrita' : 'Ir para o teste'}
              onFinish={() => setStep(hasWriting ? 'write' : 'test')}
            />
          </>
        ) : null}
  
        {step === 'write' ? <WriteStep onContinue={() => setStep('test')} /> : null}
  
        {step === 'test' ? (
          <TestStep
            script={script}
            lesson={lesson}
            skipped={skip}
            onReview={() => {
              setPos(0);
              setStep('know');
            }}
            onNext={(nextId) => router.replace({ pathname: '/lesson/[id]', params: { id: nextId } })}
            onExit={goBack}
            onCelebrate={setCelebration}
          />
        ) : null}
      </Screen>
      {/* Fora da rolagem, para cobrir a tela inteira. */}
      {celebration.petals ? <PetalRain /> : null}
      {celebration.confetti ? <Confetti /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { alignItems: 'center' },
  header: { gap: spacing.sm },
});
