import { useMemo, useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { AppText, Bold, Button, Card, Mascot, useScrollIntoView } from '@/components';
import type { ProgressSnapshot } from '@/features/progress/types';
import type { ProgressExtras } from '@/store/progressStore';
import { useProgressStore } from '@/store';
import { fonts, fontSizes, radii, spacing, useTheme } from '@/theme';
import { BACKUP_ERROR_MESSAGES, parseBackup, summarizeProgress, type BackupSummary } from './backup';
import { describeCounts, hasProgress, ignoredNote } from './describe';

type Stage =
  | { kind: 'input' }
  | { kind: 'confirm'; snapshot: ProgressSnapshot; summary: BackupSummary; source: 'prototype' | 'app'; extras?: ProgressExtras }
  | { kind: 'done'; summary: BackupSummary };

const Lines = ({ lines }: { lines: readonly string[] }) => (
  <View style={styles.lines}>
    {lines.map((line) => (
      <AppText key={line}>• {line}</AppText>
    ))}
  </View>
);

/**
 * Importa um código de backup: "MDJ1:..." (exportado por este app) ou "NDJ1:..." (do protótipo HTML).
 * O código é validado e resumido, e o progresso só é substituído depois de o usuário confirmar.
 */
export function BackupCard() {
  const { colors } = useTheme();
  const replaceProgress = useProgressStore((s) => s.replaceProgress);
  const srs = useProgressStore((s) => s.srs);
  const lessons = useProgressStore((s) => s.lessons);
  const stats = useProgressStore((s) => s.stats);
  const days = useProgressStore((s) => s.days);
  const current = useMemo(() => summarizeProgress({ srs, lessons, stats, days }), [srs, lessons, stats, days]);

  const scrollIntoView = useScrollIntoView();
  const inputRef = useRef<TextInput>(null);
  const [stage, setStage] = useState<Stage>({ kind: 'input' });
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const verify = () => {
    const result = parseBackup(text);
    if (!result.ok) {
      setError(BACKUP_ERROR_MESSAGES[result.error]);
      return;
    }
    setError(null);
    setStage({ kind: 'confirm', snapshot: result.snapshot, summary: result.summary, source: result.source, extras: result.extras });
  };

  const confirm = (snapshot: ProgressSnapshot, summary: BackupSummary, extras?: ProgressExtras) => {
    replaceProgress(snapshot, extras);
    setText('');
    setStage({ kind: 'done', summary });
  };

  return (
    <Card enterIndex={1}>
      <AppText variant="title">Importar backup</AppText>

      {stage.kind === 'input' ? (
        <>
          <AppText color="muted">
            Cole aqui um código de backup. Ele começa com MDJ1: (gerado pelo “Exportar backup” deste app) ou com NDJ1:
            (do protótipo web: toque em “Copiar código de backup”, na aba Aprender, no fim da página).
          </AppText>
          <TextInput
            ref={inputRef}
            onFocus={() => scrollIntoView(inputRef.current)}
            value={text}
            onChangeText={(t) => {
              setText(t);
              setError(null);
            }}
            multiline
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            placeholder="MDJ1:... ou NDJ1:..."
            placeholderTextColor={colors.muted}
            accessibilityLabel="Código de backup"
            style={[
              styles.input,
              { color: colors.ink, backgroundColor: colors.background, borderColor: error ? colors.bad : colors.line },
            ]}
          />
          {error ? (
            <View style={[styles.error, { backgroundColor: colors.badSoft }]}>
              <AppText color="bad">{error}</AppText>
            </View>
          ) : null}
          <Button label="Verificar código" onPress={verify} disabled={text.trim().length === 0} />
        </>
      ) : null}

      {stage.kind === 'confirm' ? (
        <>
          <AppText>
            <Bold>Código válido.</Bold> Ele tem:
          </AppText>
          <Lines lines={describeCounts(stage.summary)} />
          {stage.summary.ignored > 0 ? (
            <AppText variant="caption" color="muted">
              {ignoredNote(stage.summary.ignored)}
            </AppText>
          ) : null}
          {hasProgress(current) ? (
            <View style={[styles.warning, { backgroundColor: colors.primarySoft }]}>
              <AppText>
                <Bold>Isso substitui o progresso deste aparelho</Bold>, que hoje tem:
              </AppText>
              <Lines lines={describeCounts(current)} />
            </View>
          ) : null}
          {stage.source === 'prototype' ? (
            <AppText variant="caption" color="muted">
              A melhor sequência de acertos e as notas de desenho do protótipo não são importadas.
            </AppText>
          ) : null}
          <View style={styles.actions}>
            <Button label="Substituir meu progresso" onPress={() => confirm(stage.snapshot, stage.summary, stage.extras)} />
            <Button label="Cancelar" variant="ghost" onPress={() => setStage({ kind: 'input' })} />
          </View>
        </>
      ) : null}

      {stage.kind === 'done' ? (
        <View style={styles.done}>
          <Mascot mood="cheer" size={110} />
          <AppText variant="title" center>
            Progresso importado!
          </AppText>
          <Lines lines={describeCounts(stage.summary)} />
          <AppText center color="muted">
            Veja as revisões vencidas na aba Início.
          </AppText>
          <Button label="Ok" variant="soft" onPress={() => setStage({ kind: 'input' })} />
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 96,
    maxHeight: 160,
    borderWidth: 1.5,
    borderRadius: radii.md,
    padding: spacing.md,
    fontFamily: fonts.regular,
    fontSize: fontSizes.caption + 1,
    textAlignVertical: 'top',
  },
  error: { borderRadius: radii.md, padding: spacing.md },
  warning: { borderRadius: radii.md, padding: spacing.md, gap: spacing.xs },
  lines: { gap: 2 },
  actions: { gap: spacing.sm },
  done: { alignItems: 'center', gap: spacing.sm },
});
