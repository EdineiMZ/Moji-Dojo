import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Bold, Button, Card, ChipRow, PressableScale } from '@/components';
import { findWord } from '@/content';
import { READINGS, type ReadingLine, type ReadingText } from '@/content/readings';
import { segment, type Token } from '@/features/bank/lexicon';
import { speakJapanese } from '@/features/speech/voiceStore';
import { learnedWordIds } from '@/features/vocab/cards';
import { wordClass } from '@/features/vocab/wordInfo';
import { useProgressStore, useSettingsStore } from '@/store';
import { SPEECH_RATES } from '@/store/settingsStore';
import { fonts, radii, spacing, useTheme } from '@/theme';

const KINDS = [
  { value: 'texto' as const, label: 'Textos' },
  { value: 'dia' as const, label: 'Dia a dia' },
];

/** O texto da frase sem os espaços que separam, por exemplo, o prato do preço num cardápio. */
const plain = (line: ReadingLine): string => line.jp.replace(/ /g, '');

interface Picked {
  token: Token;
  line: ReadingLine;
}

interface LineProps {
  line: ReadingLine;
  known: ReadonlySet<string>;
  furigana: boolean;
  onPick: (token: Token) => void;
  picked: Token | null;
}

/** Uma frase: cada palavra do vocabulário é tocável; as que o aluno já estuda ganham destaque. */
function Line({ line, known, furigana, onPick, picked }: LineProps) {
  const { colors } = useTheme();
  const speed = useSettingsStore((s) => s.speechSpeed);
  const [showPt, setShowPt] = useState(false);
  const tokens = useMemo(() => segment(plain(line)) ?? [], [line]);
  return (
    <View style={styles.line}>
      <View style={styles.tokens}>
        {tokens.map((token, i) => {
          const tappable = token.entry.id !== null;
          const isKnown = token.entry.id !== null && known.has(token.entry.id);
          const needsReading = furigana && token.entry.role !== 'punct' && token.surface !== token.entry.reading;
          const body = (
            <View style={styles.token}>
              <AppText color="muted" style={[styles.ruby, { opacity: needsReading ? 1 : 0 }]}>
                {needsReading ? token.entry.reading : ' '}
              </AppText>
              <AppText
                style={[
                  styles.jp,
                  tappable && { borderBottomWidth: 2, borderBottomColor: isKnown ? colors.ok : colors.primary },
                  picked === token && { backgroundColor: colors.primarySoft },
                ]}
              >
                {token.surface}
              </AppText>
            </View>
          );
          return tappable ? (
            <PressableScale key={`${i}-${token.surface}`} accessibilityRole="button" accessibilityLabel={token.surface} onPress={() => onPick(token)}>
              {body}
            </PressableScale>
          ) : (
            <View key={`${i}-${token.surface}`}>{body}</View>
          );
        })}
      </View>
      <View style={styles.actions}>
        <Button label="🔊" variant="ghost" onPress={() => speakJapanese(plain(line), SPEECH_RATES[speed])} style={styles.small} />
        <Button label={showPt ? 'Esconder tradução' : 'Tradução'} variant="ghost" onPress={() => setShowPt((v) => !v)} style={styles.small} />
      </View>
      {showPt ? <AppText color="muted">{line.pt}</AppText> : null}
    </View>
  );
}

/** Painel da palavra tocada: leitura, significado, classe, áudio e "aprender" (com a frase de origem como nota). */
function WordPanel({ picked, onClose }: { picked: Picked; onClose: () => void }) {
  const speed = useSettingsStore((s) => s.speechSpeed);
  const vocab = useProgressStore((s) => s.vocab);
  const learnWords = useProgressStore((s) => s.learnWords);
  const setWordNote = useProgressStore((s) => s.setWordNote);
  const notes = useProgressStore((s) => s.wordNotes);
  const word = picked.token.entry.id ? findWord(picked.token.entry.id) : undefined;
  if (!word) return null;
  const learned = learnedWordIds(vocab).has(word.id);
  const cls = wordClass(word);

  const learn = () => {
    learnWords([word.id]);
    if (!notes[word.id]) setWordNote(word.id, `Da leitura: ${plain(picked.line)} (${picked.line.pt})`);
  };

  return (
    <Card style={styles.panel}>
      <View style={styles.panelHead}>
        <AppText variant="title">
          {word.jp} <AppText color="muted">{word.reading}</AppText>
        </AppText>
        <Button label="Fechar" variant="ghost" onPress={onClose} style={styles.small} />
      </View>
      <AppText>
        <Bold>{word.meaning}</Bold>
        {cls ? <AppText color="muted"> · {cls}</AppText> : null}
      </AppText>
      <View style={styles.actions}>
        <Button label="🔊 Ouvir" variant="soft" onPress={() => speakJapanese(word.reading, SPEECH_RATES[speed])} style={styles.small} />
        {learned ? <AppText color="ok">Já está nos seus cartões</AppText> : <Button label="Aprender esta palavra" onPress={learn} style={styles.small} />}
      </View>
      {!learned ? (
        <AppText variant="caption" color="muted">
          A frase fica guardada como nota da palavra.
        </AppText>
      ) : null}
    </Card>
  );
}

