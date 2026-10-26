import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Bold, Button, Card, PressableScale } from '@/components';
import { feedbackCorrect, feedbackWrong } from '@/lib/feedback';
import { useProgressStore } from '@/store';
import { fonts, radii, spacing, useTheme } from '@/theme';
import { pickConversion, suggestionBar, type ConversionItem } from './conversion';
import { howTo, simulatorProgress } from './flick';
import { FlickPad } from './FlickPad';
import { useTypingTracker } from './useTypingTracker';

interface Round {
  item: ConversionItem;
  bar: string[];
}

const newRound = (avoid?: string): Round | null => {
  const item = pickConversion(Math.random, avoid);
  return item ? { item, bar: suggestionBar(item) } : null;
};

/**
 * Digitar de verdade em japonês é digitar a leitura em kana e escolher a escrita na barra de sugestões do teclado.
 * Aqui a barra é simulada: digite a leitura e escolha o kanji (ou katakana) certo.
 */
export function ConversionSession() {
  const { colors } = useTheme();
  const markStudied = useProgressStore((s) => s.markStudied);
  const tracker = useTypingTracker(0);
  const [round, setRound] = useState<Round | null>(() => newRound());
  const [buffer, setBuffer] = useState('');
  const [chosen, setChosen] = useState<string | null>(null);

  if (!round) return <Card enterIndex={0}><AppText color="muted">Sem palavras para converter.</AppText></Card>;
  const { item, bar } = round;
  const progress = simulatorProgress(buffer, item.reading);
  const plan = progress.next ? howTo(progress.next) : null;
  const typedAll = progress.done;

  const next = () => {
    tracker.begin();
    setRound(newRound(item.target));
    setBuffer('');
    setChosen(null);
  };

  const pick = (candidate: string) => {
    if (chosen !== null) return;
    setChosen(candidate);
    if (candidate === item.target) {
      feedbackCorrect();
      markStudied();
    } else {
      feedbackWrong();
    }
  };

  const status = chosen !== null
    ? chosen === item.target
      ? 'Certo! Era essa mesma.'
      : `Não era essa. A certa é ${item.target}.`
    : typedAll
      ? 'Agora escolha a escrita certa na barra de sugestões.'
      : progress.correct < [...buffer].length
        ? 'Tem uma letra errada. Use ⌫ para apagar.'
        : plan
          ? plan.text
          : '';

  return (
    <Card enterIndex={0}>
      <AppText color="muted">
        No teclado do celular você digita a <Bold>leitura</Bold> e escolhe a escrita nas sugestões. Treine aqui.
      </AppText>
      <AppText variant="caption" color="muted">
        PALAVRA
      </AppText>
      <AppText>
        <Bold>{item.meaning}</Bold>: digite <Bold>{item.reading}</Bold>
      </AppText>

      <View style={[styles.display, { backgroundColor: colors.background, borderColor: colors.line }]}>
        <AppText style={styles.typed} color={buffer && progress.correct < [...buffer].length ? 'bad' : 'ink'}>
          {buffer || ' '}
        </AppText>
      </View>

      {typedAll ? (
        <View style={styles.bar} accessibilityLabel="Sugestões do teclado">
          {bar.map((candidate) => {
            const isRight = candidate === item.target;
            const background = chosen === null ? colors.lilacSoft : isRight ? colors.okSoft : candidate === chosen ? colors.badSoft : colors.lilacSoft;
            return (
              <PressableScale
                key={candidate}
                accessibilityRole="button"
                onPress={() => pick(candidate)}
                style={[styles.candidate, { backgroundColor: background, borderColor: colors.line }]}
              >
                <AppText style={styles.candidateText}>{candidate}</AppText>
              </PressableScale>
            );
          })}
        </View>
      ) : null}

      <View accessibilityLiveRegion="polite" style={styles.status}>
        <AppText variant="caption" color={chosen === item.target ? 'ok' : chosen !== null ? 'bad' : 'muted'}>
          {status || ' '}
        </AppText>
      </View>

      {!typedAll ? <FlickPad value={buffer} onChange={setBuffer} onType={(v) => tracker.step(v, item.reading)} hintedKey={plan?.key ?? null} /> : null}

      {chosen !== null ? <Button label="Próxima palavra" onPress={next} /> : <Button label="Pular" variant="ghost" onPress={next} />}
    </Card>
  );
}

const styles = StyleSheet.create({
  display: { minHeight: 56, borderWidth: 1.5, borderRadius: radii.md, paddingHorizontal: spacing.md, justifyContent: 'center' },
  typed: { fontFamily: fonts.bold, fontSize: 26, lineHeight: 34 },
  bar: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  candidate: { minHeight: 48, minWidth: 64, borderRadius: radii.md, borderWidth: 1.5, paddingHorizontal: spacing.md, alignItems: 'center', justifyContent: 'center' },
  candidateText: { fontFamily: fonts.bold, fontSize: 20 },
  status: { minHeight: 24, justifyContent: 'center' },
});
