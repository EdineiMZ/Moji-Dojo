/**
 * Repetição espaçada em 6 caixas (mesma lógica do protótipo).
 * Tudo aqui é puro: o relógio ("now", em ms) é sempre passado de fora.
 */
export const DAY_MS = 86_400_000;
/** Dias até a próxima revisão em cada caixa (índice = caixa). A caixa 0 não é usada. */
export const BOX_DAYS = [0, 1, 3, 7, 14, 30, 60] as const;
export const LAST_BOX = BOX_DAYS.length - 1;
/** A partir desta caixa o caractere conta como "firme" no progresso. */
export const FIRM_BOX = 3;

export interface SrsEntry {
  /** Caixa atual (1 a 6). */
  b: number;
  /** Quando vence a próxima revisão (ms desde 1970). */
  due: number;
}

export type SrsState = Readonly<Record<string, SrsEntry>>;

/** Adiciona à revisão os caracteres ainda desconhecidos: caixa 1, vencem amanhã. */
export function learnItems(srs: SrsState, chars: readonly string[], now: number): SrsState {
  const next: Record<string, SrsEntry> = { ...srs };
  for (const c of chars) {
    if (!next[c]) next[c] = { b: 1, due: now + DAY_MS };
  }
  return next;
}

/** Lição feita pelo "Já sei": os caracteres novos pulam para a caixa 2 (revisão em 3 dias). */
export function boostSkippedItems(srs: SrsState, chars: readonly string[], now: number): SrsState {
  const next: Record<string, SrsEntry> = { ...srs };
  for (const c of chars) {
    const entry = next[c];
    if (entry && entry.b < 2) next[c] = { b: 2, due: now + 3 * DAY_MS };
  }
  return next;
}

/**
 * Resultado de uma resposta na revisão.
 * - errou: volta à caixa 1 e fica vencido agora;
 * - acertou, mas só depois de errar na mesma sessão (`wasWrong`): caixa 1, vence amanhã;
 * - acertou de primeira: sobe uma caixa.
 */
export function answerReview(entry: SrsEntry, ok: boolean, wasWrong: boolean, now: number): SrsEntry {
  if (!ok) return { b: 1, due: now };
  if (wasWrong) return { b: 1, due: now + DAY_MS };
  const b = Math.min(entry.b + 1, LAST_BOX);
  return { b, due: now + (BOX_DAYS[b] ?? 0) * DAY_MS };
}

/**
 * Na "revisão extra" só as respostas erradas mexem no agendamento:
 * acertar de primeira não adianta a próxima revisão.
 */
export const shouldApplyReviewAnswer = (extra: boolean, ok: boolean, firstTry: boolean): boolean =>
  !extra || !ok || !firstTry;

/** Caracteres vencidos, do mais atrasado para o menos. `isKnown` ignora chaves que não existem mais. */
export function dueChars(srs: SrsState, now: number, isKnown: (char: string) => boolean = () => true): string[] {
  return Object.keys(srs)
    .filter((c) => isKnown(c) && (srs[c]?.due ?? Infinity) <= now)
    .sort((a, b) => (srs[a]?.due ?? 0) - (srs[b]?.due ?? 0));
}

export interface UpcomingReviews {
  /** Momento da próxima revisão a vencer. */
  at: number;
  /** Quantos caracteres vencem no mesmo dia (calendário local) que `at`. */
  count: number;
}

/** Próxima revisão ainda no futuro (ignora as já vencidas). `null` se não houver. */
export function upcomingReviews(
  srs: SrsState,
  now: number,
  isKnown: (char: string) => boolean = () => true,
): UpcomingReviews | null {
  const future = Object.keys(srs)
    .filter((c) => isKnown(c))
    .map((c) => srs[c]?.due ?? 0)
    .filter((due) => due > now);
  if (!future.length) return null;
  const at = Math.min(...future);
  const day = new Date(at).toDateString();
  return { at, count: future.filter((due) => new Date(due).toDateString() === day).length };
}
