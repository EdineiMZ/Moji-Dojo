import { useState } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { AppText, Button, Card, SegmentedControl } from '@/components';
import { getItem } from '@/features/catalog';
import type { Point } from '@/features/strokes/svgPath';
import { DrawingPad } from '@/features/writing/DrawingPad';
import { isWritable, strokeModel } from '@/features/writing/model';
import { scoreWriting, type WritingScore } from '@/features/writing/score';
import { ScoreResult } from '@/features/writing/ScoreResult';
import { useProgressStore } from '@/store';
import { fonts, spacing } from '@/theme';

type WriteMode = 'trace' | 'free';

const MODES = [
  { value: 'trace' as const, label: 'Decalcar' },
  { value: 'free' as const, label: 'Livre' },
];
const MAX_PAD = 320;

interface WriteStepProps {
  /** Caracteres da lição; os que não têm traços (combinações) são pulados. */
  items: readonly string[];
  onContinue: () => void;
  /** Para a tela travar a rolagem enquanto o dedo desenha. */
  onDrawingChange: (drawing: boolean) => void;
}

/**
 * Passo 2 da lição: escrever cada caractere com o dedo. "Decalcar" mostra o modelo cinza com os
 * números; "Livre" esconde o modelo. Conferir compara com a ordem e a forma do modelo.
 * A nota é só um guia: não bloqueia nada.
 */
export function WriteStep({ items, onContinue, onDrawingChange }: WriteStepProps) {
  const { width } = useWindowDimensions();
  const markStudied = useProgressStore((s) => s.markStudied);
  const chars = items.filter(isWritable);

  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<WriteMode>('trace');
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const [score, setScore] = useState<WritingScore | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const char = chars[index] ?? '';
  const item = getItem(char);
  const model = strokeModel(char);
  const isLast = index === chars.length - 1;
  const size = Math.min(width - spacing.lg * 4, MAX_PAD);

  const reset = () => {
    setStrokes([]);
    setScore(null);
    setNotice(null);
  };

  const check = () => {
    if (!model) return;
    if (strokes.length === 0) {
      setNotice('Desenhe o caractere antes de conferir.');
      return;
    }
    setNotice(null);
    setScore(scoreWriting(model, strokes));
    markStudied();
  };

  const next = () => {
    if (isLast) {
      onContinue();
      return;
    }
    setIndex((i) => i + 1);
    reset();
  };

  return (
    <View style={styles.root}>
      <AppText color="muted">
        Passo 2: escreva por cima do modelo cinza, seguindo os números. Depois toque em Conferir para ver se a ordem e a
        direção dos traços estão certas. Não precisa tirar nota alta: o objetivo é pegar o movimento da mão.
      </AppText>

      <Card enterIndex={0} style={styles.card}>
        <View style={styles.prompt}>
          <AppText style={styles.promptChar}>{char}</AppText>
          <View style={styles.flex}>
            <AppText style={{ fontFamily: fonts.bold }}>{item.label}</AppText>
            <AppText variant="caption" color="muted">
              {index + 1} de {chars.length}
            </AppText>
          </View>
        </View>

        <SegmentedControl options={MODES} value={mode} onChange={setMode} />

        {/* A chave limpa o quadro ao trocar de caractere. */}
        <DrawingPad
          key={char}
          size={size}
          strokes={strokes}
          onStrokeEnd={(stroke) => {
            setStrokes((prev) => [...prev, stroke]);
            setScore(null); // desenhar de novo apaga o resultado anterior
          }}
          model={model}
          showModel={mode === 'trace' && score === null}
          verdicts={score?.strokes}
          onDrawingChange={onDrawingChange}
        />

        <View style={styles.row}>
          <Button
            label="Desfazer"
            variant="ghost"
            disabled={strokes.length === 0}
            onPress={() => {
              setStrokes((prev) => prev.slice(0, -1));
              setScore(null);
            }}
            style={styles.small}
          />
          <Button label="Limpar" variant="ghost" disabled={strokes.length === 0} onPress={reset} style={styles.small} />
          <Button label="Conferir" onPress={check} style={styles.small} />
        </View>

        {notice ? (
          <AppText color="bad" center>
            {notice}
          </AppText>
        ) : null}
        {score ? <ScoreResult score={score} /> : null}
        {score ? (
          <AppText variant="caption" color="muted">
            A nota é aproximada: compara seu desenho com o modelo, ignorando tamanho e posição. Verde é o traço certo; vermelho,
            o que não bateu.
          </AppText>
        ) : null}
      </Card>

      <Button label={isLast ? 'Ir para o teste' : 'Próximo'} onPress={next} />
      <Pressable accessibilityRole="button" onPress={onContinue} hitSlop={8}>
        <AppText variant="caption" color="primary" center style={styles.link}>
          Pular escrita e ir para o teste
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.lg },
  flex: { flex: 1 },
  card: { alignItems: 'center' },
  prompt: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, alignSelf: 'stretch' },
  promptChar: { fontFamily: fonts.bold, fontSize: 40, lineHeight: 48 },
  row: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'center' },
  small: { paddingHorizontal: spacing.lg, minHeight: 44 },
  link: { textDecorationLine: 'underline', fontFamily: fonts.bold },
});
