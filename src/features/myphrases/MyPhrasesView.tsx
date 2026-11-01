import { useMemo, useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { AppText, Button, Card, Mascot, useScrollIntoView } from '@/components';
import { AiCorrection } from '@/features/ai/AiParts';
import { speakJapanese } from '@/features/speech/voiceStore';
import { JapaneseInput } from '@/features/translate/JapaneseInput';
import { TypingSession, type TypingTarget } from '@/features/translate/TypingSession';
import { useNow } from '@/hooks/useNow';
import { plural } from '@/lib/plural';
import { useProgressStore, useSettingsStore } from '@/store';
import { SPEECH_RATES } from '@/store/settingsStore';
import { fonts, fontSizes, radii, spacing, useTheme } from '@/theme';
import { shuffle } from '@/features/quiz/quiz';
import { duePhrases, MAX_MY_PHRASES, newestFirst, PHRASE_IDEAS, PROBLEM_MESSAGES, type MyPhrases } from './phrases';

const REVIEW_BATCH = 10;

const toTarget = (id: string, phrases: MyPhrases): TypingTarget | null => {
  const phrase = phrases[id];
  return phrase ? { id, prompt: phrase.pt, accepted: [phrase.jp], answer: phrase.jp } : null;
};

type Mode = { kind: 'home' } | { kind: 'review'; ids: readonly string[]; counts: boolean; attempt: number };

/**
 * Minhas frases: o aluno escreve frases sobre a própria vida (japonês + o que quis dizer), o app guarda e as
 * revisa com repetição espaçada, pedindo para escrever de memória. O app não corrige o japonês que a pessoa
 * escreveu (não há como saber se está certo): o conferido é se ela lembra do que escreveu.
 */
export function MyPhrasesView() {
  const { colors } = useTheme();
  const scrollIntoView = useScrollIntoView();
  const ptRef = useRef<TextInput>(null);
  const now = useNow();
  const speed = useSettingsStore((s) => s.speechSpeed);
  const phrases = useProgressStore((s) => s.myPhrases);
  const addMyPhrase = useProgressStore((s) => s.addMyPhrase);
  const updateMyPhrase = useProgressStore((s) => s.updateMyPhrase);
  const removeMyPhrase = useProgressStore((s) => s.removeMyPhrase);
  const recordMyPhraseAnswer = useProgressStore((s) => s.recordMyPhraseAnswer);
  const recordDrill = useProgressStore((s) => s.recordDrill);

  const [mode, setMode] = useState<Mode>({ kind: 'home' });
  const [jp, setJp] = useState('');
  const [pt, setPt] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [ideaIndex, setIdeaIndex] = useState(0);
  const [confirming, setConfirming] = useState<string | null>(null);

  const list = useMemo(() => newestFirst(phrases), [phrases]);
  const due = duePhrases(phrases, now);

  const startReview = (ids: readonly string[], counts: boolean) =>
    setMode((m) => ({ kind: 'review', ids, counts, attempt: (m.kind === 'review' ? m.attempt : 0) + 1 }));

  if (mode.kind === 'review') {
    const targets = mode.ids.map((id) => toTarget(id, phrases)).filter((t): t is TypingTarget => t !== null);
    const remaining = duePhrases(phrases, now).filter((id) => !mode.ids.includes(id));
    return (
      <TypingSession
        key={mode.attempt}
        items={targets}
        title={mode.counts ? 'Revisão das minhas frases' : 'Praticando minhas frases'}
        onResult={(item, ok) => (mode.counts ? recordMyPhraseAnswer(item.id, ok, true) : recordDrill(ok))}
        onExit={() => setMode({ kind: 'home' })}
        {...(mode.counts && remaining.length > 0
          ? { again: { label: `Revisar mais (${Math.min(remaining.length, REVIEW_BATCH)})`, onPress: () => startReview(remaining.slice(0, REVIEW_BATCH), true) } }
          : {})}
      />
    );
  }

  const reset = () => {
    setJp('');
    setPt('');
    setEditing(null);
  };

  const save = () => {
    if (editing) {
      const problem = updateMyPhrase(editing, jp, pt);
      if (problem) {
        setMessage({ text: PROBLEM_MESSAGES[problem], ok: false });
        return;
      }
      setMessage({ text: 'Frase atualizada.', ok: true });
    } else {
      const result = addMyPhrase(jp, pt);
      if ('error' in result) {
        setMessage({ text: PROBLEM_MESSAGES[result.error], ok: false });
        return;
      }
      setMessage({ text: 'Frase salva! Ela entra na sua revisão.', ok: true });
    }
    reset();
  };

  const edit = (id: string) => {
    const phrase = phrases[id];
    if (!phrase) return;
    setEditing(id);
    setJp(phrase.jp);
    setPt(phrase.pt);
    setMessage(null);
  };

  const idea = PHRASE_IDEAS[ideaIndex % PHRASE_IDEAS.length] ?? '';

  return (
    <View style={styles.root}>
      <Card enterIndex={0}>
        <View style={styles.head}>
          <View style={styles.flex}>
            <AppText variant="title">Minhas frases</AppText>
            <AppText color="muted">
              {list.length === 0 ? 'Escreva frases sobre a sua vida e o app guarda e revisa.' : plural(list.length, 'frase salva', 'frases salvas')}
            </AppText>
          </View>
          <Mascot mood={due.length > 0 ? 'neutral' : 'happy'} size={72} />
        </View>
        {due.length > 0 ? (
          <Button label={`Revisar agora (${Math.min(due.length, REVIEW_BATCH)})`} onPress={() => startReview(due.slice(0, REVIEW_BATCH), true)} />
        ) : list.length > 0 ? (
          <AppText color="muted">Nenhuma revisão pendente.</AppText>
        ) : null}
        {list.length > 0 ? (
          <Button
            label="Praticar sem agendar"
            variant={due.length > 0 ? 'ghost' : 'soft'}
            onPress={() => startReview(shuffle(Object.keys(phrases)).slice(0, REVIEW_BATCH), false)}
          />
        ) : null}
      </Card>

      <Card enterIndex={1}>
        <AppText variant="title">{editing ? 'Editar a frase' : 'Escrever uma frase'}</AppText>
        {!editing ? (
          <View style={[styles.idea, { backgroundColor: colors.lilacSoft }]}>
            <AppText variant="caption" color="muted">
              IDEIA
            </AppText>
            <AppText>{idea}</AppText>
            <View style={styles.row}>
              <Button label="Usar" variant="soft" style={styles.flex} onPress={() => setPt(idea.replace(/\[|\]/g, ''))} />
              <Button label="Outra ideia" variant="ghost" style={styles.flex} onPress={() => setIdeaIndex((i) => i + 1)} />
            </View>
          </View>
        ) : null}

        <AppText variant="caption" color="muted">
          O QUE QUER DIZER (EM PORTUGUÊS)
        </AppText>
        <TextInput
          ref={ptRef}
          onFocus={() => scrollIntoView(ptRef.current)}
          value={pt}
          onChangeText={(t) => {
            setPt(t);
            setMessage(null);
          }}
          placeholder="Eu moro em São Paulo."
          placeholderTextColor={colors.muted}
          accessibilityLabel="O que a frase quer dizer, em português"
          style={[styles.input, { color: colors.ink, backgroundColor: colors.background, borderColor: colors.field }]}
        />

        <AppText variant="caption" color="muted">
          A FRASE EM JAPONÊS
        </AppText>
        <JapaneseInput
          value={jp}
          onChange={(t) => {
            setJp(t);
            setMessage(null);
          }}
          onSubmit={save}
        />

        <AiCorrection jp={jp} pt={pt} onUse={(corrected) => { setJp(corrected); setMessage(null); }} />

        {message ? (
          <AppText color={message.ok ? 'ok' : 'bad'} accessibilityLiveRegion="polite">
            {message.text}
          </AppText>
        ) : null}
        <Button label={editing ? 'Salvar a mudança' : 'Salvar a frase'} onPress={save} />
        {editing ? <Button label="Cancelar" variant="ghost" onPress={reset} /> : null}
        <AppText variant="caption" color="muted">
          O app confere só se você lembra da frase na revisão; quem corrige o japonês é a IA (se você cadastrou a chave em Ajustes) ou alguém que fala japonês. A IA
          também erra. Cabem até {MAX_MY_PHRASES}.
        </AppText>
      </Card>

      {list.map(([id, phrase], i) => (
        <Card key={id} enterIndex={Math.min(i + 2, 6)}>
          <AppText style={styles.jp}>{phrase.jp}</AppText>
          <AppText color="muted">{phrase.pt}</AppText>
          <View style={styles.row}>
            <Button
              label="🔊 Ouvir"
              variant="soft"
              style={styles.flex}
              onPress={() => speakJapanese(phrase.jp.replace(/ /g, ''), SPEECH_RATES[speed])}
            />
            <Button label="Editar" variant="ghost" style={styles.flex} onPress={() => edit(id)} />
            <Button
              label={confirming === id ? 'Apagar mesmo' : 'Apagar'}
              variant="ghost"
              style={styles.flex}
              onPress={() => {
                if (confirming === id) {
                  removeMyPhrase(id);
                  setConfirming(null);
                  if (editing === id) reset();
                } else {
                  setConfirming(id);
                }
              }}
            />
          </View>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.lg },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1 },
  row: { flexDirection: 'row', gap: spacing.sm },
  idea: { borderRadius: radii.md, padding: spacing.md, gap: spacing.xs },
  jp: { fontFamily: fonts.bold, fontSize: 24, lineHeight: 32 },
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
