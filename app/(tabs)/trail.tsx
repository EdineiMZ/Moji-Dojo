import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText, ProgressBar, Screen, SegmentedControl } from '@/components';
import { LESSONS } from '@/content/lessons';
import type { Script } from '@/data/types';
import { SCRIPT_NAMES, SCRIPT_ORDER } from '@/features/catalog';
import { LessonRow } from '@/features/lessons/LessonRow';
import { lessonStatus, nextLessonIndex, nextLessonOverall, trailProgress } from '@/features/lessons/trail';
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

  return (
    <Screen>
      <AppText variant="headline">Trilha</AppText>
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

      {/* A chave refaz a entrada animada dos cartões ao trocar de escrita. */}
      <View key={script} style={{ gap: spacing.md }}>
        {LESSONS[script].map((lesson, i) => (
          <LessonRow
            key={lesson.id}
            lesson={lesson}
            index={i}
            status={lessonStatus(script, i, completed)}
            isNext={i === nextIndex}
            onStart={() => openLesson(lesson.id, 'full')}
            onSkip={() => openLesson(lesson.id, 'skip')}
          />
        ))}
      </View>
    </Screen>
  );
}
