import { StyleSheet, Text, View } from 'react-native';
import { fonts, fontSizes, spacing, useTheme } from '@/theme';

/** Tela provisória da etapa 1: só confirma que tema e fonte funcionam. */
export default function HomePlaceholder() {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.glyph, { color: colors.primary }]}>桜</Text>
      <Text style={[styles.title, { color: colors.ink }]}>Nihongo Dojo</Text>
      <Text style={[styles.sub, { color: colors.muted }]}>にほんご どうじょう</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  glyph: { fontFamily: fonts.bold, fontSize: fontSizes.glyph },
  title: { fontFamily: fonts.bold, fontSize: fontSizes.headline },
  sub: { fontFamily: fonts.regular, fontSize: fontSizes.body },
});
