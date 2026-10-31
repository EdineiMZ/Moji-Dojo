import { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { AppText, Button, Card } from '@/components';
import { fonts, spacing, useTheme } from '@/theme';
import { ActivityBars } from './ActivityBars';
import { EvolutionChart } from './EvolutionChart';
import type { DailyAnswers, Evolution } from './metrics';

const shortDate = (day: string): string => `${day.slice(8, 10)}/${day.slice(5, 7)}`;
const TABLE_DAYS = 7;

interface EvolutionCardProps {
  evolution: Evolution;
  answers: readonly DailyAnswers[];
}

/** Evolução do estudo: caracteres aprendidos e respostas por dia, com os valores também em lista. */
export function EvolutionCard({ evolution, answers }: EvolutionCardProps) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const [asTable, setAsTable] = useState(false);
  // Tela menos as margens da tela e do cartão.
  const chartWidth = Math.floor(width - spacing.lg * 4);

  const totalAnswers = answers.reduce((sum, d) => sum + d.answers, 0);
  const recent = evolution.points.slice(-TABLE_DAYS);
  const recentAnswers = answers.slice(-TABLE_DAYS);

  // Sem nenhum dado ainda: uma linha só, em vez de dois gráficos vazios com explicação.
  if (!evolution.hasData && totalAnswers === 0) {
    return (
      <Card enterIndex={2}>
        <AppText variant="title">Sua evolução</AppText>
        <AppText color="muted">Os gráficos aparecem depois da primeira lição ou revisão.</AppText>
      </Card>
    );
  }

  return (
    <Card enterIndex={2}>
      <AppText variant="title">Sua evolução</AppText>

      <View style={styles.section}>
        <AppText>Caracteres aprendidos</AppText>
        {evolution.hasData ? (
          <>
            <EvolutionChart points={evolution.points} width={chartWidth} />
            {evolution.startedOn ? (
              <AppText variant="caption" color="muted">
                Registro desde {shortDate(evolution.startedOn)}. Antes disso, a linha mostra o que você já tinha.
              </AppText>
            ) : null}
          </>
        ) : (
          <AppText color="muted">
            A evolução aparece conforme você estuda: a partir de agora o app registra o que você aprende a cada dia.
          </AppText>
        )}
      </View>

      <View style={styles.section}>
        <AppText>Respostas por dia</AppText>
        {totalAnswers > 0 ? (
          <ActivityBars data={answers} width={chartWidth} />
        ) : (
          <AppText color="muted">Responda perguntas nas lições e revisões para ver os dias aqui.</AppText>
        )}
      </View>

      {evolution.hasData || totalAnswers > 0 ? (
        <Button
          label={asTable ? 'Ocultar valores' : 'Ver valores em lista'}
          variant="ghost"
          onPress={() => setAsTable((v) => !v)}
        />
      ) : null}

      {asTable ? (
        <View style={[styles.table, { borderColor: colors.line }]}>
          <View style={[styles.row, { backgroundColor: colors.lilacSoft }]}>
            <AppText variant="caption" color="muted" style={styles.cellDay}>
              Dia
            </AppText>
            <AppText variant="caption" color="muted" style={styles.cell}>
              Respostas
            </AppText>
            <AppText variant="caption" color="muted" style={styles.cell}>
              Aprendidos
            </AppText>
          </View>
          {recent.map((point, i) => (
            <View key={point.day} style={[styles.row, { borderTopColor: colors.line, borderTopWidth: 1 }]}>
              <AppText variant="caption" style={styles.cellDay}>
                {shortDate(point.day)}
              </AppText>
              <AppText variant="caption" style={styles.cell}>
                {recentAnswers[i]?.answers ?? 0}
              </AppText>
              <AppText variant="caption" style={styles.cell}>
                {point.learned}
              </AppText>
            </View>
          ))}
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.xs },
  table: { borderWidth: 1, borderRadius: 12, overflow: 'hidden' },
  row: { flexDirection: 'row', paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  cellDay: { flex: 1, fontFamily: fonts.bold },
  cell: { flex: 1, textAlign: 'right' },
});
