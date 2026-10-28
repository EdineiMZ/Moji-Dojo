import { DAY_MS, initialDifficulty, initialStability, intervalFor, nextDifficulty, nextStability, retrievability, type Grade } from '@/features/review/fsrs';
import type { KeyStat, TypingProgress } from './typingStats';

/** Um acerto mais lento que isto (ms) conta como "com dificuldade"; mais rápido que `FAST_MS`, como "fácil". */
export const SLOW_MS = 2500;
export const FAST_MS = 900;
/** Letras digitadas dentro de uma mesma sessão contam uma vez só; erro conta sempre. */
const BURST_MS = 10 * 60_000;
/** Letra errada volta logo: em 10 minutos. */
const AGAIN_MS = 10 * 60_000;

/** O agendamento (FSRS) de uma letra: estabilidade em dias, dificuldade, última prática e quando vence. */
export type KeySchedule = Required<Pick<KeyStat, 's' | 'd' | 'at' | 'due'>>;

/** Nota de uma letra digitada: errou (1), acertou devagar (2), acertou (3) ou acertou rápido (4). */
export function gradeOf(ok: boolean, ms: number): Grade {
  if (!ok) return 1;
  if (ms >= SLOW_MS) return 2;
  if (ms > 0 && ms <= FAST_MS) return 4;
  return 3;
}

/**
 * O agendamento depois de digitar a letra, ou `undefined` se nada muda (um acerto logo depois de outra prática da mesma letra
 * na mesma sessão). A primeira vez que a letra aparece cria o agendamento.
 */
export function scheduleKey(prev: KeyStat, ok: boolean, ms: number, now: number): KeySchedule | undefined {
  const g = gradeOf(ok, ms);
  if (prev.s === undefined || prev.d === undefined || prev.at === undefined) {
    const s = initialStability(g);
    return { s, d: initialDifficulty(g), at: now, due: now + (g === 1 ? AGAIN_MS : intervalFor(s) * DAY_MS) };
  }
  if (g !== 1 && now - prev.at < BURST_MS) return undefined;
  const days = Math.max(0, (now - prev.at) / DAY_MS);
  const s = nextStability(prev.s, prev.d, retrievability(days, prev.s), g, days < 1);
  return { s, d: nextDifficulty(prev.d, g), at: now, due: now + (g === 1 ? AGAIN_MS : Math.max(intervalFor(s), 1) * DAY_MS) };
}

/** A chance de lembrar a letra agora (1 = acabou de praticar); sem agendamento, 0. */
export const keyRecall = (stat: KeyStat, now: number): number => (stat.s === undefined || stat.at === undefined ? 0 : retrievability(Math.max(0, (now - stat.at) / DAY_MS), stat.s));

/**
 * As letras para rever agora: as que venceram, da que mais se esquece para a menos; depois as que ainda não têm agendamento
 * (treinadas antes desta função existir) mas já foram erradas, da maior taxa de erro para a menor.
 */
export function dueChars(typing: TypingProgress, now: number, limit = 6): string[] {
  const entries = Object.entries(typing.keys);
  const scheduled = entries
    .filter(([, s]) => s.due !== undefined && s.due <= now)
    .sort((a, b) => keyRecall(a[1], now) - keyRecall(b[1], now));
  const legacy = entries
    .filter(([, s]) => s.due === undefined && s.bad > 0)
    .sort((a, b) => b[1].bad / (b[1].ok + b[1].bad + 2) - a[1].bad / (a[1].ok + a[1].bad + 2));
  return [...scheduled, ...legacy].slice(0, limit).map(([char]) => char);
}

/** Quando vence a próxima letra ainda não vencida (ms), ou `null` se nenhuma está agendada. */
export function nextKeyDue(typing: TypingProgress, now: number): number | null {
  let next: number | null = null;
  for (const s of Object.values(typing.keys)) if (s.due !== undefined && s.due > now && (next === null || s.due < next)) next = s.due;
  return next;
}
