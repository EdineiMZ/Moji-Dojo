import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { AppText, Bold, Button } from '@/components';
import { MAX_NOTE_LENGTH } from '@/store/progressStore';
import { useProgressStore } from '@/store';
import { fonts, fontSizes, radii, spacing, useTheme } from '@/theme';

interface MnemonicNoteProps {
  /** O caractere que a pessoa errou. */
  char: string;
  /** A historinha pronta do app, se existir. */
  fallback?: string;
}

/**
 * Mnemônico na hora do erro: mostra a historinha da pessoa (se ela escreveu uma) ou a do app, e deixa reescrever.
 * A que a gente mesmo inventa gruda mais, então a dela passa a valer no lugar da pronta, em todos os erros seguintes.
 */
export function MnemonicNote({ char, fallback }: MnemonicNoteProps) {
  const { colors } = useTheme();
  const note = useProgressStore((s) => s.charNotes[char]);
  const setCharNote = useProgressStore((s) => s.setCharNote);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');

  if (editing) {
    return (
      <View style={styles.box}>
        <AppText variant="caption" color="muted">
          Sua historinha para {char}
        </AppText>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          multiline
          maxLength={MAX_NOTE_LENGTH}
          placeholder={fallback ? `Ex.: ${fallback}` : 'Com o que este símbolo se parece? Que som ele lembra?'}
          placeholderTextColor={colors.muted}
          accessibilityLabel={`Sua historinha para lembrar ${char}`}
          style={[styles.input, { color: colors.ink, backgroundColor: colors.background, borderColor: colors.field }]}
        />
        <View style={styles.row}>
          <Button
            label="Salvar"
            style={styles.flex}
            onPress={() => {
              if (setCharNote(char, draft)) setEditing(false);
            }}
          />
          <Button label="Cancelar" variant="ghost" style={styles.flex} onPress={() => setEditing(false)} />
        </View>
        {note ? (
          <Button
            label="Voltar à do app"
            variant="ghost"
            onPress={() => {
              setCharNote(char, '');
              setEditing(false);
            }}
          />
        ) : null}
      </View>
    );
  }

  const shown = note ?? fallback;
  return (
    <View style={styles.box}>
      {shown ? (
        <AppText variant="caption" color="muted">
          <Bold>{note ? 'Sua historinha: ' : 'Para lembrar: '}</Bold>
          {shown}
        </AppText>
      ) : null}
      <Button
        label={note ? 'Editar a minha' : '✏️ Escrever a minha historinha'}
        variant="ghost"
        onPress={() => {
          setDraft(note ?? '');
          setEditing(true);
        }}
        style={styles.small}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: { gap: spacing.xs },
  row: { flexDirection: 'row', gap: spacing.sm },
  flex: { flex: 1 },
  small: { minHeight: 44 },
  input: {
    borderWidth: 1.5,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: fonts.regular,
    fontSize: fontSizes.body,
    minHeight: 52,
  },
});
