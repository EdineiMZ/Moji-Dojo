import { CONFIRMED } from '@/content/confirmed';

export type ConfidenceLevel = 'frase' | 'padrao' | 'pendente';

export interface Confidence {
  level: ConfidenceLevel;
  /** Uma linha curta para mostrar sob a frase. */
  label: string;
  /** De onde veio a confirmação (vazio se pendente). */
  source: string;
}

/**
 * O quanto o japonês de uma frase do app foi conferido em fontes abertas. As frases do app foram escritas por IA, então a
 * conferência diz o que já tem respaldo de falantes e o que ainda espera por revisão de uma pessoa.
 */
export function confidenceOf(jp: string): Confidence {
  const found = CONFIRMED[jp];
  if (found?.level === 'frase') {
    return { level: 'frase', label: '✓ Frase confirmada em exemplos de falantes', source: found.source };
  }
  if (found?.level === 'padrao') {
    return { level: 'padrao', label: '◐ Construção confirmada em exemplos de falantes', source: found.source };
  }
  return { level: 'pendente', label: 'Ainda sem confirmação em fontes: revisão de um falante pendente', source: '' };
}
