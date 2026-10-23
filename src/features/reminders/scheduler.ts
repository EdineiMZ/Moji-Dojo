import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import type { PlannedReminder } from './plan';

/** Canal das notificações no Android (o nome aparece nos ajustes do sistema). */
export const CHANNEL_ID = 'lembretes';

/** Limite de agendamentos de uma vez (o plano já é bem menor que isso). */
const MAX_SCHEDULED = 40;

/** Mostra a notificação mesmo com o app aberto (por padrão o Android a esconderia). */
export function setupNotificationHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }),
  });
}

export async function ensureChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Lembretes de estudo',
    description: 'Avisos do Mochi para estudar um pouco por dia.',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

export type PermissionState = 'granted' | 'denied' | 'undetermined';

export async function permissionState(): Promise<PermissionState> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return 'granted';
  return current.canAskAgain ? 'undetermined' : 'denied';
}

/** Pede a permissão (o canal precisa existir antes, senão o Android 13+ não mostra o pedido). */
export async function requestPermission(): Promise<boolean> {
  await ensureChannel();
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const result = await Notifications.requestPermissionsAsync();
  return result.granted;
}

export async function cancelAllReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/** Troca tudo o que estava agendado pelo plano novo. Devolve quantos lembretes ficaram agendados. */
export async function scheduleReminders(plan: readonly PlannedReminder[]): Promise<number> {
  await ensureChannel();
  await Notifications.cancelAllScheduledNotificationsAsync();
  let scheduled = 0;
  for (const reminder of plan.slice(0, MAX_SCHEDULED)) {
    await Notifications.scheduleNotificationAsync({
      content: { title: reminder.title, body: reminder.body, data: { url: '/' } },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: reminder.at, channelId: CHANNEL_ID },
    });
    scheduled++;
  }
  return scheduled;
}

/** Uma notificação de teste, em poucos segundos. */
export async function sendTest(): Promise<void> {
  await ensureChannel();
  await Notifications.scheduleNotificationAsync({
    content: { title: 'Mochi chamando 🌸', body: 'Está funcionando! É assim que os lembretes vão aparecer.' },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 3, channelId: CHANNEL_ID },
  });
}
