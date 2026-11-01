import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, FuriganaText, Icon, PressableScale } from '@/components';
import type { PhraseExample } from '@/data/types';
import { speakJapanese } from '@/features/speech/voiceStore';
import { SPEECH_RATES } from '@/store/settingsStore';
import { useSettingsStore } from '@/store';
import { fonts, radii, spacing, useTheme } from '@/theme';

/**
 * Frase de exemplo com som: japonês, romaji e tradução. O romaji e o furigana seguem os Ajustes (sempre, só ao tocar
 * na frase, ou nunca). Quando algum depende do toque, o ícone do som toca o áudio e o texto mostra/esconde o apoio;
 * senão a linha toda toca o áudio.
 */
export function ExampleRow({ example }: { example: PhraseExample }) {
  const { colors } = useTheme();
  const speed = useSettingsStore((s) => s.speechSpeed);
  const romajiMode = useSettingsStore((s) => s.romajiMode);
  const showKanji = useSettingsStore((s) => s.showKanji);
  const furiganaMode = useSettingsStore((s) => s.furiganaMode);
  const [revealed, setRevealed] = useState(false);

  const kanji = showKanji ? example.ruby : undefined;
  const needsTap = romajiMode === 'tap' || (kanji !== undefined && furiganaMode === 'tap');
  const romajiVisible = romajiMode === 'always' || (romajiMode === 'tap' && revealed);
  const furiganaVisible = furiganaMode === 'always' || (furiganaMode === 'tap' && revealed);

  const play = () => speakJapanese(example.say ?? example.jp, SPEECH_RATES[speed]);
  const sentence = kanji ? (
    <FuriganaText segments={kanji} showReading={furiganaVisible} />
  ) : (
    <AppText style={{ fontFamily: fonts.bold, fontSize: 18 }}>{example.jp}</AppText>
  );
  const body = (
    <>
      {sentence}
      {romajiVisible ? (
        <AppText variant="caption" color="muted">
          {example.romaji}
        </AppText>
      ) : null}
      <AppText variant="caption">{example.pt}</AppText>
      {needsTap && !revealed ? (
        <AppText variant="caption" color="primary">
          Toque na frase para ver a leitura
        </AppText>
      ) : null}
    </>
  );
  const speaker = (
    <View style={[styles.speaker, { backgroundColor: colors.primarySoft }]}>
      <Icon name="speaker" size={20} color={colors.primaryText} />
    </View>
  );

  if (!needsTap) {
    return (
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={`Ouvir ${example.jp}`}
        onPress={play}
        style={[styles.row, { backgroundColor: colors.background, borderColor: colors.field }]}
      >
        {speaker}
        <View style={styles.text}>{body}</View>
      </PressableScale>
    );
  }

  return (
    <View style={[styles.row, { backgroundColor: colors.background, borderColor: colors.field }]}>
      <PressableScale accessibilityRole="button" accessibilityLabel={`Ouvir ${example.jp}`} onPress={play}>
        {speaker}
      </PressableScale>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={revealed ? 'Esconder a leitura' : 'Mostrar a leitura'}
        onPress={() => setRevealed(!revealed)}
        style={styles.text}
      >
        {body}
      </PressableScale>
    </View>
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
  speaker: { width: 44, height: 44, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, gap: 1 },
});
