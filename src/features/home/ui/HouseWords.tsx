import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card } from '@/components';
import type { VocabWord } from '@/content';
import { cardKey } from '@/features/vocab/cards';
import { speakJapanese } from '@/features/speech/voiceStore';
import { kanaToRomaji } from '@/lib/romaji';
import { useProgressStore, useSettingsStore } from '@/store';
import { SPEECH_RATES } from '@/store/settingsStore';
import { fonts, spacing, useTheme } from '@/theme';
import { houseQuestion, visitQuestions, type HouseQuestion } from '../words';

/** A palavra com o japonês grande, como se lê, o romaji (conforme os Ajustes) e o botão de ouvir. */
export function WordHeader({ word }: { word: VocabWord }) {
  const speed = useSettingsStore((s) => s.speechSpeed);
  const romajiMode = useSettingsStore((s) => s.romajiMode);
  const said = () => speakJapanese(word.reading, SPEECH_RATES[speed]);
  return (
    <View style={styles.header}>
      <AppText style={styles.glyph}>{word.jp}</AppText>
      {word.reading !== word.jp ? <AppText color="muted">{word.reading}</AppText> : null}
      {romajiMode === 'always' ? <AppText color="muted">{kanaToRomaji(word.reading)}</AppText> : null}
      <Button label="🔊 Ouvir" variant="soft" onPress={said} />
    </View>
  );
}

/** As alternativas de uma pergunta; ao tocar numa, quem chamou sabe se era a certa. */
function Options({ question, disabled, onPick }: { question: HouseQuestion; disabled: ReadonlySet<number>; onPick: (index: number) => void }) {
  return (
    <View style={styles.options}>
      {question.options.map((text, i) => (
        <Button key={`${i}-${text}`} label={text} variant="soft" disabled={disabled.has(i)} onPress={() => onPick(i)} />
      ))}
    </View>
  );
}

/**
 * Para colocar uma peça na casa, a pessoa aprende a palavra dela: ouve, lê e escolhe o significado. Errar só deixa tentar de
 * novo (sem castigo); acertar conclui a compra, e a palavra vai para as revisões.
 */
export function WordChallenge({ word, name, onDone, onCancel }: { word: VocabWord; name: string; onDone: () => void; onCancel: () => void }) {
  const question = useMemo(() => houseQuestion(word, 'jm'), [word]);
  const [wrong, setWrong] = useState<ReadonlySet<number>>(new Set());
  const [hint, setHint] = useState<string | null>(null);

  const pick = (index: number) => {
    if (index === question.answer) {
      onDone();
      return;
    }
    setWrong((current) => new Set(current).add(index));
    setHint('Quase! Ouça de novo e tente outra.');
  };

  return (
    <Card enterIndex={0} style={styles.card}>
      <AppText variant="title" center>
        A palavra de {name}
      </AppText>
      <AppText color="muted" center>
        Aprenda esta palavra para colocar na casa. O que ela quer dizer?
      </AppText>
      <WordHeader word={word} />
      <Options question={question} disabled={wrong} onPick={pick} />
      {hint ? (
        <AppText color="warn" center accessibilityLiveRegion="polite">
          {hint}
        </AppText>
      ) : null}
      <Button label="Voltar" variant="ghost" onPress={onCancel} />
    </Card>
  );
}

const ROUND = 5;

/** A visita guiada: o Mochi pergunta as palavras da casa, e cada resposta vale como uma revisão de vocabulário. */
export function VisitView({ owned, onExit }: { owned: readonly VocabWord[]; onExit: () => void }) {
  const { colors } = useTheme();
  const record = useProgressStore((s) => s.recordVocabAnswer);
  const questions = useMemo(() => visitQuestions(owned, ROUND), [owned]);
  const [index, setIndex] = useState(0);
  const [wrong, setWrong] = useState<ReadonlySet<number>>(new Set());
  const [hits, setHits] = useState(0);
  const [first, setFirst] = useState(true);

  const question = questions[index];
  if (!question) {
    return (
      <Card enterIndex={0} style={styles.card}>
        <AppText variant="title" center>
          Visita terminada
        </AppText>
        <AppText center>
          Você acertou de primeira {hits} de {questions.length}. As palavras que errou voltam na revisão.
        </AppText>
        <Button label="Voltar para a casa" onPress={onExit} />
      </Card>
    );
  }

  const pick = (i: number) => {
    const ok = i === question.answer;
    // Só a primeira resposta vale para a revisão (como nas outras revisões de vocabulário); errar deixa tentar de novo.
    if (first) {
      record(cardKey(question.word.id, question.dir), ok, true);
      if (ok) setHits((n) => n + 1);
    }
    if (!ok) {
      setWrong((current) => new Set(current).add(i));
      setFirst(false);
      return;
    }
    setWrong(new Set());
    setFirst(true);
    setIndex((n) => n + 1);
  };

  return (
    <Card enterIndex={0} style={styles.card}>
      <AppText variant="caption" color="muted" center>
        Visita guiada · {index + 1} de {questions.length}
      </AppText>
      {question.dir === 'jm' ? (
        <>
          <AppText center>O que quer dizer?</AppText>
          <WordHeader word={question.word} />
        </>
      ) : (
        <>
          <AppText center>Qual é a palavra para</AppText>
          <AppText variant="title" center style={{ color: colors.ink }}>
            {question.word.meaning}
          </AppText>
        </>
      )}
      <Options question={question} disabled={wrong} onPick={pick} />
      <Button label="Sair da visita" variant="ghost" onPress={onExit} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  header: { alignItems: 'center', gap: spacing.xs },
  glyph: { fontFamily: fonts.bold, fontSize: 48, lineHeight: 60 },
  options: { gap: spacing.sm },
});
