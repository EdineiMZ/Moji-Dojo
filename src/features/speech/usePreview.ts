import { useCallback, useEffect, useRef, useState } from 'react';
import { playSpeakerPreview } from './voicevoxPreview';

export type PreviewState = 'idle' | 'loading' | 'playing';

/** Quanto tempo o botão fica em "Tocando..." (as amostras duram de 2 a 4 segundos). */
const PLAYING_MS = 3500;

/**
 * Estado de um botão de amostra: "carregando" enquanto baixa ou sintetiza, "tocando" por alguns segundos e o erro, se houver.
 * Sem isso o botão ficava mudo, e quem tocava não sabia se algo tinha acontecido.
 */
export function usePreview(slug: string, styleId: number, installed: boolean) {
  const [state, setState] = useState<PreviewState>('idle');
  const [error, setError] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const play = useCallback(async () => {
    if (state === 'loading') return;
    if (timer.current) clearTimeout(timer.current);
    setError('');
    setState('loading');
    try {
      await playSpeakerPreview(slug, styleId, installed);
      setState('playing');
      timer.current = setTimeout(() => setState('idle'), PLAYING_MS);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não consegui tocar a amostra.');
      setState('idle');
    }
  }, [slug, styleId, installed, state]);

  return { state, error, play };
}

/** O texto do botão em cada estado ("🔊 Amostra" quando parado). */
export const previewLabel = (state: PreviewState, idle = '🔊 Amostra'): string => (state === 'loading' ? 'Carregando...' : state === 'playing' ? '🔊 Tocando...' : idle);
