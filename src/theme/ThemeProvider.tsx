import { createContext, useContext, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { darkPalette, lightPalette, type Palette } from './colors';

interface Theme {
  colors: Palette;
  isDark: boolean;
}

const ThemeContext = createContext<Theme>({ colors: lightPalette, isDark: false });

/** Segue o modo claro/escuro do sistema. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const isDark = useColorScheme() === 'dark';
  const theme: Theme = { colors: isDark ? darkPalette : lightPalette, isDark };
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export const useTheme = (): Theme => useContext(ThemeContext);
