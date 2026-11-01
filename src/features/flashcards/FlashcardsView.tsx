import { useMemo, useState } from 'react';
import { findItem } from '@/features/catalog';
import { mnemonicFor } from '@/features/quiz/explain';
import { MnemonicNote } from '@/features/quiz/MnemonicNote';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card, ChipRow, Mascot, PressableScale } from '@/components';
import { resultMood } from '@/features/lessons/resultCopy';
import { ResultCard } from '@/features/quiz/ResultCard';
import { REVIEW_GOOD_PCT } from '@/features/review/session';
import { speakJapanese } from '@/features/speech/voiceStore';
import { feedbackCorrect, feedbackWrong } from '@/lib/feedback';
import { useProgressStore, useSettingsStore } from '@/store';
import { SPEECH_RATES } from '@/store/settingsStore';
import { fonts, radii, spacing, useTheme } from '@/theme';
import { AnkiExportCard } from './AnkiExportCard';
import { buildDeck, DECKS, deckCount, DIRECTIONS, ROUND_SIZES, type DeckId, type DeckSources, type Direction, type FlashCard } from './decks';

/** Cartões de estudo: vire o cartão, diga se sabia, e as respostas entram na revisão espaçada (quando o cartão faz parte dela). */
export function FlashcardsView() {
  const [round, setRound] = useState<FlashCard[] | null>(null);
  if (round) return <Session cards={round} onExit={() => setRound(null)} />;
  return (
    <View style={styles.root}>
      <Menu onStart={setRound} />
      <AnkiExportCard />
    </View>
  );
}

function Menu({ onStart }: { onStart: (cards: FlashCard[]) => void }) {
  const vocab = useProgressStore((s) => s.vocab);
  const srs = useProgressStore((s) => s.srs);
  const conj = useProgressStore((s) => s.conj);
  const particles = useProgressStore((s) => s.particles);
  const myPhrases = useProgressStore((s) => s.myPhrases);
  const [deck, setDeck] = useState<DeckId>('words');
  const [direction, setDirection] = useState<Direction>('jp-pt');
  const [size, setSize] = useState(20);
  const sources: DeckSources = useMemo(() => ({ vocab, srs, conj, particles, myPhrases }), [vocab, srs, conj, particles, myPhrases]);
  const counts = useMemo(() => Object.fromEntries(DECKS.map((d) => [d.id, deckCount(d.id, sources)])) as Record<DeckId, number>, [sources]);
  const info = DECKS.find((d) => d.id === deck);
  const usesDirection = deck !== 'kana' && deck !== 'kanji';

  return (
    <Card enterIndex={0}>
      <View style={styles.head}>
        <View style={styles.flex}>
          <AppText variant="title">Cartões</AppText>
          <AppText color="muted">Escolha um baralho, vire o cartão e diga se sabia. Sem pressão: serve para folhear e fixar.</AppText>
        </View>
        <Mascot mood="happy" size={64} />
      </View>
      <ChipRow options={DECKS.map((d) => ({ value: d.id, label: `${d.label} (${counts[d.id]})` }))} value={deck} onChange={setDeck} />
      {info ? <AppText variant="caption" color="muted">{info.hint}</AppText> : null}
      {usesDirection ? (
        <>
          <AppText variant="caption" color="muted">
            DIREÇÃO
          </AppText>
          <ChipRow options={DIRECTIONS} value={direction} onChange={setDirection} />
        </>
      ) : null}
      <AppText variant="caption" color="muted">
        CARTÕES NA RODADA
      </AppText>
      <ChipRow options={ROUND_SIZES.map((n) => ({ value: String(n), label: String(n) }))} value={String(size)} onChange={(v) => setSize(Number(v))} />
      <Button
        label={counts[deck] === 0 ? 'Este baralho está vazio' : 'Começar'}
        disabled={counts[deck] === 0}
        onPress={() => onStart(buildDeck(deck, sources, { direction, size }))}
      />
    </Card>
  );
}

/** A historinha pronta do caractere, se existir (a da pessoa tem prioridade dentro do MnemonicNote). */
function mnemonicProps(char: string): { fallback?: string } {
  const item = findItem(char);
  const hint = item ? mnemonicFor(item) : undefined;
  return hint ? { fallback: hint } : {};
}

