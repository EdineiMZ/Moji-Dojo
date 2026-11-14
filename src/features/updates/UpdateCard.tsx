import { StyleSheet, Switch, View } from 'react-native';
import { AppText, Button, Card } from '@/components';
import { useSettingsStore } from '@/store';
import { spacing, useTheme } from '@/theme';
import { openLink } from './UpdateBanner';
import { installedVersion, runUpdateCheck, useUpdateStore } from './updateStore';

const MESSAGES = {
  current: 'Você está com a versão mais recente.',
  none: 'Ainda não há versão publicada para comparar.',
  error: 'Não consegui consultar agora. Confira a internet e tente de novo.',
} as const;

/** Ajustes → Avançado: versão instalada, "procurar sozinho" e "Procurar agora". */
export function UpdateCard() {
  const { colors } = useTheme();
  const autoCheck = useSettingsStore((s) => s.updates.autoCheck);
  const setUpdates = useSettingsStore((s) => s.setUpdates);
  const checking = useUpdateStore((s) => s.checking);
  const last = useUpdateStore((s) => s.last);
  const release = useUpdateStore((s) => s.release);

  const status = release ? `Há uma versão nova: ${release.version}.` : last && last !== 'newer' ? MESSAGES[last] : null;

  return (
    <Card enterIndex={0}>
      <AppText variant="title">Atualizações</AppText>
      <AppText color="muted">Versão instalada: {installedVersion()}</AppText>
      <View style={styles.row}>
        <View style={styles.flex}>
          <AppText>Procurar versão nova sozinho</AppText>
          <AppText variant="caption" color="muted">
            Uma vez por dia, ao abrir o app, ele pergunta ao GitHub se saiu uma versão nova. A consulta é anônima: não envia nada seu. Você escolhe quando instalar.
          </AppText>
        </View>
        <Switch
          value={autoCheck}
          onValueChange={(value) => setUpdates({ autoCheck: value })}
          accessibilityLabel="Procurar versão nova sozinho"
          trackColor={{ false: colors.line, true: colors.primary }}
          thumbColor={colors.surface}
        />
      </View>
      <Button label={checking ? 'Procurando…' : 'Procurar agora'} variant="soft" disabled={checking} onPress={() => void runUpdateCheck(true)} />
      {status ? <AppText>{status}</AppText> : null}
      {release ? (
        <View style={{ gap: spacing.sm }}>
          <Button label="Baixar atualização" onPress={() => openLink(release.apkUrl ?? release.pageUrl)} />
          <Button label="Ver novidades" variant="ghost" onPress={() => openLink(release.pageUrl)} />
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: 2 },
});
