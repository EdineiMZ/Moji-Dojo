import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card, ChipRow, Mascot, PetalRain, PressableScale } from '@/components';
import { DIALOG_SCENES, type DialogOption, type DialogScene } from '@/content/dialogs';
import { resultMood } from '@/features/lessons/resultCopy';
import { RomajiLine } from '@/features/phrases/RomajiLine';
import { OptionButton } from '@/features/quiz/OptionButton';
import { ResultCard } from '@/features/quiz/ResultCard';
import { REVIEW_GOOD_PCT } from '@/features/review/session';
import { speakJapanese } from '@/features/speech/voiceStore';
import { TypingSession } from '@/features/translate/TypingSession';
import { SceneGenerator } from '@/features/ai/SceneGenerator';
import { feedbackComplete, feedbackCorrect, feedbackWrong } from '@/lib/feedback';
import { useAiStore, useProgressStore, useSettingsStore } from '@/store';
import { SPEECH_RATES } from '@/store/settingsStore';
import { fonts, radii, spacing, useTheme } from '@/theme';
import {
  correctOption,
  isYouTurn,
  nextYouIndex,
  OPTION_HELPS,
  optionLabel,
  shuffledOptions,
  visibleCount,
  writeTargets,
  youTurns,
  type OptionHelp,
} from './dialogs';

interface Attempt {
  /** Respostas erradas já tentadas neste turno (o texto japonês). */
  tried: readonly string[];
  solved: boolean;
}

/** Uma fala na conversa: o atendente à esquerda e o aluno à direita. */
function Bubble({ line, mine, hidden = false }: { line: { jp: string; romaji: string; pt: string }; mine: boolean; hidden?: boolean }) {
  const { colors } = useTheme();
  const speed = useSettingsStore((s) => s.speechSpeed);
  const [revealed, setRevealed] = useState(false);
  const covered = hidden && !revealed;
  return (
    <View
      style={[
        styles.bubble,
        mine ? styles.mine : styles.theirs,
        { backgroundColor: mine ? colors.primarySoft : colors.surface, borderColor: mine ? colors.primary : colors.line },
      ]}
    >
      <AppText variant="caption" color="muted">
        {mine ? 'VOCÊ' : 'ATENDENTE'}
      </AppText>
      {covered ? (
        <PressableScale accessibilityRole="button" accessibilityLabel="Mostrar o texto da fala" onPress={() => setRevealed(true)}>
          <AppText color="muted">Só áudio. Toque para ver o texto e a tradução.</AppText>
        </PressableScale>
      ) : (
        <>
          <AppText style={styles.jp}>{line.jp}</AppText>
          <RomajiLine text={line.romaji} />
          <AppText variant="caption">{line.pt}</AppText>
        </>
      )}
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={`Ouvir: ${line.jp}`}
        onPress={() => speakJapanese(line.jp.replace(/ /g, ''), SPEECH_RATES[speed], mine ? 'you' : 'staff')}
        style={styles.listen}
      >
        <AppText color="primary">🔊 Ouvir</AppText>
      </PressableScale>
    </View>
  );
}

/** A narração entre as falas. */
const Narration = ({ text }: { text: string }) => (
  <AppText color="muted" center>
    {text}
  </AppText>
);

