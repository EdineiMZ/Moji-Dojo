import { SegmentedControl, AppText, PressableScale } from '@/components';
import { fonts, radii, spacing, useTheme } from '@/theme';
import { useSettingsStore } from '@/store';
import type { SpeechSpeed } from '@/store/settingsStore';

const OPTIONS = [
  { value: 'normal' as const, label: 'Velocidade normal' },
  { value: 'slow' as const, label: 'Devagar' },
];

/** Escolha da velocidade da voz japonesa (Ajustes → Voz japonesa); fica salva. */
export function SpeedControl() {
  const speed = useSettingsStore((s) => s.speechSpeed);
  const setSpeed = useSettingsStore((s) => s.setSpeechSpeed);
  return <SegmentedControl<SpeechSpeed> options={OPTIONS} value={speed} onChange={setSpeed} />;
}

/** Atalho de uma linha ao lado do título das telas que tocam áudio: toca para alternar normal e devagar. */
export function SpeedPill() {
  const { colors } = useTheme();
  const speed = useSettingsStore((s) => s.speechSpeed);
  const setSpeed = useSettingsStore((s) => s.setSpeechSpeed);
  const slow = speed === 'slow';
  return (
    <PressableScale
      accessibilityRole="switch"
      accessibilityLabel="Voz devagar"
      accessibilityState={{ checked: slow }}
      onPress={() => setSpeed(slow ? 'normal' : 'slow')}
      haptic
      hitSlop={4}
      style={{
        minHeight: 48,
        justifyContent: 'center',
        borderRadius: radii.pill,
        borderWidth: 1.5,
        paddingHorizontal: spacing.md,
        backgroundColor: slow ? colors.primary : colors.surface,
        borderColor: slow ? colors.primary : colors.line,
      }}
    >
      <AppText color={slow ? 'onPrimary' : 'ink'} style={{ fontFamily: fonts.bold }}>
        {slow ? '🐢 Devagar' : 'Voz normal'}
      </AppText>
    </PressableScale>
  );
}
