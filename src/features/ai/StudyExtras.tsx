import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { AppText, Bold, Button, Card, ChipRow, SegmentedControl, useScrollIntoView } from '@/components';
import { PROBLEM_MESSAGES } from '@/features/myphrases/phrases';
import { speakJapanese } from '@/features/speech/voiceStore';
import { useAiStore, useProgressStore, useSettingsStore } from '@/store';
import { SPEECH_RATES } from '@/store/settingsStore';
import { fonts, fontSizes, radii, spacing, useTheme } from '@/theme';
import { AiDisclaimer } from './AiParts';
import { AiError } from './client';
import { runJob } from './jobs';
import { QueueOffer } from './QueueParts';
import { TappableSentence } from './TappableSentence';
import type { JobSpec } from './queue';
import { PHRASE_TOPICS } from './tasks';
import {
  knownShare,
  MAX_REGISTER_INPUT,
  REGISTER_LABELS,
  rewriteRegisters,
  type RegisterSet,
  type Story,
  type StoryLength,
} from './tasksMore';

const errorText = (error: unknown): string => (error instanceof AiError ? error.message : 'Não consegui falar com a IA agora.');

type Message = { text: string; ok: boolean };

/** Salva uma frase em Minhas frases e devolve a mensagem para mostrar. */
function useSave() {
  const addMyPhrase = useProgressStore((s) => s.addMyPhrase);
  return (jp: string, pt: string): Message => {
    const result = addMyPhrase(jp, pt);
    return 'error' in result ? { text: PROBLEM_MESSAGES[result.error], ok: false } : { text: 'Salva em Minhas frases. Ela entra na sua revisão.', ok: true };
  };
}

