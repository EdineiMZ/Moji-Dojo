import { Fragment, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText, Button, ProgressBar, Screen, SegmentedControl } from '@/components';
import { LESSONS } from '@/content/lessons';
import type { Script } from '@/data/types';
import { SCRIPT_NAMES, SCRIPT_ORDER } from '@/features/catalog';
import { LessonRow } from '@/features/lessons/LessonRow';
import { kanjiLessonLevel, lessonStatus, nextLessonIndex, nextLessonOverall, trailProgress } from '@/features/lessons/trail';
import { BrakeNotice } from '@/features/review/BrakeNotice';
import { PracticeCard } from '@/features/review/PracticeCard';
import { useProgressStore } from '@/store';
import { spacing } from '@/theme';

const SCRIPT_OPTIONS = SCRIPT_ORDER.map((value) => ({ value, label: SCRIPT_NAMES[value] }));

export default function TrailScreen() {
  const router = useRouter();
  const completed = useProgressStore((s) => s.lessons);
  // Abre na escrita da próxima lição recomendada; depois o usuário escolhe.
  const [script, setScript] = useState<Script>(() => nextLessonOverall(completed)?.script ?? 'hira');

  const { done, total } = trailProgress(script, completed);
  const nextIndex = nextLessonIndex(script, completed);

  const openLesson = (id: string, mode: 'full' | 'skip') =>
    router.push({ pathname: '/lesson/[id]', params: { id, mode } });

  // No kanji, as lições se agrupam por nível (N5, N4, N3), cada um com o seu progresso.
  const levelOf = (lessonIndex: number): string | null => {
    const lesson = LESSONS[script][lessonIndex];
    return script === 'kanji' && lesson ? kanjiLessonLevel(lesson) : null;
  };
  const levelProgress = (level: string) => {
    const lessons = LESSONS[script].filter((_, i) => levelOf(i) === level);
    return { done: lessons.filter((l) => completed[l.id]).length, total: lessons.length };
  };

  return (
    <Screen>
      <AppText variant="headline">Trilha</AppText>
      <BrakeNotice />
      <PracticeCard />
      <SegmentedControl options={SCRIPT_OPTIONS} value={script} onChange={setScript} />

      <View style={{ gap: spacing.xs }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <AppText color="muted">{SCRIPT_NAMES[script]}</AppText>
          <AppText color="muted">
            {done} de {total} lições
          </AppText>
        </View>
        <ProgressBar value={total ? done / total : 0} />
      </View>

      {/* Um só atalho para quem já sabe parte da matéria, no lugar de um "Já sei" em cada lição. */}
      {done === 0 ? <Button label="Já sei um pouco: fazer o nivelamento" variant="ghost" onPress={() => router.push('/placement')} /> : null}

      {/* A chave refaz a entrada animada dos cartões ao trocar de escrita. */}
      <View key={script} style={{ gap: spacing.md }}>
        {LESSONS[script].map((lesson, i) => {
          const level = levelOf(i);
          const startsLevel = level !== null && levelOf(i - 1) !== level;
          const progress = level !== null ? levelProgress(level) : null;
          return (
            <Fragment key={lesson.id}>
              {startsLevel && progress ? (
                <View style={{ gap: spacing.xs, marginTop: i === 0 ? 0 : spacing.md }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <AppText variant="title">{level}</AppText>
                    <AppText color="muted">
                      {progress.done} de {progress.total} lições
                    </AppText>
                  </View>
                  <ProgressBar value={progress.total ? progress.done / progress.total : 0} />
                </View>
              ) : null}
              <LessonRow
                lesson={lesson}
                index={i}
                status={lessonStatus(script, i, completed)}
                isNext={i === nextIndex}
                onStart={() => openLesson(lesson.id, 'full')}
                onSkip={() => openLesson(lesson.id, 'skip')}
              />
            </Fragment>
          );
        })}
      </View>
    </Screen>
  );
}
