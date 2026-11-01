import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { AppText, Bold, Button, Card } from '@/components';
import { MAX_NOTE_LENGTH } from '@/store/progressStore';
import type { VocabWord } from '@/content';
import { speakJapanese } from '@/features/speech/voiceStore';
import { useProgressStore, useSettingsStore } from '@/store';
import { SPEECH_RATES } from '@/store/settingsStore';
import { fonts, fontSizes, radii, spacing, useTheme } from '@/theme';
import { RomajiLine } from '@/features/phrases/RomajiLine';
import { PitchGraph } from '@/features/pitch/PitchGraph';
import { accentOf, moras } from '@/features/pitch/pitch';
import { ExampleRow } from '@/features/phrases/ExampleRow';
import { toExample } from '@/features/bank/bank';
import { kanjiBreakdown } from './kanjiWords';
import { fromTwins } from './twins';
import { examplesFor, wordClass } from './wordInfo';

interface WordCardProps {
  word: VocabWord;
  enterIndex?: number;
}

/** Palavra para aprender: como se escreve, a leitura, o significado, os kanji que a formam e o som. */
export function WordCard({ word, enterIndex }: WordCardProps) {
  const speed = useSettingsStore((s) => s.speechSpeed);
  const breakdown = kanjiBreakdown(word);
  const showReading = word.reading !== word.jp;
  const accent = fromTwins(word, accentOf);
  const kind = wordClass(word);
  const examples = fromTwins(word, (w) => { const found = examplesFor(w.id); return found.length > 0 ? found : undefined; }) ?? [];
  const { colors } = useTheme();
  const note = useProgressStore((s) => s.wordNotes[word.id]);
  const setWordNote = useProgressStore((s) => s.setWordNote);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');

  return (
    <Card {...(enterIndex === undefined ? {} : { enterIndex })}>
      <AppText style={styles.jp}>{word.jp}</AppText>
      {kind ? (
        <AppText variant="caption" color="muted">
          {kind}
        </AppText>
      ) : null}
      {showReading ? <AppText color="muted">{word.reading}</AppText> : null}
      {word.romaji ? <RomajiLine text={word.romaji} /> : null}
      <AppText variant="title">{word.meaning}</AppText>
      {accent !== undefined && moras(word.reading).length >= 2 ? <PitchGraph reading={word.reading} accent={accent} caption /> : null}
      {breakdown.length > 0 ? (
        <View style={styles.kanji}>
          <AppText variant="caption" color="muted">
            Kanji da palavra
          </AppText>
          {breakdown.map((line) => (
            <AppText key={line}>{line}</AppText>
          ))}
        </View>
      ) : null}
      {examples.length > 0 ? (
        <View style={styles.kanji}>
          <AppText variant="caption" color="muted">
            {examples.length === 1 ? 'Exemplo' : 'Exemplos'}
          </AppText>
          {examples.map((sentence) => (
            <ExampleRow key={sentence.id} example={toExample(sentence)} />
          ))}
        </View>
      ) : null}
      {editing ? (
        <View style={styles.kanji}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            multiline
            maxLength={MAX_NOTE_LENGTH}
            placeholder="Sua dica para lembrar esta palavra"
            placeholderTextColor={colors.muted}
            accessibilityLabel="Sua dica de memória"
            style={[styles.input, { color: colors.ink, backgroundColor: colors.background, borderColor: colors.field }]}
          />
          <View style={styles.row}>
            <Button
              label="Salvar a dica"
              style={styles.flex}
              onPress={() => {
                if (setWordNote(word.id, draft)) setEditing(false);
              }}
            />
            <Button label="Cancelar" variant="ghost" style={styles.flex} onPress={() => setEditing(false)} />
          </View>
        </View>
      ) : (
        <View style={styles.kanji}>
          {note ? (
            <AppText>
              <Bold>Sua dica: </Bold>
              {note}
            </AppText>
          ) : null}
          <Button
            label={note ? 'Editar a minha dica' : '✏️ Escrever uma dica de memória'}
            variant="ghost"
            onPress={() => {
              setDraft(note ?? '');
              setEditing(true);
            }}
          />
        </View>
      )}
      <Button label="🔊 Ouvir" variant="soft" onPress={() => speakJapanese(word.reading, SPEECH_RATES[speed])} />
    </Card>
  );
}

const styles = StyleSheet.create({
  jp: { fontFamily: fonts.bold, fontSize: 40, lineHeight: 50 },
  kanji: { gap: spacing.xs },
  row: { flexDirection: 'row', gap: spacing.sm },
  flex: { flex: 1 },
  input: { borderWidth: 1.5, borderRadius: radii.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontFamily: fonts.regular, fontSize: fontSizes.body, minHeight: 52 },
});
