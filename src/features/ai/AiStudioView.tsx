import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText, Bold, Button, Card, ChipRow, useScrollIntoView } from '@/components';
import { PROBLEM_MESSAGES } from '@/features/myphrases/phrases';
import { useShareStore } from '@/features/share/sharedText';
import { speakJapanese } from '@/features/speech/voiceStore';
import { JapaneseInput } from '@/features/translate/JapaneseInput';
import { useAiStore, useProgressStore, useSettingsStore } from '@/store';
import { SPEECH_RATES } from '@/store/settingsStore';
import { fonts, fontSizes, radii, spacing, useTheme } from '@/theme';
import { AiDisclaimer } from './AiParts';
import { AiError } from './client';
import { CoachCard } from './CoachCard';
import { ConversationView } from './ConversationView';
import { ExamView } from './ExamView';
import { explainText, MAX_DIARY_LENGTH, MAX_DIARY_LINES, MAX_TEXT_LENGTH, reviewDiary, type DiaryReview, type TextExplanation } from './tasks';
import { QueueBar } from './QueueParts';
import { RegisterCard, StoryCard } from './StudyExtras';
import { useAiReady } from './useAi';

type Tab = 'chat' | 'explain' | 'diary' | 'register' | 'story' | 'exam' | 'coach';

const errorText = (error: unknown): string => (error instanceof AiError ? error.message : 'Não consegui falar com a IA agora.');

/** Frases → IA: explicar um texto japonês colado e o diário corrigido. Só aparece com a IA ligada em Ajustes. */
export function AiStudioView() {
  const router = useRouter();
  const ready = useAiReady();
  // Um texto compartilhado de outro app abre direto o Explicar, com o campo preenchido (nada é enviado à IA sem a pessoa tocar em Explicar).
  const [shared, setShared] = useState(() => useShareStore.getState().text ?? '');
  const [tab, setTab] = useState<Tab>(() => (useShareStore.getState().text ? 'explain' : 'chat'));
  const used = useCallback(() => {
    setShared('');
    useShareStore.getState().clear();
  }, []);

  if (!ready) {
    return (
      <Card enterIndex={0}>
        <AppText variant="title">Estudar com IA</AppText>
        <AppText color="muted">
          Converse com a IA em japonês, explique falas de anime, escreva um diário corrigido, compare registros, leia textos feitos para você faça simulados estilo JLPT e receba um plano semanal. Cadastre a sua chave de API em Ajustes para usar. O resto do app não precisa dela.
        </AppText>
        {shared ? (
          <AppText accessibilityLiveRegion="polite">
            <Bold>Texto recebido:</Bold> &ldquo;{shared.length > 120 ? `${shared.slice(0, 120)}...` : shared}&rdquo;. Ele fica guardado: configure a IA e abra Explicar para usá-lo.
          </AppText>
        ) : null}
        <Button label="Abrir Ajustes" variant="soft" onPress={() => router.push('/settings/ai')} />
      </Card>
    );
  }

  return (
    <View style={styles.root}>
      <ChipRow
        options={[
          { value: 'chat' as const, label: 'Conversa' },
          { value: 'explain' as const, label: 'Explicar' },
          { value: 'diary' as const, label: 'Diário' },
          { value: 'register' as const, label: 'Registro' },
          { value: 'story' as const, label: 'Leitura' },
          { value: 'exam' as const, label: 'Simulado' },
          { value: 'coach' as const, label: 'Coach' },
        ]}
        value={tab}
        onChange={setTab}
      />
      <QueueBar />
      {tab === 'chat' ? <ConversationView /> : null}
      {tab === 'explain' ? <ExplainTextCard initial={shared} onUsed={used} /> : null}
      {tab === 'diary' ? <DiaryCard /> : null}
      {tab === 'register' ? <RegisterCard /> : null}
      {tab === 'story' ? <StoryCard /> : null}
      {tab === 'exam' ? <ExamView /> : null}
      {tab === 'coach' ? <CoachCard /> : null}
    </View>
  );
}

/** Salva uma frase em Minhas frases, devolvendo a mensagem para mostrar. */
function useSavePhrase() {
  const addMyPhrase = useProgressStore((s) => s.addMyPhrase);
  return (jp: string, pt: string): { text: string; ok: boolean } => {
    const result = addMyPhrase(jp, pt);
    return 'error' in result ? { text: PROBLEM_MESSAGES[result.error], ok: false } : { text: 'Salva em Minhas frases. Ela entra na sua revisão.', ok: true };
  };
}

