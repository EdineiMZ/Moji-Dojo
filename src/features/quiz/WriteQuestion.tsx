import { useEffect, useRef, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { AppText, Bold, Button, Card, StrokeAnimation, useMotionEnabled } from '@/components';
import { pronunciationText, type StudyItem } from '@/features/catalog';
import { formatReadings } from '@/features/lessons/knowText';
import { speakJapanese } from '@/features/speech/voiceStore';
import type { Point } from '@/features/strokes/svgPath';
import { assistFor, HINT_REVEAL_MS, hintModel, hintStroke, type WriteAction } from '@/features/writing/assist';
import { DrawingPad } from '@/features/writing/DrawingPad';
import { DrawingPreview } from '@/features/writing/DrawingPreview';
import { strokeModel } from '@/features/writing/model';
import { useProgressStore } from '@/store';
import { scoreWriting, writePassScore, type WritingScore } from '@/features/writing/score';
import { ScoreResult } from '@/features/writing/ScoreResult';
import { spacing, useTheme } from '@/theme';

const MAX_PAD = 300;
/** O quadro tem 1,5px de borda; a animação da dica é posta por cima do conteúdo, alinhada ao desenho. */
const PAD_BORDER = 1.5;
/** Transparência do caractere de fundo no traçado guiado. */
const GUIDE_OPACITY = 0.45;

/** Como a pergunta terminou (null enquanto o usuário ainda desenha). */
export type WriteResult = { kind: 'scored'; score: WritingScore; correct: boolean } | { kind: 'gaveUp' };

interface WriteQuestionProps {
  item: StudyItem;
  result: WriteResult | null;
  onAction: (action: WriteAction) => void;
  onDrawingChange?: (drawing: boolean) => void;
}

type HintState = 'off' | 'playing' | 'on';
type GuidePhase = 'watch' | 'trace';

/**
 * Pergunta do modo "write": mostra o significado e o som (nunca o símbolo) e o usuário desenha.
 * Ajudas: "Dica" (revela só o primeiro traço) e "Não lembro" (conta como erro, mostra a ordem dos traços
 * e pede um traçado guiado que não vale nota). Depois de qualquer erro, o desenho aparece ao lado do certo.
 */
export function WriteQuestion({ item, result, onAction, onDrawingChange }: WriteQuestionProps) {
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const motion = useMotionEnabled();
  const model = strokeModel(item.char);
  const box = useProgressStore((s) => s.srs[item.char]?.b);
  const assist = assistFor(box);
  /** Caixa 2: o primeiro traço já vem no desenho (como a dica, mas sem custo). */
  const [strokes, setStrokes] = useState<Point[][]>(() => {
    const first = assist === 'first' && model ? hintStroke(model) : null;
    return first ? [first] : [];
  });
  const [notice, setNotice] = useState<string | null>(null);
  const [hint, setHint] = useState<HintState>('off');
  const [phase, setPhase] = useState<GuidePhase>('watch');
  const [replay, setReplay] = useState(0);
  const [traced, setTraced] = useState<Point[][]>([]);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const need = writePassScore(box);
  const locked = result !== null;
  const size = Math.min(width - spacing.lg * 4, MAX_PAD);
  const half = Math.floor((size - spacing.md) / 2);
  /** O traço da dica faz parte do desenho: Desfazer/Limpar não o tiram. */
  const base = hint === 'on' || (assist === 'first' && strokes.length > 0 && model !== undefined) ? 1 : 0;

  useEffect(
    () => () => {
      if (hintTimer.current) clearTimeout(hintTimer.current);
    },
    [],
  );

  const check = () => {
    if (!model || locked || hint === 'playing') return;
    if (strokes.length === 0) {
      setNotice('Desenhe o caractere antes de conferir.');
      return;
    }
    setNotice(null);
    onAction({ kind: 'check', score: scoreWriting(model, strokes), hinted: hint !== 'off', drawing: strokes });
  };

  const useHint = () => {
    if (!model || locked || hint !== 'off' || strokes.length > 0) return;
    const first = hintStroke(model);
    if (!first) return;
    setNotice(null);
    const reveal = () => {
      setStrokes((prev) => (prev.length === 0 ? [first] : prev));
      setHint('on');
    };
    if (!motion) {
      reveal();
      return;
    }
    setHint('playing');
    hintTimer.current = setTimeout(reveal, HINT_REVEAL_MS);
  };

  const giveUp = () => {
    if (locked || hint === 'playing') return;
    if (hintTimer.current) clearTimeout(hintTimer.current);
    onAction({ kind: 'giveUp' });
  };

  const gaveUp = result?.kind === 'gaveUp';
  const failedDrawing = result?.kind === 'scored' && !result.correct;

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

      {gaveUp && model ? (
        <View style={styles.guide}>
          {phase === 'watch' ? (
            <>
              <AppText center>
                Sem problema! Veja a ordem dos {model.p.length} {model.p.length === 1 ? 'traço' : 'traços'}. Esta pergunta volta daqui a pouco.
              </AppText>
              <View style={styles.padWrap}>
                <StrokeAnimation strokes={model} size={size} replayKey={replay} />
              </View>
              <View style={styles.row}>
                <Button label="Ver de novo" variant="ghost" onPress={() => setReplay((r) => r + 1)} style={styles.small} />
                <Button label="Traçar por cima" onPress={() => setPhase('trace')} style={styles.small} />
              </View>
            </>
          ) : (
            <>
              <AppText center>Trace por cima do modelo, na ordem dos traços. Não vale nota: é só para fixar.</AppText>
              <View style={styles.padWrap}>
                <DrawingPad
                  size={size}
                  strokes={traced}
                  onStrokeEnd={(stroke) => setTraced((prev) => [...prev, stroke])}
                  model={model}
                  showModel
                  modelOpacity={GUIDE_OPACITY}
                  onDrawingChange={onDrawingChange}
                />
              </View>
              <View style={styles.row}>
                <Button
                  label="Desfazer"
                  variant="ghost"
                  disabled={traced.length === 0}
                  onPress={() => setTraced((prev) => prev.slice(0, -1))}
                  style={styles.small}
                />
                <Button label="Limpar" variant="ghost" disabled={traced.length === 0} onPress={() => setTraced([])} style={styles.small} />
                <Button label="Ver a ordem" variant="ghost" onPress={() => { setReplay((r) => r + 1); setPhase('watch'); }} style={styles.small} />
              </View>
            </>
          )}
        </View>
      ) : failedDrawing && model ? (
        <View style={styles.compare}>
          <View style={styles.compareCol}>
            <AppText variant="caption" color="muted">
              SEU DESENHO
            </AppText>
            <View style={[styles.frame, { borderColor: colors.bad, width: half, height: half }]}>
              <DrawingPreview strokes={strokes} size={half} label="Seu desenho" />
            </View>
          </View>
          <View style={styles.compareCol}>
            <AppText variant="caption" color="muted">
              O CERTO
            </AppText>
            <View style={[styles.frame, { borderColor: colors.ok, width: half, height: half }]}>
              <StrokeAnimation strokes={model} size={half} />
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.padWrap}>
          <View style={{ width: size, height: size }}>
            <DrawingPad
              size={size}
              strokes={strokes}
              onStrokeEnd={(stroke) => setStrokes((prev) => [...prev, stroke])}
              model={model}
              showModel={assist === 'trace' && !locked}
              modelOpacity={GUIDE_OPACITY}
              verdicts={result?.kind === 'scored' ? result.score.strokes : undefined}
              disabled={locked || hint === 'playing'}
              onDrawingChange={onDrawingChange}
            />
            {!locked && model && hint !== 'off' ? (
              <View pointerEvents="none" style={[styles.overlay, { left: PAD_BORDER, top: PAD_BORDER, width: size - PAD_BORDER * 2, height: size - PAD_BORDER * 2 }]}>
                <StrokeAnimation strokes={hintModel(model)} size={size} />
              </View>
            ) : null}
          </View>
        </View>
      )}

      {!locked ? (
        <>
          <View style={styles.row}>
            <Button
              label="Desfazer"
              variant="ghost"
              disabled={strokes.length <= base || hint === 'playing'}
              onPress={() => setStrokes((prev) => prev.slice(0, -1))}
              style={styles.small}
            />
            <Button
              label="Limpar"
              variant="ghost"
              disabled={strokes.length <= base || hint === 'playing'}
              onPress={() => setStrokes((prev) => prev.slice(0, base))}
              style={styles.small}
            />
            <Button label="Não lembro" variant="ghost" disabled={hint === 'playing'} onPress={giveUp} style={styles.small} />
          </View>
          <View style={styles.row}>
            {assist === 'memory' ? (
              <Button
                label="💡 Dica"
                variant="soft"
                disabled={!model || hint !== 'off' || strokes.length > 0}
                onPress={useHint}
                style={styles.small}
              />
            ) : null}
            <Button label="Conferir" disabled={hint === 'playing'} onPress={check} style={styles.small} />
          </View>
          {notice ? (
            <AppText color="bad" center>
              {notice}
            </AppText>
          ) : (
            <AppText variant="caption" color="muted" center>
              {assist === 'trace' ? 'Caractere novo: trace por cima do modelo, na ordem dos números. ' : ''}
              {assist === 'first' ? 'O primeiro traço já está feito: continue de memória. ' : ''}
              Para acertar: {need}% de semelhança ou mais (sobe conforme você pratica este caractere). Tamanho e posição não importam.
              {'\n'}
              {assist === 'memory' ? 'Dica mostra só o primeiro traço (acertar assim não sobe de caixa). ' : ''}“Não lembro” conta como erro e ensina o caractere.
            </AppText>
          )}
        </>
      ) : result?.kind === 'scored' ? (
        <ScoreResult score={result.score} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.md },
  prompt: { alignItems: 'center', gap: spacing.xs },
  padWrap: { alignItems: 'center' },
  guide: { gap: spacing.md },
  overlay: { position: 'absolute', overflow: 'hidden' },
  compare: { flexDirection: 'row', justifyContent: 'center', gap: spacing.md },
  compareCol: { alignItems: 'center', gap: spacing.xs },
  frame: { borderWidth: 2, borderRadius: 12, overflow: 'hidden' },
  row: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'center', flexWrap: 'wrap' },
  small: { paddingHorizontal: spacing.lg, minHeight: 44 },
});
