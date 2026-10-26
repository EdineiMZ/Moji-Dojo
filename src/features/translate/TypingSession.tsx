import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card, Mascot, PetalRain, ProgressBar } from '@/components';
import { resultMood } from '@/features/lessons/resultCopy';
import { ResultCard } from '@/features/quiz/ResultCard';
import { REVIEW_GOOD_PCT } from '@/features/review/session';
import { speakJapanese } from '@/features/speech/voiceStore';
import { AiExplain } from '@/features/ai/AiParts';
import { feedbackComplete, feedbackCorrect, feedbackWrong } from '@/lib/feedback';
import { useSettingsStore } from '@/store';
import { SPEECH_RATES } from '@/store/settingsStore';
import { fonts, radii, spacing, useTheme } from '@/theme';
import { checkAnswer, type AnswerCheck } from './check';
import { JapaneseInput } from './JapaneseInput';

/** Uma frase para escrever: o que aparece em português e o que vale como resposta. */
export interface TypingTarget {
  id: string;
  /** O que a pessoa lê e traduz. */
  prompt: string;
  accepted: readonly string[];
  /** A resposta como o app a escreve (kana com espaços). */
  answer: string;
  romaji?: string;
  /** A regra, mostrada ao errar. */
  hint?: string;
  /**
   * Ditado: o que a voz fala. Com isto, a pessoa ouve a frase em vez de ler `prompt`, que só aparece (como o sentido) depois
   * de conferir.
   */
  speak?: string;
}

interface TypingSessionProps {
  items: readonly TypingTarget[];
  title: string;
  /** Chamado uma vez por frase, na primeira conferência (ou ao desistir): `ok` = acertou de primeira. */
  onResult: (item: TypingTarget, ok: boolean) => void;
  onExit: () => void;
  /** Texto do botão que reinicia com outras frases (se houver). */
  again?: { label: string; onPress: () => void };
}

type Stage = 'typing' | 'wrong' | 'right' | 'revealed';

/**
 * Rodada de escrever frases: vê a tradução, digita o japonês e confere de forma tolerante (kana ou kanji, espaços,
 * pontuação). Errar mostra o que sobrou e a resposta; dá para tentar de novo ou desistir e ver a resposta.
 */
