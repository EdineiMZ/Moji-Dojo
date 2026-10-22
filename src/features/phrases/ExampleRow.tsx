import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@/components';
import type { PhraseExample } from '@/data/types';
import { speakJapanese } from '@/features/speech/voiceStore';
import { SPEECH_RATES } from '@/store/settingsStore';
import { useSettingsStore } from '@/store';
import { fonts, radii, spacing, useTheme } from '@/theme';

/** Frase de exemplo com botão de som: japonês, romaji e tradução. Toque para ouvir. */
export function ExampleRow({ example }: { example: PhraseExample }) {
  const { colors } = useTheme();
  const speed = useSettingsStore((s) => s.speechSpeed);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ouvir ${example.jp}`}
      onPress={() => speakJapanese(example.say ?? example.jp, SPEECH_RATES[speed])}
      style={[styles.row, { backgroundColor: colors.background, borderColor: colors.line }]}
    >
      <View style={[styles.speaker, { backgroundColor: colors.primarySoft }]}>
        <AppText>🔊</AppText>
      </View>
      <View style={styles.text}>
        <AppText style={{ fontFamily: fonts.bold, fontSize: 18 }}>{example.jp}</AppText>
        <AppText variant="caption" color="muted">
          {example.romaji}
        </AppText>
        <AppText variant="caption">{example.pt}</AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  speaker: { width: 40, height: 40, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, gap: 1 },
});
