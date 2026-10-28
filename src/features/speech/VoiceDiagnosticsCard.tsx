import { useEffect, useState } from 'react';
import { AppText, Button, Card } from '@/components';
import { describeProbe, PROBE_RATES, PROBE_TEXTS, probeSpeech, type ProbeResult } from './speechProbe';
import { ensureVoiceChecked, recentSpeech, useVoiceStore } from './voiceStore';

/** Ajustes → Avançado: a voz que o aparelho usa (nome técnico) e o teste que fala cada texto direto na voz do Android. */
export function VoiceDiagnosticsCard() {
  const voice = useVoiceStore((s) => s.voice);
  const status = useVoiceStore((s) => s.status);
  useEffect(ensureVoiceChecked, []);

  const [probing, setProbing] = useState(false);
  const [results, setResults] = useState<ProbeResult[]>([]);
  const [log, setLog] = useState(recentSpeech());

  /** Fala cada texto de teste, sem os reforços do app, e mostra o que a voz do aparelho fez. */
  const runProbe = async () => {
    setProbing(true);
    setResults([]);
    for (const rate of PROBE_RATES) {
      for (const text of PROBE_TEXTS) {
        const result = await probeSpeech(text, rate);
        setResults((list) => [...list, result]);
      }
    }
    setLog(recentSpeech());
    setProbing(false);
  };

  return (
    <Card enterIndex={0}>
      <AppText variant="title">Diagnóstico de som</AppText>
      <AppText variant="caption" color="muted">
        Voz do aparelho em uso: {status === 'available' ? (voice?.name ?? 'sem nome') : 'nenhuma voz japonesa encontrada'}
      </AppText>
      <AppText variant="caption" color="muted">
        Fala 8 textos, do mais curto à frase, em velocidade normal e devagar, direto na voz do aparelho. Ouça e confira: “✗” indica fala que não saiu. Se algum texto ficar mudo, a lista abaixo ajuda a descobrir qual.
      </AppText>
      <Button label={probing ? 'Testando…' : 'Rodar o teste de som'} variant="soft" disabled={probing} onPress={() => void runProbe()} />
      {results.map((r, i) => (
        <AppText key={`${r.rate}-${r.text}-${i}`} variant="caption">
          {r.rate === 0.9 ? 'normal' : 'devagar'} · {r.text}: {describeProbe(r)}
        </AppText>
      ))}
      {log.length > 0 ? (
        <>
          <AppText variant="caption" color="muted">
            ÚLTIMAS FALAS DO APP
          </AppText>
          {log.slice(0, 8).map((entry, i) => (
            <AppText key={`${entry.text}-${i}`} variant="caption">
              {entry.text.slice(0, 18)}: {entry.note}
            </AppText>
          ))}
        </>
      ) : null}
    </Card>
  );
}
