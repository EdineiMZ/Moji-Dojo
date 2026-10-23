import {
  answerReview,
  boostSkippedItems,
  dueChars,
  DAY_MS,
  learnItems,
  shouldApplyReviewAnswer,
  intervalFactor,
  isLeech,
  upcomingReviews,
  type SrsState,
} from './srs';

// Data fixa: 22/10/2026 às 10:00 (fuso local).
const NOW = new Date(2026, 9, 22, 10, 0, 0).getTime();

describe('learnItems', () => {
  it('põe caracteres novos na caixa 1, vencendo amanhã', () => {
    expect(learnItems({}, ['あ', 'い'], NOW)).toEqual({
      あ: { b: 1, due: NOW + DAY_MS },
      い: { b: 1, due: NOW + DAY_MS },
    });
  });

  it('não mexe em quem já está na revisão', () => {
    const srs: SrsState = { あ: { b: 4, due: NOW + 7 * DAY_MS } };
    expect(learnItems(srs, ['あ'], NOW)).toEqual(srs);
  });

  it('não altera o objeto original', () => {
    const srs: SrsState = {};
    learnItems(srs, ['あ'], NOW);
    expect(srs).toEqual({});
  });
});

describe('boostSkippedItems', () => {
  it('leva a caixa 1 para a 2, com revisão em 3 dias', () => {
    const srs = learnItems({}, ['あ'], NOW);
    expect(boostSkippedItems(srs, ['あ'], NOW).あ).toEqual({ b: 2, due: NOW + 3 * DAY_MS });
  });

  it('não rebaixa quem já está numa caixa maior', () => {
    const srs: SrsState = { あ: { b: 3, due: NOW + DAY_MS } };
    expect(boostSkippedItems(srs, ['あ'], NOW)).toEqual(srs);
  });
});

describe('answerReview', () => {
  const start = { b: 1, due: NOW };

  it('acerto de primeira sobe a caixa e usa o intervalo 1, 3, 7, 14, 30, 60 dias', () => {
    const days = [3, 7, 14, 30, 60]; // caixas 2 a 6
    let entry = start;
    for (const d of days) {
      entry = answerReview(entry, true, false, NOW);
      expect(entry.due).toBe(NOW + d * DAY_MS);
    }
    expect(entry.b).toBe(6);
  });

  it('na última caixa continua em 60 dias', () => {
    expect(answerReview({ b: 6, due: NOW }, true, false, NOW)).toEqual({ b: 6, due: NOW + 60 * DAY_MS });
  });

  it('erro volta para a caixa 1 e vence agora', () => {
    expect(answerReview({ b: 5, due: NOW }, false, false, NOW)).toEqual({ b: 1, due: NOW, l: 1 });
  });

  it('acerto depois de errar na sessão: caixa 1, vence amanhã', () => {
    expect(answerReview({ b: 5, due: NOW }, true, true, NOW)).toEqual({ b: 1, due: NOW + DAY_MS, l: 1 });
  });
});

describe('shouldApplyReviewAnswer', () => {
  it('revisão normal sempre reagenda', () => {
    expect(shouldApplyReviewAnswer(false, true, true)).toBe(true);
    expect(shouldApplyReviewAnswer(false, false, true)).toBe(true);
  });

  it('revisão extra só reagenda erros e repetições', () => {
    expect(shouldApplyReviewAnswer(true, true, true)).toBe(false);
    expect(shouldApplyReviewAnswer(true, false, true)).toBe(true);
    expect(shouldApplyReviewAnswer(true, true, false)).toBe(true);
  });
});

describe('dueChars', () => {
  const srs: SrsState = {
    あ: { b: 2, due: NOW - DAY_MS },
    い: { b: 1, due: NOW - 3 * DAY_MS },
    う: { b: 1, due: NOW }, // vence exatamente agora: conta
    え: { b: 1, due: NOW + 1 },
  };

  it('lista só os vencidos, do mais atrasado ao menos', () => {
    expect(dueChars(srs, NOW)).toEqual(['い', 'あ', 'う']);
  });

  it('ignora chaves desconhecidas', () => {
    expect(dueChars(srs, NOW, (c) => c !== 'い')).toEqual(['あ', 'う']);
  });
});

describe('upcomingReviews', () => {
  it('é null quando nada está agendado para o futuro', () => {
    expect(upcomingReviews({}, NOW)).toBeNull();
    expect(upcomingReviews({ あ: { b: 1, due: NOW - 1 } }, NOW)).toBeNull();
  });

  it('acha a próxima e conta quantas vencem no mesmo dia', () => {
    const tomorrow = new Date(2026, 9, 23, 9, 0, 0).getTime();
    const tomorrowLate = new Date(2026, 9, 23, 20, 0, 0).getTime();
    const later = new Date(2026, 9, 25, 9, 0, 0).getTime();
    const srs: SrsState = {
      あ: { b: 1, due: NOW - DAY_MS }, // já vencida: fora da conta
      い: { b: 1, due: tomorrowLate },
      う: { b: 1, due: tomorrow },
      え: { b: 2, due: later },
    };
    expect(upcomingReviews(srs, NOW)).toEqual({ at: tomorrow, count: 2 });
  });
});

describe('esquecimentos e itens teimosos', () => {
  it('cada esquecimento encolhe o intervalo em 10%, até 40%', () => {
    expect([0, 1, 2, 4, 9].map(intervalFactor)).toEqual([1, 0.9, 0.8, 0.6, 0.6]);
    const forgetful = answerReview({ b: 4, due: NOW, l: 4 }, true, false, NOW); // caixa 5: 30 dias x 0,6
    expect(forgetful.due).toBe(NOW + 18 * DAY_MS);
  });

  it('chegar à caixa firme sem tropeçar perdoa um esquecimento', () => {
    expect(answerReview({ b: 2, due: NOW, l: 2 }, true, false, NOW).l).toBe(1);
    expect(answerReview({ b: 2, due: NOW, l: 1 }, true, false, NOW).l).toBeUndefined();
  });

  it('teimoso: 4 esquecimentos e ainda nas caixas 1 e 2', () => {
    expect(isLeech({ b: 1, due: NOW, l: 4 })).toBe(true);
    expect(isLeech({ b: 3, due: NOW, l: 4 })).toBe(false);
    expect(isLeech({ b: 1, due: NOW, l: 3 })).toBe(false);
  });
});
