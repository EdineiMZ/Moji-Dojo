import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Bold, Button, PressableScale } from '@/components';
import { findWord } from '@/content';
import { segment, type Token } from '@/features/bank/lexicon';
import { speakJapanese } from '@/features/speech/voiceStore';
import { learnedWordIds } from '@/features/vocab/cards';
import { useProgressStore, useSettingsStore } from '@/store';
import { SPEECH_RATES } from '@/store/settingsStore';
import { fonts, radii, spacing, useTheme } from '@/theme';

interface TappableSentenceProps {
  jp: string;
  /** A frase toda em hiragana: usada para achar as palavras quando o japonês tem algo que o dicionário do app não separa. */
  reading: string;
}

/** Os pedaços da frase que o dicionário do app reconhece (pelo texto japonês; se não der, pela leitura em hiragana). */
function tokensOf(jp: string, reading: string): Token[] {
  return segment(jp.replace(/[\s　]/g, '')) ?? segment(reading.replace(/[\s　]/g, '')) ?? [];
}

/** Uma frase da IA em que cada palavra do vocabulário do app é tocável: mostra leitura e significado, e deixa aprender. */
export function TappableSentence({ jp, reading }: TappableSentenceProps) {
  const { colors } = useTheme();
  const speed = useSettingsStore((s) => s.speechSpeed);
  const vocab = useProgressStore((s) => s.vocab);
  const learnWords = useProgressStore((s) => s.learnWords);
  const [picked, setPicked] = useState<Token | null>(null);
  const tokens = useMemo(() => tokensOf(jp, reading), [jp, reading]);
  const known = learnedWordIds(vocab);
  const word = picked?.entry.id ? findWord(picked.entry.id) : undefined;

  if (tokens.length === 0) return <AppText style={styles.jp}>{jp}</AppText>;

  return (
    <View style={styles.root}>
      <View style={styles.tokens}>
        {tokens.map((token, i) => {
          const id = token.entry.id;
          const isKnown = id !== null && known.has(id);
          const text = (
            <AppText
              style={[
                styles.jp,
                id !== null && { borderBottomWidth: 2, borderBottomColor: isKnown ? colors.ok : colors.primary },
                picked === token && { backgroundColor: colors.primarySoft },
              ]}
            >
              {token.surface}
            </AppText>
          );
          return id !== null ? (
            <PressableScale key={`${i}-${token.surface}`} accessibilityRole="button" accessibilityLabel={token.surface} onPress={() => setPicked(picked === token ? null : token)}>
              {text}
            </PressableScale>
          ) : (
            <View key={`${i}-${token.surface}`}>{text}</View>
          );
        })}
      </View>
      {word ? (
        <View style={[styles.panel, { backgroundColor: colors.skySoft }]} accessibilityLiveRegion="polite">
          <AppText>
            <Bold>{word.jp}</Bold>
            {word.reading && word.reading !== word.jp ? ` (${word.reading})` : ''} {word.meaning}
          </AppText>
          <View style={styles.row}>
            <Button label="🔊" variant="soft" onPress={() => speakJapanese((word.reading || word.jp).replace(/\s/g, ''), SPEECH_RATES[speed])} style={styles.small} />
            {known.has(word.id) ? (
              <AppText color="ok">Você já estuda esta palavra.</AppText>
            ) : (
              <Button label="Aprender esta palavra" variant="soft" onPress={() => learnWords([word.id])} style={styles.small} />
            )}
            <Button label="Fechar" variant="ghost" onPress={() => setPicked(null)} style={styles.small} />
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.xs },
  tokens: { flexDirection: 'row', flexWrap: 'wrap' },
  jp: { fontFamily: fonts.regular, fontSize: 20, lineHeight: 30 },
  panel: { borderRadius: radii.md, padding: spacing.md, gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  small: { minHeight: 44 },
});
