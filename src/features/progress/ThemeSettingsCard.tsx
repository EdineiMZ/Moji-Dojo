import { AppText, Card, SegmentedControl } from '@/components';
import { useSettingsStore } from '@/store';
import type { ThemeMode } from '@/store/settingsStore';

export const THEME_OPTIONS = [
  { value: 'system' as const, label: 'Automático' },
  { value: 'light' as const, label: 'Claro' },
  { value: 'dark' as const, label: 'Escuro' },
];

/** Ajustes: tema claro, escuro ou automático (o do sistema). */
export function ThemeSettingsCard() {
  const themeMode = useSettingsStore((s) => s.themeMode);
  const setThemeMode = useSettingsStore((s) => s.setThemeMode);

  return (
    <Card enterIndex={1}>
      <AppText variant="title">Tema</AppText>
      <SegmentedControl<ThemeMode> options={THEME_OPTIONS} value={themeMode} onChange={setThemeMode} />
      <AppText variant="caption" color="muted">
        Automático segue o modo claro ou escuro do seu celular.
      </AppText>
    </Card>
  );
}
