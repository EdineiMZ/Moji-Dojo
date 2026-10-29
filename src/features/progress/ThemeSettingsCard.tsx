import { AppText, Card, SegmentedControl } from '@/components';
import { useSettingsStore } from '@/store';
import type { ThemeMode } from '@/store/settingsStore';
import { COLOR_THEMES, type ColorTheme } from '@/theme';

export const THEME_OPTIONS = [
  { value: 'system' as const, label: 'Automático' },
  { value: 'light' as const, label: 'Claro' },
  { value: 'dark' as const, label: 'Escuro' },
];

/** Ajustes: tema claro, escuro ou automático (o do sistema). */
export function ThemeSettingsCard() {
  const themeMode = useSettingsStore((s) => s.themeMode);
  const setThemeMode = useSettingsStore((s) => s.setThemeMode);
  const colorTheme = useSettingsStore((s) => s.colorTheme);
  const setColorTheme = useSettingsStore((s) => s.setColorTheme);

  return (
    <Card enterIndex={1}>
      <AppText variant="title">Tema</AppText>
      <SegmentedControl<ThemeMode> options={THEME_OPTIONS} value={themeMode} onChange={setThemeMode} />
      <AppText variant="caption" color="muted">
        Automático segue o modo claro ou escuro do seu celular.
      </AppText>
      <AppText variant="title">Cores</AppText>
      <SegmentedControl<ColorTheme> options={COLOR_THEMES.map((t) => ({ value: t.id, label: `${t.emoji} ${t.label}` }))} value={colorTheme} onChange={setColorTheme} />
      <AppText variant="caption" color="muted">
        Cada cor tem a versão clara e a escura. O Mochi e os itens da loja mantêm as cores deles.
      </AppText>
    </Card>
  );
}
