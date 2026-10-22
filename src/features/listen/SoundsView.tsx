import { StyleSheet, View } from 'react-native';
import { AppText, Card, RichText } from '@/components';
import { SOUND_TOPICS } from '@/data/sounds';
import { ExampleRow } from '@/features/phrases/ExampleRow';
import { spacing } from '@/theme';

/** Guia de pronúncia pensado para quem fala português: leia, toque no som e repita em voz alta. */
export function SoundsView() {
  return (
    <View style={styles.root}>
      <AppText color="muted">
        Guia de pronúncia pensado para quem fala português. Leia, toque no som e repita em voz alta.
      </AppText>
      {SOUND_TOPICS.map((topic, i) => (
        <Card key={topic.title} enterIndex={Math.min(i, 6)}>
          <AppText variant="title">{topic.title}</AppText>
          <RichText blocks={topic.body} />
          <View style={styles.examples}>
            {topic.examples.map((example) => (
              <ExampleRow key={example.jp + example.pt} example={example} />
            ))}
          </View>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.md },
  examples: { gap: spacing.sm },
});
