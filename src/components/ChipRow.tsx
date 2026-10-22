import { ScrollView, StyleSheet } from 'react-native';
import { fonts, radii, spacing, useTheme } from '@/theme';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

interface ChipRowProps<T extends string> {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

/** Escolha de uma opção entre várias, em chips que rolam na horizontal (ex.: categorias). */
export function ChipRow<T extends string>({ options, value, onChange }: ChipRowProps<T>) {
  const { colors } = useTheme();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <PressableScale
            key={opt.value}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(opt.value)}
            haptic
            style={[
              styles.chip,
              { backgroundColor: selected ? colors.primary : colors.surface, borderColor: selected ? colors.primary : colors.line },
            ]}
          >
            <AppText color={selected ? 'onPrimary' : 'ink'} style={{ fontFamily: fonts.bold }}>
              {opt.label}
            </AppText>
          </PressableScale>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: spacing.sm, paddingVertical: spacing.xs },
  chip: { borderRadius: radii.pill, borderWidth: 1.5, minHeight: 44, justifyContent: 'center', paddingHorizontal: spacing.lg },
});