function TextReader({ text, onBack }: { text: ReadingText; onBack: () => void }) {
  const vocab = useProgressStore((s) => s.vocab);
  const known = useMemo(() => learnedWordIds(vocab), [vocab]);
  const [furigana, setFurigana] = useState(true);
  const [picked, setPicked] = useState<Picked | null>(null);

  return (
    <View style={styles.root}>
      <Card enterIndex={0}>
        <View style={styles.panelHead}>
          <View style={styles.flex}>
            <AppText variant="title">{text.title}</AppText>
            {text.where ? (
              <AppText variant="caption" color="muted">
                {text.where}
              </AppText>
            ) : null}
          </View>
          <Button label="← Textos" variant="ghost" onPress={onBack} style={styles.small} />
        </View>
        <View style={styles.actions}>
          <Button label={furigana ? 'Esconder leitura' : 'Mostrar leitura'} variant="soft" onPress={() => setFurigana((v) => !v)} style={styles.small} />
        </View>
        {text.lines.map((line) => (
          <Line
            key={line.jp}
            line={line}
            known={known}
            furigana={furigana}
            picked={picked && picked.line === line ? picked.token : null}
            onPick={(token) => setPicked({ token, line })}
          />
        ))}
        <AppText variant="caption" color="muted">
          Toque numa palavra sublinhada. Verde: você já estuda. Roxa: ainda não.
        </AppText>
      </Card>
      {picked ? <WordPanel picked={picked} onClose={() => setPicked(null)} /> : null}
    </View>
  );
}

/** Leitura: pequenos textos e leituras do dia a dia, com toque na palavra, leitura sobre o kanji, tradução e áudio. */
export function ReadView() {
  const [kind, setKind] = useState<ReadingText['kind']>('texto');
  const [open, setOpen] = useState<ReadingText | null>(null);
  if (open) return <TextReader text={open} onBack={() => setOpen(null)} />;

  return (
    <Card enterIndex={0}>
      <AppText variant="title">Leitura</AppText>
      <AppText color="muted">Textos curtos só com palavras que o app ensina. Toque numa palavra para ver o que ela é e levar para os cartões.</AppText>
      <ChipRow options={KINDS} value={kind} onChange={setKind} />
      {READINGS.filter((t) => t.kind === kind).map((t) => (
        <PressableScale key={t.id} accessibilityRole="button" onPress={() => setOpen(t)} style={styles.item}>
          <AppText style={{ fontFamily: fonts.bold }}>{t.title}</AppText>
          <AppText variant="caption" color="muted">
            {t.where ?? `${t.lines.length} frases`}
          </AppText>
        </PressableScale>
      ))}
      <AppText variant="caption" color="muted">
        Textos escritos para este app e ainda não revisados por um falante de japonês.
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.lg },
  flex: { flex: 1, gap: 2 },
  line: { gap: spacing.xs, paddingVertical: spacing.sm },
  tokens: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end' },
  token: { alignItems: 'center' },
  ruby: { fontSize: 11, lineHeight: 14 },
  jp: { fontSize: 24, lineHeight: 34, borderRadius: radii.md },
  actions: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap', alignItems: 'center' },
  small: { minHeight: 40 },
  panel: { gap: spacing.sm },
  panelHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
  item: { paddingVertical: spacing.sm, gap: 2 },
});
