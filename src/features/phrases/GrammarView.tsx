import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { AppText, Button, Card, PressableScale, ProgressBar, ReduceMotion, RichText } from '@/components';
import { ALL_GRAMMAR } from '@/content/grammar';
import { GENERAL_PITFALLS, TOPIC_PITFALLS } from '@/content/pitfalls';
import { TopicTest } from '@/features/grammar-test/TopicTest';
import { useProgressStore } from '@/store';
import { fonts, radii, spacing, useTheme } from '@/theme';
import { exercisesForTopic } from './build';
import { ExampleRow } from './ExampleRow';

interface GrammarViewProps {
  /** Abre o "Montar" neste tópico. */
  onPractice: (topicId: string) => void;
}

/** Os erros que valem para a gramática toda, numa lista que abre e fecha. */
function GeneralPitfalls() {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <Card layout={LinearTransition.duration(240).reduceMotion(ReduceMotion.System)}>
      <PressableScale
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(!open)}
        style={styles.header}
      >
        <View style={styles.flex}>
          <AppText style={{ fontFamily: fonts.bold }}>Erros comuns de quem fala português</AppText>
          <AppText variant="caption" color="muted">
            {GENERAL_PITFALLS.length} dicas para não traduzir palavra por palavra
          </AppText>
        </View>
        <AppText color="muted">{open ? '▲' : '▼'}</AppText>
      </PressableScale>
      {open ? (
        <Animated.View
          style={styles.body}
          entering={FadeIn.duration(220).reduceMotion(ReduceMotion.System)}
          exiting={FadeOut.duration(150).reduceMotion(ReduceMotion.System)}
        >
          {GENERAL_PITFALLS.map((p) => (
            <View key={p.title} style={[styles.note, { backgroundColor: colors.lilacSoft }]}>
              <AppText style={{ fontFamily: fonts.bold }}>{p.title}</AppText>
              <AppText>{p.text}</AppText>
            </View>
          ))}
        </Animated.View>
      ) : null}
    </Card>
  );
}

/** Tópicos de gramática em lista expansível: texto, esquema, exemplos com áudio, erros comuns, prática e mini-teste. */
export function GrammarView({ onPractice }: GrammarViewProps) {
  const { colors } = useTheme();
  const mastered = useProgressStore((s) => s.mastered);
  const [openId, setOpenId] = useState<string | null>(null);
  const [testing, setTesting] = useState<string | null>(null);

  if (testing) return <TopicTest topicId={testing} onExit={() => setTesting(null)} />;

  const done = ALL_GRAMMAR.filter((t) => mastered[t.id] !== undefined).length;

  return (
    <View style={styles.root}>
      <Card enterIndex={0}>
        <AppText variant="title">Gramática</AppText>
        <AppText color="muted">
          {done} de {ALL_GRAMMAR.length} tópicos dominados
        </AppText>
        <ProgressBar value={done / ALL_GRAMMAR.length} />
        <AppText variant="caption" color="muted">
          Leia um tópico por dia, ouça os exemplos e pratique. Quando se sentir seguro, faça o mini-teste: sem a explicação à
          vista, acertando 80% de primeira o tópico fica dominado.
        </AppText>
      </Card>
      <GeneralPitfalls />
      {ALL_GRAMMAR.map((topic, i) => {
        const open = openId === topic.id;
        const canPractice = exercisesForTopic(topic.id).length > 0;
        const isMastered = mastered[topic.id] !== undefined;
        const pitfalls = TOPIC_PITFALLS[topic.id];
        return (
          <Card key={topic.id} enterIndex={Math.min(i, 6)} layout={LinearTransition.duration(240).reduceMotion(ReduceMotion.System)}>
            <PressableScale
              accessibilityRole="button"
              accessibilityState={{ expanded: open }}
              accessibilityLabel={`${i + 1}. ${topic.title}${isMastered ? ', dominado' : ''}`}
              onPress={() => setOpenId(open ? null : topic.id)}
              style={styles.header}
            >
              <View style={[styles.badge, { backgroundColor: isMastered ? colors.okSoft : colors.primarySoft }]}>
                <AppText color={isMastered ? 'ok' : 'primary'} style={{ fontFamily: fonts.bold }}>
                  {isMastered ? '✓' : i + 1}
                </AppText>
              </View>
              <AppText style={[styles.title, { fontFamily: fonts.bold }]}>{topic.title}</AppText>
              <AppText color="muted">{open ? '▲' : '▼'}</AppText>
            </PressableScale>

            {open ? (
              <Animated.View
                style={styles.body}
                entering={FadeIn.duration(220).reduceMotion(ReduceMotion.System)}
                exiting={FadeOut.duration(150).reduceMotion(ReduceMotion.System)}
              >
                <RichText blocks={topic.body} />
                {topic.pattern ? (
                  <View style={[styles.note, { backgroundColor: colors.lilacSoft }]}>
                    <AppText style={{ fontFamily: fonts.bold }}>{topic.pattern}</AppText>
                  </View>
                ) : null}
                <View style={styles.examples}>
                  {topic.examples.map((example) => (
                    <ExampleRow key={example.jp} example={example} />
                  ))}
                </View>
                {pitfalls ? (
                  <View style={[styles.note, { backgroundColor: colors.primarySoft }]}>
                    <AppText style={{ fontFamily: fonts.bold }}>Cuidado, quem fala português costuma errar aqui</AppText>
                    {pitfalls.map((line) => (
                      <AppText key={line}>• {line}</AppText>
                    ))}
                  </View>
                ) : null}
                {canPractice ? <Button label="Praticar este tópico" onPress={() => onPractice(topic.id)} /> : null}
                <Button
                  label={isMastered ? 'Refazer o mini-teste' : 'Fazer o mini-teste'}
                  variant={canPractice ? 'soft' : 'primary'}
                  onPress={() => setTesting(topic.id)}
                />
              </Animated.View>
            ) : null}
          </Card>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.md },
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  badge: { width: 34, height: 34, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1 },
  body: { gap: spacing.md },
  note: { borderRadius: radii.md, padding: spacing.md, gap: spacing.xs },
  examples: { gap: spacing.sm },
});
