import { streakDays } from '@/features/streak/days';
import { emptyJourney, pushToast } from './journey';
import { applyRescue, daysAway, declineRescue, lastStudyDayBefore, missedDays, rescueOffer, rescuePassed, resolveRescue } from './rescue';

// Sexta-feira, 23/10/2026.
const NOW = new Date(2026, 9, 23, 10);
const run = (...days: string[]) => days;
const ENDS_MON = run('2026-10-17', '2026-10-18', '2026-10-19'); // sáb, dom, seg (3 dias)

describe('dias perdidos', () => {
  it('acha o último dia estudado e os dias sem estudo até hoje', () => {
    expect(lastStudyDayBefore(ENDS_MON, NOW)).toBe('2026-10-19');
    expect(missedDays(ENDS_MON, NOW)).toEqual(['2026-10-20', '2026-10-21', '2026-10-22']);
    expect(missedDays(['2026-10-22'], NOW)).toEqual([]);
    expect(missedDays([], NOW)).toEqual([]);
  });

  it('dias de descanso não contam como perdidos', () => {
    // 20/10 é terça (2), 21/10 quarta (3).
    expect(missedDays(ENDS_MON, NOW, [2])).toEqual(['2026-10-21', '2026-10-22']);
  });

  it('daysAway mede a pausa sem contar o dia de hoje nem o de ontem', () => {
    expect(daysAway(['2026-10-22'], NOW)).toBe(0);
    expect(daysAway(['2026-10-21'], NOW)).toBe(1);
    expect(daysAway(['2026-10-16'], NOW)).toBe(6);
    expect(daysAway([], NOW)).toBe(0);
  });
});

describe('oferta de resgate', () => {
  it('aparece quando se perdem de 1 a 3 dias de uma sequência de 3 ou mais', () => {
    const offer = rescueOffer(ENDS_MON, NOW, emptyJourney());
    expect(offer).toEqual({ day: '2026-10-23', missed: ['2026-10-20', '2026-10-21', '2026-10-22'], broken: 3 });
  });

  it('não aparece se a sequência era curta, se perdeu mais de 3 dias ou se já estudou hoje', () => {
    expect(rescueOffer(['2026-10-18', '2026-10-19'], NOW, emptyJourney())).toBeNull();
    expect(rescueOffer(['2026-10-12', '2026-10-13', '2026-10-14'], NOW, emptyJourney())).toBeNull();
    expect(rescueOffer([...ENDS_MON, '2026-10-23'], NOW, emptyJourney())).toBeNull();
    expect(rescueOffer([], NOW, emptyJourney())).toBeNull();
  });

  it('respeita a espera de uma semana depois de um resgate', () => {
    const recent = { ...emptyJourney(), lastRescueAt: NOW.getTime() - 3 * 86_400_000 };
    expect(rescueOffer(ENDS_MON, NOW, recent)).toBeNull();
    const old = { ...emptyJourney(), lastRescueAt: NOW.getTime() - 8 * 86_400_000 };
    expect(rescueOffer(ENDS_MON, NOW, old)).not.toBeNull();
  });

  it('uma oferta aberta hoje continua a mesma, mesmo depois de hoje ser marcado', () => {
    const offer = rescueOffer(ENDS_MON, NOW, emptyJourney());
    if (!offer) throw new Error('sem oferta');
    const open = { ...emptyJourney(), rescue: offer };
    expect(rescueOffer([...ENDS_MON, '2026-10-23'], NOW, open)).toBe(offer);
  });
});

describe('resolver o resgate', () => {
  const offer = { day: '2026-10-23', missed: ['2026-10-20', '2026-10-21', '2026-10-22'], broken: 3 };

  it('aplicar preenche os dias perdidos e a sequência volta a contar', () => {
    const days = applyRescue([...ENDS_MON, '2026-10-23'], offer);
    expect(days).toEqual(['2026-10-17', '2026-10-18', '2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23']);
    expect(streakDays(days, NOW)).toBe(7);
    expect(streakDays([...ENDS_MON, '2026-10-23'], NOW)).toBe(1);
  });

  it('o limite de dias guardados é respeitado, mantendo os mais novos', () => {
    expect(applyRescue(['2026-10-01', '2026-10-19'], offer, 3)).toEqual(['2026-10-20', '2026-10-21', '2026-10-22']);
  });

  it('70% ou mais salva; menos não', () => {
    expect(rescuePassed(18, 25)).toBe(true);
    expect(rescuePassed(17, 25)).toBe(false);
    expect(rescuePassed(0, 0)).toBe(false);
  });

  it('aprovado: conta, avisa, fecha a oferta e marca a espera', () => {
    const state = resolveRescue({ ...emptyJourney(), rescue: offer }, true, NOW);
    expect(state.rescue).toBeNull();
    expect(state.lastRescueAt).toBe(NOW.getTime());
    expect(state.counters.rescues).toBe(1);
    expect(state.toasts.at(-1)?.title).toBe('Sequência salva!');
  });

  it('reprovado: fecha a oferta sem espera e sem cobrança', () => {
    const state = resolveRescue({ ...emptyJourney(), rescue: offer }, false, NOW);
    expect(state.rescue).toBeNull();
    expect(state.lastRescueAt).toBeNull();
    expect(state.toasts.at(-1)?.title).toBe('Tudo bem recomeçar');
  });

  it('sem oferta aberta não faz nada; recusar fecha a oferta', () => {
    const idle = pushToast(emptyJourney(), 'petals', 'x', 'y');
    expect(resolveRescue(idle, true, NOW)).toBe(idle);
    expect(declineRescue({ ...emptyJourney(), rescue: offer }).rescue).toBeNull();
  });
});

describe('sequência com dias de descanso', () => {
  it('dia de descanso sem estudo não quebra a sequência e não conta', () => {
    // Estudou seg, ter, qui, sex (21/10 quarta foi descanso, hoje é sexta e já estudou).
    const days = ['2026-10-19', '2026-10-20', '2026-10-22', '2026-10-23'];
    expect(streakDays(days, NOW)).toBe(2);
    expect(streakDays(days, NOW, [3])).toBe(4);
  });

  it('hoje ainda sem estudo e ontem de descanso: a contagem segue do dia anterior', () => {
    const days = ['2026-10-20', '2026-10-21'];
    expect(streakDays(days, NOW, [5, 4])).toBe(2);
    expect(streakDays(days, NOW)).toBe(0);
  });

  it('descanso em todos os dias da semana é ignorado (senão a contagem não terminaria)', () => {
    expect(streakDays(['2026-10-23'], NOW, [0, 1, 2, 3, 4, 5, 6])).toBe(1);
  });
});
