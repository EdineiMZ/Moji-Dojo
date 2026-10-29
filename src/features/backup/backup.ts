import { LESSONS } from '@/content/lessons';
import { findItem } from '@/features/catalog';
import type { CharStats, ProgressSnapshot } from '@/features/progress/types';
import { LAST_BOX, type SrsEntry } from '@/features/review/srs';
import { MAX_HISTORY_DAYS, type DayActivity } from '@/features/stats/metrics';
import { findWord } from '@/content';
import { sanitizeTyping } from '@/features/keyboard/typingStats';
import { sanitizeReads } from '@/features/reading/reads';
import { sanitizeJourney } from '@/features/journey/journey';
import { ALL_GRAMMAR } from '@/content/grammar';
import { MAX_MY_PHRASES, MAX_PHRASE_LENGTH, type MyPhrase } from '@/features/myphrases/phrases';
import { parseCardKey as parseVerbKey } from '@/features/conjugation/cards';
import { isParticleCard } from '@/features/cloze/particles';
import { learnedWordIds, parseCardKey } from '@/features/vocab/cards';
import { MAX_NOTE_LENGTH, type ProgressExtras, type ShadowRating } from '@/store/progressStore';

/**
 * Dois formatos, os dois "prefixo" + base64 de um JSON em UTF-8:
 * - "NDJ1:" é o backup do formato antigo (btoa(unescape(encodeURIComponent(JSON.stringify(store))))).
 *   Só os campos srs, lessons, stats e days são importados.
 * - "MDJ1:" é o backup do próprio app (exportBackup): além desses, histórico, autoavaliação do Repetir,
 *   desafios de digitação e vocabulário, com um campo `v` de versão. Campos novos entram como opcionais,
 *   então um código antigo continua valendo (sem o campo, vale vazio).
 */
/** Entrada de revisão lida do backup: caixa dentro dos limites e, se houver, o número de esquecimentos. */
function srsEntry(b: number, due: number, lapses: unknown, fsrs?: Record<string, unknown>): SrsEntry {
  const l = isCount(lapses) ? Math.min(Math.round(lapses), 99) : 0;
  // Os campos do FSRS (estabilidade, dificuldade e a última revisão) só entram se forem números plausíveis; senão o cartão
  // volta ao agendamento pela caixa, como num backup antigo.
  const s = fsrs?.s;
  const d = fsrs?.d;
  const t = fsrs?.t;
  const memory =
    typeof s === 'number' && Number.isFinite(s) && s > 0 && s <= 36500 && typeof d === 'number' && Number.isFinite(d) && d >= 1 && d <= 10 && isCount(t)
      ? { s, d, t }
      : {};
  return { b: Math.min(Math.max(Math.round(b), 1), LAST_BOX), due, ...(l > 0 ? { l } : {}), ...memory };
}

export const BACKUP_PREFIX = 'NDJ1:';
export const APP_BACKUP_PREFIX = 'MDJ1:';
/** Versão do formato MDJ1; quem lê recusa versões maiores (de um app mais novo). */
export const APP_BACKUP_VERSION = 1;
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
  /** Palavras de vocabulário no backup (só nos códigos do app). */
  words?: number;
  /** Frases próprias no backup (só nos códigos do app). */
  phrases?: number;
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
 * - version: backup do app gerado por uma versão mais nova que esta
 * - empty: backup válido, porém sem nenhum progresso
 */
export type BackupError = 'format' | 'encoding' | 'json' | 'data' | 'version' | 'empty';

export type BackupParseResult =
  | {
      ok: true;
      snapshot: ProgressSnapshot;
      summary: BackupSummary;
      /** "prototype" = NDJ1 (HTML); "app" = MDJ1 (este app). */
      source: 'prototype' | 'app';
      /** Só nos backups do app. */
      extras?: ProgressExtras;
    }
  | { ok: false; error: BackupError };

class BackupFailure extends Error {
  constructor(readonly code: BackupError) {
    super(code);
  }
}

