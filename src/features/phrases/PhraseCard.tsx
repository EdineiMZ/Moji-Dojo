import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card } from '@/components';
import type { TravelPhrase } from '@/data/types';
import { speakJapanese } from '@/features/speech/voiceStore';
import { useSettingsStore } from '@/store';
import type { ShadowRating } from '@/store/progressStore';
import { SPEECH_RATES } from '@/store/settingsStore';
import { fonts, radii, spacing, useTheme } from '@/theme';

/** Velocidade do botão "Devagar" (mais lenta que a velocidade lenta das preferências). */
const SLOW_RATE = 0.6;

const RATINGS: readonly { value: ShadowRating; label: string }[] = [
  { value: 'ok', label: 'Igual' },
  { value: 'mid', label: 'Quase' },
  { value: 'bad', label: 'Diferente' },
];

interface PhraseCardProps {
  phrase: TravelPhrase;
  /** Mostra "Palavra por palavra" (aba Viagem). */
  breakdown?: boolean;
  /** Mostra a autoavaliação "Como saiu?" (aba Repetir). */
  rating?: { value: ShadowRating | undefined; onChange: (rating: ShadowRating) => void };
  enterIndex?: number;
}

/** Frase pronta: japonês, romaji, tradução, som (normal e devagar), divisão e autoavaliação. */
export function PhraseCard({ phrase, breakdown = false, rating, enterIndex }: PhraseCardProps) {
  const { colors } = useTheme();
  const speed = useSettingsStore((s) => s.speechSpeed);
  const [open, setOpen] = useState(false);

  return (
    <Card {...(enterIndex === undefined ? {} : { enterIndex })}>
      <AppText style={styles.jp}>{phrase.jp}</AppText>
      <AppText color="muted">{phrase.romaji}</AppText>
      <AppText>{phrase.pt}</AppText>

      <View style={styles.row}>
        <Button label="🔊 Ouvir" onPress={() => speakJapanese(phrase.jp, SPEECH_RATES[speed])} style={styles.small} />
        <Button label="Devagar" variant="ghost" onPress={() => speakJapanese(phrase.jp, SLOW_RATE)} style={styles.small} />
      </View>

      {rating ? (
        <View style={styles.rating}>
          <AppText variant="caption" color="muted">
            Como saiu?
          </AppText>
          <View style={styles.row}>
            {RATINGS.map((r) => {
              const selected = rating.value === r.value;
              return (
                <Button
                  key={r.value}
                  label={r.label}
                  variant={selected ? 'primary' : 'soft'}
                  onPress={() => rating.onChange(r.value)}
                  style={styles.small}
                />
              );
            })}
          </View>
        </View>
      ) : null}

      {breakdown ? (
        <View style={styles.breakdown}>
          <Button label={open ? 'Ocultar palavra por palavra' : 'Palavra por palavra'} variant="ghost" onPress={() => setOpen((o) => !o)} />
          {open ? (
            <View style={[styles.table, { borderColor: colors.line }]}>
              {phrase.breakdown.map((part, i) => (
                <View key={i} style={[styles.partRow, i > 0 && { borderTopColor: colors.line, borderTopWidth: 1 }]}>
                  <AppText style={styles.part}>{part.part}</AppText>
                  <AppText variant="caption" color="muted" style={styles.meaning}>
                    {part.meaning}
                  </AppText>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  jp: { fontFamily: fonts.bold, fontSize: 22, lineHeight: 30 },
  row: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  small: { minHeight: 42, paddingHorizontal: spacing.lg },
  rating: { gap: spacing.xs },
  breakdown: { gap: spacing.sm },
  table: { borderWidth: 1, borderRadius: radii.md, overflow: 'hidden' },
  partRow: { flexDirection: 'row', gap: spacing.md, padding: spacing.sm },
  part: { flex: 1, fontFamily: fonts.bold },
  meaning: { flex: 2 },
});