function SceneSession({ scene, onExit, onRestart }: { scene: DialogScene; onExit: () => void; onRestart: () => void }) {
  const recordDrill = useProgressStore((s) => s.recordDrill);
  const recordDialogDone = useProgressStore((s) => s.recordDialogDone);
  const speed = useSettingsStore((s) => s.speechSpeed);
  const romajiMode = useSettingsStore((s) => s.romajiMode);
  const [help, setHelp] = useState<OptionHelp>(romajiMode === 'always' ? 'romaji' : 'none');
  const [current, setCurrent] = useState(() => nextYouIndex(scene, 0));
  const [attempts, setAttempts] = useState<Readonly<Record<number, Attempt>>>({});
  const [orders] = useState(() =>
    Object.fromEntries(scene.turns.flatMap((t, i) => (isYouTurn(t) ? [[i, shuffledOptions(t)] as const] : []))),
  );
  const [writing, setWriting] = useState(false);
  const [listenOnly, setListenOnly] = useState(false);

  // No modo "só ouvir", a fala do atendente toca sozinha quando aparece.
  useEffect(() => {
    if (!listenOnly || current < 0) return;
    for (let i = current - 1; i >= 0; i--) {
      const turn = scene.turns[i];
      if (turn?.kind === 'staff') {
        speakJapanese(turn.jp.replace(/ /g, ''), SPEECH_RATES[speed], 'staff');
        return;
      }
      if (turn?.kind === 'you') return;
    }
  }, [listenOnly, current, scene, speed]);

  const turns = youTurns(scene);
  const turn = scene.turns[current];

  if (writing) {
    return (
      <TypingSession
        items={writeTargets(scene)}
        title={`${scene.title}: suas falas`}
        onResult={(_item, ok) => recordDrill(ok, 'dialog')}
        onExit={() => setWriting(false)}
      />
    );
  }

  const pick = (option: DialogOption) => {
    if (!isYouTurn(turn)) return;
    const attempt = attempts[current] ?? { tried: [], solved: false };
    if (attempt.solved) return;
    if (option.ok) {
      feedbackCorrect();
      recordDrill(attempt.tried.length === 0, 'dialog');
      speakJapanese(option.jp.replace(/ /g, ''), SPEECH_RATES[speed]);
      setAttempts({ ...attempts, [current]: { ...attempt, solved: true } });
    } else {
      feedbackWrong();
      if (!attempt.tried.includes(option.jp)) setAttempts({ ...attempts, [current]: { ...attempt, tried: [...attempt.tried, option.jp] } });
    }
  };

  const advance = () => {
    const next = nextYouIndex(scene, current + 1);
    if (next < 0) {
      const first = firstTryCount();
      if ((first / turns.length) * 100 >= REVIEW_GOOD_PCT) feedbackComplete(first === turns.length);
      recordDialogDone(first === turns.length);
    }
    setCurrent(next);
  };

  /** Turnos resolvidos de primeira, contando os que já passaram. */
  function firstTryCount(): number {
    return Object.values(attempts).filter((a) => a.solved && a.tried.length === 0).length;
  }

  const finished = current < 0;
  const shownTurns = scene.turns.slice(0, visibleCount(scene, current));

  if (finished) {
    const first = firstTryCount();
    const pct = Math.round((first / Math.max(turns.length, 1)) * 100);
    const good = pct >= REVIEW_GOOD_PCT;
    const missed = scene.turns.flatMap((t, i) => {
      const a = attempts[i];
      return isYouTurn(t) && a && a.tried.length > 0 ? [`${correctOption(t).jp} = ${correctOption(t).pt}`] : [];
    });
    return (
      <>
        <ResultCard
          label={scene.title}
          heading="Cena concluída"
          pct={pct}
          firstTry={first}
          total={turns.length}
          wrong={missed}
          wrongLabel="Para ficar de olho:"
          wrongText={(line) => line}
          passed={good}
          mood={resultMood(good, pct)}
        >
          <View style={styles.actions}>
            <Button label="Escrever as minhas falas" onPress={() => setWriting(true)} />
            <Button label="Repetir a cena" variant="soft" onPress={onRestart} />
            <Button label="Voltar às cenas" variant="ghost" onPress={onExit} />
          </View>
        </ResultCard>
        {good ? <PetalRain /> : null}
      </>
    );
  }

  const attempt = attempts[current] ?? { tried: [], solved: false };
  const youTurn = isYouTurn(turn) ? turn : null;
  const lastWrong = youTurn?.options.find((o) => o.jp === attempt.tried.at(-1));

  return (
    <View style={styles.root}>
      <Card>
        <View style={styles.head}>
          <View style={styles.flex}>
            <AppText variant="caption" color="muted">
              {scene.title}
            </AppText>
            <AppText>{scene.intro}</AppText>
          </View>
          <Mascot mood={attempt.solved ? 'happy' : lastWrong ? 'sad' : 'neutral'} size={64} />
        </View>
        <AppText variant="caption" color="muted">
          COMO OUVIR O ATENDENTE
        </AppText>
        <ChipRow
          options={[
            { value: 'read', label: 'Ler e ouvir' },
            { value: 'listen', label: 'Só ouvir' },
          ]}
          value={listenOnly ? 'listen' : 'read'}
          onChange={(v) => setListenOnly(v === 'listen')}
        />
        <AppText variant="caption" color="muted">
          AJUDA NAS RESPOSTAS
        </AppText>
        <ChipRow options={OPTION_HELPS} value={help} onChange={setHelp} />
      </Card>

      <View style={styles.chat}>
        {shownTurns.map((t, i) => {
          if (t.kind === 'narrator') return <Narration key={i} text={t.pt} />;
          if (t.kind === 'staff') return <Bubble key={`${i}-${listenOnly}`} line={t} mine={false} hidden={listenOnly} />;
          return attempts[i]?.solved ? <Bubble key={i} line={correctOption(t)} mine /> : null;
        })}
      </View>

      {youTurn && !attempt.solved ? (
        <View style={styles.options}>
          <AppText variant="caption" color="muted">
            O QUE VOCÊ DIZ?
          </AppText>
          {(orders[current] ?? youTurn.options).map((option, i) => (
            <OptionButton
              key={option.jp}
              index={i}
              label={optionLabel(option, help)}
              glyph={false}
              state={attempt.tried.includes(option.jp) ? 'wrong' : 'idle'}
              onPress={() => pick(option)}
            />
          ))}
          {lastWrong ? (
            <View accessibilityLiveRegion="polite" style={[styles.feedback, { backgroundColor: 'transparent' }]}>
              <AppText color="bad">
                {lastWrong.jp} ({lastWrong.pt}) não serve aqui.
              </AppText>
              <AppText>{lastWrong.why}</AppText>
            </View>
          ) : null}
        </View>
      ) : null}

      {attempt.solved ? <Button label={nextYouIndex(scene, current + 1) < 0 ? 'Ver o resultado' : 'Continuar'} onPress={advance} /> : null}
    </View>
  );
}

