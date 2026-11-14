import { useEffect } from 'react';
import { Linking, View } from 'react-native';
import { AppText, Button, Card } from '@/components';
import { useSettingsStore } from '@/store';
import { spacing } from '@/theme';
import { installedVersion, runUpdateCheck, useUpdateStore } from './updateStore';

/** Abre o link (APK ou página da release); se o Android não abrir, não faz nada. */
export const openLink = (url: string): void => {
  void Linking.openURL(url).catch(() => undefined);
};

/** Aviso no Início quando há versão nova no GitHub. Consulta uma vez por dia, em silêncio; "Depois" esconde essa versão. */
export function UpdateBanner() {
  const release = useUpdateStore((s) => s.release);
  const dismissed = useSettingsStore((s) => s.updates.dismissed);
  const setUpdates = useSettingsStore((s) => s.setUpdates);

  useEffect(() => {
    void runUpdateCheck();
  }, []);

  if (!release || release.version === dismissed) return null;
  return (
    <Card>
      <AppText variant="title">Versão nova: {release.version}</AppText>
      <AppText color="muted">Você usa a {installedVersion()}. Baixe o APK e instale por cima: o seu progresso fica como está.</AppText>
      <View style={{ gap: spacing.sm }}>
        <Button label="Baixar atualização" onPress={() => openLink(release.apkUrl ?? release.pageUrl)} />
        <Button label="Ver novidades" variant="soft" onPress={() => openLink(release.pageUrl)} />
        <Button label="Depois" variant="ghost" onPress={() => setUpdates({ dismissed: release.version })} />
      </View>
    </Card>
  );
}
