/**
 * Palavras cuja escrita foi corrigida (e que por isso ganharam outro id): id antigo → id novo. Quem já tinha cartões ou
 * historinhas com o id antigo mantém tudo: ver `migrateRenamedWords` (features/vocab/renamed.ts). Espelho de
 * `RENAMED_WORDS` em scripts/vocabFixes.cjs (um teste confere que os dois são iguais).
 */
export const RENAMED_WORDS: Readonly<Record<string, string>> = {
  伯父: '伯父さん',
  堅: '堅い',
  摩する: '摩る',
  田ぼ: '田んぼ',
};
