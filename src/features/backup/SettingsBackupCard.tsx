import { useState } from 'react';
import { Share, StyleSheet, TextInput, View } from 'react-native';
import { AppText, Bold, Button, Card, useScrollIntoView } from '@/components';
import { useSettingsStore } from '@/store';
import { fonts, fontSizes, radii, spacing, useTheme } from '@/theme';
import { applySettings, exportSettings, parseSettings, SETTINGS_BACKUP_ERROR_MESSAGES, type SettingsParseResult } from './settingsBackup';

/**
 * Exporta e importa só as configurações (tema, voz, leitura, lembretes, metas, IA...), sem o progresso: um código curto
 * ("MDJC1:") para levar as preferências a outro aparelho.
 */
export function SettingsBackupCard() {
  const { colors } = useTheme();
  const scrollIntoView = useScrollIntoView();
  const [code, setCode] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [parsed, setParsed] = useState<Extract<SettingsParseResult, { ok: true }> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const input = [styles.input, { color: colors.ink, backgroundColor: colors.background, borderColor: colors.field }];

  const generate = () => setCode(exportSettings(useSettingsStore.getState()));

  const verify = () => {
    setDone(false);
    const result = parseSettings(text);
    if (!result.ok) {
      setParsed(null);
      setError(SETTINGS_BACKUP_ERROR_MESSAGES[result.error]);
      return;
    }
    setError(null);
    setParsed(result);
  };

  const apply = () => {
    if (!parsed) return;
    const store = useSettingsStore;
    store.setState(applySettings(store.getState(), parsed.changes));
    setParsed(null);
    setText('');
    setDone(true);
  };

  return (
    <Card enterIndex={1}>
      <AppText variant="title">Só as configurações</AppText>
      <AppText color="muted">
        Leve o tema, a voz, a leitura, os lembretes, as metas e a IA para outro aparelho, sem mexer no progresso. Ficam de fora a chave da IA, o seu nome e a voz do Android escolhida.
      </AppText>

      {code === null ? (
        <Button label="Gerar código das configurações" variant="soft" onPress={generate} />
      ) : (
        <>
          <TextInput readOnly multiline selectTextOnFocus value={code} accessibilityLabel="Código das configurações" style={input} />
          <Button label="Compartilhar código" onPress={() => void Share.share({ message: code }).catch(() => undefined)} />
          <Button label="Fechar" variant="ghost" onPress={() => setCode(null)} />
        </>
      )}

      <AppText variant="caption" color="muted">
        IMPORTAR
      </AppText>
      <TextInput
        value={text}
        onChangeText={(t) => {
          setText(t);
          setParsed(null);
          setError(null);
          setDone(false);
        }}
        onFocus={(e) => scrollIntoView(e.target)}
        multiline
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Cole aqui o código que começa com MDJC1:"
        placeholderTextColor={colors.muted}
        accessibilityLabel="Código das configurações para importar"
        style={input}
      />
      <Button label="Verificar o código" variant="soft" onPress={verify} disabled={text.trim().length === 0} />
      {error ? (
        <AppText color="bad" accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : null}
      {parsed ? (
        <View style={styles.found}>
          <AppText accessibilityLiveRegion="polite">
            <Bold>{parsed.keys.length} configurações válidas</Bold>
            {parsed.ignored > 0 ? ` (${parsed.ignored} ignorada${parsed.ignored === 1 ? '' : 's'} por estarem inválidas)` : ''}. Elas substituem as de agora; o progresso não muda.
          </AppText>
          <Button label="Aplicar as configurações" onPress={apply} />
        </View>
      ) : null}
      {done ? (
        <AppText color="ok" accessibilityLiveRegion="polite">
          Configurações aplicadas.
        </AppText>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  found: { gap: spacing.sm },
  input: {
    minHeight: 72,
    maxHeight: 140,
    borderWidth: 1.5,
    borderRadius: radii.md,
    padding: spacing.md,
    fontFamily: fonts.regular,
    fontSize: fontSizes.caption,
    textAlignVertical: 'top',
  },
});
