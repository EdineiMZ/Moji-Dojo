import type { PhraseExample } from '@/data/types';
import { rubyOf } from '@/features/bank/bank';
import { kanaToRomaji } from '@/lib/romaji';

/** Só o que a busca usa do banco: o `SQLiteDatabase` do expo-sqlite cabe aqui, e os testes usam um banco em memória. */
export interface SentenceDb {
  getAllAsync<T>(sql: string, params: (string | number)[]): Promise<T[]>;
}

export interface SentenceRow {
  id: number;
  jp: string;
  furi: string;
  kana: string;
  pt: string;
  unknown: string;
}

export type SearchMode = 'jp' | 'pt';

export const PAGE_SIZE = 20;

const SELECT = 'SELECT id, jp, furi, kana, pt, unknown FROM sentences';
const KANJI = /[一-鿿]/u;
const PARTICLES = new Set(['は', 'へ', 'を']);

const toHiragana = (text: string): string => text.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));

/** Tira espaços e a pontuação: o índice guarda palavras soltas. */
export const normalizeQuery = (text: string): string => text.replace(/[\s　。、！？!?.,]/g, '');

/** "%" e "_" do texto digitado não podem virar curingas do LIKE. */
const escapeLike = (text: string): string => text.replace(/[\\%_]/g, (c) => `\\${c}`);

/** As chaves do índice para o que foi digitado: como está e em hiragana (a leitura é guardada em hiragana). */
export function searchKeys(text: string): string[] {
  const query = normalizeQuery(text);
  return query ? [...new Set([query, toHiragana(query)])] : [];
}

/** Uma página de frases que usam a palavra (japonês) ou que contêm o trecho (português), das mais curtas para as mais longas. */
export async function searchSentences(db: SentenceDb, mode: SearchMode, text: string, page = 0): Promise<SentenceRow[]> {
  const offset = page * PAGE_SIZE;
  if (mode === 'jp') {
    const keys = searchKeys(text);
    if (keys.length === 0) return [];
    const marks = keys.map(() => '?').join(', ');
    return db.getAllAsync<SentenceRow>(
      `${SELECT} WHERE id IN (SELECT sid FROM words WHERE key IN (${marks})) ORDER BY len, id LIMIT ? OFFSET ?`,
      [...keys, PAGE_SIZE, offset],
    );
  }
  const query = text.trim();
  if (query.length < 2) return [];
  return db.getAllAsync<SentenceRow>(`${SELECT} WHERE pt LIKE ? ESCAPE '\\' ORDER BY len, id LIMIT ? OFFSET ?`, [
    `%${escapeLike(query)}%`,
    PAGE_SIZE,
    offset,
  ]);
}

/** Frases sem palavra nova, sorteadas: para folhear sem saber o que procurar. */
export function randomSentences(db: SentenceDb): Promise<SentenceRow[]> {
  return db.getAllAsync<SentenceRow>(`${SELECT} WHERE unknown = '[]' ORDER BY random() LIMIT ?`, [PAGE_SIZE]);
}

export const romajiOf = (kana: string): string =>
  kana
    .split(' ')
    .map((word) => kanaToRomaji(word, { particle: PARTICLES.has(word) }))
    .join(' ');

/** As palavras que o banco marcou como fora do vocabulário do app ("palavra nova" na frase). */
export function newWords(row: SentenceRow): string[] {
  try {
    const list: unknown = JSON.parse(row.unknown);
    return Array.isArray(list) ? list.filter((w): w is string => typeof w === 'string') : [];
  } catch {
    return [];
  }
}

export function toExample(row: SentenceRow): PhraseExample {
  return {
    jp: row.jp,
    ...(KANJI.test(row.jp) ? { ruby: rubyOf(row.furi) } : {}),
    romaji: romajiOf(row.kana),
    pt: row.pt,
    say: row.kana.replace(/ /g, ''),
  };
}
