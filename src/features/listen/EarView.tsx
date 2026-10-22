import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card, PetalRain, SegmentedControl } from '@/components';
import { MINIMAL_PAIRS } from '@/data/sounds';
import type { Script } from '@/data/types';
import { ALL_ITEMS, SCRIPT_NAMES, type StudyItem } from '@/features/catalog';
import { resultMood } from '@/features/lessons/resultCopy';
import {
  buildEarQuestions,
  buildPairQuestions,
  EAR_QUESTIONS,
  isStudyItem,
  type Question,
  type QuizResult,
} from '@/features/quiz/quiz';
import { QuizView } from '@/features/quiz/QuizView';
import { ResultCard } from '@/features/quiz/ResultCard';
import { feedbackComplete } from '@/lib/feedback';
import { useProgressStore } from '@/store';
import { spacing } from '@/theme';

type EarMode = 'hira' | 'kata' | 'pairs';

const MODES = [
  { value: 'hira' as const, label: 'Hiragana' },
  { value: 'kata' as const, label: 'Katakana' },
  { value: 'pairs' as const, label: 'Pares difíceis' },
];

/** Com menos que isto aprendido, o ouvido usa o básico da escrita (senão faltariam alternativas). */
const MIN_LEARNED = 8;

const pairLabels = new Map(
  MINIMAL_PAIRS.flatMap((p) => [p.first, p.second]).map((ex) => [ex.jp, `${ex.romaji}, ${ex.pt}`] as const),
);

/** "か ka" (kana) ou "おばさん obasan, tia" (par difícil): o que mostrar na lista de erros. */
function describeWrong(mode: EarMode, char: string): string {
  const label = mode === 'pairs' ? pairLabels.get(char) : ALL_ITEMS.find((it) => it.char === char)?.label;
  return `${char} ${label ?? ''}`.trim();
}

/**
 * Treino de ouvido: toca um som e a pessoa escolhe o que foi dito.
 * Kana: usa o que já foi aprendido (ou o básico, no começo). Pares difíceis: palavras que só
 * diferem pela duração do som.
 */
export function EarView() {
  const [mode, setMode] = useState<EarMode>('hira');
  const [run, setRun] = useState<{ questions: Question[]; mode: EarMode } | null>(null);
  const [result, setResult] = useState<(QuizResult & { mode: EarMode }) | null>(null);
  const srs = useProgressStore((s) => s.srs);
  const recordAnswer = useProgressStore((s) => s.recordAnswer);
  const markStudied = useProgressStore((s) => s.markStudied);

  const kanaPool = (script: Script): { items: StudyItem[]; learned: boolean } => {
    const all = ALL_ITEMS.filter((it) => it.script === script);
    const learned = all.filter((it) => srs[it.char] !== undefined);
    return learned.length >= MIN_LEARNED
      ? { items: learned, learned: true }
      : { items: all.filter((it) => it.group === 'base'), learned: false };
  };

  const start = (selected: EarMode) => {
    setResult(null);
    const questions =
      selected === 'pairs' ? buildPairQuestions(MINIMAL_PAIRS) : buildEarQuestions(kanaPool(selected).items);
    setRun({ questions, mode: selected });
  };

  if (run) {
    return (
      <QuizView
        questions={run.questions}
        title="Treino de ouvido"
        onAnswer={(q, ok) => {
          if (isStudyItem(q.item)) recordAnswer(q.item.char, ok);
          else markStudied();
        }}
        onDone={(r) => {
          if (r.total > 0 && r.first / r.total >= 0.8) feedbackComplete(r.first === r.total);
          setResult({ ...r, mode: run.mode });
          setRun(null);
        }}
      />
    );
  }

  if (result) {
    const pct = result.total ? Math.round((result.first / result.total) * 100) : 0;
    const good = pct >= 80;
    return (
      <>
        <ResultCard
          label="Treino de ouvido"
          heading={`${pct}% de primeira`}
          pct={pct}
          firstTry={result.first}
          total={result.total}
          wrong={result.wrong}
          wrongText={(c) => describeWrong(result.mode, c)}
          passed={good}
          mood={resultMood(good, pct)}
        >
          <View style={styles.actions}>
            <Button label="De novo" onPress={() => start(result.mode)} />
            <Button label="Voltar" variant="ghost" onPress={() => setResult(null)} />
          </View>
        </ResultCard>
        {good ? <PetalRain /> : null}
      </>
    );
  }

  const script: Script | null = mode === 'pairs' ? null : mode;
  const pool = script ? kanaPool(script) : null;
  return (
    <Card enterIndex={0}>
      <AppText color="muted">
        Você ouve e escolhe o que foi dito. Pode tocar em "Ouvir de novo" quantas vezes quiser.
      </AppText>
      <SegmentedControl options={MODES} value={mode} onChange={setMode} />
      <AppText variant="caption" color="muted">
        {script === null || pool === null
          ? 'Palavras que só mudam pela duração do som. Preste atenção no tempo de cada sílaba.'
          : pool.learned
            ? `Usa os ${SCRIPT_NAMES[script]} que você já aprendeu.`
            : `Você ainda aprendeu poucos ${SCRIPT_NAMES[script]}: por enquanto usa o básico.`}
      </AppText>
      <Button label={`Começar (${EAR_QUESTIONS} perguntas)`} onPress={() => start(mode)} />
    </Card>
  );
}

const styles = StyleSheet.create({ actions: { alignSelf: 'stretch', gap: spacing.sm } });
