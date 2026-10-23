import { useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Bold, Button, Card, Mascot, PetalRain } from '@/components';
import { resultMood } from '@/features/lessons/resultCopy';
import type { Question, QuizResult } from '@/features/quiz/quiz';
import { QuizView } from '@/features/quiz/QuizView';
import { ResultCard } from '@/features/quiz/ResultCard';
import { REVIEW_GOOD_PCT } from '@/features/review/session';
import { speakJapanese } from '@/features/speech/voiceStore';
import { feedbackComplete } from '@/lib/feedback';
import { useProgressStore, useSettingsStore } from '@/store';
import { SPEECH_RATES } from '@/store/settingsStore';
import { fonts, spacing } from '@/theme';
import { PitchGraph } from './PitchGraph';
import { buildPitchRound, PITCH_ROUND, pitchPairs, type PitchWord } from './pitch';

const firstMeaning = (meaning: string): string => meaning.split(/[,;]/u)[0]?.trim() ?? meaning;

function PairSide({ entry }: { entry: PitchWord }) {
  const speed = useSettingsStore((s) => s.speechSpeed);
  const { word } = entry;
  return (
    <View style={styles.side}>
      <AppText style={styles.jp}>
        {word.jp}
        {word.reading !== word.jp ? ` (${word.reading})` : ''}
      </AppText>
      <AppText variant="caption" color="muted">
        {firstMeaning(word.meaning)}
      </AppText>
      <PitchGraph reading={word.reading} accent={entry.accent} />
      <Button label="🔊" variant="soft" onPress={() => speakJapanese(word.reading, SPEECH_RATES[speed])} />
    </View>
  );
}

/**
 * Tom das palavras (pitch accent): em japonês a palavra tem uma "música" (sobe, cai), e trocar a queda pode trocar a
 * palavra (はし: 箸 e 橋). Mostra o tom de cada palavra, os pares que só se distinguem por ele e um quiz de onde o tom cai.
 */
export function TomView() {
  const recordDrill = useProgressStore((s) => s.recordDrill);
  const pairs = useMemo(() => pitchPairs(), []);
  const [session, setSession] = useState<{ questions: Question[]; attempt: number } | null>(null);
  const [result, setResult] = useState<(QuizResult & { missed: readonly string[] }) | null>(null);
  const missed = useRef<string[]>([]);

  const start = () => {
    missed.current = [];
    setResult(null);
    setSession((s) => ({ questions: buildPitchRound(), attempt: (s?.attempt ?? 0) + 1 }));
  };

  if (result) {
    const pct = result.total ? Math.round((result.first / result.total) * 100) : 0;
    const good = pct >= REVIEW_GOOD_PCT;
    return (
      <>
        <ResultCard
          label="Tom das palavras"
          heading="Rodada feita"
          pct={pct}
          firstTry={result.first}
          total={result.total}
          wrong={result.missed}
          wrongLabel="Para ficar de olho:"
          wrongText={(line) => line}
          passed={good}
          mood={resultMood(good, pct)}
        >
          <View style={styles.actions}>
            <Button label="Outra rodada" onPress={start} />
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
        title="Tom das palavras"
        onAnswer={(question, correct, firstTry) => {
          recordDrill(correct, 'tone');
          if (!correct && firstTry && question.item.script === 'pair' && question.item.explain && !missed.current.includes(question.item.explain)) {
            missed.current.push(question.item.explain);
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
    <View style={styles.root}>
      <Card enterIndex={0}>
        <View style={styles.head}>
          <View style={styles.flex}>
            <AppText variant="title">Tom das palavras</AppText>
            <AppText color="muted">A música de cada palavra.</AppText>
          </View>
          <Mascot mood="neutral" size={72} />
        </View>
        <AppText>
          Em japonês o tom é <Bold>alto ou baixo</Bold>, e não a força da voz. A primeira mora e a segunda quase sempre têm tons
          diferentes, e a palavra pode <Bold>cair</Bold> em algum ponto ou <Bold>seguir alta</Bold>. Nos gráficos, a barra no alto
          é o tom alto e embaixo é o baixo; a última coluna, em cinza, é a partícula que vem depois (が) e mostra se o tom
          cai ou não.
        </AppText>
        <Button label={`Quiz: onde o tom cai? (${PITCH_ROUND})`} onPress={start} />
        <AppText variant="caption" color="muted">
          O app não toca o tom de propósito: a voz do sistema lê a palavra do seu jeito e pode não marcar a queda. Use os
          gráficos como referência e imite um falante nativo.
        </AppText>
      </Card>

      <AppText variant="title">Pares que só o tom separa</AppText>
      {pairs.slice(0, 12).map(([a, b], i) => (
        <Card key={`${a.word.id}-${b.word.id}`} enterIndex={Math.min(i + 1, 6)}>
          <View style={styles.pair}>
            <PairSide entry={a} />
            <PairSide entry={b} />
          </View>
        </Card>
      ))}

      <AppText variant="caption" color="muted">
        Dados de acento do projeto Kanjium (CC BY-SA 4.0). Algumas palavras têm mais de um acento em uso; o gráfico mostra o
        principal.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.md },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: spacing.xs },
  actions: { alignSelf: 'stretch', gap: spacing.sm },
  pair: { flexDirection: 'row', gap: spacing.md },
  side: { flex: 1, gap: spacing.xs },
  jp: { fontFamily: fonts.bold, fontSize: 18 },
});