/** Diálogos curtos: cenas de restaurante, loja, estação e hotel. Em cada turno, escolher a resposta que cabe. */
export function DialogView() {
  const [state, setState] = useState<{ id: string; attempt: number } | null>(null);
  const aiScenes = useAiStore((s) => s.scenes);
  const removeScene = useAiStore((s) => s.removeScene);
  const scene = [...DIALOG_SCENES, ...aiScenes].find((s) => s.id === state?.id);

  if (state && scene) {
    return (
      <SceneSession
        key={state.attempt}
        scene={scene}
        onExit={() => setState(null)}
        onRestart={() => setState({ id: scene.id, attempt: state.attempt + 1 })}
      />
    );
  }

  return (
    <View style={styles.root}>
      <Card enterIndex={0}>
        <View style={styles.head}>
          <View style={styles.flex}>
            <AppText variant="title">Diálogos</AppText>
            <AppText color="muted">Conversas curtas de viagem: escolha a resposta que cabe em cada momento.</AppText>
          </View>
          <Mascot mood="neutral" size={72} />
        </View>
      </Card>
      {DIALOG_SCENES.map((s, i) => (
        <Card key={s.id} enterIndex={Math.min(i + 1, 6)}>
          <AppText variant="title">{s.title}</AppText>
          <AppText color="muted">{s.intro}</AppText>
          <AppText variant="caption" color="muted">
            {youTurns(s).length} respostas suas
          </AppText>
          <Button label="Começar a cena" onPress={() => setState({ id: s.id, attempt: 1 })} />
        </Card>
      ))}
      {aiScenes.map((s) => (
        <Card key={s.id}>
          <AppText variant="caption" color="muted">
            CENA DA IA · {s.place.toUpperCase()}
          </AppText>
          <AppText variant="title">{s.title}</AppText>
          <AppText color="muted">{s.intro}</AppText>
          <AppText variant="caption" color="muted">
            {youTurns(s).length} respostas suas. Gerada por IA: pode errar.
          </AppText>
          <Button label="Começar a cena" onPress={() => setState({ id: s.id, attempt: 1 })} />
          <Button label="Apagar a cena" variant="ghost" onPress={() => removeScene(s.id)} />
        </Card>
      ))}
      <SceneGenerator onCreated={(id) => setState({ id, attempt: 1 })} />
      <AppText variant="caption" color="muted">
        As suas falas são as frases da aba Viagem. As do atendente são frases fixas de atendimento escritas para o app e
        ainda precisam de revisão por quem fala japonês.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.md },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: spacing.xs },
  chat: { gap: spacing.sm },
  bubble: { borderWidth: 1.5, borderRadius: radii.md, padding: spacing.md, gap: spacing.xs, maxWidth: '88%' },
  mine: { alignSelf: 'flex-end' },
  theirs: { alignSelf: 'flex-start' },
  jp: { fontFamily: fonts.bold, fontSize: 20, lineHeight: 28 },
  listen: { alignSelf: 'flex-start', paddingVertical: spacing.xs },
  options: { gap: spacing.sm },
  feedback: { gap: spacing.xs },
  actions: { alignSelf: 'stretch', gap: spacing.sm },
});
