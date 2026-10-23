import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Bold, Button, Card, Mascot } from '@/components';
import { QuizView } from '@/features/quiz/QuizView';
import type { Question } from '@/features/quiz/quiz';
import { useProgressStore } from '@/store';
import { spacing } from '@/theme';
import { buildPlacement, PLACEMENT_KANA, PLACEMENT_WORDS, placementResult, type PlacementResult } from './placement';

/**
 * Teste de nivelamento para quem já sabe parte do conteúdo: 20 kana e 15 palavras. O que for acertado de primeira pode entrar na
 * revisão já como firme, para não refazer o começo. Só aplica se a pessoa confirmar.
 */
export function PlacementView({ onExit }: { onExit: () => void }) {
  const applyPlacement = useProgressStore((s) => s.applyPlacement);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [result, setResult] = useState<PlacementResult | null>(null);
  const [applied, setApplied] = useState(false);
  const answers = useRef<{ question: Question; firstTryRight: boolean }[]>([]);

  const start = () => {
    answers.current = [];
    setApplied(false);
    setResult(null);
    setQuestions(buildPlacement());
  };

  if (questions && !result) {
    return (
      <QuizView
        questions={questions}
        title="Nivelamento"
        onAnswer={(question, correct, firstTry) => {
          if (firstTry) answers.current.push({ question, firstTryRight: correct });
        }}
        onDone={() => setResult(placementResult(answers.current))}
      />
    );
  }

  if (result) {
    const known = result.kana.length + result.words.length;
    return (
      <Card enterIndex={0}>
        <AppText variant="title">Resultado</AppText>
        <AppText>
          Kana: <Bold>{result.kana.length}</Bold> de {result.asked.kana} de primeira. Palavras: <Bold>{result.words.length}</Bold> de {result.asked.words}.
        </AppText>
        {applied ? (
          <AppText color="ok">Pronto: {known} itens entraram na sua revisão como firmes.</AppText>
        ) : known > 0 ? (
          <>
            <AppText color="muted">
              Os {known} itens que você acertou de primeira podem entrar na revisão como já aprendidos (primeira revisão em uma semana), em vez de recomeçar do zero.
              O que você errou continua como está.
            </AppText>
            <Button
              label="Aplicar ao meu progresso"
              onPress={() => {
                applyPlacement(result.kana, result.words);
                setApplied(true);
              }}
            />
          </>
        ) : (
          <AppText color="muted">Nada para aplicar: comece pela trilha, no seu ritmo.</AppText>
        )}
        <View style={styles.actions}>
          <Button label="Refazer o teste" variant="soft" onPress={start} />
          <Button label="Voltar" variant="ghost" onPress={onExit} />
        </View>
      </Card>
    );
  }

  return (
    <Card enterIndex={0}>
      <View style={styles.head}>
        <View style={styles.flex}>
          <AppText variant="title">Teste de nivelamento</AppText>
          <AppText color="muted">
            Já sabe parte do conteúdo? São {PLACEMENT_KANA} kana e {PLACEMENT_WORDS} palavras. O que você acertar de primeira pode pular direto para a revisão.
          </AppText>
        </View>
        <Mascot mood="neutral" size={72} />
      </View>
      <Button label="Começar" onPress={start} />
      <AppText variant="caption" color="muted">
        Nada muda no seu progresso até você confirmar no fim. Se errar, o item é repetido como num quiz normal, mas só o acerto de primeira conta.
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: spacing.xs },
  actions: { alignSelf: 'stretch', gap: spacing.sm },
});
