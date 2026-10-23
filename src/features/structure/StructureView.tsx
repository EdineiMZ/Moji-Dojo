import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Bold, Button, Card, ChipRow, PetalRain } from '@/components';
import { ALL_TRAVEL } from '@/content/travel';
import type { TravelPhrase } from '@/data/types';
import { OptionButton, type OptionState } from '@/features/quiz/OptionButton';
import { shuffle } from '@/features/quiz/quiz';
import { RomajiLine } from '@/features/phrases/RomajiLine';
import { speakJapanese } from '@/features/speech/voiceStore';
import { feedbackComplete, feedbackCorrect, feedbackWrong } from '@/lib/feedback';
import { useProgressStore, useSettingsStore } from '@/store';
import { SPEECH_RATES } from '@/store/settingsStore';
import { fonts, radii, spacing, useTheme } from '@/theme';
import { anatomizePhrase, ROLES, type Block, type BlockRole } from './anatomy';
import { BlockRow, tintOf } from './BlockRow';

type Mode = 'explore' | 'train';

const MODES = [
  { value: 'explore' as const, label: 'Ver por dentro' },
  { value: 'train' as const, label: 'Qual é o papel?' },
];

/** O esqueleto da frase japonesa, para o aluno ter o mapa na cabeça antes de ver os exemplos. */
function SkeletonCard() {
  const { colors } = useTheme();
  const pieces: { text: string; role: BlockRole }[] = [
    { text: 'わたしは', role: 'topic' },
    { text: 'きのう', role: 'detail' },
    { text: 'えきで', role: 'place' },
    { text: 'ともだちに', role: 'target' },
    { text: 'ほんを', role: 'object' },
    { text: 'あげました', role: 'predicate' },
  ];
  return (
    <Card enterIndex={0}>
      <AppText variant="title">O mapa da frase japonesa</AppText>
      <AppText>
        O japonês monta a frase em <Bold>blocos</Bold>. Cada bloco é uma palavra com uma partícula colada depois, que diz o papel dela. O{' '}
        <Bold>verbo vem sempre por último</Bold>.
      </AppText>
      <View style={styles.blocks}>
        {pieces.map((p) => (
          <View key={p.text} style={[styles.block, { backgroundColor: tintOf(p.role, colors), borderColor: colors.line }]}>
            <AppText style={[styles.blockText, p.role === 'predicate' && { color: colors.onPrimary }]}>{p.text}</AppText>
            <AppText variant="caption" style={p.role === 'predicate' ? { color: colors.onPrimary } : { color: colors.muted }}>
              {ROLES[p.role].label.split(' ')[0]}
            </AppText>
          </View>
        ))}
      </View>
      <AppText variant="caption" color="muted">
        Eu, ontem, na estação, ao amigo, o livro, dei. A ordem dos blocos do meio muda à vontade, porque as partículas é que dizem quem é
        quem. O que não muda: o verbo no fim.
      </AppText>
      <AppText>
        <Bold>1.</Bold> A partícula vem depois da palavra, como uma etiqueta. <Bold>2.</Bold> Pergunta: coloque <Bold>か</Bold> no fim, sem
        mudar a ordem. <Bold>3.</Bold> O que é óbvio some: “Estou com fome” não precisa de “eu”.
      </AppText>
    </Card>
  );
}

/** Uma frase aberta em blocos coloridos: tocar num bloco mostra o papel dele. */
function SentenceBlocks({ phrase, blocks }: { phrase: TravelPhrase; blocks: readonly Block[] }) {
  const { colors } = useTheme();
  const speed = useSettingsStore((s) => s.speechSpeed);
  const [picked, setPicked] = useState<number | null>(null);
  const block = picked === null ? null : blocks[picked];
  return (
    <Card style={styles.sentence}>
      <BlockRow blocks={blocks} selected={picked} onPick={setPicked} />
      <RomajiLine text={phrase.romaji} />
      <AppText color="muted">{phrase.pt}</AppText>
      {block ? (
        <View style={[styles.explain, { backgroundColor: colors.background, borderColor: colors.line }]}>
          <AppText>
            <Bold>{block.text}</Bold> · {ROLES[block.role].label}
          </AppText>
          <AppText variant="caption" color="muted">
            {ROLES[block.role].explain}
          </AppText>
        </View>
      ) : (
        <AppText variant="caption" color="muted">
          Toque num bloco para ver o que ele faz.
        </AppText>
      )}
      <Button label="🔊 Ouvir" variant="soft" onPress={() => speakJapanese(phrase.jp.replace(/ /g, ''), SPEECH_RATES[speed])} />
    </Card>
  );
}

const withBlocks = ALL_TRAVEL.map((category) => ({
  category: category.category,
  phrases: category.phrases.flatMap((phrase) => {
    const blocks = anatomizePhrase(phrase);
    return blocks && blocks.length >= 2 ? [{ phrase, blocks }] : [];
  }),
})).filter((c) => c.phrases.length > 0);

