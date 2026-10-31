import { useEffect, useState, type ReactNode } from 'react';
import { InteractionManager } from 'react-native';
import { Skeleton } from './Skeleton';

/**
 * Mostra um esqueleto por um instante e só então monta `children`. Serve para listas grandes (Frases, Vocabulário):
 * o esqueleto aparece de imediato e a lista é montada logo depois, em vez de a tela ficar em branco até ela ficar pronta.
 * Mude a `key` para mostrar o esqueleto de novo (ex.: ao trocar de aba).
 */
export function Deferred({ children, cards }: { children: ReactNode; cards?: number }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => setReady(true));
    return () => task.cancel();
  }, []);

  return ready ? <>{children}</> : <Skeleton cards={cards} />;
}
