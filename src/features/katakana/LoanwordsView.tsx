import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card, ChipRow, Mascot, PetalRain } from '@/components';
import { resultMood } from '@/features/lessons/resultCopy';
import type { Question, QuizResult } from '@/features/quiz/quiz';
import { QuizView } from '@/features/quiz/QuizView';
import { ResultCard } from '@/features/quiz/ResultCard';
import { REVIEW_GOOD_PCT } from '@/features/review/session';
import { feedbackComplete } from '@/lib/feedback';
import { useProgressStore } from '@/store';
import { spacing } from '@/theme';
import { buildLoanRound, LOAN_ROUND, LOAN_WORDS, type LoanMode } from './loanwords';

const MODES = [
  { value: 'romaji' as const, label: 'Ler (romaji)' },
  { value: 'meaning' as const, label: 'Significado' },
];

/** Katakana de palavras estrangeiras: ler コーヒー e escolher "koohii", ou escolher o que ela quer dizer. */
export function LoanwordsView() {
  const recordDrill = useProgressStore((s) => s.recordDrill);
  const [mode, setMode] = useState<LoanMode>('romaji');
  const [session, setSession] = useState<{ questions: Question[]; attempt: number } | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);

  const start = () => {
    setResult(null);
    setSession((s) => ({ questions: buildLoanRound(mode), attempt: (s?.attempt ?? 0) + 1 }));
  };

  if (result) {
    const pct = result.total ? Math.round((result.first / result.total) * 100) : 0;
    const good = pct >= REVIEW_GOOD_PCT;
    return (
      <>
        <ResultCard label="Katakana" heading="Rodada feita" pct={pct} firstTry={result.first} total={result.total} wrong={[]} passed={good} mood={resultMood(good, pct)}>
          <View style={styles.actions}>
            <Button label="Outra rodada" onPress={start} />
            <Button label="Voltar" variant="soft" onPress={() => { setResult(null); setSession(null); }} />
          </View>
        </ResultCard>
        {good ? <PetalRain /> : null}
      </>
    );
  }

  if (session) {
    return (
      <QuizView
        key={session.attempt}
        questions={session.questions}
        title="Katakana"
        onAnswer={(_q, correct) => recordDrill(correct)}
        onDone={(done) => {
          const pct = done.total ? Math.round((done.first / done.total) * 100) : 0;
          if (pct >= REVIEW_GOOD_PCT) feedbackComplete(done.first === done.total);
          setResult(done);
        }}
      />
    );
  }

  return (
    <Card enterIndex={0}>
      <View style={styles.head}>
        <View style={styles.flex}>
          <AppText variant="title">Palavras em katakana</AppText>
          <AppText color="muted">{LOAN_WORDS.length} palavras do vocabulário escritas só em katakana.</AppText>
        </View>
        <Mascot mood="neutral" size={72} />
      </View>
      <ChipRow options={MODES} value={mode} onChange={setMode} />
      <Button label={`Começar (${LOAN_ROUND} perguntas)`} onPress={start} />
      <AppText variant="caption" color="muted">
        As alternativas erradas são os tropeços de quem lê: シ por ツ, ソ por ン, vogal longa (ー) e ッ esquecidos.
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: spacing.xs },
  actions: { alignSelf: 'stretch', gap: spacing.sm },
});
