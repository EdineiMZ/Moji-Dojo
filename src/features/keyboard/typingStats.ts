import { FLICK_KEYS } from '@/data/keyboard';
import { dayKey } from '@/features/ai/settings';
import { howTo } from './flick';
import { scheduleKey } from './keySchedule';

/** Desempenho numa letra: acertos, erros e o tempo somado dos acertos (ms). */
export interface KeyStat {
  ok: number;
  bad: number;
  ms: number;
  /** Agendamento da revisão da letra (FSRS), ausente enquanto ela nunca foi digitada com a data conhecida. */
  s?: number;
  d?: number;
  /** Última prática e quando a letra vence (ms). */
  at?: number;
  due?: number;
}

/** Progresso do treino de digitação no teclado de flick (entra no backup). */
export interface TypingProgress {
  /** Por letra-alvo. */
  keys: Readonly<Record<string, KeyStat>>;
  /** Itens concluídos em cada nível (a chave é o número do nível). */
  levelDone: Readonly<Record<string, number>>;
  /** Letras digitadas e tempo gasto nos itens concluídos, para a média. */
  chars: number;
  ms: number;
  /** Recorde de letras por minuto num item (com 4 letras ou mais). */
  best: number;
  /** Letras certas digitadas no dia (para a meta diária); some quando o dia muda. */
  today?: { day: string; chars: number };
}

/** Uma letra digitada: acertou ou errou e quanto levou desde a anterior. */
export interface TypingKeyEvent {
  char: string;
  ok: boolean;
  ms: number;
}

export const EMPTY_TYPING: TypingProgress = { keys: {}, levelDone: {}, chars: 0, ms: 0, best: 0 };

/** Um tempo maior que isso entre duas letras é pausa, não velocidade: conta como isso. */
export const MAX_KEY_MS = 6000;
const MAX_KEYS = 160;
const MAX_COUNT = 1_000_000;

const count = (v: unknown): number => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? Math.min(Math.floor(v), MAX_COUNT) : 0);

const MAX_DAYS = 3650;
const num = (v: unknown): number | undefined => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : undefined);

/** O agendamento só vale inteiro: estabilidade, dificuldade (1 a 10), última prática e vencimento. */
function readSchedule(s: Record<string, unknown>): Pick<KeyStat, 's' | 'd' | 'at' | 'due'> | null {
  const stability = num(s.s);
  const difficulty = num(s.d);
  const at = num(s.at);
  const due = num(s.due);
  if (stability === undefined || difficulty === undefined || at === undefined || due === undefined) return null;
  if (stability > MAX_DAYS || difficulty < 1 || difficulty > 10) return null;
  return { s: stability, d: difficulty, at, due };
}

/** Lê o que veio do disco ou do backup; o que não tem a forma certa vira vazio. */
export function sanitizeTyping(raw: unknown): TypingProgress {
  if (typeof raw !== 'object' || raw === null) return EMPTY_TYPING;
  const r = raw as Record<string, unknown>;
  const keys: Record<string, KeyStat> = {};
  if (typeof r.keys === 'object' && r.keys !== null) {
    for (const [char, v] of Object.entries(r.keys as Record<string, unknown>)) {
      if ([...char].length !== 1 || !howTo(char) || typeof v !== 'object' || v === null) continue;
      if (Object.keys(keys).length >= MAX_KEYS) break;
      const s = v as Record<string, unknown>;
      const stat: KeyStat = { ok: count(s.ok), bad: count(s.bad), ms: count(s.ms) };
      const sched = readSchedule(s);
      keys[char] = sched ? { ...stat, ...sched } : stat;
    }
  }
  const levelDone: Record<string, number> = {};
  if (typeof r.levelDone === 'object' && r.levelDone !== null) {
    for (const [level, v] of Object.entries(r.levelDone as Record<string, unknown>)) {
      if (/^[1-9]$/.test(level)) levelDone[level] = count(v);
    }
  }
  const t = r.today as Record<string, unknown> | undefined;
  const today = typeof t === 'object' && t !== null && typeof t.day === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(t.day) ? { day: t.day, chars: count(t.chars) } : undefined;
  return { keys, levelDone, chars: count(r.chars), ms: count(r.ms), best: count(r.best), ...(today ? { today } : {}) };
}

