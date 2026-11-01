import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Bold, Button, Card } from '@/components';
import { kanaToRomaji } from '@/lib/romaji';
import { fonts, radii, spacing, useTheme } from '@/theme';
import { lookupReading } from './conversion';
import { FlickPad } from './FlickPad';

/** Digitação livre: escreva o que quiser; o app mostra o romaji e, se a leitura é de uma palavra conhecida, as escritas possíveis. */
export function FreeTyping() {
  const { colors } = useTheme();
  const [buffer, setBuffer] = useState('');
  const known = lookupReading(buffer.replace(/[\s　]/g, ''));
  const romaji = buffer ? kanaToRomaji(buffer) : '';

  return (
    <Card enterIndex={0}>
      <AppText color="muted">Escreva o que quiser com o teclado de flick. Se o que digitar for uma palavra que o app conhece, ela aparece embaixo.</AppText>
      <View style={[styles.display, { backgroundColor: colors.background, borderColor: colors.field }]}>
        {buffer ? <AppText style={styles.typed}>{buffer}</AppText> : <AppText color="muted">Use o teclado abaixo</AppText>}
      </View>
      {romaji ? (
        <AppText variant="caption" color="muted">
          {romaji}
        </AppText>
      ) : null}
      {known.length > 0 ? (
        <View style={styles.known} accessibilityLiveRegion="polite">
          {known.slice(0, 4).map((w) => (
            <AppText key={`${w.jp}-${w.meaning}`}>
              <Bold>{w.jp}</Bold> {w.meaning}
            </AppText>
          ))}
        </View>
      ) : null}
      <FlickPad value={buffer} onChange={setBuffer} />
      {buffer ? <Button label="Apagar tudo" variant="ghost" onPress={() => setBuffer('')} /> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  display: { minHeight: 72, borderWidth: 1.5, borderRadius: radii.md, padding: spacing.md, justifyContent: 'center' },
  typed: { fontFamily: fonts.bold, fontSize: 26, lineHeight: 34 },
  known: { gap: spacing.xs },
});
