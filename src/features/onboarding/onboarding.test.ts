import { DAILY_GOALS } from '@/features/journey/journey';
import { applyAnswers, canAdvance, dailyGoalFor, DEFAULT_ANSWERS, FEATURES, skipProfile, STEPS } from './onboarding';

describe('introdução do app', () => {
  it('os passos vão do nome ao fim, e só o nome trava o avanço', () => {
    expect(STEPS[0]).toBe('name');
    expect(STEPS.at(-1)).toBe('done');
    expect(canAdvance('name', DEFAULT_ANSWERS)).toBe(false);
    expect(canAdvance('name', { ...DEFAULT_ANSWERS, username: ' Ana ' })).toBe(true);
    for (const step of STEPS.filter((s) => s !== 'name')) expect(canAdvance(step, DEFAULT_ANSWERS)).toBe(true);
  });

  it('a meta de minutos vira uma meta de respostas que existe na jornada', () => {
    for (const minutes of [10, 15, 20, 30, 45]) expect(DAILY_GOALS).toContain(dailyGoalFor(minutes));
    expect(dailyGoalFor(10)).toBe(20);
    expect(dailyGoalFor(20)).toBe(40);
  });

  it('aplica o que foi respondido: perfil, folga, meta e lembretes no horário escolhido', () => {
    const applied = applyAnswers({ username: '  Ana  ', goalMinutes: 20, restDay: 0, reminder: 'normal', timeIndex: 3 });
    expect(applied.profile).toEqual({ username: 'Ana', onboarded: true, goalMinutes: 20 });
    expect(applied.restWeekdays).toEqual([0]);
    expect(applied.reminders).toMatchObject({ enabled: true, risk: true, hour: 20, minute: 0, asked: true });
    const none = applyAnswers({ ...DEFAULT_ANSWERS, username: 'Ana', restDay: null, reminder: 'off' });
    expect(none.restWeekdays).toEqual([]);
    expect(none.reminders.enabled).toBe(false);
    expect(applyAnswers({ ...DEFAULT_ANSWERS, username: 'Ana', reminder: 'light' }).reminders.risk).toBe(false);
  });

  it('pular só marca como feita', () => {
    expect(skipProfile({ username: '', onboarded: false, goalMinutes: 15 })).toEqual({ username: '', onboarded: true, goalMinutes: 15 });
  });

  it('apresenta as funções principais', () => {
    expect(FEATURES.length).toBeGreaterThanOrEqual(5);
    for (const f of FEATURES) expect(f.text.length).toBeGreaterThan(30);
  });
});
