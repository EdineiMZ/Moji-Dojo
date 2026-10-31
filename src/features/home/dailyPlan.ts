export type PlanRoute = '/mixed' | '/review' | '/(tabs)/trail' | '/(tabs)/listen' | '/(tabs)/phrases';

export interface PlanStep {
  id: 'review' | 'new' | 'listen' | 'phrase';
  title: string;
  hint: string;
  done: boolean;
  /** Não há o que fazer neste passo (nada vencido e nenhuma revisão feita hoje): a tela mostra um aviso neutro, sem o selo de feito. */
  idle: boolean;
  route: PlanRoute;
}

export interface PlanInput {
  /** Contadores de hoje (`journey.today.counts`). */
  counts: Readonly<Record<string, number>>;
  /** Revisões vencidas de kana e de palavras/verbos/partículas. */
  dueKana: number;
  dueOther: number;
}

/** Respostas de revisão que fecham o passo "Revisar" quando há o que revisar. */
export const PLAN_REVIEW_GOAL = 10;

/**
 * A sessão do dia (uns 15 a 20 minutos): revisar, ver algo novo, ouvir e produzir uma frase. Cada passo é marcado pelo que já
 * foi feito hoje. Sem nada vencido, o passo de revisão conta como feito: não há o que revisar.
 */
export function dailyPlan({ counts, dueKana, dueOther }: PlanInput): PlanStep[] {
  const n = (key: string) => counts[key] ?? 0;
  const due = dueKana + dueOther;
  return [
    {
      id: 'review',
      title: 'Revisar o que venceu',
      hint: due > 0 ? `${due} para revisar` : 'Nada para revisar hoje',
      idle: due === 0 && n('reviews') === 0,
      done: due === 0 || n('reviews') >= Math.min(PLAN_REVIEW_GOAL, due + n('reviews')),
      // Com mais de um tipo vencido, a revisão mista intercala kana, palavras e verbos.
      route: dueKana > 0 && dueOther > 0 ? '/mixed' : dueKana > 0 ? '/review' : '/(tabs)/phrases',
    },
    {
      id: 'new',
      title: 'Aprender algo novo',
      hint: 'Uma lição da trilha ou palavras novas',
      idle: false,
      done: n('lessons') + n('newWords') > 0,
      route: '/(tabs)/trail',
    },
    {
      id: 'listen',
      title: 'Ouvir',
      hint: 'Um ditado, uma compreensão ou o shadowing',
      idle: false,
      done: n('listen') > 0 || n('speak') > 0,
      route: '/(tabs)/listen',
    },
    {
      id: 'phrase',
      title: 'Produzir uma frase',
      hint: 'Montar, traduzir ou escrever uma frase sua',
      idle: false,
      done: n('phrases') > 0 || n('translate') > 0,
      route: '/(tabs)/phrases',
    },
  ];
}
