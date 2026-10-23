import { useState } from 'react';
import { AppText, PressableScale } from '@/components';
import { useSettingsStore } from '@/store';

interface RomajiLineProps {
  text: string;
}

/** O romaji de uma frase ou palavra, conforme os Ajustes: sempre, só ao tocar (aparece depois do toque) ou nunca. */
export function RomajiLine({ text }: RomajiLineProps) {
  const mode = useSettingsStore((s) => s.romajiMode);
  const [revealed, setRevealed] = useState(false);

  if (mode === 'never' || !text) return null;
  if (mode === 'always' || revealed) {
    return mode === 'tap' ? (
      <PressableScale accessibilityRole="button" accessibilityLabel="Esconder o romaji" onPress={() => setRevealed(false)}>
        <AppText color="muted">{text}</AppText>
      </PressableScale>
    ) : (
      <AppText color="muted">{text}</AppText>
    );
  }
  return (
    <PressableScale accessibilityRole="button" accessibilityLabel="Mostrar o romaji" onPress={() => setRevealed(true)}>
      <AppText color="primary">Ver romaji</AppText>
    </PressableScale>
  );
}
