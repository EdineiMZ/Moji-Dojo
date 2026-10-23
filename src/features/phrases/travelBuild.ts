import { ALL_TRAVEL } from '@/content/travel';
import type { BuildExercise } from '@/data/types';

/** Prefixo do "tópico" de uma categoria de viagem no Montar (ex.: "t:Restaurante"). */
export const TRAVEL_TOPIC = 't:';
export const ALL_TRAVEL_TOPIC = 't:*';

const MIN_BLOCKS = 3;
const MAX_BLOCKS = 8;

/** As trocas que mais se confundem com cada partícula (as mesmas dos tópicos de gramática). */
const CONFUSABLE: Readonly<Record<string, readonly string[]>> = {
  は: ['を', 'も', 'の'],
  を: ['に', 'は', 'で'],
  に: ['で', 'を', 'は'],
  へ: ['で', 'を', 'は'],
  で: ['に', 'を', 'は'],
  の: ['は', 'を', 'に'],
  も: ['は', 'を', 'に'],
  と: ['も', 'に', 'を'],
  が: ['に', 'で', 'の'],
  から: ['まで', 'に', 'で'],
  まで: ['から', 'に', 'で'],
};
const GENERIC = ['を', 'に', 'で', 'は', 'の', 'も', 'と'];

/** Dois blocos a mais: partículas que se confundem com as da frase (sem trocar に por へ, que servem para destino). */
function extrasFor(answer: readonly string[]): string[] {
  const blocked = new Set(answer);
  if (answer.includes('に') || answer.includes('へ')) {
    blocked.add('に');
    blocked.add('へ');
  }
  const candidates = [...answer.flatMap((t) => CONFUSABLE[t] ?? []), ...GENERIC];
  const extra: string[] = [];
  for (const c of candidates) {
    if (extra.length === 2) break;
    if (!blocked.has(c) && !extra.includes(c)) extra.push(c);
  }
  return extra;
}

/**
 * Exercícios de montar a partir das frases de viagem: os blocos são os pedaços do "Palavra por palavra", então não há japonês
 * novo aqui. Ficam de fora frases curtas demais (menos de 3 blocos), longas demais e as que têm duas versões ("はい / いいえ").
 */
export function travelExercises(): BuildExercise[] {
  return ALL_TRAVEL.flatMap((category) =>
    category.phrases.flatMap((phrase): BuildExercise[] => {
      if (phrase.jp.includes('/')) return [];
      const answer = phrase.breakdown.map((b) => b.part.replace(/ /g, ''));
      if (answer.length < MIN_BLOCKS || answer.length > MAX_BLOCKS) return [];
      if (answer.join('') !== phrase.jp.replace(/ /g, '')) return [];
      return [
        {
          topic: `${TRAVEL_TOPIC}${category.category}`,
          pt: phrase.pt,
          answer,
          extra: extrasFor(answer),
          romaji: phrase.romaji,
          hint: `Frase de viagem (${category.category}).`,
        },
      ];
    }),
  );
}

let cache: BuildExercise[] | null = null;
export const TRAVEL_EXERCISES = (): BuildExercise[] => (cache ??= travelExercises());

/** Categorias de viagem que têm exercício, na ordem das abas de Viagem. */
export const travelTopics = (): { value: string; label: string }[] => {
  const have = new Set(TRAVEL_EXERCISES().map((e) => e.topic));
  return ALL_TRAVEL.filter((c) => have.has(`${TRAVEL_TOPIC}${c.category}`)).map((c) => ({ value: `${TRAVEL_TOPIC}${c.category}`, label: c.category }));
};