/** Registra uma letra digitada: acerto (com o tempo desde a anterior) ou erro. */
export function recordKey(typing: TypingProgress, char: string, ok: boolean, ms: number, now?: number): TypingProgress {
  if (!howTo(char)) return typing;
  const prev = typing.keys[char] ?? { ok: 0, bad: 0, ms: 0 };
  const counted: KeyStat = ok
    ? { ...prev, ok: prev.ok + 1, ms: prev.ms + Math.min(Math.max(ms, 0), MAX_KEY_MS) }
    : { ...prev, bad: prev.bad + 1 };
  // Com a hora conhecida, a letra também entra na revisão espaçada (keySchedule.ts).
  const next = now === undefined ? counted : { ...counted, ...scheduleKey(prev, ok, ms, now) };
  return { ...typing, keys: { ...typing.keys, [char]: next } };
}

/** Letras por minuto de um item; 0 se não dá para medir. */
export function charsPerMinute(chars: number, ms: number): number {
  return chars >= 4 && ms > 0 ? Math.round((chars / ms) * 60000) : 0;
}

/** Registra um item concluído no nível dado, com quantas letras e quanto tempo levou. */
export function recordItem(typing: TypingProgress, level: number, chars: number, ms: number): TypingProgress {
  const key = String(level);
  const cpm = charsPerMinute(chars, ms);
  return {
    ...typing,
    levelDone: { ...typing.levelDone, [key]: (typing.levelDone[key] ?? 0) + 1 },
    chars: typing.chars + chars,
    ms: typing.ms + Math.min(ms, MAX_COUNT),
    best: Math.max(typing.best, cpm),
  };
}

/** Soma letras certas ao dia de hoje (o contador recomeça quando o dia muda). */
export function addTyped(typing: TypingProgress, chars: number, now: number): TypingProgress {
  if (chars <= 0) return typing;
  const day = dayKey(now);
  const before = typing.today?.day === day ? typing.today.chars : 0;
  return { ...typing, today: { day, chars: Math.min(before + chars, MAX_COUNT) } };
}

/** Letras certas digitadas hoje. */
export const typedToday = (typing: TypingProgress, now: number): number => (typing.today?.day === dayKey(now) ? typing.today.chars : 0);

/** Média geral de letras por minuto (0 se ainda não há dados). */
export const averageCpm = (typing: TypingProgress): number => charsPerMinute(typing.chars, typing.ms);

/** Taxa de erro de uma letra (0 a 1); letras pouco treinadas tendem ao meio-termo baixo. */
export function errorRate(stat: KeyStat | undefined): number {
  if (!stat) return 0;
  return stat.bad / (stat.ok + stat.bad + 2);
}

/** As letras que mais precisam de treino: com erro, da maior taxa para a menor. */
export function weakChars(typing: TypingProgress, limit = 5): string[] {
  return Object.entries(typing.keys)
    .filter(([, s]) => s.bad > 0)
    .sort((a, b) => errorRate(b[1]) - errorRate(a[1]) || b[1].bad - a[1].bad)
    .slice(0, limit)
    .map(([char]) => char);
}

export interface KeyHeat {
  label: string;
  /** Erros e tentativas somados das letras da tecla. */
  bad: number;
  tries: number;
  /** Tempo médio por acerto (ms), 0 se não há acertos. */
  avgMs: number;
  /** 0 (sem dado) a 1 (muito erro). */
  rate: number;
}

/** Desempenho agrupado por tecla do teclado (12 teclas), para o mapa de calor. */
export function keyHeat(typing: TypingProgress): KeyHeat[] {
  const byLabel = new Map<string, { ok: number; bad: number; ms: number }>();
  for (const [char, s] of Object.entries(typing.keys)) {
    const label = howTo(char)?.key;
    if (!label) continue;
    const t = byLabel.get(label) ?? { ok: 0, bad: 0, ms: 0 };
    byLabel.set(label, { ok: t.ok + s.ok, bad: t.bad + s.bad, ms: t.ms + s.ms });
  }
  return FLICK_KEYS.map((key) => {
    const t = byLabel.get(key.label) ?? { ok: 0, bad: 0, ms: 0 };
    const tries = t.ok + t.bad;
    return { label: key.label, bad: t.bad, tries, avgMs: t.ok > 0 ? Math.round(t.ms / t.ok) : 0, rate: tries > 0 ? t.bad / tries : 0 };
  });
}
