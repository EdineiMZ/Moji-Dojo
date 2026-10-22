import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';

/**
 * Hora atual (ms), atualizada ao voltar para a tela e a cada minuto enquanto ela
 * está em foco. Assim "revisões pendentes" não fica desatualizado.
 */
export function useNow(intervalMs = 60_000): number {
  const [now, setNow] = useState(() => Date.now());
  useFocusEffect(
    useCallback(() => {
      setNow(Date.now());
      const id = setInterval(() => setNow(Date.now()), intervalMs);
      return () => clearInterval(id);
    }, [intervalMs]),
  );
  return now;
}
