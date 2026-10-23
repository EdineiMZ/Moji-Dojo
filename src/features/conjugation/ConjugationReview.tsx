import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card, Mascot, PetalRain } from '@/components';
import { resultMood } from '@/features/lessons/resultCopy';
import type { Question, QuizResult } from '@/features/quiz/quiz';
import { TypingSession, type TypingTarget } from '@/features/translate/TypingSession';
import { QuizView } from '@/features/quiz/QuizView';
import { ResultCard } from '@/features/quiz/ResultCard';
import { REVIEW_GOOD_PCT } from '@/features/review/session';
import { feedbackComplete } from '@/lib/feedback';
import { useNow } from '@/hooks/useNow';
import { useProgressStore } from '@/store';
import { spacing } from '@/theme';
import { CONJ_REVIEW_BATCH, dueCards, FORM_LABELS, parseCardKey } from './cards';
import { conjugate } from './conjugate';
import { buildConjugationQuestions, questionCardKey } from './questions';

interface ConjugationReviewProps {
  /** Cartões a praticar. Sem isto, usa os vencidos. */
  keys?: readonly string[];
  title?: string;
  /** Digitar a forma em vez de escolher entre alternativas. */
  typed?: boolean;
  onExit: () => void;
}

interface Outcome extends QuizResult {
  /** Cartões que ainda vencem agora. */
  remaining: number;
}

function buildQuestions(keys: readonly string[] | undefined): Question[] {
  const { conj } = useProgressStore.getState();
  const chosen = keys ?? dueCards(conj, Date.now());
  return buildConjugationQuestions(chosen.slice(0, CONJ_REVIEW_BATCH));
}

/** Revisão de conjugação: o quiz com os cartões e o resultado. Cada resposta reagenda o cartão. */
/** Alvos para digitar: o verbo e a forma pedida; vale a escrita com kanji ou só em kana. */
function typedTargets(keys: readonly string[]): TypingTarget[] {
  return keys.flatMap((key): TypingTarget[] => {
    const card = parseCardKey(key);
    if (!card) return [];
    const { word, spec } = card.verb;
    const written = conjugate(word.jp, spec, card.form);
    const kana = conjugate(word.reading, spec, card.form);
    const meaning = word.meaning.split(/[,;]/u)[0]?.trim() ?? word.meaning;
    return [{ id: key, prompt: `${word.jp} (${meaning}) → ${FORM_LABELS[card.form]}`, accepted: [written, kana], answer: written }];
  });
}

export function ConjugationReview({ keys, title = 'Revisão de conjugação', typed = false, onExit }: ConjugationReviewProps) {
  const recordConjAnswer = useProgressStore((s) => s.recordConjAnswer);
  const conj = useProgressStore((s) => s.conj);
  const now = useNow();
  const [attempt, setAttempt] = useState(0);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  // Sorteadas ao abrir (e de novo em "Revisar mais"): responder não muda a sessão em andamento.
  const [questions, setQuestions] = useState(() => buildQuestions(keys));
  // Para a lista de erros: a resposta certa → "食べる (comer) → forma ない".
  const labels = useMemo(() => new Map(questions.map((q) => [q.item.char, q.item.label] as const)), [questions]);

  if (typed && questions.length > 0 && !outcome) {
    const typedKeys = questions.map((q) => questionCardKey(q)).filter((k): k is string => k !== undefined);
    const remaining = dueCards(conj, now).filter((k) => !typedKeys.includes(k));
    return (
      <TypingSession
        key={attempt}
        items={typedTargets(typedKeys)}
        title={title}
        onResult={(item, ok) => recordConjAnswer(item.id, ok, ok)}
        onExit={onExit}
        {...(remaining.length > 0
          ? {
              again: {
                label: `Revisar mais (${Math.min(remaining.length, CONJ_REVIEW_BATCH)})`,
                onPress: () => {
                  setQuestions(buildQuestions(undefined));
                  setAttempt((a) => a + 1);
                },
              },
            }
          : {})}
      />
    );
  }

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
          wrongText={(answer) => `${labels.get(answer) ?? ''} = ${answer}`}
          passed={good}
          mood={resultMood(good, pct)}
        >
          <View style={styles.actions}>
            {outcome.remaining > 0 ? (
              <Button
                label={`Revisar mais (${Math.min(outcome.remaining, CONJ_REVIEW_BATCH)})`}
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
          Nenhuma revisão de conjugação pendente
        </AppText>
        <AppText center color="muted">
          Tudo em dia! Aprenda verbos novos ou volte quando houver cartões vencidos.
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
      onAnswer={(question, correct, firstTry) => {
        const key = questionCardKey(question);
        if (key) recordConjAnswer(key, correct, firstTry);
      }}
      onDone={(result) => {
        const { conj } = useProgressStore.getState();
        const pct = result.total ? Math.round((result.first / result.total) * 100) : 0;
        if (pct >= REVIEW_GOOD_PCT) feedbackComplete(result.first === result.total);
        setOutcome({ ...result, remaining: dueCards(conj, Date.now()).length });
      }}
    />
  );
}

const styles = StyleSheet.create({
  actions: { alignSelf: 'stretch', gap: spacing.sm },
  empty: { alignItems: 'center' },
});
