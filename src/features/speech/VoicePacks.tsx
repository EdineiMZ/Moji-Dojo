import { useState } from 'react';
import { Alert, Linking, StyleSheet, View } from 'react-native';
import { AppText, Bold, Button, ProgressBar } from '@/components';
import { radii, spacing, useTheme } from '@/theme';
import { useVoicevoxStore } from './voicevox';
import type { VoicePack } from './voicevoxCatalog';
import { RECOMMENDED_PACK, VOICEVOX_TERMS_URL, formatSize, orderedPacks, packSpeakers, speakerInfo } from './voicevoxPacks';
import { playSpeakerPreview } from './voicevoxPreview';
import { VOICE_DESC_PT, romanName, speakerLabel, styleLabel } from './voicevoxText';

/** Um personagem de um arquivo: nome, descrição da voz, estilos, amostra para ouvir e os termos dele. */
function SpeakerLine({ voice, installed }: { voice: VoicePack['voices'][number]; installed: boolean }) {
  const info = speakerInfo(voice.speaker);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const first = voice.styles[0];

  if (!info || !first) return <AppText>{voice.speaker}</AppText>;

  const listen = async () => {
    setError('');
    setLoading(true);
    try {
      await playSpeakerPreview(info.slug, first[0], installed);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não consegui tocar a amostra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.speaker}>
      <AppText>
        <Bold>{speakerLabel(info.name, info.slug)}</Bold>
      </AppText>
      <AppText variant="caption" color="muted">
        {VOICE_DESC_PT[info.slug] || 'Sem descrição oficial ainda'}
      </AppText>
      <AppText variant="caption" color="muted">
        Tons: {voice.styles.map(([, name]) => styleLabel(name)).join(', ')}
      </AppText>
      <View style={styles.actions}>
        <Button label={loading ? 'Carregando...' : '🔊 Amostra'} variant="soft" onPress={() => void listen()} disabled={loading} style={styles.action} />
        <Button label="Termos" variant="ghost" onPress={() => void Linking.openURL(info.termsUrl)} style={styles.action} />
      </View>
      {error ? (
        <AppText variant="caption" color="bad" accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

/**
 * O aceite que vem antes de cada download: lista os personagens do arquivo, cada um com o link dos termos dele, e só o botão
 * "Li e aceito" deixa o download começar. O aceite vale para este download (apagar a voz e baixar de novo pede de novo).
 */
function TermsPanel({ pack, onAccept, onCancel }: { pack: VoicePack; onAccept: () => void; onCancel: () => void }) {
  const { colors } = useTheme();
  const speakers = pack.voices.flatMap((v) => {
    const info = speakerInfo(v.speaker);
    return info ? [info] : [];
  });
  const names = speakers.map((s) => romanName(s.slug)).join(', ');

  return (
    <View style={[styles.terms, { borderColor: colors.warn }]}>
      <AppText>
        <Bold>Antes de baixar, aceite os termos</Bold>
      </AppText>
      <AppText color="muted">
        Cada personagem tem os próprios termos de uso. Em geral, dá para usar a voz citando <Bold>&ldquo;VOICEVOX:nome do personagem&rdquo;</Bold> (o app já mostra esse
        crédito), sem engenharia reversa dos arquivos, sem prejudicar o autor ou terceiros e sem uso contra a ordem pública. Alguns personagens têm regras extras: leia o
        link de cada um.
      </AppText>
      {speakers.map((s) => (
        <Button key={s.slug} label={`Termos de ${speakerLabel(s.name, s.slug)}`} variant="ghost" onPress={() => void Linking.openURL(s.termsUrl)} />
      ))}
      <Button label="Termos gerais das vozes" variant="ghost" onPress={() => void Linking.openURL(VOICEVOX_TERMS_URL)} />
      <Button label={`Li e aceito os termos de ${names} e quero baixar`} onPress={onAccept} />
      <Button label="Cancelar" variant="ghost" onPress={onCancel} />
    </View>
  );
}

/** Um arquivo de voz: quem fala nele e o botão certo para o estado (baixar, baixando, baixada). */
function PackRow({ pack }: { pack: VoicePack }) {
  const { colors } = useTheme();
  const [confirming, setConfirming] = useState(false);
  const installed = useVoicevoxStore((s) => s.installed.includes(pack.file));
  const download = useVoicevoxStore((s) => s.download);
  const downloadPack = useVoicevoxStore((s) => s.downloadPack);
  const cancelDownload = useVoicevoxStore((s) => s.cancelDownload);
  const removePack = useVoicevoxStore((s) => s.removePack);
  const names = packSpeakers(pack).join(' · ');
  const mine = download?.file === pack.file;
  const count = pack.voices.length;

  const confirmRemove = () =>
    Alert.alert('Apagar esta voz?', `${names} sai do aparelho (${formatSize(pack.bytes)}). Dá para baixar de novo quando quiser.`, [
      { text: 'Manter', style: 'cancel' },
      { text: 'Apagar', style: 'destructive', onPress: () => void removePack(pack.file) },
    ]);

  const accept = () => {
    setConfirming(false);
    void downloadPack(pack.file, true);
  };

  return (
    <View style={[styles.pack, { borderTopColor: colors.line }]}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <AppText variant="caption" color="muted">
            {count} {count === 1 ? 'personagem' : 'personagens'} · {formatSize(pack.bytes)}
            {pack.file === RECOMMENDED_PACK ? ' · recomendada' : ''}
            {installed ? ' · baixada ✓' : ''}
          </AppText>
        </View>
        {mine ? (
          <Button label="Cancelar" variant="ghost" onPress={cancelDownload} />
        ) : installed ? (
          <Button label="Apagar" variant="ghost" onPress={confirmRemove} disabled={download !== null} />
        ) : confirming ? null : (
          <Button label={`Baixar ${formatSize(pack.bytes)}`} variant="soft" onPress={() => setConfirming(true)} disabled={download !== null} />
        )}
      </View>
      {confirming ? <TermsPanel pack={pack} onAccept={accept} onCancel={() => setConfirming(false)} /> : null}
      {mine ? (
        <>
          <ProgressBar value={download.progress} height={8} />
          <AppText variant="caption" color="muted" accessibilityLiveRegion="polite">
            Baixando... {Math.round(download.progress * 100)}%
          </AppText>
        </>
      ) : null}
      {pack.voices.map((voice) => (
        <SpeakerLine key={voice.speaker} voice={voice} installed={installed} />
      ))}
    </View>
  );
}

/**
 * Vozes do VOICEVOX para baixar (cada arquivo da release oficial traz um ou mais personagens). O APK leva só o motor. Ao
 * tocar em "Baixar", a pessoa vê os termos de cada personagem do arquivo e precisa aceitar. Dá para ouvir uma amostra antes.
 */
export function VoicePacks() {
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
      <AppText variant="caption" color="muted">
        Cada arquivo tem de 55 a 65 MB: baixe no Wi-Fi. Depois de baixado, funciona sem internet. Ao baixar, você aceita os termos dos personagens do arquivo.
        &ldquo;Ouvir amostra&rdquo; toca a voz do aparelho (se já baixada) ou a amostra do site oficial (precisa de internet). Os nomes estão em letras latinas e as
        descrições foram traduzidas do site do VOICEVOX.
      </AppText>
      {shown.map((pack) => (
        <PackRow key={pack.file} pack={pack} />
      ))}
      <Button label={showAll ? 'Mostrar menos' : `Ver todas as vozes (${all.length} arquivos)`} variant="ghost" onPress={() => setShowAll((v) => !v)} />
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
  pack: { gap: spacing.md, borderTopWidth: StyleSheet.hairlineWidth, paddingTop: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  headerText: { flex: 1 },
  terms: { gap: spacing.md, borderWidth: 2, borderRadius: radii.md, padding: spacing.md },
  speaker: { gap: 2 },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  action: { flex: 1 },
});
