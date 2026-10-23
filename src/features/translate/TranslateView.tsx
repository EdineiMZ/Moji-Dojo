import { useRef, useState } from 'react';
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
import { FreeSession } from './FreeSession';
import { buildUnderstandQuestion, pickItems, type TranslationItem } from './items';
import { TypingSession, type TypingTarget } from './TypingSession';

type Mode = 'choose' | 'free' | 'write';

const MODES = [
  { value: 'choose' as const, label: 'Entender (opções)' },
  { value: 'free' as const, label: 'Entender (livre)' },
  { value: 'write' as const, label: 'Escrever' },
];

const DESCRIPTIONS: Readonly<Record<Mode, string>> = {
  choose: 'Você lê a frase em japonês e escolhe a tradução certa entre quatro.',
  free: 'Você lê e ouve a frase, escreve o que entendeu (se quiser), confere com a tradução e diz se acertou.',
  write: 'Você lê a tradução em português e escreve a frase em japonês, com o teclado do app ou o do celular. A conferência aceita kana ou kanji, com ou sem espaços e pontuação.',
};

const toTarget = (item: TranslationItem): TypingTarget => ({
  id: item.id,
  prompt: item.pt,
  accepted: item.accepted,
  answer: item.jp,
  romaji: item.romaji,
  ...(item.hint ? { hint: item.hint } : {}),
});

type Session = { mode: Mode; attempt: number; items: TranslationItem[]; questions: Question[] };

/**
 * Traduzir: do japonês para o português (escolhendo ou de forma livre) e do português para o japonês (digitando).
 * As frases vêm da gramática, do Montar e de Viagem, sorteadas a cada rodada.
 */
export function TranslateView() {
  const recordDrill = useProgressStore((s) => s.recordDrill);
  const [mode, setMode] = useState<Mode>('choose');
  const [session, setSession] = useState<Session | null>(null);
  const [result, setResult] = useState<(QuizResult & { missed: readonly string[] }) | null>(null);
  const missed = useRef<string[]>([]);

  const start = () => {
    const items = pickItems();
    missed.current = [];
    setResult(null);
    setSession((s) => ({
      mode,
      attempt: (s?.attempt ?? 0) + 1,
      items,
      questions: mode === 'choose' ? items.map((item) => buildUnderstandQuestion(item)) : [],
    }));
  };
  const leave = () => {
    setResult(null);
    setSession(null);
  };
  const again = { label: 'Outra rodada', onPress: start };

  if (result) {
    const pct = result.total ? Math.round((result.first / result.total) * 100) : 0;
    const good = pct >= REVIEW_GOOD_PCT;
    return (
      <>
        <ResultCard
          label="Traduzir"
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
            <Button label="Voltar" variant="soft" onPress={leave} />
          </View>
        </ResultCard>
        {good ? <PetalRain /> : null}
      </>
    );
  }

  if (session?.mode === 'choose') {
    return (
      <QuizView
        key={session.attempt}
        questions={session.questions}
        title="Entender"
        onAnswer={(question, correct, firstTry) => {
          recordDrill(correct, 'translate');
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

  if (session?.mode === 'free') {
    return (
      <FreeSession
        key={session.attempt}
        items={session.items}
        title="Entender"
        onResult={(_item, ok) => recordDrill(ok, 'translate')}
        onExit={leave}
        again={again}
      />
    );
  }

  if (session?.mode === 'write') {
    return (
      <TypingSession
        key={session.attempt}
        items={session.items.map(toTarget)}
        title="Escrever"
        onResult={(_item, ok) => recordDrill(ok, 'translate')}
        onExit={leave}
        again={again}
      />
    );
  }

  return (
    <Card enterIndex={0}>
      <View style={styles.head}>
        <View style={styles.flex}>
          <AppText variant="title">Traduzir</AppText>
          <AppText color="muted">Frases inteiras, nos dois sentidos.</AppText>
        </View>
        <Mascot mood="neutral" size={72} />
      </View>
      <AppText variant="caption" color="muted">
        COMO
      </AppText>
      <ChipRow options={MODES} value={mode} onChange={setMode} />
      <AppText>{DESCRIPTIONS[mode]}</AppText>
      <Button label="Começar (8 frases)" onPress={start} />
    </Card>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: spacing.xs },
  actions: { alignSelf: 'stretch', gap: spacing.sm },
});
