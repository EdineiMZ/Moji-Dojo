import { useMemo, useState } from 'react';
import { ChipRow, SwapView } from '@/components';
import { useAiStore, useProgressStore, useSettingsStore } from '@/store';
import { AiPhrasesCard } from './AiPhrasesCard';
import { ConversionSession } from './ConversionSession';
import { FreeTyping } from './FreeTyping';
import { KeyHeatmap } from './KeyHeatmap';
import { SERIES, type ExtraPhrase, type SeriesKind } from './practice';
import { TrainSession } from './TrainSession';

type Mode = 'level' | 'weak' | 'series' | 'ai' | 'convert' | 'free' | 'stats';

const MODES = [
  { value: 'level' as const, label: 'Níveis' },
  { value: 'weak' as const, label: 'Pontos fracos' },
  { value: 'series' as const, label: 'Séries' },
  { value: 'ai' as const, label: '✨ IA' },
  { value: 'convert' as const, label: 'Conversão' },
  { value: 'free' as const, label: 'Livre' },
  { value: 'stats' as const, label: 'Desempenho' },
];

/**
 * Simulador do teclado de flick: treino por níveis (palavras e frases do próprio app e as suas), foco nas letras fracas, séries de pontuação e números,
 * a barra de conversão para kanji, digitação livre e o mapa de desempenho por tecla.
 */
export function SimulatorView() {
  const [mode, setMode] = useState<Mode>('level');
  const [series, setSeries] = useState<SeriesKind>('punct');
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
        {shown === 'series' ? (
          <>
            <ChipRow options={SERIES.map((s) => ({ value: s.id, label: s.title }))} value={series} onChange={setSeries} />
            <TrainSession key={series} mode="series" series={series} extras={extras} />
          </>
        ) : null}
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
