import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card, Mascot, PetalRain } from '@/components';
import { questionCardKey as conjKey } from '@/features/conjugation/questions';
import type { Question, QuizResult } from '@/features/quiz/quiz';
import { QuizView } from '@/features/quiz/QuizView';
import { questionCardKey as vocabKey } from '@/features/vocab/questions';
import { feedbackComplete } from '@/lib/feedback';
import { useProgressStore } from '@/store';
import { spacing } from '@/theme';
import { RESCUE_PASS_PCT, rescuePassed } from '../rescue';
import { buildRescueQuestions, MIN_RESCUE_QUESTIONS, type RescueKind } from '../rescueQuestions';

interface RescueSessionProps {
  onExit: () => void;
}

/**
 * Revisão para salvar a sequência: 25 perguntas com o que a pessoa errou há pouco. Com 70% de acertos de primeira, os dias
 * perdidos contam e a sequência segue. Cada resposta reagenda o cartão de verdade, como numa revisão comum.
 */
export function RescueSession({ onExit }: RescueSessionProps) {
  const offer = useProgressStore((s) => s.journey.rescue);
  const finishRescue = useProgressStore((s) => s.finishRescue);
  const declineRescue = useProgressStore((s) => s.declineRescue);
  const recordReviewAnswer = useProgressStore((s) => s.recordReviewAnswer);
  const recordVocabAnswer = useProgressStore((s) => s.recordVocabAnswer);
  const recordConjAnswer = useProgressStore((s) => s.recordConjAnswer);
  const recordParticleAnswer = useProgressStore((s) => s.recordParticleAnswer);
  const [result, setResult] = useState<QuizResult | null>(null);

  // As perguntas são sorteadas uma vez, ao abrir (responder não muda a sessão).
  const [built] = useState(() => {
    const s = useProgressStore.getState();
    return buildRescueQuestions({ misses: s.journey.misses, srs: s.srs, vocab: s.vocab, conj: s.conj, now: Date.now() });
  });

  if (!offer && !result) {
    return (
      <Card enterIndex={0} style={styles.center}>
        <Mascot mood="neutral" size={120} />
        <AppText variant="title" center>
          Não há sequência para salvar agora
        </AppText>
        <Button label="Voltar" onPress={onExit} />
      </Card>
    );
  }

  if (result) {
    const passed = rescuePassed(result.first, result.total);
    const pct = result.total ? Math.round((result.first / result.total) * 100) : 0;
    return (
      <>
        <Card enterIndex={0} style={styles.center}>
          <Mascot mood={passed ? 'cheer' : 'sad'} size={140} />
          <AppText variant="headline" center>
            {passed ? 'Sequência salva!' : 'Não foi desta vez'}
          </AppText>
          <AppText center color="muted">
            {result.first} de {result.total} de primeira ({pct}%). {passed ? 'Os dias perdidos contam como estudados.' : `Eram precisos ${RESCUE_PASS_PCT}%. Tudo bem recomeçar: o Mochi está com você.`}
          </AppText>
          <Button label="Continuar" onPress={onExit} />
        </Card>
        {passed ? <PetalRain /> : null}
      </>
    );
  }

  if (built.questions.length < MIN_RESCUE_QUESTIONS) {
    return (
      <Card enterIndex={0} style={styles.center}>
        <Mascot mood="neutral" size={120} />
        <AppText variant="title" center>
          Ainda há pouco o que revisar
        </AppText>
        <AppText center color="muted">
          Não deu para montar a revisão de resgate (precisa de pelo menos {MIN_RESCUE_QUESTIONS} itens já estudados). A sequência
          recomeça agora, sem problema.
        </AppText>
        <Button
          label="Recomeçar"
          onPress={() => {
            declineRescue();
            onExit();
          }}
        />
      </Card>
    );
  }

  const record = (question: Question, ok: boolean, firstTry: boolean, hinted = false) => {
    const area: RescueKind | undefined = built.kind.get(question);
    if (area === 'kana') recordReviewAnswer(question.item.char, ok, firstTry, false, undefined, question.direction === 'write', hinted);
    else if (area === 'vocab') recordVocabAnswer(vocabKey(question), ok, firstTry);
    else if (area === 'conj') recordConjAnswer(conjKey(question) ?? '', ok, firstTry);
    else if (area === 'particle') recordParticleAnswer(question.item.char, ok, firstTry);
  };

  return (
    <View style={styles.run}>
      <AppText color="muted">
        {built.questions.length} perguntas com o que você errou há pouco. Acerte {RESCUE_PASS_PCT}% de primeira para manter os
        {offer ? ` ${offer.broken} dias` : ' dias'} da sua sequência.
      </AppText>
      <QuizView
        questions={built.questions}
        title="Salvar a sequência"
        onAnswer={(question, ok, firstTry) => record(question, ok, firstTry)}
        onDone={(done) => {
          if (rescuePassed(done.first, done.total)) feedbackComplete(done.first === done.total);
          finishRescue(done.first, done.total);
          setResult(done);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center' },
  run: { gap: spacing.lg },
});
