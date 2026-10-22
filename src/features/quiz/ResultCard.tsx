import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Card, Mascot, type MascotMood } from '@/components';
import { getItem } from '@/features/catalog';
import { fonts, spacing } from '@/theme';

interface ResultCardProps {
  /** Linha pequena acima do título (nome da lição, "Revisão do dia"...). */
  label: string;
  heading: string;
  /** Acertos na primeira tentativa, de 0 a 100. */
  pct: number;
  firstTry: number;
  total: number;
  /** Caracteres que foram errados. */
  wrong: readonly string[];
  /** Verde quando "passou"; senão amarelo (60% ou mais) ou vermelho. */
  passed: boolean;
  mood: MascotMood;
  /** Frase antes da lista de erros. */
  wrongLabel?: string;
  children?: ReactNode;
}

/** Resultado de um quiz: nota, o que errou e o Mochi reagindo. Os botões vêm como `children`. */
export function ResultCard({
  label,
  heading,
  pct,
  firstTry,
  total,
  wrong,
  passed,
  mood,
  wrongLabel = 'Você errou:',
  children,
}: ResultCardProps) {
  const color = passed ? 'ok' : pct >= 60 ? 'warn' : 'bad';
  return (
    <Card enterIndex={0} style={styles.card}>
      <Mascot mood={mood} size={140} />
      <AppText variant="caption" color="muted">
        {label.toUpperCase()}
      </AppText>
      <AppText variant="headline" center>
        {heading}
      </AppText>
      <View style={styles.score}>
        <AppText style={styles.pct} color={color}>
          {pct}%
        </AppText>
        <AppText color="muted" center>
          de acerto na primeira tentativa ({firstTry} de {total})
        </AppText>
      </View>
      {wrong.length ? (
        <AppText color="muted" center>
          {wrongLabel} {wrong.map((c) => `${c} ${getItem(c).label}`).join(' · ')}
        </AppText>
      ) : null}
      {children}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'center' },
  score: { alignItems: 'center', gap: spacing.xs },
  pct: { fontFamily: fonts.bold, fontSize: 56, lineHeight: 64 },
});
