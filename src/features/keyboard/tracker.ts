import { baseOf, simulatorProgress } from './flick';
import type { TypingKeyEvent } from './typingStats';

/** Estado de um item em digitação: quantas letras já foram creditadas e quando. */
export interface TrackState {
  /** Letras do início já creditadas como certas. */
  ok: number;
  /** Já registramos o erro da letra errada que está na tela. */
  wrong: boolean;
  /** Quando foi a última letra certa (ou quando o item apareceu). */
  lastAt: number;
  /** Quando foi a primeira tecla (0 = ainda nenhuma). */
  firstAt: number;
}

export const startTrack = (now: number): TrackState => ({ ok: 0, wrong: false, lastAt: now, firstAt: 0 });

/** A letra digitada ainda pode virar a certa com a tecla 小゛゜ (が é か + um toque; ぱ é は + dois)? */
function pendingMod(typed: string, wanted: string): boolean {
  const [wantedBase, wantedMods] = baseOf(wanted);
  if (wantedMods === 0 || typed === wanted) return false;
  return baseOf(typed)[0] === wantedBase;
}

/**
 * Lê a digitação depois de uma tecla: devolve o novo estado e os eventos por letra. Letra certa credita o tempo desde a
 * anterior; letra errada vira um erro na letra que era esperada (uma vez só, até apagar). Letra que ainda vai virar a
 * certa com 小゛゜ não conta como erro.
 */
export function trackStep(state: TrackState, next: string, target: string, now: number): { state: TrackState; events: TypingKeyEvent[] } {
  const typed = [...next];
  const wanted = [...target];
  const progress = simulatorProgress(next, target);
  const events: TypingKeyEvent[] = [];
  let { ok, wrong, lastAt } = state;
  const firstAt = state.firstAt === 0 ? now : state.firstAt;

  if (progress.correct > ok) {
    for (let i = ok; i < progress.correct; i++) events.push({ char: wanted[i] as string, ok: true, ms: now - lastAt });
    ok = progress.correct;
    lastAt = now;
  }
  if (progress.correct === typed.length) {
    wrong = false;
  } else {
    const expected = wanted[progress.correct];
    const wrongChar = typed[progress.correct];
    const pending = expected !== undefined && wrongChar !== undefined && typed.length === progress.correct + 1 && pendingMod(wrongChar, expected);
    if (!pending && !wrong) {
      if (expected !== undefined) events.push({ char: expected, ok: false, ms: 0 });
      wrong = true;
    }
  }
  return { state: { ok, wrong, lastAt, firstAt }, events };
}

/** Resultado de um item concluído: quantas letras contam para a velocidade e quanto tempo levou. */
export function itemResult(state: TrackState, target: string, now: number): { chars: number; ms: number } {
  const length = [...target].length;
  if (length < 3 || state.firstAt === 0) return { chars: 0, ms: 0 };
  return { chars: length - 1, ms: Math.max(now - state.firstAt, 1) };
}
