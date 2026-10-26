import { useMemo, useState } from 'react';
import { ChipRow, SwapView } from '@/components';
import { useProgressStore } from '@/store';
import { ConversionSession } from './ConversionSession';
import { FreeTyping } from './FreeTyping';
import { KeyHeatmap } from './KeyHeatmap';
import type { ExtraPhrase } from './practice';
import { TrainSession } from './TrainSession';

type Mode = 'level' | 'weak' | 'convert' | 'free' | 'stats';

const MODES = [
  { value: 'level' as const, label: 'Níveis' },
  { value: 'weak' as const, label: 'Pontos fracos' },
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
  const extras = useMemo<ExtraPhrase[]>(() => Object.values(myPhrases).map((p) => ({ jp: p.jp, pt: p.pt, source: 'mine' as const })), [myPhrases]);

  return (
    <>
      <ChipRow options={MODES} value={mode} onChange={setMode} />
      <SwapView viewKey={mode}>
        {mode === 'level' ? <TrainSession mode="level" extras={extras} /> : null}
        {mode === 'weak' ? <TrainSession mode="weak" extras={extras} /> : null}
        {mode === 'convert' ? <ConversionSession /> : null}
        {mode === 'free' ? <FreeTyping /> : null}
        {mode === 'stats' ? <KeyHeatmap /> : null}
      </SwapView>
    </>
  );
}
