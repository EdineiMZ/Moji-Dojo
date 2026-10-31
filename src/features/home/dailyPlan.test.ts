import { dailyPlan } from './dailyPlan';

describe('sessão diária', () => {
  it('sem nada feito, os quatro passos estão abertos e a revisão leva ao kana quando há kana vencido', () => {
    const plan = dailyPlan({ counts: {}, dueKana: 12, dueOther: 3 });
    expect(plan.map((s) => s.done)).toEqual([false, false, false, false]);
    expect(plan[0]?.route).toBe('/mixed');
    expect(dailyPlan({ counts: {}, dueKana: 12, dueOther: 0 })[0]?.route).toBe('/review');
    expect(plan[0]?.hint).toBe('15 para revisar');
  });

  it('sem nada vencido o passo de revisão já conta como feito', () => {
    expect(dailyPlan({ counts: {}, dueKana: 0, dueOther: 0 })[0]?.done).toBe(true);
  });

  it('cada passo fecha pelo que foi feito hoje', () => {
    const plan = dailyPlan({ counts: { reviews: 10, newWords: 2, listen: 1, translate: 1 }, dueKana: 5, dueOther: 0 });
    expect(plan.every((s) => s.done)).toBe(true);
  });

  it('poucas revisões feitas ainda deixam o passo aberto, mas poucas vencidas bastam', () => {
    expect(dailyPlan({ counts: { reviews: 3 }, dueKana: 20, dueOther: 0 })[0]?.done).toBe(false);
    expect(dailyPlan({ counts: { reviews: 3 }, dueKana: 0, dueOther: 0 })[0]?.done).toBe(true);
  });
});

describe('passo de revisão sem nada a revisar', () => {
  it('fica neutro (idle), sem contar como feito pelo aluno, quando nada venceu e nada foi revisado', () => {
    const step = dailyPlan({ counts: {}, dueKana: 0, dueOther: 0 })[0];
    expect(step?.idle).toBe(true);
    expect(step?.hint).toBe('Nada para revisar hoje');
  });

  it('não é idle quando há revisão vencida ou já feita hoje', () => {
    expect(dailyPlan({ counts: {}, dueKana: 4, dueOther: 0 })[0]?.idle).toBe(false);
    expect(dailyPlan({ counts: { reviews: 5 }, dueKana: 0, dueOther: 0 })[0]?.idle).toBe(false);
  });
});
