import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card, PressableScale } from '@/components';
import { builtText, type Tile } from '@/features/vocab/variants';
import { fonts, radii, spacing, useTheme } from '@/theme';

interface BuildWordQuestionProps {
  /** O significado que a pessoa vê. */
  meaning: string;
  tiles: readonly Tile[];
  /** Depois de responder: trava as peças. */
  locked: boolean;
  /** O que foi montado; vazio quando a pessoa disse que não sabe. */
  onSubmit: (text: string) => void;
}

/**
 * Monta a palavra a partir do significado: toque nas peças na ordem certa (toque numa peça já colocada para tirá-la). Tem peças
 * a mais, de enfeite. É o degrau entre escolher entre alternativas e digitar a palavra inteira.
 */
export function BuildWordQuestion({ meaning, tiles, locked, onSubmit }: BuildWordQuestionProps) {
  const { colors } = useTheme();
  const [placed, setPlaced] = useState<number[]>([]);
  const text = builtText(tiles, placed);
  const label = (id: number): string => tiles.find((t) => t.id === id)?.text ?? '';

  return (
    <Card>
      <AppText variant="caption" color="muted" center>
        MONTE A PALAVRA
      </AppText>
      <AppText variant="headline" center>
        {meaning}
      </AppText>
      <View style={[styles.slots, { backgroundColor: colors.background, borderColor: colors.field }]} accessibilityLabel={`Montado até agora: ${text || 'nada'}`}>
        {placed.length === 0 ? (
          <AppText color="muted">Toque nas peças abaixo</AppText>
        ) : (
          placed.map((id) => (
            <PressableScale
              key={id}
              accessibilityRole="button"
              accessibilityLabel={`Tirar ${label(id)}`}
              disabled={locked}
              onPress={() => setPlaced((p) => p.filter((x) => x !== id))}
              style={[styles.tile, { backgroundColor: colors.lilacSoft, borderColor: colors.line }]}
            >
              <AppText style={styles.glyph}>{label(id)}</AppText>
            </PressableScale>
          ))
        )}
      </View>
      <View style={styles.pool}>
        {tiles.map((tile) => {
          const used = placed.includes(tile.id);
          return (
            <PressableScale
              key={tile.id}
              accessibilityRole="button"
              accessibilityLabel={tile.text}
              accessibilityState={{ disabled: used || locked }}
              disabled={used || locked}
              onPress={() => setPlaced((p) => [...p, tile.id])}
              style={[styles.tile, { backgroundColor: colors.surface, borderColor: colors.line, opacity: used ? 0.25 : 1 }]}
            >
              <AppText style={styles.glyph}>{tile.text}</AppText>
            </PressableScale>
          );
        })}
      </View>
      {locked ? null : (
        <View style={styles.actions}>
          <Button label="Conferir" disabled={placed.length === 0} onPress={() => onSubmit(text)} />
          <Button label="Não sei" variant="ghost" onPress={() => onSubmit('')} />
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  slots: { minHeight: 72, borderWidth: 1.5, borderRadius: radii.md, padding: spacing.sm, flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, alignItems: 'center' },
  pool: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, justifyContent: 'center' },
  tile: { minWidth: 52, minHeight: 52, borderWidth: 1.5, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.sm },
  glyph: { fontFamily: fonts.bold, fontSize: 26, lineHeight: 34 },
  actions: { gap: spacing.sm },
});
