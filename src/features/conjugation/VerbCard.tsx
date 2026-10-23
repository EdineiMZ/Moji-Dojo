import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card } from '@/components';
import { speakJapanese } from '@/features/speech/voiceStore';
import { useSettingsStore } from '@/store';
import { SPEECH_RATES } from '@/store/settingsStore';
import { fonts, spacing } from '@/theme';
import { FORM_LABELS } from './cards';
import { conjugate, VERB_FORMS } from './conjugate';
import { GROUP_LABELS, type Verb } from './verbs';

interface VerbCardProps {
  verb: Verb;
  enterIndex?: number;
}

/** Verbo para aprender: o dicionário, o grupo e as quatro formas, escritas e lidas, com o som do verbo. */
export function VerbCard({ verb, enterIndex }: VerbCardProps) {
  const speed = useSettingsStore((s) => s.speechSpeed);
  const { word, spec } = verb;
  const showReading = word.reading !== word.jp;

  return (
    <Card {...(enterIndex === undefined ? {} : { enterIndex })}>
      <AppText style={styles.jp}>{word.jp}</AppText>
      <AppText color="muted">
        {[showReading ? word.reading : null, GROUP_LABELS[spec.group]].filter(Boolean).join(' · ')}
      </AppText>
      <AppText variant="title">{word.meaning}</AppText>
      <View style={styles.forms}>
        {VERB_FORMS.map((form) => {
          const written = conjugate(word.jp, spec, form);
          const read = conjugate(word.reading, spec, form);
          return (
            <View key={form} style={styles.row}>
              <AppText variant="caption" color="muted" style={styles.label}>
                {FORM_LABELS[form]}
              </AppText>
              <AppText style={[styles.form, { fontFamily: fonts.bold }]}>
                {written}
                {read !== written ? ` (${read})` : ''}
              </AppText>
            </View>
          );
        })}
      </View>
      <Button label="🔊 Ouvir" variant="soft" onPress={() => speakJapanese(word.reading, SPEECH_RATES[speed])} />
    </Card>
  );
}

const styles = StyleSheet.create({
  jp: { fontFamily: fonts.bold, fontSize: 40, lineHeight: 50 },
  forms: { gap: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  label: { width: 110 },
  form: { flex: 1 },
});
