import { useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { AppText, Bold, Button, Card, PressableScale, useScrollIntoView } from '@/components';
import { TYPING_CHALLENGES } from '@/data/keyboard';
import { hapticError, hapticSuccess } from '@/lib/haptics';
import { useProgressStore } from '@/store';
import { fonts, fontSizes, radii, spacing, useTheme } from '@/theme';
import { checkTyping, type TypingCheck } from './flick';

/**
 * Desafios com o teclado de verdade do celular: ative o japonês (Gboard), digite a palavra e confira.
 * Quando erra, o app diz o que provavelmente faltou (trocar o teclado, converter, escolher o kanji).
 */
export function ChallengeView() {
  const { colors } = useTheme();
  const scrollIntoView = useScrollIntoView();
  const inputRef = useRef<TextInput>(null);
  const done = useProgressStore((s) => s.challenges);
  const completeChallenge = useProgressStore((s) => s.completeChallenge);

  const firstPending = TYPING_CHALLENGES.findIndex((c) => !done[c.word]);
  const [index, setIndex] = useState(firstPending < 0 ? 0 : firstPending);
  const [text, setText] = useState('');
  const [result, setResult] = useState<TypingCheck | null>(null);

  const challenge = TYPING_CHALLENGES[index];
  if (!challenge) return null;
  const doneCount = TYPING_CHALLENGES.filter((c) => done[c.word]).length;
  const isLast = index >= TYPING_CHALLENGES.length - 1;

  const select = (i: number) => {
    setIndex(i);
    setText('');
    setResult(null);
  };

  const check = () => {
    const outcome = checkTyping(text, challenge.word);
    setResult(outcome);
    if (outcome.ok) {
      hapticSuccess();
      completeChallenge(challenge.word);
    } else {
      hapticError();
    }
  };

  return (
    <Card enterIndex={0}>
      <AppText color="muted">
        Agora com o <Bold>seu teclado de verdade</Bold>. Ative o japonês no teclado do celular, digite e confira.
      </AppText>
      <View style={styles.counter}>
        <AppText variant="caption" color="muted">
          Desafio {index + 1} de {TYPING_CHALLENGES.length}
        </AppText>
        <AppText variant="caption" color="muted">
          Feitos <Bold>{doneCount}</Bold>
        </AppText>
      </View>

      <AppText variant="caption" color="muted">
        DIGITE
      </AppText>
      <AppText>
        <Bold>{challenge.word}</Bold> {challenge.meaning}
      </AppText>
      {challenge.hint ? (
        <AppText variant="caption" color="muted">
          Dica: {challenge.hint}
        </AppText>
      ) : null}

      <TextInput
        ref={inputRef}
        onFocus={() => scrollIntoView(inputRef.current)}
        value={text}
        onChangeText={(t) => {
          setText(t);
          setResult(null);
        }}
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        placeholder="digite aqui"
        placeholderTextColor={colors.muted}
        accessibilityLabel="Digite em japonês"
        onSubmitEditing={check}
        style={[styles.input, { color: colors.ink, backgroundColor: colors.background, borderColor: colors.line }]}
      />
      <Button label="Conferir" onPress={check} />

      {result ? (
        <View style={[styles.feedback, { backgroundColor: result.ok ? colors.okSoft : colors.badSoft }]}>
          <AppText color={result.ok ? 'ok' : 'bad'}>{result.message}</AppText>
          {result.ok ? (
            isLast ? (
              <AppText color="ok">Você fez todos.</AppText>
            ) : (
              <Button label="Próximo desafio" variant="soft" onPress={() => select(index + 1)} />
            )
          ) : null}
        </View>
      ) : null}

      <View style={styles.list}>
        {TYPING_CHALLENGES.map((c, i) => (
          <PressableScale
            key={c.word}
            accessibilityRole="button"
            onPress={() => select(i)}
            style={[
              styles.item,
              { borderColor: i === index ? colors.primary : colors.line, backgroundColor: done[c.word] ? colors.okSoft : colors.surface },
            ]}
          >
            <AppText style={{ fontFamily: fonts.bold }}>{c.word}</AppText>
            <AppText variant="caption" color={done[c.word] ? 'ok' : 'muted'}>
              {done[c.word] ? 'feito ✓' : c.meaning}
            </AppText>
          </PressableScale>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  counter: { flexDirection: 'row', justifyContent: 'space-between' },
  input: {
    borderWidth: 1.5,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: fonts.regular,
    fontSize: fontSizes.title,
    minHeight: 52,
  },
  feedback: { borderRadius: radii.md, padding: spacing.md, gap: spacing.sm },
  list: { gap: spacing.xs },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: radii.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
});
