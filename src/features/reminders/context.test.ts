import { daysSinceLastStudy, planInputFrom, totalDue } from './context';
import { DEFAULT_REMINDERS } from './plan';

const NOW = new Date(2026, 9, 23, 10);

describe('contexto do plano', () => {
  it('dias desde o último estudo: 0 hoje, 1 ontem, e quem nunca estudou conta como 1', () => {
    expect(daysSinceLastStudy(['2026-10-23'], NOW)).toBe(0);
    expect(daysSinceLastStudy(['2026-10-22'], NOW)).toBe(1);
    expect(daysSinceLastStudy(['2026-10-18', '2026-10-19'], NOW)).toBe(4);
    expect(daysSinceLastStudy([], NOW)).toBe(1);
  });

  it('conta o que está esperando revisão em todas as áreas', () => {
    const due = { b: 1, due: NOW.getTime() - 1000 };
    const later = { b: 1, due: NOW.getTime() + 86_400_000 };
    expect(totalDue({ srs: { あ: due, い: later, 'nao-existe': due }, vocab: { '学校|jm': due }, conj: {} }, NOW.getTime())).toBe(2);
    expect(totalDue({ srs: {}, vocab: {}, conj: {} }, NOW.getTime())).toBe(0);
  });

  it('monta a entrada do planejador com sequência, descanso e o que já foi estudado hoje', () => {
    const input = planInputFrom(
      { days: ['2026-10-21', '2026-10-22', '2026-10-23'], srs: {}, vocab: {}, conj: {}, restWeekdays: [] },
      { ...DEFAULT_REMINDERS, enabled: true },
      NOW,
    );
    expect(input).toMatchObject({ studiedToday: true, streak: 3, dueCount: 0, daysAway: 0 });
  });
});