function ExploreView() {
  const [category, setCategory] = useState(withBlocks[0]?.category ?? '');
  const current = withBlocks.find((c) => c.category === category) ?? withBlocks[0];
  return (
    <View style={styles.root}>
      <SkeletonCard />
      <AppText variant="caption" color="muted">
        VEJA POR DENTRO AS FRASES DE VIAGEM E DIA A DIA
      </AppText>
      <ChipRow options={withBlocks.map((c) => ({ value: c.category, label: c.category }))} value={category} onChange={setCategory} />
      <View key={category} style={styles.root}>
        {current?.phrases.map(({ phrase, blocks }) => (
          <SentenceBlocks key={phrase.jp} phrase={phrase} blocks={blocks} />
        ))}
      </View>
    </View>
  );
}

interface RoleQuestion {
  phrase: TravelPhrase;
  blocks: readonly Block[];
  /** Posição do bloco em pergunta. */
  at: number;
  options: readonly BlockRole[];
}

const TRAIN_ROLES: readonly BlockRole[] = ['topic', 'subject', 'object', 'target', 'place', 'direction', 'possessor', 'with', 'from', 'until'];
const TRAIN_ROUND = 8;

function buildRound(): RoleQuestion[] {
  const pool = shuffle(withBlocks.flatMap((c) => c.phrases));
  const questions: RoleQuestion[] = [];
  for (const { phrase, blocks } of pool) {
    const candidates = blocks.flatMap((b, i) => (TRAIN_ROLES.includes(b.role) ? [i] : []));
    if (candidates.length === 0) continue;
    const at = shuffle(candidates)[0]!;
    const right = blocks[at]!.role;
    const wrong = shuffle(TRAIN_ROLES.filter((r) => r !== right)).slice(0, 3);
    questions.push({ phrase, blocks, at, options: shuffle([right, ...wrong]) });
    if (questions.length >= TRAIN_ROUND) break;
  }
  return questions;
}

function TrainView() {
  const recordDrill = useProgressStore((s) => s.recordDrill);
  const [questions, setQuestions] = useState(buildRound);
  const [step, setStep] = useState(0);
  const [chosen, setChosen] = useState<BlockRole | null>(null);
  const [right, setRight] = useState(0);
  const done = step >= questions.length;
  const question = questions[step];

  const restart = () => {
    setQuestions(buildRound());
    setStep(0);
    setChosen(null);
    setRight(0);
  };

  if (done || !question) {
    const pct = questions.length ? Math.round((right / questions.length) * 100) : 0;
    return (
      <Card enterIndex={0}>
        <AppText variant="title">Rodada feita</AppText>
        <AppText>
          {right} de {questions.length} ({pct}%).
        </AppText>
        <Button label="Outra rodada" onPress={restart} />
        {pct >= 70 ? <PetalRain /> : null}
      </Card>
    );
  }

  const block = question.blocks[question.at]!;
  const correct = block.role;
  const stateOf = (role: BlockRole): OptionState => {
    if (chosen === null) return 'idle';
    if (role === correct) return 'right';
    return role === chosen ? 'wrong' : 'dim';
  };
  const pick = (role: BlockRole) => {
    if (chosen !== null) return;
    setChosen(role);
    const ok = role === correct;
    recordDrill(ok, 'drill');
    if (ok) {
      setRight((n) => n + 1);
      feedbackCorrect();
    } else feedbackWrong();
  };
  const next = () => {
    if (step + 1 >= questions.length) feedbackComplete(right === questions.length);
    setStep((s) => s + 1);
    setChosen(null);
  };

  return (
    <View style={styles.root}>
      <AppText variant="caption" color="muted">
        {step + 1} de {questions.length}
      </AppText>
      <Card>
        <AppText color="muted">{question.phrase.pt}</AppText>
        <BlockRow blocks={question.blocks} selected={question.at} labels={false} />
        <AppText>
          Qual é o papel de <Bold>{block.text}</Bold> na frase?
        </AppText>
      </Card>
      <View style={styles.options}>
        {question.options.map((role, i) => (
          <OptionButton key={role} index={i} label={ROLES[role].label} glyph={false} state={stateOf(role)} onPress={() => pick(role)} />
        ))}
      </View>
      {chosen !== null ? (
        <Card>
          <AppText color={chosen === correct ? 'ok' : 'bad'}>
            {chosen === correct ? 'Isso mesmo.' : `Era ${ROLES[correct].label}.`}
          </AppText>
          <AppText variant="caption" color="muted">
            {ROLES[correct].explain}
          </AppText>
          <Button label={step + 1 >= questions.length ? 'Ver o resultado' : 'Próxima'} onPress={next} />
        </Card>
      ) : null}
    </View>
  );
}

/** Estrutura da frase: o mapa dos blocos, as frases de viagem abertas em papéis e um treino para reconhecê-los. */
export function StructureView() {
  const [mode, setMode] = useState<Mode>('explore');
  const content = useMemo(() => (mode === 'explore' ? <ExploreView /> : <TrainView />), [mode]);
  return (
    <View style={styles.root}>
      <ChipRow options={MODES} value={mode} onChange={setMode} />
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.md },
  sentence: { gap: spacing.sm },
  blocks: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  block: { borderRadius: radii.md, borderWidth: 1.5, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, alignItems: 'center', gap: 2 },
  blockText: { fontFamily: fonts.bold, fontSize: 20, lineHeight: 28 },
  explain: { borderRadius: radii.md, borderWidth: 1.5, padding: spacing.md, gap: spacing.xs },
  options: { gap: spacing.sm },
});
