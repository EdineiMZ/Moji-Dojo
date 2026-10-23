import { useEffect } from 'react';
import { AppState } from 'react-native';
import { useProgressStore, useSettingsStore } from '@/store';
import { formatDay } from '@/features/streak/days';
import { planInputFrom } from './context';
import { planReminders } from './plan';
import { cancelAllReminders, permissionState, scheduleReminders, setupNotificationHandler } from './scheduler';

/** Espera depois da última mudança antes de refazer o agendamento (várias respostas seguidas contam como uma). */
const DEBOUNCE_MS = 1500;

/** Refaz o agendamento dos lembretes com o estado de agora. Sem permissão ou desligado, não deixa nada agendado. */
export async function syncRemindersNow(): Promise<number> {
  const settings = useSettingsStore.getState().reminders;
  if (!settings.enabled) {
    await cancelAllReminders();
    return 0;
  }
  if ((await permissionState()) !== 'granted') return 0;
  const p = useProgressStore.getState();
  const today = p.journey.today;
  const input = planInputFrom(
    {
      days: p.days,
      srs: p.srs,
      vocab: p.vocab,
      conj: p.conj,
      restWeekdays: p.journey.restWeekdays,
      profile: useSettingsStore.getState().profile,
      // Os contadores são do dia guardado: se o dia mudou e a pessoa ainda não estudou, hoje vale zero.
      secondsToday: today.day === formatDay(new Date()) ? (today.counts.seconds ?? 0) : 0,
      newToday: today.day === formatDay(new Date()) ? (today.counts.newWords ?? 0) : 0,
    },
    settings,
    new Date(),
  );
  return scheduleReminders(planReminders(input));
}

/**
 * Mantém os lembretes em dia: refaz o agendamento ao abrir, ao ir para o fundo e quando muda o que importa (dias de estudo,
 * dias de descanso ou as preferências). Assim, quem já estudou hoje não recebe o lembrete de hoje.
 */
export function useReminderSync(): void {
  useEffect(() => {
    setupNotificationHandler();
    let timer: ReturnType<typeof setTimeout> | null = null;
    const later = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => void syncRemindersNow().catch(() => undefined), DEBOUNCE_MS);
    };

    later();
    const app = AppState.addEventListener('change', (state) => {
      // Um instante de espera: o contador de tempo grava o que falta ao sair, e o plano precisa dos minutos de hoje já somados.
      if (state === 'background' || state === 'inactive') {
        void syncRemindersNow().catch(() => undefined);
        setTimeout(() => void syncRemindersNow().catch(() => undefined), 600);
      }
      if (state === 'active') later();
    });
    const unsubProgress = useProgressStore.subscribe((s, prev) => {
      if (s.days !== prev.days || s.journey.restWeekdays !== prev.journey.restWeekdays) later();
    });
    const unsubSettings = useSettingsStore.subscribe((s, prev) => {
      if (s.reminders !== prev.reminders || s.profile !== prev.profile) later();
    });
    return () => {
      if (timer) clearTimeout(timer);
      app.remove();
      unsubProgress();
      unsubSettings();
    };
  }, []);
}
