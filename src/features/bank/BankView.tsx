import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card, ChipRow, Mascot } from '@/components';
import { findWord } from '@/content';
import { ExampleRow } from '@/features/phrases/ExampleRow';
import { FreeSession } from '@/features/translate/FreeSession';
import { TypingSession, type TypingTarget } from '@/features/translate/TypingSession';
import { learnedWordIds } from '@/features/vocab/cards';
import { useProgressStore } from '@/store';
import { spacing } from '@/theme';
import { BANK_MODES, bankCounts, pickSentences, toExample, toTranslationItem, unknownWords, type BankMode } from './bank';
import type { BankSentence } from '@/content/sentenceBank';

type Session = { kind: 'understand' | 'write'; attempt: number };

const toTarget = (sentence: BankSentence): TypingTarget => {
  const item = toTranslationItem(sentence);
  return { id: item.id, prompt: item.pt, accepted: item.accepted, answer: item.jp, romaji: item.romaji };
};

/**
 * Banco de frases: frases reais do Tatoeba com tradução, filtradas pelo vocabulário que o aluno já aprendeu.
 * Cada frase pode ser ouvida, praticada (entender ou escrever) e salva na revisão das "Minhas frases".
 */
export function BankView() {
  const vocab = useProgressStore((s) => s.vocab);
  const myPhrases = useProgressStore((s) => s.myPhrases);
  const addMyPhrase = useProgressStore((s) => s.addMyPhrase);
  const learnWords = useProgressStore((s) => s.learnWords);
  const recordDrill = useProgressStore((s) => s.recordDrill);

  const known = useMemo(() => learnedWordIds(vocab), [vocab]);
  const counts = useMemo(() => bankCounts(known), [known]);
  const [mode, setMode] = useState<BankMode>(() => (counts.known >= 5 ? 'known' : 'one'));
  const [shown, setShown] = useState<readonly BankSentence[]>(() => pickSentences(mode, known));
  const [seen, setSeen] = useState<ReadonlySet<number>>(() => new Set(shown.map((s) => s.id)));
  const [session, setSession] = useState<Session | null>(null);
  const [saved, setSaved] = useState<ReadonlySet<number>>(new Set());
  const [notice, setNotice] = useState<string | null>(null);

  const draw = (nextMode: BankMode, history: ReadonlySet<number>) => {
    const next = pickSentences(nextMode, known, history);
    setShown(next);
    setSeen(new Set([...history, ...next.map((s) => s.id)]));
    setNotice(null);
  };

  const changeMode = (next: BankMode) => {
    setMode(next);
    draw(next, new Set());
  };

  const alreadyMine = (sentence: BankSentence): boolean =>
    saved.has(sentence.id) || Object.values(myPhrases).some((p) => p.jp.replace(/ /g, '') === sentence.kana.replace(/ /g, ''));

  const save = (sentence: BankSentence) => {
    const result = addMyPhrase(sentence.kana, sentence.pt);
    if ('error' in result && result.error !== 'duplicate') {
      setNotice('Não foi possível salvar: o limite de frases próprias foi atingido.');
      return;
    }
    setSaved((set) => new Set(set).add(sentence.id));
    setNotice('Salva! Ela entra na revisão das Minhas frases.');
  };

  if (session) {
    const exit = () => setSession(null);
    const again = { label: 'Praticar de novo', onPress: () => setSession({ ...session, attempt: session.attempt + 1 }) };
    return session.kind === 'understand' ? (
      <FreeSession
        key={session.attempt}
        items={shown.map(toTranslationItem)}
        title="Banco de frases"
        onResult={(_item, ok) => recordDrill(ok)}
        onExit={exit}
        again={again}
      />
    ) : (
      <TypingSession
        key={session.attempt}
        items={shown.map(toTarget)}
        title="Banco de frases"
        onResult={(_item, ok) => recordDrill(ok)}
        onExit={exit}
        again={again}
      />
    );
  }

  const options = BANK_MODES.map((m) => ({ value: m.value, label: `${m.label} (${counts[m.value]})` }));

  return (
    <View style={styles.root}>
      <Card enterIndex={0}>
        <View style={styles.head}>
          <View style={styles.flex}>
            <AppText variant="title">Banco de frases</AppText>
            <AppText color="muted">Frases de verdade, com tradução, no ritmo das palavras que você já aprendeu.</AppText>
          </View>
          <Mascot mood="neutral" size={72} />
        </View>
        <AppText variant="caption" color="muted">
          MOSTRAR
        </AppText>
        <ChipRow options={options} value={mode} onChange={changeMode} />
        {mode === 'known' && counts.known === 0 ? (
          <AppText color="muted">
            Ainda não há frases só com palavras que você aprendeu. Aprenda palavras na aba Palavras, ou veja as frases com uma
            palavra nova.
          </AppText>
        ) : null}
        <Button label="Outras frases" variant="soft" onPress={() => draw(mode, seen)} />
        {shown.length > 0 ? (
          <View style={styles.row}>
            <Button label="Entender estas" style={styles.flex} onPress={() => setSession({ kind: 'understand', attempt: 1 })} />
            <Button label="Escrever estas" style={styles.flex} onPress={() => setSession({ kind: 'write', attempt: 1 })} />
          </View>
        ) : null}
        {notice ? (
          <AppText color="ok" accessibilityLiveRegion="polite">
            {notice}
          </AppText>
        ) : null}
      </Card>

      {shown.map((sentence, i) => {
        const missing = unknownWords(sentence, known).flatMap((id) => {
          const word = findWord(id);
          return word ? [word] : [];
        });
        return (
          <Card key={sentence.id} enterIndex={Math.min(i + 1, 6)}>
            <ExampleRow example={toExample(sentence)} />
            {missing.map((word) => (
              <View key={word.id} style={styles.newWord}>
                <AppText variant="caption" color="muted">
                  PALAVRA NOVA
                </AppText>
                <AppText>
                  {word.jp}
                  {word.reading !== word.jp ? ` (${word.reading})` : ''} = {word.meaning}
                </AppText>
                <Button label="Aprender esta palavra" variant="ghost" onPress={() => learnWords([word.id])} />
              </View>
            ))}
            <Button
              label={alreadyMine(sentence) ? 'Salva nas Minhas frases' : 'Salvar para revisar'}
              variant="soft"
              disabled={alreadyMine(sentence)}
              onPress={() => save(sentence)}
            />
          </Card>
        );
      })}

      <AppText variant="caption" color="muted">
        Frases do projeto Tatoeba (licença CC BY 2.0 FR), escolhidas só entre as que o app consegue ler por inteiro. A
        divisão em palavras é automática: se uma frase parecer estranha, desconfie e confira com quem fala japonês.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.lg },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: spacing.xs },
  row: { flexDirection: 'row', gap: spacing.sm },
  newWord: { gap: spacing.xs },
});
