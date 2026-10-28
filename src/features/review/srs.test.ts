import {
  answerReview,
  boostSkippedItems,
  dueChars,
  DAY_MS,
  learnItems,
  shouldApplyReviewAnswer,
  boxFor,
  isLeech,
  upcomingReviews,
  type SrsEntry,
  type SrsState,
} from './srs';
import { sanitizeRetention, setRetention } from './retention';

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

describe('answerReview (FSRS)', () => {
  /** Responde de primeira, no dia em que vence, `n` vezes seguidas. */
  const streak = (n: number) => {
    let entry: SrsEntry = { b: 1, due: NOW };
    let at = NOW;
    const dues: number[] = [];
    for (let i = 0; i < n; i++) {
      entry = answerReview(entry, true, false, at);
      dues.push(Math.round((entry.due - at) / DAY_MS));
      at = entry.due;
    }
    return { entry, dues };
  };

  it('acertos seguidos, no dia em que vencem, espaçam cada vez mais', () => {
    const { dues } = streak(5);
    for (let i = 1; i < dues.length; i++) expect(dues[i]!).toBeGreaterThan(dues[i - 1]!);
    expect(dues[0]).toBe(3);
  });

  it('a caixa acompanha o intervalo e nunca passa de 6', () => {
    const { entry } = streak(14);
    expect(entry.b).toBe(6);
    expect(boxFor(1)).toBe(1);
    expect(boxFor(3)).toBe(2);
    expect(boxFor(7)).toBe(3);
    expect(boxFor(14)).toBe(4);
    expect(boxFor(30)).toBe(5);
    expect(boxFor(400)).toBe(6);
  });

  it('o intervalo tem um teto de um ano', () => {
    const { dues } = streak(40);
    expect(Math.max(...dues)).toBeLessThanOrEqual(365);
  });

  it('erro volta para a caixa 1, vence agora e guarda o esquecimento', () => {
    const next = answerReview({ b: 5, due: NOW }, false, false, NOW);
    expect(next).toMatchObject({ b: 1, due: NOW, l: 1, t: NOW });
    expect(next.s).toBeGreaterThan(0);
  });

  it('acerto depois de errar na sessão vence em pelo menos um dia e em poucos', () => {
    const wrong = answerReview({ b: 5, due: NOW }, false, false, NOW);
    const next = answerReview(wrong, true, true, NOW);
    expect(next.due - NOW).toBeGreaterThanOrEqual(DAY_MS);
    expect(next.b).toBeLessThanOrEqual(2);
    expect(next.l).toBe(2);
  });

  it('errar deixa o cartão mais difícil e acertar de primeira, menos', () => {
    const base = answerReview({ b: 4, due: NOW }, true, false, NOW);
    const hard = answerReview(base, false, false, base.due);
    const easy = answerReview(base, true, false, base.due);
    expect(hard.d!).toBeGreaterThan(base.d!);
    expect(easy.d!).toBeLessThanOrEqual(base.d!);
  });

  it('o cartão difícil é espaçado menos que o fácil', () => {
    const easy = { b: 3, due: NOW, s: 10, d: 2, t: NOW - 10 * DAY_MS };
    const hard = { b: 3, due: NOW, s: 10, d: 9, t: NOW - 10 * DAY_MS };
    expect(answerReview(easy, true, false, NOW).due).toBeGreaterThan(answerReview(hard, true, false, NOW).due);
  });

  it('revisar atrasado rende um intervalo maior que revisar em dia', () => {
    const card = { b: 3, due: NOW, s: 10, d: 5, t: NOW - 10 * DAY_MS };
    const onTime = answerReview(card, true, false, NOW);
    const late = answerReview(card, true, false, NOW + 20 * DAY_MS);
    expect((late.due - (NOW + 20 * DAY_MS))).toBeGreaterThan(onTime.due - NOW);
  });

  it('um cartão do agendamento antigo (só caixa e data) segue funcionando', () => {
    const next = answerReview({ b: 4, due: NOW }, true, false, NOW);
    expect(next.s).toBeGreaterThan(14);
    expect(next.b).toBeGreaterThanOrEqual(4);
    expect(next.t).toBe(NOW);
  });

  it('na revisão do mesmo dia o espaçamento mal muda', () => {
    const first = answerReview({ b: 3, due: NOW }, true, false, NOW);
    const again = answerReview(first, true, false, NOW + 60_000);
    expect(again.s!).toBeLessThanOrEqual(first.s! * 1.5);
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
  it('chegar à caixa firme sem tropeçar perdoa um esquecimento', () => {
    expect(answerReview({ b: 3, due: NOW, l: 2 }, true, false, NOW).l).toBe(1);
    expect(answerReview({ b: 3, due: NOW, l: 1 }, true, false, NOW).l).toBeUndefined();
  });

  it('teimoso: 4 esquecimentos e ainda nas caixas 1 e 2', () => {
    expect(isLeech({ b: 1, due: NOW, l: 4 })).toBe(true);
    expect(isLeech({ b: 3, due: NOW, l: 4 })).toBe(false);
    expect(isLeech({ b: 1, due: NOW, l: 3 })).toBe(false);
  });

  it('quem esquece muito volta mais cedo que quem nunca esqueceu', () => {
    const calm = answerReview({ b: 4, due: NOW }, true, false, NOW);
    const forgetful = answerReview({ b: 4, due: NOW, l: 6 }, true, false, NOW);
    expect(forgetful.due).toBeLessThan(calm.due);
  });
});

describe('retenção desejada', () => {
  const mature: SrsEntry = { b: 4, due: NOW, s: 20, d: 5, t: NOW - 20 * DAY_MS };

  it('retenção mais alta agenda a volta mais cedo, e a mais baixa, mais tarde', () => {
    const at = (retention: number) => answerReview(mature, true, false, NOW, retention).due;
    expect(at(0.95)).toBeLessThan(at(0.9));
    expect(at(0.9)).toBeLessThan(at(0.8));
  });

  it('sem informar, usa a retenção dos Ajustes (padrão 90%)', () => {
    expect(answerReview(mature, true, false, NOW).due).toBe(answerReview(mature, true, false, NOW, 0.9).due);
    setRetention(0.8);
    expect(answerReview(mature, true, false, NOW).due).toBe(answerReview(mature, true, false, NOW, 0.8).due);
    setRetention(0.9);
  });

  it('só aceita as opções conhecidas', () => {
    expect(sanitizeRetention(0.85)).toBe(0.85);
    expect(sanitizeRetention(0.5)).toBe(0.9);
    expect(sanitizeRetention('0.95')).toBe(0.9);
  });
});
