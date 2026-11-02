import { RENAMED_WORDS } from '@/content/renamedWords';
import type { SrsEntry, SrsState } from '@/features/review/srs';

const SEPARATOR = '|';

/** O novo id de um id de palavra (o mesmo, se a palavra nunca foi renomeada). */
export const currentWordId = (id: string): string => (Object.prototype.hasOwnProperty.call(RENAMED_WORDS, id) ? (RENAMED_WORDS[id] as string) : id);

/** Entre dois cartões da mesma palavra (a velha e a nova forma já estudadas), fica o revisado mais recentemente. */
export const freshestCard = (a: SrsEntry, b: SrsEntry): SrsEntry => ((a.t ?? 0) !== (b.t ?? 0) ? ((a.t ?? 0) > (b.t ?? 0) ? a : b) : a.b >= b.b ? a : b);

/** A chave de um cartão ("palavra|direção") com o id novo da palavra. */
export function migrateVocabKey(key: string): string {
  const at = key.lastIndexOf(SEPARATOR);
  if (at <= 0) return key;
  const id = key.slice(0, at);
  const next = currentWordId(id);
  return next === id ? key : `${next}${key.slice(at)}`;
}

/**
 * Passa os cartões de vocabulário ("palavra|direção") do id antigo para o novo. Devolve o mesmo objeto se nada mudou.
 */
export function migrateVocabCards(vocab: SrsState): SrsState {
  let changed = false;
  const out: Record<string, SrsEntry> = {};
  for (const [key, entry] of Object.entries(vocab)) {
    const newKey = migrateVocabKey(key);
    if (newKey !== key) changed = true;
    const existing = out[newKey];
    out[newKey] = existing ? freshestCard(existing, entry) : entry;
  }
  return changed ? out : vocab;
}

/** O mesmo para as historinhas por palavra. Se as duas formas têm historinha, vale a da forma nova. */
export function migrateWordNotes(notes: Readonly<Record<string, string>>): Readonly<Record<string, string>> {
  if (!Object.keys(notes).some((id) => currentWordId(id) !== id)) return notes;
  const out: Record<string, string> = {};
  for (const [id, text] of Object.entries(notes)) {
    const next = currentWordId(id);
    if (next === id) out[id] = text;
    else if (out[next] === undefined) out[next] = text;
  }
  return out;
}
