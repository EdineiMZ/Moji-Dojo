import { StyleSheet, View } from 'react-native';
import { AppText, Card, Mascot, ProgressBar } from '@/components';
import type { MochiOutfit } from '@/components/mascot/MochiArt';
import { useProgressStore } from '@/store';
import { spacing } from '@/theme';
import { outfit as outfitOf } from '../journey';
import { levelProgress, titleFor } from '../levels';

interface MochiHeaderProps {
  /** Itens em prévia (loja), por cima do que o aluno veste. */
  preview?: MochiOutfit | null;
  mood?: 'neutral' | 'happy';
}

/** O Mochi grande com a roupa atual (ou a prévia), o saldo de pétalas, o nível e a barra de experiência. */
export function MochiHeader({ preview, mood = 'happy' }: MochiHeaderProps) {
  const journey = useProgressStore((s) => s.journey);
  const worn: MochiOutfit = { ...outfitOf(journey, new Date()), ...(preview ?? {}) };
  const level = levelProgress(journey.xp);

  return (
    <Card enterIndex={0} style={styles.card}>
      <Mascot mood={mood} size={190} outfit={worn} />
      {preview ? (
        <AppText variant="caption" color="muted">
          Prévia: ainda não é seu
        </AppText>
      ) : null}
      <AppText variant="title">
        Nível {level.level} · {titleFor(level.level)}
      </AppText>
      <View style={styles.bar}>
        <ProgressBar value={level.span > 0 ? level.into / level.span : 0} />
        <AppText variant="caption" color="muted">
          {level.into} de {level.span} pontos para o nível {level.level + 1}
        </AppText>
      </View>
      <AppText style={styles.petals}>🌸 {journey.petals} pétalas</AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'center', gap: spacing.sm },
  bar: { alignSelf: 'stretch', gap: spacing.xs },
  petals: { fontSize: 20, lineHeight: 28 },
});
