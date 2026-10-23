import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { AppText, Button } from '@/components';
import { speakJapanese } from '@/features/speech/voiceStore';
import { useSettingsStore } from '@/store';
import { SPEECH_RATES } from '@/store/settingsStore';
import { radii, spacing, useTheme } from '@/theme';
import { MAX_LEVELS, waveformBars } from './waveform';

const BARS = 40;
const MAX_SECONDS = 15;

interface ShadowRecorderProps {
  /** O que a voz do modelo fala. */
  say: string;
}

/**
 * Grava a voz da pessoa e deixa ouvir ao lado do modelo (a voz do sistema), com a onda do que foi gravado. A onda
 * mostra ritmo e pausas, não pronúncia: o app não avalia o som. A gravação fica só no aparelho e some ao trocar de
 * frase ou gravar de novo.
 */
export function ShadowRecorder({ say }: ShadowRecorderProps) {
  const { colors } = useTheme();
  const speed = useSettingsStore((s) => s.speechSpeed);
  const recorder = useAudioRecorder({ ...RecordingPresets.HIGH_QUALITY, isMeteringEnabled: true });
  const state = useAudioRecorderState(recorder, 100);
  const [levels, setLevels] = useState<number[]>([]);
  const [uri, setUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const player = useAudioPlayer(uri);

  const recording = state.isRecording;
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  };
  useEffect(() => stopTimer, []);

  /** Fecha a gravação (pelo botão ou quando o limite de tempo a encerra sozinho). */
  const finish = async () => {
    stopTimer();
    try {
      if (recorder.getStatus().isRecording) await recorder.stop();
      await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
      setUri(recorder.uri);
    } catch {
      setError('Não foi possível parar a gravação.');
    }
  };

  const start = async () => {
    setError(null);
    try {
      const { granted } = await AudioModule.requestRecordingPermissionsAsync();
      if (!granted) {
        setError('Sem permissão do microfone. Libere nas configurações do aparelho para gravar.');
        return;
      }
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      setLevels([]);
      setUri(null);
      await recorder.prepareToRecordAsync();
      recorder.record({ forDuration: MAX_SECONDS });
      // A cada 100 ms guarda o nível do microfone; quando a gravação para sozinha (limite de tempo), fecha.
      timer.current = setInterval(() => {
        const status = recorder.getStatus();
        if (typeof status.metering === 'number') {
          const level = status.metering;
          setLevels((l) => [...l, level].slice(-MAX_LEVELS));
        }
        if (!status.isRecording) void finish();
      }, 100);
    } catch {
      setError('Não foi possível gravar agora.');
    }
  };

  const playMine = () => {
    if (!uri) return;
    player.seekTo(0).then(() => player.play());
  };

  const bars = waveformBars(levels, BARS);
  const seconds = Math.round(state.durationMillis / 100) / 10;

  return (
    <View style={styles.root}>
      <View style={[styles.wave, { backgroundColor: colors.background, borderColor: colors.line }]} accessibilityLabel="Onda da sua gravação">
        {bars.length === 0 ? (
          <AppText color="muted">{recording ? 'Gravando...' : 'Grave a sua voz para ver a onda'}</AppText>
        ) : (
          bars.map((h, i) => (
            <View
              key={i}
              style={[styles.bar, { height: 4 + h * 44, backgroundColor: recording ? colors.bad : colors.primary }]}
            />
          ))
        )}
      </View>
      {recording ? (
        <AppText variant="caption" color="muted">
          {seconds} s (para sozinho em {MAX_SECONDS} s)
        </AppText>
      ) : null}
      {recording ? (
        <Button label="⏹ Parar" onPress={() => void finish()} />
      ) : (
        <Button label={uri ? '🎙 Gravar de novo' : '🎙 Gravar'} variant="soft" onPress={() => void start()} />
      )}
      <View style={styles.row}>
        <Button label="🔊 Modelo" variant="soft" style={styles.flex} onPress={() => speakJapanese(say, SPEECH_RATES[speed])} />
        <Button label="▶ Minha voz" variant="soft" style={styles.flex} disabled={!uri || recording} onPress={playMine} />
      </View>
      {error ? (
        <AppText color="bad" accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : null}
      {uri && !recording ? (
        <AppText variant="caption" color="muted">
          Ouça o modelo e depois a sua voz. Compare o ritmo, as pausas e as sílabas longas. A onda não mede pronúncia.
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.sm },
  wave: {
    minHeight: 64,
    borderWidth: 1.5,
    borderRadius: radii.md,
    paddingHorizontal: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  bar: { flex: 1, borderRadius: 2, maxWidth: 8 },
  row: { flexDirection: 'row', gap: spacing.sm },
  flex: { flex: 1 },
});
