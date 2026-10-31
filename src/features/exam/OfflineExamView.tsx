import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Bold, Button, Card, ChipRow, Mascot } from '@/components';
import { resultMood } from '@/features/lessons/resultCopy';
import { OptionButton, type OptionState } from '@/features/quiz/OptionButton';
import { ResultCard } from '@/features/quiz/ResultCard';
import { REVIEW_GOOD_PCT } from '@/features/review/session';
import { feedbackComplete, feedbackCorrect, feedbackWrong } from '@/lib/feedback';
import { useProgressStore } from '@/store';
import { spacing } from '@/theme';
import { examTimeMs, formatClock, SECONDS_PER_QUESTION, useExamClock, WARNING_MS } from './clock';
import { buildExam, EXAM_LEVELS, EXAM_SECTIONS, EXAM_SIZES, scoreBySection, type ExamLevel, type ExamQuestion } from './buildExam';

const sectionLabel = (id: ExamQuestion['section']): string => EXAM_SECTIONS.find((s) => s.id === id)?.label ?? id;

/** Simulado offline: perguntas do próprio conteúdo do app, por nível, com nota por seção. Funciona sem IA e sem internet. */
export function OfflineExamView() {
  const [level, setLevel] = useState<ExamLevel>('N5');
  const [size, setSize] = useState(5);
  const [timed, setTimed] = useState(false);
  const [questions, setQuestions] = useState<readonly ExamQuestion[] | null>(null);

  if (questions) return <ExamSession level={level} questions={questions} timed={timed} onRestart={() => setQuestions(buildExam(level, size))} onExit={() => setQuestions(null)} />;

  return (
    <Card enterIndex={0}>
      <AppText variant="title">Simulado</AppText>
      <AppText color="muted">
        Uma prova com perguntas do que o app ensina, em quatro seções: {EXAM_SECTIONS.map((s) => s.label.toLowerCase()).join(', ')}. Cada seção tem a sua nota. Funciona sem internet e sem IA.
      </AppText>
      <AppText variant="caption" color="muted">
        NÍVEL
      </AppText>
      <ChipRow options={EXAM_LEVELS.map((l) => ({ value: l, label: l }))} value={level} onChange={setLevel} />
      <AppText variant="caption" color="muted">
        PERGUNTAS POR SEÇÃO
      </AppText>
      <ChipRow options={EXAM_SIZES.map((n) => ({ value: String(n), label: String(n) }))} value={String(size)} onChange={(v) => setSize(Number(v))} />
      <AppText variant="caption" color="muted">
        TEMPO
      </AppText>
      <ChipRow
        options={[
          { value: 'free', label: 'Sem tempo' },
          { value: 'timed', label: `Tempo de prova (${SECONDS_PER_QUESTION} s por pergunta)` },
        ]}
        value={timed ? 'timed' : 'free'}
        onChange={(v) => setTimed(v === 'timed')}
      />
      <AppText variant="caption" color="muted">
        Total: até {size * EXAM_SECTIONS.length} perguntas.{timed ? ` Com tempo, a prova toda tem ${formatClock(examTimeMs(size * EXAM_SECTIONS.length))}; o que ficar sem resposta quando o tempo acabar conta como errado.` : ''} Cada nível usa só o seu conteúdo. As perguntas vêm do vocabulário, dos kanji e das frases de gramática, que ainda não foram revisados por um falante.
      </AppText>
      <Button label="Começar o simulado" onPress={() => setQuestions(buildExam(level, size))} />
    </Card>
  );
}

function ExamSession({ level, questions, timed, onExit, onRestart }: { level: ExamLevel; questions: readonly ExamQuestion[]; timed: boolean; onExit: () => void; onRestart: () => void }) {
  const markStudied = useProgressStore((s) => s.markStudied);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [results, setResults] = useState<readonly boolean[]>([]);

  const answeredAll = index >= questions.length;
  const clock = useExamClock(timed ? examTimeMs(questions.length) : null, !answeredAll);
  // O tempo acabou: o que não foi respondido conta como errado.
  const timedOut = clock.expired && !answeredAll;
  const markStudiedNow = timedOut;
  useEffect(() => {
    if (markStudiedNow) markStudied();
  }, [markStudiedNow, markStudied]);

  const question = questions[index];
  const finished = answeredAll || timedOut;

  if (finished || !question) {
    const final = questions.map((_, i) => results[i] ?? false);
    const unanswered = questions.length - results.length;
    const correct = final.filter(Boolean).length;
    const pct = Math.round((correct / Math.max(questions.length, 1)) * 100);
    const good = pct >= REVIEW_GOOD_PCT;
    const missed = questions.flatMap((q, i) => (final[i] ? [] : [`${q.prompt} → ${q.options[q.answer] ?? ''}`]));
    return (
      <ResultCard
        label={`Simulado ${level}`}
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
        <View style={styles.scores}>
          <AppText variant="caption" color="muted">
            NOTA POR SEÇÃO
          </AppText>
          {timedOut && unanswered > 0 ? (
            <AppText color="bad" accessibilityLiveRegion="polite">
              <Bold>O tempo acabou.</Bold> {unanswered} {unanswered === 1 ? 'pergunta ficou' : 'perguntas ficaram'} sem resposta e {unanswered === 1 ? 'conta' : 'contam'} como errada{unanswered === 1 ? '' : 's'}.
            </AppText>
          ) : null}
          {scoreBySection(questions, final).map((s) => (
            <AppText key={s.section} color={s.pct >= REVIEW_GOOD_PCT ? 'ok' : 'bad'}>
              <Bold>{sectionLabel(s.section)}:</Bold> {s.correct} de {s.total} ({s.pct}%)
            </AppText>
          ))}
        </View>
        <View style={styles.actions}>
          <Button label="Refazer com perguntas novas" onPress={onRestart} />
          <Button label="Voltar" variant="ghost" onPress={onExit} />
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
      markStudied();
      const correct = nextResults.filter(Boolean).length;
      if ((correct / questions.length) * 100 >= REVIEW_GOOD_PCT) feedbackComplete(correct === questions.length);
    }
  };

  return (
    <View style={styles.root}>
      <Card>
        <View style={styles.head}>
          <View style={styles.flex}>
            <AppText variant="caption" color="muted">
              {level} · {sectionLabel(question.section).toUpperCase()} · {index + 1} DE {questions.length}
            </AppText>
            {clock.left !== null ? (
              <AppText color={clock.left <= WARNING_MS ? 'bad' : 'muted'} accessibilityLabel={`Tempo restante ${formatClock(clock.left)}`}>
                <Bold>⏱ {formatClock(clock.left)}</Bold>
              </AppText>
            ) : null}
            <AppText style={styles.prompt}>{question.prompt}</AppText>
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
  options: { gap: spacing.sm },
  prompt: { fontSize: 20, lineHeight: 30 },
  scores: { alignSelf: 'stretch', gap: spacing.xs },
  actions: { alignSelf: 'stretch', gap: spacing.sm },
});
