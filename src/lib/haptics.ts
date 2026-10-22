import * as Haptics from 'expo-haptics';
import { isHapticsOn } from './feedbackPrefs';

/** Vibração leve de acerto/erro. Respeita o interruptor de Ajustes; falhas (sem vibrador) são ignoradas. */
const safe = (run: () => Promise<void>): void => {
  if (!isHapticsOn()) return;
  run().catch(() => undefined);
};

export const hapticSuccess = (): void => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
export const hapticError = (): void => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
export const hapticLight = (): void => safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
