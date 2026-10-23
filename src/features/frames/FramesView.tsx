import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Bold, Button, Card, ChipRow, PetalRain } from '@/components';
import { ConfidenceNote } from '@/features/confidence/ConfidenceNote';
import { RomajiLine } from '@/features/phrases/RomajiLine';
import { OptionButton, type OptionState } from '@/features/quiz/OptionButton';
import { shuffle } from '@/features/quiz/quiz';
import { speakJapanese } from '@/features/speech/voiceStore';
import { anatomize } from '@/features/structure/anatomy';
import { BlockRow } from '@/features/structure/BlockRow';
import { feedbackComplete, feedbackCorrect, feedbackWrong } from '@/lib/feedback';
import { useProgressStore, useSettingsStore } from '@/store';
import { SPEECH_RATES } from '@/store/settingsStore';
import { spacing } from '@/theme';
import { FRAMES, fillFrame, type Frame, type SlotWord } from './frames';

type Mode = 'make' | 'challenge';

const MODES = [
  { value: 'make' as const, label: 'Montar frases' },
  { value: 'challenge' as const, label: 'Desafio' },
];

const FRAME_OPTIONS = FRAMES.map((f) => ({ value: f.id, label: f.title }));

/** O texto sem espaços, para a voz ler direito. */
const spoken = (jp: string): string => jp.replace(/ /g, '');

function MakeView() {
  const speed = useSettingsStore((s) => s.speechSpeed);
  const [frameId, setFrameId] = useState(FRAMES[0]!.id);
  const frame = FRAMES.find((f) => f.id === frameId) ?? FRAMES[0]!;
  const [wordJp, setWordJp] = useState<string | null>(null);
  const word = frame.words.find((w) => w.jp === wordJp) ?? frame.words[0]!;
  const filled = fillFrame(frame, word);
  const blocks = anatomize(filled.pieces);

  return (
    <View style={styles.root}>
      <Card enterIndex={0}>
        <AppText variant="title">Frases-modelo</AppText>
        <AppText color="muted">
          Um molde, muitas frases: escolha o molde, troque a palavra e veja a frase pronta. Aprender uma dúzia de moldes cobre a maior parte da
          viagem.
        </AppText>
        <ChipRow options={FRAME_OPTIONS} value={frameId} onChange={(id) => { setFrameId(id); setWordJp(null); }} />
        <AppText variant="caption" color="muted">
          {frame.use}
        </AppText>
      </Card>

      <Card>
        <AppText variant="caption" color="muted">
          {frame.slotLabel.toUpperCase()}
        </AppText>
        <ChipRow options={frame.words.map((w) => ({ value: w.jp, label: w.jp }))} value={word.jp} onChange={setWordJp} />
        <View style={styles.result}>
          {blocks ? <BlockRow blocks={blocks} /> : <AppText style={styles.big}>{filled.jp}</AppText>}
          <RomajiLine text={filled.romaji} />
          <AppText>
            <Bold>{filled.pt}</Bold>
          </AppText>
          <AppText variant="caption" color="muted">
            {word.jp} = {word.pt}
          </AppText>
          <ConfidenceNote jp={filled.jp} />
        </View>
        <Button label="🔊 Ouvir" variant="soft" onPress={() => speakJapanese(spoken(filled.jp), SPEECH_RATES[speed])} />
      </Card>
    </View>
  );
}

interface Challenge {
  frame: Frame;
  word: SlotWord;
  options: readonly string[];
  right: string;
  pt: string;
}

const ROUND = 8;

function buildChallenges(): Challenge[] {
  const out: Challenge[] = [];
  const frames = shuffle(FRAMES);
  for (let i = 0; out.length < ROUND && i < ROUND * 3; i++) {
    const frame = frames[i % frames.length]!;
    const [word, ...others] = shuffle(frame.words);
    if (!word) continue;
    const filled = fillFrame(frame, word);
    const wrong = others.slice(0, 3).map((o) => fillFrame(frame, o).jp);
    if (wrong.length < 3 || out.some((c) => c.right === filled.jp)) continue;
    out.push({ frame, word, right: filled.jp, pt: filled.pt, options: shuffle([filled.jp, ...wrong]) });
  }
  return out;
}

function ChallengeView() {
  const recordDrill = useProgressStore((s) => s.recordDrill);
  const speed = useSettingsStore((s) => s.speechSpeed);
  const [items, setItems] = useState(buildChallenges);
  const [step, setStep] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const item = items[step];

  if (!item) {
    const pct = items.length ? Math.round((score / items.length) * 100) : 0;
    return (
      <Card enterIndex={0}>
        <AppText variant="title">Rodada feita</AppText>
        <AppText>
          {score} de {items.length} ({pct}%).
        </AppText>
        <Button
          label="Outra rodada"
          onPress={() => {
            setItems(buildChallenges());
            setStep(0);
            setChosen(null);
            setScore(0);
          }}
        />
        {pct >= 70 ? <PetalRain /> : null}
      </Card>
    );
  }

  const stateOf = (jp: string): OptionState => {
    if (chosen === null) return 'idle';
    if (jp === item.right) return 'right';
    return jp === chosen ? 'wrong' : 'dim';
  };
  const pick = (jp: string) => {
    if (chosen !== null) return;
    setChosen(jp);
    const ok = jp === item.right;
    recordDrill(ok, 'drill');
    if (ok) {
      setScore((n) => n + 1);
      feedbackCorrect();
    } else feedbackWrong();
    speakJapanese(spoken(item.right), SPEECH_RATES[speed]);
  };
  const next = () => {
    if (step + 1 >= items.length) feedbackComplete(score === items.length);
    setStep((s) => s + 1);
    setChosen(null);
  };

  return (
    <View style={styles.root}>
      <AppText variant="caption" color="muted">
        {step + 1} de {items.length}
      </AppText>
      <Card>
        <AppText variant="caption" color="muted">
          COMO SE DIZ?
        </AppText>
        <AppText variant="title">{item.pt}</AppText>
        <AppText variant="caption" color="muted">
          Molde: {item.frame.title}
        </AppText>
      </Card>
      <View style={styles.options}>
        {item.options.map((jp, i) => (
          <OptionButton key={jp} index={i} label={jp} glyph={false} state={stateOf(jp)} onPress={() => pick(jp)} />
        ))}
      </View>
      {chosen !== null ? <Button label={step + 1 >= items.length ? 'Ver o resultado' : 'Próxima'} onPress={next} /> : null}
    </View>
  );
}

/** Fábrica de frases: moldes com uma lacuna para montar muitas frases de viagem, e um desafio de escolher a frase certa. */
export function FramesView() {
  const [mode, setMode] = useState<Mode>('make');
  return (
    <View style={styles.root}>
      <ChipRow options={MODES} value={mode} onChange={setMode} />
      {mode === 'make' ? <MakeView /> : <ChallengeView />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.md },
  result: { gap: spacing.sm, paddingVertical: spacing.sm },
  big: { fontSize: 24, lineHeight: 34 },
  options: { gap: spacing.sm },
});
