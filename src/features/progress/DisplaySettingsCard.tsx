import { StyleSheet, Switch, View } from 'react-native';
import { AppText, Card, SegmentedControl } from '@/components';
import { GRAMMAR_N5 } from '@/content/grammarN5';
import { ExampleRow } from '@/features/phrases/ExampleRow';
import { useSettingsStore } from '@/store';
import type { ReadingAid } from '@/store/settingsStore';
import { spacing, useTheme } from '@/theme';

const AID_OPTIONS = [
  { value: 'always' as const, label: 'Sempre' },
  { value: 'tap' as const, label: 'Ao tocar' },
  { value: 'never' as const, label: 'Nunca' },
];

/** Uma frase do app que tem kanji, para mostrar o efeito das escolhas na hora. */
const SAMPLE = GRAMMAR_N5.flatMap((t) => t.examples).find((e) => e.ruby !== undefined && e.jp.length <= 12);

/**
 * Ajustes: como mostrar as frases. O romaji e o furigana podem ficar sempre à mostra, aparecer só ao tocar na
 * frase ou sumir; e as frases que têm kanji podem ser escritas com kanji no lugar do kana. A prévia mostra o efeito.
 */
export function DisplaySettingsCard() {
  const { colors } = useTheme();
  const romajiMode = useSettingsStore((s) => s.romajiMode);
  const showKanji = useSettingsStore((s) => s.showKanji);
  const furiganaMode = useSettingsStore((s) => s.furiganaMode);
  const setRomajiMode = useSettingsStore((s) => s.setRomajiMode);
  const setShowKanji = useSettingsStore((s) => s.setShowKanji);
  const setFuriganaMode = useSettingsStore((s) => s.setFuriganaMode);

  return (
    <Card enterIndex={1}>
      <AppText variant="title">Leitura das frases</AppText>

      <View style={styles.group}>
        <AppText>Romaji</AppText>
        <SegmentedControl<ReadingAid> options={AID_OPTIONS} value={romajiMode} onChange={setRomajiMode} />
      </View>

      <View style={styles.switchRow}>
        <View style={styles.flex}>
          <AppText>Escrever com kanji</AppText>
          <AppText variant="caption" color="muted">
            Nas frases da gramática que têm kanji, mostra a escrita normal em vez de só kana.
          </AppText>
        </View>
        <Switch
          value={showKanji}
          onValueChange={setShowKanji}
          accessibilityLabel="Escrever com kanji"
          trackColor={{ false: colors.line, true: colors.primary }}
          thumbColor={colors.surface}
        />
      </View>

      {showKanji ? (
        <View style={styles.group}>
          <AppText>Furigana (leitura sobre o kanji)</AppText>
          <SegmentedControl<ReadingAid> options={AID_OPTIONS} value={furiganaMode} onChange={setFuriganaMode} />
        </View>
      ) : null}

      {SAMPLE ? (
        <View style={styles.group}>
          <AppText variant="caption" color="muted">
            PRÉVIA
          </AppText>
          <ExampleRow key={`${romajiMode}-${showKanji}-${furiganaMode}`} example={SAMPLE} />
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  group: { gap: spacing.sm },
  flex: { flex: 1, gap: 2 },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
});
