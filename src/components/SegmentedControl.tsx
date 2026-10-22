import { Pressable, StyleSheet, View } from 'react-native';
import { fonts, fontSizes, radii, spacing, useTheme } from '@/theme';
import { AppText } from './AppText';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
}

/** Seletor de uma opção entre poucas (ex.: Hiragana / Katakana / Kanji). */
export function SegmentedControl<T extends string>({ options, value, onChange }: SegmentedControlProps<T>) {
  const { colors } = useTheme();
  return (
    <View style={[styles.track, { backgroundColor: colors.surface, borderColor: colors.line }]}>
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(opt.value)}
            style={[styles.segment, selected && { backgroundColor: colors.primary }]}
          >
            <AppText
              center
              style={{ fontFamily: fonts.bold, fontSize: fontSizes.body - 1 }}
              color={selected ? 'onPrimary' : 'muted'}
            >
              {opt.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: 'row', borderRadius: radii.pill, borderWidth: 1.5, padding: spacing.xs },
  segment: { flex: 1, borderRadius: radii.pill, paddingVertical: spacing.sm + 2 },
});
