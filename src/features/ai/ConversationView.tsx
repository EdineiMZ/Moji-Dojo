import { useState } from 'react';
import { StyleSheet, Switch, TextInput, View } from 'react-native';
import { AppText, Bold, Button, Card, PressableScale } from '@/components';
import { PROBLEM_MESSAGES } from '@/features/myphrases/phrases';
import { useSpokenInput } from '@/features/speech/useSpokenInput';
import { speakJapanese } from '@/features/speech/voiceStore';
import { JapaneseInput } from '@/features/translate/JapaneseInput';
import { useProgressStore, useSettingsStore } from '@/store';
import { SPEECH_RATES } from '@/store/settingsStore';
import { fonts, fontSizes, radii, spacing, useTheme } from '@/theme';
import { AiDisclaimer } from './AiParts';
import { AiError } from './client';
import { customScenario, MAX_CUSTOM_SCENE, MAX_USER_TURNS, SCENARIOS, type ChatMessage, type Scenario } from './scenarios';
import { chatTurn, MAX_CHAT_INPUT, type ChatReply } from './tasks';

interface Line extends ChatMessage {
  /** Correção da IA para a fala do aluno (só quando havia o que corrigir). */
  fix?: { corrected: string; pt: string; note: string };
  /** Mostra a tradução da fala da IA. */
  showPt?: boolean;
}

const opening = (s: Scenario): Line => ({ role: 'ai', jp: s.openingJp, pt: s.openingPt });

/** Conversa por texto: a IA faz um personagem, você digita em japonês, ouve a resposta e vê as correções. */
export function ConversationView() {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [finished, setFinished] = useState(false);

  const start = (s: Scenario) => {
    setScenario(s);
    setLines([opening(s)]);
    setFinished(false);
  };
  const leave = () => {
    setScenario(null);
    setLines([]);
    setFinished(false);
  };

  if (!scenario) return <Picker onPick={start} />;
  if (finished) return <Summary lines={lines} scenario={scenario} onAgain={() => start(scenario)} onLeave={leave} />;
  return <Chat scenario={scenario} lines={lines} setLines={setLines} onFinish={() => setFinished(true)} onLeave={leave} />;
}

function Picker({ onPick }: { onPick: (s: Scenario) => void }) {
  const { colors } = useTheme();
  const [custom, setCustom] = useState('');
  return (
    <Card enterIndex={0}>
      <AppText variant="title">Conversa</AppText>
      <AppText color="muted">
        Escolha uma cena. A IA faz o outro personagem em japonês simples, você responde digitando e ouve a fala dela com a voz do aparelho. A cada frase sua, ela corrige e explica.
      </AppText>
      {SCENARIOS.map((s) => (
        <PressableScale key={s.id} accessibilityRole="button" accessibilityLabel={`${s.title}. ${s.goal}`} onPress={() => onPick(s)} style={styles.scenario}>
          <AppText style={styles.emoji}>{s.emoji}</AppText>
          <View style={styles.flex}>
            <AppText variant="title">{s.title}</AppText>
            <AppText variant="caption" color="muted">
              {s.goal}
            </AppText>
          </View>
        </PressableScale>
      ))}
      <AppText variant="title">Ou invente a sua cena</AppText>
      <AppText color="muted">Descreva a situação em português e a IA escolhe o personagem. Ex.: pedir informação numa farmácia.</AppText>
      <TextInput
        value={custom}
        onChangeText={(t) => setCustom(t.slice(0, MAX_CUSTOM_SCENE))}
        placeholder="Onde você está e com quem fala?"
        placeholderTextColor={colors.muted}
        accessibilityLabel="Descrição da sua cena de conversa"
        style={[styles.input, { color: colors.ink, backgroundColor: colors.background, borderColor: colors.field }]}
      />
      <Button label="Começar a minha cena" variant="soft" onPress={() => onPick(customScenario(custom))} disabled={custom.trim().length < 5} />
      <AiDisclaimer />
    </Card>
  );
}

interface ChatProps {
  scenario: Scenario;
  lines: Line[];
  setLines: (update: (prev: Line[]) => Line[]) => void;
  onFinish: () => void;
  onLeave: () => void;
}

