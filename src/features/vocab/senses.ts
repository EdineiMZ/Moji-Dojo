import type { VocabWord } from '@/content';

/**
 * Sentidos de uma palavra, para o app nunca oferecer como alternativa errada um significado que também vale.
 * O `meaning` junta vários sentidos separados por ";" ("odioso; detestável"). Dois sentidos iguais depois de
 * normalizados (sem acento, sem maiúsculas, sem o que vem entre parênteses) são o mesmo sentido.
 */

/**
 * Palavras genéricas demais para provar que duas palavras significam o mesmo: "fazer" aparece em dezenas de verbos
 * sem que um sirva de resposta para o outro. Um sentido que é só uma delas não conta na comparação.
 */
export const GENERIC_SENSES: ReadonlySet<string> = new Set([
  'fazer', 'ser', 'estar', 'ter', 'haver', 'ir', 'vir', 'dar', 'ver', 'usar', 'pôr', 'por', 'deixar', 'ficar', 'tornar', 'tornar-se',
  'coisa', 'algo', 'alguem', 'alguém', 'pessoa', 'lugar', 'parte', 'tipo', 'forma', 'modo', 'jeito', 'maneira', 'caso',
  'muito', 'pouco', 'bem', 'mal', 'mais', 'menos', 'sim', 'nao', 'não',
  'isso', 'isto', 'aquilo', 'este', 'esta', 'esse', 'essa', 'aquele', 'aquela',
  'sufixo', 'prefixo', 'contador', 'de', 'a', 'o', 'e', 'em', 'um', 'uma',
].map((w) => normalizeSense(w)));

/** Minúsculas, sem acento, sem comentário entre parênteses, sem pontuação e com espaços simples. */
export function normalizeSense(sense: string): string {
  return sense
    .toLowerCase()
    .replace(/\([^)]*\)/gu, ' ')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim();
}

const cache = new Map<string, readonly string[]>();

/** Os sentidos de um significado, normalizados, sem repetição e sem os genéricos. */
export function senseKeys(meaning: string): readonly string[] {
  const cached = cache.get(meaning);
  if (cached) return cached;
  const keys = [...new Set(meaning.split(';').map(normalizeSense).filter((s) => s !== '' && !GENERIC_SENSES.has(s)))];
  cache.set(meaning, keys);
  return keys;
}

/** As duas palavras dividem ao menos um sentido (inteiro, já normalizado). */
export function sharesSense(a: Pick<VocabWord, 'meaning'>, b: Pick<VocabWord, 'meaning'>): boolean {
  if (a.meaning === b.meaning) return true;
  const keys = senseKeys(b.meaning);
  return senseKeys(a.meaning).some((k) => keys.includes(k));
}
