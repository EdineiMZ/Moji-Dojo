import { useRef, useState } from 'react';
import { useNow } from '@/hooks/useNow';
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
import { buildClozeRound, type ClozeKind } from './cloze';
import { buildParticleReview, dueParticles, PARTICLE_REVIEW_BATCH, particleCounts } from './particles';

type Filter = ClozeKind | 'all';

const FILTERS = [
  { value: 'all' as const, label: 'Tudo' },
  { value: 'particle' as const, label: 'Partículas' },
  { value: 'form' as const, label: 'Final da frase' },
];

/**
 * Lacunas: frases do "Montar" com um espaço para a partícula certa (は, を, に, で, の, も, と) ou para a forma
 * do final da frase (ます/ません, です/ですか...). Errar mostra a frase inteira e a regra; a pergunta volta depois.
 */
export function ClozeView() {
  const recordDrill = useProgressStore((s) => s.recordDrill);
  const recordParticleAnswer = useProgressStore((s) => s.recordParticleAnswer);
  const particles = useProgressStore((s) => s.particles);
  const now = useNow();
  const [filter, setFilter] = useState<Filter>('all');
  const [session, setSession] = useState<{ questions: Question[]; attempt: number; review: boolean } | null>(null);
  const [result, setResult] = useState<(QuizResult & { missed: readonly string[] }) | null>(null);
  // Frases erradas na rodada (a lista de erros do quiz só guarda a resposta, que se repete: は, を...).
  const missed = useRef<string[]>([]);

  const start = (review = false) => {
    missed.current = [];
    setResult(null);
    const questions = review ? buildParticleReview(dueParticles(particles, Date.now()).slice(0, PARTICLE_REVIEW_BATCH)) : buildClozeRound(filter);
    setSession((s) => ({ questions, attempt: (s?.attempt ?? 0) + 1, review }));
  };
  const counts = particleCounts(particles, now);

  if (result) {
    const pct = result.total ? Math.round((result.first / result.total) * 100) : 0;
    const good = pct >= REVIEW_GOOD_PCT;
    return (
      <>
        <ResultCard
          label="Lacunas"
          heading="Rodada feita"
          pct={pct}
          firstTry={result.first}
          total={result.total}
          wrong={result.missed}
          wrongLabel="Para ficar de olho:"
          wrongText={(sentence) => sentence}
          passed={good}
          mood={resultMood(good, pct)}
        >
          <View style={styles.actions}>
            <Button label="Outra rodada" onPress={() => start(session?.review ?? false)} />
            <Button
              label="Voltar"
              variant="soft"
              onPress={() => {
                setResult(null);
                setSession(null);
              }}
            />
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
        title="Lacunas"
        onAnswer={(question, correct, firstTry) => {
          if (session.review) recordParticleAnswer(question.item.char, correct, firstTry);
          else recordDrill(correct);
          if (!correct && firstTry && question.item.script === 'pair' && question.item.explain) {
            if (!missed.current.includes(question.item.explain)) missed.current.push(question.item.explain);
          }
        }}
        onDone={(done) => {
          const pct = done.total ? Math.round((done.first / done.total) * 100) : 0;
          if (pct >= REVIEW_GOOD_PCT) feedbackComplete(done.first === done.total);
          setResult({ ...done, missed: [...missed.current] });
        }}
      />
    );
  }

  return (
    <Card enterIndex={0}>
      <View style={styles.head}>
        <View style={styles.flex}>
          <AppText variant="title">Lacunas</AppText>
          <AppText color="muted">Complete a frase com a partícula ou a forma certa.</AppText>
        </View>
        <Mascot mood="neutral" size={72} />
      </View>
      <AppText variant="caption" color="muted">
        O QUE TREINAR
      </AppText>
      <ChipRow options={FILTERS} value={filter} onChange={setFilter} />
      <Button label="Começar (10 frases)" onPress={() => start(false)} />
      <AppText variant="caption" color="muted">
        REVISÃO DAS PARTÍCULAS
      </AppText>
      <AppText color="muted">
        {counts.started} de {counts.total} partículas em revisão. Cada uma volta no seu tempo: quanto mais você acerta, mais
        espaçada fica.
      </AppText>
      {counts.due > 0 ? (
        <Button label={`Revisar partículas (${Math.min(counts.due, PARTICLE_REVIEW_BATCH)})`} variant="soft" onPress={() => start(true)} />
      ) : (
        <AppText color="muted">Nenhuma partícula para revisar agora.</AppText>
      )}
      <AppText variant="caption" color="muted">
        As frases são as mesmas do Montar, agora com um espaço. A tradução aparece embaixo para você saber o que a frase
        quer dizer, e quem erra vê a regra. A partícula é onde brasileiros mais erram: は e を, に e で.
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: spacing.xs },
  actions: { alignSelf: 'stretch', gap: spacing.sm },
});
