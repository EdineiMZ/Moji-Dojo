import { findItem, type StudyItem } from '@/features/catalog';
import { shuffle, type Question, type Rng } from '@/features/quiz/quiz';

/**
 * Confusões: "o que era" → "o que você marcou" → quantas vezes. Com isso o app monta sozinho a lista de pares
 * problemáticos (さ e ち) e um exercício só deles.
 */
export type Confusions = Readonly<Record<string, Readonly<Record<string, number>>>>;

/** Quantos pares diferentes o treino usa de cada vez. */
export const CONFUSION_PAIRS = 8;
/** Máximo de caracteres diferentes guardados (o backup não cresce sem limite). */
const MAX_KEYS = 300;
const MAX_COUNT = 999;

const isKana = (c: string): boolean => {
  const item = findItem(c);
  return item !== undefined && (item.script === 'hira' || item.script === 'kata');
};

/** Soma uma confusão. Só vale kana trocado por outro kana da mesma escrita; o resto é ignorado. */
export function addConfusion(confusions: Confusions, correct: string, chosen: string): Confusions {
  if (correct === chosen || !isKana(correct) || !isKana(chosen)) return confusions;
  if (findItem(correct)?.script !== findItem(chosen)?.script) return confusions;
  const row = confusions[correct] ?? {};
  const next = { ...confusions, [correct]: { ...row, [chosen]: Math.min(MAX_COUNT, (row[chosen] ?? 0) + 1) } };
  const keys = Object.keys(next);
  if (keys.length > MAX_KEYS) delete next[keys[0] as string];
  return next;
}

export interface ConfusedPair {
  a: string;
  b: string;
  /** Quantas vezes um foi trocado pelo outro (nos dois sentidos). */
  count: number;
}

/** Pares mais confundidos, do maior para o menor; a ordem dentro do par é estável. */
export function confusedPairs(confusions: Confusions, limit: number = CONFUSION_PAIRS): ConfusedPair[] {
  const merged = new Map<string, ConfusedPair>();
  for (const [correct, row] of Object.entries(confusions)) {
    for (const [chosen, n] of Object.entries(row)) {
      if (!(n > 0) || !isKana(correct) || !isKana(chosen)) continue;
      const [a, b] = correct < chosen ? [correct, chosen] : [chosen, correct];
      const key = `${a}|${b}`;
      const prev = merged.get(key);
      merged.set(key, { a, b, count: (prev?.count ?? 0) + n });
    }
  }
  return [...merged.values()].sort((x, y) => y.count - x.count || (x.a + x.b).localeCompare(y.a + y.b)).slice(0, limit);
}

/**
 * Uma pergunta por par, lado a lado: mostra o som (r2k) e a pessoa escolhe entre os dois.
 * Com `rounds` 2, cada par aparece com os dois lados como resposta certa.
 */
export function buildConfusedQuestions(pairs: readonly ConfusedPair[], rng: Rng = Math.random, rounds = 1): Question[] {
  const questions: Question[] = [];
  for (const { a, b } of pairs) {
    const ia = findItem(a);
    const ib = findItem(b);
    if (!ia || !ib || ia.label === ib.label) continue;
    const order: [StudyItem, StudyItem][] = [
      [ia, ib],
      [ib, ia],
    ];
    const first = rng() < 0.5 ? 0 : 1;
    for (let r = 0; r < rounds; r++) {
      const [item, other] = order[(first + r) % 2] as [StudyItem, StudyItem];
      questions.push({ item, direction: 'r2k', options: shuffle([item, other], rng), retry: false });
    }
  }
  return shuffle(questions, rng);
}

/** Lê o que veio do disco ou do backup: só pares de kana conhecidos, contagens inteiras e positivas. */
export function sanitizeConfusions(raw: unknown): Confusions {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return {};
  const out: Record<string, Record<string, number>> = {};
  for (const [correct, row] of Object.entries(raw as Record<string, unknown>)) {
    if (!isKana(correct) || typeof row !== 'object' || row === null || Array.isArray(row)) continue;
    const clean: Record<string, number> = {};
    for (const [chosen, n] of Object.entries(row as Record<string, unknown>)) {
      if (chosen === correct || !isKana(chosen) || typeof n !== 'number' || !Number.isFinite(n) || n < 1) continue;
      clean[chosen] = Math.min(MAX_COUNT, Math.floor(n));
    }
    if (Object.keys(clean).length > 0) out[correct] = clean;
  }
  return out;
}
