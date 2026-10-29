import { useEffect } from 'react';
import { AppState } from 'react-native';
import { requireOptionalNativeModule } from 'expo';
import { findItem } from '@/features/catalog';
import { dueCards as conjDue } from '@/features/conjugation/cards';
import { dueChars, type SrsState } from '@/features/review/srs';
import { streakDays } from '@/features/streak/days';
import { dueCards as vocabDue } from '@/features/vocab/cards';
import { useProgressStore } from '@/store';

interface NativeHomeWidget {
  update(dueNow: number, upcoming: string, streak: number): void;
  hasWidget(): boolean;
  canPin(): boolean;
  requestPin(): boolean;
}

/** O módulo do widget só existe no APK gerado com ele; no Expo Go, na web e nos testes ele é null. */
const native = requireOptionalNativeModule<NativeHomeWidget>('HomeWidget');

export const widgetAvailable: boolean = native !== null;

/** Até quantas horas à frente o app diz ao widget o que vai vencer (o widget recalcula a cada atualização, sem abrir o app). */
export const HORIZON_MS = 36 * 3_600_000;
const MAX_UPCOMING = 500;

export interface WidgetPayload {
  /** Revisões vencidas agora (kana, palavras, verbos e partículas). */
  dueNow: number;
  /** Os momentos (ms) em que vencem as próximas, dentro do horizonte, em ordem. */
  upcoming: number[];
  /** Dias seguidos de estudo. */
  streak: number;
}

interface WidgetProgress {
  srs: SrsState;
  vocab: SrsState;
  conj: SrsState;
  particles: SrsState;
  days: readonly string[];
}

const isKnownKana = (char: string): boolean => findItem(char) !== undefined;

/** O que o widget mostra: as mesmas contagens do cartão "Sessão de hoje", mais o que vence nas próximas horas. */
export function widgetPayload(progress: WidgetProgress, now: number): WidgetPayload {
  const groups: { state: SrsState; dueAt: (at: number) => string[] }[] = [
    { state: progress.srs, dueAt: (at) => dueChars(progress.srs, at, isKnownKana) },
    { state: progress.vocab, dueAt: (at) => vocabDue(progress.vocab, at) },
    { state: progress.conj, dueAt: (at) => conjDue(progress.conj, at) },
    { state: progress.particles, dueAt: (at) => Object.keys(progress.particles).filter((k) => (progress.particles[k]?.due ?? Infinity) <= at) },
  ];
  const horizon = now + HORIZON_MS;
  const dueNow = groups.reduce((sum, g) => sum + g.dueAt(now).length, 0);
  const upcoming = groups
    .flatMap((g) => g.dueAt(horizon).map((key) => g.state[key]?.due ?? 0))
    .filter((at) => at > now)
    .sort((a, b) => a - b)
    .slice(0, MAX_UPCOMING);
  return { dueNow, upcoming, streak: streakDays(progress.days, new Date(now)) };
}

/** Manda o conteúdo ao widget. Sem o módulo (Expo Go) ou com qualquer falha, não faz nada: o widget é um extra. */
export function pushWidget(progress: WidgetProgress, now: number = Date.now()): void {
  if (!native) return;
  try {
    const payload = widgetPayload(progress, now);
    native.update(payload.dueNow, payload.upcoming.join(','), payload.streak);
  } catch {
    // sem widget neste aparelho
  }
}

/** Mantém o widget em dia: depois de cada mudança no progresso e quando o app vai para o segundo plano. */
export function useWidgetSync(): void {
  const srs = useProgressStore((s) => s.srs);
  const vocab = useProgressStore((s) => s.vocab);
  const conj = useProgressStore((s) => s.conj);
  const particles = useProgressStore((s) => s.particles);
  const days = useProgressStore((s) => s.days);

  useEffect(() => {
    if (!widgetAvailable) return;
    const progress = { srs, vocab, conj, particles, days };
    // Espera um pouco: numa sessão de revisão o progresso muda a cada resposta.
    const timer = setTimeout(() => pushWidget(progress), 1500);
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active') pushWidget(progress);
    });
    return () => {
      clearTimeout(timer);
      sub.remove();
    };
  }, [srs, vocab, conj, particles, days]);
}

export const widgetPlaced = (): boolean => {
  try {
    return native?.hasWidget() ?? false;
  } catch {
    return false;
  }
};

export const canPinWidget = (): boolean => {
  try {
    return native?.canPin() ?? false;
  } catch {
    return false;
  }
};

/** Pede ao lançador para adicionar o widget à tela inicial (o sistema pede a confirmação). */
export function requestPinWidget(): boolean {
  try {
    return native?.requestPin() ?? false;
  } catch {
    return false;
  }
}
