import type { StoredExam } from './aiStore';

export interface ExamAverage {
  attempts: number;
  /** Média de acertos de todas as tentativas guardadas (%). */
  pct: number;
  /** Melhor nota entre os simulados (%). */
  bestPct: number;
}

/** Resumo das notas dos simulados guardados; null enquanto nenhum foi feito. Tentativas antigas (sem lista de notas) contam pela melhor nota. */
export function examAverage(exams: readonly StoredExam[]): ExamAverage | null {
  let attempts = 0;
  let sum = 0;
  let bestPct = 0;
  for (const exam of exams) {
    const total = exam.questions.length;
    if (total === 0 || exam.best === null) continue;
    const scores = exam.scores && exam.scores.length > 0 ? exam.scores : [exam.best];
    for (const score of scores) {
      attempts++;
      sum += (score / total) * 100;
    }
    bestPct = Math.max(bestPct, Math.round((exam.best / total) * 100));
  }
  return attempts > 0 ? { attempts, pct: Math.round(sum / attempts), bestPct } : null;
}
