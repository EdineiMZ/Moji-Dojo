import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Bold, Button, Card, ChipRow, Mascot, SegmentedControl } from '@/components';
import { resultMood } from '@/features/lessons/resultCopy';
import { OptionButton, type OptionState } from '@/features/quiz/OptionButton';
import { ResultCard } from '@/features/quiz/ResultCard';
import { REVIEW_GOOD_PCT } from '@/features/review/session';
import { feedbackComplete, feedbackCorrect, feedbackWrong } from '@/lib/feedback';
import { useAiStore, useProgressStore } from '@/store';
import { radii, spacing, useTheme } from '@/theme';
import type { StoredExam } from './aiStore';
import { AiDisclaimer } from './AiParts';
import { AiError } from './client';
import {
  EXAM_LEVELS,
  EXAM_SECTIONS,
  EXAM_SIZES,
  generateExam,
  shuffleQuestion,
  type ExamLevel,
  type ExamQuestion,
  type ExamSection,
} from './tasksPractice';
import { useAiReady } from './useAi';

const sectionLabel = (section: ExamSection): string => EXAM_SECTIONS.find((s) => s.value === section)?.label ?? section;

/** Simulado estilo JLPT: a IA cria as questões, você responde e vê o gabarito comentado. */
export function ExamView() {
  const [run, setRun] = useState<{ exam: StoredExam; attempt: number } | null>(null);
  if (run) {
    return (
      <ExamSession
        key={run.attempt}
        exam={run.exam}
        onExit={() => setRun(null)}
        onRestart={() => setRun({ exam: run.exam, attempt: run.attempt + 1 })}
      />
    );
  }
  return <ExamPicker onStart={(exam) => setRun({ exam, attempt: 1 })} />;
}

