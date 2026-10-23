import { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { AppText, Bold, Button, Card } from '@/components';
import { pronunciationText, type StudyItem } from '@/features/catalog';
import { formatReadings } from '@/features/lessons/knowText';
import { speakJapanese } from '@/features/speech/voiceStore';
import type { Point } from '@/features/strokes/svgPath';
import { DrawingPad } from '@/features/writing/DrawingPad';
import { strokeModel } from '@/features/writing/model';
import { useProgressStore } from '@/store';
import { scoreWriting, writePassScore, type WritingScore } from '@/features/writing/score';
import { ScoreResult } from '@/features/writing/ScoreResult';
import { spacing } from '@/theme';

const MAX_PAD = 300;

interface WriteQuestionProps {
  item: StudyItem;
  /** Resultado da conferência; null enquanto o usuário ainda desenha. */
  score: WritingScore | null;
  onCheck: (score: WritingScore) => void;
  onDrawingChange?: (drawing: boolean) => void;
}

/**
 * Pergunta do modo "write": mostra o significado e o som (nunca o símbolo) e o usuário desenha.
 * Depois de conferir, o modelo aparece colorido por cima, com o resultado de cada traço.
 */
export function WriteQuestion({ item, score, onCheck, onDrawingChange }: WriteQuestionProps) {
  const { width } = useWindowDimensions();
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const model = strokeModel(item.char);
  const need = writePassScore(useProgressStore((s) => s.srs[item.char]?.b));
  const locked = score !== null;
  const size = Math.min(width - spacing.lg * 4, MAX_PAD);

  const check = () => {
    if (!model || locked) return;
    if (strokes.length === 0) {
      setNotice('Desenhe o caractere antes de conferir.');
      return;
    }
    setNotice(null);
    onCheck(scoreWriting(model, strokes));
  };

  return (
    <View style={styles.root}>
      <Card style={styles.prompt}>
        <AppText variant="caption" color="muted">
          DESENHE O SÍMBOLO
        </AppText>
        <AppText variant="headline" center>
          {item.label}
        </AppText>
        {item.script === 'kanji' ? (
          <AppText center color="muted">
            on <Bold>{formatReadings(item.on)}</Bold> · kun <Bold>{formatReadings(item.kun)}</Bold>
          </AppText>
        ) : null}
        {model ? (
          <AppText variant="caption" color="muted">
            {model.p.length} {model.p.length === 1 ? 'traço' : 'traços'}
          </AppText>
        ) : null}
        <Button label="🔊 Ouvir" variant="soft" onPress={() => speakJapanese(pronunciationText(item))} style={styles.small} />
      </Card>

      <View style={styles.padWrap}>
        <DrawingPad
          size={size}
          strokes={strokes}
          onStrokeEnd={(stroke) => setStrokes((prev) => [...prev, stroke])}
          model={model}
          verdicts={score?.strokes}
          disabled={locked}
          onDrawingChange={onDrawingChange}
        />
      </View>

      {!locked ? (
        <>
          <View style={styles.row}>
            <Button
              label="Desfazer"
              variant="ghost"
              disabled={strokes.length === 0}
              onPress={() => setStrokes((prev) => prev.slice(0, -1))}
              style={styles.small}
            />
            <Button label="Limpar" variant="ghost" disabled={strokes.length === 0} onPress={() => setStrokes([])} style={styles.small} />
            <Button label="Conferir" onPress={check} style={styles.small} />
          </View>
          {notice ? (
            <AppText color="bad" center>
              {notice}
            </AppText>
          ) : (
            <AppText variant="caption" color="muted" center>
              Para acertar: {need}% de semelhança ou mais (sobe conforme você pratica este caractere). Tamanho e posição não importam.
            </AppText>
          )}
        </>
      ) : (
        <ScoreResult score={score} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.md },
  prompt: { alignItems: 'center', gap: spacing.xs },
  padWrap: { alignItems: 'center' },
  row: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'center' },
  small: { paddingHorizontal: spacing.lg, minHeight: 44 },
});
