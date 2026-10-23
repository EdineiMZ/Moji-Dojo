import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card, Mascot, PetalRain, ProgressBar } from '@/components';
import { feedbackCorrect, feedbackWrong } from '@/lib/feedback';
import { useProgressStore } from '@/store';
import { spacing } from '@/theme';
import { buildSpeedRound, SPEED_BEST_KEY, speedPool, summarize, type SpeedQuestion, type SpeedResult } from './speed';

/** Relógio do treino, fora do componente: só é lido em toques, nunca na renderização. */
const clock = (): number => Date.now();

/** Kana contra o relógio: 20 perguntas seguidas, sem dar tempo de pensar. Mede a média das respostas certas. */
export function SpeedView() {
  const srs = useProgressStore((s) => s.srs);
  const best = useProgressStore((s) => s.journey.counters[SPEED_BEST_KEY]);
  const recordDrill = useProgressStore((s) => s.recordDrill);
  const updateJourney = useProgressStore((s) => s.updateJourney);

  const [round, setRound] = useState<SpeedQuestion[] | null>(null);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<SpeedResult | null>(null);
  const times = useRef<{ ms: number; ok: boolean }[]>([]);
  const shownAt = useRef(0);

  const start = () => {
    times.current = [];
    shownAt.current = clock();
    setResult(null);
    setStep(0);
    setRound(buildSpeedRound(speedPool(Object.keys(srs))));
  };

  const answer = (question: SpeedQuestion, label: string) => {
    const ok = label === question.item.label;
    times.current.push({ ms: clock() - shownAt.current, ok });
    recordDrill(ok, 'kana');
    if (ok) feedbackCorrect();
    else feedbackWrong();
    const next = step + 1;
    shownAt.current = clock();
    if (round && next >= round.length) {
      const summary = summarize(times.current, best);
      if (summary.record) updateJourney((j) => ({ ...j, counters: { ...j.counters, [SPEED_BEST_KEY]: summary.averageMs } }));
      setResult(summary);
      setRound(null);
    } else {
      setStep(next);
    }
  };

  if (round) {
    const q = round[step]!;
    return (
      <View style={styles.root}>
        <ProgressBar value={step / round.length} />
        <Card>
          <AppText variant="glyph" center>
            {q.item.char}
          </AppText>
        </Card>
        <View style={styles.options}>
          {q.options.map((o) => (
            <Button key={`${step}-${o.char}`} label={o.label} variant="soft" silent onPress={() => answer(q, o.label)} />
          ))}
        </View>
      </View>
    );
  }

  const seconds = (ms: number) => `${(ms / 1000).toFixed(2).replace('.', ',')} s`;
  return (
    <Card enterIndex={0}>
      <View style={styles.head}>
        <View style={styles.flex}>
          <AppText variant="title">Velocidade</AppText>
          <AppText color="muted">20 kana seguidos. Responda rápido: o relógio mede só os acertos.</AppText>
        </View>
        <Mascot mood="neutral" size={72} />
      </View>
      {result ? (
        <>
          <AppText variant="headline">
            {result.correct} de {result.total} · {result.correct ? seconds(result.averageMs) : '—'} por kana
          </AppText>
          {result.record ? <AppText color="ok">Novo recorde!</AppText> : null}
        </>
      ) : null}
      {best ? <AppText color="muted">Recorde: {seconds(best)} por kana (com mais de 80% de acertos).</AppText> : null}
      <Button label={result ? 'Outra rodada' : 'Começar'} onPress={start} />
      {result?.record ? <PetalRain /> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.lg },
  options: { gap: spacing.sm },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: spacing.xs },
});
