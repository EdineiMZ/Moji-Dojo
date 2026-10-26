import { useMemo, useState } from 'react';
import { ChipRow, SwapView } from '@/components';
import { useAiStore, useProgressStore, useSettingsStore } from '@/store';
import { AiPhrasesCard } from './AiPhrasesCard';
import { ConversionSession } from './ConversionSession';
import { FreeTyping } from './FreeTyping';
import { KeyHeatmap } from './KeyHeatmap';
import type { ExtraPhrase } from './practice';
import { TrainSession } from './TrainSession';

type Mode = 'level' | 'weak' | 'ai' | 'convert' | 'free' | 'stats';

const MODES = [
  { value: 'level' as const, label: 'Níveis' },
  { value: 'weak' as const, label: 'Pontos fracos' },
  { value: 'ai' as const, label: '✨ IA' },
  { value: 'convert' as const, label: 'Conversão' },
  { value: 'free' as const, label: 'Livre' },
  { value: 'stats' as const, label: 'Desempenho' },
];

/**
 * Simulador do teclado de flick: treino por níveis (palavras e frases do próprio app e as suas), foco nas letras fracas,
 * a barra de conversão para kanji, digitação livre e o mapa de desempenho por tecla.
 */
export function SimulatorView() {
  const [mode, setMode] = useState<Mode>('level');
  const myPhrases = useProgressStore((s) => s.myPhrases);
  const aiPhrases = useAiStore((s) => s.phrases);
  const aiEnabled = useSettingsStore((s) => s.ai.enabled);
  const extras = useMemo<ExtraPhrase[]>(
    () => [
      ...Object.values(myPhrases).map((p) => ({ jp: p.jp, pt: p.pt, source: 'mine' as const })),
      ...aiPhrases.map((p) => ({ jp: p.jp, pt: p.pt, source: 'ai' as const })),
    ],
    [myPhrases, aiPhrases],
  );
  const modes = aiEnabled ? MODES : MODES.filter((m) => m.value !== 'ai');
  const shown: Mode = !aiEnabled && mode === 'ai' ? 'level' : mode;

  return (
    <>
      <ChipRow options={modes} value={shown} onChange={setMode} />
      <SwapView viewKey={shown}>
        {shown === 'level' ? <TrainSession mode="level" extras={extras} /> : null}
        {shown === 'weak' ? <TrainSession mode="weak" extras={extras} /> : null}
        {shown === 'ai' ? (
          <>
            <AiPhrasesCard />
            {aiPhrases.length > 0 ? <TrainSession mode="ai" extras={extras} /> : null}
          </>
        ) : null}
        {shown === 'convert' ? <ConversionSession /> : null}
        {shown === 'free' ? <FreeTyping /> : null}
        {shown === 'stats' ? <KeyHeatmap /> : null}
      </SwapView>
    </>
  );
}
