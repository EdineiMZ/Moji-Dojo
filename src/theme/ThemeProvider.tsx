import { createContext, useContext, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { useSettingsStore } from '@/store';
import { lightPalette, paletteFor, type Palette } from './colors';

interface Theme {
  colors: Palette;
  isDark: boolean;
}

const ThemeContext = createContext<Theme>({ colors: lightPalette, isDark: false });

/** Segue o modo claro/escuro do sistema, a não ser que a pessoa tenha escolhido um tema nos Ajustes. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const mode = useSettingsStore((s) => s.themeMode);
  const colorTheme = useSettingsStore((s) => s.colorTheme);
  const isDark = mode === 'system' ? system === 'dark' : mode === 'dark';
  const theme: Theme = { colors: paletteFor(colorTheme, isDark), isDark };
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export const useTheme = (): Theme => useContext(ThemeContext);
