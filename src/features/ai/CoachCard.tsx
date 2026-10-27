import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Bold, Button, Card } from '@/components';
import { useAiStore, useProgressStore } from '@/store';
import { useNow } from '@/hooks/useNow';
import { radii, spacing, useTheme } from '@/theme';
import { AiDisclaimer } from './AiParts';
import { AiError } from './client';
import { buildCoachStats, getCoachPlan, hasCoachData } from './coach';

const dayLabel = (key: string): string => {
  const [y, m, d] = key.split('-');
  return `${d}/${m}/${y}`;
};

/** Coach da semana: mostra os seus números (calculados no aparelho) e, se você pedir, a IA monta o plano da próxima semana. */
export function CoachCard() {
  const { colors } = useTheme();
  const now = useNow();
  const history = useProgressStore((s) => s.history);
  const days = useProgressStore((s) => s.days);
  const journey = useProgressStore((s) => s.journey);
  const srs = useProgressStore((s) => s.srs);
  const vocab = useProgressStore((s) => s.vocab);
  const conj = useProgressStore((s) => s.conj);
  const particles = useProgressStore((s) => s.particles);
  const stored = useAiStore((s) => s.coach);
  const setCoach = useAiStore((s) => s.setCoach);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const stats = buildCoachStats(
    { history, days, counters: journey.counters, restWeekdays: journey.restWeekdays, srs, vocab, conj, particles },
    new Date(now),
  );
  const plan = stored?.plan ?? null;
  const fresh = stored?.weekKey === stats.weekKey;

  const ask = async () => {
    setBusy(true);
    setError('');
    try {
      setCoach({ weekKey: stats.weekKey, at: now, plan: await getCoachPlan(stats) });
    } catch (e) {
      setError(e instanceof AiError ? e.message : 'Não consegui falar com a IA agora.');
    } finally {
      setBusy(false);
    }
  };

  const { thisWeek, lastWeek } = stats;
  const trend = thisWeek.answers === lastWeek.answers ? 'igual à semana passada' : thisWeek.answers > lastWeek.answers ? `mais que as ${lastWeek.answers} da semana passada` : `menos que as ${lastWeek.answers} da semana passada`;

  return (
    <Card enterIndex={0}>
      <AppText variant="title">Coach da semana</AppText>
      <AppText color="muted">
        O app resume os seus números e a IA sugere o foco da semana. Só estatísticas agregadas saem do aparelho (contagens e porcentagens): nenhuma frase sua, palavra ou nota é enviada.
      </AppText>

      <View style={[styles.box, { backgroundColor: colors.lilacSoft }]}>
        <AppText>
          <Bold>Esta semana:</Bold> {thisWeek.studiedDays} de {thisWeek.elapsedDays} dias estudados, {thisWeek.answers} respostas ({trend}), {thisWeek.accuracy}% de acertos.
        </AppText>
        <AppText>
          <Bold>Sequência:</Bold> {stats.streak} dia{stats.streak === 1 ? '' : 's'}. <Bold>Palavras aprendidas:</Bold> {stats.wordsLearned}.
        </AppText>
        <AppText>
          <Bold>Retenção:</Bold> {stats.retention === null ? 'ainda sem dados suficientes' : `${stats.retention}% nos cartões antigos`}.
        </AppText>
        <AppText>
          <Bold>Itens teimosos:</Bold> {stats.leeches.kana + stats.leeches.vocab + stats.leeches.conj + stats.leeches.particle}.
        </AppText>
      </View>

      {hasCoachData(stats) ? (
        <Button label={busy ? 'Montando o plano...' : plan && fresh ? '✨ Refazer o plano' : '✨ Pedir o plano da semana'} onPress={ask} disabled={busy} />
      ) : (
        <AppText color="muted">Estude um pouco para o coach ter o que analisar.</AppText>
      )}
      {error ? (
        <AppText color="bad" accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : null}

      {plan ? (
        <View style={[styles.box, { backgroundColor: colors.skySoft }]} accessibilityLiveRegion="polite">
          <AppText variant="caption" color="muted">
            PLANO DA SEMANA DE {dayLabel(stored?.weekKey ?? stats.weekKey)}
            {fresh ? '' : ' (semana passada: peça um novo)'}
          </AppText>
          <AppText>{plan.summary}</AppText>
          <AppText>
            <Bold>Foco:</Bold> {plan.focus}
          </AppText>
          {plan.steps.map((step, i) => (
            <AppText key={i}>
              {i + 1}. {step}
            </AppText>
          ))}
          {plan.praise ? <AppText color="ok">{plan.praise}</AppText> : null}
          <AiDisclaimer />
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  box: { borderRadius: radii.md, padding: spacing.md, gap: spacing.sm },
});