/** Texto binário (um byte por caractere) → string UTF-8. */
export function decodeUtf8(binary: string): string {
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

function decodePayload(code: string): { root: unknown; source: 'prototype' | 'app' } {
  const clean = code.replace(/\s+/g, '');
  const source = clean.startsWith(BACKUP_PREFIX) ? 'prototype' : clean.startsWith(APP_BACKUP_PREFIX) ? 'app' : null;
  if (!source) throw new BackupFailure('format');
  const base64 = clean.slice(BACKUP_PREFIX.length); // os dois prefixos têm o mesmo tamanho
  if (!base64 || base64.length % 4 !== 0 || !BASE64_FORMAT.test(base64)) throw new BackupFailure('encoding');
  let json: string;
  try {
    json = decodeUtf8(atob(base64));
  } catch (e) {
    throw e instanceof BackupFailure ? e : new BackupFailure('encoding');
  }
  try {
    return { root: JSON.parse(json) as unknown, source };
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

const RATINGS: readonly ShadowRating[] = ['ok', 'mid', 'bad'];

/** Histórico, autoavaliação e desafios do backup do app; o que não tem a forma certa é descartado. */
function parseExtras(root: Record<string, unknown>): { value: ProgressExtras; ignored: number } {
  let ignored = 0;

  const history: Record<string, DayActivity> = {};
  for (const [day, v] of Object.entries(recordField(root, 'history'))) {
    if (!DAY_FORMAT.test(day) || !isRecord(v) || !isCount(v.answers) || !isCount(v.correct) || !isCount(v.learned)) {
      ignored++;
      continue;
    }
    history[day] = { answers: Math.floor(v.answers), correct: Math.floor(v.correct), learned: Math.floor(v.learned) };
  }
  const keptDays = Object.keys(history).sort().slice(-MAX_HISTORY_DAYS);
  const recent = Object.fromEntries(keptDays.map((day) => [day, history[day] as DayActivity]));

  const shadow: Record<string, ShadowRating> = {};
  for (const [phrase, v] of Object.entries(recordField(root, 'shadow'))) {
    if (typeof v !== 'string' || !RATINGS.includes(v as ShadowRating)) {
      ignored++;
      continue;
    }
    shadow[phrase] = v as ShadowRating;
  }

  const challenges: Record<string, true> = {};
  for (const [word, v] of Object.entries(recordField(root, 'challenges'))) {
    if (v !== true) {
      ignored++;
      continue;
    }
    challenges[word] = true;
  }

  const vocab: Record<string, SrsEntry> = {};
  for (const [key, v] of Object.entries(recordField(root, 'vocab'))) {
    if (!parseCardKey(key) || !isRecord(v) || !isCount(v.b) || !isCount(v.due)) {
      ignored++;
      continue;
    }
    vocab[key] = srsEntry(v.b, v.due, v.l, v);
  }

  const conj: Record<string, SrsEntry> = {};
  for (const [key, v] of Object.entries(recordField(root, 'conj'))) {
    if (!parseVerbKey(key) || !isRecord(v) || !isCount(v.b) || !isCount(v.due)) {
      ignored++;
      continue;
    }
    conj[key] = srsEntry(v.b, v.due, v.l, v);
  }

  const particles: Record<string, SrsEntry> = {};
  for (const [key, v] of Object.entries(recordField(root, 'particles'))) {
    if (!isParticleCard(key) || !isRecord(v) || !isCount(v.b) || !isCount(v.due)) {
      ignored++;
      continue;
    }
    particles[key] = srsEntry(v.b, v.due, v.l, v);
  }

  const wordNotes: Record<string, string> = {};
  for (const [id, v] of Object.entries(recordField(root, 'wordNotes'))) {
    if (!findWord(id) || typeof v !== 'string' || v.trim().length === 0 || v.length > MAX_NOTE_LENGTH) {
      ignored++;
      continue;
    }
    wordNotes[id] = v.trim();
  }

  const journey = sanitizeJourney(root.journey);

  const knownTopics = new Set(ALL_GRAMMAR.map((t) => t.id));
  const mastered: Record<string, number> = {};
  for (const [topic, at] of Object.entries(recordField(root, 'mastered'))) {
    if (!knownTopics.has(topic) || !isCount(at)) {
      ignored++;
      continue;
    }
    mastered[topic] = at;
  }

  const myPhrases: Record<string, MyPhrase> = {};
  for (const [id, v] of Object.entries(recordField(root, 'myPhrases'))) {
    const valid =
      id.length > 0 && id.length <= 40 && isRecord(v) &&
      typeof v.jp === 'string' && v.jp.trim().length > 0 && v.jp.length <= MAX_PHRASE_LENGTH &&
      typeof v.pt === 'string' && v.pt.trim().length > 0 && v.pt.length <= MAX_PHRASE_LENGTH &&
      isCount(v.at) && isCount(v.b) && isCount(v.due);
    if (!valid || Object.keys(myPhrases).length >= MAX_MY_PHRASES) {
      ignored++;
      continue;
    }
    const phrase = v as Record<string, unknown>;
    myPhrases[id] = {
      jp: (phrase.jp as string).trim(),
      pt: (phrase.pt as string).trim(),
      at: phrase.at as number,
      b: Math.min(Math.max(Math.round(phrase.b as number), 1), LAST_BOX),
      due: phrase.due as number,
    };
  }

  return { value: { history: recent, shadow, challenges, vocab, conj, particles, wordNotes, journey, mastered, myPhrases, typing: sanitizeTyping(root.typing), reads: sanitizeReads(root.reads) }, ignored };
}

/**
 * Valida o código e devolve o progresso já limpo: só caracteres e lições que
 * existem neste app, com valores no intervalo certo. Não altera nada salvo.
 */
export function parseBackup(code: string): BackupParseResult {
  try {
    const { root, source } = decodePayload(code);
    if (!isRecord(root)) throw new BackupFailure('data');
    if (source === 'app') {
      if (typeof root.v !== 'number') throw new BackupFailure('data');
      if (root.v > APP_BACKUP_VERSION) throw new BackupFailure('version');
    }
    const fields = ['srs', 'lessons', 'stats', 'days'];
    if (!fields.some((f) => f in root)) throw new BackupFailure('data');

    let ignored = 0;

    const srs: Record<string, SrsEntry> = {};
    for (const [char, v] of Object.entries(recordField(root, 'srs'))) {
      if (!findItem(char) || !isRecord(v) || !isCount(v.b) || !isCount(v.due)) {
        ignored++;
        continue;
      }
      srs[char] = srsEntry(v.b, v.due, v.l, v);
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
    if (source === 'prototype') return { ok: true, snapshot, summary: { ...counts, ignored }, source };
    const extras = parseExtras(root);
    return {
      ok: true,
      snapshot,
      summary: { ...counts, ignored: ignored + extras.ignored, words: learnedWordIds(extras.value.vocab).size, phrases: Object.keys(extras.value.myPhrases).length },
      source,
      extras: extras.value,
    };
  } catch (e) {
    if (e instanceof BackupFailure) return { ok: false, error: e.code };
    throw e;
  }
}

export const BACKUP_ERROR_MESSAGES: Readonly<Record<BackupError, string>> = {
  format: 'Esse texto não parece um código de backup do Moji Dojo. Ele deve começar com MDJ1: (do app) ou NDJ1: (formato antigo).',
  encoding: 'O código parece estar cortado ou alterado. Copie de novo, inteiro, e cole aqui.',
  json: 'O código foi lido, mas o conteúdo está corrompido.',
  data: 'O código foi lido, mas não tem a forma de um backup do Moji Dojo.',
  version: 'Esse backup foi gerado por uma versão mais nova do Moji Dojo. Atualize o app e tente de novo.',
  empty: 'Esse backup não tem nenhum progresso salvo, então não há nada para importar.',
};

/** Texto → texto binário (um byte por caractere) em UTF-8; o inverso de decodeUtf8. */
export function encodeUtf8(text: string): string {
  let out = '';
  for (const ch of text) {
    const cp = ch.codePointAt(0) as number;
    if (cp < 0x80) out += String.fromCharCode(cp);
    else if (cp < 0x800) out += String.fromCharCode(0xc0 | (cp >> 6), 0x80 | (cp & 0x3f));
    else if (cp < 0x10000) out += String.fromCharCode(0xe0 | (cp >> 12), 0x80 | ((cp >> 6) & 0x3f), 0x80 | (cp & 0x3f));
    else out += String.fromCharCode(0xf0 | (cp >> 18), 0x80 | ((cp >> 12) & 0x3f), 0x80 | ((cp >> 6) & 0x3f), 0x80 | (cp & 0x3f));
  }
  return out;
}

/**
 * Gera o código de backup do app ("MDJ1:...") com todo o progresso; `parseBackup` lê o resultado de volta.
 * Funciona sem internet, e o código pode ser guardado em qualquer lugar (notas, e-mail, nuvem).
 */
export function exportBackup(progress: ProgressSnapshot & ProgressExtras, now: Date = new Date()): string {
  const payload = {
    v: APP_BACKUP_VERSION,
    app: 'moji-dojo',
    at: now.toISOString(),
    srs: progress.srs,
    lessons: progress.lessons,
    stats: progress.stats,
    days: progress.days,
    history: progress.history,
    shadow: progress.shadow,
    challenges: progress.challenges,
    vocab: progress.vocab,
    conj: progress.conj,
    particles: progress.particles,
    wordNotes: progress.wordNotes,
    journey: progress.journey,
    mastered: progress.mastered,
    myPhrases: progress.myPhrases,
    typing: progress.typing,
    reads: progress.reads,
  };
  return APP_BACKUP_PREFIX + btoa(encodeUtf8(JSON.stringify(payload)));
}
