import { useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { AppText, Button, Card, Mascot, PetalRain, ProgressBar, useScrollIntoView } from '@/components';
import { AiMeaningCheck } from '@/features/ai/AiParts';
import { resultMood } from '@/features/lessons/resultCopy';
import { ResultCard } from '@/features/quiz/ResultCard';
import { REVIEW_GOOD_PCT } from '@/features/review/session';
import { speakJapanese } from '@/features/speech/voiceStore';
import { feedbackComplete, feedbackCorrect, feedbackWrong } from '@/lib/feedback';
import { useSettingsStore } from '@/store';
import { SPEECH_RATES } from '@/store/settingsStore';
import { fonts, fontSizes, radii, spacing, useTheme } from '@/theme';
import type { TranslationItem } from './items';

interface FreeSessionProps {
  items: readonly TranslationItem[];
  title: string;
  onResult: (item: TranslationItem, ok: boolean) => void;
  onExit: () => void;
  again?: { label: string; onPress: () => void };
}

/**
 * "Entender" sem alternativas: lê (e ouve) a frase em japonês, escreve o que entendeu em português (se quiser),
 * confere com a tradução e diz se acertou. Um português livre não dá para corrigir sozinho, então quem decide é a
 * pessoa, olhando a tradução.
 */
export function FreeSession({ items, title, onResult, onExit, again }: FreeSessionProps) {
  const { colors } = useTheme();
  const scrollIntoView = useScrollIntoView();
  const inputRef = useRef<TextInput>(null);
  const speed = useSettingsStore((s) => s.speechSpeed);
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [good, setGood] = useState(0);
  const [finished, setFinished] = useState(false);
  // As frases que errou, para a tela de resultado.
  const [missed, setMissed] = useState<readonly string[]>([]);

  const item = items[index];
  if (!item) return null;

  const play = () => speakJapanese(item.jp.replace(/ /g, ''), SPEECH_RATES[speed]);

  const rate = (ok: boolean) => {
    onResult(item, ok);
    if (ok) {
      feedbackCorrect();
      setGood((n) => n + 1);
    } else {
      feedbackWrong();
      setMissed((list) => [...list, `${item.jp} = ${item.pt}`]);
    }
    if (index + 1 >= items.length) {
      const total = good + (ok ? 1 : 0);
      if ((total / items.length) * 100 >= REVIEW_GOOD_PCT) feedbackComplete(total === items.length);
      setFinished(true);
      return;
    }
    setIndex(index + 1);
    setText('');
    setRevealed(false);
  };

  if (finished) {
    const pct = Math.round((good / items.length) * 100);
    const passed = pct >= REVIEW_GOOD_PCT;
    return (
      <>
        <ResultCard
          label={title}
          heading="Rodada feita"
          pct={pct}
          firstTry={good}
          total={items.length}
          wrong={missed}
          wrongLabel="Para ficar de olho:"
          wrongText={(line) => line}
          passed={passed}
          mood={resultMood(passed, pct)}
        >
          <View style={styles.actions}>
            {again ? <Button label={again.label} onPress={again.onPress} /> : null}
            <Button label="Voltar" variant={again ? 'soft' : 'primary'} onPress={onExit} />
          </View>
        </ResultCard>
        {passed ? <PetalRain /> : null}
      </>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.top}>
        <View style={styles.flex}>
          <AppText variant="caption" color="muted">
            {title}
          </AppText>
          <ProgressBar value={index / items.length} style={styles.bar} />
          <AppText variant="caption" color="muted">
            {index + 1} de {items.length}
          </AppText>
        </View>
        <Mascot mood="neutral" size={72} />
      </View>

      <Card>
        <AppText variant="caption" color="muted">
          O QUE QUER DIZER?
        </AppText>
        <AppText style={styles.jp}>{item.jp}</AppText>
        <Button label="🔊 Ouvir" variant="soft" onPress={play} />
      </Card>

      {!revealed ? (
        <>
          <TextInput
            ref={inputRef}
            onFocus={() => scrollIntoView(inputRef.current)}
            value={text}
            onChangeText={setText}
            placeholder="escreva o que entendeu (opcional)"
            placeholderTextColor={colors.muted}
            accessibilityLabel="Escreva o que entendeu"
            style={[styles.input, { color: colors.ink, backgroundColor: colors.background, borderColor: colors.line }]}
          />
          <Button label="Ver a tradução" silent onPress={() => setRevealed(true)} />
        </>
      ) : (
        <View accessibilityLiveRegion="polite" style={[styles.feedback, { backgroundColor: colors.lilacSoft }]}>
          {text.trim() ? (
            <AppText variant="caption" color="muted">
              Você escreveu: {text.trim()}
            </AppText>
          ) : null}
          <AppText variant="title">{item.pt}</AppText>
          <AppText variant="caption" color="muted">
            {item.romaji}
          </AppText>
          {item.hint ? (
            <AppText variant="caption" color="muted">
              Para lembrar: {item.hint}
            </AppText>
          ) : null}
          {text.trim() ? <AiMeaningCheck jp={item.jp.replace(/ /g, '')} reference={item.pt} answer={text.trim()} /> : null}
          <AppText>Você entendeu?</AppText>
          <View style={styles.row}>
            <Button label="Errei" variant="soft" style={styles.flex} onPress={() => rate(false)} />
            <Button label="Acertei" style={styles.flex} onPress={() => rate(true)} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.md },
  top: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1 },
  bar: { marginVertical: spacing.xs },
  actions: { alignSelf: 'stretch', gap: spacing.sm },
  jp: { fontFamily: fonts.bold, fontSize: 30, lineHeight: 40 },
  input: {
    borderWidth: 1.5,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: fonts.regular,
    fontSize: fontSizes.body,
    minHeight: 52,
  },
  feedback: { borderRadius: radii.md, padding: spacing.md, gap: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.sm },
});
