import { useCallback, useEffect, useRef } from 'react';
import { useProgressStore } from '@/store';
import { itemResult, startTrack, trackStep, type TrackState } from './tracker';
import type { TypingKeyEvent } from './typingStats';

export interface TypingTracker {
  /** Um item novo apareceu. */
  begin: () => void;
  /** Uma tecla foi digitada; `done` diz se o item ficou completo. */
  step: (next: string, target: string) => { done: boolean; cpm: number };
}

/**
 * Registra no progresso o desempenho por letra do treino de digitação. Os eventos ficam num buffer e só são gravados ao
 * concluir o item, ao trocar de item ou ao sair da tela, para não gravar o progresso a cada tecla.
 * `level` 0 = só registra as letras, sem contar o item num nível.
 */
export function useTypingTracker(level: number): TypingTracker {
  const recordTyping = useProgressStore((s) => s.recordTyping);
  const state = useRef<TrackState>(startTrack(0));
  const events = useRef<TypingKeyEvent[]>([]);

  const flush = useCallback(() => {
    if (events.current.length === 0) return;
    recordTyping(events.current);
    events.current = [];
  }, [recordTyping]);

  useEffect(() => {
    state.current = startTrack(Date.now());
    return flush;
  }, [flush]);

  return {
    begin: () => {
      flush();
      state.current = startTrack(Date.now());
    },
    step: (next, target) => {
      const now = Date.now();
      const result = trackStep(state.current, next, target, now);
      state.current = result.state;
      events.current.push(...result.events);
      if (next !== target) return { done: false, cpm: 0 };
      const { chars, ms } = itemResult(state.current, target, now);
      recordTyping(events.current, level > 0 ? { level, chars, ms } : undefined, now);
      events.current = [];
      return { done: true, cpm: chars > 0 ? Math.round((chars / ms) * 60000) : 0 };
    },
  };
}
