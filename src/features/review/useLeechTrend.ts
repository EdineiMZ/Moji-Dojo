import { useEffect } from 'react';
import { findLeeches } from '@/features/leeches/leeches';
import { useProgressStore } from '@/store';
import { formatDay } from '@/features/streak/days';

/** Espera depois da última mudança antes de contar os teimosos (várias respostas seguidas contam como uma). */
const DEBOUNCE_MS = 2000;

/** Conta os itens teimosos de agora e guarda a contagem de hoje. */
export function snapshotLeeches(now: Date = new Date()): void {
  const { srs, vocab, conj, particles, setLeechCount } = useProgressStore.getState();
  setLeechCount(formatDay(now), findLeeches({ srs, vocab, conj, particles }).length);
}

/**
 * Guarda, a cada dia, quantos itens teimosos a pessoa tem. É com esse histórico que o freio percebe que eles estão crescendo
 * (3 ou mais em 7 dias), não só que a lista já está grande. Roda ao abrir o app e quando a revisão muda.
 */
export function useLeechTrend(): void {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const later = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => snapshotLeeches(), DEBOUNCE_MS);
    };
    later();
    const unsub = useProgressStore.subscribe((s, prev) => {
      if (s.srs !== prev.srs || s.vocab !== prev.vocab || s.conj !== prev.conj || s.particles !== prev.particles) later();
    });
    return () => {
      if (timer) clearTimeout(timer);
      unsub();
    };
  }, []);
}
