import { VOCAB, type VocabWord } from '@/content';

/**
 * Palavras "gêmeas": a lista inicial tem あさ e a lista do N5 tem 朝, as duas com a mesma leitura e o mesmo significado.
 * Estudar as duas seria estudar a mesma palavra duas vezes. A principal é a que tem kanji; as outras só aparecem para quem já
 * estudou aquela forma (o progresso antigo continua valendo) e nunca são oferecidas como "novas" junto com a principal.
 */
const groups = new Map<string, VocabWord[]>();
for (const w of VOCAB) {
  const key = `${w.reading}|${w.meaning}`;
  groups.set(key, [...(groups.get(key) ?? []), w]);
}

const rank = (w: VocabWord): number => (w.kanji.length > 0 ? 0 : w.group === 'Teclado' || w.group === 'Hiragana' ? 2 : 1);

const TWINS: ReadonlyMap<string, readonly VocabWord[]> = new Map(
  [...groups.values()]
    .filter((g) => g.length > 1)
    .flatMap((g) => {
      const ordered = [...g].sort((a, b) => rank(a) - rank(b));
      return ordered.map((w): [string, readonly VocabWord[]] => [w.id, ordered]);
    }),
);

/** As palavras que são a mesma palavra que esta (inclusive ela), a principal primeiro. */
export const twinsOf = (id: string): readonly VocabWord[] => TWINS.get(id) ?? [];

/** Esta forma é uma gêmea secundária (a principal é outra). */
export const isSecondaryTwin = (id: string): boolean => {
  const twins = TWINS.get(id);
  return twins !== undefined && twins[0]?.id !== id;
};

/** Quantas palavras distintas há para estudar (cada grupo de gêmeas conta uma vez). */
export const DISTINCT_WORDS: number = VOCAB.filter((w) => !isSecondaryTwin(w.id)).length;

/** O primeiro resultado de `lookup` para a palavra e, se não houver, para as suas gêmeas (os dados costumam estar na forma com kanji). */
export function fromTwins<T>(word: VocabWord, lookup: (w: VocabWord) => T | undefined): T | undefined {
  const own = lookup(word);
  if (own !== undefined) return own;
  for (const twin of twinsOf(word.id)) {
    if (twin.id === word.id) continue;
    const found = lookup(twin);
    if (found !== undefined) return found;
  }
  return undefined;
}
