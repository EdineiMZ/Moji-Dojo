import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card, ChipRow, Mascot, ProgressBar } from '@/components';
import { VOCAB, VOCAB_GROUPS, type VocabWord } from '@/content';
import { useNow } from '@/hooks/useNow';
import { plural } from '@/lib/plural';
import { useProgressStore } from '@/store';
import { spacing } from '@/theme';
import { cardKeysFor, dueCards, newWords, NEW_WORDS_BATCH, vocabCounts, VOCAB_REVIEW_BATCH } from './cards';
import { VocabReview } from './VocabReview';
import { WordCard } from './WordCard';

const ALL = 'Todas';

type Mode =
  | { kind: 'home' }
  | { kind: 'learn'; words: readonly VocabWord[] }
  | { kind: 'review'; keys?: readonly string[]; title?: string };

/**
 * Vocabulário: aprende palavras novas aos poucos (5 por vez, por assunto) e revisa os cartões vencidos.
 * Aprender coloca os cartões na revisão já vencidos, então dá para praticar na hora.
 */
export function VocabView() {
  const vocab = useProgressStore((s) => s.vocab);
  const learnWords = useProgressStore((s) => s.learnWords);
  const now = useNow();
  const [mode, setMode] = useState<Mode>({ kind: 'home' });
  const [group, setGroup] = useState(ALL);

  const counts = vocabCounts(vocab, now);
  // Só os assuntos que ainda têm palavras novas, com quantas faltam.
  const groups = useMemo(
    () =>
      VOCAB_GROUPS.map((g) => ({ value: g.id, left: newWords(vocab, g.id).length, label: g.label })).filter((g) => g.left > 0),
    [vocab],
  );
  const options = [
    { value: ALL, label: `Todas (${VOCAB.length - counts.learned})` },
    ...groups.map((g) => ({ value: g.value, label: `${g.label} (${g.left})` })),
  ];
  const selected = options.some((o) => o.value === group) ? group : ALL;

  if (mode.kind === 'learn') {
    const ids = mode.words.map((w) => w.id);
    return (
      <View style={styles.root}>
        <AppText color="muted">
          Leia e ouça cada palavra e tente guardar o som e o significado. Depois você pratica na hora.
        </AppText>
        {mode.words.map((word, i) => (
          <WordCard key={word.id} word={word} enterIndex={i} />
        ))}
        <Button
          label="Praticar essas palavras"
          onPress={() => {
            learnWords(ids);
            setMode({ kind: 'review', keys: mode.words.flatMap(cardKeysFor), title: 'Praticando palavras novas' });
          }}
        />
        <Button label="Cancelar" variant="ghost" onPress={() => setMode({ kind: 'home' })} />
      </View>
    );
  }

  if (mode.kind === 'review') {
    return (
      <VocabReview
        {...(mode.keys ? { keys: mode.keys } : {})}
        {...(mode.title ? { title: mode.title } : {})}
        onExit={() => setMode({ kind: 'home' })}
      />
    );
  }

  const due = dueCards(vocab, now).length;
  const remaining = newWords(vocab, selected === ALL ? undefined : selected);
  return (
    <Card enterIndex={0}>
      <View style={styles.head}>
        <View style={styles.flex}>
          <AppText variant="title">Vocabulário</AppText>
          <AppText color="muted">
            {counts.learned} de {counts.total} palavras aprendidas
          </AppText>
          <ProgressBar value={counts.total ? counts.learned / counts.total : 0} style={styles.bar} />
        </View>
        <Mascot mood={due > 0 ? 'neutral' : 'happy'} size={72} />
      </View>

      {due > 0 ? (
        <Button label={`Revisar agora (${Math.min(due, VOCAB_REVIEW_BATCH)})`} onPress={() => setMode({ kind: 'review' })} />
      ) : (
        <AppText color="muted">
          {counts.learned > 0 ? 'Nenhuma revisão de vocabulário pendente.' : 'Comece aprendendo as primeiras palavras.'}
        </AppText>
      )}
      {due > VOCAB_REVIEW_BATCH ? (
        <AppText variant="caption" color="muted">
          {plural(due, 'cartão vencido', 'cartões vencidos')}: a revisão leva {VOCAB_REVIEW_BATCH} por vez.
        </AppText>
      ) : null}

      {remaining.length > 0 ? (
        <>
          <AppText variant="caption" color="muted">
            ESCOLHA O ASSUNTO
          </AppText>
          <ChipRow options={options} value={selected} onChange={setGroup} />
          <Button
            label={`Aprender ${Math.min(NEW_WORDS_BATCH, remaining.length)} palavras novas`}
            variant={due > 0 ? 'soft' : 'primary'}
            onPress={() => setMode({ kind: 'learn', words: remaining.slice(0, NEW_WORDS_BATCH) })}
          />
        </>
      ) : (
        <AppText color="muted">
          Você já aprendeu todas as palavras disponíveis{selected === ALL ? '' : ' deste assunto'}.
        </AppText>
      )}

      <AppText variant="caption" color="muted">
        Cada palavra vira cartões de revisão: ver o japonês e escolher o significado, o contrário e, nas palavras só de
        kana, ouvir e escolher a palavra. Quanto mais você acerta, mais espaçada fica a revisão.
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.lg },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: spacing.xs },
  bar: { marginTop: spacing.xs },
});