function Session({ cards, onExit }: { cards: FlashCard[]; onExit: () => void }) {
  const { colors } = useTheme();
  const speed = useSettingsStore((s) => s.speechSpeed);
  const recordVocabAnswer = useProgressStore((s) => s.recordVocabAnswer);
  const recordReviewAnswer = useProgressStore((s) => s.recordReviewAnswer);
  const learnWords = useProgressStore((s) => s.learnWords);
  const [queue, setQueue] = useState<FlashCard[]>(cards);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [missed, setMissed] = useState<FlashCard[]>([]);
  const [round, setRound] = useState(1);

  const card = queue[index];
  const finished = index >= queue.length;
  const say = (c: FlashCard) => c.say && speakJapanese(c.say.replace(/\s/g, ''), SPEECH_RATES[speed]);

  const answer = (ok: boolean) => {
    if (!card) return;
    const firstTry = round === 1;
    const grade = card.grade;
    if (grade?.kind === 'vocab') {
      // Auto-avaliação vale menos que um quiz: acertar só conta para o agendamento se o cartão já estava vencido; errar sempre conta.
      const entry = useProgressStore.getState().vocab[grade.key];
      if (!ok || (entry && entry.due <= Date.now())) recordVocabAnswer(grade.key, ok, firstTry && ok);
    } else if (grade?.kind === 'kana') {
      recordReviewAnswer(grade.char, ok, firstTry && ok, true);
    } else if (grade?.kind === 'learn' && ok) {
      learnWords([grade.wordId]);
    }
    if (ok) {
      feedbackCorrect();
      setKnown((n) => n + 1);
    } else {
      feedbackWrong();
      setMissed((m) => [...m, card]);
    }
    setFlipped(false);
    setIndex(index + 1);
  };

  if (finished || !card) {
    const total = known + missed.length;
    const pct = total === 0 ? 0 : Math.round((known / total) * 100);
    const good = pct >= REVIEW_GOOD_PCT;
    return (
      <ResultCard
        label="Cartões"
        heading="Rodada feita"
        pct={pct}
        firstTry={known}
        total={total}
        wrong={missed.map((c) => `${c.front} → ${c.back}`)}
        wrongLabel="Para rever:"
        wrongText={(line) => line}
        passed={good}
        mood={resultMood(good, pct)}
      >
        <View style={styles.actions}>
          {missed.length > 0 ? (
            <Button
              label={`Repetir os ${missed.length} que errei`}
              onPress={() => {
                setQueue(missed);
                setMissed([]);
                setKnown(0);
                setIndex(0);
                setFlipped(false);
                setRound((r) => r + 1);
              }}
            />
          ) : null}
          <Button label="Voltar aos baralhos" variant="ghost" onPress={onExit} />
        </View>
      </ResultCard>
    );
  }

  const learning = card.grade?.kind === 'learn';
  return (
    <View style={styles.root}>
      <AppText variant="caption" color="muted">
        Cartão {index + 1} de {queue.length}
      </AppText>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={flipped ? `Verso: ${card.back}. Toque para ver a frente.` : `Frente: ${card.front}. Toque para virar.`}
        onPress={() => setFlipped((f) => !f)}
        style={[styles.card, { backgroundColor: flipped ? colors.skySoft : colors.surface, borderColor: colors.line }]}
      >
        <AppText variant="caption" color="muted">
          {flipped ? 'VERSO' : 'FRENTE'}
        </AppText>
        <AppText center style={styles.big}>
          {flipped ? card.back : card.front}
        </AppText>
        {!flipped && card.frontSub ? (
          <AppText center color="muted">
            {card.frontSub}
          </AppText>
        ) : null}
        {flipped && card.backSub ? (
          <AppText center color="muted">
            {card.backSub}
          </AppText>
        ) : null}
        {!flipped ? (
          <AppText variant="caption" color="muted">
            Toque para virar
          </AppText>
        ) : null}
      </PressableScale>
      {card.say ? <Button label="🔊 Ouvir" variant="soft" onPress={() => say(card)} /> : null}
      {flipped && card.grade?.kind === 'kana' && findItem(card.grade.char) ? (
        <MnemonicNote char={card.grade.char} {...mnemonicProps(card.grade.char)} />
      ) : null}
      {flipped ? (
        <View style={styles.row}>
          <Button label={learning ? 'Pular' : 'Não sabia'} variant="soft" style={styles.flex} onPress={() => answer(false)} />
          <Button label={learning ? 'Quero aprender' : 'Sabia'} style={styles.flex} onPress={() => answer(true)} />
        </View>
      ) : null}
      <Button label="Sair da rodada" variant="ghost" onPress={onExit} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.md },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1 },
  row: { flexDirection: 'row', gap: spacing.sm },
  actions: { alignSelf: 'stretch', gap: spacing.sm },
  card: { borderWidth: 2, borderRadius: radii.lg, minHeight: 240, padding: spacing.lg, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  big: { fontFamily: fonts.bold, fontSize: 34, lineHeight: 44 },
});
