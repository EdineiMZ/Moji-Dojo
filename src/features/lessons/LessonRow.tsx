import { Pressable, StyleSheet, View } from 'react-native';
import { AppText, Button, Card } from '@/components';
import type { Lesson } from '@/data/types';
import { fonts, radii, spacing, useTheme } from '@/theme';
import type { LessonStatus } from './trail';

interface LessonRowProps {
  lesson: Lesson;
  /** Posição na trilha, começando em 0. */
  index: number;
  status: LessonStatus;
  /** É a próxima lição a estudar (destacada). */
  isNext: boolean;
  onStart: () => void;
  /** Faz só o teste, para pular a lição ("Já sei"). */
  onSkip: () => void;
}

const PREVIEW_COUNT = 7;

export function LessonRow({ lesson, index, status, isNext, onStart, onSkip }: LessonRowProps) {
  const { colors } = useTheme();
  const locked = status === 'lock';
  const done = status === 'done';
  const preview = lesson.items.slice(0, PREVIEW_COUNT).join(' ') + (lesson.items.length > PREVIEW_COUNT ? ' …' : '');

  return (
    <Card enterIndex={Math.min(index, 8)} tone={isNext ? 'pink' : 'plain'} style={locked && styles.locked}>
      <View style={styles.header}>
        <View
          style={[
            styles.badge,
            { backgroundColor: done ? colors.okSoft : locked ? colors.line : colors.primarySoft },
          ]}
        >
          <AppText style={{ fontFamily: fonts.bold }} color={done ? 'ok' : locked ? 'muted' : 'primary'}>
            {done ? '✓' : locked ? '🔒' : index + 1}
          </AppText>
        </View>
        <View style={styles.info}>
          <AppText style={{ fontFamily: fonts.bold }}>{lesson.title}</AppText>
          <AppText variant="caption" color="muted">
            {preview}
          </AppText>
        </View>
      </View>

      <View style={styles.actions}>
        {locked ? (
          <AppText variant="caption" color="muted">
            Bloqueada: conclua a anterior
          </AppText>
        ) : (
          <Button
            label={done ? 'Rever' : 'Começar'}
            variant={done ? 'soft' : 'primary'}
            onPress={onStart}
            style={styles.small}
          />
        )}
        {!done && !lesson.review ? (
          <Pressable accessibilityRole="button" onPress={onSkip} hitSlop={8}>
            <AppText variant="caption" color="primary" style={styles.link}>
              Já sei: fazer o teste
            </AppText>
          </Pressable>
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  locked: { opacity: 0.6 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  badge: { width: 40, height: 40, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, gap: 2 },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  small: { minHeight: 42, paddingHorizontal: spacing.lg },
  link: { textDecorationLine: 'underline', fontFamily: fonts.bold },
});
