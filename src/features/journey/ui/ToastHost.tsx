import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp, ReduceMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, PressableScale } from '@/components';
import { useProgressStore } from '@/store';
import { fonts, radii, spacing, useTheme } from '@/theme';
import type { ToastKind } from '../journey';

const ICONS: Readonly<Record<ToastKind, string>> = {
  achievement: '🏆',
  level: '⭐',
  item: '🎁',
  petals: '🌸',
  mission: '✅',
  week: '🧺',
  streak: '🔥',
};

/** Quanto tempo um aviso fica na tela antes de sair sozinho. */
const SHOW_MS = 4500;

/**
 * Mostra, um de cada vez, os avisos da jornada (conquista, nível, item, missão...). Toque para fechar. Fica por cima do
 * app todo, logo abaixo da barra de status.
 */
export function ToastHost() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const toast = useProgressStore((s) => s.journey.toasts[0]);
  const dismiss = useProgressStore((s) => s.dismissJourneyToast);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => dismiss(toast.id), SHOW_MS);
    return () => clearTimeout(id);
  }, [toast, dismiss]);

  if (!toast) return null;
  return (
    <View pointerEvents="box-none" style={[styles.host, { top: insets.top + spacing.sm }]}>
      <Animated.View
        key={toast.id}
        entering={FadeInUp.duration(240).reduceMotion(ReduceMotion.System)}
        exiting={FadeOutUp.duration(200).reduceMotion(ReduceMotion.System)}
      >
        <PressableScale
          accessibilityRole="alert"
          accessibilityLabel={`${toast.title}. ${toast.text}`}
          accessibilityLiveRegion="polite"
          onPress={() => dismiss(toast.id)}
          style={[styles.toast, { backgroundColor: colors.surface, borderColor: colors.primary }]}
        >
          <AppText style={styles.icon}>{ICONS[toast.kind]}</AppText>
          <View style={styles.text}>
            <AppText style={styles.title}>{toast.title}</AppText>
            <AppText variant="caption" color="muted">
              {toast.text}
            </AppText>
          </View>
        </PressableScale>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: { position: 'absolute', left: spacing.lg, right: spacing.lg, zIndex: 50 },
  toast: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderWidth: 2, borderRadius: radii.lg, padding: spacing.md, minHeight: 64 },
  icon: { fontSize: 28, lineHeight: 36 },
  text: { flex: 1, gap: 2 },
  title: { fontFamily: fonts.bold, fontSize: 16 },
});
