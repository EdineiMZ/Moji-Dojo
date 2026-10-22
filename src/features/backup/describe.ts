import { plural } from '@/lib/plural';
import type { ProgressCounts } from './backup';

/** Linhas do resumo mostrado antes de confirmar a importação ("2 lições concluídas", ...). */
export function describeCounts(counts: ProgressCounts): string[] {
  return [
    plural(counts.lessons, 'lição concluída', 'lições concluídas'),
    plural(counts.reviews, 'caractere na revisão', 'caracteres na revisão'),
    plural(counts.characters, 'caractere com histórico de acertos', 'caracteres com histórico de acertos'),
    plural(counts.days, 'dia de estudo', 'dias de estudo'),
  ];
}

/** Aviso sobre itens do código que não existem neste app; vazio quando não há nenhum. */
export function ignoredNote(ignored: number): string {
  if (ignored === 0) return '';
  return `${plural(ignored, 'item do código foi ignorado', 'itens do código foram ignorados')} por não existirem mais neste app.`;
}

export const hasProgress = (counts: ProgressCounts): boolean =>
  counts.lessons > 0 || counts.reviews > 0 || counts.characters > 0 || counts.days > 0;
