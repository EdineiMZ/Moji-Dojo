import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText, Button, Card, RichText } from '@/components';
import { GRAMMAR_TOPICS } from '@/data/grammar';
import { fonts, radii, spacing, useTheme } from '@/theme';
import { exercisesForTopic } from './build';
import { ExampleRow } from './ExampleRow';

interface GrammarViewProps {
  /** Abre o "Montar" neste tópico. */
  onPractice: (topicId: string) => void;
}

/** Tópicos de gramática em lista expansível: texto, esquema da frase, exemplos com áudio e prática. */
export function GrammarView({ onPractice }: GrammarViewProps) {
  const { colors } = useTheme();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <View style={styles.root}>
      <AppText color="muted">
        Leia na ordem, um tópico por dia já está ótimo. Cada tópico tem exemplos com áudio e um botão para praticar montando
        frases.
      </AppText>
      {GRAMMAR_TOPICS.map((topic, i) => {
        const open = openId === topic.id;
        const canPractice = exercisesForTopic(topic.id).length > 0;
        return (
          <Card key={topic.id} enterIndex={Math.min(i, 6)}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded: open }}
              onPress={() => setOpenId(open ? null : topic.id)}
              style={styles.header}
            >
              <View style={[styles.badge, { backgroundColor: colors.primarySoft }]}>
                <AppText color="primary" style={{ fontFamily: fonts.bold }}>
                  {i + 1}
                </AppText>
              </View>
              <AppText style={[styles.title, { fontFamily: fonts.bold }]}>{topic.title}</AppText>
              <AppText color="muted">{open ? '▲' : '▼'}</AppText>
            </Pressable>

            {open ? (
              <View style={styles.body}>
                <RichText blocks={topic.body} />
                {topic.pattern ? (
                  <View style={[styles.pattern, { backgroundColor: colors.lilacSoft }]}>
                    <AppText style={{ fontFamily: fonts.bold }}>{topic.pattern}</AppText>
                  </View>
                ) : null}
                <View style={styles.examples}>
                  {topic.examples.map((example) => (
                    <ExampleRow key={example.jp} example={example} />
                  ))}
                </View>
                {canPractice ? <Button label="Praticar este tópico" onPress={() => onPractice(topic.id)} /> : null}
              </View>
            ) : null}
          </Card>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  badge: { width: 34, height: 34, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1 },
  body: { gap: spacing.md },
  pattern: { borderRadius: radii.md, padding: spacing.md },
  examples: { gap: spacing.sm },
});
