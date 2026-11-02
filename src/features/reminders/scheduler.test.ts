import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useProgressStore, useSettingsStore } from '@/store';
import { formatDay } from '@/features/streak/days';
import { RISK_MESSAGES } from './messages';
import { DEFAULT_REMINDERS, planReminders, type PlannedReminder } from './plan';
import { planInputFrom } from './context';
import { CHANNEL_ID, cancelAllReminders, ensureChannel, permissionState, requestPermission, scheduleReminders, sendTest } from './scheduler';
import { syncRemindersNow } from './useReminderSync';

jest.mock('expo-sqlite/kv-store', () => ({ __esModule: true, default: { getItemSync: () => null, setItemSync: jest.fn(), removeItemSync: jest.fn() } }));
jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  setNotificationChannelAsync: jest.fn(async () => undefined),
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  cancelAllScheduledNotificationsAsync: jest.fn(async () => undefined),
  scheduleNotificationAsync: jest.fn(async () => 'id'),
  AndroidImportance: { DEFAULT: 3 },
  SchedulableTriggerInputTypes: { DATE: 'date', TIME_INTERVAL: 'timeInterval' },
}));

const N = Notifications as unknown as {
  setNotificationChannelAsync: jest.Mock;
  getPermissionsAsync: jest.Mock;
  requestPermissionsAsync: jest.Mock;
  cancelAllScheduledNotificationsAsync: jest.Mock;
  scheduleNotificationAsync: jest.Mock;
};

// Quarta, 21/10/2026, 10:00 (fuso local).
const NOW = new Date(2026, 9, 21, 10, 0);
const reminder = (offsetDays: number): PlannedReminder => ({
  at: new Date(2026, 9, 21 + offsetDays, 19, 0),
  kind: 'daily',
  title: `t${offsetDays}`,
  body: `b${offsetDays}`,
});

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(NOW);
  jest.clearAllMocks();
  (Platform as { OS: string }).OS = 'android';
});
afterEach(() => jest.useRealTimers());

describe('permissão', () => {
  it('concedida, a perguntar de novo ou negada para sempre', async () => {
    N.getPermissionsAsync.mockResolvedValueOnce({ granted: true, canAskAgain: true });
    expect(await permissionState()).toBe('granted');
    N.getPermissionsAsync.mockResolvedValueOnce({ granted: false, canAskAgain: true });
    expect(await permissionState()).toBe('undetermined');
    N.getPermissionsAsync.mockResolvedValueOnce({ granted: false, canAskAgain: false });
    expect(await permissionState()).toBe('denied');
  });

  it('pede a permissão só depois de criar o canal (Android 13+ exige) e não pede de novo se já tem', async () => {
    N.getPermissionsAsync.mockResolvedValue({ granted: true });
    expect(await requestPermission()).toBe(true);
    expect(N.requestPermissionsAsync).not.toHaveBeenCalled();

    N.getPermissionsAsync.mockResolvedValue({ granted: false });
    const order: string[] = [];
    N.setNotificationChannelAsync.mockImplementationOnce(async () => void order.push('canal'));
    N.requestPermissionsAsync.mockImplementationOnce(async () => {
      order.push('pedido');
      return { granted: true };
    });
    expect(await requestPermission()).toBe(true);
    expect(order).toEqual(['canal', 'pedido']);
  });

  it('o canal só existe no Android', async () => {
    await ensureChannel();
    expect(N.setNotificationChannelAsync).toHaveBeenCalledWith(CHANNEL_ID, expect.objectContaining({ name: 'Lembretes de estudo' }));
    N.setNotificationChannelAsync.mockClear();
    (Platform as { OS: string }).OS = 'ios';
    await ensureChannel();
    expect(N.setNotificationChannelAsync).not.toHaveBeenCalled();
  });
});