/** Treinador de registro: a mesma frase em casual, educado e formal, com quando usar cada uma. */
export function RegisterCard() {
  const { colors } = useTheme();
  const scrollIntoView = useScrollIntoView();
  const speed = useSettingsStore((s) => s.speechSpeed);
  const save = useSave();
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<RegisterSet | null>(null);
  const [message, setMessage] = useState<Message | null>(null);

  const run = async () => {
    setBusy(true);
    setMessage(null);
    try {
      setResult(await rewriteRegisters(input));
    } catch (e) {
      setResult(null);
      setMessage({ text: errorText(e), ok: false });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card enterIndex={0}>
      <AppText variant="title">Casual, educado ou formal?</AppText>
      <AppText color="muted">
        Escreva uma frase, em português ou em japonês, e veja como ela muda com amigos, no dia a dia e com clientes ou chefes. Em japonês, a escolha da forma muda o respeito, não só as palavras.
      </AppText>
      <TextInput
        value={input}
        onChangeText={(t) => {
          setInput(t.slice(0, MAX_REGISTER_INPUT));
          setMessage(null);
        }}
        placeholder="Ex.: Você quer comer comigo?"
        placeholderTextColor={colors.muted}
        onFocus={(e) => scrollIntoView(e.target)}
        accessibilityLabel="Frase para reescrever em três registros"
        style={[styles.input, { color: colors.ink, backgroundColor: colors.background, borderColor: colors.line }]}
      />
      <Button label={busy ? 'Reescrevendo...' : '✨ Mostrar as três formas'} onPress={run} disabled={busy || input.trim().length === 0} />
      {message ? (
        <AppText color={message.ok ? 'ok' : 'bad'} accessibilityLiveRegion="polite">
          {message.text}
        </AppText>
      ) : null}
      {result ? (
        <View style={styles.list} accessibilityLiveRegion="polite">
          <AppText color="muted">Significa: {result.pt}</AppText>
          {result.versions.map((v) => (
            <View key={v.register} style={[styles.box, { backgroundColor: colors.lilacSoft }]}>
              <AppText variant="caption" color="muted">
                {REGISTER_LABELS[v.register].toUpperCase()}
              </AppText>
              <AppText style={styles.jp}>{v.jp}</AppText>
              {v.reading && v.reading !== v.jp ? (
                <AppText variant="caption" color="muted">
                  {v.reading}
                </AppText>
              ) : null}
              {v.when ? <AppText>{v.when}</AppText> : null}
              <View style={styles.row}>
                <Button label="🔊 Ouvir" variant="soft" style={styles.flex} onPress={() => speakJapanese((v.reading || v.jp).replace(/\s/g, ''), SPEECH_RATES[speed])} />
                <Button label="Salvar" variant="soft" style={styles.flex} onPress={() => setMessage(save(v.jp, result.pt))} />
              </View>
            </View>
          ))}
          {result.note ? (
            <AppText>
              <Bold>Diferença principal:</Bold> {result.note}
            </AppText>
          ) : null}
          <AiDisclaimer />
        </View>
      ) : null}
    </Card>
  );
}

/** Textos de leitura sob medida: tema à escolha, com o vocabulário que você já aprendeu. */
export function StoryCard() {
  const { colors } = useTheme();
  const stories = useAiStore((s) => s.stories);
  const removeStory = useAiStore((s) => s.removeStory);
  const save = useSave();
  const [topic, setTopic] = useState(PHRASE_TOPICS[0]?.value ?? 'travel');
  const [length, setLength] = useState<StoryLength>('short');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [openId, setOpenId] = useState<string | null>(stories[0]?.id ?? null);
  const [failure, setFailure] = useState<{ spec: JobSpec; error: unknown } | null>(null);

  const generate = async () => {
    const next: JobSpec = { kind: 'story', topic, length };
    setBusy(true);
    setMessage(null);
    setFailure(null);
    try {
      const result = await runJob(next);
      if (result.id) setOpenId(result.id);
    } catch (e) {
      setMessage({ text: errorText(e), ok: false });
      setFailure({ spec: next, error: e });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card enterIndex={0}>
      <AppText variant="title">Leitura sob medida</AppText>
      <AppText color="muted">A IA escreve um texto curto sobre o tema que você escolher, usando as palavras que você já aprendeu. Os textos ficam guardados para ler sem internet.</AppText>
      <ChipRow options={PHRASE_TOPICS.map((t) => ({ value: t.value, label: t.label }))} value={topic} onChange={setTopic} />
      <SegmentedControl
        options={[
          { value: 'short' as const, label: 'Curto (4 frases)' },
          { value: 'medium' as const, label: 'Médio (7 frases)' },
        ]}
        value={length}
        onChange={setLength}
      />
      <Button label={busy ? 'Escrevendo o texto...' : '✨ Criar um texto'} onPress={generate} disabled={busy} />
      {message ? (
        <AppText color={message.ok ? 'ok' : 'bad'} accessibilityLiveRegion="polite">
          {message.text}
        </AppText>
      ) : null}
      {failure ? <QueueOffer spec={failure.spec} error={failure.error} /> : null}
      <AiDisclaimer />

      {stories.map((story) => (
        <StoryBlock
          key={story.id}
          story={story}
          open={openId === story.id}
          onToggle={() => setOpenId(openId === story.id ? null : story.id)}
          onRemove={() => removeStory(story.id)}
          onSave={(jp, pt) => setMessage(save(jp, pt))}
          tone={colors.lilacSoft}
        />
      ))}
    </Card>
  );
}

interface StoryBlockProps {
  story: { id: string; topic: string; title: string; sentences: Story['sentences'] };
  open: boolean;
  tone: string;
  onToggle: () => void;
  onRemove: () => void;
  onSave: (jp: string, pt: string) => void;
}

function StoryBlock({ story, open, tone, onToggle, onRemove, onSave }: StoryBlockProps) {
  const speed = useSettingsStore((s) => s.speechSpeed);
  const [showReading, setShowReading] = useState(false);
  const [showPt, setShowPt] = useState(false);
  const share = knownShare({ title: story.title, sentences: story.sentences });
  const say = (reading: string, jp: string) => speakJapanese((reading || jp).replace(/\s/g, ''), SPEECH_RATES[speed]);

  return (
    <View style={[styles.box, { backgroundColor: tone }]}>
      <AppText accessibilityRole="button" onPress={onToggle} style={styles.storyTitle}>
        {open ? '▾' : '▸'} {story.title} <AppText color="muted">· {story.topic}</AppText>
      </AppText>
      {open ? (
        <>
          <AppText variant="caption" color="muted">
            {share.known} de {share.total} frases só com palavras que o app conhece.
          </AppText>
          <View style={styles.row}>
            <Button label={showReading ? 'Esconder leitura' : 'Ver leitura'} variant="ghost" style={styles.flex} onPress={() => setShowReading((v) => !v)} />
            <Button label={showPt ? 'Esconder tradução' : 'Ver tradução'} variant="ghost" style={styles.flex} onPress={() => setShowPt((v) => !v)} />
          </View>
          {story.sentences.map((s, i) => (
            <View key={i} style={styles.list}>
              <TappableSentence jp={s.jp} reading={s.reading} />
              {showReading && s.reading ? (
                <AppText variant="caption" color="muted">
                  {s.reading}
                </AppText>
              ) : null}
              {showPt ? <AppText color="muted">{s.pt}</AppText> : null}
              <View style={styles.row}>
                <AppText variant="caption" color="primary" accessibilityRole="button" onPress={() => say(s.reading, s.jp)}>
                  🔊 Ouvir
                </AppText>
                <AppText variant="caption" color="primary" accessibilityRole="button" onPress={() => onSave(s.jp, s.pt)}>
                  Salvar a frase
                </AppText>
              </View>
            </View>
          ))}
          <View style={styles.row}>
            <Button label="🔊 Ouvir o texto todo" variant="soft" style={styles.flex} onPress={() => say(story.sentences.map((s) => s.reading || s.jp).join('、'), '')} />
            <Button label="Apagar" variant="ghost" style={styles.flex} onPress={onRemove} />
          </View>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flexWrap: 'wrap' },
  list: { gap: spacing.xs },
  box: { borderRadius: radii.md, padding: spacing.md, gap: spacing.sm },
  jp: { fontSize: 20, lineHeight: 28 },
  storyTitle: { fontFamily: fonts.bold },
  input: { borderWidth: 1.5, borderRadius: radii.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontFamily: fonts.regular, fontSize: fontSizes.body, minHeight: 52 },
});
