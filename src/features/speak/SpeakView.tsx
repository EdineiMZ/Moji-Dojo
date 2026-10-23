import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import { AppText, Button, Card, Mascot, PetalRain } from '@/components';
import { resultMood } from '@/features/lessons/resultCopy';
import { ResultCard } from '@/features/quiz/ResultCard';
import { REVIEW_GOOD_PCT } from '@/features/review/session';
import { speakJapanese } from '@/features/speech/voiceStore';
import { feedbackCorrect, feedbackWrong } from '@/lib/feedback';
import { useProgressStore, useSettingsStore } from '@/store';
import { SPEECH_RATES } from '@/store/settingsStore';
import { fonts, radii, spacing, useTheme } from '@/theme';
import { isGood, judgeSpoken, pickSpeakItems, SPEAK_ROUND, type SpeakResult } from './speak';
import type { TranslationItem } from '@/features/translate/items';

type Stage = 'ready' | 'listening' | 'done';

/**
 * Falar: aparece o sentido em português, você diz a frase em japonês e o reconhecimento de fala do Android confere com o
 * texto esperado. É aproximado (depende do aparelho, do Google e às vezes da internet): serve de guia, não de nota.
 */
export function SpeakView() {
  const { colors } = useTheme();
  const speed = useSettingsStore((s) => s.speechSpeed);
  const recordDrill = useProgressStore((s) => s.recordDrill);
  const [items, setItems] = useState<TranslationItem[] | null>(null);
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState<Stage>('ready');
  const [result, setResult] = useState<SpeakResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showText, setShowText] = useState(false);
  const [good, setGood] = useState(0);
  const [finished, setFinished] = useState(false);

  const item = items?.[index];

  useSpeechRecognitionEvent('result', (event) => {
    if (!item || !event.isFinal) return;
    const judged = judgeSpoken(
      event.results.map((r) => r.transcript),
      item.accepted,
    );
    setResult(judged);
    setStage('done');
    if (isGood(judged.verdict)) {
      feedbackCorrect();
      setGood((n) => n + 1);
    } else {
      feedbackWrong();
    }
    recordDrill(isGood(judged.verdict), 'speak');
  });
  useSpeechRecognitionEvent('end', () => setStage((s) => (s === 'listening' ? 'ready' : s)));
  useSpeechRecognitionEvent('error', (event) => {
    setStage('ready');
    setError(
      event.error === 'no-speech'
        ? 'Não ouvi nada. Fale perto do microfone e tente de novo.'
        : event.error === 'not-allowed'
          ? 'Sem permissão para o microfone ou para o reconhecimento de fala.'
          : 'O reconhecimento de fala falhou agora. Confira a internet e tente de novo.',
    );
  });

  const begin = () => {
    setItems(pickSpeakItems());
    setIndex(0);
    setGood(0);
    setFinished(false);
    setStage('ready');
    setResult(null);
    setShowText(false);
    setError(null);
  };

  const listen = async () => {
    setError(null);
    setResult(null);
    if (!ExpoSpeechRecognitionModule.isRecognitionAvailable()) {
      setError('Este aparelho não tem reconhecimento de fala disponível (precisa do app Google).');
      return;
    }
    const { granted } = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!granted) {
      setError('Sem permissão para o microfone ou para o reconhecimento de fala.');
      return;
    }
    setStage('listening');
    ExpoSpeechRecognitionModule.start({ lang: 'ja-JP', interimResults: false, maxAlternatives: 5, continuous: false });
  };

  const next = () => {
    if (!items) return;
    if (index + 1 >= items.length) {
      setFinished(true);
      return;
    }
    setIndex(index + 1);
    setStage('ready');
    setResult(null);
    setShowText(false);
    setError(null);
  };

  if (!items) {
    return (
      <Card enterIndex={0}>
        <View style={styles.head}>
          <View style={styles.flex}>
            <AppText variant="title">Falar</AppText>
            <AppText color="muted">Diga a frase em japonês e o app confere.</AppText>
          </View>
          <Mascot mood="neutral" size={72} />
        </View>
        <Button label={`Começar (${SPEAK_ROUND} frases)`} onPress={begin} />
        <AppText variant="caption" color="muted">
          Usa o reconhecimento de fala do Android, que pode precisar de internet e do app Google. O resultado é aproximado:
          o reconhecedor às vezes erra mesmo quando você falou certo, e às vezes aceita uma pronúncia ruim. Use como guia, e
          não como nota. Sua voz é enviada ao serviço de reconhecimento do aparelho; o app não guarda a gravação.
        </AppText>
      </Card>
    );
  }

  if (finished) {
    const pct = Math.round((good / items.length) * 100);
    const passed = pct >= REVIEW_GOOD_PCT;
    return (
      <>
        <ResultCard
          label="Falar"
          heading="Rodada feita"
          pct={pct}
          firstTry={good}
          total={items.length}
          wrong={[]}
          passed={passed}
          mood={resultMood(passed, pct)}
        >
          <View style={styles.actions}>
            <Button label="Outra rodada" onPress={begin} />
            <Button label="Voltar" variant="soft" onPress={() => setItems(null)} />
          </View>
        </ResultCard>
        {passed ? <PetalRain /> : null}
      </>
    );
  }

  if (!item) return null;
  const ok = result ? isGood(result.verdict) : false;

  return (
    <View style={styles.root}>
      <AppText variant="caption" color="muted">
        Frase {index + 1} de {items.length}
      </AppText>
      <Card>
        <AppText variant="caption" color="muted">
          DIGA EM JAPONÊS
        </AppText>
        <AppText variant="title">{item.pt}</AppText>
        {showText ? (
          <>
            <AppText style={styles.jp}>{item.kanji ?? item.jp}</AppText>
            <AppText color="muted">{item.jp}</AppText>
          </>
        ) : (
          <Button label="Ver a frase" variant="ghost" onPress={() => setShowText(true)} />
        )}
        <Button label="🔊 Ouvir o modelo" variant="soft" onPress={() => speakJapanese(item.jp.replace(/ /g, ''), SPEECH_RATES[speed])} />
      </Card>

      {stage !== 'done' ? (
        <Button
          label={stage === 'listening' ? '🎙 Ouvindo... (fale agora)' : '🎙 Falar'}
          disabled={stage === 'listening'}
          onPress={() => void listen()}
        />
      ) : null}
      {stage === 'listening' ? (
        <Button label="Parar" variant="ghost" onPress={() => ExpoSpeechRecognitionModule.stop()} />
      ) : null}

      {error ? (
        <AppText color="bad" accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : null}

      {result ? (
        <View accessibilityLiveRegion="polite" style={[styles.feedback, { backgroundColor: ok ? colors.okSoft : colors.badSoft }]}>
          <AppText color={ok ? 'ok' : 'bad'}>
            {result.verdict === 'ok' ? 'Bateu!' : result.verdict === 'close' ? 'Quase igual.' : 'Não bateu com a frase.'}
          </AppText>
          <AppText>Ouvi: {result.heard || '(nada)'}</AppText>
          <AppText>Esperado: {item.kanji ?? item.jp}</AppText>
          {!ok ? (
            <AppText variant="caption" color="muted">
              O reconhecimento é aproximado: pode ter sido a pronúncia, ou o reconhecedor escrever outra palavra parecida.
              Ouça o modelo, tente de novo ou siga adiante.
            </AppText>
          ) : null}
          <View style={styles.row}>
            {!ok ? <Button label="Tentar de novo" variant="soft" style={styles.flex} onPress={() => { setStage('ready'); setResult(null); }} /> : null}
            <Button label={index + 1 >= items.length ? 'Ver o resultado' : 'Continuar'} style={styles.flex} onPress={next} />
          </View>
        </View>
      ) : stage === 'ready' ? (
        <Button label="Pular esta" variant="ghost" onPress={next} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.md },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1 },
  row: { flexDirection: 'row', gap: spacing.sm },
  actions: { alignSelf: 'stretch', gap: spacing.sm },
  jp: { fontFamily: fonts.bold, fontSize: 24, lineHeight: 32 },
  feedback: { borderRadius: radii.md, padding: spacing.md, gap: spacing.sm },
});