function ExamPicker({ onStart }: { onStart: (exam: StoredExam) => void }) {
  const ready = useAiReady();
  const exams = useAiStore((s) => s.exams);
  const addExam = useAiStore((s) => s.addExam);
  const removeExam = useAiStore((s) => s.removeExam);
  const [level, setLevel] = useState<ExamLevel>('N5');
  const [section, setSection] = useState<ExamSection>('grammar');
  const [size, setSize] = useState(5);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const create = async () => {
    setBusy(true);
    setError('');
    try {
      const now = Date.now();
      const questions = await generateExam({ level, section, count: size, seed: now });
      const exam: StoredExam = { id: `x${now.toString(36)}`, at: now, level, section, questions, best: null };
      addExam(exam);
      onStart(exam);
    } catch (e) {
      setError(e instanceof AiError ? e.message : 'Não consegui falar com a IA agora.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.root}>
      {ready ? (
        <Card enterIndex={0}>
          <AppText variant="title">Simulado estilo JLPT</AppText>
          <AppText color="muted">
            A IA cria questões de múltipla escolha no formato do exame, com gabarito comentado. Os simulados ficam guardados para refazer sem internet. Não é uma prova oficial: serve para treinar o formato.
          </AppText>
          <AppText variant="caption" color="muted">
            NÍVEL
          </AppText>
          <SegmentedControl options={EXAM_LEVELS.map((l) => ({ value: l.value, label: l.label }))} value={level} onChange={setLevel} />
          <AppText variant="caption" color="muted">
            SEÇÃO
          </AppText>
          <ChipRow options={EXAM_SECTIONS.map((s) => ({ value: s.value, label: s.label }))} value={section} onChange={setSection} />
          <AppText variant="caption" color="muted">
            TAMANHO
          </AppText>
          <SegmentedControl options={EXAM_SIZES.map((n) => ({ value: String(n), label: `${n} questões` }))} value={String(size)} onChange={(v) => setSize(Number(v))} />
          <Button label={busy ? 'Montando o simulado...' : '✨ Criar um simulado'} onPress={create} disabled={busy} />
          {error ? (
            <AppText color="bad" accessibilityLiveRegion="polite">
              {error}
            </AppText>
          ) : null}
          <AiDisclaimer />
        </Card>
      ) : null}

      {exams.length === 0 ? (
        <Card>
          <AppText color="muted">Nenhum simulado guardado ainda.</AppText>
        </Card>
      ) : (
        exams.map((exam) => (
          <Card key={exam.id}>
            <AppText variant="title">
              {exam.level} · {sectionLabel(exam.section)}
            </AppText>
            <AppText color="muted">
              {exam.questions.length} questões · {exam.best === null ? 'ainda não feito' : `melhor nota: ${exam.best} de ${exam.questions.length}`}
            </AppText>
            <View style={styles.row}>
              <Button label="Fazer" style={styles.flex} onPress={() => onStart(exam)} />
              <Button label="Apagar" variant="ghost" style={styles.flex} onPress={() => removeExam(exam.id)} />
            </View>
          </Card>
        ))
      )}
    </View>
  );
}

function ExamSession({ exam, onExit, onRestart }: { exam: StoredExam; onExit: () => void; onRestart: () => void }) {
  const { colors } = useTheme();
  const recordExamScore = useAiStore((s) => s.recordExamScore);
  const markStudied = useProgressStore((s) => s.markStudied);
  // As alternativas são sorteadas de novo a cada tentativa.
  const [questions] = useState<readonly ExamQuestion[]>(() => exam.questions.map((q) => shuffleQuestion(q)));
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [results, setResults] = useState<readonly boolean[]>([]);

  const question = questions[index];
  const finished = index >= questions.length;

  if (finished || !question) {
    const correct = results.filter(Boolean).length;
    const pct = Math.round((correct / Math.max(questions.length, 1)) * 100);
    const good = pct >= REVIEW_GOOD_PCT;
    const missed = questions.flatMap((q, i) => (results[i] ? [] : [`${q.prompt} → ${q.options[q.answer] ?? ''}`]));
    return (
      <ResultCard
        label={`Simulado ${exam.level} · ${sectionLabel(exam.section)}`}
        heading="Simulado concluído"
        pct={pct}
        firstTry={correct}
        total={questions.length}
        wrong={missed}
        wrongLabel="Para rever:"
        wrongText={(line) => line}
        passed={good}
        mood={resultMood(good, pct)}
      >
        <View style={styles.actions}>
          <Button label="Refazer" onPress={onRestart} />
          <Button label="Voltar aos simulados" variant="ghost" onPress={onExit} />
        </View>
      </ResultCard>
    );
  }

  const answered = picked !== null;
  const stateOf = (i: number): OptionState => {
    if (!answered) return 'idle';
    if (i === question.answer) return 'right';
    return i === picked ? 'wrong' : 'dim';
  };

  const pick = (i: number) => {
    if (answered) return;
    setPicked(i);
    if (i === question.answer) feedbackCorrect();
    else feedbackWrong();
  };

  const next = () => {
    const nextResults = [...results, picked === question.answer];
    setResults(nextResults);
    setPicked(null);
    setIndex(index + 1);
    if (index + 1 >= questions.length) {
      const correct = nextResults.filter(Boolean).length;
      recordExamScore(exam.id, correct);
      markStudied();
      if ((correct / questions.length) * 100 >= REVIEW_GOOD_PCT) feedbackComplete(correct === questions.length);
    }
  };

  return (
    <View style={styles.root}>
      <Card>
        <View style={styles.head}>
          <View style={styles.flex}>
            <AppText variant="caption" color="muted">
              {exam.level} · {sectionLabel(exam.section).toUpperCase()} · {index + 1} DE {questions.length}
            </AppText>
            {question.passage ? (
              <View style={[styles.passage, { backgroundColor: colors.lilacSoft }]}>
                <AppText style={styles.jp}>{question.passage}</AppText>
              </View>
            ) : null}
            <AppText style={styles.jp}>{question.prompt}</AppText>
          </View>
          <Mascot mood={!answered ? 'neutral' : picked === question.answer ? 'happy' : 'sad'} size={56} />
        </View>
      </Card>

      <View style={styles.options}>
        {question.options.map((option, i) => (
          <OptionButton key={option} index={i} label={option} glyph={false} state={stateOf(i)} onPress={() => pick(i)} />
        ))}
      </View>

      {answered ? (
        <Card>
          <AppText accessibilityLiveRegion="polite" color={picked === question.answer ? 'ok' : 'bad'}>
            <Bold>{picked === question.answer ? 'Certo!' : `Resposta certa: ${question.options[question.answer] ?? ''}`}</Bold>
          </AppText>
          <AppText>{question.explanation}</AppText>
          {question.pt ? (
            <AppText variant="caption" color="muted">
              Tradução: {question.pt}
            </AppText>
          ) : null}
          <AiDisclaimer />
          <Button label={index + 1 >= questions.length ? 'Ver o resultado' : 'Próxima'} onPress={next} />
        </Card>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.md },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: spacing.xs },
  row: { flexDirection: 'row', gap: spacing.sm },
  options: { gap: spacing.sm },
  passage: { borderRadius: radii.md, padding: spacing.md },
  jp: { fontSize: 20, lineHeight: 30 },
  actions: { alignSelf: 'stretch', gap: spacing.sm },
});
