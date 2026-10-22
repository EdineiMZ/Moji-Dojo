import { LESSONS } from '@/data/lessons';
import { findItem } from '@/features/catalog';
import type { CharStats, ProgressSnapshot } from '@/features/progress/types';
import { LAST_BOX, type SrsEntry } from '@/features/review/srs';

/**
 * Backup do protótipo HTML: "NDJ1:" + base64 de um JSON em UTF-8
 * (no HTML: btoa(unescape(encodeURIComponent(JSON.stringify(store))))).
 * Só os campos srs, lessons, stats e days são importados.
 */
export const BACKUP_PREFIX = 'NDJ1:';
const MAX_DAYS = 400;
const DAY_FORMAT = /^\d{4}-\d{2}-\d{2}$/;
const BASE64_FORMAT = /^[A-Za-z0-9+/]*={0,2}$/;

/** Quanto progresso existe, em números. */
export interface ProgressCounts {
  /** Lições concluídas. */
  lessons: number;
  /** Caracteres na revisão espaçada. */
  reviews: number;
  /** Caracteres com histórico de acertos/erros. */
  characters: number;
  /** Dias de estudo. */
  days: number;
}

export interface BackupSummary extends ProgressCounts {
  /** Itens do código que não existem mais neste app e foram descartados. */
  ignored: number;
}

export const summarizeProgress = (p: ProgressSnapshot): ProgressCounts => ({
  lessons: Object.keys(p.lessons).length,
  reviews: Object.keys(p.srs).length,
  characters: Object.keys(p.stats).length,
  days: p.days.length,
});

/**
 * - format: não começa com NDJ1:
 * - encoding: base64 ou UTF-8 inválido (código cortado ou alterado)
 * - json: o conteúdo não é JSON
 * - data: é JSON, mas não tem a forma de um backup
 * - empty: backup válido, porém sem nenhum progresso
 */
export type BackupError = 'format' | 'encoding' | 'json' | 'data' | 'empty';

export type BackupParseResult =
  | { ok: true; snapshot: ProgressSnapshot; summary: BackupSummary }
  | { ok: false; error: BackupError };

class BackupFailure extends Error {
  constructor(readonly code: BackupError) {
    super(code);
  }
}

/** Texto binário (um byte por caractere) → string UTF-8. */
function decodeUtf8(binary: string): string {
  let out = '';
  let i = 0;
  while (i < binary.length) {
    const b0 = binary.charCodeAt(i++);
    let codePoint: number;
    let extra: number;
    if (b0 < 0x80) {
      codePoint = b0;
      extra = 0;
    } else if ((b0 & 0xe0) === 0xc0) {
      codePoint = b0 & 0x1f;
      extra = 1;
    } else if ((b0 & 0xf0) === 0xe0) {
      codePoint = b0 & 0x0f;
      extra = 2;
    } else if ((b0 & 0xf8) === 0xf0) {
      codePoint = b0 & 0x07;
      extra = 3;
    } else {
      throw new BackupFailure('encoding');
    }
    for (let k = 0; k < extra; k++) {
      const b = binary.charCodeAt(i++);
      if (Number.isNaN(b) || (b & 0xc0) !== 0x80) throw new BackupFailure('encoding');
      codePoint = (codePoint << 6) | (b & 0x3f);
    }
    if (codePoint > 0x10ffff) throw new BackupFailure('encoding');
    out += String.fromCodePoint(codePoint);
  }
  return out;
}

function decodePayload(code: string): unknown {
  const clean = code.replace(/\s+/g, '');
  if (!clean.startsWith(BACKUP_PREFIX)) throw new BackupFailure('format');
  const base64 = clean.slice(BACKUP_PREFIX.length);
  if (!base64 || base64.length % 4 !== 0 || !BASE64_FORMAT.test(base64)) throw new BackupFailure('encoding');
  let json: string;
  try {
    json = decodeUtf8(atob(base64));
  } catch (e) {
    throw e instanceof BackupFailure ? e : new BackupFailure('encoding');
  }
  try {
    return JSON.parse(json);
  } catch {
    throw new BackupFailure('json');
  }
}

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const isCount = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0;

/** Lê um campo que deve ser objeto; ausente = vazio; de outro tipo = backup inválido. */
function recordField(root: Record<string, unknown>, key: string): Record<string, unknown> {
  const v = root[key];
  if (v === undefined) return {};
  if (!isRecord(v)) throw new BackupFailure('data');
  return v;
}

/**
 * Valida o código e devolve o progresso já limpo: só caracteres e lições que
 * existem neste app, com valores no intervalo certo. Não altera nada salvo.
 */
export function parseBackup(code: string): BackupParseResult {
  try {
    const root = decodePayload(code);
    if (!isRecord(root)) throw new BackupFailure('data');
    const fields = ['srs', 'lessons', 'stats', 'days'];
    if (!fields.some((f) => f in root)) throw new BackupFailure('data');

    let ignored = 0;

    const srs: Record<string, SrsEntry> = {};
    for (const [char, v] of Object.entries(recordField(root, 'srs'))) {
      if (!findItem(char) || !isRecord(v) || !isCount(v.b) || !isCount(v.due)) {
        ignored++;
        continue;
      }
      srs[char] = { b: Math.min(Math.max(Math.round(v.b), 1), LAST_BOX), due: v.due };
    }

    const knownLessons = new Set(Object.values(LESSONS).flatMap((list) => list.map((l) => l.id)));
    const lessons: Record<string, true> = {};
    for (const [id, v] of Object.entries(recordField(root, 'lessons'))) {
      if (!knownLessons.has(id) || v !== true) {
        ignored++;
        continue;
      }
      lessons[id] = true;
    }

    const stats: Record<string, CharStats> = {};
    for (const [char, v] of Object.entries(recordField(root, 'stats'))) {
      if (!findItem(char) || !isRecord(v) || !isCount(v.c) || !isCount(v.w)) {
        ignored++;
        continue;
      }
      stats[char] = { c: Math.floor(v.c), w: Math.floor(v.w) };
    }

    const rawDays = root.days;
    if (rawDays !== undefined && !Array.isArray(rawDays)) throw new BackupFailure('data');
    const validDays = (rawDays ?? []).filter((d): d is string => typeof d === 'string' && DAY_FORMAT.test(d));
    ignored += (rawDays?.length ?? 0) - validDays.length;
    const days = [...new Set(validDays)].sort().slice(-MAX_DAYS);

    const snapshot: ProgressSnapshot = { srs, lessons, stats, days };
    const counts = summarizeProgress(snapshot);
    if (!counts.lessons && !counts.reviews && !counts.characters && !counts.days) {
      throw new BackupFailure('empty');
    }
    return { ok: true, snapshot, summary: { ...counts, ignored } };
  } catch (e) {
    if (e instanceof BackupFailure) return { ok: false, error: e.code };
    throw e;
  }
}

export const BACKUP_ERROR_MESSAGES: Readonly<Record<BackupError, string>> = {
  format: 'Esse texto não parece um código de backup do Moji Dojo. Ele deve começar com NDJ1:.',
  encoding: 'O código parece estar cortado ou alterado. Copie de novo, inteiro, e cole aqui.',
  json: 'O código foi lido, mas o conteúdo está corrompido.',
  data: 'O código foi lido, mas não tem a forma de um backup do Moji Dojo.',
  empty: 'Esse backup não tem nenhum progresso salvo, então não há nada para importar.',
};
