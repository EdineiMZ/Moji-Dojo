import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card } from '@/components';
import type { VocabWord } from '@/content';
import { speakJapanese } from '@/features/speech/voiceStore';
import { useSettingsStore } from '@/store';
import { SPEECH_RATES } from '@/store/settingsStore';
import { fonts, spacing } from '@/theme';
import { RomajiLine } from '@/features/phrases/RomajiLine';
import { PitchGraph } from '@/features/pitch/PitchGraph';
import { accentOf, moras } from '@/features/pitch/pitch';
import { kanjiBreakdown } from './kanjiWords';

interface WordCardProps {
  word: VocabWord;
  enterIndex?: number;
}

/** Palavra para aprender: como se escreve, a leitura, o significado, os kanji que a formam e o som. */
export function WordCard({ word, enterIndex }: WordCardProps) {
  const speed = useSettingsStore((s) => s.speechSpeed);
  const breakdown = kanjiBreakdown(word);
  const showReading = word.reading !== word.jp;
  const accent = accentOf(word);

  return (
    <Card {...(enterIndex === undefined ? {} : { enterIndex })}>
      <AppText style={styles.jp}>{word.jp}</AppText>
      {showReading ? <AppText color="muted">{word.reading}</AppText> : null}
      {word.romaji ? <RomajiLine text={word.romaji} /> : null}
      <AppText variant="title">{word.meaning}</AppText>
      {accent !== undefined && moras(word.reading).length >= 2 ? <PitchGraph reading={word.reading} accent={accent} caption /> : null}
      {breakdown.length > 0 ? (
        <View style={styles.kanji}>
          <AppText variant="caption" color="muted">
            Kanji da palavra
          </AppText>
          {breakdown.map((line) => (
            <AppText key={line}>{line}</AppText>
          ))}
        </View>
      ) : null}
      <Button label="🔊 Ouvir" variant="soft" onPress={() => speakJapanese(word.reading, SPEECH_RATES[speed])} />
    </Card>
  );
}

const styles = StyleSheet.create({
  jp: { fontFamily: fonts.bold, fontSize: 40, lineHeight: 50 },
  kanji: { gap: spacing.xs },
});
