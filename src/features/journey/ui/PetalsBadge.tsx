import { StyleSheet } from 'react-native';
import { AppText, PressableScale } from '@/components';
import { useProgressStore } from '@/store';
import { fonts, radii, spacing, useTheme } from '@/theme';

interface PetalsBadgeProps {
  onPress?: () => void;
}

/** O saldo de pétalas num selo pequeno. Se tiver `onPress`, vira um botão (por exemplo, para abrir a loja). */
export function PetalsBadge({ onPress }: PetalsBadgeProps) {
  const { colors } = useTheme();
  const petals = useProgressStore((s) => s.journey.petals);
  const body = (
    <AppText style={[styles.text, { color: colors.ink }]}>
      🌸 {petals}
    </AppText>
  );
  if (!onPress) return <>{body}</>;
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`${petals} pétalas. Abrir o Mochi`}
      onPress={onPress}
      style={[styles.pill, { backgroundColor: colors.surface, borderColor: colors.line }]}
    >
      {body}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  text: { fontFamily: fonts.bold, fontSize: 16 },
  pill: { borderRadius: radii.pill, borderWidth: 1.5, paddingHorizontal: spacing.md, minHeight: 48, justifyContent: 'center' },
});
