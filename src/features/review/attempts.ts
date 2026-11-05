import type { Direction } from '@/features/quiz/quiz';

/**
 * Registro de tentativas: uma linha por resposta a um caractere (kana ou kanji) nas perguntas do quiz e das revisões, com o
 * tipo de exercício e, no desenho, a nota. Serve para descobrir ONDE cada item falha (por exemplo, o い errado só no desenho
 * ou em todos os tipos?), coisa que os contadores c/w por caractere não mostram. Lista circular: guarda só as mais recentes.
 */
export type AttemptKind = Direction;

export interface Attempt {
  /** O caractere. */
  c: string;
  /** Tipo de exercício: k2r (kana→romaji), r2k (romaji→kana), audio (ouvir e escolher) ou write (desenhar). */
  k: AttemptKind;
  ok: boolean;
  /** Quando (ms desde 1970). */
  t: number;
  /** 1 = a pergunta voltou depois de um erro na sessão (repetição). */
  r?: 1;
  /** No desenho: a nota, de 0 a 100. */
  n?: number;
  /** No desenho: a nota mínima exigida naquele momento (depende da caixa do item). */
  p?: number;
  /** 1 = respondeu com a dica ligada. */
  h?: 1;
  /** 1 = desistiu ("Não lembro"). */
  g?: 1;
}

/** Quantas tentativas ficam guardadas (as mais recentes). */
export const MAX_ATTEMPTS = 1500;

const KINDS: readonly AttemptKind[] = ['k2r', 'r2k', 'audio', 'write'];

export interface AttemptInput {
  char: string;
  direction: Direction;
  ok: boolean;
  retry?: boolean;
  /** Nota do desenho (0 a 100) e a mínima exigida; ausentes quando não foi desenho ou o aluno desistiu. */
  score?: number;
  need?: number;
  hinted?: boolean;
  gaveUp?: boolean;
}

/** A tentativa ainda sem hora: quem guarda (o store) carimba o momento. */
export type AttemptDraft = Omit<Attempt, 't'>;

/** Monta o registro, sem campos vazios (a lista é salva a cada resposta). */
export function makeAttempt(i: AttemptInput): AttemptDraft {
  return {
    c: i.char,
    k: i.direction,
    ok: i.ok,
    ...(i.retry ? { r: 1 as const } : {}),
    ...(i.score !== undefined ? { n: Math.round(i.score) } : {}),
    ...(i.need !== undefined && i.score !== undefined ? { p: i.need } : {}),
    ...(i.hinted ? { h: 1 as const } : {}),
    ...(i.gaveUp ? { g: 1 as const } : {}),
  };
}

/** Acrescenta uma tentativa, mantendo só as `MAX_ATTEMPTS` mais recentes. */
export function addAttempt(list: readonly Attempt[], attempt: Attempt): Attempt[] {
  const next = [...list, attempt];
  return next.length > MAX_ATTEMPTS ? next.slice(next.length - MAX_ATTEMPTS) : next;
}

/** Lê a lista que veio do disco ou do backup: descarta o que não tem a forma de uma tentativa. */
export function sanitizeAttempts(raw: unknown): Attempt[] {
  if (!Array.isArray(raw)) return [];
  const out: Attempt[] = [];
  for (const a of raw) {
    if (typeof a !== 'object' || a === null) continue;
    const r = a as Record<string, unknown>;
    if (typeof r.c !== 'string' || r.c === '' || !KINDS.includes(r.k as AttemptKind)) continue;
    if (typeof r.ok !== 'boolean' || typeof r.t !== 'number' || !Number.isFinite(r.t)) continue;
    const num = (v: unknown): number | undefined => (typeof v === 'number' && Number.isFinite(v) ? v : undefined);
    const n = num(r.n);
    const p = num(r.p);
    out.push({
      c: r.c,
      k: r.k as AttemptKind,
      ok: r.ok,
      t: r.t,
      ...(r.r === 1 ? { r: 1 as const } : {}),
      ...(n !== undefined ? { n } : {}),
      ...(n !== undefined && p !== undefined ? { p } : {}),
      ...(r.h === 1 ? { h: 1 as const } : {}),
      ...(r.g === 1 ? { g: 1 as const } : {}),
    });
  }
  return out.slice(-MAX_ATTEMPTS);
}

export interface KindSummary {
  right: number;
  wrong: number;
  /** Média das notas dos desenhos (só no write, e só os que foram conferidos). */
  avgScore?: number;
}

/** Acertos e erros de um caractere por tipo de exercício, só das primeiras respostas (a repetição é treino e distorce a conta). */
export function summarizeByKind(list: readonly Attempt[], char: string): Partial<Record<AttemptKind, KindSummary>> {
  const out: Partial<Record<AttemptKind, { right: number; wrong: number; scores: number[] }>> = {};
  for (const a of list) {
    if (a.c !== char || a.r) continue;
    const s = (out[a.k] ??= { right: 0, wrong: 0, scores: [] });
    if (a.ok) s.right++;
    else s.wrong++;
    if (a.n !== undefined) s.scores.push(a.n);
  }
  const result: Partial<Record<AttemptKind, KindSummary>> = {};
  for (const kind of KINDS) {
    const s = out[kind];
    if (!s) continue;
    result[kind] = { right: s.right, wrong: s.wrong, ...(s.scores.length ? { avgScore: s.scores.reduce((x, y) => x + y, 0) / s.scores.length } : {}) };
  }
  return result;
}
