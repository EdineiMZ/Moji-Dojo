import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card } from '@/components';
import { FlickPad } from '@/features/keyboard/FlickPad';
import { fonts, radii, spacing, useTheme } from '@/theme';

interface TypeWordQuestionProps {
  /** O significado que a pessoa vê. */
  meaning: string;
  locked: boolean;
  /** O que foi digitado; vazio quando a pessoa disse que não sabe. */
  onSubmit: (text: string) => void;
}

/** Vê o significado e digita a palavra no teclado de flick do app: produzir sem alternativas nem peças. */
export function TypeWordQuestion({ meaning, locked, onSubmit }: TypeWordQuestionProps) {
  const { colors } = useTheme();
  const [buffer, setBuffer] = useState('');

  return (
    <Card>
      <AppText variant="caption" color="muted" center>
        DIGITE A PALAVRA
      </AppText>
      <AppText variant="headline" center>
        {meaning}
      </AppText>
      <View style={[styles.display, { backgroundColor: colors.background, borderColor: colors.field }]} accessibilityLabel={`Digitado: ${buffer || 'nada'}`}>
        {buffer ? <AppText style={styles.typed}>{buffer}</AppText> : <AppText color="muted">Use o teclado abaixo</AppText>}
      </View>
      {locked ? null : (
        <>
          <FlickPad value={buffer} onChange={setBuffer} />
          <Button label="Conferir" disabled={buffer.length === 0} onPress={() => onSubmit(buffer)} />
          <Button label="Não sei" variant="ghost" onPress={() => onSubmit('')} />
        </>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  display: { minHeight: 72, borderWidth: 1.5, borderRadius: radii.md, padding: spacing.md, justifyContent: 'center' },
  typed: { fontFamily: fonts.bold, fontSize: 26, lineHeight: 34 },
});
