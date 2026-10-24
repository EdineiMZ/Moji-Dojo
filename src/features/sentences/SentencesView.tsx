import { useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { AppText, Button, Card, ChipRow, Mascot, useScrollIntoView } from '@/components';
import { ExampleRow } from '@/features/phrases/ExampleRow';
import { JapaneseInput } from '@/features/translate/JapaneseInput';
import { useProgressStore } from '@/store';
import { fonts, fontSizes, radii, spacing, useTheme } from '@/theme';
import { newWords, PAGE_SIZE, randomSentences, searchSentences, toExample, type SearchMode, type SentenceRow } from './query';

const MODES = [
  { value: 'jp' as const, label: 'Palavra em japonês' },
  { value: 'pt' as const, label: 'Em português' },
];

/** O nome muda quando o banco muda: o expo-sqlite só copia o arquivo do app se ainda não existir um com esse nome. */
const DATABASE = 'sentences-v1.db';

/**
 * Explorar frases: 30 mil frases de falantes do Tatoeba com tradução em português, escolhidas para o nível do app.
 * O banco vem dentro do app (nada de servidor); a busca é por palavra, em japonês ou em português.
 */
export function SentencesView() {
  return (
    <SQLiteProvider databaseName={DATABASE} assetSource={{ assetId: require('../../../assets/sentences.db') }}>
      <Explorer />
    </SQLiteProvider>
  );
}

function Explorer() {
  const { colors } = useTheme();
  const db = useSQLiteContext();
  const scrollIntoView = useScrollIntoView();
  const inputRef = useRef<TextInput>(null);
  const myPhrases = useProgressStore((s) => s.myPhrases);
  const addMyPhrase = useProgressStore((s) => s.addMyPhrase);

  const [mode, setMode] = useState<SearchMode>('jp');
  const [text, setText] = useState('');
  const [rows, setRows] = useState<SentenceRow[]>([]);
  const [page, setPage] = useState(0);
  const [more, setMore] = useState(false);
  const [searched, setSearched] = useState(false);
  const [saved, setSaved] = useState<ReadonlySet<number>>(new Set());
  const [notice, setNotice] = useState<string | null>(null);

  // A busca roda sozinha depois de uma pausa na digitação; a página 0 troca a lista, as outras acrescentam.
  useEffect(() => {
    if (text.trim().length === 0) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      const found = await searchSentences(db, mode, text, page);
      if (cancelled) return;
      setRows((current) => (page === 0 ? found : [...current, ...found]));
      setMore(found.length === PAGE_SIZE);
      setSearched(true);
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [db, mode, text, page]);

  const change = (next: string) => {
    setText(next);
    setPage(0);
    setNotice(null);
    if (next.trim().length === 0) {
      setRows([]);
      setMore(false);
      setSearched(false);
    }
  };

  const shuffle = async () => {
    setText('');
    setPage(0);
    setMore(false);
    setSearched(false);
    setNotice(null);
    setRows(await randomSentences(db));
  };

  const isMine = (row: SentenceRow): boolean =>
    saved.has(row.id) || Object.values(myPhrases).some((p) => p.jp.replace(/ /g, '') === row.kana.replace(/ /g, ''));

  const save = (row: SentenceRow) => {
    const result = addMyPhrase(row.kana.replace(/ /g, ''), row.pt);
    if ('error' in result && result.error !== 'duplicate') {
      setNotice('Não foi possível salvar: o limite de frases próprias foi atingido.');
      return;
    }
    setSaved((set) => new Set(set).add(row.id));
    setNotice('Salva! Ela entra na revisão das Minhas frases.');
  };

  return (
    <View style={styles.root}>
      <Card enterIndex={0}>
        <View style={styles.head}>
          <View style={styles.flex}>
            <AppText variant="title">Explorar frases</AppText>
            <AppText color="muted">Frases de falantes, com tradução, para ver uma palavra em uso. Procure por uma palavra ou sorteie.</AppText>
          </View>
          <Mascot mood="thinking" size={72} />
        </View>
        <ChipRow
          options={MODES}
          value={mode}
          onChange={(next) => {
            setMode(next);
            change('');
          }}
        />
        {mode === 'jp' ? (
          <JapaneseInput value={text} onChange={change} />
        ) : (
          <TextInput
            ref={inputRef}
            onFocus={() => scrollIntoView(inputRef.current)}
            value={text}
            onChangeText={change}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="ex.: biblioteca"
            placeholderTextColor={colors.muted}
            accessibilityLabel="Procurar em português"
            style={[styles.input, { color: colors.ink, backgroundColor: colors.background, borderColor: colors.line }]}
          />
        )}
        <Button label="Sortear frases" variant="soft" onPress={shuffle} />
        {notice ? (
          <AppText color="ok" accessibilityLiveRegion="polite">
            {notice}
          </AppText>
        ) : null}
        {searched && rows.length === 0 ? (
          <AppText color="muted">
            {mode === 'jp'
              ? 'Nenhuma frase com essa palavra. Tente a forma do dicionário (食べる) ou a leitura em kana.'
              : 'Nenhuma frase com esse trecho. Tente uma palavra mais curta.'}
          </AppText>
        ) : null}
      </Card>

      {rows.map((row, i) => {
        const fresh = newWords(row);
        return (
          <Card key={row.id} enterIndex={Math.min(i + 1, 6)}>
            <ExampleRow example={toExample(row)} />
            {fresh.length > 0 ? (
              <AppText variant="caption" color="muted">
                Palavra nova: {fresh.join(', ')}
              </AppText>
            ) : null}
            <View style={styles.foot}>
              <AppText variant="caption" color="muted" style={styles.flex}>
                Tatoeba #{row.id}
              </AppText>
              <Button label={isMine(row) ? 'Salva' : 'Salvar nas minhas frases'} variant="soft" disabled={isMine(row)} onPress={() => save(row)} />
            </View>
          </Card>
        );
      })}

      {more ? <Button label="Mais frases" variant="soft" onPress={() => setPage((p) => p + 1)} /> : null}
      {rows.length > 0 ? (
        <AppText variant="caption" color="muted">
          Frases do Tatoeba (tatoeba.org), licença CC BY 2.0 FR. As traduções para o português também são de voluntários, e algumas são livres (passam pelo inglês).
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.lg },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1 },
  foot: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  input: {
    borderWidth: 1.5,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: fonts.regular,
    fontSize: fontSizes.body,
    minHeight: 52,
  },
});
