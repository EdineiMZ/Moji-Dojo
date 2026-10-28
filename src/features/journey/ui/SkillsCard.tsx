import { View } from 'react-native';
import { AppText, Card, ProgressBar } from '@/components';
import { examAverage } from '@/features/ai/examStats';
import { averageCpm } from '@/features/keyboard/typingStats';
import { useAiStore, useProgressStore } from '@/store';
import { spacing } from '@/theme';
import { MIN_RETENTION_ANSWERS, retention, skillStats, writingStat } from '../skills';

/** Acertos por habilidade e a retenção real (acertos em cartões que só voltam depois de 2 semanas ou mais). */
export function SkillsCard() {
  const counters = useProgressStore((s) => s.journey.counters);
  const typing = useProgressStore((s) => s.typing);
  const exams = useAiStore((s) => s.exams);
  const stats = skillStats(counters);
  const cpm = averageCpm(typing);
  const mock = examAverage(exams);
  const kept = retention(counters);
  const drawing = writingStat(counters);
  return (
    <Card>
      <AppText variant="title">Por habilidade</AppText>
      <AppText color="muted">Porcentagem de acertos em cada tipo de exercício, desde que esta contagem começou (versão 1.10).</AppText>
      <View style={{ gap: spacing.sm }}>
        {stats.map((s) => (
          <View key={s.skill} style={{ gap: spacing.xs }}>
            <AppText>
              {s.label}: {s.pct === null ? 'ainda sem respostas' : `${s.pct}% de ${s.total} respostas`}
            </AppText>
            <ProgressBar value={(s.pct ?? 0) / 100} />
          </View>
        ))}
      </View>
      {drawing.total > 0 ? (
        <AppText color="muted">
          Escrita à parte: {drawing.pct}% dos {drawing.total} símbolos que você desenhou (já contam em Kana e kanji).
        </AppText>
      ) : null}
      <AppText variant="title">Retenção</AppText>
      <AppText color="muted">
        {kept.pct === null
          ? `Mede quanto você ainda lembra do que estudou há semanas. Aparece depois de ${MIN_RETENTION_ANSWERS} respostas em cartões antigos (${kept.answers} até agora).`
          : `Você acertou ${kept.pct}% dos cartões que voltaram depois de 2 semanas ou mais (${kept.answers} respostas).`}
      </AppText>
      {cpm > 0 ? (
        <>
          <AppText variant="title">Digitação</AppText>
          <AppText color="muted">
            Média de {cpm} letras por minuto no simulador de teclado (recorde: {typing.best}).
          </AppText>
        </>
      ) : null}
      {mock ? (
        <>
          <AppText variant="title">Simulados</AppText>
          <AppText color="muted">
            {mock.attempts} tentativa{mock.attempts === 1 ? '' : 's'} nos simulados com IA, com média de {mock.pct}% de acertos (melhor: {mock.bestPct}%).
          </AppText>
        </>
      ) : null}
    </Card>
  );
}
