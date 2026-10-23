import { useRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { AppText, SegmentedControl, useScrollIntoView } from '@/components';
import { FlickPad } from '@/features/keyboard/FlickPad';
import { useSettingsStore } from '@/store';
import type { TypingInput } from '@/store/settingsStore';
import { fonts, fontSizes, radii, spacing, useTheme } from '@/theme';

const INPUTS = [
  { value: 'pad' as const, label: 'Teclado do app' },
  { value: 'system' as const, label: 'Teclado do celular' },
];

interface JapaneseInputProps {
  value: string;
  onChange: (value: string) => void;
  /** Enter no teclado do celular. */
  onSubmit?: () => void;
  /** Bloqueia a digitação (depois de conferir). */
  disabled?: boolean;
}

/**
 * Campo para digitar em japonês. Dá para escolher o teclado de flick do app (que funciona sem configurar nada) ou o
 * do celular (com o japonês ativado, aceita sugestões e kanji). A escolha fica salva nos Ajustes.
 */
export function JapaneseInput({ value, onChange, onSubmit, disabled = false }: JapaneseInputProps) {
  const { colors } = useTheme();
  const scrollIntoView = useScrollIntoView();
  const inputRef = useRef<TextInput>(null);
  const mode = useSettingsStore((s) => s.typingInput);
  const setMode = useSettingsStore((s) => s.setTypingInput);

  return (
    <View style={styles.root}>
      <SegmentedControl<TypingInput> options={INPUTS} value={mode} onChange={setMode} />

      {mode === 'system' ? (
        <TextInput
          ref={inputRef}
          editable={!disabled}
          onFocus={() => scrollIntoView(inputRef.current)}
          value={value}
          onChangeText={onChange}
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          placeholder="digite em japonês"
          placeholderTextColor={colors.muted}
          accessibilityLabel="Digite em japonês"
          onSubmitEditing={onSubmit}
          style={[styles.field, { color: colors.ink, backgroundColor: colors.background, borderColor: colors.line }]}
        />
      ) : (
        <>
          <View style={[styles.display, { backgroundColor: colors.background, borderColor: colors.line }]}>
            {value ? (
              <AppText style={styles.typed}>{value}</AppText>
            ) : (
              <AppText color="muted">Use o teclado abaixo</AppText>
            )}
          </View>
          {disabled ? null : <FlickPad value={value} onChange={onChange} />}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.sm },
  field: {
    borderWidth: 1.5,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: fonts.regular,
    fontSize: fontSizes.title,
    minHeight: 52,
  },
  display: {
    minHeight: 56,
    borderWidth: 1.5,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  typed: { fontFamily: fonts.bold, fontSize: 24, lineHeight: 32 },
});
