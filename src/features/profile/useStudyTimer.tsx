import { useEffect, useRef, type ReactNode } from 'react';
import { AppState, View } from 'react-native';
import { useProgressStore } from '@/store';
import { activeSeconds, TICK_MS } from './studyTimer';

/** De quanto em quanto tempo o que foi contado é gravado (gravar a cada tick sobrecarregaria o armazenamento). */
const FLUSH_MS = 30_000;

/**
 * Envolve o app e conta o tempo de uso ativo: um toque em qualquer lugar renova a janela de 60 s, e a cada 5 s dentro dela
 * soma-se o tempo ao dia de hoje. Em segundo plano não conta. O tempo é gravado de 30 em 30 s e ao sair do app.
 */
export function StudyTimer({ children }: { children: ReactNode }) {
  const lastTouch = useRef(0);
  useEffect(() => {
    let pending = 0;
    let active = AppState.currentState === 'active';
    const flush = () => {
      if (pending > 0) {
        useProgressStore.getState().recordStudyTime(pending);
        pending = 0;
      }
    };
    const tick = setInterval(() => {
      if (active) pending += activeSeconds(Date.now(), lastTouch.current, TICK_MS);
    }, TICK_MS);
    const save = setInterval(flush, FLUSH_MS);
    const sub = AppState.addEventListener('change', (state) => {
      active = state === 'active';
      if (!active) flush();
    });
    return () => {
      clearInterval(tick);
      clearInterval(save);
      sub.remove();
      flush();
    };
  }, []);

  // O toque só avisa; não consome o gesto (os filhos continuam recebendo normalmente).
  return (
    <View style={{ flex: 1 }} onTouchStart={() => (lastTouch.current = Date.now())}>
      {children}
    </View>
  );
}
