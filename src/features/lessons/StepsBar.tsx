import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components';
import { fonts, radii, spacing, useTheme } from '@/theme';

export type LessonStep = 'know' | 'write' | 'test';

export const STEP_LABELS: Readonly<Record<LessonStep, string>> = {
  know: 'Conhecer',
  write: 'Escrever',
  test: 'Testar',
};

interface StepsBarProps {
  steps: readonly LessonStep[];
  current: LessonStep;
}

/** "1. Conhecer · 2. Escrever · 3. Testar", com o passo atual em destaque. */
export function StepsBar({ steps, current }: StepsBarProps) {
  const { colors } = useTheme();
  const currentIndex = steps.indexOf(current);
  return (
    <View style={styles.row}>
      {steps.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <View
            key={step}
            style={[
              styles.pill,
              { backgroundColor: active ? colors.primary : done ? colors.okSoft : colors.surface, borderColor: colors.line },
            ]}
          >
            <AppText
              variant="caption"
              color={active ? 'onPrimary' : done ? 'ok' : 'muted'}
              style={{ fontFamily: fonts.bold }}
            >
              {i + 1}. {STEP_LABELS[step]}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  pill: { borderRadius: radii.pill, borderWidth: 1, paddingVertical: spacing.xs + 1, paddingHorizontal: spacing.md },
});
