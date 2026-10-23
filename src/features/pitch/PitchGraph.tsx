import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components';
import { fonts, spacing, useTheme } from '@/theme';
import { moras, pitchKind, pitchPattern, PITCH_KIND_LABELS } from './pitch';

interface PitchGraphProps {
  reading: string;
  accent: number;
  /** Mostra o nome do tipo de acento embaixo. */
  caption?: boolean;
}

/**
 * Desenha o tom de uma palavra: cada mora numa coluna, com uma barra no alto quando a mora é alta e embaixo quando é
 * baixa. A última coluna, em cinza, é a partícula que vem depois: ela mostra se o tom cai ou continua alto.
 */
export function PitchGraph({ reading, accent, caption = false }: PitchGraphProps) {
  const { colors } = useTheme();
  const list = moras(reading);
  const pattern = pitchPattern(list.length, accent);
  // A partícula depois da palavra: alta se não houve queda (heiban), baixa nos outros casos.
  const particleHigh = accent === 0;
  const columns = [...list.map((m, i) => ({ text: m, high: pattern[i] as boolean, ghost: false })), { text: 'が', high: particleHigh, ghost: true }];

  return (
    <View accessible accessibilityLabel={`${reading}: ${PITCH_KIND_LABELS[pitchKind(list.length, accent)]}`}>
      <View style={styles.row}>
        {columns.map((c, i) => (
          <View key={i} style={styles.column}>
            <View style={[styles.slot, { borderBottomColor: c.high ? (c.ghost ? colors.muted : colors.primary) : 'transparent' }]} />
            <AppText style={[styles.mora, c.ghost && { color: colors.muted }]}>{c.text}</AppText>
            <View style={[styles.slot, { borderTopColor: !c.high ? (c.ghost ? colors.muted : colors.primary) : 'transparent' }]} />
          </View>
        ))}
      </View>
      {caption ? (
        <AppText variant="caption" color="muted">
          [{accent}] {PITCH_KIND_LABELS[pitchKind(list.length, accent)]}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  column: { alignItems: 'center', minWidth: 28 },
  slot: { height: 8, alignSelf: 'stretch', borderBottomWidth: 3, borderTopWidth: 3, borderBottomColor: 'transparent', borderTopColor: 'transparent' },
  mora: { fontFamily: fonts.bold, fontSize: 22, lineHeight: 30, paddingHorizontal: spacing.xs / 2 },
});