function ExplainTextCard({ initial, onUsed }: { initial: string; onUsed: () => void }) {
  const { colors } = useTheme();
  const scrollIntoView = useScrollIntoView();
  const speed = useSettingsStore((s) => s.speechSpeed);
  const save = useSavePhrase();
  const [source, setSource] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<TextExplanation | null>(null);

  // O texto compartilhado já foi para o campo: não volta a ser usado.
  useEffect(() => {
    if (initial) onUsed();
  }, [initial, onUsed]);
  const [shown, setShown] = useState('');
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  const run = async () => {
    setBusy(true);
    setMessage(null);
    try {
      setResult(await explainText(source));
      setShown(source.trim());
    } catch (e) {
      setResult(null);
      setMessage({ text: errorText(e), ok: false });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card enterIndex={0}>
      <AppText variant="title">Explicar um texto</AppText>
      <AppText color="muted">Cole uma fala de anime, uma mensagem ou uma frase que você não entendeu. Use o teclado do celular com japonês ativado, ou cole de outro app.</AppText>
      <TextInput
        value={source}
        onChangeText={(t) => {
          setSource(t.slice(0, MAX_TEXT_LENGTH));
          setMessage(null);
        }}
        multiline
        placeholder="日本語のテキスト"
        placeholderTextColor={colors.muted}
        onFocus={(e) => scrollIntoView(e.target)}
        accessibilityLabel="Texto em japonês para explicar"
        style={[styles.input, styles.multiline, { color: colors.ink, backgroundColor: colors.background, borderColor: colors.field }]}
      />
      <AppText variant="caption" color="muted">
        {source.length} de {MAX_TEXT_LENGTH} letras
      </AppText>
      <Button label={busy ? 'Explicando...' : '✨ Explicar'} onPress={run} disabled={busy || source.trim().length === 0} />
      {message ? (
        <AppText color={message.ok ? 'ok' : 'bad'} accessibilityLiveRegion="polite">
          {message.text}
        </AppText>
      ) : null}

      {result ? (
        <View style={[styles.result, { backgroundColor: colors.skySoft }]} accessibilityLiveRegion="polite">
          <AppText>
            <Bold>Tradução:</Bold> {result.translation}
          </AppText>
          {result.reading ? (
            <AppText>
              <Bold>Leitura:</Bold> {result.reading}
            </AppText>
          ) : null}
          {result.words.length > 0 ? (
            <View style={styles.list}>
              <AppText variant="caption" color="muted">
                PALAVRAS
              </AppText>
              {result.words.map((w) => (
                <AppText key={`${w.word}-${w.meaning}`}>
                  <Bold>{w.word}</Bold>
                  {w.reading && w.reading !== w.word ? ` (${w.reading})` : ''} {w.meaning}
                </AppText>
              ))}
            </View>
          ) : null}
          {result.grammar.length > 0 ? (
            <View style={styles.list}>
              <AppText variant="caption" color="muted">
                GRAMÁTICA
              </AppText>
              {result.grammar.map((g) => (
                <AppText key={g.point}>
                  <Bold>{g.point}:</Bold> {g.explanation}
                </AppText>
              ))}
            </View>
          ) : null}
          {result.note ? (
            <AppText>
              <Bold>Atenção:</Bold> {result.note}
            </AppText>
          ) : null}
          <View style={styles.row}>
            <Button label="🔊 Ouvir" variant="soft" style={styles.flex} onPress={() => speakJapanese(shown.replace(/\s/g, ''), SPEECH_RATES[speed])} />
            <Button label="Salvar a frase" variant="soft" style={styles.flex} onPress={() => setMessage(save(shown, result.translation))} />
          </View>
          <AiDisclaimer />
        </View>
      ) : null}
    </Card>
  );
}

function DiaryCard() {
  const { colors } = useTheme();
  const speed = useSettingsStore((s) => s.speechSpeed);
  const markStudied = useProgressStore((s) => s.markStudied);
  const diary = useAiStore((s) => s.diary);
  const addDiary = useAiStore((s) => s.addDiary);
  const save = useSavePhrase();
  const [lines, setLines] = useState<string[]>(['']);
  const [busy, setBusy] = useState(false);
  const [review, setReview] = useState<DiaryReview | null>(null);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [showOld, setShowOld] = useState(false);

  const filled = lines.map((l) => l.trim()).filter((l) => l.length > 0);

  const run = async () => {
    setBusy(true);
    setMessage(null);
    try {
      const result = await reviewDiary(filled);
      setReview(result);
      addDiary({ id: `d${Date.now().toString(36)}`, at: Date.now(), items: result.items, summary: result.summary });
      markStudied();
    } catch (e) {
      setReview(null);
      setMessage({ text: errorText(e), ok: false });
    } finally {
      setBusy(false);
    }
  };

  const edit = (i: number, value: string) => {
    setLines((prev) => prev.map((l, at) => (at === i ? value.slice(0, MAX_DIARY_LENGTH) : l)));
    setMessage(null);
  };

  return (
    <Card enterIndex={0}>
      <AppText variant="title">Diário</AppText>
      <AppText color="muted">Escreva de 1 a {MAX_DIARY_LINES} frases sobre o seu dia. A IA corrige, explica e você pode salvar as corrigidas em Minhas frases para revisar.</AppText>
      {lines.map((line, i) => (
        <View key={i} style={styles.list}>
          <AppText variant="caption" color="muted">
            FRASE {i + 1}
          </AppText>
          <JapaneseInput value={line} onChange={(t) => edit(i, t)} disabled={busy} />
        </View>
      ))}
      {lines.length < MAX_DIARY_LINES ? <Button label="+ Outra frase" variant="ghost" onPress={() => setLines((l) => [...l, ''])} /> : null}
      <Button label={busy ? 'Corrigindo...' : '✨ Corrigir o diário'} onPress={run} disabled={busy || filled.length === 0} />
      {message ? (
        <AppText color={message.ok ? 'ok' : 'bad'} accessibilityLiveRegion="polite">
          {message.text}
        </AppText>
      ) : null}

      {review ? <ReviewResult review={review} speed={speed} save={(jp, pt) => setMessage(save(jp, pt))} /> : null}

      {diary.length > 0 ? (
        <>
          <Button label={showOld ? 'Esconder diários anteriores' : `Ver diários anteriores (${diary.length})`} variant="ghost" onPress={() => setShowOld((v) => !v)} />
          {showOld
            ? diary.slice(0, 10).map((entry) => (
                <View key={entry.id} style={[styles.result, { backgroundColor: colors.lilacSoft }]}>
                  <AppText variant="caption" color="muted">
                    {new Date(entry.at).toLocaleDateString('pt-BR')}
                  </AppText>
                  {entry.items.map((item, i) => (
                    <AppText key={i}>
                      <Bold>{item.corrected}</Bold> {item.pt}
                    </AppText>
                  ))}
                </View>
              ))
            : null}
        </>
      ) : null}
    </Card>
  );
}

function ReviewResult({ review, speed, save }: { review: DiaryReview; speed: keyof typeof SPEECH_RATES; save: (jp: string, pt: string) => void }) {
  const { colors } = useTheme();
  return (
    <View style={styles.list} accessibilityLiveRegion="polite">
      {review.items.map((item, i) => (
        <View key={i} style={[styles.result, { backgroundColor: item.ok ? colors.okSoft : colors.skySoft }]}>
          <AppText color={item.ok ? 'ok' : 'ink'}>
            <Bold>{item.ok ? 'Certa! ' : 'Sugestão: '}</Bold>
            {item.corrected}
          </AppText>
          {item.pt ? <AppText color="muted">{item.pt}</AppText> : null}
          {item.note ? <AppText>{item.note}</AppText> : null}
          <View style={styles.row}>
            <Button label="🔊 Ouvir" variant="soft" style={styles.flex} onPress={() => speakJapanese(item.corrected.replace(/\s/g, ''), SPEECH_RATES[speed])} />
            <Button label="Salvar" variant="soft" style={styles.flex} onPress={() => save(item.corrected, item.pt || item.corrected)} />
          </View>
        </View>
      ))}
      {review.summary ? <AppText>{review.summary}</AppText> : null}
      <AiDisclaimer />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.md },
  flex: { flex: 1 },
  row: { flexDirection: 'row', gap: spacing.sm },
  list: { gap: spacing.xs },
  result: { borderRadius: radii.md, padding: spacing.md, gap: spacing.sm },
  input: { borderWidth: 1.5, borderRadius: radii.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontFamily: fonts.regular, fontSize: fontSizes.body, minHeight: 52 },
  multiline: { minHeight: 110, textAlignVertical: 'top' },
});