function Chat({ scenario, lines, setLines, onFinish, onLeave }: ChatProps) {
  const { colors } = useTheme();
  const speed = useSettingsStore((s) => s.speechSpeed);
  const markStudied = useProgressStore((s) => s.markStudied);
  const [input, setInput] = useState('');
  const mic = useSpokenInput((text) => setInput(text), MAX_CHAT_INPUT);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState<ChatReply['suggestions']>([]);
  const [autoSpeak, setAutoSpeak] = useState(true);

  const turns = lines.filter((l) => l.role === 'me').length;
  const full = turns >= MAX_USER_TURNS;
  const say = (jp: string) => speakJapanese(jp.replace(/\s/g, ''), SPEECH_RATES[speed]);

  const send = async () => {
    const message = input.trim();
    if (!message || busy || full) return;
    setBusy(true);
    setError('');
    const history = lines;
    setLines((prev) => [...prev, { role: 'me', jp: message }]);
    setInput('');
    try {
      const reply = await chatTurn(scenario, history, message);
      setLines((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last && last.role === 'me' && !reply.feedback.ok && reply.feedback.corrected && reply.feedback.corrected !== message) {
          next[next.length - 1] = { ...last, fix: { corrected: reply.feedback.corrected, pt: reply.feedback.pt, note: reply.feedback.note } };
        }
        return [...next, { role: 'ai', jp: reply.jp, pt: reply.pt }];
      });
      setSuggestions(reply.suggestions);
      markStudied();
      if (autoSpeak) say(reply.jp);
    } catch (e) {
      // A fala não foi respondida: tira da conversa e devolve ao campo para tentar de novo.
      setLines((prev) => prev.slice(0, -1));
      setInput(message);
      setError(e instanceof AiError ? e.message : 'Não consegui falar com a IA agora.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card enterIndex={0}>
      <View style={styles.row}>
        <View style={styles.flex}>
          <AppText variant="title">
            {scenario.emoji} {scenario.title}
          </AppText>
          <AppText variant="caption" color="muted">
            Objetivo: {scenario.goal}
          </AppText>
        </View>
        <Button label="Sair" variant="ghost" onPress={onLeave} />
      </View>

      <View style={styles.row}>
        <AppText variant="caption" color="muted" style={styles.flex}>
          Falar as respostas em voz alta
        </AppText>
        <Switch value={autoSpeak} onValueChange={setAutoSpeak} accessibilityLabel="Falar as respostas em voz alta" trackColor={{ false: colors.line, true: colors.primary }} thumbColor={colors.surface} />
      </View>

      <View style={styles.log} accessibilityLiveRegion="polite">
        {lines.map((line, i) =>
          line.role === 'ai' ? (
            <View key={i} style={[styles.bubble, styles.left, { backgroundColor: colors.lilacSoft }]}>
              <AppText style={styles.jp}>{line.jp}</AppText>
              {line.showPt && line.pt ? <AppText color="muted">{line.pt}</AppText> : null}
              <View style={styles.row}>
                <AppText variant="caption" color="primary" accessibilityRole="button" onPress={() => say(line.jp)}>
                  🔊 Ouvir
                </AppText>
                {line.pt ? (
                  <AppText variant="caption" color="primary" accessibilityRole="button" onPress={() => setLines((prev) => prev.map((l, at) => (at === i ? { ...l, showPt: !l.showPt } : l)))}>
                    {line.showPt ? 'Esconder tradução' : 'Ver tradução'}
                  </AppText>
                ) : null}
              </View>
            </View>
          ) : (
            <View key={i} style={[styles.bubble, styles.right, { backgroundColor: colors.primarySoft }]}>
              <AppText style={styles.jp}>{line.jp}</AppText>
              {line.fix ? (
                <View style={[styles.fix, { backgroundColor: colors.skySoft }]}>
                  <AppText>
                    <Bold>Melhor: </Bold>
                    {line.fix.corrected}
                  </AppText>
                  {line.fix.note ? <AppText variant="caption">{line.fix.note}</AppText> : null}
                </View>
              ) : null}
            </View>
          ),
        )}
        {busy ? (
          <AppText color="muted" style={styles.left}>
            Digitando...
          </AppText>
        ) : null}
      </View>

      {suggestions.length > 0 && !busy && !full ? (
        <View style={styles.suggestions}>
          <AppText variant="caption" color="muted">
            IDEIAS DE RESPOSTA
          </AppText>
          {suggestions.map((s) => (
            <PressableScale key={s.jp} accessibilityRole="button" onPress={() => setInput(s.jp)} style={[styles.chip, { borderColor: colors.line, backgroundColor: colors.background }]}>
              <AppText>
                <Bold>{s.jp}</Bold>
              </AppText>
              {s.pt ? (
                <AppText variant="caption" color="muted">
                  {s.pt}
                </AppText>
              ) : null}
            </PressableScale>
          ))}
        </View>
      ) : null}

      {error ? (
        <AppText color="bad" accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : null}

      {full ? (
        <AppText color="muted">Chegamos ao limite de {MAX_USER_TURNS} falas desta conversa. Veja o resumo.</AppText>
      ) : (
        <>
          <JapaneseInput value={input} onChange={(t) => setInput(t.slice(0, MAX_CHAT_INPUT))} onSubmit={send} disabled={busy} />
          <Button label={mic.listening ? '⏹ Parar de ouvir' : '🎤 Falar em japonês'} variant="soft" onPress={() => void mic.toggle()} disabled={busy} />
          {mic.error ? (
            <AppText color="bad" accessibilityLiveRegion="polite">
              {mic.error}
            </AppText>
          ) : null}
          {mic.listening ? (
            <AppText color="muted" accessibilityLiveRegion="polite">
              Ouvindo... fale a sua frase em japonês.
            </AppText>
          ) : null}
          <Button label={busy ? 'Aguardando...' : 'Enviar'} onPress={send} disabled={busy || input.trim().length === 0} />
          <AppText variant="caption" color="muted">
            O que você fala vira texto antes de ir à IA: confira e corrija antes de enviar. O reconhecimento usa o serviço de fala do Android, que pode enviar o áudio ao Google.
          </AppText>
        </>
      )}
      <Button label={turns > 0 ? 'Terminar e ver o resumo' : 'Terminar'} variant="ghost" onPress={onFinish} disabled={busy} />
      <AiDisclaimer />
    </Card>
  );
}

function Summary({ lines, scenario, onAgain, onLeave }: { lines: Line[]; scenario: Scenario; onAgain: () => void; onLeave: () => void }) {
  const addMyPhrase = useProgressStore((s) => s.addMyPhrase);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const mine = lines.filter((l) => l.role === 'me');
  const fixed = mine.filter((l) => l.fix);

  const save = (jp: string, pt: string) => {
    const result = addMyPhrase(jp, pt);
    setMessage('error' in result ? { text: PROBLEM_MESSAGES[result.error], ok: false } : { text: 'Salva em Minhas frases. Ela entra na sua revisão.', ok: true });
  };

  return (
    <Card enterIndex={0}>
      <AppText variant="title">Resumo da conversa</AppText>
      <AppText color="muted">
        {scenario.emoji} {scenario.title}: você disse {mine.length} frase{mine.length === 1 ? '' : 's'}
        {mine.length > 0 ? `, ${mine.length - fixed.length} sem correção` : ''}.
      </AppText>
      {fixed.length > 0 ? (
        <View style={styles.log}>
          <AppText variant="caption" color="muted">
            PARA FIXAR
          </AppText>
          {fixed.map((l, i) => (
            <View key={i} style={styles.fixItem}>
              <AppText color="muted">Você: {l.jp}</AppText>
              <AppText>
                <Bold>{l.fix?.corrected}</Bold>
              </AppText>
              {l.fix?.note ? <AppText variant="caption">{l.fix.note}</AppText> : null}
              <Button label="Salvar em Minhas frases" variant="soft" onPress={() => save(l.fix?.corrected ?? l.jp, l.fix?.pt || scenario.title)} />
            </View>
          ))}
        </View>
      ) : mine.length > 0 ? (
        <AppText color="ok">Nenhuma correção. Muito bem!</AppText>
      ) : null}
      {message ? (
        <AppText color={message.ok ? 'ok' : 'bad'} accessibilityLiveRegion="polite">
          {message.text}
        </AppText>
      ) : null}
      <Button label="Conversar de novo" onPress={onAgain} />
      <Button label="Outra cena" variant="ghost" onPress={onLeave} />
      <AiDisclaimer />
    </Card>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1.5, borderRadius: radii.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontFamily: fonts.regular, fontSize: fontSizes.body, minHeight: 52 },
  flex: { flex: 1, gap: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flexWrap: 'wrap' },
  scenario: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm, minHeight: 56 },
  emoji: { fontSize: 28, lineHeight: 36 },
  log: { gap: spacing.sm },
  bubble: { borderRadius: radii.lg, padding: spacing.md, gap: spacing.xs, maxWidth: '92%' },
  left: { alignSelf: 'flex-start' },
  right: { alignSelf: 'flex-end' },
  jp: { fontSize: 20, lineHeight: 28 },
  fix: { borderRadius: radii.md, padding: spacing.sm, gap: 2 },
  fixItem: { gap: spacing.xs, paddingBottom: spacing.sm },
  suggestions: { gap: spacing.xs },
  chip: { borderWidth: 1.5, borderRadius: radii.md, padding: spacing.sm, minHeight: 48, justifyContent: 'center' },
});