export function TypingSession({ items, title, onResult, onExit, again }: TypingSessionProps) {
  const { colors } = useTheme();
  const speed = useSettingsStore((s) => s.speechSpeed);
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [stage, setStage] = useState<Stage>('typing');
  const [check, setCheck] = useState<AnswerCheck | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [firstTry, setFirstTry] = useState(0);
  const [done, setDone] = useState(false);
  // Se já contou o resultado desta frase (a primeira conferência ou a desistência), e as que errou de primeira.
  const reported = useRef(false);
  const [missed, setMissed] = useState<readonly string[]>([]);

  // Ditado: a frase toca sozinha quando aparece.
  const current = items[index];
  useEffect(() => {
    if (current?.speak) speakJapanese(current.speak, SPEECH_RATES[speed]);
  }, [current, speed]);

  const item = items[index];
  if (!item) return null;

  const report = (ok: boolean) => {
    if (reported.current) return;
    reported.current = true;
    onResult(item, ok);
    if (ok) setFirstTry((n) => n + 1);
    else setMissed((list) => [...list, `${item.answer} = ${item.prompt}`]);
  };

  const confirm = () => {
    const result = checkAnswer(text, item.accepted);
    if (result.verdict === 'empty') {
      setNotice('Digite a frase primeiro.');
      return;
    }
    setNotice(null);
    setCheck(result);
    if (result.verdict === 'ok') {
      feedbackCorrect();
      report(true);
      setStage('right');
    } else {
      feedbackWrong();
      report(false);
      setStage('wrong');
    }
  };

  const giveUp = () => {
    report(false);
    setCheck(null);
    setStage('revealed');
  };

  const retry = () => {
    setText('');
    setCheck(null);
    setStage('typing');
  };

  const next = () => {
    if (index + 1 >= items.length) {
      if ((firstTry / items.length) * 100 >= REVIEW_GOOD_PCT) feedbackComplete(firstTry === items.length);
      setDone(true);
      return;
    }
    reported.current = false;
    setIndex(index + 1);
    setText('');
    setCheck(null);
    setNotice(null);
    setStage('typing');
  };

  if (done) {
    const pct = Math.round((firstTry / items.length) * 100);
    const good = pct >= REVIEW_GOOD_PCT;
    return (
      <>
        <ResultCard
          label={title}
          heading="Rodada feita"
          pct={pct}
          firstTry={firstTry}
          total={items.length}
          wrong={missed}
          wrongLabel="Para ficar de olho:"
          wrongText={(line) => line}
          passed={good}
          mood={resultMood(good, pct)}
        >
          <View style={styles.actions}>
            {again ? <Button label={again.label} onPress={again.onPress} /> : null}
            <Button label="Voltar" variant={again ? 'soft' : 'primary'} onPress={onExit} />
          </View>
        </ResultCard>
        {good ? <PetalRain /> : null}
      </>
    );
  }

  const showAnswer = stage !== 'typing';
  const mood = stage === 'right' ? 'happy' : stage === 'wrong' || stage === 'revealed' ? 'sad' : 'neutral';

  return (
    <View style={styles.root}>
      <View style={styles.top}>
        <View style={styles.flex}>
          <AppText variant="caption" color="muted">
            {title}
          </AppText>
          <ProgressBar value={index / items.length} style={styles.bar} />
          <AppText variant="caption" color="muted">
            {index + 1} de {items.length}
          </AppText>
        </View>
        <Mascot mood={mood} size={72} />
      </View>

      <Card>
        {item.speak ? (
          <>
            <AppText variant="caption" color="muted">
              OUÇA E ESCREVA O QUE OUVIU
            </AppText>
            <View style={styles.row}>
              <Button label="🔊 Ouvir" style={styles.flex} onPress={() => speakJapanese(item.speak as string, SPEECH_RATES[speed])} />
              <Button label="🐢 Devagar" variant="soft" style={styles.flex} onPress={() => speakJapanese(item.speak as string, SPEECH_RATES.slow)} />
            </View>
            {showAnswer ? (
              <AppText color="muted">
                Quer dizer: {item.prompt}
              </AppText>
            ) : null}
          </>
        ) : (
          <>
            <AppText variant="caption" color="muted">
              ESCREVA EM JAPONÊS
            </AppText>
            <AppText variant="title">{item.prompt}</AppText>
          </>
        )}
      </Card>

      <JapaneseInput value={text} onChange={setText} onSubmit={confirm} disabled={stage !== 'typing'} />

      {notice ? (
        <AppText color="bad" accessibilityLiveRegion="polite">
          {notice}
        </AppText>
      ) : null}

      {stage === 'typing' ? (
        <>
          <Button label="Conferir" silent onPress={confirm} />
          <Button label="Não sei, mostrar a resposta" variant="ghost" onPress={giveUp} />
        </>
      ) : null}

      {showAnswer ? (
        <View
          accessibilityLiveRegion="polite"
          style={[styles.feedback, { backgroundColor: stage === 'right' ? colors.okSoft : colors.badSoft }]}
        >
          {stage === 'right' ? (
            <AppText color="ok">Certo! {item.answer}</AppText>
          ) : (
            <>
              {check && check.verdict !== 'empty' ? (
                <AppText color="bad">
                  {check.verdict === 'close' ? 'Quase! ' : 'Não foi dessa vez. '}
                  {check.pieces.length > 0 ? 'Você escreveu: ' : ''}
                  {check.pieces.map((p, i) => (
                    <AppText
                      key={i}
                      color={p.kind === 'ok' ? 'ink' : 'bad'}
                      style={{ fontFamily: fonts.bold, textDecorationLine: p.kind === 'extra' ? 'line-through' : 'none' }}
                    >
                      {p.text}
                    </AppText>
                  ))}
                </AppText>
              ) : null}
              <AppText>
                Resposta: <AppText style={{ fontFamily: fonts.bold }}>{item.answer}</AppText>
              </AppText>
              {check?.tip ? (
                <AppText variant="caption" color="muted">
                  {check.tip}
                </AppText>
              ) : null}
            </>
          )}
          {item.romaji ? (
            <AppText variant="caption" color="muted">
              {item.romaji}
            </AppText>
          ) : null}
          {stage !== 'right' && item.hint ? (
            <AppText variant="caption" color="muted">
              Para lembrar: {item.hint}
            </AppText>
          ) : null}
          {stage !== 'right' ? (
            <AiExplain context={`Exercício de escrita em japonês. Pedido: "${item.prompt}". Resposta certa: ${item.answer.replace(/ /g, '')}.${text ? ` A pessoa escreveu: ${text}.` : ''}${item.hint ? ` Regra do tópico: ${item.hint}.` : ''}`} />
          ) : null}
          <View style={styles.row}>
            <Button
              label="🔊 Ouvir"
              variant="soft"
              style={styles.flex}
              onPress={() => speakJapanese(item.answer.replace(/ /g, ''), SPEECH_RATES[speed])}
            />
            {stage === 'wrong' ? <Button label="Tentar de novo" variant="soft" style={styles.flex} onPress={retry} /> : null}
          </View>
          <Button label={index + 1 >= items.length ? 'Ver o resultado' : 'Continuar'} onPress={next} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.md },
  top: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1 },
  bar: { marginVertical: spacing.xs },
  actions: { alignSelf: 'stretch', gap: spacing.sm },
  feedback: { borderRadius: radii.md, padding: spacing.md, gap: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.sm },
});
