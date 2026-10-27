import { useState } from 'react';
import { Alert, Linking, StyleSheet, View } from 'react-native';
import { AppText, Bold, Button, ProgressBar } from '@/components';
import { useSettingsStore } from '@/store';
import { spacing } from '@/theme';
import { useVoicevoxStore } from './voicevox';
import type { VoicePack } from './voicevoxCatalog';
import { RECOMMENDED_PACK, VOICEVOX_TERMS_URL, formatSize, orderedPacks } from './voicevoxPacks';

/** Linha de um arquivo de voz: quem fala nele e o botão certo para o estado (baixar, baixando, baixada). */
function PackRow({ pack }: { pack: VoicePack }) {
  const installed = useVoicevoxStore((s) => s.installed.includes(pack.file));
  const download = useVoicevoxStore((s) => s.download);
  const downloadPack = useVoicevoxStore((s) => s.downloadPack);
  const cancelDownload = useVoicevoxStore((s) => s.cancelDownload);
  const removePack = useVoicevoxStore((s) => s.removePack);
  const names = pack.speakers.join(' · ');
  const mine = download?.file === pack.file;

  const confirmRemove = () =>
    Alert.alert('Apagar esta voz?', `${names} sai do aparelho (${formatSize(pack.bytes)}). Dá para baixar de novo quando quiser.`, [
      { text: 'Manter', style: 'cancel' },
      { text: 'Apagar', style: 'destructive', onPress: () => void removePack(pack.file) },
    ]);

  return (
    <View style={styles.row}>
      <View style={styles.names}>
        <AppText>{names}</AppText>
        <AppText variant="caption" color="muted">
          {pack.styles.length} {pack.styles.length === 1 ? 'estilo' : 'estilos'} · {formatSize(pack.bytes)}
          {pack.file === RECOMMENDED_PACK ? ' · recomendada' : ''}
          {installed ? ' · baixada ✓' : ''}
        </AppText>
        {mine ? (
          <>
            <ProgressBar value={download.progress} height={8} />
            <AppText variant="caption" color="muted" accessibilityLiveRegion="polite">
              Baixando... {Math.round(download.progress * 100)}%
            </AppText>
          </>
        ) : null}
      </View>
      {mine ? (
        <Button label="Cancelar" variant="ghost" onPress={cancelDownload} />
      ) : installed ? (
        <Button label="Apagar" variant="ghost" onPress={confirmRemove} disabled={download !== null} />
      ) : (
        <Button label={`Baixar ${formatSize(pack.bytes)}`} variant="soft" onPress={() => void downloadPack(pack.file)} disabled={download !== null} />
      )}
    </View>
  );
}

/**
 * Vozes do VOICEVOX para baixar (cada arquivo da release oficial traz um ou mais personagens). O APK leva só o motor; o
 * download só começa depois de a pessoa aceitar os termos de uso.
 */
export function VoicePacks() {
  const accepted = useSettingsStore((s) => s.voicevoxTermsAccepted);
  const setAccepted = useSettingsStore((s) => s.setVoicevoxTermsAccepted);
  const installed = useVoicevoxStore((s) => s.installed);
  const packError = useVoicevoxStore((s) => s.packError);
  const [showAll, setShowAll] = useState(false);

  const all = orderedPacks();
  const shown = showAll ? all : all.filter((p) => p.file === RECOMMENDED_PACK || installed.includes(p.file));

  return (
    <View style={styles.root}>
      <AppText variant="caption" color="muted">
        VOZES PARA BAIXAR
      </AppText>
      {!accepted ? (
        <>
          <AppText color="muted">
            Antes de baixar: cada voz é de um personagem com termos de uso próprios. Em geral dá para usar a voz (até em projetos comerciais) citando{' '}
            <Bold>&ldquo;VOICEVOX:nome do personagem&rdquo;</Bold>, e o app já mostra esse crédito. Não vale fazer engenharia reversa dos arquivos, prejudicar o autor ou
            terceiros, nem usar contra a ordem pública. Os arquivos vêm direto do repositório oficial do VOICEVOX para o seu aparelho.
          </AppText>
          <Button label="Ler os termos completos" variant="ghost" onPress={() => void Linking.openURL(VOICEVOX_TERMS_URL)} />
          <Button label="Li e aceito os termos" onPress={() => setAccepted(true)} />
        </>
      ) : (
        <>
          <AppText variant="caption" color="muted">
            Cada voz tem de 55 a 65 MB: baixe no Wi-Fi. Depois de baixada, funciona sem internet.
          </AppText>
          {shown.map((pack) => (
            <PackRow key={pack.file} pack={pack} />
          ))}
          <Button label={showAll ? 'Mostrar menos' : `Ver todas as vozes (${all.length})`} variant="ghost" onPress={() => setShowAll((v) => !v)} />
        </>
      )}
      {packError ? (
        <AppText color="bad" accessibilityLiveRegion="polite">
          {packError}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  names: { flex: 1, gap: 2 },
});
