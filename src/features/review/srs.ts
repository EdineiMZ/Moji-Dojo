import { DAY_MS, initialDifficulty, initialStability, intervalFor, nextDifficulty, nextStability, retrievability, type Grade } from './fsrs';

/**
 * Repetição espaçada: o agendamento é o FSRS (ver `fsrs.ts`), e a "caixa" (1 a 6) continua existindo como o estágio do cartão,
 * calculado pelo intervalo: 1 (menos de 3 dias), 2 (3 a 6), 3 (7 a 13), 4 (14 a 29), 5 (30 a 59) e 6 (60 ou mais). Os limites de
 * "firme", de "maduro" e dos itens teimosos usam a caixa. Tudo aqui é puro: o relógio ("now", em ms) é sempre passado de fora.
 */
export { DAY_MS };
/** Dias que marcam cada caixa (índice = caixa); também o intervalo de partida de quem veio do agendamento antigo. A caixa 0 não é usada. */
export const BOX_DAYS = [0, 1, 3, 7, 14, 30, 60] as const;
export const LAST_BOX = BOX_DAYS.length - 1;
/** A partir desta caixa o caractere conta como "firme" no progresso. */
export const FIRM_BOX = 3;

export interface SrsEntry {
  /** Caixa atual (1 a 6). */
  b: number;
  /** Quando vence a próxima revisão (ms desde 1970). */
  due: number;
  /** Quantas vezes o item foi esquecido (erro, ou acerto só depois de errar). Ausente = nunca. */
  l?: number;
  /** FSRS: estabilidade (dias), dificuldade (1 a 10) e quando foi a última revisão (ms). Ausentes em cartões do agendamento antigo. */
  s?: number;
  d?: number;
  t?: number;
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

/** A caixa (estágio) de um intervalo em dias. */
export function boxFor(days: number): number {
  let box = 1;
  for (let b = 2; b <= LAST_BOX; b++) if (days >= (BOX_DAYS[b] ?? Infinity)) box = b;
  return box;
}

/** Maior intervalo agendado, em dias. */
export const MAX_INTERVAL_DAYS = 365;
/** Retenção desejada: o FSRS agenda para quando a chance de lembrar cair a esse valor. */
export const DESIRED_RETENTION = 0.9;

/** Um cartão do agendamento antigo (só caixa e data) ainda não tem estabilidade: ela parte do intervalo da caixa. */
const isLegacyReviewed = (entry: SrsEntry): boolean => entry.s === undefined && (entry.b > 1 || (entry.l ?? 0) > 0 || entry.t !== undefined);

/**
 * Resultado de uma resposta na revisão, pelo FSRS.
 * - errou: nota 1; o cartão volta à caixa 1 e fica vencido agora;
 * - acertou, mas só depois de errar na mesma sessão (`wasWrong`): nota 2, vence em pelo menos um dia;
 * - acertou de primeira: nota 3; o intervalo cresce conforme a estabilidade e a dificuldade do cartão.
 */
export function answerReview(entry: SrsEntry, ok: boolean, wasWrong: boolean, now: number): SrsEntry {
  const lapses = entry.l ?? 0;
  const grade: Grade = !ok ? 1 : wasWrong ? 2 : 3;
  const lastReviewed = entry.t ?? entry.due - (BOX_DAYS[entry.b] ?? 1) * DAY_MS;
  const elapsed = Math.max(0, (now - lastReviewed) / DAY_MS);

  let s: number;
  let d: number;
  if (entry.s !== undefined && entry.d !== undefined) {
    const r = retrievability(elapsed, entry.s);
    d = nextDifficulty(entry.d, grade);
    s = nextStability(entry.s, entry.d, r, grade, elapsed < 1);
  } else if (isLegacyReviewed(entry)) {
    const s0 = Math.max(1, BOX_DAYS[entry.b] ?? 1);
    const d0 = Math.min(10, initialDifficulty(3) + 0.5 * lapses);
    d = nextDifficulty(d0, grade);
    s = nextStability(s0, d0, retrievability(elapsed, s0), grade, elapsed < 1);
  } else {
    // Cartão novo: a primeira nota decide a estabilidade e a dificuldade de partida.
    s = initialStability(grade);
    d = initialDifficulty(grade);
  }

  const lapsedNow = grade < 3;
  // Errou: volta agora. Acertou só depois de errar: volta amanhã (a estabilidade guardada decide o resto depois).
  const days = grade === 1 ? 0 : grade === 2 ? 1 : Math.min(MAX_INTERVAL_DAYS, Math.max(1, Math.round(intervalFor(s, DESIRED_RETENTION))));
  const box = grade < 3 ? 1 : boxFor(days);
  // Quem chega à caixa firme sem tropeçar de novo vai "perdoando" um esquecimento.
  const newLapses = lapsedNow ? lapses + 1 : box >= FIRM_BOX ? Math.max(0, lapses - 1) : lapses;
  return { b: box, due: now + days * DAY_MS, ...(newLapses > 0 ? { l: newLapses } : {}), s, d, t: now };
}

/** Esquecimentos a partir dos quais o item é "teimoso" (leech) enquanto ainda está nas caixas baixas. */
export const LEECH_LAPSES = 4;
export const isLeech = (entry: SrsEntry): boolean => (entry.l ?? 0) >= LEECH_LAPSES && entry.b <= 2;

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
