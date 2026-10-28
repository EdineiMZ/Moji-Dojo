import type { SrsState } from '@/features/review/srs';

/** Acertos e erros acumulados de um caractere. */
export interface CharStats {
  c: number;
  w: number;
}

/**
 * Tudo que é salvo do progresso. Os nomes dos campos e as chaves (ids de lição,
 * caracteres) são os mesmos do formato antigo, o que permite importar o backup dele.
 */
export interface ProgressSnapshot {
  srs: SrsState;
  /** Lições concluídas, por id (ex.: "hira:L0"). */
  lessons: Readonly<Record<string, true>>;
  stats: Readonly<Record<string, CharStats>>;
  /** Dias de estudo, "AAAA-MM-DD". */
  days: readonly string[];
}

export const emptyProgress = (): ProgressSnapshot => ({ srs: {}, lessons: {}, stats: {}, days: [] });
