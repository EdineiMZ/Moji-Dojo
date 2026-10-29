import { useEffect, useState } from 'react';

/** Tempo de prova: quanto cada pergunta tem (em segundos). O tempo total é este número vezes as perguntas, para a prova toda. */
export const SECONDS_PER_QUESTION = 45;

/** O tempo total de uma prova com `questions` perguntas, em ms. */
export const examTimeMs = (questions: number): number => questions * SECONDS_PER_QUESTION * 1000;

/** "12:05" a partir de milissegundos (arredonda para cima: com 0,4 s sobrando ainda mostra 0:01). */
export function formatClock(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/** Quantos segundos restam, abaixo do que o cronômetro vira alerta. */
export const WARNING_MS = 60_000;

/**
 * O relógio da prova: com `limitMs` null não há tempo. O prazo é fixado quando a prova começa e a contagem para quando a prova
 * termina (`running` falso), seja pelas respostas, seja porque o tempo acabou.
 */
export function useExamClock(limitMs: number | null, running: boolean): { left: number | null; expired: boolean } {
  const [deadline] = useState(() => (limitMs === null ? null : Date.now() + limitMs));
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (deadline === null || !running) return;
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, [deadline, running]);
  const left = deadline === null ? null : Math.max(0, deadline - now);
  return { left, expired: left === 0 };
}
