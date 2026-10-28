import { StyleSheet, View } from 'react-native';
import { AppText, Bold, Button, ChipRow } from '@/components';
import { useSettingsStore } from '@/store';
import { radii, spacing, useTheme } from '@/theme';
import { usePreview, previewLabel } from './usePreview';
import { useVoicevoxStore, warmUpVoicevox } from './voicevox';
import { installedSpeakers, type InstalledSpeaker } from './voicevoxPacks';
import { VOICE_DESC_PT, speakerLabel, styleLabel } from './voicevoxText';

/** Um personagem já baixado: selo "Em uso", descrição, tons (só no escolhido) e os botões "Ouvir" e "Usar esta voz". */
function VoiceRow({ voice, inUse }: { voice: InstalledSpeaker; inUse: boolean }) {
  const { colors } = useTheme();
  const style = useSettingsStore((s) => s.voicevoxStyle);
  const setEngine = useSettingsStore((s) => s.setVoiceEngine);
  const setStyle = useSettingsStore((s) => s.setVoicevoxStyle);
  const ids = voice.styles.map(([id]) => id);
  // O tom que a amostra toca: o escolhido, se for deste personagem; senão o primeiro (o "Normal", na maioria).
  const current = ids.includes(style) ? style : (ids[0] ?? style);
  const { state, error, play } = usePreview(voice.info.slug, current, true);

  const use = (styleId: number) => {
    setStyle(styleId);
    setEngine('voicevox');
    warmUpVoicevox();
  };

  return (
    <View style={[styles.row, { borderColor: inUse ? colors.primary : colors.line }]}>
      <View style={styles.rowHeader}>
        <AppText style={styles.rowName}>
          <Bold>{speakerLabel(voice.info.name, voice.info.slug)}</Bold>
        </AppText>
        {inUse ? (
          <AppText variant="caption" color="primary">
            ✓ Em uso
          </AppText>
        ) : null}
      </View>
      <AppText variant="caption" color="muted">
        {VOICE_DESC_PT[voice.info.slug] || 'Sem descrição oficial ainda'}
      </AppText>
      {inUse && voice.styles.length > 1 ? (
        <>
          <AppText variant="caption" color="muted">
            TOM
          </AppText>
          <ChipRow options={voice.styles.map(([id, name]) => ({ value: String(id), label: styleLabel(name) }))} value={String(current)} onChange={(id) => use(Number(id))} />
        </>
      ) : null}
      <View style={styles.actions}>
        <Button label={previewLabel(state, '🔊 Ouvir')} variant="soft" onPress={() => void play()} disabled={state === 'loading'} style={styles.action} />
        {inUse ? null : <Button label="Usar esta voz" onPress={() => use(current)} style={styles.action} />}
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
 * "Minhas vozes": os personagens que a pessoa já baixou, com a escolha feita ali mesmo. Tocar em "Usar esta voz" já liga o
 * VOICEVOX (não há mais um passo separado para escolher o motor); "Voltar para a voz do Android" desliga.
 */
export function MyVoices() {
  const installed = useVoicevoxStore((s) => s.installed);
  const engine = useSettingsStore((s) => s.voiceEngine);
  const style = useSettingsStore((s) => s.voicevoxStyle);
  const setEngine = useSettingsStore((s) => s.setVoiceEngine);
  const clearCache = useVoicevoxStore((s) => s.clearCache);
  const voices = installedSpeakers(installed);

  if (voices.length === 0) return null;
  const using = engine === 'voicevox';
  const current = voices.find((v) => v.styles.some(([id]) => id === style)) ?? null;

  return (
    <View style={styles.root}>
      <AppText variant="caption" color="muted">
        MINHAS VOZES
      </AppText>
      <AppText color="muted">
        {using && current
          ? `O app fala com ${speakerLabel(current.info.name, current.info.slug)}. Toque em "Ouvir" para testar, ou em "Usar esta voz" noutro personagem para trocar.`
          : using
            ? 'O app fala com a voz de anime, mas o personagem escolhido não está baixado: escolha um abaixo.'
            : 'Hoje o app fala com a voz do Android. Escolha um personagem abaixo e toque em "Usar esta voz".'}
      </AppText>
      {voices.map((voice) => (
        <VoiceRow key={voice.info.slug} voice={voice} inUse={using && voice === current} />
      ))}
      {using ? <Button label="Voltar para a voz do Android" variant="ghost" onPress={() => setEngine('system')} /> : null}
      <Button label="Limpar áudios guardados" variant="ghost" onPress={() => void clearCache()} />
      <AppText variant="caption" color="muted">
        As gravações de falantes nativos (em Sons e vibração) continuam tendo prioridade nas palavras que as têm; desligue-as para ouvir só o VOICEVOX.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.md },
  row: { gap: spacing.sm, borderWidth: 2, borderRadius: radii.md, padding: spacing.md },
  rowHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  rowName: { flex: 1 },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
  action: { flex: 1 },
});
