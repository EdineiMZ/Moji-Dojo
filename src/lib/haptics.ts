import * as Haptics from 'expo-haptics';

/** Vibração leve de acerto/erro. Falhas (aparelho sem vibrador) são ignoradas. */
const safe = (run: () => Promise<void>): void => {
  run().catch(() => undefined);
};

export const hapticSuccess = (): void => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
export const hapticError = (): void => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
export const hapticLight = (): void => safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
