import { useMemo, useState } from 'react';
import { Share, StyleSheet, TextInput, View } from 'react-native';
import { AppText, Bold, Button, Card } from '@/components';
import { useProgressStore } from '@/store';
import { fonts, fontSizes, radii, spacing, useTheme } from '@/theme';
import { learnedWordIds } from '@/features/vocab/cards';
import { exportBackup, summarizeProgress } from './backup';
import { describeCounts, hasProgress } from './describe';

/**
 * Exporta o progresso como um código de texto ("MDJ1:...") que dá para guardar em qualquer lugar. É o que
 * permite trocar de celular ou reinstalar o app sem perder nada: o código é importado de volta no card abaixo.
 */
export function ExportCard() {
  const { colors } = useTheme();
  const srs = useProgressStore((s) => s.srs);
  const lessons = useProgressStore((s) => s.lessons);
  const stats = useProgressStore((s) => s.stats);
  const days = useProgressStore((s) => s.days);
  const history = useProgressStore((s) => s.history);
  const shadow = useProgressStore((s) => s.shadow);
  const challenges = useProgressStore((s) => s.challenges);
  const vocab = useProgressStore((s) => s.vocab);
  const conj = useProgressStore((s) => s.conj);
  const mastered = useProgressStore((s) => s.mastered);

  const counts = useMemo(
    () => ({ ...summarizeProgress({ srs, lessons, stats, days }), words: learnedWordIds(vocab).size }),
    [srs, lessons, stats, days, vocab],
  );
  const [code, setCode] = useState<string | null>(null);

  const generate = () => setCode(exportBackup({ srs, lessons, stats, days, history, shadow, challenges, vocab, conj, mastered }));

  const share = () => {
    if (!code) return;
    // Fechar a folha de compartilhar sem escolher nada não é erro; qualquer falha deixa o código na tela para copiar.
    Share.share({ message: code }).catch(() => undefined);
  };

  return (
    <Card enterIndex={1}>
      <AppText variant="title">Exportar backup</AppText>

      {!hasProgress(counts) && !counts.words ? (
        <AppText color="muted">Ainda não há progresso para exportar. Estude uma lição e volte aqui.</AppText>
      ) : code === null ? (
        <>
          <AppText color="muted">
            Gere um código com todo o seu progresso e guarde em um lugar seguro (notas, e-mail, nuvem). Se trocar de
            celular ou reinstalar o app, é só importar o código de volta.
          </AppText>
          <View style={styles.lines}>
            {describeCounts(counts).map((line) => (
              <AppText key={line}>• {line}</AppText>
            ))}
          </View>
          <Button label="Gerar código de backup" onPress={generate} />
        </>
      ) : (
        <>
          <AppText>
            <Bold>Código gerado.</Bold> Compartilhe ou toque e segure no texto para copiar.
          </AppText>
          <TextInput
            readOnly
            multiline
            selectTextOnFocus
            value={code}
            accessibilityLabel="Código de backup gerado"
            style={[styles.code, { color: colors.ink, backgroundColor: colors.background, borderColor: colors.line }]}
          />
          <Button label="Compartilhar código" onPress={share} />
          <Button label="Fechar" variant="ghost" onPress={() => setCode(null)} />
          <AppText variant="caption" color="muted">
            Ele guarda o progresso de agora: gere outro depois de estudar mais. Quem tiver o código vê o seu progresso
            (e só isso), então guarde com cuidado.
          </AppText>
        </>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  lines: { gap: 2 },
  code: {
    minHeight: 96,
    maxHeight: 140,
    borderWidth: 1.5,
    borderRadius: radii.md,
    padding: spacing.md,
    fontFamily: fonts.regular,
    fontSize: fontSizes.caption,
    textAlignVertical: 'top',
  },
});
