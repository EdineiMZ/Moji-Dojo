import { useRef, useState } from 'react';
import { Alert, StyleSheet, TextInput, View } from 'react-native';
import { AppText, Bold, Button, ChipRow, LearnMore, PressableScale } from '@/components';
import { useSettingsStore } from '@/store';
import { fonts, fontSizes, radii, spacing, useTheme } from '@/theme';
import { COMPARE_PHRASES, compareVoices } from './voiceCompare';
import { filterInstalled } from './voiceFilter';
import { INTONATION_OPTIONS, PITCH_OPTIONS, toggleFavorite } from './voiceTuning';
import { usePreview, previewLabel } from './usePreview';
import { useVoicevoxStore, warmUpVoicevox } from './voicevox';
import { formatSize, installedBytes, installedSpeakers, type InstalledSpeaker } from './voicevoxPacks';
import { VOICE_DESC_PT, speakerLabel, styleLabel } from './voicevoxText';

/** Um personagem já baixado: favorito, selo "Em uso", descrição, tons (só no escolhido) e os botões "Ouvir" e "Usar esta voz". */
function VoiceRow({ voice, inUse, favorite, onFavorite, playing }: { voice: InstalledSpeaker; inUse: boolean; favorite: boolean; onFavorite: () => void; playing: boolean }) {
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
    <View style={[styles.row, { borderColor: inUse || playing ? colors.primary : colors.line }]}>
      <View style={styles.rowHeader}>
        <AppText style={styles.rowName}>
          <Bold>{speakerLabel(voice.info.name, voice.info.slug)}</Bold>
        </AppText>
        {inUse ? (
          <AppText variant="caption" color="primary">
            ✓ Em uso
          </AppText>
        ) : null}
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={favorite ? `Tirar ${voice.info.name} dos favoritos` : `Favoritar ${voice.info.name}`}
          accessibilityState={{ selected: favorite }}
          onPress={onFavorite}
          hitSlop={8}
          style={styles.star}
        >
          <AppText variant="title" color={favorite ? 'primary' : 'muted'}>
            {favorite ? '★' : '☆'}
          </AppText>
        </PressableScale>
      </View>
      <AppText variant="caption" color="muted">
        {VOICE_DESC_PT[voice.info.slug] || 'Sem descrição oficial ainda'}
      </AppText>
      {playing ? (
        <AppText variant="caption" color="primary">
          Tocando na comparação…
        </AppText>
      ) : null}
      {inUse && voice.styles.length > 1 ? (
        <>
          <AppText variant="caption" color="muted">
            TOM
          </AppText>
          <ChipRow wrap options={voice.styles.map(([id, name]) => ({ value: String(id), label: styleLabel(name) }))} value={String(current)} onChange={(id) => use(Number(id))} />
        </>
      ) : null}
      <View style={styles.actions}>
        <Button label={previewLabel(state, '🔊 Ouvir')} variant="ghost" onPress={() => void play()} disabled={state === 'loading'} style={styles.action} />
        {inUse ? null : <Button label="Usar" variant="soft" onPress={() => use(current)} style={styles.action} />}
      </View>
      {error ? (
        <AppText variant="caption" color="bad" accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

/** Altura, entonação e a voz do atendente nos diálogos. */
function TuningSection({ voices }: { voices: readonly InstalledSpeaker[] }) {
  const pitch = useSettingsStore((s) => s.voicevoxPitch);
  const intonation = useSettingsStore((s) => s.voicevoxIntonation);
  const staff = useSettingsStore((s) => s.voicevoxStaffStyle);
  const setPitch = useSettingsStore((s) => s.setVoicevoxPitch);
  const setIntonation = useSettingsStore((s) => s.setVoicevoxIntonation);
  const setStaff = useSettingsStore((s) => s.setVoicevoxStaffStyle);

  // Cada personagem entra com o primeiro tom (o "Normal", na maioria); o valor guardado é o id do estilo.
  const staffOptions = [{ value: 'same', label: 'A mesma voz' }, ...voices.flatMap((v) => (v.styles[0] ? [{ value: String(v.styles[0][0]), label: speakerLabel(v.info.name, v.info.slug) }] : []))];
  const staffValue = staff !== null && staffOptions.some((o) => o.value === String(staff)) ? String(staff) : 'same';

  return (
    <View style={styles.section}>
      <AppText variant="caption" color="muted">
        AJUSTES DA VOZ
      </AppText>
      <AppText>Altura</AppText>
      <ChipRow wrap options={PITCH_OPTIONS.map((o) => ({ value: o.value, label: o.label }))} value={String(pitch)} onChange={(v) => setPitch(Number(v))} />
      <AppText>Entonação</AppText>
      <ChipRow wrap options={INTONATION_OPTIONS.map((o) => ({ value: o.value, label: o.label }))} value={String(intonation)} onChange={(v) => setIntonation(Number(v))} />
      <AppText>Voz do atendente nos diálogos</AppText>
      <ChipRow wrap options={staffOptions} value={staffValue} onChange={(v) => setStaff(v === 'same' ? null : Number(v))} />
      <LearnMore>
        <AppText variant="caption" color="muted">
          A altura e a entonação valem para toda a fala em voz de anime. Nos diálogos, a fala do atendente usa a voz escolhida acima e a sua, a voz em uso. A velocidade continua em “Velocidade da voz”, nos Ajustes de voz.
        </AppText>
      </LearnMore>
    </View>
  );
}

/** Toca a mesma frase com cada voz baixada, uma após a outra. */
function CompareSection({ voices, onPlaying }: { voices: readonly InstalledSpeaker[]; onPlaying: (slug: string | null) => void }) {
  const [phrase, setPhrase] = useState<(typeof COMPARE_PHRASES)[number]['value']>('a');
  const [running, setRunning] = useState(false);
  const stop = useRef(false);

  const run = async () => {
    stop.current = false;
    setRunning(true);
    try {
      const text = COMPARE_PHRASES.find((p) => p.value === phrase)?.text ?? COMPARE_PHRASES[0].text;
      await compareVoices(text, voices, () => stop.current, onPlaying);
    } finally {
      setRunning(false);
    }
  };

  return (
    <View style={styles.section}>
      <AppText variant="caption" color="muted">
        COMPARAR AS VOZES
      </AppText>
      <ChipRow wrap options={COMPARE_PHRASES.map((p) => ({ value: p.value, label: p.label }))} value={phrase} onChange={setPhrase} />
      {running ? (
        <Button label="Parar" variant="soft" onPress={() => (stop.current = true)} />
      ) : (
        <Button label={`Ouvir a frase com cada voz (${voices.length})`} variant="soft" onPress={() => void run()} disabled={voices.length < 2} />
      )}
    </View>
  );
}

/**
 * "Minhas vozes": os personagens que a pessoa já baixou, com busca e favoritos, a escolha feita ali mesmo, os ajustes da fala e a
 * comparação. Tocar em "Usar" já liga o VOICEVOX; "Voltar para a voz do Android" desliga.
 */
export function MyVoices() {
  const { colors } = useTheme();
  const installed = useVoicevoxStore((s) => s.installed);
  const engine = useSettingsStore((s) => s.voiceEngine);
  const style = useSettingsStore((s) => s.voicevoxStyle);
  const favorites = useSettingsStore((s) => s.favoriteVoices);
  const setFavorites = useSettingsStore((s) => s.setFavoriteVoices);
  const setEngine = useSettingsStore((s) => s.setVoiceEngine);
  const clearCache = useVoicevoxStore((s) => s.clearCache);
  const removeAll = useVoicevoxStore((s) => s.removeAll);
  const busy = useVoicevoxStore((s) => s.download !== null);
  const [query, setQuery] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [playingSlug, setPlayingSlug] = useState<string | null>(null);
  const voices = installedSpeakers(installed);

  if (voices.length === 0) return null;
  const using = engine === 'voicevox';
  const current = voices.find((v) => v.styles.some(([id]) => id === style)) ?? null;
  const shown = filterInstalled(voices, query, favorites, onlyFavorites);

  return (
    <View style={styles.root}>
      <AppText variant="caption" color="muted">
        MINHAS VOZES
      </AppText>
      <AppText color="muted">
        {using && current
          ? `O app fala com ${speakerLabel(current.info.name, current.info.slug)}. Toque em “Ouvir” para testar, ou em “Usar” noutro personagem para trocar.`
          : using
            ? 'O app fala com a voz de anime, mas o personagem escolhido não está baixado: escolha um abaixo.'
            : 'Hoje o app fala com a voz do Android. Escolha um personagem abaixo e toque em “Usar”.'}
      </AppText>
      {voices.length > 3 ? (
        <>
          <TextInput
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Buscar por nome ou descrição"
            placeholderTextColor={colors.muted}
            accessibilityLabel="Buscar voz"
            returnKeyType="search"
            style={[styles.input, { color: colors.ink, backgroundColor: colors.background, borderColor: colors.line }]}
          />
          <ChipRow
            wrap
            options={[
              { value: 'all', label: 'Todas' },
              { value: 'fav', label: `★ Favoritas (${favorites.filter((f) => voices.some((v) => v.info.slug === f)).length})` },
            ]}
            value={onlyFavorites ? 'fav' : 'all'}
            onChange={(v) => setOnlyFavorites(v === 'fav')}
          />
        </>
      ) : null}
      {shown.length === 0 ? (
        <AppText color="muted">{onlyFavorites && query === '' ? 'Nenhum favorito ainda. Toque na ☆ de um personagem.' : 'Nenhuma voz com esse nome.'}</AppText>
      ) : null}
      {shown.map((voice) => (
        <VoiceRow
          key={voice.info.slug}
          voice={voice}
          inUse={using && voice === current}
          favorite={favorites.includes(voice.info.slug)}
          onFavorite={() => setFavorites(toggleFavorite(favorites, voice.info.slug))}
          playing={playingSlug === voice.info.slug}
        />
      ))}
      {using ? <Button label="Voltar para a voz do Android" variant="ghost" onPress={() => setEngine('system')} /> : null}
      <TuningSection voices={voices} />
      <CompareSection voices={voices} onPlaying={setPlayingSlug} />
      <AppText variant="caption" color="muted">
        Vozes baixadas: {installed.length} {installed.length === 1 ? 'arquivo' : 'arquivos'}, {formatSize(installedBytes(installed))} no aparelho.
      </AppText>
      <Button label="Limpar áudios guardados" variant="ghost" onPress={() => void clearCache()} />
      <Button
        label="Apagar todas as vozes"
        variant="ghost"
        disabled={busy}
        onPress={() =>
          Alert.alert('Apagar todas as vozes?', `As ${installed.length} ${installed.length === 1 ? 'voz sai' : 'vozes saem'} do aparelho e liberam ${formatSize(installedBytes(installed))}. Dá para baixar de novo quando quiser.`, [
            { text: 'Manter', style: 'cancel' },
            { text: 'Apagar tudo', style: 'destructive', onPress: () => void removeAll() },
          ])
        }
      />
      <AppText variant="caption" color="muted">
        As gravações de falantes nativos (em Sons e vibração) continuam tendo prioridade nas palavras que as têm; desligue-as para ouvir só o VOICEVOX.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.md },
  section: { gap: spacing.sm },
  row: { gap: spacing.sm, borderWidth: 2, borderRadius: radii.md, padding: spacing.md },
  rowHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  rowName: { flex: 1 },
  star: { minWidth: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
  action: { flex: 1 },
  input: { borderWidth: 1.5, borderRadius: radii.md, paddingHorizontal: spacing.md, minHeight: 48, fontFamily: fonts.regular, fontSize: fontSizes.body },
});
