import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { AppText, Bold, Button } from '@/components';
import { fonts, fontSizes, radii, spacing, useTheme } from '@/theme';
import { AiError } from './client';
import { correctPhrase, explainWhy, type Explanation, type PhraseFix } from './tasks';
import { judgeMeaning, type MeaningJudgement } from './tasksMore';
import { useAiReady } from './useAi';

const errorText = (error: unknown): string => (error instanceof AiError ? error.message : 'Não consegui falar com a IA agora.');

/** Aviso fixo: o que a IA escreve pode ter erros, e o japonês dela não passou por revisão de um falante. */
export function AiDisclaimer() {
  return (
    <AppText variant="caption" color="muted">
      Gerado por IA. Pode errar: na dúvida, confira com um professor ou falante nativo.
    </AppText>
  );
}

interface AiCorrectionProps {
  jp: string;
  pt: string;
  /** A pessoa aceitou a frase corrigida. */
  onUse: (corrected: string) => void;
}

/** Botão "Corrigir com IA" da tela Minhas frases: mostra a correção, o porquê e deixa usar a versão corrigida. */
export function AiCorrection({ jp, pt, onUse }: AiCorrectionProps) {
  const { colors } = useTheme();
  const ready = useAiReady();
  const [busy, setBusy] = useState(false);
  const [fix, setFix] = useState<PhraseFix | null>(null);
  const [error, setError] = useState('');
  const [forText, setForText] = useState('');

  if (!ready) return null;
  const key = `${jp}|${pt}`;
  const stale = fix !== null && forText !== key;
  const canAsk = jp.trim().length > 0 && pt.trim().length > 0;

  const run = async () => {
    setBusy(true);
    setError('');
    try {
      setFix(await correctPhrase(jp, pt));
      setForText(key);
    } catch (e) {
      setFix(null);
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.root}>
      <Button label={busy ? 'Corrigindo...' : '✨ Corrigir com IA'} variant="soft" onPress={run} disabled={busy || !canAsk} />
      {!canAsk ? (
        <AppText variant="caption" color="muted">
          Escreva a frase em japonês e o que ela quer dizer para pedir a correção.
        </AppText>
      ) : null}
      {error ? (
        <AppText color="bad" accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : null}
      {fix && !stale ? (
        <View style={[styles.result, { backgroundColor: fix.ok ? colors.okSoft : colors.skySoft }]} accessibilityLiveRegion="polite">
          <AppText color={fix.ok ? 'ok' : 'ink'}>
            <Bold>{fix.ok ? 'Está certa!' : 'Sugestão:'}</Bold> {fix.corrected}
          </AppText>
          {fix.natural ? (
            <AppText>
              Mais natural: <Bold>{fix.natural}</Bold>
            </AppText>
          ) : null}
          <AppText>{fix.explanation}</AppText>
          {fix.issues.map((issue, i) => (
            <AppText key={i} variant="caption" color="muted">
              {issue.wrong && issue.right ? `${issue.wrong} → ${issue.right}: ` : ''}
              {issue.why}
            </AppText>
          ))}
          {fix.corrected !== jp.trim() ? <Button label="Usar a frase corrigida" onPress={() => onUse(fix.corrected)} /> : null}
          <AiDisclaimer />
        </View>
      ) : null}
    </View>
  );
}

interface AiExplainProps {
  /** Descreve o exercício ou o tópico (pergunta, resposta certa, o que a pessoa respondeu). */
  context: string;
  /** Mostra um campo para a pessoa fazer a própria pergunta (ex.: nos tópicos de gramática). */
  allowQuestion?: boolean;
  label?: string;
}

/** "Por quê?": pede à IA a explicação de um erro ou de um tópico. Some quando a IA não está pronta. */
export function AiExplain({ context, allowQuestion = false, label = '💡 Por quê? (IA)' }: AiExplainProps) {
  const { colors } = useTheme();
  const ready = useAiReady();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [busy, setBusy] = useState(false);
  const [answer, setAnswer] = useState<Explanation | null>(null);
  const [error, setError] = useState('');

  if (!ready) return null;

  const run = async () => {
    setBusy(true);
    setError('');
    try {
      setAnswer(await explainWhy(context, question));
    } catch (e) {
      setAnswer(null);
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  };

  if (!open) return <Button label={label} variant="ghost" onPress={() => setOpen(true)} />;

  return (
    <View style={styles.root}>
      {allowQuestion ? (
        <TextInput
          value={question}
          onChangeText={setQuestion}
          placeholder="Sua dúvida (opcional)"
          placeholderTextColor={colors.muted}
          accessibilityLabel="Sua dúvida para a IA"
          style={[styles.input, { color: colors.ink, backgroundColor: colors.background, borderColor: colors.line }]}
        />
      ) : null}
      <Button label={busy ? 'Pensando...' : answer ? 'Perguntar de novo' : allowQuestion ? 'Perguntar à IA' : 'Explicar'} variant="soft" onPress={run} disabled={busy} />
      {error ? (
        <AppText color="bad" accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : null}
      {answer ? (
        <View style={[styles.result, { backgroundColor: colors.skySoft }]} accessibilityLiveRegion="polite">
          <AppText>{answer.explanation}</AppText>
          {answer.tip ? (
            <AppText>
              <Bold>Dica:</Bold> {answer.tip}
            </AppText>
          ) : null}
          <AiDisclaimer />
        </View>
      ) : null}
    </View>
  );
}

const VERDICT_TEXT: Readonly<Record<MeaningJudgement['verdict'], string>> = { ok: 'Sentido certo!', close: 'Quase.', wrong: 'O sentido é outro.' };

interface AiMeaningCheckProps {
  jp: string;
  reference: string;
  answer: string;
}

/** Na tela "Entender (livre)": a IA diz se o português que a pessoa escreveu bate com o sentido da frase. */
export function AiMeaningCheck({ jp, reference, answer }: AiMeaningCheckProps) {
  const { colors } = useTheme();
  const ready = useAiReady();
  const [busy, setBusy] = useState(false);
  const [verdict, setVerdict] = useState<MeaningJudgement | null>(null);
  const [error, setError] = useState('');

  if (!ready) return null;

  const run = async () => {
    setBusy(true);
    setError('');
    try {
      setVerdict(await judgeMeaning(jp, reference, answer));
    } catch (e) {
      setVerdict(null);
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  };

  const tone = verdict?.verdict === 'ok' ? colors.okSoft : verdict?.verdict === 'wrong' ? colors.badSoft : colors.skySoft;
  return (
    <View style={styles.root}>
      <Button label={busy ? 'Avaliando...' : '✨ A IA avalia o que você escreveu'} variant="soft" onPress={run} disabled={busy} />
      {error ? (
        <AppText color="bad" accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : null}
      {verdict ? (
        <View style={[styles.result, { backgroundColor: tone }]} accessibilityLiveRegion="polite">
          <AppText>
            <Bold>{VERDICT_TEXT[verdict.verdict]}</Bold> {verdict.note}
          </AppText>
          <AiDisclaimer />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.sm },
  result: { borderRadius: radii.md, padding: spacing.md, gap: spacing.sm },
  input: { borderWidth: 1.5, borderRadius: radii.md, paddingHorizontal: spacing.md, minHeight: 48, fontFamily: fonts.regular, fontSize: fontSizes.body },
});
