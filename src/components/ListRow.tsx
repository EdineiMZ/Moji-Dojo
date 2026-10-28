import { StyleSheet, View } from 'react-native';
import { radii, spacing, useTheme } from '@/theme';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

interface ListRowProps {
  icon: string;
  title: string;
  /** Uma linha sobre o estado atual. */
  summary?: string;
  onPress: () => void;
}

/** Uma linha de lista que leva a outra tela: ícone, título, resumo do estado e seta. */
export function ListRow({ icon, title, summary, onPress }: ListRowProps) {
  const { colors } = useTheme();
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={summary ? `${title}. ${summary}` : title}
      onPress={onPress}
      haptic
      style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.line }]}
    >
      <AppText style={styles.icon} accessible={false}>
        {icon}
      </AppText>
      <View style={styles.texts}>
        <AppText variant="title">{title}</AppText>
        {summary ? (
          <AppText variant="caption" color="muted" numberOfLines={2}>
            {summary}
          </AppText>
        ) : null}
      </View>
      <AppText variant="title" color="muted" accessible={false}>
        ›
      </AppText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderWidth: 1.5, borderRadius: radii.md, padding: spacing.md, minHeight: 64 },
  icon: { fontSize: 28, width: 40, textAlign: 'center' },
  texts: { flex: 1, gap: 2 },
});