describe('agendamento', () => {
  it('troca tudo o que estava agendado pelo plano novo, um aviso por data, no canal certo', async () => {
    const count = await scheduleReminders([reminder(0), reminder(1)]);
    expect(count).toBe(2);
    expect(N.cancelAllScheduledNotificationsAsync).toHaveBeenCalledTimes(1);
    expect(N.cancelAllScheduledNotificationsAsync.mock.invocationCallOrder[0]).toBeLessThan(N.scheduleNotificationAsync.mock.invocationCallOrder[0] as number);
    expect(N.scheduleNotificationAsync).toHaveBeenCalledWith({
      content: { title: 't0', body: 'b0', data: { url: '/' } },
      trigger: { type: 'date', date: reminder(0).at, channelId: CHANNEL_ID },
    });
  });

  it('no máximo 40 agendamentos de uma vez', async () => {
    const many = Array.from({ length: 55 }, (_, i) => reminder(i));
    expect(await scheduleReminders(many)).toBe(40);
    expect(N.scheduleNotificationAsync).toHaveBeenCalledTimes(40);
  });

  it('plano vazio apaga o que havia e não agenda nada', async () => {
    expect(await scheduleReminders([])).toBe(0);
    expect(N.cancelAllScheduledNotificationsAsync).toHaveBeenCalledTimes(1);
    expect(N.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it('cancelar tudo e a notificação de teste (3 segundos)', async () => {
    await cancelAllReminders();
    expect(N.cancelAllScheduledNotificationsAsync).toHaveBeenCalledTimes(1);
    await sendTest();
    expect(N.scheduleNotificationAsync).toHaveBeenCalledWith(expect.objectContaining({ trigger: { type: 'timeInterval', seconds: 3, channelId: CHANNEL_ID } }));
  });
});

describe('syncRemindersNow (o que o app faz ao abrir, ao ir para o fundo e ao estudar)', () => {
  const setReminders = (change: Partial<typeof DEFAULT_REMINDERS>) =>
    useSettingsStore.getState().setReminders({ ...DEFAULT_REMINDERS, enabled: true, ...change });
  const titles = (): string[] => N.scheduleNotificationAsync.mock.calls.map((c) => c[0].content.title as string);
  const riskTitles = (streak: number): string[] => RISK_MESSAGES.map((m) => m(streak).title);
  const scheduledAt = (): Date[] => N.scheduleNotificationAsync.mock.calls.map((c) => c[0].trigger.date as Date);

  beforeEach(() => {
    useProgressStore.setState({ days: [] });
    // Sem meta de minutos: o lembrete de hoje some assim que há estudo no dia (com meta, só quando a meta é batida).
    useSettingsStore.getState().setProfile({ goalMinutes: 0 });
    setReminders({ hour: 19, minute: 0, risk: true });
    N.getPermissionsAsync.mockResolvedValue({ granted: true });
  });

  it('desligado: cancela tudo e não agenda', async () => {
    setReminders({ enabled: false });
    expect(await syncRemindersNow()).toBe(0);
    expect(N.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
    expect(N.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it('sem permissão: não agenda nada', async () => {
    N.getPermissionsAsync.mockResolvedValue({ granted: false, canAskAgain: false });
    expect(await syncRemindersNow()).toBe(0);
    expect(N.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it('ligado e com permissão: agenda o lembrete das 19h de hoje em diante', async () => {
    const count = await syncRemindersNow();
    expect(count).toBeGreaterThan(0);
    expect(scheduledAt()[0]).toEqual(new Date(2026, 9, 21, 19, 0));
    expect(scheduledAt().every((d) => d.getTime() > NOW.getTime())).toBe(true);
  });

  it('quem já estudou hoje não recebe o lembrete de hoje', async () => {
    useProgressStore.setState({ days: [formatDay(NOW)] });
    await syncRemindersNow();
    expect(scheduledAt().some((d) => d.getDate() === 21 && d.getHours() === 19)).toBe(false);
  });

  it('o horário escolhido nos Ajustes é o do aviso, e o silêncio empurra para o fim dele', async () => {
    setReminders({ hour: 21, minute: 30, quietFrom: 23, quietTo: 8 });
    await syncRemindersNow();
    expect(scheduledAt()[0]).toEqual(new Date(2026, 9, 21, 21, 30));
    N.scheduleNotificationAsync.mockClear();
    setReminders({ hour: 23, minute: 0, quietFrom: 22, quietTo: 8 });
    await syncRemindersNow();
    expect(scheduledAt()[0]).toEqual(new Date(2026, 9, 22, 8, 0));
  });

  it('sequência de 1 dia sem estudo hoje ganha o aviso de risco da noite (protege a sequência)', async () => {
    useProgressStore.setState({ days: [formatDay(new Date(2026, 9, 20))] });
    await syncRemindersNow();
    const risk = N.scheduleNotificationAsync.mock.calls.filter((c) => riskTitles(1).includes(c[0].content.title as string));
    expect(risk).toHaveLength(1);
    expect(risk[0][0].trigger.date).toEqual(new Date(2026, 9, 21, 21, 0)); // 2 h depois do lembrete das 19h, antes do silêncio das 22h
    expect(risk[0][0].content.title).not.toMatch(/1 dias/);
  });

  it('sem sequência (nunca estudou), não há aviso de risco', async () => {
    await syncRemindersNow();
    const all = [0, 1, 2].flatMap((n) => riskTitles(n));
    expect(titles().some((t) => all.includes(t))).toBe(false);
  });

  it('com o aviso desligado nos Ajustes, nem a sequência de 5 dias ganha o da noite', async () => {
    useProgressStore.setState({ days: ['2026-10-16', '2026-10-17', '2026-10-18', '2026-10-19', '2026-10-20'] });
    setReminders({ risk: false });
    await syncRemindersNow();
    expect(titles().some((t) => riskTitles(5).includes(t))).toBe(false);
  });

  it('virada do dia: depois da meia-noite o plano é refeito a partir do dia novo', async () => {
    jest.setSystemTime(new Date(2026, 9, 22, 0, 10));
    await syncRemindersNow();
    expect(scheduledAt()[0]).toEqual(new Date(2026, 9, 22, 19, 0));
  });

  it('o que foi agendado é o que o planejador montou com o progresso de agora', async () => {
    const p = useProgressStore.getState();
    const expected = planReminders(
      planInputFrom(
        { days: p.days, srs: p.srs, vocab: p.vocab, conj: p.conj, restWeekdays: p.journey.restWeekdays, profile: useSettingsStore.getState().profile, secondsToday: 0, newToday: 0 },
        useSettingsStore.getState().reminders,
        new Date(),
      ),
    );
    await syncRemindersNow();
    expect(scheduledAt()).toEqual(expected.slice(0, 40).map((r) => r.at));
  });
});
