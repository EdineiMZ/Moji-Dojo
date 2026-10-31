import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { JpText } from '@/features/annotate/JpText';
import { AppText, Button, Card, ChipRow, Mascot, PetalRain } from '@/components';
import { resultMood } from '@/features/lessons/resultCopy';
import type { Question, QuizResult } from '@/features/quiz/quiz';
import { QuizView } from '@/features/quiz/QuizView';
import { ResultCard } from '@/features/quiz/ResultCard';
import { REVIEW_GOOD_PCT } from '@/features/review/session';
import { feedbackComplete } from '@/lib/feedback';
import { useProgressStore } from '@/store';
import { fonts, spacing } from '@/theme';
import { buildCountRound, CATEGORIES, type CountCategory, type CountMode } from './questions';
import { COUNTERS, dayReading, minuteReading, monthReading } from './readings';

type Filter = CountCategory | 'all';

const MODES = [
  { value: 'read' as const, label: 'Ler' },
  { value: 'listen' as const, label: 'Ouvir' },
];

/** Cada linha da tabela de estudo: o que muda de som destacado no texto de apoio. */
function ReferenceCard() {
  return (
    <Card enterIndex={1}>
      <AppText variant="title">Para consultar</AppText>

      <AppText style={styles.bold}>Números que mudam de som</AppText>
      <JpText>300 さんびゃく · 600 ろっぴゃく · 800 はっぴゃく · 3000 さんぜん · 8000 はっせん · 10000 いちまん</JpText>
      <JpText color="muted" variant="caption">
        4 é よん (ou し), 7 é なな (ou しち) e 9 é きゅう (ou く). Nos números grandes, prefira よん, なな e きゅう.
      </JpText>

      <AppText style={styles.bold}>Horas</AppText>
      <JpText>4時 よじ · 7時 しちじ · 9時 くじ · 半 はん</JpText>
      <JpText color="muted" variant="caption">
        Minutos: 1 {minuteReading(1)}, 3 {minuteReading(3)}, 6 {minuteReading(6)}, 8 {minuteReading(8)}, 10 {minuteReading(10)} (ぷん); 2, 5, 7 e
        9 usam ふん.
      </JpText>

      <AppText style={styles.bold}>Datas</AppText>
      <JpText>
        4月 {monthReading(4)} · 7月 {monthReading(7)} · 9月 {monthReading(9)}
      </JpText>
      <JpText color="muted" variant="caption">
        Dias 1 a 10: {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d) => dayReading(d)).join(', ')}. Também 14 {dayReading(14)}, 20 {dayReading(20)}, 24{' '}
        {dayReading(24)}. Os outros são número + にち.
      </JpText>

      <AppText style={styles.bold}>Preços</AppText>
      <JpText>Número + えん. O 4 final vira よ: 4円 よえん, 14円 じゅうよえん.</JpText>

      <AppText style={styles.bold}>Contadores (1 a 10)</AppText>
      {COUNTERS.map((c) => (
        <View key={c.id} style={styles.counter}>
          <AppText>
            <AppText style={styles.bold}>{c.written}</AppText> <AppText color="muted">{c.use}</AppText>
          </AppText>
          <JpText variant="caption" color="muted">
            {c.readings.slice(1).join(' · ')}
          </JpText>
        </View>
      ))}
      <JpText variant="caption" color="muted">
        Para a idade, 20 anos é はたち. Para perguntar quantos, troque o número por なん: なんにん, なんぼん, なんまい.
      </JpText>
    </Card>
  );
}

/**
 * Contar e ler números: números, horas, datas, preços e contadores, lendo (ver a escrita, escolher a leitura)
 * ou ouvindo (ouvir e escolher a escrita). As leituras vêm de regras e tabelas, e os erros sugeridos são os
 * comuns (a regra sem a exceção).
 */
export function CountingView() {
  const recordDrill = useProgressStore((s) => s.recordDrill);
  const [category, setCategory] = useState<Filter>('all');
  const [mode, setMode] = useState<CountMode>('read');
  const [session, setSession] = useState<{ questions: Question[]; attempt: number } | null>(null);
  const [result, setResult] = useState<(QuizResult & { missed: readonly string[] }) | null>(null);
  const missed = useRef<string[]>([]);

  const start = () => {
    missed.current = [];
    setResult(null);
    setSession((s) => ({ questions: buildCountRound(category, mode), attempt: (s?.attempt ?? 0) + 1 }));
  };

  if (result) {
    const pct = result.total ? Math.round((result.first / result.total) * 100) : 0;
    const good = pct >= REVIEW_GOOD_PCT;
    return (
      <>
        <ResultCard
          label="Contar"
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
        title="Contar"
        onAnswer={(question, correct, firstTry) => {
          recordDrill(correct);
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
    <View style={styles.root}>
      <Card enterIndex={0}>
        <View style={styles.head}>
          <View style={styles.flex}>
            <AppText variant="title">Contar</AppText>
            <AppText color="muted">Números, horas, datas, preços e contadores.</AppText>
          </View>
          <Mascot mood="neutral" size={72} />
        </View>
        <AppText variant="caption" color="muted">
          O QUE TREINAR
        </AppText>
        <ChipRow options={CATEGORIES} value={category} onChange={setCategory} />
        <AppText variant="caption" color="muted">
          COMO
        </AppText>
        <ChipRow options={MODES} value={mode} onChange={setMode} />
        <Button label="Começar (10 perguntas)" onPress={start} />
        <AppText variant="caption" color="muted">
          Ler: você vê a escrita (3本) e escolhe a leitura. Ouvir: você ouve e escolhe a escrita. Os números sorteados dão mais
          peso aos que mudam de som, como 300, 600 e 3000.
        </AppText>
      </Card>
      <ReferenceCard />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.lg },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: spacing.xs },
  actions: { alignSelf: 'stretch', gap: spacing.sm },
  bold: { fontFamily: fonts.bold },
  counter: { gap: 2 },
});
